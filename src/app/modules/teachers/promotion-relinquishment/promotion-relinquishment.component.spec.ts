import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromotionRelinquishmentComponent } from './promotion-relinquishment.component';

describe('PromotionRelinquishmentComponent', () => {
  let component: PromotionRelinquishmentComponent;
  let fixture: ComponentFixture<PromotionRelinquishmentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PromotionRelinquishmentComponent]
    });
    fixture = TestBed.createComponent(PromotionRelinquishmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
