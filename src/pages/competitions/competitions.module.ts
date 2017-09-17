import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CompetitionsPage } from './competitions';

@NgModule({
  declarations: [
    CompetitionsPage,
  ],
  imports: [
    IonicPageModule.forChild(CompetitionsPage),
  ],
})
export class CompetitionsPageModule {}
