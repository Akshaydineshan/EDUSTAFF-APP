import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeMenuClickListMenuComponent } from './employee-menu-click-list-menu.component';

describe('EmployeeMenuClickListMenuComponent', () => {
  let component: EmployeeMenuClickListMenuComponent;
  let fixture: ComponentFixture<EmployeeMenuClickListMenuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeeMenuClickListMenuComponent]
    });
    fixture = TestBed.createComponent(EmployeeMenuClickListMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
