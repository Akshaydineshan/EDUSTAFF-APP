import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolHoverPopupComponent } from './school-hover-popup.component';

describe('SchoolHoverPopupComponent', () => {
  let component: SchoolHoverPopupComponent;
  let fixture: ComponentFixture<SchoolHoverPopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SchoolHoverPopupComponent]
    });
    fixture = TestBed.createComponent(SchoolHoverPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
