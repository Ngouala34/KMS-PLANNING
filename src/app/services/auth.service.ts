
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { IUserRegister, IUserLogin, IAuthResponse, SocialLoginRequest, SocialLoginResponse } from '../Interfaces/iuser';
import { IExpertRegister, IExpertResponse } from '../Interfaces/iexpert';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private tokenKey = 'access_token';
  private refreshTokenKey = 'refresh_token';
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.initializeAuthState();
  }

  // Initialiser l'état d'authentification au démarrage
  private initializeAuthState(): void {
    const token = this.getToken();
    if (token && !this.isTokenExpired(token)) {
      const user = this.getUserFromToken(token);
      this.currentUserSubject.next(user);
    }
  }

  // REGISTER User
  registerUser(data: IUserRegister): Observable<IAuthResponse> {
    return this.http.post<IAuthResponse>(`${this.apiUrl}register/client/`, data).pipe(
      tap(response => this.handleAuthentication(response)),
      catchError(error => {
        this.clearStorage();
        return throwError(() => error);
      })
    );
  }

  // Register Expert
  registerExpert(data: IExpertRegister): Observable<IExpertResponse> {
    return this.http.post<IExpertResponse>(`${this.apiUrl}register/expert/`, data).pipe(
      catchError(error => {
        return throwError(() => error);
      }   
    )

    );
  }

  // LOGIN
    loginUser(data: IUserLogin): Observable<IAuthResponse> {
      return this.http.post<IAuthResponse>(`${this.apiUrl}login/`, data).pipe(
        tap(response => {
          if (response.access && response.refresh) {
            // Sauvegarde les tokens
            this.setTokens(response.access, response.refresh);

            // Met l'utilisateur courant
            const user = this.getUserFromToken(response.access);
            this.currentUserSubject.next(user);
          }
        }),
        catchError(error => {
          this.clearStorage();
          return throwError(() => error);
        })
      );
    }


  // Méthode pour décoder le JWT
  private decodeJWT(token: string): any {
    try {
      const payload = token.split('.')[1];
      const decodedPayload = atob(payload);
      return JSON.parse(decodedPayload);
    } catch (error) {
      console.error('Erreur lors du décodage du JWT:', error);
      return null;
    }
  }

  // Récupérer l'utilisateur courant
  getCurrentUser(): any {
    return this.currentUserSubject.value;
  }

  // Vérifier le type d'utilisateur
  getUserType(): string | null {
    const user = this.getCurrentUser();
    return user?.user_type || null;
  }


  // Gestion de la réponse d'authentification
  private handleAuthentication(response: IAuthResponse): void {
    if (response.access && response.refresh) {
      this.setTokens(response.access, response.refresh);
      const user = this.getUserFromToken(response.access);
      this.currentUserSubject.next(user);
    }
  }

  // Stockage sécurisé des tokens
  private setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(this.tokenKey, accessToken);
    localStorage.setItem(this.refreshTokenKey, refreshToken);
  }

  // Récupération du token
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // Récupération du refresh token
  getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshTokenKey);
  }

  // Vérification si le token est expiré
  isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiration = payload.exp * 1000; // Convert to milliseconds
      return Date.now() >= expiration;
    } catch (error) {
      return true;
    }
  }

  // Extraction des infos utilisateur du token
  private getUserFromToken(token: string): any {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        id: payload.user_id,
        email: payload.email,
        user_type: payload.user_type,
        is_active: payload.is_active,
        domain: payload.domain
      };
    } catch (error) {
      console.error('Erreur décodage token:', error);
      return null;
    }
  }


  // Rafraîchissement du token
  refreshToken(): Observable<IAuthResponse> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    return this.http.post<IAuthResponse>(`${this.apiUrl}refresh/`, {
      refresh_token: refreshToken
    }).pipe(
      tap(response => this.setTokens(response.access, response.refresh)),
      catchError(error => {
        this.logout();
        return throwError(() => error);
      })
    );
  }

  // LOGOUT
  logout(): void {
    this.clearStorage();
    this.currentUserSubject.next(null);
  }

  // Nettoyage du storage
  private clearStorage(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.refreshTokenKey);
  }

  // Vérification si l'utilisateur est connecté
  isLoggedIn(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  //Connexion avec google 

  loginWithGoogle(payload: SocialLoginRequest): Observable<SocialLoginResponse> {
    return this.http.post<SocialLoginResponse>(`${this.apiUrl}/google/login/`, payload);
  }

}