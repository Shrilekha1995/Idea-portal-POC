import { LightningElement , wire, track} from 'lwc';
import {registerListener, unregisterAllListeners} from 'c/pubsub';
import searchEmployees from '@salesforce/apex/EmployeeController.searchEmployees';
import {CurrentPageReference} from 'lightning/navigation';

export default class EmployeeDetails extends LightningElement {


    // @track selectedEmployees = [];

    @wire (CurrentPageReference) pageRef;
    @track recordId;
    connectedCallback(){
        registerListener('pubsubevent',this.handleCallback,this);
    }
    handleCallback(detail){
        // console.log(detail);
        // searchEmployees(detail).then(response=>{
        //     console.log(response);
        // }).catch(error=>{
        //     console.error('Error');
        // });
        this.recordId = detail;

    }
    disconnectedCallback(){
        unregisterAllListeners(this);
    }
    
}

