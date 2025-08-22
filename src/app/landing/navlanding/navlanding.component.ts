import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navlanding',
  templateUrl: './navlanding.component.html',
  styleUrls: ['./navlanding.component.scss']
})
export class NavlandingComponent implements OnInit {
  isSticky = false;
  toggleMenuVisible = false;

  constructor(private router: Router) {}

  ngOnInit(): void {}

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    this.isSticky = scrollY > 0;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const menu = document.querySelector('.mobile-menu');
    const toggle = document.querySelector('.toggle-menu');
    if (this.toggleMenuVisible && menu && toggle &&
        !menu.contains(event.target as Node) &&
        !toggle.contains(event.target as Node)) {
      this.toggleMenuVisible = false;
    }
  }

  toggleMenu(): void {
    this.toggleMenuVisible = !this.toggleMenuVisible;
  }

  onService(): void {
    this.router.navigateByUrl('/service-list');
  }

  OnConnexion(): void {
    this.router.navigateByUrl('/login');
  }

  OnInscription(): void {
    this.router.navigateByUrl('/user-register');
  } 
   OnBecomeExpert(): void {
    this.router.navigateByUrl('/become-expert-page'); 
  }
  onAccueil(): void {
    this.router.navigateByUrl('landing');
  }
  OnContact(): void {

  }

  OnApropos(): void{
    
  }
}
