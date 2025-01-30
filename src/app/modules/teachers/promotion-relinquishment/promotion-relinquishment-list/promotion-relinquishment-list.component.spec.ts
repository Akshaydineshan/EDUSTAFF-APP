import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromotionRelinquishmentListComponent } from './promotion-relinquishment-list.component';

describe('PromotionRelinquishmentListComponent', () => {
  let component: PromotionRelinquishmentListComponent;
  let fixture: ComponentFixture<PromotionRelinquishmentListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PromotionRelinquishmentListComponent]
    });
    fixture = TestBed.createComponent(PromotionRelinquishmentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
