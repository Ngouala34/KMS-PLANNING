import { Component, HostListener } from '@angular/core';

interface Avis {
  avatar: string;
  nom: string;
  role: string;
  note: string;
  date: string;
  commentaire: string;
}

@Component({
  selector: 'app-avis-carousel',
  templateUrl: './avis-carousel.component.html',
  styleUrls: ['./avis-carousel.component.scss']
})
export class AvisCarouselComponent {
  currentIndex = 0;
  animationState: 'ready' | 'sliding-next' | 'sliding-prev' = 'ready';
  avis: Avis[] = [
    {
      avatar: '/assets/images/user1.jpg',
      nom: 'David K',
      role: 'Formateur en développement web',
      note: '★★★★★',
      date: 'Il y a 1 mois',
      commentaire: 'En tant qu\'expert, cette application m\'a permis de proposer mes formations sans me soucier de la gestion des rendez-vous. Les paiements sont sécurisés, les liens de visioconférence sont générés automatiquement.'
    },
    {
      avatar: '/assets/images/userStudent.jpg',
      nom: 'Sarah Ngouffo',
      role: 'Etudiante en marketing digital',
      note: '★★★★★',
      date: 'Il y a 2 semaines',
      commentaire: 'J\'ai pu réserver une formation en quelques clics et échanger directement avec un expert de mon domaine. Plus besoin d\'envoyer des dizaines d\'emails pour fixer un rendez-vous, tout est automatisé ! 👏'
    },
    {
      avatar: '/assets/images/user2.jpg',
      nom: 'Marc T',
      role: 'Consultant SEO',
      note: '★★★★☆',
      date: 'Il y a 3 jours',
      commentaire: 'Solution très pratique pour mes consultations. L\'interface est intuitive et mes clients apprécient la simplicité.'
    },
    {
      avatar: '/assets/images/user3.jpg',
      nom: 'Élodie P',
      role: 'Formatrice en design',
      note: '★★★★',
      date: 'Hier',
      commentaire: 'Je recommande vivement cette plateforme. La gestion des créneaux est un vrai gain de temps au quotidien.'
    }
  ];

  get prevIndex(): number {
    return (this.currentIndex - 1 + this.avis.length) % this.avis.length;
  }

  get nextIndex(): number {
    return (this.currentIndex + 1) % this.avis.length;
  }

  @HostListener('window:resize')
  onResize() {}

  nextAvis() {
    if (this.animationState !== 'ready') return;
    this.animationState = 'sliding-next';

    setTimeout(() => {
      this.currentIndex = this.nextIndex;
      this.animationState = 'ready';
    }, ); // temps pour l'animation
  }

  prevAvis() {
    if (this.animationState !== 'ready') return;
    this.animationState = 'sliding-prev';

    setTimeout(() => {
      this.currentIndex = this.prevIndex;
      this.animationState = 'ready';
    }, ); // temps pour l'animation
  }

  isMobileView(): boolean {
    return window.innerWidth < 768;
  }

  ngOnInit() {
    this.onResize();
  }
}
