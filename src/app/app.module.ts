import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { registerLocaleData } from '@angular/common';
import * as fr from '@angular/common/locales/fr';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { AppRoutingModule } from './app-routing.module';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { LoginComponent } from './login/login/login.component';
import { ExpertLoginComponent } from './Expert/expert-login/expert-login.component';
import { FooterComponent } from './footer/footer.component';
import { ChooseFunctionPageComponent } from './choose-function-page/choose-function-page.component';
import { UserHomeComponent } from './user-home/user-home.component';
import { UserServComponent } from './user-serv/user-serv.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PaymentComponent } from './payment/payment.component';
import { CreateCourseComponent } from './Expert/create-course/create-course.component';
import { NgChartsModule } from 'ng2-charts';
import { RevenueChartComponent } from './Expert/charts/revenue-chart/revenue-chart.component';
import { SidebarExpertComponent } from './sidebar-expert/sidebar-expert.component';
import { UserRegisterComponent } from './user-register/user-register.component';
import { AuthService } from './services/auth.service';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { UserHistoriqueComponent } from './user-historique/user-historique.component';
import { UserCalendrierComponent } from './user-calendrier/user-calendrier.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { DashboardExpertComponent } from './dashboard-expert/dashboard-expert.component';
import { ExpertServiceComponent } from './expert-service/expert-service.component';
import { HeaderExpertComponent } from './header-expert/header-expert.component';
import { ServiceListComponent } from './service-list/service-list.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UserParameterComponent } from './user-parameter/user-parameter.component';
import { PopupExpertsComponent } from './popup-experts/popup-experts.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LandingPageComponent,
    SidebarComponent,
    LoginComponent,
    ExpertLoginComponent,
    FooterComponent,
    ChooseFunctionPageComponent,
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
    
    
    
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgChartsModule,
    FormsModule,
    FullCalendarModule,
    BrowserAnimationsModule,

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
