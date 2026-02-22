import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginationControls } from './pagination-controls';

describe('PaginationControls', () => {
  let component: PaginationControls;
  let fixture: ComponentFixture<PaginationControls>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginationControls]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaginationControls);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
