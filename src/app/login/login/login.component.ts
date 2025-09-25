import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs';
import { GoogleLoginProvider, SocialAuthService, SocialUser } from 'angularx-social-login';

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
  private authSubscription!: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private socialAuthService: SocialAuthService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    this.setupGoogleAuth();
  }

  private setupGoogleAuth(): void {
    this.authSubscription = this.socialAuthService.authState.subscribe((user: SocialUser) => {
      if (user) {
        this.handleGoogleLogin(user);
      }
    });
  }

  // CORRECTION: Ajout du providerId
  signInWithGoogle(): void {
    this.googleLoading = true;
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  handleGoogleLogin(socialUser: SocialUser): void {
    this.googleLoading = true;
    this.message = '';

    this.authService.handleSocialAuth(socialUser).subscribe({
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
        this.socialAuthService.signOut();
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
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }
}