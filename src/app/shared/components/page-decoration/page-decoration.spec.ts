import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageDecoration } from './page-decoration';

describe('PageDecoration', () => {
  let component: PageDecoration;
  let fixture: ComponentFixture<PageDecoration>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageDecoration]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageDecoration);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
