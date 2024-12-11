import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffLeaveApplicationsComponent } from './staff-leave-applications.component';

describe('StaffLeaveApplicationsComponent', () => {
  let component: StaffLeaveApplicationsComponent;
  let fixture: ComponentFixture<StaffLeaveApplicationsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StaffLeaveApplicationsComponent]
    });
    fixture = TestBed.createComponent(StaffLeaveApplicationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
