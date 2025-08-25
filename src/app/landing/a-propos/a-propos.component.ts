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
      name: 'Keyou Guy Martial',
      role: 'CEO & Fondateur',
      image: '/assets/images/KGM.jpeg',
      description: 'Ingénieur logiciel avec 10 ans d\'expérience dans le domaine des services digitaux.',
      social: {
        linkedin: '#',
        twitter: '#'
      }
    },
    {
      name: 'Tchanou Josué',
      role: 'Directeur Technique',
      image: '/assets/images/TJ.jpeg',
      description: 'Développeur full-stack passionnée par la création d\'expériences utilisateur exceptionnelles.',
      social: {
        linkedin: '#',
        github: '#'
      }
    },
    {
      name: 'Ngoualadjo Pizulehe Junior',
      role: 'DEveloppeur Frontend',
      image: '/assets/images/NPJ.png',
      description: 'Développeur frontend spécialisé dans la création d\'interfaces utilisateur intuitives et réactives.',
      social: {
        linkedin: 'https://www.linkedin.com/in/junior-ngoualadjo-1103a8267/',
        twitter: '#'
      }
    }
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

// Histoire détaillée de l'entreprise
companyHistory = [
  {
    year: '2020',
    title: 'Fondation et Vision',
    description: `Création de KMS Planning par une équipe passionnée de développeurs et d'experts en expérience utilisateur. 
    Notre vision était de révolutionner la prise de rendez-vous en ligne en Afrique, en offrant une plateforme intuitive 
    qui connecte efficacement les professionnels et leurs clients.`,
    image: '/assets/images/foncdation.jpg'
  },
  {
    year: '2021',
    title: 'Lancement Version 1.0 - Premiers Pas',
    description: `Lancement officiel de la première version de notre plateforme après des mois de développement intensif 
    et de tests utilisateurs. Cette version incluait les fonctionnalités essentielles de réservation, gestion de calendrier 
    et notifications. Nos premiers clients, principalement des consultants et formateurs locaux, ont adopté la solution 
    avec enthousiasme.`,
    image: '/assets/images/history/2021-launch.jpg',

  },
  {
    year: '2022',
    title: 'Expansion et Croissance - Conquête de Nouveaux Marchés',
    description: `Année d'expansion significative avec l'entrée sur de nouveaux marchés en Afrique francophone. 
    Nous avons ajouté des fonctionnalités avancées comme la visioconférence intégrée, les rappels automatisés 
    et l'analyse de performance. L'équipe a triplé pour supporter la croissance et nous avons ouvert un second 
    bureau à Yaoundé.`,
    image: '/assets/images/history/2022-expansion.jpg',

  },
  {
    year: '2023',
    title: 'Innovation et IA - L\'Ère de l\'Intelligence Artificielle',
    description: `Introduction de l'intelligence artificielle pour optimiser les recommandations d'experts 
    et anticiper les besoins des utilisateurs. Lancement de notre application mobile native disponible sur 
    iOS et Android, offrant une expérience encore plus fluide. `,
    image: '/assets/images/notification.jpg',

  },
  {
    year: '2024',
    title: 'Excellence et Reconnaissance - Leader du Marché',
    description: `Consolidation de notre position de leader en Afrique francophone avec une refonte complète 
    de l'interface utilisateur et l'introduction de fonctionnalités premium. Reconnaissance internationale 
    avec le prix de la meilleure startup tech africaine. Début de notre expansion en Afrique anglophone 
    avec une version multilingue de la plateforme.`,
    image: '/assets/images/history/2024-excellence.jpg',

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