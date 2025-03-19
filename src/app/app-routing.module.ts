import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ExpertLoginComponent } from './Expert/expert-login/expert-login.component';
import { ChooseFunctionPageComponent } from './choose-function-page/choose-function-page.component';
import { UserHomeComponent } from './user-home/user-home.component';
import { UserServComponent } from './user-serv/user-serv.component';
import { UserSouscriptionsComponent } from './user-souscription/user-souscription.component';
import { PaymentComponent } from './payment/payment.component';
import { CreateCourseComponent } from './Expert/create-course/create-course.component';
import { RevenueChartComponent } from './Expert/charts/revenue-chart/revenue-chart.component';
import { UserRegisterComponent } from './user-register/user-register.component';
import { LoginComponent } from './login/login/login.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { UserHistoriqueComponent } from './user-historique/user-historique.component';
import { UserCalendrierComponent } from './user-calendrier/user-calendrier.component';
import { DashboardExpertComponent } from './dashboard-expert/dashboard-expert.component';
import { ExpertServiceComponent } from './expert-service/expert-service.component';
import { HeaderExpertComponent } from './header-expert/header-expert.component';

const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'sidebar', component: SidebarComponent },
  { path: 'login', component: LoginComponent },  
  { path: 'user-home', component: UserHomeComponent },
  { path: 'user-serv', component: UserServComponent },
  { path: 'user-register', component: UserRegisterComponent },
  { path: 'user-souscriptions', component: UserSouscriptionsComponent },
  { path: 'user-dashboard', component: UserDashboardComponent },
  { path: 'user-historique', component: UserHistoriqueComponent },
  { path: 'user-calendrier', component: UserCalendrierComponent },
 
  { path: 'dashboard-expert', component: DashboardExpertComponent },
  { path: 'expert-service', component: ExpertServiceComponent },
  { path: 'header-expert', component: HeaderExpertComponent },
  

  { path: 'payment', component: PaymentComponent },
  { path: 'expert-login', component: ExpertLoginComponent },
  { path: 'choose-function-page', component: ChooseFunctionPageComponent },
  { path: 'create-course', component: CreateCourseComponent },
  { path: 'revenue-chart', component: RevenueChartComponent },
  { path: 'sidebar-expert', component: SidebarComponent },




 




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
