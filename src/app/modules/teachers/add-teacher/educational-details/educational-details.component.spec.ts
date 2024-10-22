import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EducationalDetailsComponent } from './educational-details.component';

describe('EducationalDetailsComponent', () => {
  let component: EducationalDetailsComponent;
  let fixture: ComponentFixture<EducationalDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EducationalDetailsComponent]
    });
    fixture = TestBed.createComponent(EducationalDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
