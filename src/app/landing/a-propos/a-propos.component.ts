import { Component } from '@angular/core';

@Component({
  selector: 'app-a-propos',
  templateUrl: './a-propos.component.html',
  styleUrls: ['./a-propos.component.scss']
})
export class AProposComponent {
  
  // Équipe de direction
  leadershipTeam = [
    {
      name: 'Jean Dupont',
      role: 'CEO & Fondateur',
      image: '/assets/images/team/ceo.jpg',
      description: 'Expert en gestion de projet avec 10 ans d\'expérience dans le domaine des services digitaux.',
      social: {
        linkedin: '#',
        twitter: '#'
      }
    },
    {
      name: 'Marie Laurent',
      role: 'Directrice Technique',
      image: '/assets/images/team/cto.jpg',
      description: 'Développeuse full-stack passionnée par la création d\'expériences utilisateur exceptionnelles.',
      social: {
        linkedin: '#',
        github: '#'
      }
    },
    {
      name: 'Paul Martin',
      role: 'Directeur Commercial',
      image: '/assets/images/team/cmo.jpg',
      description: 'Spécialiste du marketing digital et de la croissance des startups technologiques.',
      social: {
        linkedin: '#',
        twitter: '#'
      }
    }
  ];

  // Chiffres clés
  keyFigures = [
    { number: '5000+', label: 'Utilisateurs satisfaits' },
    { number: '250+', label: 'Experts partenaires' },
    { number: '98%', label: 'Taux de satisfaction' },
    { number: '24/7', label: 'Support disponible' }
  ];

  // Valeurs de l'entreprise
  companyValues = [
    {
      icon: 'fas fa-users',
      title: 'Collaboration',
      description: 'Nous croyons en la puissance du travail d\'équipe et des partenariats solides.'
    },
    {
      icon: 'fas fa-lightbulb',
      title: 'Innovation',
      description: 'Nous repoussons constamment les limites pour offrir des solutions innovantes.'
    },
    {
      icon: 'fas fa-shield-alt',
      title: 'Sécurité',
      description: 'La protection de vos données et de votre vie privée est notre priorité absolue.'
    },
    {
      icon: 'fas fa-heart',
      title: 'Service Client',
      description: 'Votre satisfaction est au cœur de toutes nos décisions et actions.'
    }
  ];

  // Histoire de l'entreprise
  companyHistory = [
    {
      year: '2020',
      title: 'Fondation',
      description: 'Création de KMS Planning avec une vision révolutionnaire des rendez-vous en ligne.'
    },
    {
      year: '2021',
      title: 'Lancement Version 1.0',
      description: 'Première version de notre plateforme avec les fonctionnalités de base.'
    },
    {
      year: '2022',
      title: 'Expansion',
      description: 'Ouverture à de nouveaux marchés et intégration de services supplémentaires.'
    },
    {
      year: '2023',
      title: 'Innovation',
      description: 'Lancement de notre application mobile et intégration IA.'
    }
  ];

  // FAQ
  faqItems = [
    {
      question: 'Comment fonctionne la réservation de rendez-vous ?',
      answer: 'Notre plateforme vous permet de trouver des experts, de consulter leurs disponibilités et de réserver des créneaux en quelques clics. Le système génère automatiquement un lien de visioconférence et gère les rappels.',
      open: false
    },
    {
      question: 'Est-ce que le service est sécurisé ?',
      answer: 'Absolument. Nous utilisons un cryptage de pointe pour toutes les données et transactions. Vos informations personnelles et vos rendez-vous sont parfaitement protégés.',
      open: false
    },
    {
      question: 'Comment devenez-vous expert sur la plateforme ?',
      answer: 'Les experts doivent postuler et être validés par notre équipe. Nous vérifions les qualifications, l\'expérience et les références pour garantir la qualité de nos services.',
      open: false
    },
    {
      question: 'Quelles sont les méthodes de paiement acceptées ?',
      answer: 'Nous acceptons les cartes de crédit, les virements bancaires, Mobile Money et plusieurs autres méthodes de paiement locales sécurisées.',
      open: false
    }
  ];

  toggleFaq(index: number): void {
    this.faqItems[index].open = !this.faqItems[index].open;
  }
}