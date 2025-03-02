import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.scss']
})
export class UserLoginComponent implements OnInit {
  user = {
    nom: '',
    prenom: '',
    telephone: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {}

  OnUserConnexion(): void {
    if (this.user.password !== this.user.confirmPassword) {
      alert("Les mots de passe ne correspondent pas !");
      return;
    }

    this.authService.register(this.user).subscribe(
      response => {
        console.log('Inscription réussie', response);
        alert('Inscription réussie !');
        this.router.navigateByUrl('user-home'); // Redirection après inscription
      },
      error => {
        console.error('Erreur lors de l\'inscription', error);
        alert('Erreur lors de l\'inscription. Vérifiez vos informations.');
      }
    );
  }
}
