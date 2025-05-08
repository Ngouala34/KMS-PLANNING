import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { registerLocaleData } from '@angular/common';
import * as fr from '@angular/common/locales/fr';

import { AppComponent } from './app.component';
import { HeaderComponent } from './shared/header/header.component';
import { AppRoutingModule } from './app-routing.module';
import { LandingPageComponent } from './landing/landing-page/landing-page.component';
import { SidebarComponent } from './user/sidebar/sidebar.component';
import { LoginComponent } from './login/login/login.component';
import { FooterComponent } from './shared/footer/footer.component';
import { UserHomeComponent } from './user/user-home/user-home.component';
import { UserServComponent } from './user/user-favoris/user-serv.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PaymentComponent } from './payment/payment.component';
import { CreateCourseComponent } from './Expert/create-course/create-course.component';
import { NgChartsModule } from 'ng2-charts';
import { RevenueChartComponent } from './Expert/charts/revenue-chart/revenue-chart.component';
import { SidebarExpertComponent } from './Expert/sidebar-expert/sidebar-expert.component';
import { UserRegisterComponent } from './user/user-register/user-register.component';
import { AuthService } from './services/auth.service';
import { UserDashboardComponent } from './user/user-dashboard/user-dashboard.component';
import { UserHistoriqueComponent } from './user/user-historique/user-historique.component';
import { UserCalendrierComponent } from './user/user-calendrier/user-calendrier.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { DashboardExpertComponent } from './Expert/dashboard-expert/dashboard-expert.component';
import { ExpertServiceComponent } from './Expert/expert-service/expert-service.component';
import { HeaderExpertComponent } from './Expert/header-expert/header-expert.component';
import { ServiceListComponent } from './service-list/service-list.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UserParameterComponent } from './user/user-parameter/user-parameter.component';
import { PopupExpertsComponent } from './Expert/popup-experts/popup-experts.component';
import { StatsSectionComponent } from './landing/stats-section/stats-section.component';
import { AvisCarouselComponent } from './landing/avis-carousel/avis-carousel.component';
import { FaqComponent } from './landing/faq/faq.component';
import { HeroSectionComponent } from './landing/hero-section/hero-section.component';
import { PopularServicesComponent } from './landing/popular-services/popular-services.component';
import { AppearOnScrollDirective } from './directives/appear-on-scroll.directive';
import { NavlandingComponent } from './landing/navlanding/navlanding.component';
import { BecomeExpertPageComponent } from './Expert/become-expert-page/become-expert-page.component';
import { ExpertRegisterComponent } from './Expert/expert-register/expert-register.component';
import { ServiceDetailsComponent } from './service-details/service-details.component';
import { ServiceDetailsAvisComponent } from './service-details-avis/service-details-avis.component';
import { ProchainRendezVousComponent } from './Expert/prochain-rendez-vous/prochain-rendez-vous.component';
import { ExpertFormationComponent } from './Expert/expert-formation/expert-formation.component';
import { ExpertRendezVousComponent } from './Expert/expert-rendez-vous/expert-rendez-vous.component';
import { MatIconModule } from '@angular/material/icon';
import { NotificationIconComponent } from './shared/notification-icon/notification-icon.component';
import { MatBadgeModule } from '@angular/material/badge';
import { ExpertSettingsComponent } from './Expert/expert-settings/expert-settings.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LandingPageComponent,
    SidebarComponent,
    LoginComponent,
    FooterComponent,
    UserHomeComponent,
    UserServComponent,
    PaymentComponent,
    CreateCourseComponent,
    RevenueChartComponent,
    SidebarExpertComponent,
    UserRegisterComponent,
    UserDashboardComponent,
    UserHistoriqueComponent,
    UserCalendrierComponent,
    DashboardExpertComponent,
    ExpertServiceComponent,
    HeaderExpertComponent,
    ServiceListComponent,
    UserParameterComponent,
    PopupExpertsComponent,
    StatsSectionComponent,
    AvisCarouselComponent,
    FaqComponent,
    HeroSectionComponent,
    PopularServicesComponent,
    AppearOnScrollDirective,
    NavlandingComponent,
    BecomeExpertPageComponent,
    ExpertRegisterComponent,
    ServiceDetailsComponent,
    ServiceDetailsAvisComponent,
    ProchainRendezVousComponent,
    ExpertFormationComponent,
    ExpertRendezVousComponent,
    NotificationIconComponent,
    ExpertSettingsComponent,
    
    
    
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgChartsModule,
    FormsModule,
    ReactiveFormsModule,
    FullCalendarModule,
    BrowserAnimationsModule,
    MatIconModule, 
    MatBadgeModule,
    


  ],
  exports: [HeaderComponent],
  providers: [
    AuthService,
    { provide: LOCALE_ID, useValue: 'fr-FR' },
    
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
  constructor() {
    registerLocaleData(fr.default);
  }
}
