import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Storage } from '@ionic/storage';

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
  callback: any;
  membersForm: FormGroup;
  members: any = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, private formBuilder: FormBuilder, private storage: Storage, private toastCtrl: ToastController) {
    this.competition = navParams.data.competition;
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

    //TODO: call api here to register with token
    setTimeout(()=>{
      var members = [];
      for(var key in this.membersForm.value)
        members.push(this.membersForm.value[key]);

      this.storage.set(this.getRegistrationId(this.competition.tag),members);
      this.showToast('Successfully registered');
      this.callback();
      this.navCtrl.pop();
    },1000);
    
  }

  private showToast(message){
    const toast = this.toastCtrl.create({
      message: message,
      duration: 1000,
      position: 'bottom'
    });

    toast.present();
  }

  private getRegistrationId(competitionTag: string): string{
    return 'competition-'+competitionTag;
  }  

  ionViewDidLoad() {
  }

}
