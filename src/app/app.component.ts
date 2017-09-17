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

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = ProgrammePage;

  pages: Array<{title: string, component: any, icon: string}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, private storage: Storage) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Programme', component: ProgrammePage , icon: 'list-box'},
      { title: 'Competitions', component: CompetitionsPage, icon: 'trophy' },
      { title: 'Leaderboard', component: LeaderboardPage, icon: 'podium' },
      { title: 'News', component: NewsPage, icon: 'information-circle' },      
      { title: 'Social Networks', component: SocialPage, icon: 'logo-twitter' }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      this.storage.get('welcomeCompleted').then((val) => {
        if(val==undefined){
          this.openWelcomePage();          
        }
      });


    });
  }

  openWelcomePage(){
    this.nav.push(WelcomePage);
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
