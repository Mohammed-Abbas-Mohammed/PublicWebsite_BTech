import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromotionComponent } from './promotion.component';
import { BrandsComponent } from '../brands/brands.component';
import { FeaturesComponent } from '../features/features.component';
import { ProductListComponent } from '../product-list/product-list.component';

describe('PromotionComponent', () => {
  let component: PromotionComponent;
  let fixture: ComponentFixture<PromotionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PromotionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PromotionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});