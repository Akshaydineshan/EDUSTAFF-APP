import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NonTeacherEducationDetailsComponent } from './non-teacher-education-details.component';

describe('NonTeacherEducationDetailsComponent', () => {
  let component: NonTeacherEducationDetailsComponent;
  let fixture: ComponentFixture<NonTeacherEducationDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NonTeacherEducationDetailsComponent]
    });
    fixture = TestBed.createComponent(NonTeacherEducationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
