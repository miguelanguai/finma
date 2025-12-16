import { TestBed } from '@angular/core/testing';

import { PeriodoService } from './periodo-service';

describe('Service', () => {
  let service: PeriodoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PeriodoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
