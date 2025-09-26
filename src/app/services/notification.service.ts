import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, interval } from 'rxjs';
import { map } from 'rxjs/operators';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'appointment' | 'message' | 'alert';
  read: boolean;
  date: Date;
  icon: string;
  actionUrl?: string;
}

// 🔒 Type réutilisable pour les clés
type NotificationType = AppNotification['type'];

@Injectable({ providedIn: 'root' })
export class NotificationService {
  showError(arg0: string) {
    throw new Error('Method not implemented.');
  }
  showSuccess(arg0: string) {
    throw new Error('Method not implemented.');
  }
  showInfo(arg0: string, arg1: number) {
    throw new Error('Method not implemented.');
  }
  private _notifications = new BehaviorSubject<AppNotification[]>([]);
  private _unreadCount = new BehaviorSubject<number>(0);

  constructor() {
    this.loadSampleNotifications();
    this.simulateRealTimeNotifications();
  }

  get notifications$(): Observable<AppNotification[]> {
    return this._notifications.asObservable();
  }

  get unreadCount$(): Observable<number> {
    return this._unreadCount.asObservable();
  }

  private loadSampleNotifications(): void {
    const samples: AppNotification[] = [
      {
        id: '1',
        title: 'Nouveau rendez-vous',
        message: 'Consultation marketing demain à 14h',
        type: 'appointment',
        read: false,
        date: new Date(),
        icon: 'event',
        actionUrl: '/calendar'
      },
      {
        id: '2',
        title: 'Nouveau Message',
        message: 'Le client a confirmé sa participation',
        type: 'message',
        read: false,
        date: new Date(Date.now() - 3600000),
        icon: 'mail',
        actionUrl: '/messages'
      },
      {
        id: '2',
        title: 'Rendez-vous imminent',
        message: 'Rendez-vous avec le client dans 30 minutes',
        type: 'appointment',
        read: false,
        date: new Date() ,
        icon: 'event',
        actionUrl: '/calendar'
      },
    ];
    this._notifications.next(samples);
    this.updateUnreadCount();
  }

  private simulateRealTimeNotifications(): void {
    interval(30000).subscribe(() => {
      const types: NotificationType[] = ['appointment', 'message', 'alert'];
      const type = types[Math.floor(Math.random() * types.length)];

      const newNotif: AppNotification = {
        id: Date.now().toString(),
        title: this.generateTitle(type),
        message: this.generateMessage(type),
        type,
        read: false,
        date: new Date(),
        icon: this.getIconByType(type),
        actionUrl: this.getActionUrlByType(type)
      };

      this._notifications.next([newNotif, ...this._notifications.value]);
      this.updateUnreadCount();
    });
  }

  markAsRead(id: string): void {
    const updated = this._notifications.value.map(n =>
      n.id === id ? { ...n, read: true } : n
    );
    this._notifications.next(updated);
    this.updateUnreadCount();
  }

  markAllAsRead(): void {
    const updated = this._notifications.value.map(n => ({
      ...n,
      read: true
    }));
    this._notifications.next(updated);
    this._unreadCount.next(0);
  }

  private updateUnreadCount(): void {
    const count = this._notifications.value.filter(n => !n.read).length;
    this._unreadCount.next(count);
  }

  private generateTitle(type: NotificationType): string {
    const titles: Record<NotificationType, string[]> = {
      appointment: ['Nouveau Rendez-vous', 'Rendez-vous confirmé', 'Annulation du Rendez-vous'],
      message: [ 'Nouveau commentaire', 'Réponse client'],
      alert: ['nouvelle souscription',  'Nouveuax message', 'Alerte de sécurité']
    };
    return titles[type][Math.floor(Math.random() * titles[type].length)];
  }

  private generateMessage(type: NotificationType): string {
    const messages: Record<NotificationType, string[]> = {
      appointment: [
        'Vous avez un nouveau rendez-vous de coaching',
        'Le client a reporté la session',
        'Confirmation pour demain à 10h'
      ],
      message: [
        'Le client a envoyé une question',
        'Voir le dernier message dans la messagerie',
        'Réponse urgente nécessaire'
      ],
      alert: [
        'Paiement confirmé pour la formation',
        'Problème de connexion détecté',
        'Mise à jour disponible'
      ]
    };
    return messages[type][Math.floor(Math.random() * messages[type].length)];
  }

  private getIconByType(type: NotificationType): string {
    const icons: Record<NotificationType, string> = {
      appointment: 'event',
      message: 'mail',
      alert: 'warning'
    };
    return icons[type];
  }

  private getActionUrlByType(type: NotificationType): string {
    const urls: Record<NotificationType, string> = {
      appointment: '/calendar',
      message: '/messages',
      alert: '/alerts'
    };
    return urls[type];
  }
}
