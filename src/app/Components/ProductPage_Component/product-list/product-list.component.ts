import {
  Component,
  EventEmitter,
  Input,
  input,
  Output,
  output,
} from '@angular/core';
import { Router } from '@angular/router';
import { OrderService } from '../../../service/Order/order.service';
import {AuthService} from '../../../service/Identity/auth.service';

import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LocalizationService } from '../../../service/localiztionService/localization.service';
import { ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';



@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css',
})
export class ProductListComponent {
  isArabic!: boolean;

  @Input() data: any = {};
  @Output() item = new EventEmitter();

  constructor(
    private router: Router,
    private orderService: OrderService,
    private translate: LocalizationService,
    private autherService:AuthService,
    private modalService: NgbModal
  ) {
    this.translate.IsArabic.subscribe((ar) => (this.isArabic = ar));
    
  }

  ngOnChanges() {
    console.log('Product data:', this.data);
    console.log('Price:', this.data?.price); // تأكد من أن السعر موجود هنا
  }

  openProductDetails(data: any) {
    const productId = data?.id || data.product?.id;

    if (productId) {
      console.log('Navigating to product details with ID:', productId);
      this.router.navigate(['/details', productId]);
    } else {
      console.error('Product ID is undefined or data is invalid:', data);
    }
  }

  //=========== order related functions ==========
  @ViewChild('confirmRemoveModal') confirmRemoveModal: any;

  add(data:any): void {
    const userId = this.autherService.getUserIdNourhan();
    if(userId != null){
      var productInfo = {
        id: data.id,
        img: (data.product?.images && data.product.images.length > 0) ? data.product.images[0].url : (data.images?.[0]?.url || 'default-image-url.png'),
        name: data.product?.translations?.[0]?.name || data.translations?.[0]?.name || 'Product Name' 
      }
      this.item.emit(productInfo);
    }
    else{
      this.openRemoveModal();
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
    this.router.navigate(['/sign-in']); 
  }


  //====================================

  getFormattedPrice(price: number): string {
    if (price == null || price === undefined || isNaN(price)) {
      return this.isArabic ? 'السعر غير متاح' : 'Price not available';
    }
    return this.isArabic ? `${price} ج.م` : `EGP ${price}`;
  }

  // add(event: Event) {
  //   event.stopPropagation(); // Prevent click event from bubbling up
  //   this.item.emit(this.data);
  // }
}
