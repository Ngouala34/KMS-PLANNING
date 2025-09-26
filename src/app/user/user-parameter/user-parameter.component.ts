// user-parameter.component.ts (Version simplifiée adaptée à votre service)
import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { UserService, NotificationSettings, UserPreferences } from '../../services/user/user.service';
import { debounceTime, takeUntil, distinctUntilChanged } from 'rxjs/operators';
import { Subject, fromEvent } from 'rxjs';
import { UserProfile } from 'src/app/Interfaces/iuser';
import { NotificationService } from 'src/app/services/notification.service';

interface SecuritySettings {
  twoFactorEnabled: boolean;
  lastPasswordChange?: Date;
  activeSessions?: number;
}

@Component({
  selector: 'app-user-parameter',
  templateUrl: './user-parameter.component.html',
  styleUrls: ['./user-parameter.component.scss']
})
export class UserParameterComponent implements OnInit, OnDestroy {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  settingsForm!: FormGroup;
  activeTab = 'profile';
  isLoading = false;
  isSaving = false;
  user: UserProfile | null = null;
  isSidebarCollapsed = false;
  
  private destroy$ = new Subject<void>();
  private autoSaveEnabled = true;

  // Options pour les sélects
  languageOptions = [
    { value: 'fr', label: 'Français' },
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Español' },
    { value: 'de', label: 'Deutsch' }
  ];

  timezoneOptions = [
    { value: 'Europe/Paris', label: 'Europe/Paris (UTC+1)' },
    { value: 'Europe/London', label: 'Europe/London (UTC+0)' },
    { value: 'America/New_York', label: 'America/New_York (UTC-5)' }
  ];

  currencyOptions = [
    { value: 'EUR', label: 'Euro (€)' },
    { value: 'USD', label: 'Dollar US ($)' },
    { value: 'GBP', label: 'Livre Sterling (£)' },
    { value: 'CHF', label: 'Franc Suisse (CHF)' }
  ];

