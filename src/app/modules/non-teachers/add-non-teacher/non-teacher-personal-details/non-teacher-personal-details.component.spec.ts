import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NonTeacherPersonalDetailsComponent } from './non-teacher-personal-details.component';

describe('NonTeacherPersonalDetailsComponent', () => {
  let component: NonTeacherPersonalDetailsComponent;
  let fixture: ComponentFixture<NonTeacherPersonalDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NonTeacherPersonalDetailsComponent]
    });
    fixture = TestBed.createComponent(NonTeacherPersonalDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
