import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NonTeacherListComponent } from './non-teacher-list.component';

describe('NonTeacherListComponent', () => {
  let component: NonTeacherListComponent;
  let fixture: ComponentFixture<NonTeacherListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NonTeacherListComponent]
    });
    fixture = TestBed.createComponent(NonTeacherListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
