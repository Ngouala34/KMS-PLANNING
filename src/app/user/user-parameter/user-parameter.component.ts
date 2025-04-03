
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-user-parameter',
  templateUrl: './user-parameter.component.html',
  styleUrls: ['./user-parameter.component.scss']
})
export class UserParameterComponent implements OnInit {
  settingsForm: FormGroup;
  activeTab = 'profile';
  isLoading = false;
  isSaving = false;
  user: any;

  constructor(
    private fb: FormBuilder,
    private userService: UserService
  ) {
    this.settingsForm = this.fb.group({
      profile: this.fb.group({
        avatar: [''],
        fullName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        bio: ['']
      }),
      security: this.fb.group({
        currentPassword: [''],
        newPassword: ['', [Validators.minLength(8)]],
        confirmPassword: [''],
        twoFactorEnabled: [false]
      }),
      notifications: this.fb.group({
        emailNotifications: [true],
        smsNotifications: [false],
        reminderBeforeMeeting: [24] // heures
      })
    });
  }

  ngOnInit(): void {
    this.loadUserSettings();

    // Sauvegarde automatique après 1 seconde d'inactivité
    this.settingsForm.valueChanges
      .pipe(debounceTime(1000))
      .subscribe(() => {
        if (this.settingsForm.valid && !this.isSaving) {
          this.saveSettings();
        }
      });
  }

  async loadUserSettings() {
    this.isLoading = true;
    try {
      this.user = await this.userService.getUserProfile();
      this.settingsForm.patchValue({
        profile: {
          avatar: this.user.avatar,
          fullName: this.user.fullName,
          email: this.user.email,
          bio: this.user.bio
        },
        security: {
          twoFactorEnabled: this.user.twoFactorEnabled
        }
      });
    } catch (error) {
      console.error('Failed to load user settings', error);
    } finally {
      this.isLoading = false;
    }
  }

  async saveSettings() {
    if (this.settingsForm.invalid) return;

    this.isSaving = true;
    try {
      await this.userService.updateUserProfile(this.settingsForm.value);
      // Feedback visuel
    } catch (error) {
      console.error('Failed to save settings', error);
    } finally {
      this.isSaving = false;
    }
  }

  changeTab(tab: string) {
    this.activeTab = tab;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Uploader l'image et mettre à jour le formulaire
    }
  }
}
