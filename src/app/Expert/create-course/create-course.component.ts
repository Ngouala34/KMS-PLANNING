import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CourseService } from 'src/app/services/course.service';

interface Subcategory {
  value: string;
  displayName: string;
}

interface Category {
  value: string;
  displayName: string;
  subcategories: Subcategory[];
}

@Component({
  selector: 'app-create-course',
  templateUrl: './create-course.component.html',
  styleUrls: ['./create-course.component.scss']
})
export class CreateCourseComponent {
  courseForm: FormGroup;
  isSubmitting = false;
  coverImage: File | null = null;
  previewImage: string |null = null;
  showSubcategories = false;
  availableSubcategories: Subcategory[] = [];

  videoPlatforms = [
    { value: 'google_meet', label: 'Google Meet' },
    { value: 'zoom', label: 'Zoom' }
  ];

  categories: Category[] = [
    {
      value: 'programming_tech',
      displayName: 'Programmation & Tech',
      subcategories: [
        { value: 'web_ai_software', displayName: 'Sites web IA & Logiciel' },
        { value: 'mobile_ai_apps', displayName: 'Applications mobiles IA' },
        { value: 'ai_integrations', displayName: 'Intégrations IA' },
        { value: 'ai_tech_advice', displayName: 'Conseil en technologie IA' },
        { value: 'custom_websites', displayName: 'Développement de sites web' },
        { value: 'personalized_websites', displayName: 'Sites web personnalisés' },
        { value: 'landing_pages', displayName: 'Landing pages' },
        { value: 'dropshipping_sites', displayName: 'Sites web de dropshipping' },
        { value: 'website_maintenance', displayName: 'Maintenance de site web' },
        { value: 'bug_fixing', displayName: 'Correction de bugs' },
        { value: 'backup_migration', displayName: 'Sauvegarde et migration' },
        { value: 'speed_optimization', displayName: 'Optimisation de la vitesse' },
        { value: 'cloud_computing', displayName: 'Cloud Computing' },
        { value: 'devops_engineering', displayName: 'DevOps Engineering' },
        { value: 'cybersecurity', displayName: 'Cybersecurity' },
        { value: 'cross_platform_dev', displayName: 'Développement multiplateforme' },
        { value: 'android_dev', displayName: 'Android' },
        { value: 'ios_dev', displayName: 'iOS' },
        { value: 'mobile_maintenance', displayName: 'Maintenance mobile' },
        { value: 'web_apps', displayName: 'Applications web' },
        { value: 'workflow_automation', displayName: 'Automations & Flux de travail' },
        { value: 'api_integrations', displayName: 'API et intégrations' },
        { value: 'databases', displayName: 'Bases de données' },
        { value: 'qa_review', displayName: 'QA et révision' },
        { value: 'user_testing', displayName: 'Tests utilisateurs' }
      ]
    },
    {
      value: 'digital_marketing',
      displayName: 'Marketing digital',
      subcategories: [
        { value: 'seo_onpage', displayName: 'SEO on-page' },
        { value: 'seo_technique', displayName: 'SEO technique' },
        { value: 'link_building', displayName: 'Link building' },
        { value: 'google_ads', displayName: 'Google Ads' },
        { value: 'facebook_ads', displayName: 'Facebook Ads' },
        { value: 'instagram_ads', displayName: 'Instagram Ads' },
        { value: 'community_management', displayName: 'Community management' },
        { value: 'growth_hacking', displayName: 'Growth hacking' },
        { value: 'content_strategy', displayName: 'Stratégie de contenu' },
        { value: 'email_campaigns', displayName: 'Campagnes email' },
        { value: 'newsletters', displayName: 'Newsletters' },
        { value: 'automation', displayName: 'Automatisations' },
        { value: 'audit_digital', displayName: 'Audit digital' },
        { value: 'marketing_plan', displayName: 'Plan marketing' },
        { value: 'branding', displayName: 'Branding' }
      ]
    },
    {
      value: 'legal_services',
      displayName: 'Services Juridiques',
      subcategories: [
        { value: 'contract_writing', displayName: 'Rédaction de contrats' },
        { value: 'company_creation', displayName: 'Constitution d\'entreprise' },
        { value: 'commercial_law', displayName: 'Droit commercial' },
        { value: 'intellectual_property', displayName: 'Propriété intellectuelle' },
        { value: 'family_law', displayName: 'Droit familial' },
        { value: 'inheritance', displayName: 'Successions' },
        { value: 'real_estate_law', displayName: 'Droit immobilier' },
        { value: 'civil_liability', displayName: 'Responsabilité civile' },
        { value: 'legal_representation', displayName: 'Représentation en justice' },
        { value: 'mediation', displayName: 'Médiation' },
        { value: 'arbitration', displayName: 'Arbitrage' },
        { value: 'criminal_procedures', displayName: 'Procédures pénales' },
        { value: 'data_protection', displayName: 'Protection des données (RGPD)' },
        { value: 'financial_compliance', displayName: 'Compliance financière' },
        { value: 'labor_law', displayName: 'Droit du travail' }
      ]
    },
    {
      value: 'banking_finance',
      displayName: 'Banques & Finances',
      subcategories: [
        { value: 'checking_accounts', displayName: 'Comptes courants' },
        { value: 'mortgage_loans', displayName: 'Prêts immobiliers' },
        { value: 'business_loans', displayName: 'Crédits professionnels' },
        { value: 'wealth_management', displayName: 'Gestion de patrimoine' },
        { value: 'online_payments', displayName: 'Paiements en ligne' },
        { value: 'blockchain', displayName: 'Blockchain' },
        { value: 'crowdfunding', displayName: 'Crowdfunding' },
        { value: 'robo_advisors', displayName: 'Robo-advisors' },
        { value: 'financial_audit', displayName: 'Audit financier' },
        { value: 'internal_control', displayName: 'Contrôle interne' },
        { value: 'risk_management', displayName: 'Gestion des risques' },
        { value: 'due_diligence', displayName: 'Due diligence' },
        { value: 'asset_management', displayName: 'Gestion d\'actifs' },
        { value: 'financial_planning', displayName: 'Planification financière' },
        { value: 'retirement', displayName: 'Retraite' },
        { value: 'taxation', displayName: 'Fiscalité' }
      ]
    },
    {
      value: 'society_services',
      displayName: 'Société & Services',
      subcategories: [
        { value: 'job_insertion', displayName: 'Insertion professionnelle' },
        { value: 'senior_support', displayName: 'Aide aux seniors' },
        { value: 'family_services', displayName: 'Services familial' },
        { value: 'housing_aid', displayName: 'Aide au logement' },
        { value: 'private_lessons', displayName: 'Cours particuliers' },
        { value: 'professional_training', displayName: 'Formation professionnelle' },
        { value: 'career_coaching', displayName: 'Coaching carrière' },
        { value: 'development_workshops', displayName: 'Ateliers de développement' },
        { value: 'human_resources', displayName: 'Ressources humaines' },
        { value: 'corporate_communication', displayName: 'Communication corporate' },
        { value: 'event_organization', displayName: 'Organisation d\'événements' },
        { value: 'facility_management', displayName: 'Facility management' }
      ]
    },
    {
      value: 'sports_coaching',
      displayName: 'Sport & Coaching',
      subcategories: [
        { value: 'athlete_representation', displayName: 'Représentation d\'athlètes' },
        { value: 'sponsorship', displayName: 'Sponsoring' },
        { value: 'performance_reviews', displayName: 'Bilans de performance' },
        { value: 'post_career_transition', displayName: 'Transition post-carrière' },
        { value: 'competition_organization', displayName: 'Organisation de compétitions' },
        { value: 'logistics_management', displayName: 'Gestion logistique' },
        { value: 'event_security', displayName: 'Sécurité événementielle' },
        { value: 'sports_promotion', displayName: 'Promotion sportive' },
        { value: 'performance_analysis', displayName: 'Analyse de performance' },
        { value: 'fitness_apps', displayName: 'Applications fitness' },
        { value: 'esport', displayName: 'E-sport' },
        { value: 'connected_equipment', displayName: 'Équipements connectés' },
        { value: 'custom_programs', displayName: 'Programmes sur mesure' },
        { value: 'physical_preparation', displayName: 'Préparation physique' },
        { value: 'sports_nutrition', displayName: 'Nutrition sportive' },
        { value: 'recovery', displayName: 'Récupération' }
      ]
    },
    {
      value: 'design',
      displayName: 'Design',
      subcategories: [
        { value: 'logos', displayName: 'Logos' },
        { value: 'business_cards', displayName: 'Cartes de visite' },
        { value: 'brochures', displayName: 'Brochures' },
        { value: 'wireframes', displayName: 'Wireframes' },
        { value: 'prototypes', displayName: 'Prototypes' },
        { value: 'user_testing', displayName: 'Tests utilisateurs' },
        { value: 'custom_illustrations', displayName: 'Illustrations personnalisées' },
        { value: 'infographics', displayName: 'Infographies' }
      ]
    },
    {
      value: 'business',
      displayName: 'Business',
      subcategories: [
        { value: 'business_plan', displayName: 'Business plan' },
        { value: 'pitch_deck', displayName: 'Pitch deck' },
        { value: 'management_consulting', displayName: 'Conseil en gestion' },
        { value: 'company_creation', displayName: 'Création entreprise' },
        { value: 'legal_mentoring', displayName: 'Mentorat juridique' },
        { value: 'recruitment', displayName: 'Recrutement' },
        { value: 'coaching', displayName: 'Coaching' },
        { value: 'training', displayName: 'Formation' }
      ]
    }
  ];

