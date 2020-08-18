import { LightningElement,wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import Name_FIELD from '@salesforce/schema/Idea__c.Name';
//import Technology__c_FIELD from '@salesforce/schema/Project_Idea__c.Technology__c';
import Description__c_FIELD from '@salesforce/schema/Idea__c.Description__c';
import Employee__c_FIELD from '@salesforce/schema/Idea__c.Employee__c';
import employeeIdExist from '@salesforce/apex/Project_Idea_Lightning.employeeIdExist';
import getProjectIdeas from '@salesforce/apex/Project_Idea_Lightning.getProjectIdeas';
import Status_c_FIELD from '@salesforce/schema/Idea__c.Status__c';
import { CurrentPageReference } from 'lightning/navigation';
import {   registerListener,
    unregisterListener,
    unregisterAllListeners,
    fireEvent } from 'c/pubsub';

const actions= [
    { label : 'Show details', name: 'show_details'},
   
 
   
    { label : 'Comments', name: 'Comments'}
];
export default class IdeaGuest extends LightningElement {
    @wire(CurrentPageReference) pageRef;
    createflag=false;
    flag=false;
    fileflag=false;
    uploadbutton=false;
    fields = [Name_FIELD,Description__c_FIELD];
     recordId;
     empId='';
     optionflag=false;
     showideaflag=false;
     ideas;
     checkId=true;
     Name='';
     @wire(CurrentPageReference) pageRef;

     columns = [{
        label: 'Project Idea Name',
        fieldName: 'Name',
        type: 'text',
        sortable: true

    },
    {
        label: 'Status',
        fieldName: 'Status__c',
        type: 'text',
        sortable: true
    },
    {
        label: 'Actions',
    type : 'action',
    typeAttributes: {rowActions: actions}
}
  
];

connectedCallback(){
        
    /*getProjectIdeas({'employeeId':empId}).then((data)=>{
        console.log('data'+JSON.stringify(data));
        this.ideas=data;
    }).catch((err)=>{
        console.log('err'+err.body.message);
    })*/
}


onComment(event){
    this.comment=event.target.value;
}

rowHandler(event){


    console.log("in row handler method"+event.detail.action.name);
    console.log("object id-----"+event.detail.row.Id);
   
             



if(event.detail.action.name=='show_details'){
   console.log('in show detail action'+ event.detail.row.Id);
   const obj={'pid':event.detail.row.Id,'empid':this.empId};
   console.log(JSON.stringify(obj));
    fireEvent(this.pageRef,'appEventGuest',obj);
    
      
}

if(event.detail.action.name=='review'){

    fireEvent(this.pageRef,'showReview',event.detail.row.Id);
    
      
}


if(event.detail.action.name=='Comments'){

    fireEvent(this.pageRef,'commentEvent',event.detail.row.Id);
    
      
}


    
}

handleNameSearch(){
    console.log('in handle name search'+this.Name);
  
    searchIdeaByName({'Name':this.Name}).then((data)=>{
      console.log('data'+JSON.stringify(data));
      this.ideas=data;
  }).catch((err)=>{
      console.log('err'+err.body.message);
  })

}

handleName(event)
{
  this.Name=event.target.value;
}
    onCreate(){
        this.flag=true;
        this.createflag=false;
        this.optionflag=false;
    }
    get acceptedFormats() {
        return ['.pdf', '.png','.jpg','.jpeg'];
    }

    checkEmployeeId(event){
   this.empId=event.target.value;


    }

    checkemp(){
        
        console.log('in check emp'+this.empId);
        employeeIdExist({'empId':this.empId}).then((response)=>{
            console.log(JSON.stringify(response));
            this.optionflag=true;
            this.checkId=false;
/**get ideas */
              getProjectIdeas({'employeeId':this.empId}).then((data)=>{
        console.log('data'+JSON.stringify(data));
        this.ideas=data;
    }).catch((err)=>{
        console.log('err'+err.body.message);
    })
    /**end get ideas */
      }).catch((err)=>{
          console.log('err'+err.body.message);

          const evt = new ShowToastEvent({
            title: 'Error',
            message: 'Employee Id does not exist',
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
    }

    cancel(){
        this.uploadbutton=false;
        this.createflag=true;
        this.fileflag=false;
    }

    uploadDocument(){
        this.fileflag=true;
    }

    showIdeas(){
        this.optionflag=false;
        this.showideaflag=true;

    }
}
