import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FaceSnapListComponent } from './face-snap-list/face-snap-list.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { SingleFaceSnapComponent } from './single-face-snap/single-face-snap.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { SignupComponent } from './login/signup/signup.component';
import { UserLoginComponent } from './user-login/user-login.component';
import { ExpertLoginComponent } from './expert-login/expert-login.component';
import { ChooseFunctionPageComponent } from './choose-function-page/choose-function-page.component';
import { UserHomeComponent } from './user-home/user-home.component';
import { UserServComponent } from './user-serv/user-serv.component';
import { UserSouscriptionsComponent } from './user-souscription/user-souscription.component';

const routes: Routes = [
  { path: 'facesnaps/:id', component: SingleFaceSnapComponent },
  { path: 'facesnaps', component: FaceSnapListComponent },
  { path: '', component: LandingPageComponent },
  { path: 'sidebar', component: SidebarComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'user-login', component: UserLoginComponent },
  { path: 'user-home', component: UserHomeComponent },
  { path: 'user-serv', component: UserServComponent },
  { path: 'user-souscriptions', component: UserSouscriptionsComponent },

  { path: 'expert-login', component: ExpertLoginComponent },
  { path: 'choose-function-page', component: ChooseFunctionPageComponent }






];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {}
