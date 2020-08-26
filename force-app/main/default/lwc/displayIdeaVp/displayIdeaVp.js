import { LightningElement,wire,api,track} from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getProjectIdeasVP from '@salesforce/apex/Project_Idea_Lightning.getProjectIdeasVP';
import approveIdea from '@salesforce/apex/Project_Idea_Lightning.approveIdea';
import rejectIdea from '@salesforce/apex/Project_Idea_Lightning.rejectIdea';
import submitReviewEmp from '@salesforce/apex/Project_Idea_Lightning.submitReviewEmp';
import searchIdeaByName from '@salesforce/apex/Project_Idea_Lightning.searchIdeaByName';
import Id from '@salesforce/user/Id';
import { CurrentPageReference } from 'lightning/navigation';
import { refreshApex } from '@salesforce/apex';
import {   registerListener,
    unregisterListener,
    unregisterAllListeners,
    fireEvent } from 'c/pubsub';

const actions= [
    { label : 'Show details', name: 'show_details'},
    { label : 'Approve', name: 'Approve'},
    { label : 'Reject', name: 'Reject'},
    { label : 'Show reviews', name: 'review'},
    { label : 'Comment', name: 'comment'}

];
export default class DisplayIdeaVp extends LightningElement {

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
    Name;
 

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
            label: 'Status',
            fieldName: 'Status__c',
            type: 'text',
            "initialWidth": 200,
            sortable: true
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
                console.log('error'+error.body.message);
           })
       }

       if(event.detail.action.name=='Reject'){
        console.log('in reject');
        rejectIdea({'recordId':event.detail.row.Id}).then(()=>{
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

    if(event.detail.action.name=='show_details'){

        fireEvent(this.pageRef,'appEvent',event.detail.row.Id);
        
          
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



    handleTechnology(event){
        this.technology=event.target.value;
    }


 
    
}