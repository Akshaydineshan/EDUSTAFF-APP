import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveRequestListComponent } from './leave-request-list.component';

describe('LeaveRequestListComponent', () => {
  let component: LeaveRequestListComponent;
  let fixture: ComponentFixture<LeaveRequestListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LeaveRequestListComponent]
    });
    fixture = TestBed.createComponent(LeaveRequestListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
