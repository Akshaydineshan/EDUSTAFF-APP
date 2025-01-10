import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolwiceStaffListComponent } from './schoolwice-staff-list.component';

describe('SchoolwiceStaffListComponent', () => {
  let component: SchoolwiceStaffListComponent;
  let fixture: ComponentFixture<SchoolwiceStaffListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SchoolwiceStaffListComponent]
    });
    fixture = TestBed.createComponent(SchoolwiceStaffListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
