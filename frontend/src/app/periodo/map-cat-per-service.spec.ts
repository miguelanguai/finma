import { TestBed } from '@angular/core/testing';

import { MapCatPerService } from './map-cat-per-service';

describe('MapCatPerService', () => {
  let service: MapCatPerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MapCatPerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
