import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { registerLocaleData } from '@angular/common';
import * as fr from '@angular/common/locales/fr';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Angular Material
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';

// NgCharts & FullCalendar
import { NgChartsModule } from 'ng2-charts';
import { FullCalendarModule } from '@fullcalendar/angular';

// Intercepteur
import { AuthInterceptor } from './interceptors/auth.interceptor';

// Services
import { AuthService } from './services/auth.service';

// Shared components
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { NotificationIconComponent } from './shared/notification-icon/notification-icon.component';

// Landing components
import { LandingPageComponent } from './landing/landing-page/landing-page.component';
import { HeroSectionComponent } from './landing/hero-section/hero-section.component';
import { StatsSectionComponent } from './landing/stats-section/stats-section.component';
import { AvisCarouselComponent } from './landing/avis-carousel/avis-carousel.component';
import { FaqComponent } from './landing/faq/faq.component';
import { NavlandingComponent } from './landing/navlanding/navlanding.component';
import { ContactComponent } from './landing/contact/contact.component';
import { AProposComponent } from './landing/a-propos/a-propos.component';
import { MapIframeComponent } from './landing/map-iframe/map-iframe.component';
import { PopularServicesComponent } from './landing/popular-services/popular-services.component';

// User components
import { SidebarComponent } from './user/sidebar/sidebar.component';
import { UserServComponent } from './user/user-favoris/user-serv.component';
import { UserRegisterComponent } from './user/user-register/user-register.component';
import { UserDashboardComponent } from './user/user-dashboard/user-dashboard.component';
import { UserDashboardStatsComponent } from './user/user-dashboard/user-dashboard-stats/user-dashboard-stats.component';
import { UserDashboardRendezVousComponent } from './user/user-dashboard/user-dashboard-rendez-vous/user-dashboard-rendez-vous.component';
import { UserHistoriqueComponent } from './user/user-historique/user-historique.component';
import { UserCalendrierComponent } from './user/user-calendrier/user-calendrier.component';
import { UserParameterComponent } from './user/user-parameter/user-parameter.component';
import { UserSouscriptionComponent } from './user/user-souscription/user-souscription.component';
import { LoginComponent } from './login/login/login.component';

// Expert components
import { SidebarExpertComponent } from './Expert/sidebar-expert/sidebar-expert.component';
import { DashboardExpertComponent } from './Expert/dashboard-expert/dashboard-expert.component';
import { ExpertServiceComponent } from './Expert/expert-service/expert-service.component';
import { HeaderExpertComponent } from './Expert/header-expert/header-expert.component';
import { PopupExpertsComponent } from './Expert/popup-experts/popup-experts.component';
import { ExpertRegisterComponent } from './Expert/expert-register/expert-register.component';
import { CreateCourseComponent } from './Expert/create-course/create-course.component';
import { RevenueChartComponent } from './Expert/charts/revenue-chart/revenue-chart.component';
import { ProchainRendezVousComponent } from './Expert/prochain-rendez-vous/prochain-rendez-vous.component';
import { ExpertFormationComponent } from './Expert/expert-formation/expert-formation.component';
import { ExpertRendezVousComponent } from './Expert/expert-rendez-vous/expert-rendez-vous.component';
import { ExpertSettingsComponent } from './Expert/expert-settings/expert-settings.component';

// Service components
import { ServiceListComponent } from './service-list/service-list.component';
import { ServiceDetailsComponent } from './service-details/service-details.component';
import { ServiceDetailsAvisComponent } from './service-details-avis/service-details-avis.component';

// Directives
import { AppearOnScrollDirective } from './directives/appear-on-scroll.directive';
import { SlideInOnScrollDirective } from './directives/app-slide-in-on-scroll.directive';
import { ZoomInOnScrollDirective } from './directives/zoom-in-on-scroll.directive';

@NgModule({
  declarations: [
    AppComponent,
    // Shared
    HeaderComponent,
    FooterComponent,
    NotificationIconComponent,
    // Landing
    LandingPageComponent,
    HeroSectionComponent,
    StatsSectionComponent,
    AvisCarouselComponent,
    FaqComponent,
    NavlandingComponent,
    ContactComponent,
    AProposComponent,
    MapIframeComponent,
    PopularServicesComponent,
    // User
    SidebarComponent,
    UserServComponent,
    UserRegisterComponent,
    UserDashboardComponent,
    UserDashboardStatsComponent,
    UserDashboardRendezVousComponent,
    UserHistoriqueComponent,
    UserCalendrierComponent,
    UserParameterComponent,
    UserSouscriptionComponent,
    LoginComponent,
    // Expert
    SidebarExpertComponent,
    DashboardExpertComponent,
    ExpertServiceComponent,
    HeaderExpertComponent,
    PopupExpertsComponent,
    ExpertRegisterComponent,
    CreateCourseComponent,
    RevenueChartComponent,
    ProchainRendezVousComponent,
    ExpertFormationComponent,
    ExpertRendezVousComponent,
    ExpertSettingsComponent,
    // Services
    ServiceListComponent,
    ServiceDetailsComponent,
    ServiceDetailsAvisComponent,
    // Directives
    AppearOnScrollDirective,
    SlideInOnScrollDirective,
    ZoomInOnScrollDirective,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatBadgeModule,
    NgChartsModule,
    FullCalendarModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'fr-FR' },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
    registerLocaleData(fr.default);
  }
}
