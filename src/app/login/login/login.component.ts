import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginData = { email: '', password: '' };
  message: string = '';
  loading: boolean = false; // Ajout de la propriété loading

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {}

  OnUserConnexion(): void {
    this.loading = true; // Activer le spinner
    this.authService.login(this.loginData.email, this.loginData.password).subscribe({
      next: (response) => {
        console.log('Réponse du backend:', response); // Affiche toute la réponse
  
        // Vérifiez si l'utilisateur existe et si le rôle est défini
        const user = response?.user;
        if (user && user.role) {
          // Gérer la redirection en fonction du rôle
          if (user.role === 'EXPERT') {
            this.router.navigate(['/expert-dashboard']);
          } else if (user.role === 'CLIENT') {
            this.router.navigate(['/user-home']);
          } else {
            this.message = "Rôle inconnu. Veuillez contacter l'administrateur.";
          }
        } else {
          this.message = "Informations utilisateur manquantes.";
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur de connexion :', error);
        this.message = "Email ou mot de passe incorrect !";
      }
    });
  }
  
  
}
