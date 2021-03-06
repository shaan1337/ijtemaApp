import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { WelcomePage } from '../pages/welcome/welcome';
import { ProgrammePage } from '../pages/programme/programme';
import { CompetitionsPage } from '../pages/competitions/competitions';
import { LeaderboardPage } from '../pages/leaderboard/leaderboard';
import { NewsPage } from '../pages/news/news';
import { SocialPage } from '../pages/social/social';

import { Storage } from '@ionic/storage';
import { Firebase } from '@ionic-native/firebase';
import { Http } from '@angular/http';
import { ApiProvider } from '../providers/api/api';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = ProgrammePage;

  pages: Array<{title: string, component: any, icon: string}>;

  //Note: incrementing the major or minor version will clear the local storage! Patch version can be incremented without any effect on local storage.
  version: string = '2019.01.01';

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, private storage: Storage, private firebase: Firebase, private apiProvider: ApiProvider, private http: Http) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Programme', component: ProgrammePage , icon: 'list-box'},
      { title: 'Competitions', component: CompetitionsPage, icon: 'trophy' },
      { title: 'Leaderboard', component: LeaderboardPage, icon: 'podium' },
      { title: 'News', component: NewsPage, icon: 'information-circle' },
      { title: 'Social Networks', component: SocialPage, icon: 'thumbs-up' }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      this.initializeFirebase();

      this.performVersionUpgrade()
      .then(()=>{
        this.storage.get('welcomeCompleted').then((val) => {
          if(val==undefined){
            this.openWelcomePage();
          }
        });
      });
    });
  }

  performVersionUpgrade(){
    return this.storage.get('app-version')
    .then((v)=>{
      if(v!=null && (v.substring(0,7) < this.version.substring(0,7))){
        return this.storage.clear();
      }
    })
    .then(()=>{
      //save version to manage app updates
      this.storage.set('app-version',this.version);
    })
  }

  openWelcomePage(){
    this.nav.push(WelcomePage);
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  initializeFirebase(){
    if(this.platform.is('cordova')){
      this.firebase.getToken()
      .then(token => {
        return this.http.post(this.apiProvider.getAPIURL()+'/firebase-registrations/', {token: token}).toPromise()
      })
      .catch(error => console.error('Error getting token', error));

      this.firebase.onTokenRefresh()
      .subscribe((token: string) => {
        this.http.post(this.apiProvider.getAPIURL()+'/firebase-registrations/', {token: token}).toPromise();
      });

      var o = this;
      (<any>window).FirebasePlugin.onMessageReceived(function(message) {
        o.nav.setRoot(NewsPage);
      }, function(error) {
        console.error(error);
      });
    }
  }
}
