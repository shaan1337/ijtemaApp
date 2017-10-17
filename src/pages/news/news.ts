import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
import { ApiProvider } from '../../providers/api/api';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the NewsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-news',
  templateUrl: 'news.html',
})
export class NewsPage {
  news:any[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage, public apiProvider:ApiProvider,public http: Http) {
  }

  loadNews(loadFromWeb, callback){
    return this.storage.get('news')
    .then((val)=>{
      if(loadFromWeb){
        this.http.get(this.apiProvider.getAPIURL() + '/news').map(res => res.json()).subscribe(data => {
          this.storage.set('news',JSON.stringify(data));
          if(callback)      
            setTimeout(callback, 1000);          
        });
      }

      if(!val) this.news = [];
      else this.news = JSON.parse(val);      
      return this.news;
    });    
  }

  ionViewDidEnter() {
    this.loadNews(true, () =>{
      this.loadNews(false,false);
    });

    setInterval(()=>{
      this.loadNews(true, () =>{
        this.loadNews(false,false);
      });
    },20*1000);
  }

}
