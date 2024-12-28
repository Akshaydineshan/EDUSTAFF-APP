import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolwiseTeacherListComponent } from './schoolwise-teacher-list.component';

describe('SchoolwiseTeacherListComponent', () => {
  let component: SchoolwiseTeacherListComponent;
  let fixture: ComponentFixture<SchoolwiseTeacherListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SchoolwiseTeacherListComponent]
    });
    fixture = TestBed.createComponent(SchoolwiseTeacherListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
