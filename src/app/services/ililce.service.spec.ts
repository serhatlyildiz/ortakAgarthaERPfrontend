import { TestBed } from '@angular/core/testing';

import { IlilceService } from './ililce.service';

describe('IlilceService', () => {
  let service: IlilceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IlilceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
