import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IUserRegister } from 'src/app/Interfaces/iuser';

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

  constructor(
    private fb: FormBuilder, 
    private router: Router,
    private authService: AuthService // Ajout du service
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      password_confirm: ['', Validators.required],
      terms: [false, Validators.requiredTrue]
    }, {
      validators: this.matchPasswords('password', 'password_confirm') // Correction du nom du champ
    });
  }

  matchPasswords(password: string, confirmPassword: string) {
    return (formGroup: FormGroup) => {
      const pass = formGroup.controls[password];
      const confirm = formGroup.controls[confirmPassword];
      
      if (pass.value !== confirm.value) {
        confirm.setErrors({ mismatch: true });
      } else {
        confirm.setErrors(null);
      }
    };
  }

  onUserRegister(): void {
    if (this.registerForm.valid) {
      this.loading = true;
      
      // Préparer les données pour l'API
      const userData: IUserRegister = {
        name: this.registerForm.get('name')?.value,
        email: this.registerForm.get('email')?.value,
        password: this.registerForm.get('password')?.value,
        password_confirm: this.registerForm.get('password_confirm')?.value
      };

      // Appel au service d'authentification
      this.authService.registerUser(userData).subscribe({
        next: (response) => {
          console.log('Inscription réussie:', response);
          this.loading = false;
          this.router.navigateByUrl('login'); // Rediriger vers la page de connexion
        },
        error: (error) => {
          console.error('Erreur lors de l\'inscription:', error);
          this.loading = false;
          // Gérer les erreurs (afficher un message à l'utilisateur)
        }
      });
      
    } else {
      // Marquer tous les champs comme "touchés" pour afficher les erreurs
      this.registerForm.markAllAsTouched();
    }
  }
}