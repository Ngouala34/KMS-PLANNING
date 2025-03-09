import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private apiUrl = 'http://127.0.0.1:8000/api/dashboard'; // URL de l'API Django

  constructor(private http: HttpClient) {}

  // 📊 Récupérer les statistiques de l'utilisateur
  getUserStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/stats/`);
  }

  // 🎓 Récupérer les formations en cours de l'utilisateur
  getUserFormations(): Observable<any> {
    return this.http.get(`${this.apiUrl}/formations/`);
  }
}
