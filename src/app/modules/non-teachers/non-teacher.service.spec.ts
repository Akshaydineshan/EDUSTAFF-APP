import { TestBed } from '@angular/core/testing';

import { NonTeacherService } from './non-teacher.service';

describe('NonTeacherService', () => {
  let service: NonTeacherService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NonTeacherService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
