import { LightningElement,wire } from 'lwc';
import {   registerListener,
    unregisterListener,
    unregisterAllListeners,
    fireEvent } from 'c/pubsub';
    import { CurrentPageReference } from 'lightning/navigation';
    import submitReviewEmp from '@salesforce/apex/Project_Idea_Lightning.submitReviewEmp';
    import { ShowToastEvent } from 'lightning/platformShowToastEvent';
    import showReviews from '@salesforce/apex/Project_Idea_Lightning.showReviews';
    
    

export default class RatingGuest extends LightningElement {
    @wire(CurrentPageReference) pageRef;
    recordId;
    ratingflag=false;
    comment;
    flag=false;
    empId='';
    empValid=false;
    checkId=false;
    reviews;
    

    columns = [{
        label: 'Submitted by',
        fieldName: 'Submitter_Name__c',
        type: 'text',
        sortable: true
   
    },
    {
        label: 'Rating',
        fieldName: 'Rating__c',
        type: 'text',
        sortable: true
    },{
        label:'Comment',
        fieldName:'Comment__c',
        type:'text'
    }
  
];



    


    checkEmployeeId(event){
        this.empId=event.target.value;
     
     
         }
     
        
           

    connectedCallback() {

        console.log('in connected callvack before');
        registerListener('appEventGuest', this.handleaddevent,this);
        console.log('in connected callvack after');
       
    }

    handleaddevent(obj){
      //  this.checkId=true;
        console.log('in handle event'+obj.pid);
        this.recordId=obj.pid;
        this.empId=obj.empid;

        showReviews({'pid':this.recordId}).then((data)=>{
            console.log('in show reviews')
            console.log('data'+JSON.stringify(data));
            this.reviews=data;
            console.log('reviews'+this.reviews);
        }).catch((err)=>{
            console.log('err'+err.body.message);
        })
        
        this.ratingflag=true;

        
  

        
    }

    rating(event){
        this.rating=event.target.value;
    }

    onComment(event){
         this.comment=event.target.value;
    }

    getvalues(){
        console.log('in get values');
        let review = { 'sobjectType': 'Review__c' };
    review.Idea__c = this.recordId;
    review.Rating__c = this.rating;
    review.Comment__c=this.comment;
    review.empId__c=this.empId;
       
        console.log('review'+JSON.stringify(review));

        submitReviewEmp({newreview:review}).then((data)=>{
            console.log('in response'+JSON.stringify(data));
            console.log('in submit review response response ');

            const evt1 = new ShowToastEvent({
                title: "Review has been submitted successfully",
                
                variant: "success"
            });
            this.dispatchEvent(evt1);
            }).catch((error)=>{
                console.log('error1');
            console.log('error'+error.body.message);
            })
        this.ratingflag=false; 
        this.empValid=false;
    }

}