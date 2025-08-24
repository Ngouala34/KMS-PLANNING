import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent {
  contactForm: FormGroup;
  isSubmitted = false;
  isLoading = false;

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.pattern('^[0-9+]{8,15}$')]],
      subject: ['', [Validators.required]],
      message: ['', [Validators.required, Validators.minLength(10)]],
      consent: [false, [Validators.requiredTrue]]
    });
  }

  // Accès simplifié aux contrôles du formulaire
  get f() { return this.contactForm.controls; }

  onSubmit() {
    this.isSubmitted = true;
    
    if (this.contactForm.valid) {
      this.isLoading = true;
      
      // Simulation d'envoi (à remplacer par votre service API)
      setTimeout(() => {
        console.log('Formulaire envoyé:', this.contactForm.value);
        this.isLoading = false;
        this.contactForm.reset();
        this.isSubmitted = false;
        
        // Ici vous ajouteriez normalement un message de succès
        alert('Votre message a été envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.');
      }, 2000);
    }
  }

  // Informations de contact
  contactInfo = {
    address: 'Douala, Cameroun',
    phone: '+237 6XX XXX XXX',
    email: 'support@meetexpert.com',
    hours: 'Lundi - Vendredi: 8h - 17h\n & \n  Samedi: 8h - 12h'
  };

  // Sujets prédéfinis pour le formulaire
  subjects = [
    'Demande d\'information',
    'Problème technique',
    'Suggestion d\'amélioration',
    'Demande de partenariat',
    'Autre'
  ];
}