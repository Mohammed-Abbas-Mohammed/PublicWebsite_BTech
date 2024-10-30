import { Component, OnInit } from '@angular/core';
import { AllproductsService } from '../../service/product/allproducts.service';
import { CategoryService } from '../../service/Category/category.service';
import { Router } from '@angular/router';
import { ProductListComponent } from '../ProductPage_Component/product-list/product-list.component';
import { SelectCheckboxComponent } from '../ProductPage_Component/select-checkbox/select-checkbox.component';
import { ProductB } from '../../models/product-b';
import { CategoryB } from '../../models/category-b';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [ProductListComponent, SelectCheckboxComponent,CommonModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products: ProductB[] = [];
  filteredProducts: ProductB[] = [];
  categories: CategoryB[] = [];
  categoryNames: string[] = [];  //main 
  brands: string[] = [];         //sub
  cartProducts: any[] = [];
 // In your component's .ts file
  priceOptions = [
    { id: 1, name: ' Under 1000' },
    { id: 2, name: ' 1000 - 15000' },
    { id: 3, name: ' 15000 - 25000' },
    { id: 4, name: ' Over 25000' }
  ];

  priceNames = this.priceOptions.map(option => option.name);
  selectedPrice: any;
  selectedCategory: string | null = null;
  selectedBrand: string | null = null;

  constructor(
    private service: AllproductsService,
    private catservice: CategoryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getallproducts();
    this.getSubCategories();
    this.getallcateory();
  }
  
  

  getallproducts() {
    this.service.getallproducts().subscribe(
      (res: any) => {
        console.log("Products API response:", res);
        
        // تأكد أن `entity` هو مصفوفة قبل تخصيصه إلى المنتجات
        if (res.isSuccess && Array.isArray(res.entity)) {
          this.products = res.entity; // تعيين المنتجات من `entity`
          this.filteredProducts = res.entity;
        } else {
          console.error("Unexpected data format:", res);
        }
      },
      error => {
        console.error("Error fetching products:", error);
      }
    );
  }
  
  
  getallcateory() {
    
    this.catservice.getmainCategories().subscribe((res: any[]) => {
        console.log("Category API full response:", res);

         // استخراج أسماء الفئات الرئيسية
         this.categoryNames = res.map((item) => {
          const categoryName = item.category?.translations?.[0]?.categoryName;
          console.log("Extracted Category Name:", categoryName);
          return categoryName;
      }).filter(Boolean); // فلتر للتأكد من عدم وجود قيم undefined
  }, 
  error => {
      console.error("Error fetching main categories:", error);
    });
  }
        // if (res.isSuccess && Array.isArray(res.entity)) {
        //     this.categories = res.entity;
        //     console.log("Parsed Categories:", this.categories);
        //     this.categoryNames = res.entity.map((category: CategoryB) => {
        //         const categoryName = category.translations?.[0]?.categoryName;
        //         console.log("Extracted Category Name:", categoryName);
        //         return categoryName;
        //     }).filter(Boolean); // فلتر للتأكد من عدم وجود قيم undefined
        // } else {
        //     console.error("Unexpected data format:", res);
        // }
 

getSubCategories() {
  this.catservice.getsubCategories().subscribe((res: any[]) => {
    console.log("Sub Categories API response:", res);

    this.brands= res.map((item) => {
      const categoryName = item.category?.translations?.[0]?.categoryName;
      console.log("Extracted Category Name:", categoryName);
      return categoryName;
  }).filter(Boolean); // فلتر للتأكد من عدم وجود قيم undefined
}, 
error => {
  console.error("Error fetching main categories:", error);
    
  });
}

  // onCategoryChange(category: string | null): void {
  //   this.selectedCategory = category;
  //   this.applyFilters();
  // }

  onBrandChange(brand: string | null): void {
    this.selectedBrand = brand;
    this.applyFilters();
  }

  onCategoryChange(categoryName: string | null): void {
    this.selectedCategory = categoryName;
    this.applyFilters();
}

onPriceChange(selectedPrice: any) {
  this.selectedPrice = selectedPrice;
  console.log('Selected Price:', this.selectedPrice);
  // Apply filtering logic based on selected price range
}


applyFilters(): void {
    if (this.selectedCategory) {
        // البحث عن `CategoryId` بناءً على `categoryName`
        const selectedCategoryObj = this.categories.find(category => 
            category.translations && category.translations[0].categoryName === this.selectedCategory
        );

        if (selectedCategoryObj) {
            const categoryId = selectedCategoryObj.id;
            this.service.getProductsByCategoryId(categoryId).subscribe(
                (res: any) => {
                    if (res.isSuccess && Array.isArray(res.entity)) {
                        this.filteredProducts = res.entity;
                    } else {
                        console.error("Unexpected data format:", res);
                    }
                },
                error => {
                    console.error("Error fetching filtered products:", error);
                }
            );
        }
    } else {
        this.filteredProducts = this.products; // عرض كل المنتجات عند عدم اختيار تصنيف
    }
}


  
  

  clearFilter(): void {
    this.selectedCategory = null;
    this.selectedBrand = null;
    this.filteredProducts = this.products;
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
}
