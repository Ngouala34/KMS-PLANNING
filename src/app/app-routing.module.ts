import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FaceSnapListComponent } from './face-snap-list/face-snap-list.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { SingleFaceSnapComponent } from './single-face-snap/single-face-snap.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { SignupComponent } from './signup/signup.component';
import { UserLoginComponent } from './login/user-login/user-login.component';
import { ExpertLoginComponent } from './login/expert-login/expert-login.component';

const routes: Routes = [
  { path: 'facesnaps/:id', component: SingleFaceSnapComponent },
  { path: 'facesnaps', component: FaceSnapListComponent },
  { path: '', component: LandingPageComponent },
  { path: 'sidebar', component: SidebarComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'user-login', component: UserLoginComponent },
  { path: 'expert-login', component: ExpertLoginComponent }





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
