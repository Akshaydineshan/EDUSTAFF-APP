import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolSectionViewComponent } from './school-section-view.component';

describe('SchoolSectionViewComponent', () => {
  let component: SchoolSectionViewComponent;
  let fixture: ComponentFixture<SchoolSectionViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SchoolSectionViewComponent]
    });
    fixture = TestBed.createComponent(SchoolSectionViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
