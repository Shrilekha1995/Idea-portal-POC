import { LightningElement,wire,api,track} from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getProjectIdeasVP from '@salesforce/apex/Project_Idea_Lightning.getProjectIdeasVP';
import approveIdea from '@salesforce/apex/Project_Idea_Lightning.approveIdea';
import rejectIdea from '@salesforce/apex/Project_Idea_Lightning.rejectIdea';
import submitReviewEmp from '@salesforce/apex/Project_Idea_Lightning.submitReviewEmp';
import searchIdeaByNameVP from '@salesforce/apex/Project_Idea_Lightning.searchIdeaByNameVP';
import Id from '@salesforce/user/Id';
import { CurrentPageReference,NavigationMixin } from 'lightning/navigation';
import { refreshApex } from '@salesforce/apex';
import {   registerListener,
    unregisterListener,
    unregisterAllListeners,
    fireEvent } from 'c/pubsub';

const actions= [
 
    { label : 'Approve', name: 'Approve'},
    { label : 'Reject', name: 'Reject'},
    { label: 'View Details', name:'View Details'}
 

];
export default class DisplayIdeaVp extends NavigationMixin(LightningElement) {

    @wire(getProjectIdeasVP) ideas;
    ideas;
    @wire(CurrentPageReference) pageRef;
    @api recordId;
    flag=false;
    description='';
    ratingflag=false;
    ratin='';
    @track comment='';
    rid='';
    Name='';
    openmodel=false;
    @api editrecordId;
 

    columns = [{
            label: 'Project Idea Name',
            fieldName: 'Name',
            type: 'text',
            "initialWidth": 300,
            sortable: true
       //     typeAttributes: {
             //   label: {fieldName: 'Description__c'},
          //  name: 'description',
         //   variant: 'base',
         //   }
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
        "initialWidth": 160,
        typeAttributes: {rowActions: actions}
    }
      
    ];
  /*  connectedCallback(){
        
        getProjectIdeasVP().then((data)=>{
            console.log('data'+JSON.stringify(data));
            this.ideas=data;
        }).catch((err)=>{
            console.log('err'+err.body.message);
        })
    }
*/
    refreshingApex(){
              return refreshApex(this.ideas);
    }
    

    onComment(event){
        this.comment=event.target.value;
    }

    rowHandler(event){


        console.log("in row handler method"+event.detail.action.name);
        console.log("object id-----"+event.detail.row.Id);
       if(event.detail.action.name=='Approve'){
           console.log('in approvae');
           approveIdea({'recordId':event.detail.row.Id}).then(()=>{
                          console.log('in approve response ');

                           const evt = new ShowToastEvent({
                            title: "Project Idea has been Approved",
                        
                            variant: "success"
                        });
                        this.dispatchEvent(evt);
                      //  eval("$A.get('e.force:refreshView').fire();");
                      this.refreshingApex();
                     //   window.reload();
           }).catch((err)=>{
                console.log('err'+err.body.message);
                const evt = new ShowToastEvent({
                    title: 'Error',
                    message: 'In order to approve the idea, its score should be greater than 5',
                    variant: 'Error',
                    mode: 'dismissable'
                });
                this.dispatchEvent(evt);
           })
       }

       if(event.detail.action.name=='Reject'){
        console.log('in reject');
        this.editrecordId=event.detail.row.Id;
       this.openmodel=true;
      
    }

    if(event.detail.action.name=='View Details'){

        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId:  event.detail.row.Id,
                objectApiName: 'Idea__c',
                actionName: 'view'
            },
        });
          
    }

    if(event.detail.action.name=='review'){

        fireEvent(this.pageRef,'ratingEvent',event.detail.row.Id);
        
          
    }

   
        
    }
    
    disable(){
        this.flag=false;
    }

    handleLocation(event){
        this.location=event.target.value;

    }

    handleNameSearch(){
          console.log('in handle name search'+this.Name);
        
         
          searchIdeaByNameVP({'Name':this.Name}).then((data)=>{
            console.log('data'+JSON.stringify(data));
            this.ideas.data=data;
        }).catch((err)=>{
            console.log('err'+err.body.message);
        })
        refreshApex(this.ideas);

    

    }

    closeModal(){
        this.openmodel=false;
    }

    editsuccess(){
        this.openmodel=false;
        rejectIdea({'recordId':this.editrecordId}).then(()=>{
            console.log('in reject response ');
            const evt = new ShowToastEvent({
             title: "Project Idea has been rejected",
             
             variant: "info"
         });
         this.dispatchEvent(evt);
         this.refreshingApex();
}).catch((err)=>{
  console.log('error'+error.body.message);
})


    }

    handleName(event)
    {
        console.log('in handle name of vp '+ event.target.value);
        this.Name=event.target.value;
    }



  

 
    
}