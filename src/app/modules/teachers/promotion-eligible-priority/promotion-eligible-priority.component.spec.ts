import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromotionEligiblePriorityComponent } from './promotion-eligible-priority.component';

describe('PromotionEligiblePriorityComponent', () => {
  let component: PromotionEligiblePriorityComponent;
  let fixture: ComponentFixture<PromotionEligiblePriorityComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PromotionEligiblePriorityComponent]
    });
    fixture = TestBed.createComponent(PromotionEligiblePriorityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
