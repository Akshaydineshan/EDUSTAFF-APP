import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthoritiesListComponent } from './authorities-list.component';

describe('AuthoritiesListComponent', () => {
  let component: AuthoritiesListComponent;
  let fixture: ComponentFixture<AuthoritiesListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AuthoritiesListComponent]
    });
    fixture = TestBed.createComponent(AuthoritiesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
