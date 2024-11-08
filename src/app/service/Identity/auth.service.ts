import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'https://localhost:7122/api/Account' ; // استخدم رابط الـ API الخاص بك

  constructor(private http: HttpClient) {}

  checkPhoneNumber(mobileNumber: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/CheckNumber`, { PhoneNumber: mobileNumber });
  }

  getCurrentUser(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  } 

  login(email: string, password: string): Observable<any> {
    this.getUserId   
    return this.http.post(`${this.apiUrl}/Login`, { Email: email, Password: password });

  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  signOut(): Observable<any> {
    return this.http.post(`${this.apiUrl}/signout`, {});

  }


  getUserId(id: number): Observable<any> {
  var res=  this.http.get<any>(`${this.apiUrl}/UserId?id=${id}`);
  console.log("the user id",res)
     return res

  }

  loginUser(id: number): void {
    this.getUserId(id).subscribe(
      (response) => {
        if (response && response.userId) {
          // تخزين userId في localStorage
          localStorage.setItem('userId', response.userId);
          console.log('User ID saved:', response.userId);
        }
      },
      (error) => {
        console.error('Error fetching user ID:', error);
      }
    );
  }
}
