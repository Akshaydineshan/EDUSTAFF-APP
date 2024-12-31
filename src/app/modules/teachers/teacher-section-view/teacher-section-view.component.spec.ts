import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherSectionViewComponent } from './teacher-section-view.component';

describe('TeacherSectionViewComponent', () => {
  let component: TeacherSectionViewComponent;
  let fixture: ComponentFixture<TeacherSectionViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TeacherSectionViewComponent]
    });
    fixture = TestBed.createComponent(TeacherSectionViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
