import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeHoverPopupComponent } from './employee-hover-popup.component';

describe('EmployeeHoverPopupComponent', () => {
  let component: EmployeeHoverPopupComponent;
  let fixture: ComponentFixture<EmployeeHoverPopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeeHoverPopupComponent]
    });
    fixture = TestBed.createComponent(EmployeeHoverPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
