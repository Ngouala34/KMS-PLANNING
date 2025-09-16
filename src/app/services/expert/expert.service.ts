import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { IService } from 'src/app/Interfaces/iservice';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExpertService {

  private apiUrl = environment.apiUrl ;

  constructor(private http : HttpClient) { }

  //Méthodes pour la creation, modification, suppression et récupération des services d'un expert

  getAllServices(): Observable<IService[]> {
    return this.http.get<IService[]>(`${this.apiUrl}services/`).pipe(
      catchError(error => {
        console.error('Error fetching services:', error);
        throw error;
      })
    );
  }

  updateService(id: number, serviceData: any): Observable<IService> {
    return this.http.put<IService>(`${this.apiUrl}services/${id}/`, serviceData).pipe(
      catchError(error => {
        console.error('Error updating service:', error);
        throw error;
      })
    );
  }

getServiceDetails(id: number): Observable<IService> {
  return this.http.get<IService>(`${this.apiUrl}services/${id}/`).pipe(
    catchError(error => {
      console.error('Error fetching service:', error);
      return throwError(() => error); // bonne pratique RxJS 7+
    })
  );
}


}
