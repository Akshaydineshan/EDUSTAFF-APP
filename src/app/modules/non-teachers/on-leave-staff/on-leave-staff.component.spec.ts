import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnLeaveStaffComponent } from './on-leave-staff.component';

describe('OnLeaveStaffComponent', () => {
  let component: OnLeaveStaffComponent;
  let fixture: ComponentFixture<OnLeaveStaffComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OnLeaveStaffComponent]
    });
    fixture = TestBed.createComponent(OnLeaveStaffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
