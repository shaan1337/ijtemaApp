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
      description: "Peace be on you and the mercy and blessings of Allah. Welcome to the official app for the <b>Majlis Khuddam-ul-Ahmadiyya Mauritius National Ijtema 2017</b>! To get started, swipe to the next slides to view some features of the app.",
      image: "assets/img/logo.svg",
    },
    {
      title: "Stay tuned",
      description: "View the <b>Program</b> and stay tuned throughout the Ijtema by browsing the <b>News</b> section",
      image: "assets/img/welcome-slide-1.png",
    },
    {
      title: "Register for Competitions",
      description: "Book your place for <b>Literary</b> or <b>Sports</b> competitions right from the app",
      image: "assets/img/welcome-slide-1.png",
    },
    {
      title: "Be Social!",
      description: "Use hashtag <b>#ijtemamu</b> to share your amazing photos to <b>Instagram</b> or <b>Twitter</b>",
      image: "assets/img/welcome-slide-1.png"
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
