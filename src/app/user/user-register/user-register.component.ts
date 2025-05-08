import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-register',
  templateUrl: './user-register.component.html',
  styleUrls: ['./user-register.component.scss']
})
export class UserRegisterComponent implements OnInit {

registerForm!: FormGroup;
  loading = false;
  showPassword = false;
  showConfirmPassword = false;


  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
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
      this.router.navigateByUrl('user-dashboard');
      this.loading = false;
    }, 2000);
  } else {
    // Marquer tous les champs comme "touchés" pour afficher les erreurs
    this.registerForm.markAllAsTouched();
  }
}


}
