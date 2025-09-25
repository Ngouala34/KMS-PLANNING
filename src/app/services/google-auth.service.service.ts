import { Injectable } from '@angular/core';

declare var google: any;

@Injectable({
  providedIn: 'root'
})
export class GoogleAuthService {
  private clientId = '291624581995-fam5326dlblmdvd9frtrj2m2nb4bqgq0.apps.googleusercontent.com';

  initializeGoogleAuth(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof google !== 'undefined') {
        this.initializeGoogleButton();
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        this.initializeGoogleButton();
        resolve();
      };
      script.onerror = (error) => {
        reject(error);
      };
      document.head.appendChild(script);
    });
  }

  private initializeGoogleButton(): void {
    try {
      google.accounts.id.initialize({
        client_id: this.clientId,
        callback: (response: any) => this.handleCredentialResponse(response)
      });

      google.accounts.id.renderButton(
        document.getElementById('google-btn-container'),
        { 
          theme: 'outline', 
          size: 'large',
          width: 300,
          text: 'signin_with'
        }
      );
    } catch (error) {
      console.error('Erreur initialisation Google Auth:', error);
    }
  }

  private handleCredentialResponse(response: any): void {
    const event = new CustomEvent('googleSignIn', { 
      detail: { credential: response.credential } 
    });
    document.dispatchEvent(event);
  }

  signOut(): void {
    if (typeof google !== 'undefined') {
      google.accounts.id.disableAutoSelect();
    }
  }
}