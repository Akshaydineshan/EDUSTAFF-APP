import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolVacantPositionsComponent } from './school-vacant-positions.component';

describe('SchoolVacantPositionsComponent', () => {
  let component: SchoolVacantPositionsComponent;
  let fixture: ComponentFixture<SchoolVacantPositionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SchoolVacantPositionsComponent]
    });
    fixture = TestBed.createComponent(SchoolVacantPositionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
