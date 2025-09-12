
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user/user.service';
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
  isSidebarCollapsed = false;
  collapsedByDefault = false;

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
