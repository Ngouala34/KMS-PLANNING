import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  // URL de l'API de connexion (assurez-vous que l'endpoint correspond à votre backend)
  private loginUrl = 'http://127.0.0.1:8000/api/users/login/';

  constructor(private http: HttpClient) {
    const storedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<any>(
      (storedUser && storedUser !== "undefined") ? JSON.parse(storedUser) : null
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  register(user: any) {
    return this.http.post('http://127.0.0.1:8000/api/users/register/', user).pipe(
      tap((response: any) => {
        // Sauvegarde des infos utilisateur dans le localStorage
        localStorage.setItem('currentUser', JSON.stringify(response));
        this.currentUserSubject.next(response);
      })
    );
  }

  /** Connexion : envoie email et password à l'API */
  login(email: string, password: string): Observable<any> {
    return this.http.post(this.loginUrl, { email, password }).pipe(
      tap((response: any) => {
        // Supposons que la réponse contient : 
        // { access: "token_string", user: { username: '...', ... } }
        localStorage.setItem('access_token', response.access);
        localStorage.setItem('currentUser', JSON.stringify(response.user));
        this.currentUserSubject.next(response.user);
      }),
      catchError(error => {
        console.error('Erreur de connexion dans AuthService:', error);
        return throwError(() => error);
      })
    );
  }

  /** Déconnexion */
  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  /** Vérifier si l'utilisateur est connecté */
  isLoggedIn(): boolean {
    return !!localStorage.getItem('access_token');
  }

  /** Récupérer les informations de l'utilisateur connecté */
  get currentUserValue() {
    return this.currentUserSubject.value;
  }

  /** Récupérer le username, ou 'Utilisateur' par défaut */
  get username(): string {
    return this.currentUserSubject.value?.username || 'Utilisateur';
  }
}
