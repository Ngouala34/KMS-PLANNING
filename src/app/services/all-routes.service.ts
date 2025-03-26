import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AllRoutesService {

  constructor(private router : Router) { }

  OnPayment(): void {
    this.router.navigateByUrl('payment')// Redirige vers la page de paiement
  }
  OnService(): void{
    this.router.navigateByUrl('service-list')
  } 
  OnLogin(): void {
    this.router.navigateByUrl('login');
  }
  OnRegister(): void {
    this.router.navigateByUrl('user-register');
  }
  OnChosseFunction(): void {
    this.router.navigateByUrl('choose-function-page');
  }
  Ondeconnexion():void{
    this.router.navigateByUrl('')
   }

   OnUserCalendrierEnCour(): Promise<boolean> {
    return this.router.navigate(['/user-calendrier']); //  Retourne une Promise
  }


//Les routes liées à un utilisateur
OnUserConnexion(): void {
  this.router.navigateByUrl('user-home');
}
OnUserService(): void {
  this.router.navigateByUrl('user-serv');
}
OnUserdashboard(): void {
  this.router.navigateByUrl('user-dashboard');
}
OnUserprofile(): void {
  this.router.navigateByUrl('user-profile');
} 
OnUserHistorique(): void {
  this.router.navigateByUrl('user-historique');
}
OnUserCalendrier(): void {
  this.router.navigateByUrl('user-calendrier');
 }



  //Les routes liées à un expert 

  OnExpertService(): void {
    this.router.navigateByUrl('expert-services');
  }
  OnExpertdashboard(): void {
    this.router.navigateByUrl('dashboard-expert');
  }
  OnExpertprofile(): void {
    this.router.navigateByUrl('expert-profile');
  } 
   OnExpertHistorique(): void {
    this.router.navigateByUrl('expert-historique');
  }
  OnExpertCalendrier(): void {
    this.router.navigateByUrl('expert-calendrier');
  }
  OnCreateCourse() : void {
    this.router.navigateByUrl('create-course');
  }
      
}
