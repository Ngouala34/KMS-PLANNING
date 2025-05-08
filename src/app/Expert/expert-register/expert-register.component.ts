import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-expert-register',
  templateUrl: './expert-register.component.html',
  styleUrls: ['./expert-register.component.scss']
})
export class ExpertRegisterComponent implements OnInit {
  registerForm!: FormGroup;
  loading = false;
  showPassword = false;
  showConfirmPassword = false;


  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      domaine: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      terms: [false, Validators.requiredTrue]
    }, {
      validators: this.matchPasswords('password', 'confirmPassword')
    });
  }

  matchPasswords(password: string, confirmPassword: string) {
    return (formGroup: FormGroup) => {
      const pass = formGroup.controls[password];
      const confirm = formGroup.controls[confirmPassword];
      if (pass.value !== confirm.value) {
        confirm.setErrors({ ...confirm.errors, mismatch: true });
      } else {
        if (confirm.errors) {
          delete confirm.errors['mismatch'];
          if (Object.keys(confirm.errors).length === 0) {
            confirm.setErrors(null);
          }
        }
      }
    };
  }



onConnexion(): void {
  if (this.registerForm.valid) {
    this.loading = true;
    // Simule l'appel API
    setTimeout(() => {
      this.router.navigateByUrl('dashboard-expert');
      this.loading = false;
    }, 2000);
  } else {
    // Marquer tous les champs comme "touchés" pour afficher les erreurs
    this.registerForm.markAllAsTouched();
  }
}


  onRegister(): void {
    if (this.registerForm.valid) {
      this.loading = true;
      // Ici tu peux appeler ton service d'inscription
      setTimeout(() => {
        this.router.navigateByUrl('dashboard-expert');
        this.loading = false;
      }, 1500);
    }
  }
}
