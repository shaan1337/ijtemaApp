import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ProgrammeProvider } from '../../providers/programme/programme';

/**
 * Generated class for the CompetitionsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-competitions',
  templateUrl: 'competitions.html',
})
export class CompetitionsPage {
  competitions: any[];

  constructor(public navCtrl: NavController, public navParams: NavParams, private programmeProvider:ProgrammeProvider) {
    this.competitions = this.programmeProvider.getCompetitions();        
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CompetitionsPage');
  }

}
