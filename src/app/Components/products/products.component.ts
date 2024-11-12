import { Component, OnInit } from '@angular/core';
import { AllproductsService } from '../../service/product/allproducts.service';
import { CategoryService } from '../../service/Category/category.service';
import { Router } from '@angular/router';
import { ProductListComponent } from '../ProductPage_Component/product-list/product-list.component';
import { SelectCheckboxComponent } from '../ProductPage_Component/select-checkbox/select-checkbox.component';
import { ProductB } from '../../models/product-b';
import { CategoryB } from '../../models/category-b';
import { CommonModule } from '@angular/common';
import { ProductCategoryB } from '../../models/product-category-b';
import { LocalizationService } from '../../service/localiztionService/localization.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {NgxPaginationModule} from 'ngx-pagination'; // <-- import the module
import { AuthService } from '../../service/Identity/auth.service';
import { OrderService } from '../../service/Order/order.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [ProductListComponent, SelectCheckboxComponent,CommonModule,TranslateModule,NgxPaginationModule,FormsModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})

export class ProductsComponent implements OnInit {
  // userId: string = "e2366e30-de44-4708-af0d-c14f50335ba5";
  // Other properties
  minPrice: number | null = null;
  maxPrice: number | null = null;

  isArabic!: boolean;
  products: ProductB[] = [];
  filteredProducts: ProductB[] = [];
  categories: CategoryB[] = [];
  categoryNames: string[] = [];
  brands: string[] = [];
  p:number=1;
  ItemsPerPage : number = 6;
  cartProducts: any[] = [];
  productCategories:ProductCategoryB[]=[];

  selectedCategory: string | null = null;
  selectedBrand: string | null = null;
 selectedPrice: any;

 isCategoryOpen: boolean = false;
isBrandOpen: boolean = false;
isPriceOpen: boolean = false;

  categoryFilterOpen: boolean = false;
  brandFilterOpen: boolean = false;
  priceFilterOpen: boolean = false;

  priceOptions = [
    { id: 1, name: 'Under 1000', min: 0, max: 999 },
    { id: 2, name: '1000 - 15000', min: 1000, max: 15000 },
    { id: 3, name: '15000 - 25000', min: 15001, max: 25000 },
    { id: 4, name: 'Over 25000', min: 25001, max: Infinity }
  ];

  priceNames = this.priceOptions.map(option => option.name);

  constructor(
    private service: AllproductsService,
    private catservice: CategoryService,
    private router: Router,
    private translate: LocalizationService,
    private orderService: OrderService,
    private autherService:AuthService,
    private modalService: NgbModal
  ) {
     this.translate.IsArabic.subscribe((ar) => (this.isArabic = ar));
  }



  ngOnInit(): void {
    this.getAllBrands();
    this.getAllProducts();
    this.getAllCategory();
       }



       getAllProducts() {
        this.service.getallproducts().subscribe(
          (res: any) => {
            console.log("Products API response:", res);
            if (res.isSuccess && Array.isArray(res.entity)) {
              this.products = res.entity;
              this.filteredProducts = this.products;
              // استخراج أسماء البراندات بدون تكرار
              this.getAllBrands(); // تأكد من أنها تُنفذ بعد تحميل المنتجات
            } else {
              console.error("Unexpected data format:", res);
            }
          },
          error => {
            console.error("Error fetching products:", error);
          }
        );
      }
      getAllBrands(): void {
        const brandSet = new Set<string>();
        const translationIndex = this.isArabic ? 1 : 0; // تحديد الفهرس بناءً على اللغة الحالية

        this.products.forEach(product => {
          const brand = product.translations?.[translationIndex]?.brandName; // التأكد من أن البيانات موجودة في الترجمة
          if (brand) {
            brandSet.add(brand); // إضافة البراند بدون تكرار
          }
        });

        this.brands = Array.from(brandSet); // تحويل Set إلى Array
      }



  getAllCategory() {
    this.catservice.getallcategory().subscribe((res: any) => {
      if (res.isSuccess && Array.isArray(res.entity)) {
        this.categories = res.entity;

        // Use the translation index based on the current language
        const translationIndex = this.isArabic ? 1 : 0;

        this.categoryNames = res.entity.map((category: CategoryB) =>
          category.translations?.[translationIndex]?.categoryName
        ).filter(Boolean);
      }
    });
  }

