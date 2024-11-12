import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferRequestListComponent } from './transfer-request-list.component';

describe('TransferRequestListComponent', () => {
  let component: TransferRequestListComponent;
  let fixture: ComponentFixture<TransferRequestListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TransferRequestListComponent]
    });
    fixture = TestBed.createComponent(TransferRequestListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
