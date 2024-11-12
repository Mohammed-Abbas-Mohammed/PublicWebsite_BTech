import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AllproductsService } from '../../service/product/allproducts.service';
import { CommonModule } from '@angular/common';
import { RecentProductsService } from '../../service/recent-products/recent-products.service';
import { ProductB } from '../../models/product-b';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LocalizationService } from '../../service/localiztionService/localization.service';
import { AuthService } from '../../service/Identity/auth.service';
import { OrderService } from '../../service/Order/order.service';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css',
})
export class DetailsComponent implements OnInit {
  isArabic!: boolean;
  product: any;
  productTranslation: any;
  productspecification: ProductB[] = [];
  productName:string='';
  ProductImgUrl:string='';
  modalService: any;
  constructor(
    private route: ActivatedRoute,
    private router :Router,
    private allProductsService: AllproductsService,
    private recentProductsService: RecentProductsService, // إضافة خدمة المنتجات المشاهدة
    private translate: LocalizationService,
    private autherService:AuthService,
    private orderService :OrderService
  ) {
    this.translate.IsArabic.subscribe((ar) => (this.isArabic = ar));
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.getProductDetails(id);
    } else {
      console.error('Product ID is null or undefined');
    }
  }

  getProductDetails(id: string) {
    const productId = Number(id); // تحويل id إلى رقم
    this.allProductsService.getProductById(productId).subscribe(
      (data) => {
        if (data.isSuccess) {
            this.product = data.entity; // تخزين بيانات المنتج من الكائن entity
            this.recentProductsService.addProductToRecent(this.product); // إضافة المنتج إلى قائمة المشاهدات الأخيرة
          this.product = data.entity; // تخزين بيانات المنتج من الكائن entity
        } else {
          console.warn('Product not found or error occurred:', data.msg);
        }
        console.log('Product details:', this.product);
      },
      (error) => {
        console.error('Error fetching product details:', error);
      }
    );
  }

  getSpecificationDetail(spec: any): { key: string; value: string } {
    const translation = spec.translations[this.isArabic ? 1 : 0];
    return translation
      ? { key: translation.translatedKey || 'N/A', value: translation.translatedValue || 'N/A' }
      : { key: 'N/A', value: 'N/A' };
  }

  getFormattedPrice(price: number): string {
    return this.isArabic ? `${price} ج.م` : `EGP ${price}`;
  }

  // addToCart(event: any) {
  //   const userId = this.autherService.getUserIdNourhan();
  //   if(userId != null){
  //     console.log(event);
  //     this.productName = event.name;
  //     this.ProductImgUrl = event.img;
  //     console.log("productImg :" ,this.ProductImgUrl)
  //     this.orderService.addToCart(event.id,userId).subscribe(
  //       () => {
  //         this.openRemoveModal();
  //         console.log('Product added to cart successfully!');
  //       },
  //       (error) => {
  //         console.error('Could not add product to cart:', error);
  //       }
  //     );
  //   }
  // }
  // openRemoveModal() {
  //   this.modalService.open(this.openRemoveModal).result.then((result: string) => {
  //     if (result === 'Remove') {
  //       this.goToHome();
  //     }
  //     else this.goToCart();
  //   });
  // }

  // goToHome():void{
  //   this.router.navigate(['/']);
  // }

  // goToCart():void{
  //   this.router.navigate(['/cart']);
  // }


}


