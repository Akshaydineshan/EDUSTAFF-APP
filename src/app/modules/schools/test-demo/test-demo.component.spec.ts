import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestDemoComponent } from './test-demo.component';

describe('TestDemoComponent', () => {
  let component: TestDemoComponent;
  let fixture: ComponentFixture<TestDemoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestDemoComponent]
    });
    fixture = TestBed.createComponent(TestDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
