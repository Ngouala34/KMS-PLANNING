import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { UserProfile } from 'src/app/Interfaces/iuser';
import { IBooking, IBookingResponse, ICommentResponse, IRatingResponse, ISubscritionResponse } from 'src/app/Interfaces/iservice';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly apiUrl = environment.apiUrl;
  private readonly storageKey = 'currentUser';
  private currentUserSubject = new BehaviorSubject<UserProfile | null>(null);
  
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
  }

  getProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiUrl}profile/`).pipe(
      tap(profile => this.handleProfileSuccess(profile)),
      catchError(error => this.handleProfileError(error))
    );
  }

  updateProfile(profileData: Partial<UserProfile>): Observable<UserProfile> {
    return this.http.put<UserProfile>(`${this.apiUrl}profile/`, profileData).pipe(
      tap(profile => this.handleProfileSuccess(profile)),
      catchError(error => this.handleProfileError(error))
    );
  }

  getCurrentUser(): UserProfile | null {
    return this.currentUserSubject.value;
  }

  clearUser(): void {
    this.currentUserSubject.next(null);
    localStorage.removeItem(this.storageKey);
  }

  addComment(serviceId: number, content: string): Observable<ICommentResponse> {
    return this.http.post<ICommentResponse>(
      `${this.apiUrl}add_comment/${serviceId}/`,
      { content }
    ).pipe(
      catchError(error => {
        console.error('Error adding comment:', error);
        return throwError(() => new Error('Failed to add comment'));
      })
    );
  }

  addRating(serviceId: number, score: number): Observable<IRatingResponse> {
    return this.http.post<IRatingResponse>(
      `${this.apiUrl}add_rating/${serviceId}/`,
      { score }
    ).pipe(
      catchError(error => {
        console.error('Error adding rating:', error);
        return throwError(() => new Error('Failed to add rating'));
      })
    );
  }

  getUserComments(serviceId: number): Observable<ICommentResponse[]> {
    return this.http.get<ICommentResponse[]>(
      `${this.apiUrl}list_comments/${serviceId}/`
    ).pipe(
      catchError(error => {
        console.error('Error fetching user comments:', error);
        return throwError(() => new Error('Failed to fetch user comments'));
      })
    );
  }


  subscribeToNewService( bookingData: {
    date: string;
    start_time: string;
    end_time: string;
    platform: 'google_meet' | 'zoom';
    meeting_link?: string | null;
  }): Observable<ISubscritionResponse> {
    return this.http.post<ISubscritionResponse>(
      `${this.apiUrl}bookings/`,
      bookingData
    ).pipe(
      catchError(error => {
        console.error('Error subscribing to service:', error);
        return throwError(() => new Error('Failed to subscribe to service'));
      })
    );
}



  private loadUserFromStorage(): void {
    try {
      const storedUser = localStorage.getItem(this.storageKey);
      if (storedUser) {
        const user = JSON.parse(storedUser);
        this.currentUserSubject.next(user);
      }
    } catch (error) {
      console.error('Error parsing stored user data', error);
      this.clearUser();
    }
  }

  private handleProfileSuccess(profile: UserProfile): void {
    this.currentUserSubject.next(profile);
    this.saveUserToStorage(profile);
  }

  private handleProfileError(error: any): Observable<never> {
    console.error('User API Error:', error);
    return throwError(() => new Error('Failed to load user profile'));
  }

  private saveUserToStorage(profile: UserProfile): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(profile));
    } catch (error) {
      console.error('Error saving user to storage', error);
    }
  }


}