import { LightningElement,wire } from 'lwc';
import getApprovedIdeas from '@salesforce/apex/Project_Idea_Lightning.getApprovedIdeas';
import searchIdeaByNameApproved from '@salesforce/apex/Project_Idea_Lightning.searchIdeaByNameApproved';

export default class ApprovedIdeas extends LightningElement {
    @wire(getApprovedIdeas)approvedIdeas;

  Name='';
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
    
        }

     ];

     handleName(event)
{
  this.Name=event.target.value;
}

     handleApprovedNameSearch(){

        console.log('in handle name search'+this.Name);
      if(this.Name!='')
      {
        searchIdeaByNameApproved({'Name':this.Name}).then((data)=>{
          console.log('data'+JSON.stringify(data));
          this.approvedIdeas.data=data;
      }).catch((err)=>{
          console.log('err'+err.body.message);
      })
    }
    
    }

}