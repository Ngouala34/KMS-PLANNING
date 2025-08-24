import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navlanding',
  templateUrl: './navlanding.component.html',
  styleUrls: ['./navlanding.component.scss']
})
export class NavlandingComponent implements OnInit, OnDestroy {
  isSticky = false;
  toggleMenuVisible = false;
  
  // Propriétés pour l'animation de texte
  typedText = '';
  fullText = 'Développez vos compétences avec des experts';
  isTyping = true;
  private typingTimer: any;
  private cursorTimer: any;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.startTypingAnimation();
  }

  ngOnDestroy(): void {
    if (this.typingTimer) {
      clearTimeout(this.typingTimer);
    }
    if (this.cursorTimer) {
      clearInterval(this.cursorTimer);
    }
  }

  startTypingAnimation(): void {
    let i = 0;
    const typingSpeed = 100; // ms par caractère
    
    const type = () => {
      if (i < this.fullText.length) {
        this.typedText += this.fullText.charAt(i);
        i++;
        this.typingTimer = setTimeout(type, typingSpeed);
      } else {
        this.isTyping = false;
        // Redémarrer l'animation après un délai
        setTimeout(() => {
          this.typedText = '';
          this.isTyping = true;
          i = 0;
          type();
        }, 3000);
      }
    };
    
    type();
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
    this.router.navigateByUrl('/become-expert-page'); 
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
}