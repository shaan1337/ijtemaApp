import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, InfiniteScroll } from 'ionic-angular';
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
  @ViewChild('content') content:any;
  news:any[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage, public apiProvider:ApiProvider,public http: Http) {
  }

  loadNews(loadFromWeb, callback){
    return this.storage.get('news')
    .then((val)=>{
      if(!val) this.news = [];
      else this.news = JSON.parse(val);  
      
      var from = -1;
      if(this.news.length > 0){
        from = this.news[this.news.length-1]['_id'];
      }

      console.log('Loading from: '+from);
      if(loadFromWeb){
        this.http.get(this.apiProvider.getAPIURL() + '/news'+'/'+from).map(res => res.json()).subscribe(data => {
          for(var i=0;i<data.length;i++){
            this.news.push(data[i]);
          }

          this.storage.set('news',JSON.stringify(this.news));
          if(callback)      
            setTimeout(callback, 1000);          
        });
      }
    
      return this.news;
    });    
  }

  loadMore(infiniteScroll: InfiniteScroll) {
    this.loadNews(true, () =>{
      infiniteScroll.complete();
    });
  }

  scrollToBottom(){
    this.content.scrollToBottom(300);
  }

  ionViewDidEnter() {    
    this.loadNews(true, () =>{
      this.scrollToBottom();
    });
  }

}
