import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  menuOpen = false;
  toggleMenuVisible = false;


  constructor(private router : Router) { }

  ngOnInit(): void {
  }


  toggleMenu() {
    this.toggleMenuVisible = !this.toggleMenuVisible;
  }
  OnUserConnexion(): void {
    this.router.navigateByUrl('user-home');
  }

  OnUserService(): void {
    this.router.navigateByUrl('user-serv');
  }
  OnUserdashboard(): void {
    this.router.navigateByUrl('user-dashboard');
  }
  OnUserprofile(): void {
    this.router.navigateByUrl('user-profile');
  } 
   OnUserHistorique(): void {
    this.router.navigateByUrl('user-historique');
  }
  OnUserCalendrier(): void {
    this.router.navigateByUrl('user-calendrier');
   }
}



