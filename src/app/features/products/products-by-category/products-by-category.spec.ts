import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsByCategory } from './products-by-category';

describe('ProductsByCategory', () => {
  let component: ProductsByCategory;
  let fixture: ComponentFixture<ProductsByCategory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductsByCategory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductsByCategory);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
