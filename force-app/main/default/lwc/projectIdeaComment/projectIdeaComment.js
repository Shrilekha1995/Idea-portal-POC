import { LightningElement,wire,track } from 'lwc';
import submitComment from '@salesforce/apex/Project_Idea_Lightning.submitComment';
import {   registerListener,
    unregisterListener,
    unregisterAllListeners,
    fireEvent } from 'c/pubsub';
    import { CurrentPageReference } from 'lightning/navigation';
    import { ShowToastEvent } from 'lightning/platformShowToastEvent';
  import showComments from '@salesforce/apex/Project_Idea_Lightning.showComments';
  import { refreshApex } from '@salesforce/apex';

export default class ProjectIdeaComment extends LightningElement {
     @track ideaId='';
    @wire(showComments,{pid:'$ideaId'})comments;
    @track comment='';
    empValid=false;
    checkId=false;
    commentbox=false;
    
    empId='';
   // comments=[];
 

    @wire(CurrentPageReference) pageRef;

    refreshingApex(){
        return refreshApex(this.comments);
}

    
    connectedCallback() {

        console.log('in connected callback of comment');

      
        registerListener('commentEvent', this.handleaddevent,this);

        registerListener('hidecomment', this.hidecommentfunction,this);
        
       
    }

    hidecommentfunction(id){
   this.commentbox=false;
    }

    handleaddevent(obj1){
        this.commentbox=true;
        
        this.checkId=true;
        console.log('in handle event of comments'+JSON.stringify(obj1));
        this.ideaId=obj1.pid;
        this.empId=obj1.empid;

       /* showComments({}).then((data)=>{
            console.log('in show comments')
            console.log('data'+JSON.stringify(data));
            this.comments=data;
            console.log('comments'+this.comments);
        }).catch((err)=>{
            console.log('err'+err.body.message);
        })*/
    
    } 
    

    onCommentHandler(event)
    {
        this.comment=event.target.value;
    }

    submitComment(){
   
        console.log('in submit comment');
        let com = { 'sobjectType': 'Comment__c' };
        console.log('in submit comment 1');
    com.Idea__c = this.ideaId;
    console.log('in submit comment 2');
    com.text__c=this.comment;
    console.log('in submit comment 3');
    com.empId__c=this.empId;
       
        console.log('comment'+JSON.stringify(com));

        submitComment({comment:com}).then((data)=>{
            console.log('in response'+JSON.stringify(data));
            console.log('in submit comment response response ');
            this.refreshingApex();
            const evt1 = new ShowToastEvent({
                title: "Post has been submitted successfully",
                
                variant: "success"
            });
            this.dispatchEvent(evt1);

         


            const inputFields = this.template.querySelectorAll('form');

        
            this.template.querySelector('form').reset();
            this.comment='';
            }).catch((error)=>{
                console.log('error1');
            console.log('error'+error.body.message);
            })
      //  this.ratingflag=false; 
        
    }

    disconnectedCallback(){
        this.empValid=false;
    }
    
}