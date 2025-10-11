import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { forkJoin, Subscription, throwError } from 'rxjs';
import { tap, catchError, finalize } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { ICommentResponse, IService } from '../Interfaces/iservice';
import { UserService } from '../services/user/user.service';

interface Review {
  id: number;
  author: string;
  avatar?: string;
  rating: number;
  comment: string;
  date: string;
  helpfulCount?: number;
  isHelpful?: boolean;
  tags?: string[];
  isExpanded?: boolean;
  userId?: number;
}

interface ReviewsStats {
  averageRating: number;
  totalReviews: number;
  breakdown: {
    stars: number;
    count: number;
    percentage: number;
  }[];
}

@Component({
  selector: 'app-service-details-avis',
  templateUrl: './service-details-avis.component.html',
  styleUrls: ['./service-details-avis.component.scss'],
  animations: [
    trigger('slideInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0, transform: 'translateY(-10px)' }))
      ])
    ])
  ]
})
export class ServiceDetailsAvisComponent implements OnInit, OnDestroy {

  serviceId!: number;
  @Input() expertId!: number;
  @Input() currentUserId!: number;
  @Output() reviewSubmitted = new EventEmitter<Review>();
  
  @Input() service!: IService;
  reviews: Review[] = [];
  filteredReviews: Review[] = [];
  pagedReviews: Review[] = [];
  reviewsStats: ReviewsStats | null = null;

  isLoadingReviews = true;
  selectedFilter: 'all' | number = 'all';
  sortBy = 'date_desc';

  currentPage = 1;
  reviewsPerPage = 5;
  totalPages = 1;

  userRating = 0;
  tempRating = 0;
  userComment = '';
  selectedTags: string[] = [];
  isSubmitting = false;
  showSuccess = false;
  submitError = '';

  private subscriptions: Subscription = new Subscription();

  suggestedTags = [
    'Professionnel',
    'À l\'écoute', 
    'Pédagogue',
    'Compétent',
    'Ponctuel',
    'Recommandé'
  ];

  ratingLabels: { [key: number]: string } = {
    1: 'Très insatisfait',
    2: 'Insatisfait',
    3: 'Correct',
    4: 'Satisfait',
    5: 'Excellent'
  };

