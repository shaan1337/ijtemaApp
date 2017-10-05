import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content } from 'ionic-angular';
import { ProgrammeProvider } from '../../providers/programme/programme';
import { Storage } from '@ionic/storage';
import { ToastController } from 'ionic-angular';
import { PersonaldetailsPage } from '../personaldetails/personaldetails';
import { RegisterTeamPage } from '../register-team/register-team';

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
  teamMembers: any = {};

  constructor(public navCtrl: NavController, public navParams: NavParams, private programmeProvider:ProgrammeProvider, private storage: Storage, private toastCtrl: ToastController) {

    this.goToProgrammeId = navParams.get("goToProgrammeId");

    this.competitions = this.programmeProvider.getCompetitions();
    for(var i=0;i<this.competitions.length;i++){
      var p = this.competitions[i];

      if(p.competitions !== undefined){
        p.competitions.forEach(competition => {
          var tag = competition.tag;
          
          this.getRegistrationState(tag).then((res)=>{
            this.registrationState[res.tag] = res.state;
            if(competition.teamsize){ //teambased competition            
              this.teamMembers[competition.tag] = res.value;
            }
          });

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
      if(!val || val=='not-registered') return {tag: competitionTag, state: 'not-registered', value: val};
      else return {tag: competitionTag, state: 'registered', value: val};
    });
  }

  public register(competition: any){
    var competitionTag = competition.tag;
    var teamSize = competition.teamsize;

    this.getPersonalDetails().then((details) => {
      if(!details){
        this.openPersonalDetailsPage({competitionTag: competitionTag});      
      }
      else{
        if(!teamSize){
          //TODO: call api here to register with details.token
          this.setRegistrationState(competitionTag,'loading');
          setTimeout(()=>{
            this.setRegistrationState(competitionTag,'registered');
            this.showToast('Successfully registered'); 
          },1000);
        }
        else{
          this.openRegisterTeamPage(competition);  
        }
      }
    });
  }

  public unregister(competition: any){
    var competitionTag = competition.tag;
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

  private openRegisterTeamPage(competition){
    var params = {
      competition: competition,
      callback: () => {
        //update the registration state
        this.registrationState[competition.tag] = 'loading';
        setTimeout(() =>{
          this.getRegistrationState(competition.tag).then((res)=>{
            this.registrationState[res.tag] = res.state;
            if(competition.teamsize){ //teambased competition            
              this.teamMembers[competition.tag] = res.value;
            }            
          });
        },1000);
      }
    };

    this.navCtrl.push(RegisterTeamPage, params);    
  }  

  ionViewDidEnter(){
    if(this.goToProgrammeId){
      this.scrollToProgramme(this.goToProgrammeId);
    }
  }

}
