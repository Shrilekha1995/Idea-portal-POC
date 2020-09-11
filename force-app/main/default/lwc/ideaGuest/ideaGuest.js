import { LightningElement,wire,track ,api} from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import Name_FIELD from '@salesforce/schema/Idea__c.Name';
import Technology__c_FIELD from '@salesforce/schema/Idea__c.Technology__c';
import Description__c_FIELD from '@salesforce/schema/Idea__c.Description__c';
import empId__c_FIELD from '@salesforce/schema/Idea__c.empId__c';
import employeeIdExist from '@salesforce/apex/Project_Idea_Lightning.employeeIdExist';
import getProjectIdeas from '@salesforce/apex/Project_Idea_Lightning.getProjectIdeas';
import Status_c_FIELD from '@salesforce/schema/Idea__c.Status__c';
import { CurrentPageReference } from 'lightning/navigation';
import searchIdeaByName from '@salesforce/apex/Project_Idea_Lightning.searchIdeaByName';
import { refreshApex } from '@salesforce/apex';
import myIdeas from '@salesforce/apex/Project_Idea_Lightning.myIdeas';
import authenticate from '@salesforce/apex/Project_Idea_Lightning.authenticate';
import getRejectedIdeas from '@salesforce/apex/Project_Idea_Lightning.getRejectedIdeas';
import getTasks from '@salesforce/apex/Project_Idea_Lightning.getTasks';
import getApprovedIdeas from '@salesforce/apex/Project_Idea_Lightning.getApprovedIdeas';
import getScoreBoard from '@salesforce/apex/Project_Idea_Lightning.getScoreBoard';





import {   registerListener,
    unregisterListener,
    unregisterAllListeners,
    fireEvent } from 'c/pubsub';

const actions= [
    { label : 'Show details', name: 'show_details'},
   
 
   
    { label : 'Feedback', name: 'Comments'},
    { label: 'Edit', name: 'edit'}
    
];
export default class IdeaGuest extends LightningElement {
    password='';
    @api editrecordId;
    @track openmodel = false;
    myideas='';
    ideas='';
    Searchkey='';
    rejectedflag=false;
    approvedflag=false;
    scoreflag=false;
    taskflag=false;
    @wire(CurrentPageReference) pageRef;
    @wire(getProjectIdeas,{SearchKey:'$Searchkey'})ideas; 
    @wire(myIdeas,{employeeId:'$empId'})myideas;
    @wire(getRejectedIdeas)rejectedIdeas; 
    @wire(getApprovedIdeas)approvedIdeas;
    @wire(getTasks,{employeeId:'$empId'})tasks;
    @wire(getScoreBoard)scores;

    createflag=false;
    flag=false;
    fileflag=false;
    uploadbutton=false;




    
    fields = [Name_FIELD,Description__c_FIELD,empId__c_FIELD,Technology__c_FIELD];
     recordId;
     empId='';
     optionflag=false;
     showideaflag=false;
     
     checkId=true;
     Name='';
     @wire(CurrentPageReference) pageRef;
     MAX_FILE_SIZE = 1000;//1KB


     scorecolumn=[{
        label: 'Name',
        fieldName: 'Name',
        type: 'text'
        

    },
    {
        label: 'Submitted By',
        fieldName: 'Submitter_Name__c',
        type: 'text'
       
    },
    {
        label: 'Score',
        fieldName: 'Score__c',
        type: 'text'
       
    }
];

     columntask=[{
        label: 'Name',
        fieldName: 'Name',
        type: 'text'
        

    },
    {
        label: 'Start Date',
        fieldName: 'Start_Date__c',
        type: 'date'
       
    },
    {
        label: 'End Date',
        fieldName: 'End_Date__c',
        type: 'Date'
       
    },
    {
        label: 'Priority',
        fieldName: 'Priority__c',
        type: 'text'
       
    },
    {
        label: 'Status',
        fieldName: 'Status__c',
        type: 'text'
       
    },
    {
        label: 'Project',
        fieldName: 'Project__c',
        type: 'text'
       
    }
     ];

