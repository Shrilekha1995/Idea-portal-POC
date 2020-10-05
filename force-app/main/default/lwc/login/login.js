import { LightningElement } from 'lwc';
import authenticate from '@salesforce/apex/Project_Idea_Lightning.authenticate';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';

export default class Login extends  NavigationMixin(LightningElement){

password;
empId;
    checkpassword(event){
        this.password=event.target.value;
    
    }

    
    checkEmployeeId(event){
        this.empId=event.target.value;
     
     
         }
     
    
    checkemp(){
        
        console.log('in check emp'+this.empId);

      let emp= { 'sobjectType': 'Employee__c' };
      emp.Employee_ID__c= this.empId;
       emp.Password__c=this.password;
       
        console.log('emp'+JSON.stringify(emp));

        authenticate({newemp:emp}).then((response)=>{
            console.log(JSON.stringify(response));
            if(response==null){
                throw new Error('Employee ID or password does not match');
            }
            sessionStorage.setItem('empId', this.empId);

            this[NavigationMixin.Navigate]({
                type: 'standard__webPage',
                attributes: {
                    url: 'https://ideaportal-developer-edition.ap16.force.com/s/portal'
                }
            },
            true // Replaces the current page in your browser history with the URL
          );

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
}