import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LocalizationService } from '../../../service/localiztionService/localization.service';
import { AuthService } from '../../../service/Identity/auth.service';
import { TranslateModule } from '@ngx-translate/core';

interface RawImage {
  url_en: string;
  url_ar: string;
  createdAt: string;
}

interface Image {
  url: string;
  createdAt: Date;
}

@Component({
  selector: 'app-banner',
  standalone: true,
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.css'],
  imports: [CommonModule, TranslateModule],
})
export class BannerComponent implements OnInit {
  images: Image[] = [];
  isArabic: boolean = false;
  userName: string = '';
  isLoggedIn: boolean = false;

  Images: RawImage[] = [
    {
      url_en: '/assets/images/1.jpg',
      url_ar: '/assets/images/10.jpg',
      createdAt: '2024-10-1T11:31:00Z',
    },
    {
      url_en: '/assets/images/2.jpg',
      url_ar: '/assets/images/11.jpg',
      createdAt: '2024-10-2T11:32:00Z',
    },
    {
      url_en: '/assets/images/3.png',
      url_ar: '/assets/images/12.png',
      createdAt: '2024-10-3T11:33:00Z',
    },
    {
      url_en: '/assets/images/4.png',
      url_ar: '/assets/images/13.png',
      createdAt: '2024-10-4T11:34:00Z',
    },
    {
      url_en: '/assets/images/5.png',
      url_ar: '/assets/images/14.png',
      createdAt: '2024-10-5T11:36:00Z',
    },
    {
      url_en: '/assets/images/6.png',
      url_ar: '/assets/images/15.png',
      createdAt: '2024-10-6T11:37:00Z',
    },
    {
      url_en: '/assets/images/7.png',
      url_ar: '/assets/images/16.jpg',
      createdAt: '2024-10-7T11:38:00Z',
    },
    {
      url_en: '/assets/images/8.png',
      url_ar: '/assets/images/17.jpg',
      createdAt: '2024-10-8T11:39:00Z',
    },
  ];

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router,
    private localizationService: LocalizationService
  ) {
    this.localizationService.IsArabic.subscribe((ar: boolean) => {
      this.isArabic = ar;
      this.loadImages();
    });
  }

  ngOnInit(): void {
    this.loadImages();
    this.authService.isLoggedInStatus$.subscribe((loggedInStatus) => {
      this.isLoggedIn = loggedInStatus;
      this.userName = loggedInStatus
        ? this.authService.getUserNameFromToken() || ''
        : '';
    });
  }
  loadImages() {
    try {
      this.images = this.Images.map((image: RawImage) => ({
        ...image,
        url: this.isArabic ? image.url_ar : image.url_en,
        createdAt: new Date(image.createdAt),
      }))
        .sort(
          (a: Image, b: Image) => b.createdAt.getTime() - a.createdAt.getTime()
        )
        .slice(0, 5);
    } catch (error) {
      console.error('Error loading images:', error);
    }
  }

  productPage() {
    this.router.navigate(['/products']);
  }
}
