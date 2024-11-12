
import { Component, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  Route,
  Router,
  RouterModule,
  RouterOutlet,
} from '@angular/router';
import { HeaderComponent } from './shared/Header/header.component';
import { PromotionComponent } from '../app/Components/Home/promotion.component';
import { FooterComponent } from './shared/Footer/footer.component';
import { ProductListComponent } from './Components/ProductPage_Component/product-list/product-list.component';
import { BannerComponent } from './Components/Homepage_components/banner/banner.component';
import { FeaturesComponent } from './Components/Homepage_components/features/features.component';
import { BrandsComponent } from './Components/Homepage_components/brands/brands.component';
import { CartComponent } from './Components/cart/cart.component';
import { LastViewComponent } from './Components/Homepage_components/last-view/last-view.component';
import { SignInComponent } from './Components//sign-in/sign-in.component';
import { RemeberByPhooneComponent } from './Components/remeber-by-phoone/remeber-by-phoone.component';
import { filter } from 'rxjs/internal/operators/filter';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { TopOffersComponent } from './Components/Homepage_components/top-offers/top-offers.component';
import { SearchresultComponent } from './Components/searchresult/searchresult.component';
import { MyAccountComponent } from './Components/my-account/my-account.component';
import { MyOrdersComponent } from './my-orders/my-orders.component';


@Component({
  selector: 'app-root',
  standalone: true,

  imports: [
    RouterOutlet,
    RouterModule,
    HeaderComponent,
    PromotionComponent,
    FooterComponent,
    ProductListComponent,
    BannerComponent,
    BrandsComponent,
    FeaturesComponent,
    CartComponent,
    LastViewComponent,
    TranslateModule,
    TopOffersComponent,
    SearchresultComponent,
    MyAccountComponent,
    MyOrdersComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent  {
  title = 'b-tech';

  showHeader:boolean = true;
  private hiddenRoutes = ['/sign-in', '/remember-by-phoone', '/sign-up', '/checkout']; // إضافة المسارات التي تريد إخفاء الهيدر والفوتر بها

  constructor(private router: Router, private translate: TranslateService) {
    let lang = localStorage.getItem('language');
    translate.use(lang as string);

    router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.showHeader = !this.hiddenRoutes.some(route => val.url.includes(route));
      }
    });

  }
}

 // required for AOT compilation
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}

