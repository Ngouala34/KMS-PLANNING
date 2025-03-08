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
import { DashbordComponent } from './Expert/dashbord/dashbord.component';
import { CreateCourseComponent } from './Expert/create-course/create-course.component';
import { NgChartsModule } from 'ng2-charts';
import { RevenueChartComponent } from './Expert/charts/revenue-chart/revenue-chart.component';
import { SidebarExpertComponent } from './sidebar-expert/sidebar-expert.component';
import { UserRegisterComponent } from './user-register/user-register.component';
import { AuthService } from './services/auth.service';



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
    DashbordComponent,
    CreateCourseComponent,
    RevenueChartComponent,
    SidebarExpertComponent,
    UserRegisterComponent,
    
    
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgChartsModule,
    FormsModule,

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
