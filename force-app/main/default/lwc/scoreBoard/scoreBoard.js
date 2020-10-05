import { LightningElement,wire } from 'lwc';
import getScoreBoard from '@salesforce/apex/Project_Idea_Lightning.getScoreBoard';

export default class ScoreBoard extends LightningElement {
    @wire(getScoreBoard)scores;
}