import {
  AfterViewInit,
  Component,
  OnInit,
  NgModule,
  ChangeDetectorRef,
} from '@angular/core';
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
import { Observable } from 'rxjs';
import { ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    TranslateModule,
    RouterModule,
    FormsModule,
    CommonModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements AfterViewInit, OnInit {
  public get router(): Router {
    return this._router;
  }
  public set router(value: Router) {
    this._router = value;
  }
  url: string = 'assets/i18n/.json';
  isArabic!: boolean;
  // isLoggedIn: boolean = true;
  searchQuery: string = '';
  isUserLoggedIn: boolean = false;
  userName: string = '';
  noResultsMessage: string | null = null;
  messageTimeout: any;

  // categoryNames: string[] = [];
  // categories: any;
  categories: { id: number; categoryName: string }[] = [];

  searchTerm: string = ''; // Holds the search term
  searchResults: CategoryB[] = []; // Holds the search results
  selectedCategoryId: number | null = null;
  subCategories: { id: number; categoryName: string }[] = []; // Holds the subcategories of the selected main category

  constructor(
    private translate: LocalizationService,
    private _router: Router,
    private activatedRoute: ActivatedRoute,
    private auth: AuthService,
    private catservice: CategoryService,
    private modalService: NgbModal,
    private cdr: ChangeDetectorRef // إضافة ChangeDetectorRef هنا
  ) {
    this.translate.IsArabic.subscribe((ar) => (this.isArabic = ar));
  }
  ngAfterViewInit(): void {
    throw new Error('Method not implemented.');
  }
  ngOnInit(): void {
    this.getallcategory(); // جلب الفئات كما في الكود السابق

    this.auth.isLoggedInStatus$.subscribe((status) => {
      this.isUserLoggedIn = status;
      this.userName = this.auth.getUserNameFromToken() || '';
    });
  }

  openMyAccount() {
    this.router.navigate(['/my-account']); // التوجه لصفحة "My Account"
  }

  getallcategory() {
    this.catservice.getmainCategories().subscribe(
      (res: any[]) => {
        console.log('main Categories API response:', res);

        // Use reduce to create a unique list directly
        this.categories = res.reduce((uniqueCategories, item) => {
          const translationIndex = this.isArabic ? 0 : 1;
          const categoryId = item.category?.id;
          const categoryName =
            item.category?.translations?.[translationIndex]?.categoryName;

          if (
            categoryId &&
            categoryName &&
            !uniqueCategories.some((cat: { id: any }) => cat.id === categoryId)
          ) {
            uniqueCategories.push({ id: categoryId, categoryName });
          }
          return uniqueCategories;
        }, []);

        console.log('Extracted Unique Categories:', this.categories);
      },
      (error) => {
        console.error('Error fetching main categories:', error);
      }
    );
  }

  onCategoryHover(categoryId: number) {
    if (this.selectedCategoryId !== categoryId) {
      this.subCategories = []; // Clear previous subcategories
      this.selectedCategoryId = categoryId;
      console.log('Hovered Category ID:', this.selectedCategoryId);
      this.getSubCategories(this.selectedCategoryId); // Load new subcategories
    }
  }

  getSubCategories(categoryId: number) {
    this.catservice.getsubcategoriesbuyMainId(categoryId).subscribe(
      (res: CategoryB[]) => {
        console.log('Subcategories API response:', res);
        this.subCategories = res
          .map((subCategory) => ({
            id: subCategory.id, // Ensure you extract the ID
            categoryName:
              subCategory.translations?.[this.isArabic ? 1 : 0]?.categoryName ||
              '',
          }))
          .filter(Boolean);
        console.log('Fetched Subcategories:', this.subCategories);
      },
      (error) => {
        console.error('Error fetching subcategories:', error);
      }
    );
  }

  onSubCategorySelect(subCategoryId: number) {
    this.selectedCategoryId = subCategoryId; // Store the selected subcategory ID
    console.log('Selected Subcategory ID:', subCategoryId);
    this.router
      .navigate(['/product-by-category', this.selectedCategoryId])
      .then(() => {
        // إعادة ضبط selectedCategoryId بعد التنقل لضمان استقبال اختيارات جديدة
        this.selectedCategoryId = null;
      });
  }

  useLanguage() {
    this.translate.ChangeLanguage();
    this.cdr.detectChanges(); // يجبر Angular على التحقق من التغييرات وتحديث العرض
  }

  opensignin() {
    this.router.navigate(['remember-by-phoone']).then(() => {
      // بعد تسجيل الدخول، تحديث حالة isUserLoggedIn
      this.userName = this.auth.getUserNameFromToken() || '';
      this.cdr.detectChanges(); // تحديث العرض بدون إعادة تحميل الصفحة
    });
  }
  onSignOut() {
    this.auth.signOut();
    this.isUserLoggedIn = false;
    this.router.navigate(['/']);
    this.cdr.detectChanges(); // تحديث العرض بعد تسجيل الخروج
  }


  onSearch(event: Event) {
    event.preventDefault(); // Prevent page reload
    this.noResultsMessage = null; // Reset message on each search
    clearTimeout(this.messageTimeout); // Clear any existing timeout to avoid overlap

    if (this.searchQuery) {
      this.catservice.getProductsByCategoryName(this.searchQuery).subscribe(
        (res) => {
          if (res && res.length) {
            const filteredProducts = res.filter((product: any) =>
              product.category.translations.some(
                (translation: any) =>
                  translation.categoryName.toLowerCase() ===
                  this.searchQuery.toLowerCase()
              )
            );

            if (filteredProducts.length) {
              this.router
                .navigateByUrl('/', { skipLocationChange: true })
                .then(() => {
                  this.router.navigate(['/searchresult'], {
                    state: { products: filteredProducts },
                  });
                });
            } else {
              this.showNoResultsMessage(
                this.isArabic
                  ? 'لم يتم العثور على منتجات مطابقة لعملية البحث هذه.'
                  : 'No matching products found for this search query.'
              );
            }
          } else {
            this.showNoResultsMessage(
              this.isArabic
                ? 'لم يتم العثور على منتجات لهذه الفئة.'
                : 'No products found for this category.'
            );
          }
        },
        (error) => {
          console.error('Error fetching products:', error);
          this.showNoResultsMessage(
            this.isArabic
              ? 'حدث خطأ أثناء البحث. حاول مرة أخرى.'
              : 'An error occurred while searching. Please try again.'
          );
        }
      );
    }
  }
  private showNoResultsMessage(message: string) {
    this.noResultsMessage = message;
    this.messageTimeout = setTimeout(() => {
      this.noResultsMessage = null;
    }, 5000); // 5 seconds
  }

  //=============== order related functions ==========
  @ViewChild('logFirstModal') confirmRemoveModal: any;

  confirmLogModal() {
    this.modalService.open(this.confirmRemoveModal).result.then((result) => {
      if (result === 'Remove') {
        this.goToHome();
      } else this.goToLogin();
    });
  }

  goToHome(): void {
    this.router.navigate(['/']);
  }

  goToLogin(): void {
    this.router.navigate(['/sign-in']);
  }

  goToCart() {
    const userId = this.auth.getUserIdNourhan();
    if (userId == null) {
      this.confirmLogModal();
    } else this.router.navigate(['/cart']);
  }
}
