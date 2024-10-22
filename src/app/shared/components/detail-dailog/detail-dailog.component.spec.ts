import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailDailogComponent } from './detail-dailog.component';

describe('DetailDailogComponent', () => {
  let component: DetailDailogComponent;
  let fixture: ComponentFixture<DetailDailogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetailDailogComponent]
    });
    fixture = TestBed.createComponent(DetailDailogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
