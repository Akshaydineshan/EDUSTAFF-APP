import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNonTeacherPreviewComponent } from './add-non-teacher-preview.component';

describe('AddNonTeacherPreviewComponent', () => {
  let component: AddNonTeacherPreviewComponent;
  let fixture: ComponentFixture<AddNonTeacherPreviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddNonTeacherPreviewComponent]
    });
    fixture = TestBed.createComponent(AddNonTeacherPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
