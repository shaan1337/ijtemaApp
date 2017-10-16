import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content } from 'ionic-angular';
import { ProgrammeProvider } from '../../providers/programme/programme';
import { Storage } from '@ionic/storage';
import { ToastController } from 'ionic-angular';
import { PersonaldetailsPage } from '../personaldetails/personaldetails';
import { RegisterTeamPage } from '../register-team/register-team';
import { ApiProvider } from '../../providers/api/api';
import { Http } from '@angular/http';

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
  competitions: any[] = [];
  registrationState: any = {};
  teamMembers: any = {};

  constructor(public navCtrl: NavController, public navParams: NavParams, public programmeProvider:ProgrammeProvider, public storage: Storage, public toastCtrl: ToastController, public apiProvider:ApiProvider, public http: Http) {

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
              if(res.value){
                var val = JSON.parse(res.value);
                var members = JSON.parse(val.members);
                this.teamMembers[competition.tag] = members;
              }
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
    if(value=='loading'){
      this.registrationState[competitionTag] = value;
    }
    else if(value == 'not-registered'){
      this.storage.remove(this.getRegistrationId(competitionTag));
      this.registrationState[competitionTag] = value;      
    }
    else{
      this.storage.set(this.getRegistrationId(competitionTag),value)
      .then(()=>{
        return this.getRegistrationState(competitionTag);
      })      
      .then((res)=>{
        this.registrationState[res.tag] = res.state;      
      });
    }
  }

  private getRegistrationState(competitionTag: string){
    var id = this.getRegistrationId(competitionTag);
    var result = this.storage.get(id);
    return result.then((val) =>{
      if(!val) return {tag: competitionTag, state: 'not-registered', value: val};
      else return {tag: competitionTag, state: 'registered', value: val};
    });
  }

  public register(competition: any){
    var curCompetition = competition;
    var competitionTag = competition.tag;
    var teamSize = competition.teamsize;
    
    this.getPersonalDetails().then((details) => {
      if(!details){
        this.openPersonalDetailsPage({competitionTag: competitionTag});      
      }
      else{
        var token = details.token;
        if(!teamSize){
          this.setRegistrationState(competitionTag,'loading');
          var competition = {
            tag: competitionTag,
            comment:"",
            members: JSON.stringify([])
          };

          this.http.post(this.apiProvider.getAPIURL()+'/registrations/'+token, competition).toPromise()
          .then((res)=>{
            setTimeout(()=>{
              this.setRegistrationState(competitionTag,res['_body']);
              this.showToast('Successfully registered',1000);              
            }, 1000);
          })
          .catch((err)=>{
            setTimeout(()=>{
              this.setRegistrationState(competitionTag,'not-registered');
              this.showToast('An error has occured. Please check your internet connection.', 5000);              
            }, 1000);       
          });
        }
        else{
          this.openRegisterTeamPage(curCompetition, token);  
        }
      }
    });
  }

  public unregister(competition: any){
    var competitionTag = competition.tag;
    this.setRegistrationState(competitionTag,'loading');

    var id = -1;
    var token = '';

    this.getPersonalDetails().then((details) => {
      if(!details || !details.token) return;
      token = details.token;      
    })
    .then(()=>{
      return this.getRegistrationState(competitionTag);
    })    
    .then((state)=>{
      var value = JSON.parse(state.value);
      id = value['_id'];
    })
    .then(()=>{
      return this.http.delete(this.apiProvider.getAPIURL()+'/registrations'+'/'+id+'/'+token, competition).toPromise();      
    })    
    .then((res)=>{
      setTimeout(()=>{
        this.setRegistrationState(competitionTag,'not-registered');          
        this.showToast('Successfully unregistered',1000);              
      }, 1000);
    })
    .catch((err)=>{
      setTimeout(()=>{
        this.getRegistrationState(competition)
        .then((res)=>{
          this.setRegistrationState(res.tag,res.value);
          this.showToast('An error has occured. Please check your internet connection.', 5000); 
        });
      }, 1000);       
    });
  
  }

  private scrollToProgramme(programmeId){
    var programme = document.getElementById('programme-competition-'+programmeId);
    this.content.scrollTo(0,programme.offsetTop,500);
  }

  private showToast(message,duration){
    const toast = this.toastCtrl.create({
      message: message,
      duration: duration,
      position: 'bottom'
    });

    toast.present();
  }

  private getPersonalDetails(){
    return this.storage.get('competitions-personal-details').then((val) => {  
      if(!val)
        return val;
      else
        return JSON.parse(val);
    });
  }

  private openPersonalDetailsPage(data){
    if(!data) data = {};
    this.navCtrl.push(PersonaldetailsPage, data);    
  }

  private openRegisterTeamPage(competition, token){
    var params = {
      competition: competition,
      token: token,
      callback: () => {
        //update the registration state
        this.registrationState[competition.tag] = 'loading';
        setTimeout(() =>{
          this.getRegistrationState(competition.tag).then((res)=>{
            this.registrationState[res.tag] = res.state;
            if(competition.teamsize){ //teambased competition
              if(res.value){      
                var val = JSON.parse(res.value);
                var members = JSON.parse(val.members);
                this.teamMembers[competition.tag] = members;
              }
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
