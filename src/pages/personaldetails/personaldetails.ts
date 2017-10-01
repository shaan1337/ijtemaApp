import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Storage } from '@ionic/storage';
/**
 * Generated class for the PersonaldetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-personaldetails',
  templateUrl: 'personaldetails.html',
})
export class PersonaldetailsPage {
  loading: boolean = false;
  detailsExist: boolean = false;
  detailsForm:FormGroup;  
  majlisWithHalqa: any = {'quatre-bornes': true,'rose-hill': true,'trefles': true}
  storageTag: any = 'competitions-personal-details';

  constructor(public navCtrl: NavController, public navParams: NavParams, private formBuilder: FormBuilder, private storage: Storage, private toastCtrl: ToastController) {
    this.detailsForm = this.formBuilder.group({
      name: ['', Validators.compose([Validators.required,Validators.pattern("^[A-Za-z ,.'-]+$")])],
      mobile: ['', Validators.compose([Validators.required,Validators.minLength(8),Validators.maxLength(8),Validators.pattern("5[0-9]{7}")])],
      majlis: ['', Validators.required],
      halqa: ['']     
    });

    this.detailsForm.get('name').valueChanges.subscribe(data => {
      //force name to uppercase
      var name = this.detailsForm.get('name').value;
      if(name != name.toUpperCase()){
        this.detailsForm.patchValue({name: name.toUpperCase()});
      }
    });

    this.detailsForm.get('majlis').valueChanges.subscribe(data => {
      //update halqa validators based on selected majlis
      var majlis = this.detailsForm.get('majlis').value;

      var halqaControl = this.detailsForm.get('halqa');
      halqaControl.patchValue('');

      if(majlis in this.majlisWithHalqa)
        halqaControl.setValidators([Validators.required]);        
      else
        halqaControl.clearValidators();        

      halqaControl.updateValueAndValidity();     
    });

    this.loadCurrentValues();
  }

  private loadCurrentValues(){
    this.storage.get(this.storageTag)
    .then((val)=>{
      if(val){
        this.detailsExist = true;
        var details = JSON.parse(val);
        this.detailsForm.get('name').patchValue(details.name);
        this.detailsForm.get('mobile').patchValue(details.mobile);
        this.detailsForm.get('majlis').patchValue(details.majlis);
        this.detailsForm.get('halqa').patchValue(details.halqa);
      }
    });
  }

  public submitDetails(){
    this.loading = true;
    setTimeout(()=>{
      var details = this.detailsForm.value;

      this.storage.get(this.storageTag)
      .then((val)=>{
        if(!val) return undefined;
        else{
          var obj = JSON.parse(val);
          return obj.token;
        }
      })
      .then((token) =>{
        details.token = token;

        //TODO: call api here, which will return a token
        if(!token) token = this.generateRandomToken();
        details.token = token;
        return details;
      })
      .then((savedDetails) =>{
        this.storage.set(this.storageTag, JSON.stringify(savedDetails));
        this.showToast('Successfully saved');
        this.navCtrl.pop();
      });

    },1000);
  }

  private generateRandomToken(){
    var result = '';
    var charset = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for(var i=0;i<32;i++){
      var pos = Math.floor((Math.random() * (charset.length - 1)));
      result += charset[pos];
    }

    return result;
  }

  private showToast(message){
    const toast = this.toastCtrl.create({
      message: message,
      duration: 1000,
      position: 'bottom'
    });

    toast.present();
  }

  ionViewDidLoad() {
  }

}
