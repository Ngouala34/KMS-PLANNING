import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';


interface Service {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  expertProfil: string;
  expertName: string;
  avarage: number;
  reviews: number;
  price: number;
  category: string;
}

interface FilterCriteria {
  searchText?: string;
  priceRange?: string;
  minRating?: number;
}

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  private _filterCriteria = new BehaviorSubject<FilterCriteria>({});
  private _filteredServices = new BehaviorSubject<Service[]>([]);
  
  readonly filterCriteria$ = this._filterCriteria.asObservable();
  readonly filteredServices$ = this._filteredServices.asObservable();

  private searchSubject = new BehaviorSubject<string>('');

 constructor() {
    // Configuration du debounce pour la recherche (300ms)
   (this.searchSubject.pipe(
  debounceTime(300),
  distinctUntilChanged()
) as Observable<string>).subscribe((searchText: string) => {
  this.updateFilters({ searchText });
});
}

  // Méthode principale de filtrage
  filterServices(services: Service[], criteria: FilterCriteria): Service[] {
    return services.filter(service => {
      return (
        this.matchesSearchText(service, criteria.searchText) &&
        this.matchesPriceRange(service, criteria.priceRange) &&
        this.matchesMinRating(service, criteria.minRating)
      );
    });
  }

  private matchesSearchText(service: Service, searchText?: string): boolean {
    if (!searchText) return true;
    
    const searchLower = searchText.toLowerCase();
    return (
      service.title.toLowerCase().includes(searchLower) ||
      service.expertName.toLowerCase().includes(searchLower) ||
      service.description.toLowerCase().includes(searchLower)
    );
  }

  private matchesPriceRange(service: Service, priceRange?: string): boolean {
    if (!priceRange || priceRange === 'all') return true;
    
    switch(priceRange) {
      case 'economy': return service.price < 10000;
      case 'standard': return service.price >= 10000 && service.price <= 30000;
      case 'premium': return service.price > 30000;
      default: return true;
    }
  }

  private matchesMinRating(service: Service, minRating?: number): boolean {
    return !minRating || service.avarage >= minRating;
  }

  // API publique
  updateSearchText(searchText: string): void {
    this.searchSubject.next(searchText);
  }

  updateFilters(criteria: Partial<FilterCriteria>): void {
    const newCriteria = { ...this._filterCriteria.value, ...criteria };
    this._filterCriteria.next(newCriteria);
  }

  applyFilters(services: Service[]): void {
    const filtered = this.filterServices(services, this._filterCriteria.value);
    this._filteredServices.next(filtered);
  }

  resetFilters(): void {
    this._filterCriteria.next({});
    this.searchSubject.next('');
  }
}