import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnLeaveTeacherComponent } from './on-leave-teacher.component';

describe('OnLeaveTeacherComponent', () => {
  let component: OnLeaveTeacherComponent;
  let fixture: ComponentFixture<OnLeaveTeacherComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OnLeaveTeacherComponent]
    });
    fixture = TestBed.createComponent(OnLeaveTeacherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
