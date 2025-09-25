// login.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

declare global {
  interface Window {
    handleGoogleCallback: (response: any) => void;
  }
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup; 
  message: string = '';
  loading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

     // Attache le callback Google à la fenêtre globale
    window.handleGoogleCallback = this.handleGoogleCallback.bind(this);
  }

    handleGoogleCallback(response: any) {
    const id_token = response.credential; //  récupéré depuis Google

    this.authService.loginWithGoogle({ id_token }).subscribe({
      next: (res) => {
        // Sauvegarde du token applicatif
        localStorage.setItem('access_token', res.access_token);

        console.log('Connexion réussie ', res);
        this.router.navigate(['/dashboard']); // redirige après login
      },
      error: (err) => {
        console.error('Erreur Google login ', err);
      }
    });
  }

  onLogin(): void {
    if (this.loginForm.invalid) {
      this.message = 'Veuillez remplir correctement tous les champs.';
      return;
    }

    this.loading = true;

    this.authService.loginUser(this.loginForm.value).subscribe({
      next: (response) => {
        this.loading = false;
        
        // Maintenant on récupère le user_type depuis le token décodé
        const userType = this.authService.getUserType();
        console.log('User type from token:', userType);
        
        if (userType) {
          this.handleRedirection(userType);
        } else {
          console.warn('User type non trouvé dans le token');
          this.message = 'Impossible de déterminer le type d\'utilisateur';
        }
      },
      error: (error) => {
        this.loading = false;
        console.error('Erreur de connexion:', error);
        this.message = 'Email ou mot de passe incorrect.';
      }
    });
  }

  private handleRedirection(userType: string): void {
    const type = userType.toLowerCase();
    
    switch(type) {
      case 'client':
        this.router.navigate(['/main-user/user-dashboard']);
        break;
      case 'expert':
        this.router.navigate(['/main-expert/dashboard-expert']);
        break;
      default:
        console.warn('Type d\'utilisateur inconnu:', userType);
        this.router.navigate(['/']); // Page d'accueil par défaut
        break;
    }
  }
}