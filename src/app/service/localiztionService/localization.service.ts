import {  Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, map, Observable, take, timer } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LocalizationService {
  
  private isArabic: BehaviorSubject<boolean>;
  constructor(private translate: TranslateService) {
    this.isArabic = new BehaviorSubject<boolean>(false);
    if (localStorage.getItem('language') === 'ar')
      this.isArabic = new BehaviorSubject<boolean>(true);
  }
  get IsArabic(): Observable<boolean> {
    return this.isArabic.asObservable();
  }

  ChangeLanguage() {

    let language = localStorage.getItem('language') ?? 'en';
    if (language === 'ar') this.isArabic.next(false);
    else this.isArabic.next(true);

    language=this.isArabic.value ? 'ar' : 'en';
    localStorage.setItem('language',language );

    this.translate.use(language);
  }

  
}
