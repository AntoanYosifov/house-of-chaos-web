import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductBoard } from './product-board';

describe('ProductBoard', () => {
  let component: ProductBoard;
  let fixture: ComponentFixture<ProductBoard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductBoard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductBoard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
