import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovedNonApprovedNonTeachersComponent } from './approved-non-approved-non-teachers.component';

describe('ApprovedNonApprovedNonTeachersComponent', () => {
  let component: ApprovedNonApprovedNonTeachersComponent;
  let fixture: ComponentFixture<ApprovedNonApprovedNonTeachersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ApprovedNonApprovedNonTeachersComponent]
    });
    fixture = TestBed.createComponent(ApprovedNonApprovedNonTeachersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
