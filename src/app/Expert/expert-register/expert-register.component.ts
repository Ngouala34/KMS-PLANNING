import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

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
    private router: Router
  ) {
    this.registerForm = this.createForm();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      domaine: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
      terms: [false, Validators.requiredTrue]
    });
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

  onRegister(): void {
    // Réinitialiser les erreurs
    this.passwordMismatch = false;
    this.errorMessage = '';

    // Vérifier si les mots de passe correspondent
    const password = this.registerForm.get('password')?.value;
    const confirmPassword = this.registerForm.get('confirmPassword')?.value;
    
    if (password !== confirmPassword) {
      this.passwordMismatch = true;
      return;
    }

    // Marquer tous les champs comme touchés pour afficher les erreurs
    if (this.registerForm.invalid) {
      this.markAllFieldsAsTouched();
      return;
    }

    this.loading = true;
    
    // Simulation d'appel API
    setTimeout(() => {
      this.loading = false;
      this.router.navigate(['/dashboard-expert']);
    }, 2000);
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









// import { Component, Input, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { Router } from '@angular/router';

// @Component({
//   selector: 'app-expert-register',
//   templateUrl: './expert-register.component.html',
//   styleUrls: ['./expert-register.component.scss']
// })
// export class ExpertRegisterComponent implements OnInit {
//   registerForm!: FormGroup;
//   loading = false;
//   showPassword = false;
//   showConfirmPassword = false;


//   constructor(private fb: FormBuilder, private router: Router) {}

//   ngOnInit(): void {
//     this.registerForm = this.fb.group({
//       name: ['', Validators.required],
//       email: ['', [Validators.required, Validators.email]],
//       domaine: ['', Validators.required],
//       password: ['', [Validators.required, Validators.minLength(6)]],
//       confirmPassword: ['', Validators.required],
//       terms: [false, Validators.requiredTrue]
//     }, {
//       validators: this.matchPasswords('password', 'confirmPassword')
//     });
//   }

//   matchPasswords(password: string, confirmPassword: string) {
//     return (formGroup: FormGroup) => {
//       const pass = formGroup.controls[password];
//       const confirm = formGroup.controls[confirmPassword];
//       if (pass.value !== confirm.value) {
//         confirm.setErrors({ ...confirm.errors, mismatch: true });
//       } else {
//         if (confirm.errors) {
//           delete confirm.errors['mismatch'];
//           if (Object.keys(confirm.errors).length === 0) {
//             confirm.setErrors(null);
//           }
//         }
//       }
//     };
//   }



// onConnexion(): void {
//   if (this.registerForm.valid) {
//     this.loading = true;
//     // Simule l'appel API
//     setTimeout(() => {
//       this.router.navigateByUrl('dashboard-expert');
//       this.loading = false;
//     }, 2000);
//   } else {
//     // Marquer tous les champs comme "touchés" pour afficher les erreurs
//     this.registerForm.markAllAsTouched();
//   }
// }


//   onRegister(): void {
//     if (this.registerForm.valid) {
//       this.loading = true;
//       // Ici tu peux appeler ton service d'inscription
//       setTimeout(() => {
//         this.router.navigateByUrl('dashboard-expert');
//         this.loading = false;
//       }, 1500);
//     }
//   }
// }
