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

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [ProductListComponent, SelectCheckboxComponent,CommonModule,TranslateModule,NgxPaginationModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})

export class ProductsComponent implements OnInit {
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
    private translate: LocalizationService
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
              this.getAllBrands();
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
        const translationIndex = this.isArabic ? 1 : 0; // Determine the index based on the current language

        this.products.forEach(product => {
          const brand = product.translations?.[translationIndex]?.brandName; // Use the appropriate index
          if (brand) {
            brandSet.add(brand); // Add brands without duplicates
          }
        });

        this.brands = Array.from(brandSet); // Convert Set to Array
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
    // أولاً، الحصول على نطاق السعر المحدد إذا كان متاحًا
    const selectedPriceOption = this.priceOptions.find(option => option.name === this.selectedPrice);
    const minPrice = selectedPriceOption ? selectedPriceOption.min : 0;
    const maxPrice = selectedPriceOption ? selectedPriceOption.max : Infinity;

    // الحصول على `categoryId` الخاص بالفئة المحددة
    const selectedCategoryId = this.categories.find(
      
      cat => cat.translations?.[0]?.categoryName === this.selectedCategory
    )?.id;

    console.log(selectedCategoryId)

    // تصفية المنتجات بناءً على كل المعايير المحددة: الفئة، البراند، والسعر
    this.filteredProducts = this.products.filter(product => {
      // التحقق مما إذا كان المنتج يطابق الفئة المحددة
      const matchesCategory = this.selectedCategory
        ? product.productCategories?.some(category => category.categoryId === selectedCategoryId)
        : true;

      // التحقق مما إذا كان المنتج يطابق البراند المحدد
      const matchesBrand = this.selectedBrand
        ? product.translations?.[0]?.brandName === this.selectedBrand
        : true;

      // التحقق مما إذا كان المنتج يطابق نطاق السعر المحدد
      const matchesPrice = product.price >= minPrice && product.price <= maxPrice;

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
      category => category.translations?.[0]?.categoryName === categoryName
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

  addToCart(event: any) {
    if ("card" in localStorage) {
      this.cartProducts = JSON.parse(localStorage.getItem("card")!);
      let exist = this.cartProducts.find(item => item.id == event.id);
      if (exist) {
        alert("This product is already in the cart");
      } else {
        this.cartProducts.push(event);
        localStorage.setItem("card", JSON.stringify(this.cartProducts));
      }
    } else {
      this.cartProducts.push(event);
      localStorage.setItem("card", JSON.stringify(this.cartProducts));
    }
  }

  toggleCategoryFilter() {
    this.categoryFilterOpen = !this.categoryFilterOpen;
  }

  toggleBrandFilter() {
    this.brandFilterOpen = !this.brandFilterOpen;
  }

  togglePriceFilter() {
    this.priceFilterOpen = !this.priceFilterOpen;
  }
}
