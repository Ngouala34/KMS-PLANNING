import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { AllRoutesService } from '../services/all-routes.service';
import { PopupExpertsComponent } from '../popup-experts/popup-experts.component';

@Component({
  selector: 'app-user-home',
  templateUrl: './user-home.component.html',
  styleUrls: ['./user-home.component.scss']
})
export class UserHomeComponent implements OnInit {
  username: string = '';// Initialise le nom d'utilisateur à une chaîne vide
  email: string = '';  
  userId: any;
  
  collapsedByDefault = false;
  isSidebarCollapsed = false;

  constructor(private router : Router, private authService: AuthService, private allRoutesService :AllRoutesService) { }

  ngOnInit(): void {
 
  }
  OnService(): void {
    this.allRoutesService.OnService();  // Appel de la fonction du service
  }
  OnCalendrier(): void {
     this.allRoutesService.OnUserCalendrier(); 
  }
  OnFavoris(): void {
    this.allRoutesService.OnUserService
  }
  OnCalendrierEnCour(): void {
    this.allRoutesService.OnUserCalendrierEnCour().then(() => {
      // Attendre un petit moment après la navigation pour s'assurer que le DOM est bien chargé
      setTimeout(() => {
        const bouton = document.querySelector('.legend-btn.current') as HTMLElement;
        if (bouton) {
          bouton.click();
        }
      }, 500); // Ajuste le délai si nécessaire
    });
  }
  

 

  loadUserData(user: any): void {
    // Récupérer les informations utilisateur à partir de l'ID
    this.userId = user.id;
    this.username = user.username;
    this.email = user.email;
    // Vous pouvez aussi charger d'autres informations en fonction de l'ID
  }


  @ViewChild(PopupExpertsComponent) popup!: PopupExpertsComponent;

  ouvrirPopup(): void {
    this.popup.ouvrirPopup();
  }

}
