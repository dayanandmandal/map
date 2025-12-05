import { TestBed } from '@angular/core/testing';

import { MapInitializerService } from './map-initializer.service';

describe('MapInitializerService', () => {
  let service: MapInitializerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MapInitializerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
