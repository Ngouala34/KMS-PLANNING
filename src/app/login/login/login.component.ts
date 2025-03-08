import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginData = { email: '', password: '' }; // Stocke les valeurs du formulaire
  errorMessage: string = ''; // Message d'erreur

  constructor(private router: Router , private authService: AuthService) {}

  ngOnInit(): void {}

  OnUserConnexion(): void {
   
  }
}
