import { Component } from '@angular/core';
import { OrderService } from '../service/Order/order.service';
import { AuthService } from '../service/Identity/auth.service';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LocalizationService } from '../service/localiztionService/localization.service';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './my-orders.component.html',
  styleUrl: './my-orders.component.css',
})
export class MyOrdersComponent {
  isArabic!: boolean;

  userId: string | null = null; // User ID retrieved from token
  orders: any[] = [];
  loading = true;
  error: string | null = null;
  constructor(
    private orderService: OrderService,
    private authservice: AuthService,
    private translate: LocalizationService,
    private translator: TranslateService
  ) {
    this.translate.IsArabic.subscribe((ar) => (this.isArabic = ar));
  }

  ngOnInit(): void {
    this.userId = this.authservice.getUserIdNourhan(); // Retrieve the user ID from token
    if (this.userId) {
      this.fetchUserOrders();
    } else {
      this.error = 'Unable to retrieve user ID. Please log in.';
      this.loading = false;
    }
  }

  // fetchUserOrders(): void {
  //   this.loading = true;
  //   this.error = null;

  //   if (this.userId) {
  //     this.orderService.getOrdersByUserId(this.userId).subscribe(
  //       (data) => {
  //         this.orders = data;
  //         this.loading = false;
  //       },
  //       (err) => {
  //         this.error = err.message || 'Error fetching orders.';
  //         console.error(err);
  //         this.loading = false;
  //       }
  //     );
  //   } else {
  //     this.error = 'Invalid user ID.';
  //     this.loading = false;
  //   }
  // }

  fetchUserOrders(): void {
    this.loading = true;
    this.error = null;

    if (this.userId) {
      this.orderService.getOrdersByUserId(this.userId).subscribe(
        (data: any[]): void => {
          this.orders = data;
          this.loading = false;
        },
        (err) => {
          this.error = '';
          console.error(err);
          this.loading = false;
        }
      );
    } else {
      this.error = 'Invalid user ID.';
      this.loading = false;
    }
  }

  getStatus(status: number): string {
    return this.translator.instant(`orders.status.${status}`) || this.translator.instant('orders.status.default');
}

  getFormattedPrice(price: number): string {
    const formattedPrice = price.toFixed(2); // Ensures 2 decimal places
    return this.isArabic ? `${formattedPrice} ج.م` : `EGP ${formattedPrice}`;
  }
}