     ApprovedIdeacolumn=[

        {
            label: 'Project Idea Name',
            fieldName: 'Name',
            type: 'text',
            wrapText: true
            
    
        },
        {
            label: 'Submitted By',
            fieldName: 'Submitter_Name__c',
            type: 'text'
           
        },
        {
            label: 'Technology',
            fieldName: 'Technology__c',
            type: 'text'
           
        },
        {
            label: 'Score',
            fieldName: 'Score__c',
            type: 'text'
           
        },
    
        {
            label: 'Status',
            fieldName: 'Status__c',
            type: 'text'
           
        },{
    
            label: 'Project Details',
            fieldName: 'Project_Details__c',
            type: 'text',
            wrapText: true
    
        },
        {
            label: '',
        type : 'action',
        typeAttributes: {rowActions: actions}
    }

     ];

     RejectIdeacolumns=[{
        label: 'Project Idea Name',
        fieldName: 'Name',
        type: 'text'
        

    },
    {
        label: 'Submitted By',
        fieldName: 'Submitter_Name__c',
        type: 'text'
       
    },
    {
        label: 'Technology',
        fieldName: 'Technology__c',
        type: 'text'
       
    },
    {
        label: 'Score',
        fieldName: 'Score__c',
        type: 'text'
       
    },

    {
        label: 'Status',
        fieldName: 'Status__c',
        type: 'text'
       
    },{

        label: 'Reason',
        fieldName: 'Reason__c',
        type: 'text',
        wrapText: true

    },
    {
        label: '',
    type : 'action',
    typeAttributes: {rowActions: actions}
}
  
];



     columns = [{
        label: 'Project Idea Name',
        fieldName: 'Name',
        type: 'text'
        

    },
    {
        label: 'Submitted By',
        fieldName: 'Submitter_Name__c',
        type: 'text'
       
    },
    {
        label: 'Technology',
        fieldName: 'Technology__c',
        type: 'text'
       
    },
    {
        label: 'Score',
        fieldName: 'Score__c',
        type: 'text'
       
    },

    {
        label: 'Status',
        fieldName: 'Status__c',
        type: 'text'
       
    },
    {
        label: '',
    type : 'action',
    typeAttributes: {rowActions: actions}
}
  
];


refreshingApex(){
    return refreshApex(this.ideas);
}

refreshMyIdea(){
    return refreshApex(this.myideas);
}

checkpassword(event){
    this.password=event.target.value;

}



connectedCallback(){
        
    /*getProjectIdeas({'employeeId':empId}).then((data)=>{
        console.log('data'+JSON.stringify(data));
        this.ideas=data;
    }).catch((err)=>{
        console.log('err'+err.body.message);
    })*/
}
backtomenu(){
    this.flag=false;
    this.optionflag=true;
}

onComment(event){
    this.comment=event.target.value;
}
handlerejectedideas(){

}
rowHandler(event){


    console.log("in row handler method"+event.detail.action.name);
    console.log("object id-----"+event.detail.row.Id);
   
             



if(event.detail.action.name=='show_details'){
   console.log('in show detail action'+ event.detail.row.Id);
   const obj={'pid':event.detail.row.Id,'empid':this.empId};
   console.log(JSON.stringify(obj));
    fireEvent(this.pageRef,'appEventGuest',obj);
    fireEvent(this.pageRef,'hidecomment',event.detail.row.Id);
    
      
}



/*if(event.detail.action.name=='review'){

    fireEvent(this.pageRef,'showReview',event.detail.row.Id);
   
    
    
      
}
*/

if(event.detail.action.name=='Comments'){
    const obj1={'pid':event.detail.row.Id,'empid':this.empId};
    fireEvent(this.pageRef,'commentEvent',obj1);
    fireEvent(this.pageRef,'hidereview',event.detail.row.Id);
    
      
}  

if(event.detail.action.name=='edit'){
this.editrecordId = event.detail.row.Id;
this.openmodel = true;
}




    
}

handleNameSearch(){
    console.log('in handle name search'+this.Name);
  
    searchIdeaByName({'Name':this.Name}).then((data)=>{
      console.log('data'+JSON.stringify(data));
      this.ideas.data=data;
  }).catch((err)=>{
      console.log('err'+err.body.message);
  })

}

handleApprovedNameSearch(){

}

handleName(event)
{
  this.Name=event.target.value;
}
onCreate(){
        this.flag=true;
  
        this.optionflag=false;
        this.showideaflag=false;
        this.taskflag=false;
        this.rejectedflag=false;
        this.approvedflag=false;
        this.scoreflag=false;
    }
    get acceptedFormats() {
        return ['.pdf', '.png','.jpg','.jpeg'];
    }

