import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-expert-profile',
  templateUrl: './expert-profile.component.html',
  styleUrls: ['./expert-profile.component.scss']
})
export class ExpertProfileComponent implements OnInit {
  profileForm!: FormGroup;
  isSaving = false;

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

  constructor(private fb: FormBuilder, private userService : UserService) {}

  ngOnInit(): void {
    this.initProfileForm();
    this.loadDefaultExpertData();
  }

  private initProfileForm(): void {
    this.profileForm = this.fb.group({
      avatar: [''],
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.pattern(/^\+?[\d\s-]{8,}$/)]],
      country: [''],
      city: [''],
      expertise: [''],
      bio: ['', [Validators.maxLength(500)]]
    });
  }

  private loadDefaultExpertData(): void {
    this.profileForm.patchValue({
      firstName: 'Junior',
      lastName: 'Ngoualadjo',
      email: 'pizulehe@gmail.com',
      phone: '+237 698 12 34 56',
      city: 'Douala',
      country: 'cm',
      expertise: 'Développement Web',
      bio: 'Expert en développement web avec 5 ans d\'expérience...'
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profileForm.get('avatar')?.setValue(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  }

  saveProfile(): void {
    if (this.profileForm.valid) {
      this.isSaving = true;
      this.userService.updateProfile(this.profileForm.value).subscribe({
        next: () => {
          this.isSaving = false;
          console.log('Profil mis à jour avec succès');
        },
        error: (error) => {
          this.isSaving = false;
          console.error('Erreur lors de la mise à jour du profil :', error);
        }
      });
    } else {
      this.markAllAsTouched();
    }
  }

  private markAllAsTouched(): void {
    Object.values(this.profileForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  // Getters pratiques
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
}