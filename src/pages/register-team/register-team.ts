import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { Http } from '@angular/http';
import { ApiProvider } from '../../providers/api/api';

/**
 * Generated class for the RegisterTeamPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register-team',
  templateUrl: 'register-team.html',
})
export class RegisterTeamPage {
  loading: boolean = false;
  competition: any;
  token: string;
  callback: any;
  membersForm: FormGroup;
  members: any = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, private formBuilder: FormBuilder, private storage: Storage, private toastCtrl: ToastController, private apiProvider: ApiProvider, private http: Http) {
    this.competition = navParams.data.competition;
    this.token = navParams.data.token;
    this.callback = navParams.data.callback;

    var formControls = {};
    for(var i=1;i<=this.competition.teamsize;i++){
      var id = 'member-'+i;
      this.members.push({id: id, index: i});
      formControls[id] = ['',Validators.compose([Validators.required,Validators.pattern("^[A-Za-z ,.'-]+$")])];
    }
    
    this.membersForm = this.formBuilder.group(formControls);

    //force upper-case
    this.members.forEach(member => {
      var memberFormControl = this.membersForm.get(member.id);
      memberFormControl.valueChanges.subscribe(data => {
        //force name to uppercase
        var name = memberFormControl.value;
        if(name != name.toUpperCase()){
          memberFormControl.patchValue(name.toUpperCase());
        }
      });
    });

    this.setFirstMemberName();
  }

  private setFirstMemberName(){
    var tag = 'competitions-personal-details';
    this.storage.get(tag)
    .then((val)=>{
      if(val){
        var details = JSON.parse(val);
        this.membersForm.get('member-1').patchValue(details.name);
      }
    });
  }

  public registerTeam(){
    this.loading = true;

    var teamMembersString = "Team: ";

    var members = [];
    for(var key in this.membersForm.value){
      var member = this.membersForm.value[key];
      if(members.length > 0) teamMembersString += ',';
      teamMembersString += member;
      members.push(member);
    }

    var competition = {
      tag: this.competition.tag,
      comment: teamMembersString,
      members: JSON.stringify(members)
    };

    this.http.post(this.apiProvider.getAPIURL()+'/registrations/'+this.token, competition).toPromise()
    .then((res)=>{
      setTimeout(()=>{
        this.setRegistrationState(this.competition.tag,res['_body']);
        this.showToast('Successfully registered',1000);
        this.callback();
        this.navCtrl.pop();       
      }, 1000);
    })
    .catch((err)=>{
      setTimeout(()=>{
        this.showToast('An error has occured. Please check your internet connection.', 5000);              
      }, 1000);       
    });    
  }

  private showToast(message, duration){
    const toast = this.toastCtrl.create({
      message: message,
      duration: duration,
      position: 'bottom'
    });

    toast.present();
  }

  private getRegistrationId(competitionTag: string): string{
    return 'competition-'+competitionTag;
  }  


  private setRegistrationState(competitionTag: string, value: string){
    this.storage.set(this.getRegistrationId(competitionTag),value);
  }
  
  ionViewDidLoad() {
  }

}
