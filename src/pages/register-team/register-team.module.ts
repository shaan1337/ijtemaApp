import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RegisterTeamPage } from './register-team';

@NgModule({
  declarations: [
    RegisterTeamPage,
  ],
  imports: [
    IonicPageModule.forChild(RegisterTeamPage),
  ],
})
export class RegisterTeamPageModule {}
