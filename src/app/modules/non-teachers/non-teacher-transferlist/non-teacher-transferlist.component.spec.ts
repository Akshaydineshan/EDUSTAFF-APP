import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NonTeacherTransferlistComponent } from './non-teacher-transferlist.component';

describe('NonTeacherTransferlistComponent', () => {
  let component: NonTeacherTransferlistComponent;
  let fixture: ComponentFixture<NonTeacherTransferlistComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NonTeacherTransferlistComponent]
    });
    fixture = TestBed.createComponent(NonTeacherTransferlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
