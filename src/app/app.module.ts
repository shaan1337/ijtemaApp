import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { WelcomePage } from '../pages/welcome/welcome';
import { ProgrammePage } from '../pages/programme/programme';
import { CompetitionsPage } from '../pages/competitions/competitions';
import { LeaderboardPage } from '../pages/leaderboard/leaderboard';
import { NewsPage } from '../pages/news/news';
import { SocialPage } from '../pages/social/social';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { IonicStorageModule } from '@ionic/storage';
import { ProgrammeProvider } from '../providers/programme/programme';
import { HttpModule } from '@angular/http';
import { PersonaldetailsPage } from '../pages/personaldetails/personaldetails';
import { RegisterTeamPage } from '../pages/register-team/register-team';
import { RankTransformPipe } from '../pipes/rank-transform/rank-transform';
import { ApiProvider } from '../providers/api/api';
import { Firebase } from '@ionic-native/firebase';
import { TimeElapsedPipe } from '../pipes/time-elapsed/time-elapsed';

@NgModule({
  declarations: [
    MyApp,
    WelcomePage,
    ProgrammePage,
    CompetitionsPage,
    LeaderboardPage,
    NewsPage,
    SocialPage,
    PersonaldetailsPage,
    RegisterTeamPage,
    RankTransformPipe,
    TimeElapsedPipe
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    WelcomePage,
    ProgrammePage,
    CompetitionsPage,
    LeaderboardPage,
    NewsPage,
    SocialPage,
    PersonaldetailsPage,
    RegisterTeamPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ProgrammeProvider,
    ApiProvider,
    Firebase
  ]
})
export class AppModule {}
