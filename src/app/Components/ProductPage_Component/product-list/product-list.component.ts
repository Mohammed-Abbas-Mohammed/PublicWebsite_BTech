import { Component, EventEmitter, Input, input, Output, output } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LocalizationService } from '../../../service/localiztionService/localization.service';
@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent {
  isArabic!: boolean;

@Input() data:any={}
@Output() item= new EventEmitter()
constructor(private router:Router,
  private translate: LocalizationService
) {
  this.translate.IsArabic.subscribe((ar) => (this.isArabic = ar));
}

ngOnChanges() {
  console.log('Product data:', this.data);
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

add(event: Event) {
  event.stopPropagation(); // Prevent click event from bubbling up
  this.item.emit(this.data);
}

getFormattedPrice(price: number): string {
  return this.isArabic ? `${price} ج.م` : `$${price}`;
}
}
