import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Http } from '@angular/http';
import { ApiProvider } from '../../providers/api/api';

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
  leaderboard: any[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage, public http: Http, public apiProvider: ApiProvider) {
  }

  loadLeaderboard(loadFromWeb, callback){
    return this.storage.get('leaderboard')
    .then((val)=>{
      if(loadFromWeb){
        this.http.get(this.apiProvider.getAPIURL() + '/leaderboard').map(res => res.json()).subscribe(data => {
          this.storage.set('leaderboard',JSON.stringify(data));
          if(callback)      
            setTimeout(callback, 1000);          
        });
      }

      if(!val) this.leaderboard = [];
      else this.leaderboard = JSON.parse(val);      
      return this.leaderboard;
    });    
  }

  ionViewDidEnter() {
    this.loadLeaderboard(true, () =>{
      this.loadLeaderboard(false,false);
    });

    setInterval(()=>{
      this.loadLeaderboard(true, () =>{
        this.loadLeaderboard(false,false);
      });
    },20*1000);
  }
}
