import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './landing/landing-page/landing-page.component';
import { SidebarComponent } from './user/sidebar/sidebar.component';
import { UserHomeComponent } from './user/user-home/user-home.component';
import { UserServComponent } from './user/user-favoris/user-serv.component';
import { UserSouscriptionComponent } from './user/user-souscription/user-souscription.component';
import { PaymentComponent } from './payment/payment.component';
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
import { StatsSectionComponent } from './landing/stats-section/stats-section.component';
import { AvisCarouselComponent } from './landing/avis-carousel/avis-carousel.component';
import { BecomeExpertPageComponent } from './Expert/become-expert-page/become-expert-page.component';
import { ExpertRegisterComponent } from './Expert/expert-register/expert-register.component';
import { ServiceDetailsComponent } from './service-details/service-details.component';
import { ExpertFormationComponent } from './Expert/expert-formation/expert-formation.component';
import { ExpertRendezVousComponent } from './Expert/expert-rendez-vous/expert-rendez-vous.component';
import { ExpertSettingsComponent } from './Expert/expert-settings/expert-settings.component';

const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'landing', component: LandingPageComponent },
  { path: 'sidebar', component: SidebarComponent },
  { path: 'login', component: LoginComponent },  
  { path: 'user-home', component: UserHomeComponent },
  { path: 'user-serv', component: UserServComponent },
  { path: 'user-register', component: UserRegisterComponent },
  { path: 'user-souscriptions', component: UserSouscriptionComponent },
  { path: 'user-dashboard', component: UserDashboardComponent },
  { path: 'user-historique', component: UserHistoriqueComponent },
  { path: 'user-calendrier', component: UserCalendrierComponent },
  { path: 'user-parameter', component: UserParameterComponent },

 
  { path: 'dashboard-expert', component: DashboardExpertComponent },
  { path: 'expert-service', component: ExpertServiceComponent },
  { path: 'header-expert', component: HeaderExpertComponent },
  { path: 'become-expert-page', component: BecomeExpertPageComponent },
  { path: 'expert-register', component: ExpertRegisterComponent },
  { path: 'expert-formation', component: ExpertFormationComponent },
  { path: 'expert-rendez-vous', component: ExpertRendezVousComponent },
  { path: 'expert-settings', component: ExpertSettingsComponent },


  
  { path: 'service-details', component: ServiceDetailsComponent },
  { path: 'payment', component: PaymentComponent },
  { path: 'create-course', component: CreateCourseComponent },
  { path: 'revenue-chart', component: RevenueChartComponent },
  { path: 'sidebar-expert', component: SidebarComponent },
  { path: 'service-list', component: ServiceListComponent},
  { path: 'stats-section', component: StatsSectionComponent },
  { path: 'avis-carousel', component: AvisCarouselComponent },


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
