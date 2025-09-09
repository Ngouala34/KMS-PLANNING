import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './landing/landing-page/landing-page.component';
import { SidebarComponent } from './user/sidebar/sidebar.component';
import { UserServComponent } from './user/user-favoris/user-serv.component';
import { UserSouscriptionComponent } from './user/user-souscription/user-souscription.component';
import { CreateCourseComponent } from './Expert/create-course/create-course.component';
import { RevenueChartComponent } from './Expert/charts/revenue-chart/revenue-chart.component';
import { UserRegisterComponent } from './user/user-register/user-register.component';
import { LoginComponent } from './login/login/login.component';
import { UserDashboardComponent } from './user/user-dashboard/user-dashboard.component';
import { UserHistoriqueComponent } from './user/user-historique/user-historique.component';
import { UserCalendrierComponent } from './user/user-calendrier/user-calendrier.component';
import { DashboardExpertComponent } from './Expert/dashboard-expert/dashboard-expert.component';
import { ExpertServiceComponent } from './Expert/expert-service/expert-service.component';
import { HeaderExpertComponent } from './Expert/header-expert/header-expert.component';
import { ServiceListComponent } from './service-list/service-list.component';
import { UserParameterComponent } from './user/user-parameter/user-parameter.component';
import { ExpertRegisterComponent } from './Expert/expert-register/expert-register.component';
import { ServiceDetailsComponent } from './service-details/service-details.component';
import { ExpertFormationComponent } from './Expert/expert-formation/expert-formation.component';
import { ExpertRendezVousComponent } from './Expert/expert-rendez-vous/expert-rendez-vous.component';
import { ExpertSettingsComponent } from './Expert/expert-settings/expert-settings.component';
import { ContactComponent } from './landing/contact/contact.component';
import { AProposComponent } from './landing/a-propos/a-propos.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [




  { path: '', component: LandingPageComponent },
  { path: 'landing', component: LandingPageComponent },
  { path: 'login', component: LoginComponent },  
  { path: 'contact', component: ContactComponent },
  { path: 'a-propos', component: AProposComponent },
  { path: 'service-list', component: ServiceListComponent},
  { path: 'service-details', component: ServiceDetailsComponent },


  { path: 'user-register', component: UserRegisterComponent },
  { path: 'sidebar',canActivate : [AuthGuard],  component: SidebarComponent },
  { path: 'user-souscriptions',canActivate : [AuthGuard],  component: UserSouscriptionComponent },
  { path: 'user-dashboard',canActivate : [AuthGuard],  component: UserDashboardComponent },
  { path: 'user-serv', canActivate : [AuthGuard], component: UserServComponent },
  { path: 'user-historique',canActivate : [AuthGuard],  component: UserHistoriqueComponent },
  { path: 'user-calendrier',canActivate : [AuthGuard],  component: UserCalendrierComponent },
  { path: 'user-parameter',canActivate : [AuthGuard],  component: UserParameterComponent },

 
  { path: 'expert-register', component: ExpertRegisterComponent },
  { path: 'sidebar-expert',canActivate : [AuthGuard], component: SidebarComponent },
  { path: 'dashboard-expert',canActivate : [AuthGuard],  component: DashboardExpertComponent },
  { path: 'expert-service',canActivate : [AuthGuard],  component: ExpertServiceComponent },
  { path: 'header-expert', canActivate : [AuthGuard], component: HeaderExpertComponent },
  { path: 'expert-formation', canActivate : [AuthGuard], component: ExpertFormationComponent },
  { path: 'expert-rendez-vous', canActivate : [AuthGuard], component: ExpertRendezVousComponent },
  { path: 'expert-settings', canActivate : [AuthGuard], component: ExpertSettingsComponent },  
  { path: 'create-course',canActivate : [AuthGuard], component: CreateCourseComponent },
  { path: 'revenue-chart',canActivate : [AuthGuard], component: RevenueChartComponent },


  




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
