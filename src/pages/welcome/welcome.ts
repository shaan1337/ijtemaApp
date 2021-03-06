import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the WelcomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html',
})
export class WelcomePage {

  slides = [
    {
      title: "Assalamu alaikum wa rahmatullah!",
      description: "Welcome to the official app for the <br><b>Majlis Khuddam-ul-Ahmadiyya Mauritius National Ijtema 2019</b>!",
      image: "assets/img/logo.png",
    },
    {
      title: "Stay tuned",
      description: "View the program and stay tuned throughout the Ijtema",
      image: "assets/img/programme.png",
    },
    {
      title: "Register for Competitions",
      description: "Book your place for competitions right from the app",
      image: "assets/img/competitions.png",
    },
    {
      title: "Like!",
      description: "Use hashtag <b>#ijtemamu</b> to share your amazing photos to <b>Instagram</b> or <b>Twitter</b>",
      image: "assets/img/social.png"
    }
  ];

  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WelcomePage');
  }

  openMainMenu(completed: boolean){
    if(completed){
      this.storage.set('welcomeCompleted',true);
    }

    this.navCtrl.pop();
  }
}
