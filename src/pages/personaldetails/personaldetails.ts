import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { ApiProvider } from '../../providers/api/api';
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

  constructor(public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder, public storage: Storage, public toastCtrl: ToastController, public apiProvider: ApiProvider, public http: Http) {
    this.detailsForm = this.formBuilder.group({
      name: ['', Validators.compose([Validators.required,Validators.pattern("^[A-Za-z ,.'-]+$")])],
      mobile: ['', Validators.compose([Validators.required,Validators.minLength(8),Validators.maxLength(8),Validators.pattern("5[0-9]{7}")])],
      majlis: ['', Validators.required],
      halqa: ['']
    });

    this.detailsForm.get('name').valueChanges.subscribe(data => {
      //force name to uppercase
      var name = this.detailsForm.get('name').value;
      var newName = '';
      for(var i=0;i<name.length;i++){
        if(i==0 || (i>=1 && name[i-1]==' ')){
          newName += name[i].toUpperCase();
        } else{
          newName += name[i];
        }
      }
      if(newName != name){
        this.detailsForm.patchValue({name: newName });
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
          return JSON.parse(val);
        }
      })
      .then((data) =>{
        if(!data){
          return this.http.post(this.apiProvider.getAPIURL()+'/personaldetails', details).toPromise();
        }
        else{
          var patches = [];
          for(var key in details){
            patches.push({op:'replace',path:'/'+key,value:details[key]});
          }
          return this.http.patch(this.apiProvider.getAPIURL()+'/personaldetails'+'/'+data._id+'/'+data.token, patches).toPromise();
        }
      })
      .then(
      (res) =>{
        this.storage.set(this.storageTag, res['_body']);
        this.showToast('Successfully saved', 1000);
        this.navCtrl.pop();
      })
      .catch((err)=>{
        this.showToast('An error has occured. Please check your internet connection.', 5000);
        this.loading = false;
      });

    },1000);
  }

  private showToast(message, duration){
    const toast = this.toastCtrl.create({
      message: message,
      duration: duration,
      position: 'bottom'
    });

    toast.present();
  }

  ionViewDidLoad() {
  }

}
