import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar-expert',
  templateUrl: './sidebar-expert.component.html',
  styleUrls: ['./sidebar-expert.component.scss']
})
export class SidebarExpertComponent implements OnInit {

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



  OnExpertService(): void {
    this.router.navigateByUrl('expert-services');
  }
  OnExpertdashboard(): void {
    this.router.navigateByUrl('dashboard-expert');
  }
  OnExpertprofile(): void {
    this.router.navigateByUrl('expert-profile');
  } 
   OnExpertHistorique(): void {
    this.router.navigateByUrl('expert-historique');
  }
  OnExpertCalendrier(): void {
    this.router.navigateByUrl('expert-calendrier');
   }
} 


