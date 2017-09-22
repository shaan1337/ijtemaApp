import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the ProgrammePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-programme',
  templateUrl: 'programme.html',
})
export class ProgrammePage {

  programmes = [
    { type: 'day', title:'Friday 28th October'},
    { type: 'program', time: '10:00', title: 'Jummah Prayer with Asr' },
    { type: 'program', time: '13:45', title: 'Hoisting of Flag & Du\'a' },
    { type: 'competition', time: '14:00', title: 'Fun Games' },
    { type: 'program', time: '15:00', title: 'Tea' },
    { type: 'program', time: '17:30', title: 'Dinner' },
    { type: 'program', time: '18:30', title: 'Maghrib & Isha Prayers' },
    { type: 'program', time: '18:50', title: 'Tilawat Qur\'an' },
    { type: 'program', time: '19:00', title: 'Ahad' },
    { type: 'day', title:'Saturday 29th October'},    
    { type: 'competition', time: '19:00', title: 'Competitions - Open to All' },
    { type: 'program', time: '19:00', title: 'Ahad' },
  ];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProgrammePage');
  }

}