    checkEmployeeId(event){
   this.empId=event.target.value;


    }

    checkemp(){
        
        console.log('in check emp'+this.empId);
      /*  employeeIdExist({'empId':this.empId}).then((response)=>{
            console.log(JSON.stringify(response));
            this.optionflag=true;
            this.checkId=false;
/**get ideas */
      /*        getProjectIdeas({'employeeId':this.empId}).then((data)=>{
        console.log('data'+JSON.stringify(data));
        this.ideas=data;
    }).catch((err)=>{
        console.log('err'+err.body.message);
    })
    /**end get ideas 
      }).catch((err)=>{
          console.log('err'+err.body.message);

          const evt = new ShowToastEvent({
            title: 'Error',
            message: 'Employee Id does not exist',
            variant: 'error',
            mode: 'dismissable'
        });
        this.dispatchEvent(evt);

      })*/

      let emp= { 'sobjectType': 'Employee__c' };
      emp.Employee_ID__c= this.empId;
       emp.Password__c=this.password;
       
        console.log('emp'+JSON.stringify(emp));

        authenticate({newemp:emp}).then((response)=>{
            console.log(JSON.stringify(response));
            if(response==null){
                throw new Error('Employee ID or password does not match');
            }
            this.optionflag=true;
            this.checkId=false;
        }).catch((err)=>{
           // console.log('err'+err.body.message);
  
            const evt = new ShowToastEvent({
              title: 'Error',
              message: 'Employee ID or password does not match',
              variant: 'error',
              mode: 'dismissable'
          });
          this.dispatchEvent(evt);
  
        })

    }
    handleUploadFinished(event) {
        this.fileflag=false;
        this.uploadbutton=false;
        this.optionflag=true;
        // Get the list of uploaded files
        const uploadedFiles = event.detail.files;
        let uploadedFileNames = '';
        for(let i = 0; i < uploadedFiles.length; i++) {
            uploadedFileNames += uploadedFiles[i].name + ', ';
        }
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Success',
                message: uploadedFiles.length + ' Files uploaded Successfully: ' + uploadedFileNames,
                variant: 'success',
            }),
        );
    }

    handlemyIdeas(){

        myIdeas({'employeeId':empId}).then((data)=>{
            console.log('data'+JSON.stringify(data));
            this.myideas=data;
        }).catch((err)=>{
            console.log('err'+err.body.message);
        })



    }



    handleSuccess(event) {



        this.flag=false;
        this.uploadbutton=true;
        this.recordId=event.detail.id;
        this.createflag=false;
        const evt = new ShowToastEvent({
            title: "Project Idea created succesfully",
           
            variant: "success"
        });
        this.dispatchEvent(evt);
        this.refreshingApex();
    }

    cancel(){
        this.uploadbutton=false;
        this.optionflag=true;
        this.fileflag=false;
    }

    uploadDocument(){
        this.fileflag=true;
    }

    showIdeas(){
        this.refreshingApex();
      //  this.optionflag=true;
        this.showideaflag=true;
        this.approvedflag=false;
        this.rejectedflag=false;
        this.taskflag=false;
        this.scoreflag=false;

    }

    handlemytasks(){

        refreshApex(this.tasks);
       // this.optionflag=false;
        this.taskflag=true;
        this.rejectedflag=false;
        this.approvedflag=false;
        this.showideaflag=false;
        this.scoreflag=false;
    

    }
handlerejectedideas(){
    refreshApex(this.rejectedIdeas);
   // this.optionflag=false;
    this.rejectedflag=true;
    this.approvedflag=false;
    this.showideaflag=false;
    this.taskflag=false;
    this.scoreflag=false;


}

handlescoreboard(){
    this.rejectedflag=false;
    this.approvedflag=false;
    this.showideaflag=false;
    this.taskflag=false;
    this.scoreflag=true;
    refreshApex(this.scores);
}
handleapprovedIdeas(){
    refreshApex(this.approvedIdeas);
    this.approvedflag=true;
    this.rejectedflag=false;
    this.showideaflag=false;
    this.taskflag=false;
    this.scoreflag=false;

}
    closeModal() {
        this.openmodel = false;
        this.refreshingApex();
    }
    submitDetails() {
        console.log(this.iname+this.ides);
        this.isModalOpen = false;
        updateIdeas(recordId,this.iname,this.ides).then().catch(error=>{
            console.error('Error' + error);
        })
    }

}
