import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the LeaderboardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-leaderboard',
  templateUrl: 'leaderboard.html',
})
export class LeaderboardPage {
  leaderboard: any[] = [
    {name: 'Quatre-Bornes', points: 115, rank: 1},
    {name: 'Rose-Hill', points: 110, rank: 2},
    {name: 'Trefles', points: 95, rank: 3},
    {name: 'Stanley', points: 90, rank: 4}
  ];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

}
