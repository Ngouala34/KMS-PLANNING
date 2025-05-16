import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Souscription } from '../../models/user/souscription.model';

@Injectable({
  providedIn: 'root'
})
export class SouscriptionService {
  private apiUrl = 'https://mes-api.com/users/souscriptions';

  constructor(private http: HttpClient) { }

  getSouscriptions(page: number = 1, limit: number = 6): Observable<{data: Souscription[], total: number}> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('sort', '-dateSouscription'); // Tri par date décroissante

    return this.http.get<{data: Souscription[], total: number}>(this.apiUrl, { params });
  }
}