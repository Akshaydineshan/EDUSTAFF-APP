import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromotionEligibleListComponent } from './promotion-eligible-list.component';

describe('PromotionEligibleListComponent', () => {
  let component: PromotionEligibleListComponent;
  let fixture: ComponentFixture<PromotionEligibleListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PromotionEligibleListComponent]
    });
    fixture = TestBed.createComponent(PromotionEligibleListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
