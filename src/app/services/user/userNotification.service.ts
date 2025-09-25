// userNotification.service.ts - Version complète
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { INotification } from 'src/app/Interfaces/iservice';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserNotificationService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getNotifications(): Observable<INotification[]> {
    return this.http.get<INotification[]>(`${this.apiUrl}notifications/`).pipe(
      catchError(error => {
        console.error('Error fetching notifications:', error);
        return throwError(() => new Error('Failed to fetch notifications'));
      })
    );
  }

  markAsRead(notificationId: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}notifications/${notificationId}/mark-read/`, {}).pipe(
      catchError(error => {
        console.error('Error marking notification as read:', error);
        return throwError(() => new Error('Failed to mark notification as read'));
      })
    );
  }

  markAllAsRead(notificationIds: number[]): Observable<any> {
    return this.http.post(`${this.apiUrl}notifications/mark-all-read/`, {
      notification_ids: notificationIds
    }).pipe(
      catchError(error => {
        console.error('Error marking all notifications as read:', error);
        return throwError(() => new Error('Failed to mark all notifications as read'));
      })
    );
  }

  deleteNotification(notificationId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}notifications/${notificationId}/`).pipe(
      catchError(error => {
        console.error('Error deleting notification:', error);
        return throwError(() => new Error('Failed to delete notification'));
      })
    );
  }
}