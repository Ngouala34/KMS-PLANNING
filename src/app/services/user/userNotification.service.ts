import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserNotificationService {
  private apiUrl = 'https://votre-api.com/notifications'; // Remplacez par votre URL d'API

  constructor(private http: HttpClient) { }

  getUserNotifications(): Observable<any> {
    return this.http.get(`${this.apiUrl}/me`);
  }
}