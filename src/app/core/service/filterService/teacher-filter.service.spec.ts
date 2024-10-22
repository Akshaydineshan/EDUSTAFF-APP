import { TestBed } from '@angular/core/testing';

import { TeacherFilterService } from './teacher-filter.service';

describe('TeacherFilterService', () => {
  let service: TeacherFilterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TeacherFilterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
