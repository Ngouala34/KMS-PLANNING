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

  private loginUrl = 'https://kms-planning-db.onrender.com/api/users/login/';
  private registerUrl = 'https://kms-planning-db.onrender.com/api/users/register/';
  message: string= '';

  constructor(private http: HttpClient) {
    const storedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<any>(
      (storedUser && storedUser !== "undefined") ? JSON.parse(storedUser) : null
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  register(user: any) {

    return this.http.post(this.registerUrl, user).pipe(
      tap((response: any) => {
        // Sauvegarde des infos utilisateur dans le localStorage
        localStorage.setItem('currentUser', JSON.stringify(response));
        this.currentUserSubject.next(response.user);
      })
    );
  }

  /** Connexion : envoie email et password à l'API */
  login(email: string, password: string): Observable<any> {
    return this.http.post(this.loginUrl, { email, password }).pipe(
      tap((response: any) => {
        console.log('Réponse complète du backend:', response);  // Pour vérifier la structure
  
        // Vérifiez que `response.user` et `response.user_info.id` existent
        if (response?.user_info?.id) {
          // Sauvegarde le token et l'utilisateur dans le localStorage
          localStorage.setItem('access_token', response.access);
          localStorage.setItem('currentUser', JSON.stringify(response.user_info));
  
          // Met à jour le subject actuel avec les nouvelles informations de l'utilisateur
          this.currentUserSubject.next(response.user_info);
        } else {
          console.error("L'ID est manquant dans la réponse du backend.");
          this.message = "Erreur dans les informations utilisateur.";
        }
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
