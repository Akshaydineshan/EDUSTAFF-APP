import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNonTeacherComponent } from './add-non-teacher.component';

describe('AddNonTeacherComponent', () => {
  let component: AddNonTeacherComponent;
  let fixture: ComponentFixture<AddNonTeacherComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddNonTeacherComponent]
    });
    fixture = TestBed.createComponent(AddNonTeacherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
