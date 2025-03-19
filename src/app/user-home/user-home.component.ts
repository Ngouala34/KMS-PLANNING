import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-home',
  templateUrl: './user-home.component.html',
  styleUrls: ['./user-home.component.scss']
})
export class UserHomeComponent implements OnInit {
  username: string = '';// Initialise le nom d'utilisateur à une chaîne vide
  email: string = '';  
  userId: any;
  
  collapsedByDefault = false;
  isSidebarCollapsed = false;

  constructor(private router : Router, private authService: AuthService) { }

  ngOnInit(): void {
 
  }

  loadUserData(user: any): void {
    // Récupérer les informations utilisateur à partir de l'ID
    this.userId = user.id;
    this.username = user.username;
    this.email = user.email;
    // Vous pouvez aussi charger d'autres informations en fonction de l'ID
  }

}
