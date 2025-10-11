// services/user/user.service.ts (Mise à jour de votre service existant)
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { UserProfile } from 'src/app/Interfaces/iuser';
import { IBooking, IBookingResponse, ICommentResponse, INotification, IRatingResponse, ISubscritionResponse } from 'src/app/Interfaces/iservice';

// Interfaces pour les paramètres utilisateur
export interface NotificationSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  reminderTime: number;
  promotionalEmails: boolean;
}

export interface UserPreferences {
  language: string;
  timezone: string;
  currency: string;
  dateFormat: string;
  darkMode: boolean;
  autoBooking: boolean;
}

export interface SecuritySettings {
  twoFactorEnabled: boolean;
  lastPasswordChange?: Date;
  activeSessions?: number;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly apiUrl = environment.apiUrl;
  private readonly storageKey = 'currentUser';
  private currentUserSubject = new BehaviorSubject<UserProfile | null>(null);
  
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
  }

  // Méthodes existantes (conservées)
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

  getCurrentUser(): Observable<UserProfile> {
    if (this.currentUserSubject.value) {
      return of(this.currentUserSubject.value); // Utilise `of` au lieu de new Observable
    }
    return this.getProfile();
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

  addRating(expertId: number, score: number): Observable<IRatingResponse> {
    return this.http.post<IRatingResponse>(
      `${this.apiUrl}expert/${expertId}/add_rating/`,
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

  subscribeToNewService(id: number): Observable<ISubscritionResponse> {
    return this.http.post<ISubscritionResponse>(
      `${this.apiUrl}bookings/${id}/reserve/`,
      {}
    ).pipe(
      catchError(error => {
        console.error('Error subscribing to service:', error);
        return throwError(() => new Error('Failed to subscribe to service'));
      })
    );
  }

  getUserBookings(): Observable<IBookingResponse[]> {
    return this.http.get<IBookingResponse[]>(`${this.apiUrl}bookings/client/`).pipe(
      catchError(error => { 
        console.error('Error fetching bookings:', error);
        return throwError(() => new Error('Failed to fetch bookings'));
      })
    );
  }

  // Nouvelles méthodes pour les paramètres utilisateur
  
  /**
   * Met à jour le mot de passe utilisateur
   */
  updatePassword(currentPassword: string, newPassword: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}profile/password/`, {
      current_password: currentPassword,
      new_password: newPassword
    }).pipe(
      catchError(error => {
        console.error('Error updating password:', error);
        let errorMessage = 'Erreur lors de la mise à jour du mot de passe';
        
        if (error.status === 400) {
          errorMessage = 'Mot de passe actuel incorrect';
        } else if (error.status === 422) {
          errorMessage = 'Le nouveau mot de passe ne respecte pas les critères requis';
        }
        
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  /**
   * Active/désactive l'authentification à deux facteurs
   */
  updateTwoFactorAuth(enabled: boolean): Observable<any> {
    return this.http.patch(`${this.apiUrl}profile/2fa/`, { 
      enabled: enabled 
    }).pipe(
      catchError(error => {
        console.error('Error updating 2FA:', error);
        return throwError(() => new Error('Erreur lors de la mise à jour de l\'authentification à deux facteurs'));
      })
    );
  }

  /**
   * Met à jour les paramètres de notification
   */
  updateNotificationSettings(settings: NotificationSettings): Observable<any> {
    return this.http.patch(`${this.apiUrl}profile/notifications/`, settings).pipe(
      tap(() => {
        // Sauvegarder localement pour utilisation hors ligne
        this.saveSettingsToStorage('notifications', settings);
      }),
      catchError(error => {
        console.error('Error updating notification settings:', error);
        return throwError(() => new Error('Erreur lors de la mise à jour des notifications'));
      })
    );
  }

  /**
   * Met à jour les préférences utilisateur
   */
  updatePreferences(preferences: UserPreferences): Observable<any> {
    return this.http.patch(`${this.apiUrl}profile/preferences/`, preferences).pipe(
      tap(() => {
        // Sauvegarder localement pour utilisation hors ligne
        this.saveSettingsToStorage('preferences', preferences);
        
        // Appliquer les changements immédiatement si nécessaire
        this.applyPreferences(preferences);
      }),
      catchError(error => {
        console.error('Error updating preferences:', error);
        return throwError(() => new Error('Erreur lors de la mise à jour des préférences'));
      })
    );
  }



/**
 * Récupère les paramètres de notification
 */
getNotificationSettings(): Observable<NotificationSettings> {
  return this.http.get<NotificationSettings>(`${this.apiUrl}profile/notifications/`).pipe(
    catchError(error => {
      console.error('Error fetching notification settings:', error);
      // Retourner des valeurs par défaut en cas d'erreur
      return of(this.getDefaultNotificationSettings());
    })
  );
}

/**
 * Récupère les préférences utilisateur
 */
getPreferences(): Observable<UserPreferences> {
  return this.http.get<UserPreferences>(`${this.apiUrl}profile/preferences/`).pipe(
    catchError(error => {
      console.error('Error fetching preferences:', error);
      return of(this.getDefaultPreferences());
    })
  );
}

/**
 * Récupère les paramètres de sécurité
 */
getSecuritySettings(): Observable<SecuritySettings> {
  return this.http.get<SecuritySettings>(`${this.apiUrl}profile/security/`).pipe(
    catchError(error => {
      console.error('Error fetching security settings:', error);
      return of({ twoFactorEnabled: false });
    })
  );
}

  // Méthodes utilitaires privées

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

  private saveSettingsToStorage(key: string, settings: any): void {
    try {
      localStorage.setItem(`user_${key}`, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings to storage', error);
    }
  }

  private getDefaultNotificationSettings(): NotificationSettings {
    return {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      reminderTime: 1440,
      promotionalEmails: false
    };
  }

  private getDefaultPreferences(): UserPreferences {
    return {
      language: 'fr',
      timezone: 'Europe/Paris',
      currency: 'EUR',
      dateFormat: 'DD/MM/YYYY',
      darkMode: false,
      autoBooking: true
    };
  }

  private applyPreferences(preferences: UserPreferences): void {
    // Appliquer les préférences côté client si nécessaire
    
    // Exemple : changer la langue
    if (preferences.language) {
      // Vous pouvez intégrer avec un service de traduction ici
      document.documentElement.lang = preferences.language;
    }

    // Exemple : mode sombre
    if (preferences.darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }

  /**
   * Charge tous les paramètres utilisateur
   */
  getAllUserSettings(): Observable<{
    profile: UserProfile;
    notifications: NotificationSettings;
    preferences: UserPreferences;
    security: SecuritySettings;
  }> {
    return new Observable(observer => {
      Promise.all([
        this.getProfile().toPromise(),
        this.getNotificationSettings().toPromise(),
        this.getPreferences().toPromise(),
        this.getSecuritySettings().toPromise()
      ]).then(([profile, notifications, preferences, security]) => {
        observer.next({
          profile: profile!,
          notifications: notifications!,
          preferences: preferences!,
          security: security!
        });
        observer.complete();
      }).catch(error => {
        observer.error(error);
      });
    });
  }


markAsFavorite(serviceId: number): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}favorites/add/`, { service_id: serviceId }).pipe(
    catchError(error => {
      console.error('Error marking as favorite:', error);
      return throwError(() => error);
    })
  );
}

removeFavorite(serviceId: number): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}favorites/remove/`, { service_id: serviceId }).pipe(
    catchError(error => {
      console.error('Error removing favorite:', error);
      return throwError(() => error);
    })
  );
}

verifyPayment(tx_ref: string, transaction_id?: string) {
  const params: any = { tx_ref };
  if (transaction_id) {
    params.transaction_id = transaction_id;
  }

  return this.http.get<any>(`${this.apiUrl}payments/verify/`, { params }).pipe(
    catchError(error => {
      console.error('Erreur lors de la vérification du paiement:', error);
      return throwError(() => new Error('Vérification échouée'));
    })
  );
}



  get currentUserName(): string | null {
    return this.currentUserSubject.value?.name || null;
  }

  get currentUserEmail(): string | null {
    return this.currentUserSubject.value?.email || null;
  }


}