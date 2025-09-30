import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-expert-settings',
  templateUrl: './expert-settings.component.html',
  styleUrls: ['./expert-settings.component.scss']
})
export class ExpertSettingsComponent implements OnInit {
  isSidebarCollapsed = true;
  activeTab = 'security';
  isSaving = false;

  notificationOptions = [
    { key: 'email', label: 'Recevoir les notifications par email', enabled: true },
    { key: 'push', label: 'Notifications push', enabled: false },
    { key: 'reminder', label: 'Rappels de rendez-vous', enabled: true },
    { key: 'messages', label: 'Alertes pour nouveaux messages', enabled: true },
    { key: 'reviews', label: 'Recevoir les avis/évaluations', enabled: true },
    { key: 'offers', label: 'Offres ou promotions', enabled: false },
  ];

  privacy = {
    hideContact: false,
    noMarketing: true,
  };

  securityForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initSecurityForm();
    
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isSidebarCollapsed = true;
      }
    });
  }

  private initSecurityForm(): void {
    this.securityForm = this.fb.group({
      currentPassword: [''],
      newPassword: ['', [Validators.minLength(8)]],
      confirmPassword: [''],
      twoFactorEnabled: [false]
    }, { validators: this.passwordMatchValidator });
  }

  private passwordMatchValidator(group: AbstractControl): { [key: string]: boolean } | null {
    const newPassword = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { mismatch: true };
  }

  changeTab(tab: string): void {
    this.activeTab = tab;
  }

  saveSecurity(): void {
    if (this.securityForm.valid) {
      this.isSaving = true;
      console.log('Sécurité sauvegardée:', this.securityForm.value);
      setTimeout(() => {
        this.isSaving = false;
      }, 1000);
    }
  }

  saveNotificationSettings(): void {
    console.log('Paramètres de notification enregistrés:', this.notificationOptions, this.privacy);
  }

  saveAllSettings(): void {
    this.isSaving = true;
    
    if (this.activeTab === 'security') {
      this.saveSecurity();
    } else if (this.activeTab === 'notifications') {
      this.saveNotificationSettings();
    }
    
    setTimeout(() => {
      this.isSaving = false;
    }, 1000);
  }

  // Getters pratiques
  get newPassword(): AbstractControl {
    return this.securityForm.get('newPassword')!;
  }
}