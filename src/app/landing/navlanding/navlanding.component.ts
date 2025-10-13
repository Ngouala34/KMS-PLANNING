import { Component, HostListener, OnInit, OnDestroy, Input } from '@angular/core';
import { Router } from '@angular/router';
import { IAuthResponse, UserProfile } from 'src/app/Interfaces/iuser';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-navlanding',
  templateUrl: './navlanding.component.html',
  styleUrls: ['./navlanding.component.scss']
})
export class NavlandingComponent implements OnInit, OnDestroy {
  isSticky = false;
  toggleMenuVisible = false;
  user!:UserProfile


  constructor(private router: Router, private userService : UserService) {}

  @Input() userAvatar?: string;


ngOnInit(): void {
  this.loadUser();
}

  ngOnDestroy(): void {

  }

loadUser(): void {
  this.userService.getProfile().subscribe({
    next: (user) => {
      this.user = user;
      console.log('Utilisateur chargé :', this.user);
    },
    error: (error) => {
      console.error('Erreur lors du chargement de l\'utilisateur', error);
    }
  });
}

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
      this.closeMenu();
    }
  }

    getUserInitials(): string {
    if (!this.user.name) return 'U';
    
    const names = this.user.name.split(' ');
    if (names.length === 1) {
      return names[0].substring(0, 2).toUpperCase();
    }
    
    return (names[0].charAt(0) + names[1].charAt(0)).toUpperCase();
  }

  toggleMenu(): void {
    this.toggleMenuVisible = !this.toggleMenuVisible;
  }

  closeMenu(): void {
    this.toggleMenuVisible = false;
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
    this.router.navigateByUrl('/expert-register'); 
  }
  
  onAccueil(): void {
    this.router.navigateByUrl('landing');
  }
  
  OnContact(): void {
    this.router.navigateByUrl('/contact');
  }

  OnApropos(): void {
    this.router.navigateByUrl('/a-propos');
  }
  onProfile(): void {

    if (this.user.user_type === 'client') {
    this.router.navigateByUrl('/main-user/user-settings');
  }
  else if (this.user.user_type === 'expert') {
    this.router.navigateByUrl('/main-expert/expert-profile');
  }
}
}