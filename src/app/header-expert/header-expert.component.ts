import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header-expert',
  templateUrl: './header-expert.component.html',
  styleUrls: ['./header-expert.component.scss']
})
export class HeaderExpertComponent implements OnInit { menuOpen = false;
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
    this.router.navigateByUrl('#');
  }
  OnUserdashboard(): void {
    this.router.navigateByUrl('#');
  }
  OnUserprofile(): void {
    this.router.navigateByUrl('#');
  } 
   OnUserHistorique(): void {
    this.router.navigateByUrl('#');
  }
  OnUserCalendrier(): void {
    this.router.navigateByUrl('#');
   }
   OnUserDeconnexion(): void {
    this.router.navigateByUrl('');
   }

}



