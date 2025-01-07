import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VacantPositionAddComponent } from './vacant-position-add.component';

describe('VacantPositionAddComponent', () => {
  let component: VacantPositionAddComponent;
  let fixture: ComponentFixture<VacantPositionAddComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VacantPositionAddComponent]
    });
    fixture = TestBed.createComponent(VacantPositionAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
