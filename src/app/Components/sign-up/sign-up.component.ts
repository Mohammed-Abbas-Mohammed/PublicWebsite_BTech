import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../service/Identity/auth.service';
import { LocalizationService } from '../../service/localiztionService/localization.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  styleUrls: ['./sign-up.component.css'],
})
export class SignUpComponent {
  signUpForm: FormGroup;
  isArabic!: boolean;
  translationData = {
    en: {
      passwordValidation: {
        required: 'Password is required',
        minLength: 'Password must be at least 6 characters',
        pattern:
          'Password must include an uppercase letter, a lowercase letter, a number, and a special character',
      },
    },
    ar: {
      passwordValidation: {
        required: 'كلمة المرور مطلوبة',
        minLength: 'يجب أن تكون كلمة المرور 6 أحرف على الأقل',
        pattern:
          'يجب أن تحتوي كلمة المرور على حرف كبير، حرف صغير، رقم، وحرف خاص',
      },
    },
  };
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private translate: LocalizationService
  ) {
    this.translate.IsArabic.subscribe((ar) => (this.isArabic = ar));

    this.signUpForm = this.fb.group(
      {
        fullName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        mobileNumber: [
          '',
          [Validators.required, Validators.pattern('^[0-9]+$')],
        ],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.pattern(
              '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*(),.?":{}|<>]).+$'
            ),
          ],
        ],
        confirmPassword: ['', Validators.required],
      },
      { validator: this.passwordMatchValidator }
    );
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('confirmPassword')?.value
      ? null
      : { mismatch: true };
  }

  onSubmit() {
    if (this.signUpForm.valid) {
      const userData = {
        UserName: this.signUpForm.get('fullName')?.value,
        Email: this.signUpForm.get('email')?.value,
        PhoneNumber: this.signUpForm.get('mobileNumber')?.value,
        Password: this.signUpForm.get('password')?.value,

        UserType: 'User',
        Address: 'Default Address',
        City: 'Default City',
        Country: 'Egypt',
        PostalCode: '12345',
      };

      this.authService.register(userData).subscribe(
        (response) => {
          console.log('Registration successful', response);
          this.router.navigate(['/sign-in']); // توجيه المستخدم إلى الصفحة الرئيسية بعد التسجيل الناجح
        },
        (error) => {
          console.error('Registration failed', error);
        }
      );
    }
  }

  useLanguage() {
    this.translate.ChangeLanguage();
  }

  signin() {
    this.router.navigate(['sign-in']);
  }

  get passwordErrorMessage(): string {
    const passwordControl = this.signUpForm.get('password');
    const currentTranslation = this.isArabic
      ? this.translationData.ar
      : this.translationData.en;

    if (passwordControl?.hasError('required')) {
      return currentTranslation.passwordValidation.required;
    }
    if (passwordControl?.hasError('minlength')) {
      // Use lowercase 'minlength' for error key
      return currentTranslation.passwordValidation.minLength;
    }
    if (passwordControl?.hasError('pattern')) {
      return currentTranslation.passwordValidation.pattern;
    }
    return '';
  }
}