  constructor(
    private fb: FormBuilder, 
    private http: HttpClient, 
    private router: Router, 
    private courseService: CourseService
  ) {
    this.courseForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.maxLength(500)]],
      price: ['', [Validators.required, Validators.min(0)]],
      platform: ['google_meet', Validators.required],
      date: ['', Validators.required],
      startTime: ['09:00', Validators.required],
      endTime: ['10:00', Validators.required],
      category: ['', Validators.required],
      subsubcategory: ['', Validators.required],
      meeting_link: ['', [Validators.required, Validators.maxLength(200)]]
    });

    this.courseForm.get('category')?.valueChanges.subscribe(category => {
      this.onCategoryChange(category);
    });
  }

  onCategoryChange(selectedCategory: string): void {
    if (selectedCategory) {
      const category = this.categories.find(cat => cat.value === selectedCategory);
      if (category) {
        this.availableSubcategories = category.subcategories;
        this.showSubcategories = true;
        this.courseForm.patchValue({ subsubcategory: '' });
      }
    } else {
      this.showSubcategories = false;
      this.availableSubcategories = [];
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      if (file.size > 2 * 1024 * 1024) {
        alert("La taille maximale de l'image est de 2MB");
        return;
      }

      this.coverImage = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.previewImage = reader.result as string; // base64 utilisable directement
      };
      reader.readAsDataURL(file);
    }
  }


  removeImage(): void {
    if (this.previewImage) {
      URL.revokeObjectURL(this.previewImage as string);
    }
    this.coverImage = null;
    this.previewImage = null;
  }

  onCreateService(): void {
    if (this.courseForm.invalid) {
      this.markFormGroupTouched(this.courseForm);
      return;
    }

    this.isSubmitting = true;

    const formData = new FormData();
    formData.append('name', this.courseForm.value.name);
    formData.append('description', this.courseForm.value.description);
    formData.append('price', this.courseForm.value.price.toString());
    formData.append('platform', this.courseForm.value.platform);
    formData.append('date', this.courseForm.value.date);
    formData.append('start_time', this.courseForm.value.startTime);
    formData.append('end_time', this.courseForm.value.endTime);
    formData.append('category', this.courseForm.value.category);
    formData.append('subsubcategory', this.courseForm.value.subsubcategory);
    formData.append('meeting_link', this.courseForm.value.meeting_link);
    
    if (this.coverImage) {
      formData.append('cover_image', this.coverImage);
    }

    // Debug: afficher les données envoyées
    console.log('📤 Données envoyées:');
    console.log('Category:', this.courseForm.value.category);
    console.log('Subcategory:', this.courseForm.value.subsubcategory);

    this.courseService.createCourse(formData).subscribe({
      next: (response) => {
        console.log('Service créé:', response);
        this.isSubmitting = false;
        this.resetForm();
        this.router.navigate(['/expert-formation']);
      },
      error: (error) => {
        console.error(' Erreur:', error);
        this.isSubmitting = false;
        this.handleError(error);
      }
    });
  }

  private resetForm(): void {
    this.courseForm.reset({
      platform: 'google_meet',
      startTime: '09:00',
      endTime: '10:00'
    });
    this.removeImage();
    this.showSubcategories = false;
    this.availableSubcategories = [];
  }

  private handleError(error: any): void {
    let errorMessage = 'Erreur lors de la création du service';
    
    if (error.error) {
      if (error.error.errors) {
        errorMessage = this.formatValidationErrors(error.error.errors);
      } else if (error.error.message) {
        errorMessage = error.error.message;
      }
    } else if (error.status === 0) {
      errorMessage = 'Connexion au serveur impossible';
    } else if (error.status === 401) {
      errorMessage = 'Connectez-vous pour créer un service';
      this.router.navigate(['/login']);
    }
    
    alert(errorMessage);
  }

  private formatValidationErrors(errors: any): string {
    return Object.entries(errors)
      .map(([field, messages]) => `${field}: ${(messages as string[]).join(', ')}`)
      .join('\n');
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  ngOnDestroy(): void {
    this.removeImage();
  }
}