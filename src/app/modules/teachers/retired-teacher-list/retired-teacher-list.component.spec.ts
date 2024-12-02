import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RetiredTeacherListComponent } from './retired-teacher-list.component';

describe('RetiredTeacherListComponent', () => {
  let component: RetiredTeacherListComponent;
  let fixture: ComponentFixture<RetiredTeacherListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RetiredTeacherListComponent]
    });
    fixture = TestBed.createComponent(RetiredTeacherListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
