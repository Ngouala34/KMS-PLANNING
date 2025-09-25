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
import { DashboardExpertComponent } from './Expert/dashboard-expert/dashboard-expert.component';
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
import { MainExpertComponent } from './Expert/_main-expert/main-expert.component';
import { MainUserComponent } from './user/_main-user/main-user.component';
import { CalendarPageComponent } from './user/calendar-page/calendar-page.component';
import { UserNotificationService } from './services/user/userNotification.service';
import { UserNotificationsComponent } from './user/user-notifications/user-notifications.component';

const routes: Routes = [
 



  { path: '', component: LandingPageComponent },
  { path: 'landing', component: LandingPageComponent },
  { path: 'login', component: LoginComponent },  
  { path: 'contact', component: ContactComponent },
  { path: 'a-propos', component: AProposComponent },
  { path: 'service-list', component: ServiceListComponent},
  { path: 'service-details/:id', component: ServiceDetailsComponent },


  { path: 'user-register', component: UserRegisterComponent },
  { path: 'sidebar',canActivate : [AuthGuard],  component: SidebarComponent },
  { path: 'user-serv', canActivate : [AuthGuard], component: UserServComponent },

  { path: 'main-user', canActivate : [AuthGuard], component: MainUserComponent,
    children : [
        { path: 'user-dashboard',canActivate : [AuthGuard],  component: UserDashboardComponent },
        { path: 'user-settings',canActivate : [AuthGuard],  component: UserParameterComponent },
        { path: 'user-souscriptions',canActivate : [AuthGuard],  component: UserSouscriptionComponent },
        { path: 'user-calendar',component : CalendarPageComponent},
        { path: 'user-notification', component : UserNotificationsComponent}

    ]
  },

 
  { path: 'expert-register', component: ExpertRegisterComponent },
  { path: 'sidebar-expert',canActivate : [AuthGuard], component: SidebarComponent },
  { path: 'header-expert', canActivate : [AuthGuard], component: HeaderExpertComponent },
  { path: 'create-course',canActivate : [AuthGuard], component: CreateCourseComponent },
  { path: 'revenue-chart',canActivate : [AuthGuard], component: RevenueChartComponent },

    {
    path: 'main-expert',
    canActivate: [AuthGuard],
    component: MainExpertComponent,
    children: [
      { path: 'dashboard-expert', component: DashboardExpertComponent,  },
      { path: 'expert-formation', component: ExpertFormationComponent,   },
      { path: 'expert-rendez-vous', component: ExpertRendezVousComponent,  },
      { path: 'expert-settings', component: ExpertSettingsComponent,  },
      { path: '', redirectTo: 'dashboard-expert', pathMatch: 'full' } // par défaut
    ]
  },


  




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
