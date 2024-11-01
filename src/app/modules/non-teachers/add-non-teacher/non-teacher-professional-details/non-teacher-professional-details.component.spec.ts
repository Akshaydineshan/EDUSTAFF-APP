import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NonTeacherProfessionalDetailsComponent } from './non-teacher-professional-details.component';

describe('NonTeacherProfessionalDetailsComponent', () => {
  let component: NonTeacherProfessionalDetailsComponent;
  let fixture: ComponentFixture<NonTeacherProfessionalDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NonTeacherProfessionalDetailsComponent]
    });
    fixture = TestBed.createComponent(NonTeacherProfessionalDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
