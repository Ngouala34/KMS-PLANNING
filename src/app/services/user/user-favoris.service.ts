import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, delay } from 'rxjs/operators';
import { Favoris } from '../../models/user/favoris.model';

@Injectable({
  providedIn: 'root'
})
export class UserFavorisService {
  private apiUrl = 'https://mes-api.com/users/favoris';

  constructor(private http: HttpClient) { }

  getFavoris(userId: string, forceRefresh: boolean): Observable<Favoris[]> {
    return this.http.get<Favoris[]>(this.apiUrl).pipe(
      catchError(error => {
        console.error('Erreur lors de la récupération des favoris', error);
        return of([]); // Retourne un tableau vide en cas d'erreur
      })
    );
  }
}