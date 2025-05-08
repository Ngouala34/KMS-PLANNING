import { Component, HostListener, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AppNotification, NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-notification-icon',
  templateUrl: './notification-icon.component.html',
  styleUrls: ['./notification-icon.component.scss']
})
export class NotificationIconComponent implements OnDestroy {
  isPanelOpen = false;
  notifications: AppNotification[] = [];
  unreadCount = 0;

  @ViewChild('notificationPanel') notificationPanel!: ElementRef;
  @ViewChild('notificationButton') notificationButton!: ElementRef;

  constructor(
    public notificationService: NotificationService,
    private router: Router,
    private elementRef: ElementRef
  ) {
    this.notificationService.notifications$.subscribe(notifs => {
      this.notifications = notifs;
    });

    this.notificationService.unreadCount$.subscribe(count => {
      this.unreadCount = count;
    });
  }

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent): void {
    if (this.isPanelOpen) {
      const clickedInsidePanel = this.notificationPanel?.nativeElement.contains(event.target);
      const clickedOnButton = this.notificationButton?.nativeElement.contains(event.target);
      
      if (!clickedInsidePanel && !clickedOnButton) {
        this.isPanelOpen = false;
      }
    }
  }

  ngOnDestroy(): void {
    // Nettoyage si nécessaire
  }

  togglePanel(event: MouseEvent): void {
    event.stopPropagation(); // Empêche la propagation du clic
    this.isPanelOpen = !this.isPanelOpen;
    if (this.isPanelOpen) {
      this.notificationService.markAllAsRead();
    }
  }

  handleNotificationClick(notification: AppNotification): void {
    if (!notification.read) {
      this.notificationService.markAsRead(notification.id);
    }
    if (notification.actionUrl) {
      this.router.navigateByUrl(notification.actionUrl);
    }
    this.isPanelOpen = false;
  }

  getNotificationIcon(type: string): string {
    return {
      'appointment': '',
      'message': '',
      'alert': ''
    }[type] || '';
  }
}