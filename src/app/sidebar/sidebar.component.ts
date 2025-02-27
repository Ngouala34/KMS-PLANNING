
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  isCollapsed: boolean = false; // État initial de la sidebar

  constructor(private router: Router) { }

  ngOnInit(): void { }

  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
  }
  OnUserConnexion(): void {
    this.router.navigateByUrl('user-home');
  }
  OnUserService(): void {    
    this.router.navigateByUrl('user-serv');
  }
}
