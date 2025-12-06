import { TestBed } from '@angular/core/testing';

import { MapIconService } from './map-icon.service';

describe('MapIconService', () => {
  let service: MapIconService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MapIconService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
