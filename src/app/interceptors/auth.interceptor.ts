import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, take, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { IAuthResponse } from '../Interfaces/iuser';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<IAuthResponse>, next: HttpHandler): Observable<HttpEvent<IAuthResponse>> {
    // Ajouter le token aux requêtes API (sauf login/register)
    if (this.shouldAddToken(request)) {
      request = this.addToken(request, this.authService.getToken());
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && this.authService.getRefreshToken()) {
          return this.handle401Error(request, next);
        }
        return throwError(() => error);
      })
    );
  }

  private shouldAddToken(request: HttpRequest<IAuthResponse>): boolean {
    // Ne pas ajouter le token aux endpoints d'authentification
    const authUrls = ['/login', '/register', '/refresh'];
    return !authUrls.some(url => request.url.includes(url));
  }

  private addToken(request: HttpRequest<IAuthResponse>, token: string | null): HttpRequest<IAuthResponse> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  private handle401Error(request: HttpRequest<IAuthResponse>, next: HttpHandler): Observable<HttpEvent<IAuthResponse>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.authService.refreshToken().pipe(
        switchMap((response: any) => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next(response.access_token);
          return next.handle(this.addToken(request, response.access_token));
        }),
        catchError((error) => {
          this.isRefreshing = false;
          this.authService.logout();
          return throwError(() => error);
        })
      );
    } else {
      return this.refreshTokenSubject.pipe(
        filter(token => token !== null),
        take(1),
        switchMap(token => next.handle(this.addToken(request, token))) 
      );
    }
  }
}