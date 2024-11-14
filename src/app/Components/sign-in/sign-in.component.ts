import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators  } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AuthService } from '../../service/Identity/auth.service';
import { Router } from '@angular/router';
import { LocalizationService } from '../../service/localiztionService/localization.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,TranslateModule],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css'
})
export class SignInComponent {
  signInForm: FormGroup;
  isArabic!: boolean;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private translate: LocalizationService

  ) {
    this.translate.IsArabic.subscribe((ar) => (this.isArabic = ar));

    this.signInForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }


onSubmit() {
    if (this.signInForm.valid) {
      const email = this.signInForm.get('email')?.value;
      const password = this.signInForm.get('password')?.value;

      this.authService.login(email, password).subscribe(
        (response) => {
          console.log('Login successful:', response);
          if (response && response.token) {
            const claims = this.authService.getTokenClaims(response.token);
            console.log('Claims from token:', claims);  // طباعة كل الكليمات لمعرفة الأسماء المتاحة
            const userId = claims?.['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
            console.log('User ID from token:', userId);
            localStorage.setItem('authToken', response.token);
            this.router.navigate(['/promotion']);
          } else {
            console.error('Unexpected response:', response);
          }
        },
        (error) => {
          console.error('Login failed:', error);
        }
      );
             this.saveUserInfo;
    }
 }


saveUserInfo(){
  this.authService.getCurrentUser().subscribe({
    next: (data) => {
      console.log('User Claims:', data); // عرض البيانات في الـ console
    },
    error: (error) => {
      console.error('Error fetching user claims:', error);
    }
  });
}
useLanguage() {
  this.translate.ChangeLanguage();
}
signup(){
  this.router.navigate(['/sign-up']);
}
signin(){
  this.router.navigate(['/promotion']);

}
}





