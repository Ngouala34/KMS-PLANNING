import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = 'https://api.flutterwave.com/v3/payments';
  private flutterwaveKey = 'VOTRE_CLE_FLUTTERWAVE'; // Remplace par ta clé API

  constructor(private http: HttpClient) {}

  initiatePayment(paymentData: any): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.flutterwaveKey}`,
      'Content-Type': 'application/json'
    });

    return this.http.post(this.apiUrl, paymentData, { headers });
  }
}