  applyFilters(): void {
    // الحصول على نطاق السعر المحدد
    const selectedPriceOption = this.priceOptions.find(option => option.name === this.selectedPrice);
    const minPrice = selectedPriceOption ? selectedPriceOption.min : 0;
    const maxPrice = selectedPriceOption ? selectedPriceOption.max : Infinity;

    // الحصول على `categoryId` الخاص بالفئة المحددة بناءً على اللغة
    const selectedCategoryId = this.categories.find(
      cat => cat.translations?.[this.isArabic ? 1 : 0]?.categoryName === this.selectedCategory // التأكد من استخدام الفهرس الصحيح
    )?.id;

    console.log(selectedCategoryId);

    // تصفية المنتجات بناءً على الفئة، البراند، والسعر
    this.filteredProducts = this.products.filter(product => {
      const matchesCategory = this.selectedCategory
        ? product.productCategories?.some(category => category.categoryId === selectedCategoryId)
        : true; // إذا كانت الفئة غير محددة، تتجاهل الفلتر

        const matchesBrand = this.selectedBrand
        ? product.translations?.[this.isArabic ? 1 : 0]?.brandName === this.selectedBrand // التأكد من استخدام الفهرس الصحيح
        : true; // إذا كان البراند غير محدد، تتجاهل الفلتر

      const matchesPrice = product.price >= minPrice && product.price <= maxPrice; // التحقق من نطاق السعر

      return matchesCategory && matchesBrand && matchesPrice;
    });
  }




  // Modify onCategoryChange, onBrandChange, and onPriceChange to call applyFilters instead of setting filteredProducts independently.

  // onCategoryChange(categoryName: string | null): void {
  //   this.selectedCategory = categoryName;
  // }

  onBrandChange(brand: string | null): void {
    this.selectedBrand = brand;
    this.applyFilters(); // Apply all filters whenever brand changes
  }

  onPriceChange(selectedPrice: any): void {
    this.selectedPrice = selectedPrice;
    this.applyFilters(); // Apply all filters whenever price changes
  }

  clearFilter(): void {
    this.selectedCategory = null;
    this.selectedPrice = null;
    this.selectedBrand = null;
    this.filteredProducts = this.products;
  }

  onCategoryChange(categoryName: string | null): void {
    this.selectedCategory = categoryName;

    const selectedCategory = this.categories.find(
      category => category.translations?.[this.isArabic ? 1 : 0]?.categoryName === categoryName // استخدام الفهرس الصحيح للترجمة
    );

    if (selectedCategory) {
      this.service.getProductsByCategoryId(selectedCategory.id).subscribe(
        (products: ProductB[]) => {
          if (Array.isArray(products)) {
            console.log('Product entity data:', products);
            this.filteredProducts = products;
            console.log('Filtered products:', this.filteredProducts); // تسجيل هنا
          } else {
            console.error('Unexpected data format:', products);
          }
        },
        error => {
          console.error("Error fetching products by category:", error);
        }
      );
    }
  }


  //========== order related functions ============
  @ViewChild('confirmRemoveModal') confirmRemoveModal: any;
  ProductImgUrl:string = "";
  productName:string = "";

  addToCart(event: any) {
    const userId = this.autherService.getUserIdNourhan();
    if(userId != null){
      console.log(event);
      this.productName = event.name;
      this.ProductImgUrl = event.img;
      console.log("productImg :" ,this.ProductImgUrl)
      this.orderService.addToCart(event.id,userId).subscribe(
        () => {
          this.openRemoveModal();
          console.log('Product added to cart successfully!');
        },
        (error) => {
          console.error('Could not add product to cart:', error);
        }
      );
    }
  }

  openRemoveModal() {
    this.modalService.open(this.confirmRemoveModal).result.then((result) => {
      if (result === 'Remove') {
        this.goToHome();
      }
      else this.goToCart();
    });
  }

  goToHome():void{
    this.router.navigate(['/']);
  }

  goToCart():void{
    this.router.navigate(['/cart']);
  }

  //=======================================

  toggleCategoryFilter() {
    this.categoryFilterOpen = !this.categoryFilterOpen;
  }

  toggleBrandFilter() {
    this.brandFilterOpen = !this.brandFilterOpen;
  }

  togglePriceFilter() {
    this.priceFilterOpen = !this.priceFilterOpen;
  }

  applyPriceFilter(): void {
    const min = this.minPrice ?? 0;
    const max = this.maxPrice ?? Infinity;

    this.filteredProducts = this.products.filter(product => {
      return product.price >= min && product.price <= max;
    });
  }
}
