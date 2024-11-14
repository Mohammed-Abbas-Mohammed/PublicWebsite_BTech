import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

interface PaymentDetails {
  transactionId: string;
  orderId: string;
  shippingCost: number;
  shippingAddress: string;
}

@Injectable({
  providedIn: 'root'
})
export class PaypalPaymentService {

  private apiUrl = 'https://btechapi.runasp.net/api/paypal'; // Update with your actual API endpoint

  constructor(private http: HttpClient) {}

  completePayment(details: PaymentDetails): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.apiUrl}/complete-payment`, details, { headers });
  }
}
