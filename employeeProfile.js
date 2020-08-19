import { LightningElement, wire, api,track} from 'lwc';
import imageResource from '@salesforce/resourceUrl/Profile';
import {CurrentPageReference} from 'lightning/navigation';
import {fireEvent} from 'c/pubsub';

//import getAllEmployees from '@salesforce/apex/EmployeeController.getAllEmployees';
import searchEmployees from '@salesforce/apex/EmployeeController.searchEmployees';
import { NavigationMixin } from 'lightning/navigation';

export default class EmployeeProfile extends LightningElement
{
	@wire (CurrentPageReference) pageRef;
	searchTerm = '';
	@wire(searchEmployees, {searchTerm: '$searchTerm'})
	employees;	

	profileImage = imageResource;
	handleSearchTermChange(event) {
		window.clearTimeout(this.delayTimeout);
		const searchTerm = event.target.value;
		// eslint-disable-next-line @lwc/lwc/no-async-operation
		this.delayTimeout = setTimeout(() => {
			this.searchTerm = searchTerm;
		}, 300);
	}
	handleEmployeeDetails(event){
		// console.log("ID>>"+event.target.value);
		// this[NavigationMixin.Navigate]({
		// 	type: 'standard__recordPage',
		// 	attributes: {
		// 		recordId: event.target.value,
		// 		objectApiName: 'Employee__c',
		// 		actionName: 'view'
		// 	}
		// });

		fireEvent(this.pageRef,'pubsubevent',event.target.value);
 
	}
	get hasResults() {
		return (this.employees.data.length > 0);
	}
}

