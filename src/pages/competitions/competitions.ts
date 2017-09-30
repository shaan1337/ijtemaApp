import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content } from 'ionic-angular';
import { ProgrammeProvider } from '../../providers/programme/programme';
import { Storage } from '@ionic/storage';
import { ToastController } from 'ionic-angular';
import { PersonaldetailsPage } from '../personaldetails/personaldetails';

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
  @ViewChild(Content) content: Content;
  
  goToProgrammeId: any;  
  competitions: any[];
  registrationState: any = {};

  constructor(public navCtrl: NavController, public navParams: NavParams, private programmeProvider:ProgrammeProvider, private storage: Storage, private toastCtrl: ToastController) {

    this.goToProgrammeId = navParams.get("goToProgrammeId");

    this.competitions = this.programmeProvider.getCompetitions();
    for(var i=0;i<this.competitions.length;i++){
      var p = this.competitions[i];

      if(p.competitions !== undefined)
      for(var j=0;j<p.competitions.length;j++){
        var tag = p.competitions[j].tag;
        this.getRegistrationState(tag).then((res)=>{
          this.registrationState[res.tag] = res.state;
        });
      }
    }

  }

  private getRegistrationId(competitionTag: string): string{
    return 'competition-'+competitionTag;
  }

  private setRegistrationState(competitionTag: string, value: string){
    this.storage.set(this.getRegistrationId(competitionTag),value);
    this.registrationState[competitionTag] = value;
  }

  private getRegistrationState(competitionTag: string){
    var id = this.getRegistrationId(competitionTag);
    var result = this.storage.get(id);
    return result.then((val) =>{
      if(!val || val=='not-registered') return {tag: competitionTag, state: 'not-registered'};
      else return {tag: competitionTag, state: 'registered'};
    });
  }

  public register(competitionTag: string){
    this.getPersonalDetails().then((details) => {
      if(!details){
        this.openPersonalDetailsPage({competitionTag: competitionTag})        
      }
      else{
        //TODO: call api here to register with details.token
        this.setRegistrationState(competitionTag,'loading');
        setTimeout(()=>{
          this.setRegistrationState(competitionTag,'registered');
          this.showToast('Successfully registered'); 
        },1000);
      }
    });
  }

  public unregister(competitionTag: string){
    this.setRegistrationState(competitionTag,'loading');
    setTimeout(()=>{
      //TODO: call api here to unregister with details.token
      this.setRegistrationState(competitionTag,'not-registered');
      this.showToast('Successfully unregistered'); 
    },1000);
  }

  private scrollToProgramme(programmeId){
    var programme = document.getElementById('programme-competition-'+programmeId);
    this.content.scrollTo(0,programme.offsetTop,500);
  }

  private showToast(message){
    const toast = this.toastCtrl.create({
      message: message,
      duration: 1000,
      position: 'bottom'
    });

    toast.present();
  }

  private getPersonalDetails(){
    return this.storage.get('competitions-personal-details').then((val) => {
      return val;
    });
  }

  private openPersonalDetailsPage(data){
    if(!data) data = {};
    this.navCtrl.push(PersonaldetailsPage, data);    
  }

  ionViewDidEnter(){
    if(this.goToProgrammeId){
      this.scrollToProgramme(this.goToProgrammeId);
    }
  }

}
