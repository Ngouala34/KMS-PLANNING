import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UserNotification } from 'src/app/Interfaces/iuser';

@Injectable({
  providedIn: 'root'
})
export class UserNotificationService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getUserNotifications(): Observable<UserNotification[]> {
    return this.http.get<UserNotification[]>(`${this.apiUrl}notifications/`);
  }
}