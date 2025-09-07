import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { RegisterExpertRequest, RegisterExpertResponse, Expert } from '../models/expert.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `$/auth`;

  constructor(private http: HttpClient) {}

  registerExpert(expertData: RegisterExpertRequest): Observable<RegisterExpertResponse> {
    return this.http.post<RegisterExpertResponse>(`${this.apiUrl}/register/expert`, expertData)
      .pipe(
        tap(response => {
          if (response.success && response.token) {
            this.setToken(response.token);
            this.setCurrentExpert(response.expert);
          }
        }),
        catchError(error => {
          console.error('Registration error:', error);
          return throwError(() => error);
        })
      );
  }

  private setToken(token: string): void {
    localStorage.setItem('auth_token', token);
  }

  private setCurrentExpert(expert: Expert | undefined): void {
    if (expert) {
      localStorage.setItem('current_expert', JSON.stringify(expert));
    }
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  getCurrentExpert(): Expert | null {
    const expertStr = localStorage.getItem('current_expert');
    return expertStr ? JSON.parse(expertStr) : null;
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('current_expert');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}