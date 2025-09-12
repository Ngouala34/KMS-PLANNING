import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { UserProfile } from 'src/app/Interfaces/iuser';

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