import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs';
import { GoogleAuthService } from 'src/app/services/google-auth.service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm!: FormGroup; 
  message: string = '';
  loading: boolean = false;
  googleLoading: boolean = false;
  private googleAuthSubscription!: Subscription;
  googleAuthAvailable: boolean = true;

  constructor(
    private authService: AuthService,
    private googleAuthService: GoogleAuthService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    this.initializeGoogleAuth();
  }

  private initializeGoogleAuth(): void {
    this.googleAuthService.initializeGoogleAuth().then(() => {
      console.log('Google Auth initialisé avec succès');
      this.setupGoogleAuthListener();
    }).catch(error => {
      console.error('Erreur initialisation Google Auth:', error);
      this.googleAuthAvailable = false;
      this.message = 'Service Google temporairement indisponible';
    });
  }

  private setupGoogleAuthListener(): void {
    this.googleAuthSubscription = new Subscription();
    
    const listener = (event: any) => {
      this.handleGoogleLogin(event.detail.credential);
    };
    
    document.addEventListener('googleSignIn', listener);
    
    this.googleAuthSubscription.add(() => {
      document.removeEventListener('googleSignIn', listener);
    });
  }

  // Méthode de secours pour la connexion Google manuelle
manualGoogleLogin(): void {
  // Ouvrir une fenêtre popup ou rediriger vers l'authentification Google
  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?
    client_id=291624581995-fam5326dlblmdvd9frtrj2m2nb4bqgq0.apps.googleusercontent.com&
    redirect_uri=${encodeURIComponent(window.location.origin)}&
    response_type=token&
    scope=email profile&
    state=google_login`;

  window.location.href = googleAuthUrl;
}

// Et ajoutez cette méthode pour gérer le retour OAuth
private checkForOAuthResponse(): void {
  const urlParams = new URLSearchParams(window.location.search);
  const accessToken = urlParams.get('access_token');
  
  if (accessToken) {
    this.handleGoogleLogin(accessToken);
  }
}


  handleGoogleLogin(credential: string): void {
    this.googleLoading = true;
    this.message = '';

    this.authService.handleSocialAuth(credential).subscribe({
      next: (response) => {
        this.googleLoading = false;
        console.log('Connexion Google réussie', response);
        
        const userType = this.authService.getUserType();
        if (userType) {
          this.handleRedirection(userType);
        } else {
          this.message = 'Erreur lors de la récupération du profil utilisateur';
        }
      },
      error: (error) => {
        this.googleLoading = false;
        console.error('Erreur lors de la connexion Google', error);
        this.message = 'Erreur lors de la connexion avec Google. Veuillez réessayer.';
      }
    });
  }

  onLogin(): void {
    if (this.loginForm.invalid) {
      this.message = 'Veuillez remplir correctement tous les champs.';
      return;
    }

    this.loading = true;
    this.message = '';

    this.authService.loginUser(this.loginForm.value).subscribe({
      next: (response) => {
        this.loading = false;
        
        const userType = this.authService.getUserType();
        console.log('User type from token:', userType);
        
        if (userType) {
          this.handleRedirection(userType);
        } else {
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
        this.router.navigate(['/']);
        break;
    }
  }

  ngOnDestroy(): void {
    if (this.googleAuthSubscription) {
      this.googleAuthSubscription.unsubscribe();
    }
  }
}