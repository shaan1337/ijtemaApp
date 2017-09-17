import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProgrammePage } from './programme';

@NgModule({
  declarations: [
    ProgrammePage,
  ],
  imports: [
    IonicPageModule.forChild(ProgrammePage),
  ],
})
export class ProgrammePageModule {}
