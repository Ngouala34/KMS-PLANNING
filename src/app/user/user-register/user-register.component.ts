import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-user-register',
  templateUrl: './user-register.component.html',
  styleUrls: ['./user-register.component.scss']
})
export class UserRegisterComponent implements OnInit {
  user = {
    username: '',
    nom: '',
    prenom: '',
    telephone: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: ''
  };

  message: string = ''; // Message à afficher
  messageType: 'success' | 'error' = 'success'; // Type du message (success ou error)

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {}

  OnUserRegister(): void {
    if (this.user.password !== this.user.confirmPassword) {
      this.showMessage("Les mots de passe ne correspondent pas !", 'error');
      return;
    }

    console.log("Données envoyées :", this.user);

    this.authService.register(this.user).subscribe(
      response => {
        console.log('Inscription réussie', response);

        // Afficher un message de succès
        this.showMessage("Inscription réussie ! Redirection en cours...", 'success');

        // Rediriger après 2 secondes
        setTimeout(() => {
          if (this.user.role.toUpperCase() === 'EXPERT') {  // Correction ici
            this.router.navigateByUrl('dashboard-expert');
          } else if (this.user.role.toUpperCase() === 'CLIENT') {
            this.router.navigateByUrl('user-home');
          }
        }, 2000);
      },
      error => {
        console.error('Erreur détaillée du backend :', error.error);

        // Afficher un message d'erreur correct
        this.showMessage("Erreur lors de l'inscription. Veuillez réessayer.", 'error');
      }
    );
  }

  // Fonction pour afficher le message
  showMessage(text: string, type: 'success' | 'error') {
    this.message = text;
    this.messageType = type;

    // Effacer le message après 3 secondes
    setTimeout(() => {
      this.message = "";
    }, 3000);
  }
}
