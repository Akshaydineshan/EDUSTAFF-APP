import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffSectionViewComponent } from './staff-section-view.component';

describe('StaffSectionViewComponent', () => {
  let component: StaffSectionViewComponent;
  let fixture: ComponentFixture<StaffSectionViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StaffSectionViewComponent]
    });
    fixture = TestBed.createComponent(StaffSectionViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
