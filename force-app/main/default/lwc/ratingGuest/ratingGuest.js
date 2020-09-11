import { LightningElement,wire,track } from 'lwc';
import {   registerListener,
    unregisterListener,
    unregisterAllListeners,
    fireEvent } from 'c/pubsub';
    import { CurrentPageReference } from 'lightning/navigation';
    import submitReviewEmp from '@salesforce/apex/Project_Idea_Lightning.submitReviewEmp';
    import { ShowToastEvent } from 'lightning/platformShowToastEvent';
    import showReviews from '@salesforce/apex/Project_Idea_Lightning.showReviews';
    import { refreshApex } from '@salesforce/apex';
    import getIdeaName from '@salesforce/apex/Project_Idea_Lightning.getIdeaName';
    
    

export default class RatingGuest extends LightningElement {
    title='';
    reviews;
    recordId;
    @wire(CurrentPageReference) pageRef;
    @wire(showReviews,{pid:'$recordId'})reviews;
    
    ratingflag=false;
    @track comment='';
    flag=false;
    empId='';
    empValid=false;
    checkId=false;
    displayflag=true;

    
    refreshingApex(){
        return refreshApex(this.reviews);
}

   
    
    

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
        
        registerListener('hidereview', this.hidefunction,this);
       
    }


    hidefunction(id){
        console.log('hidefunction');
        this.displayflag=false;

    }
    handleaddevent(obj){
      //  this.checkId=true;
      this.displayflag=true;
        console.log('in handle event'+obj.pid);
        this.recordId=obj.pid;
        this.empId=obj.empid;

        getIdeaName({'ideaId':obj.pid}).then((data)=>{
            this.title=data;
        }).catch((err)=>{
            console.log('err'+err.body.message);
        })
    

     /*   showReviews({'pid':this.recordId}).then((data)=>{
            console.log('in show reviews')
            console.log('data'+JSON.stringify(data));
            this.reviews=data;
            console.log('reviews'+this.reviews);
        }).catch((err)=>{
            console.log('err'+err.body.message);
        })*/
        
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
            this.refreshingApex();
            this.comment='';
            }).catch((error)=>{
                console.log('error1');
            console.log('error'+error.body.message);
            })
        //this.ratingflag=false; 
//this.empValid=false;
    }

}