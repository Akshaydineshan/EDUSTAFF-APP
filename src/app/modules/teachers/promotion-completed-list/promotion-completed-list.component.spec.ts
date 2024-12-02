import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromotionCompletedListComponent } from './promotion-completed-list.component';

describe('PromotionCompletedListComponent', () => {
  let component: PromotionCompletedListComponent;
  let fixture: ComponentFixture<PromotionCompletedListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PromotionCompletedListComponent]
    });
    fixture = TestBed.createComponent(PromotionCompletedListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
