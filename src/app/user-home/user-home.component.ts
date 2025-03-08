import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-user-home',
  templateUrl: './user-home.component.html',
  styleUrls: ['./user-home.component.scss']
})
export class UserHomeComponent implements OnInit {
  username: string = '';  // Initialise le nom d'utilisateur à une chaîne vide
  collapsedByDefault = false;
  isSidebarCollapsed = false;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    const user = this.authService.currentUserValue;
    if (user) {
      this.username = user.username || 'Utilisateur'; // Si l'utilisateur est connecté, afficher son username
    } else {
      this.username = 'Utilisateur'; // Si aucun utilisateur n'est connecté, afficher "Utilisateur"
    }
  }
}
