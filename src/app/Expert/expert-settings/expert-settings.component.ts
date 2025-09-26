import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { Router, NavigationEnd } from '@angular/router';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-expert-settings',
  templateUrl: './expert-settings.component.html',
  styleUrls: ['./expert-settings.component.scss']
})
export class ExpertSettingsComponent implements OnInit {
  isSidebarCollapsed = true;
  collapsedByDefault = false; // Indique si la sidebar est réduite au départ
  settingsForm!: FormGroup;
  activeTab = 'profile';
  isSaving = false;
  user: any;

  countries = [
    { code: 'cm', name: 'Cameroun' },
    { code: 'sn', name: 'Sénégal' },
    { code: 'ci', name: 'Côte d\'Ivoire' },
    { code: 'fr', name: 'France' },
    { code: 'ca', name: 'Canada' },
    { code: 'ma', name: 'Maroc' }
  ];

  expertiseDomains = [
    'Développement Web',
    'Design UX/UI',
    'Marketing Digital',
    'Data Science',
    'Cybersécurité',
    'Cloud Computing',
    'Intelligence Artificielle'
  ];

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

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isSidebarCollapsed = this.collapsedByDefault; // Appliquer la configuration initiale
    this.initForm();

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isSidebarCollapsed = true;
      }
    });

    this.settingsForm.valueChanges
      .pipe(debounceTime(1000))
      .subscribe(() => {
        if (this.settingsForm.valid && !this.isSaving) {
        }
      });
  }

  private initForm(): void {
    this.settingsForm = this.fb.group({
      profile: this.fb.group({
        avatar: [''],
        firstName: ['', [Validators.required, Validators.minLength(2)]],
        lastName: ['', [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', [Validators.pattern(/^\+?[\d\s-]{8,}$/)]],
        country: [''],
        city: [''],
        expertise: [''],
        bio: ['', [Validators.maxLength(500)]]
      }),
      security: this.fb.group({
        currentPassword: [''],
        newPassword: ['', [Validators.minLength(8)]],
        confirmPassword: [''],
        twoFactorEnabled: [false]
      }, { validators: this.passwordMatchValidator }),
      notifications: this.fb.group({
        emailNotifications: [true],
        smsNotifications: [false],
        reminderBeforeMeeting: [24]
      })
    });
  }

  private passwordMatchValidator(group: AbstractControl): { [key: string]: boolean } | null {
    const newPassword = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { mismatch: true };
  }



  private loadDefaultExpertData(): void {
    this.settingsForm.patchValue({
      profile: {
        firstName: 'Jean',
        lastName: 'Dupont',
        email: 'jean.dupont@exemple.com',
        phone: '+237 698 12 34 56',
        city: 'Douala',
        country: 'cm', // Code pays pour Cameroun
        expertise: 'Développement Web',
        bio: 'Expert en développement web avec 5 ans d\'expérience...'
      }
    });
  }



  private prepareSaveData(): any {
    const formValue = this.settingsForm.value;
    return {
      ...formValue,
      profile: {
        ...formValue.profile,
        fullName: `${formValue.profile.firstName} ${formValue.profile.lastName}`
      }
    };
  }

  private markAllAsTouched(): void {
    Object.values(this.profileForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  changeTab(tab: string): void {
    this.activeTab = tab;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profileForm.get('avatar')?.setValue(e.target.result);
        // Sauvegarder automatiquement l'avatar
      };
      reader.readAsDataURL(file);
    }
  }

  saveNotificationSettings() {
    console.log('Paramètres de notification enregistrés:', this.notificationOptions, this.privacy);
    // Ici tu peux faire un appel API pour sauvegarder côté backend
  }

  // Getters pratiques
  get profileForm(): FormGroup {
    return this.settingsForm.get('profile') as FormGroup;
  }

  get securityForm(): FormGroup {
    return this.settingsForm.get('security') as FormGroup;
  }

  get notificationsForm(): FormGroup {
    return this.settingsForm.get('notifications') as FormGroup;
  }

  get firstName(): AbstractControl {
    return this.profileForm.get('firstName')!;
  }

  get lastName(): AbstractControl {
    return this.profileForm.get('lastName')!;
  }

  get email(): AbstractControl {
    return this.profileForm.get('email')!;
  }

  get phone(): AbstractControl {
    return this.profileForm.get('phone')!;
  }

  get newPassword(): AbstractControl {
    return this.securityForm.get('newPassword')!;
  }
}