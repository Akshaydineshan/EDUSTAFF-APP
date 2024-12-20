import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RetiredStaffComponent } from './retired-staff.component';

describe('RetiredStaffComponent', () => {
  let component: RetiredStaffComponent;
  let fixture: ComponentFixture<RetiredStaffComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RetiredStaffComponent]
    });
    fixture = TestBed.createComponent(RetiredStaffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
