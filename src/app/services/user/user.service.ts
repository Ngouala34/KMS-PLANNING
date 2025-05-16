import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  getUserProfile(): any {
    throw new Error('Method not implemented.');
  }
  updateUserProfile(value: any) {
    throw new Error('Method not implemented.');
  }
  private apiUrl = 'https://votre-api.com/users'; // Remplacez par votre URL d'API

  constructor(private http: HttpClient) { }

  getCurrentUser(): Observable<any> {
    return this.http.get(`${this.apiUrl}/me`);
  }

  getUserStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/me/stats`);
  }

  getUpcomingAppointments(): Observable<any> {
    return this.http.get(`${this.apiUrl}/me/appointments?upcoming=true`);
  }
}