  reminderOptions = [
    { value: 15, label: '15 minutes avant' },
    { value: 30, label: '30 minutes avant' },
    { value: 60, label: '1 heure avant' },
    { value: 120, label: '2 heures avant' },
    { value: 1440, label: '1 jour avant' }
  ];
showNotification: any;
notificationType!: string|string[]|Set<string>|{ [klass: string]: any; };
notificationMessage: any;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private notificationService: NotificationService
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.loadUserData();
    this.setupFormValidation();
    this.setupAutoSave();
    this.detectScreenSize();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForm(): void {
    this.settingsForm = this.fb.group({
      profile: this.fb.group({
        avatar: [''],
        fullName: ['', [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', [this.phoneValidator]],
        bio: ['', [Validators.maxLength(500)]],
        location: ['']
      }),
      security: this.fb.group({
        currentPassword: [''],
        newPassword: ['', [this.passwordValidator]],
        confirmPassword: [''],
        twoFactorEnabled: [false]
      }, { validators: this.passwordMatchValidator }),
      notifications: this.fb.group({
        emailNotifications: [true],
        smsNotifications: [false],
        pushNotifications: [true],
        reminderTime: [1440],
        promotionalEmails: [false]
      }),
      preferences: this.fb.group({
        language: ['fr'],
        timezone: ['Europe/Paris'],
        currency: ['EUR'],
        dateFormat: ['DD/MM/YYYY'],
        darkMode: [false],
        autoBooking: [true]
      })
    });
  }

  private async loadUserData(): Promise<void> {
    this.isLoading = true;
    try {
      // Charger le profil utilisateur
      const userData = await this.userService.getCurrentUser().toPromise();
      this.user = userData;
      
      if (userData) {
        this.settingsForm.get('profile')?.patchValue({
          avatar: userData.avatar || '',
          fullName: userData.name || userData.name + ' ' + userData.name || '',
          email: userData.email || '',
        });
      }

      // Charger les paramètres de notification depuis le localStorage ou valeurs par défaut
      this.loadNotificationSettings();
      
      // Charger les préférences depuis le localStorage ou valeurs par défaut  
      this.loadPreferences();
      
      // Charger les paramètres de sécurité
      this.loadSecuritySettings();
      
    } catch (error) {
      this.notificationService.showError('Erreur lors du chargement des données utilisateur');
      console.error('Error loading user data:', error);
    } finally {
      this.isLoading = false;
    }
  }

  private loadNotificationSettings(): void {
    // Charger depuis le localStorage ou utiliser les valeurs par défaut
    const savedSettings = localStorage.getItem('user_notifications');
    const defaultSettings: NotificationSettings = {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      reminderTime: 1440,
      promotionalEmails: false
    };
    
    const settings = savedSettings ? JSON.parse(savedSettings) : defaultSettings;
    this.settingsForm.get('notifications')?.patchValue(settings);
  }

  private loadPreferences(): void {
    // Charger depuis le localStorage ou utiliser les valeurs par défaut
    const savedPreferences = localStorage.getItem('user_preferences');
    const defaultPreferences: UserPreferences = {
      language: 'fr',
      timezone: 'Europe/Paris',
      currency: 'EUR',
      dateFormat: 'DD/MM/YYYY',
      darkMode: false,
      autoBooking: true
    };
    
    const preferences = savedPreferences ? JSON.parse(savedPreferences) : defaultPreferences;
    this.settingsForm.get('preferences')?.patchValue(preferences);
  }

  private loadSecuritySettings(): void {
    // Pour l'instant, utiliser des valeurs par défaut
    // Vous pouvez implémenter un appel API si nécessaire
    this.settingsForm.get('security')?.patchValue({
      twoFactorEnabled: false
    });
  }

  private setupFormValidation(): void {
    // Validation temps réel pour les mots de passe
    const newPassword = this.settingsForm.get('security.newPassword');
    const confirmPassword = this.settingsForm.get('security.confirmPassword');

    if (newPassword && confirmPassword) {
      newPassword.valueChanges
        .pipe(
          debounceTime(300),
          distinctUntilChanged(),
          takeUntil(this.destroy$)
        )
        .subscribe(() => {
          if (confirmPassword.value) {
            confirmPassword.updateValueAndValidity();
          }
        });
    }
  }

  private setupAutoSave(): void {
    // Auto-sauvegarde pour les préférences et notifications
    const preferencesControls = this.settingsForm.get('preferences');
    const notificationControls = this.settingsForm.get('notifications');

    if (preferencesControls) {
      preferencesControls.valueChanges
        .pipe(
          debounceTime(1000),
          distinctUntilChanged(),
          takeUntil(this.destroy$)
        )
        .subscribe((changes) => {
          if (this.autoSaveEnabled && !this.isLoading) {
            this.autoSavePreferences(changes);
          }
        });
    }

    if (notificationControls) {
      notificationControls.valueChanges
        .pipe(
          debounceTime(1000),
          distinctUntilChanged(),
          takeUntil(this.destroy$)
        )
        .subscribe((changes) => {
          if (this.autoSaveEnabled && !this.isLoading) {
            this.autoSaveNotifications(changes);
          }
        });
    }
  }

  private detectScreenSize(): void {
    const checkScreenSize = () => {
      this.isSidebarCollapsed = window.innerWidth < 768;
    };

    checkScreenSize();
    fromEvent(window, 'resize')
      .pipe(
        debounceTime(250),
        takeUntil(this.destroy$)
      )
      .subscribe(checkScreenSize);
  }

  // Validators personnalisés (conservés)
  private phoneValidator(control: AbstractControl): ValidationErrors | null {
    const phoneRegex = /^(\+33|0)[1-9](\d{8})$/;
    if (control.value && !phoneRegex.test(control.value.replace(/\s/g, ''))) {
      return { invalidPhone: true };
    }
    return null;
  }

  private passwordValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.value;
    if (!password) return null;

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasMinLength = password.length >= 8;

    const errors: any = {};
    
    if (!hasMinLength) errors.minLength = true;
    if (!hasUpperCase) errors.upperCase = true;
    if (!hasLowerCase) errors.lowerCase = true;
    if (!hasNumbers) errors.numbers = true;
    if (!hasSpecialChar) errors.specialChar = true;

    return Object.keys(errors).length ? errors : null;
  }

  private passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const newPassword = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;

    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      return { passwordMismatch: true };
    }
    return null;
  }

  // Méthodes publiques
  changeTab(tab: string): void {
    this.activeTab = tab;
  }

  async onFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    
    if (file) {
      // Validation du fichier
      if (!this.isValidImageFile(file)) {
        this.notificationService.showError('Format d\'image non valide. Utilisez JPG, PNG ou GIF.');
        return;
      }

      if (file.size > 5 * 1024 * 1024) { // 5MB max
        this.notificationService.showError('L\'image est trop volumineuse. Maximum 5MB.');
        return;
      }

      try {
        this.isLoading = true;
        
        // Utiliser votre service d'upload existant ou créer une URL temporaire
        const imageUrl = await this.uploadImage(file);
        this.settingsForm.get('profile.avatar')?.setValue(imageUrl);
        this.notificationService.showSuccess('Photo de profil mise à jour');
      } catch (error) {
        this.notificationService.showError('Erreur lors de l\'upload de l\'image');
        console.error('Image upload error:', error);
      } finally {
        this.isLoading = false;
      }
    }
  }

  private isValidImageFile(file: File): boolean {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    return validTypes.includes(file.type);
  }

  private async uploadImage(file: File): Promise<string> {
    try {
      // Essayer d'utiliser votre service d'upload si disponible
      const response = await this.userService.uploadAvatar(file).toPromise();
      return response!.avatarUrl;
    } catch (error) {
      // Fallback : créer une URL temporaire pour la démo
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    }
  }

  async saveAllSettings(): Promise<void> {
    if (this.settingsForm.invalid || this.isSaving) {
      this.markFormGroupTouched(this.settingsForm);
      return;
    }

    this.isSaving = true;
    
    try {
      const formData = this.settingsForm.value;
      
      // Sauvegarder selon l'onglet actif ou tout sauvegarder
      switch (this.activeTab) {
        case 'profile':
          await this.saveProfile(formData.profile);
          break;
        case 'security':
          await this.saveSecuritySettings(formData.security);
          break;
        case 'notifications':
          await this.saveNotificationSettings(formData.notifications);
          break;
        case 'preferences':
          await this.savePreferences(formData.preferences);
          break;
        default:
          await this.saveAllUserData(formData);
      }

      this.notificationService.showSuccess('Paramètres sauvegardés avec succès');
      
    } catch (error) {
      this.notificationService.showError('Erreur lors de la sauvegarde');
      console.error('Save error:', error);
    } finally {
      this.isSaving = false;
    }
  }

  private async saveProfile(profileData: any): Promise<void> {
    // Adapter les données pour votre API existante
    const apiData = {
      name: profileData.fullName,
      email: profileData.email,
      phone: profileData.phone,
      bio: profileData.bio,
      location: profileData.location,
      avatar: profileData.avatar
    };
    
    await this.userService.updateProfile(apiData).toPromise();
  }

  private async saveSecuritySettings(securityData: any): Promise<void> {
    const promises: Promise<any>[] = [];

    if (securityData.newPassword && securityData.currentPassword) {
      promises.push(
        this.userService.updatePassword(
          securityData.currentPassword,
          securityData.newPassword
        ).toPromise()
      );
      
      // Clear password fields after successful update
      this.settingsForm.get('security')?.patchValue({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }

    if (securityData.twoFactorEnabled !== undefined) {
      promises.push(
        this.userService.updateTwoFactorAuth(securityData.twoFactorEnabled).toPromise()
      );
    }

    await Promise.all(promises);
  }

  private async saveNotificationSettings(notificationData: NotificationSettings): Promise<void> {
    try {
      await this.userService.updateNotificationSettings(notificationData).toPromise();
    } catch (error) {
      // Si l'API n'est pas encore implémentée, sauvegarder localement
      console.log('API not implemented, saving locally:', error);
      localStorage.setItem('user_notifications', JSON.stringify(notificationData));
    }
  }

  private async savePreferences(preferencesData: UserPreferences): Promise<void> {
    try {
      await this.userService.updatePreferences(preferencesData).toPromise();
    } catch (error) {
      // Si l'API n'est pas encore implémentée, sauvegarder localement
      console.log('API not implemented, saving locally:', error);
      localStorage.setItem('user_preferences', JSON.stringify(preferencesData));
    }
  }

  private async saveAllUserData(formData: any): Promise<void> {
    const promises = [
      this.saveProfile(formData.profile),
      this.saveNotificationSettings(formData.notifications),
      this.savePreferences(formData.preferences)
    ];

    // Only save security if password is being changed or 2FA is toggled
    if (formData.security.newPassword || formData.security.twoFactorEnabled !== undefined) {
      promises.push(this.saveSecuritySettings(formData.security));
    }

    await Promise.all(promises);
  }

  private async autoSavePreferences(preferences: UserPreferences): Promise<void> {
    try {
      await this.savePreferences(preferences);
      this.notificationService.showInfo('Préférences sauvegardées automatiquement', 2000);
    } catch (error) {
      console.error('Auto-save preferences error:', error);
    }
  }

  private async autoSaveNotifications(notifications: NotificationSettings): Promise<void> {
    try {
      await this.saveNotificationSettings(notifications);
      this.notificationService.showInfo('Paramètres de notification sauvegardés', 2000);
    } catch (error) {
      console.error('Auto-save notifications error:', error);
    }
  }

  resetForm(): void {
    if (confirm('Êtes-vous sûr de vouloir annuler toutes les modifications ?')) {
      this.autoSaveEnabled = false;
      this.loadUserData().then(() => {
        this.autoSaveEnabled = true;
        this.notificationService.showInfo('Modifications annulées',100);
      });
    }
  }

    uppercaseRegex = /[A-Z]/;
    lowercaseRegex = /[a-z]/;
    digitRegex = /\d/;
    specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;

    get newPassword(): string {
      return this.settingsForm.get('security.newPassword')?.value || '';
    }


  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      } else {
        control?.markAsTouched();
      }
    });
  }

  // Getters pour les erreurs de validation
  getFieldError(fieldPath: string): string | null {
    const field = this.settingsForm.get(fieldPath);
    if (field?.errors && field.touched) {
      const errors = field.errors;
      
      if (errors['required']) return 'Ce champ est requis';
      if (errors['email']) return 'Format d\'email invalide';
      if (errors['minlength']) return `Minimum ${errors['minlength'].requiredLength} caractères`;
      if (errors['maxlength']) return `Maximum ${errors['maxlength'].requiredLength} caractères`;
      if (errors['invalidPhone']) return 'Numéro de téléphone invalide';
      if (errors['passwordMismatch']) return 'Les mots de passe ne correspondent pas';
      
      // Erreurs de mot de passe
      if (errors['minLength']) return 'Le mot de passe doit contenir au moins 8 caractères';
      if (errors['upperCase']) return 'Le mot de passe doit contenir au moins une majuscule';
      if (errors['lowerCase']) return 'Le mot de passe doit contenir au moins une minuscule';
      if (errors['numbers']) return 'Le mot de passe doit contenir au moins un chiffre';
      if (errors['specialChar']) return 'Le mot de passe doit contenir au moins un caractère spécial';
    }
    
    return null;
  }

  isFieldInvalid(fieldPath: string): boolean {
    const field = this.settingsForm.get(fieldPath);
    return !!(field?.errors && field.touched);
  }

  // Méthodes utilitaires
  get currentAvatarUrl(): string {
    const avatarUrl = this.settingsForm.get('profile.avatar')?.value;
    return avatarUrl || this.user?.avatar || 'assets/images/default-avatar.jpg';
  }

  get hasUnsavedChanges(): boolean {
    return this.settingsForm.dirty && !this.isSaving;
  }

  // Méthodes utilitaires pour la validation des mots de passe
  isPasswordValid(fieldPath: string, requirement: string): boolean {
    const password = this.settingsForm.get(fieldPath)?.value;
    if (!password) return false;

    switch (requirement) {
      case 'length':
        return password.length >= 8;
      case 'uppercase':
        return /[A-Z]/.test(password);
      case 'lowercase':
        return /[a-z]/.test(password);
      case 'numbers':
        return /\d/.test(password);
      case 'special':
        return /[!@#$%^&*(),.?":{}|<>]/.test(password);
      default:
        return false;
    }
  }

  // Méthode pour vérifier si les mots de passe correspondent
  passwordsMatch(): boolean {
    const newPassword = this.settingsForm.get('security.newPassword')?.value;
    const confirmPassword = this.settingsForm.get('security.confirmPassword')?.value;
    return newPassword && confirmPassword && newPassword === confirmPassword;
  }

  // Méthode pour afficher/masquer le mot de passe
  togglePasswordVisibility(fieldId: string): void {
    const field = document.getElementById(fieldId) as HTMLInputElement;
    if (field) {
      field.type = field.type === 'password' ? 'text' : 'password';
    }
  }
}