  constructor(
    private userService: UserService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.serviceId = idParam ? Number(idParam) : NaN;

    if (!this.serviceId || isNaN(this.serviceId)) {
      console.error(' ID de service invalide dans l’URL');
    } else {
      console.log('Service ID récupéré:', this.serviceId);
      // Charger les avis si nécessaire
      // this.loadReviews();
    }
    this.loadTopComments();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  submitReview(): void {
    if (!this.serviceId || isNaN(this.serviceId)) {
      this.submitError = 'ID du service invalide.';
      return;
    }

    if (this.userRating < 1 || !this.userComment.trim() || this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;
    this.submitError = '';

    const comment$ = this.userService.addComment(
      this.serviceId,
      this.userComment.trim()
    );

    const rating$ = this.userService.addRating(
      this.service.expert.id, // Utiliser expertId pour la note
      this.userRating
    );

    const submitSub = forkJoin([comment$, rating$]).pipe(
      tap(([commentResponse, ratingResponse]) => {
        console.log('Commentaire ajouté:', commentResponse);
        console.log('Note ajoutée:', ratingResponse);

        this.showSuccess = true;
        this.resetForm();

        setTimeout(() => {
          this.showSuccess = false;
        }, 4000);
      }),
      catchError(error => {
        console.error('Erreur lors de la soumission:', error);
        this.submitError = 'Impossible de soumettre l’avis. Veuillez réessayer.';
        return throwError(() => error);
      }),
      finalize(() => {
        this.isSubmitting = false;
      })
    ).subscribe();

    this.subscriptions.add(submitSub);
  }

  resetForm(): void {
    this.userRating = 0;
    this.tempRating = 0;
    this.userComment = '';
    this.selectedTags = [];
    this.submitError = '';
  }

  setRating(rating: number): void {
    this.userRating = rating;
    this.tempRating = rating;
  }

  setTempRating(rating: number): void {
    this.tempRating = rating;
  }

  resetTempRating(): void {
    this.tempRating = this.userRating;
  }

  getRatingLabel(rating: number): string {
    return this.ratingLabels[rating] || '';
  }

  toggleTag(tag: string): void {
    const index = this.selectedTags.indexOf(tag);
    if (index > -1) {
      this.selectedTags.splice(index, 1);
    } else {
      this.selectedTags.push(tag);
    }
  }

  toggleExpanded(review: Review): void {
    review.isExpanded = !review.isExpanded;
  }

  toggleHelpful(review: Review): void {
    if (review.isHelpful) {
      review.helpfulCount = (review.helpfulCount || 1) - 1;
      review.isHelpful = false;
    } else {
      review.helpfulCount = (review.helpfulCount || 0) + 1;
      review.isHelpful = true;
    }
  }

  reportReview(review: Review): void {
    console.log('Avis signalé:', review.id);
  }

  onImageError(event: any): void {
    event.target.src = '/assets/images/default-avatar.png';
  }

  trackByReviewId(index: number, review: Review): number {
    return review.id;
  }


/**
 * Charger les 3 derniers commentaires de l'expert/service
 */
loadTopComments(): void {
  if (!this.serviceId) return;

  this.isLoadingReviews = true;

  const commentsSub = this.userService.getUserComments(Number(this.serviceId))
    .pipe(
      catchError(error => {
        console.error('Erreur lors de la récupération des commentaires:', error);
        this.submitError = 'Impossible de charger les commentaires';
        return [];
      }),
      finalize(() => {
        this.isLoadingReviews = false;
      })
    )
    .subscribe((comments) => {
      if (!comments || comments.length === 0) {
        this.reviews = [];
        this.filteredReviews = [];
        this.pagedReviews = [];
        return;
      }

      // Trier par date décroissante (les plus récents)
      comments.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      // Garder uniquement les 3 premiers
      const topComments = comments.slice(0, 3);

      // Mapper pour correspondre à l'interface Review
      this.reviews = topComments.map(c => ({
        id: c.id,
        author: c.user_name,
        avatar: '', // tu peux mettre un avatar par défaut ou récupérer depuis l'API
        rating: 0,  // si tu n'as pas de note dans les commentaires, sinon remplace par c.rating
        comment: c.content,
        date: c.created_at,
        helpfulCount: 0,
        tags: [],
        isExpanded: false,
        userId: c.user
      }));

      // Initialiser les filtres et la pagination
      this.selectedFilter = 'all';
      this.sortBy = 'date_desc';
      this.applyFiltersAndSort();
    });

  this.subscriptions.add(commentsSub);
}




  // ---------------- Pagination, filtre, tri ---------------- //

  applyFiltersAndSort(): void {
    if (this.selectedFilter === 'all') {
      this.filteredReviews = [...this.reviews];
    } else {
      this.filteredReviews = this.reviews.filter(review => review.rating === this.selectedFilter);
    }
    
    this.sortReviews();
    this.updatePagination();
  }

  setFilter(filter: 'all' | number): void {
    this.selectedFilter = filter;
    this.currentPage = 1;
    this.applyFiltersAndSort();
  }

  sortReviews(): void {
    switch (this.sortBy) {
      case 'date_desc':
        this.filteredReviews.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
      case 'date_asc':
        this.filteredReviews.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        break;
      case 'rating_desc':
        this.filteredReviews.sort((a, b) => b.rating - a.rating);
        break;
      case 'rating_asc':
        this.filteredReviews.sort((a, b) => a.rating - b.rating);
        break;
    }
    this.updatePagination();
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredReviews.length / this.reviewsPerPage);
    
    if (this.currentPage > this.totalPages) {
      this.currentPage = 1;
    }
    
    const startIndex = (this.currentPage - 1) * this.reviewsPerPage;
    const endIndex = startIndex + this.reviewsPerPage;
    this.pagedReviews = this.filteredReviews.slice(startIndex, endIndex);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxPagesToShow = 5;
    
    let startPage = Math.max(1, this.currentPage - 2);
    let endPage = Math.min(this.totalPages, startPage + maxPagesToShow - 1);
    
    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  getReviewsCountByRating(rating: number): number {
    return this.reviews.filter(review => review.rating === rating).length;
  }

  // ---------------- Étoiles ---------------- //

  getStarsArray(rating: number): number[] {
    return Array(Math.floor(rating)).fill(0);
  }

  getEmptyStarsArray(rating: number): number[] {
    return Array(5 - Math.floor(rating)).fill(0);
  }

  getFullStars(rating: number): number[] {
    return Array(Math.floor(rating)).fill(0);
  }

  hasHalfStar(rating: number): boolean {
    return rating % 1 >= 0.5;
  }

  getEmptyStars(rating: number): number[] {
    const emptyCount = 5 - Math.ceil(rating);
    return Array(Math.max(0, emptyCount)).fill(0);
  }

}
