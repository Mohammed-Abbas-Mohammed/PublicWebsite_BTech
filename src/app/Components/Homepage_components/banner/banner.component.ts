import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Route, Router } from '@angular/router';
import { LocalizationService } from '../../../service/localiztionService/localization.service';
import { AuthService } from '../../../service/Identity/auth.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

interface Image {
  url_en: string;
  url_ar: string;
  url: string;
  createdAt: Date;
}

@Component({
  selector: 'app-banner',
  standalone: true,
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.css'],
  imports: [CommonModule,TranslateModule]
})
export class BannerComponent implements OnInit {
  images: Image[] = [];
  isArabic!: boolean;
  userName: string = '';
  isLoggedIn: boolean = false;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router,
    private localizationService: LocalizationService
  ) {
    this.localizationService.IsArabic.subscribe((ar) => {
      this.isArabic = ar;
    });
  }

  ngOnInit(): void {
    this.loadImages();
    this.authService.isLoggedInStatus$.subscribe((loggedInStatus) => {
      this.isLoggedIn = loggedInStatus;
      this.userName = loggedInStatus ? this.authService.getUserNameFromToken() || '' : '';
    });

  }




  loadImages() {
    this.http.get<Image[]>('http://localhost:3000/Images').subscribe((data) => {
      this.images = data
        .map((image) => ({
          ...image,
          url: this.isArabic ? image.url_ar : image.url_en
        }))
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);
    });
  }
  productPage(){
    this.router.navigate(['/products'])
  }
}
