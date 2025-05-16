import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {


  @Input() collapsedByDefault = false; // Indique si la sidebar est réduite au départ
  @Output() sidebarToggle = new EventEmitter<boolean>(); //  Envoie l’état de la sidebar au parent


  isCollapsed = false; // État de la sidebar

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.isCollapsed = this.collapsedByDefault; //  Applique la configuration initiale
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed; //  Change l'état de la sidebar
    this.sidebarToggle.emit(this.isCollapsed); //  Envoie l'état au parent
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
   OnUserSouscription(): void {
    this.router.navigateByUrl('user-souscriptions');
  }
  OnUserCalendrier(): void {
    this.router.navigateByUrl('user-calendrier');
   }
   Ondeconnexion():void{
    this.router.navigateByUrl('')
   }
   OnUserParameter(): void {
    this.router.navigateByUrl('user-parameter');
  }
} 



