import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  private apiUrl = environment.apiUrl;


  constructor(private http: HttpClient) { }


  //creation des services
  createCourse(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}services/create/`, formData);
  }
}
