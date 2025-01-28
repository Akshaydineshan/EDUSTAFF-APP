import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovedNonApprovedTeacherComponent } from './approved-non-approved-teacher.component';

describe('ApprovedNonApprovedTeacherComponent', () => {
  let component: ApprovedNonApprovedTeacherComponent;
  let fixture: ComponentFixture<ApprovedNonApprovedTeacherComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ApprovedNonApprovedTeacherComponent]
    });
    fixture = TestBed.createComponent(ApprovedNonApprovedTeacherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
