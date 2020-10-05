import { LightningElement ,wire} from 'lwc';
import getRejectedIdeas from '@salesforce/apex/Project_Idea_Lightning.getRejectedIdeas';
import searchIdeaByNameRejected from '@salesforce/apex/Project_Idea_Lightning.searchIdeaByNameRejected';

export default class RejectedIdeas extends LightningElement {

    @wire(getRejectedIdeas)rejectedIdeas; 
    Name='';

    RejectIdeacolumns=[{
        label: 'Project Idea Name',
        fieldName: 'Name',
        type: 'text'
        

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

        label: 'Reason',
        fieldName: 'Reason__c',
        type: 'text',
        wrapText: true

    }
  
];

handleName(event)
{
  this.Name=event.target.value;
}

handleRejectedNameSearch(){


    console.log('in handle name search'+this.Name);
      if(this.Name !='')
      {
    searchIdeaByNameRejected({'Name':this.Name}).then((data)=>{
          console.log('data'+JSON.stringify(data));
          this.rejectedIdeas.data=data;
      }).catch((err)=>{
          console.log('err'+err.body.message);
      })
    }
    }
 
}