import { RouterModule, Routes } from '@angular/router';
import { ProductsComponent } from './Components/products/products.component';
import { DetailsComponent } from './Components/details/details.component';
import { PromotionComponent } from './Components/Home/promotion.component';
import {CartComponent} from './Components/cart/cart.component'
import { PaymentComponent } from './Components/payment/payment.component';

import { SignInComponent } from './Components/sign-in/sign-in.component';
import { RemeberByPhooneComponent } from './Components/remeber-by-phoone/remeber-by-phoone.component';
import { NgModule } from '@angular/core';
import { SignUpComponent } from './Components/sign-up/sign-up.component';
import { NotFoundComponent } from './shared/not-found/not-found.component';
import { ProductsByBrandComponent } from './Components/products-by-brand/products-by-brand.component';
import { ProductsByCategoryComponent } from './Components/products-by-category/products-by-category.component';
import { SearchresultComponent } from './Components/searchresult/searchresult.component';
import { MyAccountComponent } from './Components/my-account/my-account.component';
import { MyOrdersComponent } from './my-orders/my-orders.component';

export const routes: Routes = [


    {path:'',redirectTo:'promotion',pathMatch:'full'},
    {path:'promotion',component:PromotionComponent,title:'Home Page'},

    {path:'products',component:ProductsComponent,title:'Product-List'},
    {path:'details/:id',component:DetailsComponent, title:'Details'},

    { path: 'payment/:orderId', component: PaymentComponent },
    { path: 'cart', component: CartComponent },
    { path: 'my-account', component: MyAccountComponent },

    { path: 'sign-in', component: SignInComponent, data: { hideHeaderFooter: true } },
    { path: 'sign-up', component: SignUpComponent },
    { path: 'products-by-brand/:brandName', component: ProductsByBrandComponent },
    {path: 'product-by-category/:categoryId', component:ProductsByCategoryComponent},
    { path: 'searchresult', component: SearchresultComponent },
    {path: 'my-orders', component : MyOrdersComponent},

    {path:'remember-by-phoone',component:RemeberByPhooneComponent,title:'remember-me', data: { hideHeaderFooter: true } },


    {path:'**',component:NotFoundComponent}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule {}
