import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewNonTeacherDetailsComponent } from './view-non-teacher-details.component';

describe('ViewNonTeacherDetailsComponent', () => {
  let component: ViewNonTeacherDetailsComponent;
  let fixture: ComponentFixture<ViewNonTeacherDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewNonTeacherDetailsComponent]
    });
    fixture = TestBed.createComponent(ViewNonTeacherDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
