import { TestBed } from '@angular/core/testing';

import { MapCoreService } from './map-core.service';

describe('MapCoreService', () => {
  let service: MapCoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MapCoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
