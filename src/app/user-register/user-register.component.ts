import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

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
    confirmPassword: ''
  };

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {}

  OnUserRegister(): void {
    if (this.user.password !== this.user.confirmPassword) {
      alert("Les mots de passe ne correspondent pas !");
      return;
    }
  
    console.log("Données envoyées :", this.user); // Vérifie ce que tu envoies
    
    this.authService.register(this.user).subscribe(
      response => {
        console.log('Inscription réussie', response);
        alert('Inscription réussie !');
        this.router.navigateByUrl('user-home');
      },
      error => {
        console.error('Erreur détaillée du backend :', error.error); // Affiche l'erreur exacte
        alert('Erreur lors de l\'inscription. Vérifiez vos informations.');
      }
    );
  }
}
