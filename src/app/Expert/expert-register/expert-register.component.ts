import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-expert-register',
  templateUrl: './expert-register.component.html',
  styleUrls: ['./expert-register.component.scss']
})
export class ExpertRegisterComponent {
  registerForm: FormGroup;
  loading = false;
  showPassword = false;
  showConfirmPassword = false;
  errorMessage = '';
  passwordMismatch = false;

  // Domaines suggérés
  suggestedDomains = [
    'Développement Web', 'Design UI/UX', 'Marketing Digital', 
    'Consulting Business', 'Coaching Professionnel', 'Santé & Bien-être',
    'Éducation', 'Finance', 'Juridique', 'Technologie'
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.registerForm = this.createForm();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      domain: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
      terms: [false, Validators.requiredTrue]
    }, { validators: this.passwordsMatchValidator });
  }

  private passwordsMatchValidator(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  togglePasswordVisibility(field: 'password' | 'confirmPassword'): void {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  onDomainSelect(domain: string): void {
    this.registerForm.patchValue({ domaine: domain });
  }

  onExpertRegister(): void {
    // Réinitialiser les erreurs
    this.errorMessage = '';

    // Marquer tous les champs comme touchés pour afficher les erreurs
    if (this.registerForm.invalid) {
      this.markAllFieldsAsTouched();
      return;
    }

    this.loading = true;
    
    const expertData = {
      name: this.registerForm.get('name')?.value,
      email: this.registerForm.get('email')?.value,
      domain: this.registerForm.get('domain')?.value,
      password: this.registerForm.get('password')?.value,
      password_confirm: this.registerForm.get('confirmPassword')?.value,
      terms: this.registerForm.get('terms')?.value
    };

    // Appel au service d'authentification pour l'inscription de l'expert
    this.authService.registerExpert(expertData).subscribe({
      next: (response) => {
        console.log('Inscription réussie:', response);
        this.loading = false;
        this.router.navigateByUrl('login'); // Rediriger vers la page de connexion
      },
      error: (error) => {
        console.error('Erreur lors de l\'inscription:', error);
        this.loading = false;
        this.errorMessage = 'Une erreur est survenue lors de l\'inscription. Veuillez réessayer.';
      }
    });
  }

  private markAllFieldsAsTouched(): void {
    Object.keys(this.registerForm.controls).forEach(key => {
      this.registerForm.get(key)?.markAsTouched();
    });
  }

  // Méthodes utilitaires pour le template
  get name() { return this.registerForm.get('name'); }
  get email() { return this.registerForm.get('email'); }
  get domaine() { return this.registerForm.get('domaine'); }
  get password() { return this.registerForm.get('password'); }
  get confirmPassword() { return this.registerForm.get('confirmPassword'); }
  get terms() { return this.registerForm.get('terms'); }
}


