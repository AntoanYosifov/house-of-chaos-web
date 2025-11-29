import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewsPanel } from './reviews-panel';

describe('ReviewsPanel', () => {
  let component: ReviewsPanel;
  let fixture: ComponentFixture<ReviewsPanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewsPanel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewsPanel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
