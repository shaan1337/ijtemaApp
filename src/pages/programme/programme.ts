import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Content } from 'ionic-angular';
import { ProgrammeProvider } from '../../providers/programme/programme';
import { CompetitionsPage } from '../competitions/competitions';
/**
 * Generated class for the ProgrammePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-programme',
  templateUrl: 'programme.html',
})
export class ProgrammePage {
  @ViewChild(Content) content: Content;
  programmes: any[];
  pageLoaded: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, private programmeProvider: ProgrammeProvider) {
  }

  scrollToNextProgramme(){    
    var nextProgramme = this.programmeProvider.getNextProgrammeId();
    if(nextProgramme==-1) return; 
    setTimeout(()=>{
      var programme = document.getElementById('programme-'+nextProgramme);    
      this.content.scrollTo(0,programme.offsetTop,500);
    },100);
  }

  openCompetitionsPage(programmeId: number){
    this.navCtrl.push(CompetitionsPage, {goToProgrammeId: programmeId});
  }

  loadProgrammes(scrollToNext){
    this.programmeProvider.getProgrammes()        
    .then((programmes) => {
      this.programmes = programmes;
      if(scrollToNext)
        this.scrollToNextProgramme();
    });    
  }

  ionViewDidEnter() {
    this.loadProgrammes(!this.pageLoaded); //first time from local storage      
    setTimeout(()=>{
      this.loadProgrammes(false); //second time if data has been updated from api
    }, 3000);

    this.pageLoaded = true;
  }

}
