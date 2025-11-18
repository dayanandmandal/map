import { TestBed } from '@angular/core/testing';

import { OrsSearchService } from './ors-search.service';

describe('OrsSearchService', () => {
  let service: OrsSearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrsSearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
