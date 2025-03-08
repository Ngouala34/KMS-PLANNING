import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  // Objet pour stocker les données du formulaire
  loginData = { email: '', password: '' };
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {}

  OnUserConnexion(): void {
    this.authService.login(this.loginData.email, this.loginData.password).subscribe({
      next: (response) => {
        console.log('Connexion réussie :', response);
        console.log(response)
        // Redirection vers le dashboard de l'utilisateur
        this.router.navigate(['/user-home']);

      },
      error: (error) => {
        console.error('Erreur de connexion :', error);
        this.errorMessage = "Email ou mot de passe incorrect !";
      }
    });
  }
}
