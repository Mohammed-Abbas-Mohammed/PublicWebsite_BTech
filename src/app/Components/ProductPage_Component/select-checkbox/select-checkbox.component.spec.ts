import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectCheckboxComponent } from './select-checkbox.component';

describe('SelectCheckboxComponent', () => {
  let component: SelectCheckboxComponent;
  let fixture: ComponentFixture<SelectCheckboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectCheckboxComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectCheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
