import { AfterViewInit, Component, OnInit ,NgModule } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterModule,
  
} from '@angular/router';
import { LocalizationService } from '../../service/localiztionService/localization.service';
import { AuthService } from '../../service/Identity/auth.service';
import { CategoryService } from '../../service/Category/category.service';
import { CommonModule } from '@angular/common';
import { ProductCategoryB } from '../../models/product-category-b';
import { CategoryB } from '../../models/category-b';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    TranslateModule,
    RouterModule,
    FormsModule,
    CommonModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements AfterViewInit , OnInit{
  url: string = 'assets/i18n/.json';
  isArabic!: boolean;
  isLoggedIn: boolean = true;
  categories:any;
  categoryNames: string[] = [];
  selectedCategory: string | null = null;  // To keep track of the selected main category
  subCategories: string[] = [];  // Holds the subcategories of the selected main category
  constructor(
    private translate: LocalizationService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private auth:AuthService,
    private catservice: CategoryService,
    
  ) {
    this.translate.IsArabic.subscribe((ar) => (this.isArabic = ar));
  }
  ngAfterViewInit(): void {
    throw new Error('Method not implemented.');
  }
  ngOnInit(): void {
    // this.getmainCategories();
    this.getallcategory();
  }
  
  
  
  getallcategory() {
    this.catservice.getallcategory().subscribe((res: any) => {
        if (res.isSuccess && Array.isArray(res.entity)) {
            this.categories = res.entity.map((category: any) => {
                //  index  (0 for English, 1 for Arabic)
                const translationIndex = this.isArabic ? 1 : 0;
                const categoryName = category.translations?.[translationIndex]?.categoryName;
  
                let subCategories: string[] = [];
  
                // المرفوض هنا هنجيبها من ال api 
                if (categoryName === "Mobiles & Tablets" || categoryName === "الهواتف والأجهزة اللوحية") {
                    subCategories = ["Mobiles", "Tablets", "Mobile Accessories", "Smart Watches"];
                } else if (categoryName === "TVs" || categoryName === "تلفزيونات وريسيفرات") {
                    subCategories = ["LED TVs", "Smart TVs", "4K TVs", "TV Accessories"];
                } else if (categoryName === "Home Appliances" || categoryName === "الأجهزة المنزلية") {
                    subCategories = ["Refrigerators", "Washing Machines", "Microwaves", "Air Conditioners"];
                } else if (categoryName === "Electronics" || categoryName === "الإلكترونيات") {
                    subCategories = ["Speakers", "Headphones", "Cameras", "Wearable Accessories"];
                } else if (categoryName === "small home application" || categoryName === "أجهزة منزلية صغيرة") {
                    subCategories = ["Laptops", "Desktops", "Tablets", "Laptop Accessories"];
                } else if (categoryName === "samsung" || categoryName === "سامسونج") {
                    subCategories = ["Mobiles", "Tablets", "Mobile Accessories", "Smart Watches"];
                } else if (categoryName === "mobile and tablet" || categoryName === "لاب توب و كمبيوتر") {
                    subCategories = ["Samsung", "Apple", "Xiaomi", "Huawei"];
                }
  
                return {
                    name: categoryName,
                    subCategories: subCategories
                };
            }).filter(Boolean);
        }
    });
  }
  
  
  
  // Method to set the selected category and update the subcategories
  onCategoryClick(categoryName: string) {
    this.selectedCategory = categoryName;
    const category = this.categories.find((cat: { name: string; }) => cat.name === categoryName);
    this.subCategories = category ? category.subCategories : [];
  }
  
  
  
  
  
  useLanguage() {
    this.translate.ChangeLanguage();
  }

  opensignin() {
    this.router.navigate(['remember-by-phoone']);
  }
  
  signOut() {
    this.auth.signOut().subscribe(
      () => {
        localStorage.removeItem('authToken'); // مسح التوكن من التخزين المحلي
        this.isLoggedIn = false; // تحديث حالة تسجيل الدخول
        this.router.navigate(['/']); // إعادة توجيه المستخدم للصفحة الرئيسية
      },
      (error) => console.error('Logout failed:', error)
    );
  }
  
}