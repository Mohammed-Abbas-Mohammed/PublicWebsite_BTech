// import { Component, Input } from '@angular/core';
// import { NgxPayPalModule } from 'ngx-paypal';
// import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';


// @Component({
//   selector: 'app-paypal-button',
//   standalone: true,
//   imports: [NgxPayPalModule],
//   templateUrl: './paypal-button.component.html',
//   styleUrl: './paypal-button.component.css'
// })
// export class PaypalButtonComponent {
//   @Input()amount:number = 10;

//   public payPalConfig?: IPayPalConfig;

//   ngOnInit(): void {
//     this.initConfig();
//   }

//   private initConfig(): void {
//     this.payPalConfig = {
//     currency: 'EUR',
//     clientId: 'AQKHijp2ZvWQpvAvdeFJSwvknTZ1O50-SH7uhQSmEYzTo_fqQANh25KC1bT_MMnIlU6Uawez1T9KbJne',
//     createOrderOnClient: (data) => <ICreateOrderRequest>{
//       intent: 'CAPTURE',
//       purchase_units: [
//         {
//           amount: {
//             currency_code: 'EUR',
//             value: '9.99',
//             breakdown: {
//               item_total: {
//                 currency_code: 'EUR',
//                 value: '9.99'
//               }
//             }
//           },
//           items: [
//             {
//               name: 'Enterprise Subscription',
//               quantity: '1',
//               category: 'DIGITAL_GOODS',
//               unit_amount: {
//                 currency_code: 'EUR',
//                 value: '9.99',
//               },
//             }
//           ]
//         }
//       ]
//     },
//     advanced: {
//       commit: 'true'
//     },
//     style: {
//       label: 'paypal',
//       layout: 'vertical'
//     },
//     onApprove: (data, actions) => {
//       console.log('onApprove - transaction was approved, but not authorized', data, actions);
//       actions.order.get().then((details:any) => {
//         console.log('onApprove - you can get full order details inside onApprove: ', details);
//       });
//     },
//     onClientAuthorization: (data) => {
//       console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
//     },
//     onCancel: (data, actions) => {
//       console.log('OnCancel', data, actions);
//     },
//     onError: err => {
//       console.log('OnError', err);
//     },
//     onClick: (data, actions) => {
//       console.log('onClick', data, actions);
//     },
//   };
//   }
// }


import { Component, Input, NgZone, OnInit } from '@angular/core';
import { IPayPalConfig, ICreateOrderRequest, NgxPayPalModule } from 'ngx-paypal';

@Component({
  selector: 'app-paypal-button',
  standalone: true,
  imports: [NgxPayPalModule],
  templateUrl: './paypal-button.component.html',
  styleUrls: ['./paypal-button.component.css']
})
export class PaypalButtonComponent implements OnInit {
  @Input() amount: number = 10;
  public payPalConfig?: IPayPalConfig;

  constructor(private ngZone: NgZone) {}

  ngOnInit(): void {
    this.ngZone.runOutsideAngular(() => {
      this.initConfig();
    });
  }

  private initConfig(): void {
    this.payPalConfig = {
      currency: 'EUR',
      clientId: 'ATvDFJFysYICcOZtRecpSyQbw0iwDwl6tVuTRTyYDi-aJAbFLNTIQMrY21C-xY11cB9cykkearVgb5Op',
      createOrderOnClient: (data) => <ICreateOrderRequest>{
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: 'EUR',
              value: '9.99',
              breakdown: {
                item_total: {
                  currency_code: 'EUR',
                  value: '9.99'
                }
              }
            },
            items: [
              {
                name: 'Enterprise Subscription',
                quantity: '1',
                category: 'DIGITAL_GOODS',
                unit_amount: {
                  currency_code: 'EUR',
                  value: '9.99',
                },
              }
            ]
          }
        ]
      },
      advanced: {
        commit: 'true'
      },
      style: {
        label: 'paypal',
        layout: 'vertical'
      },
      onApprove: (data, actions) => {alert("successeded");
        console.log('onApprove - transaction was approved, but not authorized', data, actions);
        actions.order.get().then((details: any) => {
          console.log('onApprove - you can get full order details inside onApprove: ', details);
        });
      },
      onClientAuthorization: (data) => {
        console.log('onClientAuthorization - transaction completed', data);
      },
      onCancel: (data, actions) => {
        console.log('OnCancel', data, actions);
      },
      onError: err => {
        console.log('OnError', err);
      },
      onClick: (data, actions) => {
        console.log('onClick', data, actions);
      },
    };
  }
}

