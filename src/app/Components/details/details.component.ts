import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AllproductsService } from '../../service/product/allproducts.service';
import { CommonModule } from '@angular/common';
import { RecentProductsService } from '../../service/recent-products/recent-products.service';
import { ProductB } from '../../models/product-b';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LocalizationService } from '../../service/localiztionService/localization.service';
import { AuthService } from '../../service/Identity/auth.service';
import { OrderService } from '../../service/Order/order.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

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
  productName: string = '';
  ProductImgUrl: string = '';

  @Input() data: any = {};
  @Output() item = new EventEmitter();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private allProductsService: AllproductsService,
    private recentProductsService: RecentProductsService, // إضافة خدمة المنتجات المشاهدة
    private translate: LocalizationService,
    private autherService: AuthService,
    private orderService: OrderService,
    private modalService: NgbModal
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
      ? {
          key: translation.translatedKey || 'N/A',
          value: translation.translatedValue || 'N/A',
        }
      : { key: 'N/A', value: 'N/A' };
  }

  getFormattedPrice(price: number): string {
    return this.isArabic ? `${price} ج.م` : `EGP ${price}`;
  }

  //=========== order related functions ==========
  //  @ViewChild('confirmRemoveModal') confirmRemoveModal: any;

  @ViewChild('confirmRemoveModal') confirmRemoveModal: any;
  @ViewChild('loginPromptModal') loginPromptModal: any;

  openRemoveModal(template: any) {
    const modalRef = this.modalService.open(template);
    modalRef.result.then(
      (result: any) => {
        if (result === 'Remove') {
          this.goToHome();
        } else if (result === 'cancel') {
          this.goToCart();
        }
      },
      (dismiss: any) => {
        console.log('Modal dismissed:', dismiss);
      }
    );
  }

  //  add(data:any): void {
  //    const userId = this.autherService.getUserIdNourhan();
  //    if(userId != null){
  //      var productInfo = {
  //        id: data.id,
  //        img: (data.product?.images && data.product.images.length > 0) ? data.product.images[0].url : (data.images?.[0]?.url || 'default-image-url.png'),
  //        name: data.product?.translations?.[0]?.name || data.translations?.[0]?.name || 'Product Name'
  //      }
  //      this.item.emit(productInfo);
  //    }
  //    else{
  //      this.openRemoveModal();
  //    }

  //  }

  addToCart(event: any) {
    const userId = this.autherService.getUserIdNourhan();
    this.productName = event.translations[0]?.name || 'Unknown Product';
    this.ProductImgUrl = event.images?.[0]?.url || 'default-image-url.png';

    if (userId != null) {
      this.orderService.addToCart(event.id, userId).subscribe(
        () => {
          this.openRemoveModal(this.confirmRemoveModal); // Pass the logged-in modal
          console.log('Product added to cart successfully!');
        },
        (error) => {
          console.error('Could not add product to cart:', error);
        }
      );
    } else {
      this.openRemoveModal(this.loginPromptModal); // Pass the login prompt modal
    }
  }

  //  openRemoveModal() {
  //    this.modalService.open(this.confirmRemoveModal).result.then((result:any) => {
  //      if (result === 'Remove') {
  //        this.goToHome();
  //      }
  //      else this.goToCart();
  //    });
  //  }

  goToHome(): void {
    this.router.navigate(['/']);
  }

  goToCart(): void {
    this.router.navigate(['/cart']);
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
