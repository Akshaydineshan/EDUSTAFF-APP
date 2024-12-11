import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffTransferCompletedListComponent } from './staff-transfer-completed-list.component';

describe('StaffTransferCompletedListComponent', () => {
  let component: StaffTransferCompletedListComponent;
  let fixture: ComponentFixture<StaffTransferCompletedListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StaffTransferCompletedListComponent]
    });
    fixture = TestBed.createComponent(StaffTransferCompletedListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
