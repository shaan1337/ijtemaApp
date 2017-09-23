import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Content } from 'ionic-angular';
import { ProgrammeProvider } from '../../providers/programme/programme';
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

  constructor(public navCtrl: NavController, public navParams: NavParams, private programmeProvider: ProgrammeProvider) {
    this.programmes = this.programmeProvider.getProgrammes();    
  }

  scrollToNextProgramme(){
    var nextProgramme = this.programmeProvider.getNextProgrammeId();    
    var programme = document.getElementById('programme-'+nextProgramme);      
    this.content.scrollTo(0,programme.offsetTop,500);
  }

  ionViewDidEnter() {
      this.scrollToNextProgramme();
  }

}
