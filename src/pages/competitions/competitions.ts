import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ProgrammeProvider } from '../../providers/programme/programme';
import { Storage } from '@ionic/storage';

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
  registrationState: any[][] = new Array();

  constructor(public navCtrl: NavController, public navParams: NavParams, private programmeProvider:ProgrammeProvider, private storage: Storage) {
    this.competitions = this.programmeProvider.getCompetitions();
    for(var i=0;i<this.competitions.length;i++){
      var p = this.competitions[i];
      this.registrationState.push(new Array());

      if(p.competitions !== undefined)
      for(var j=0;j<p.competitions.length;j++){
        this.registrationState[i].push("");

        this.getRegistrationState(i,j).then((res)=>{
          this.registrationState[res.i][res.j] = res.val;
        });
      }
    }

  }

  getRegistrationId(i: number, j: number): string{
    return 'competition-registration-'+i+'-'+j;
  }

  setRegistrationState(i: number, j: number, value: string){
    this.storage.set(this.getRegistrationId(i,j),value);
    this.registrationState[i][j] = value;
  }

  getRegistrationState(i: number, j: number){
    var id = this.getRegistrationId(i,j);
    var result = this.storage.get(id);
    return result.then((val) =>{
      if(!val) return {val: 'not-registered', i: i, j: j};
      else return {val: val, i: i, j: j};
    });
  }

  register(i: number, j:number){
    this.setRegistrationState(i,j,'loading');
    setTimeout(()=>{
      this.setRegistrationState(i,j,'registered');      
    },1000);
  }

  unregister(i: number, j: number){
    this.setRegistrationState(i,j,'loading');
    setTimeout(()=>{
      this.setRegistrationState(i,j,'not-registered');
    },1000);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CompetitionsPage');
  }

}
