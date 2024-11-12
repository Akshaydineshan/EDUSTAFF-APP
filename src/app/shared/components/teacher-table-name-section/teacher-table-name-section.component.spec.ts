import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherTableNameSectionComponent } from './teacher-table-name-section.component';

describe('TeacherTableNameSectionComponent', () => {
  let component: TeacherTableNameSectionComponent;
  let fixture: ComponentFixture<TeacherTableNameSectionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TeacherTableNameSectionComponent]
    });
    fixture = TestBed.createComponent(TeacherTableNameSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
