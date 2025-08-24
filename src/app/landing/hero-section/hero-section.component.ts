import { Component, OnInit, OnDestroy } from '@angular/core';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

@Component({
  selector: 'app-hero-section',
  templateUrl: './hero-section.component.html',
  styleUrls: ['./hero-section.component.scss'],
  animations: [
    trigger('slideAnimation', [
      transition(':enter', [
        style({ transform: 'translateX(-50%) scale(0.9)', opacity: 0 }),
        animate('1000ms ease-out', style({ transform: 'translateX(0) scale(1)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('700ms ease-in', style({ transform: 'translateX(50%) scale(1.1)', opacity: 0 }))
      ])
    ]),
    // Nouvelle animation pour le fadeIn du contenu
    trigger('fadeInUp', [
      transition(':enter', [
        query('h1, p, .partners', [
          style({ opacity: 0, transform: 'translateY(40px)' }),
          stagger('100ms', [
            animate('800ms cubic-bezier(0.35, 0, 0.25, 1)', 
              style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ])
  ]
})
export class HeroSectionComponent implements OnInit, OnDestroy {
  images = [
    { 
      url: 'assets/images/th.jpg', 
      title: 'Trouvez des experts certifiés pour tous vos besoins', 
      subtitle: 'Gagnez du temps, travaillez avec les meilleurs.' 
    },
    { 
      url: 'assets/images/tf.jpg', 
      title: 'Une offre variée, des services exclusifs', 
      subtitle: 'Découvrez des formations et prestations uniques, conçues pour vous.' 
    },
    { 
      url: 'assets/images/tf.webp', 
      title: 'Réservez un service en quelques clics', 
      subtitle: 'Prenez rendez-vous avec un expert qualifié.' 
    },
  ];
  
  currentIndex = 0;
  interval: any;
  isHovered = false;
  
  // Pour forcer le déclenchement de l'animation à chaque changement de slide
  animationState = 0;

  ngOnInit(): void {
    this.startSlider();
  }

  startSlider(): void {
    this.interval = setInterval(() => {
      if (!this.isHovered) this.next();
    }, 5000);
  }

  next(): void {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
    this.animationState++; // Force le redéclenchement de l'animation
  }

  prev(): void {
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
    this.animationState++; // Force le redéclenchement de l'animation
  }

  goTo(index: number): void {
    this.currentIndex = index;
    this.animationState++; // Force le redéclenchement de l'animation
  }

  onMouseEnter(): void {
    this.isHovered = true;
    clearInterval(this.interval);
  }

  onMouseLeave(): void {
    this.isHovered = false;
    this.startSlider();
  }

  ngOnDestroy(): void {
    clearInterval(this.interval);
  }
}