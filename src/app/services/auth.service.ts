import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  private apiUrl = 'http://localhost:8000/api/users/register/';  // URL de l'endpoint Django

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('currentUser')!));
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
  
  // Méthode pour récupérer l'utilisateur actuel
  get currentUserValue() {
    return this.currentUserSubject.value;
  }

  // Méthode pour récupérer un attribut particulier de l'utilisateur
  get username() {
    return this.currentUserSubject.value?.username || 'Utilisateur'; // Valeur par défaut si non connecté
  }
}