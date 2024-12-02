import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferCompletedListComponent } from './transfer-completed-list.component';

describe('TransferCompletedListComponent', () => {
  let component: TransferCompletedListComponent;
  let fixture: ComponentFixture<TransferCompletedListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TransferCompletedListComponent]
    });
    fixture = TestBed.createComponent(TransferCompletedListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
