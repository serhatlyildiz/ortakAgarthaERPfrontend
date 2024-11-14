import { TestBed } from '@angular/core/testing';

import { SupercategoryService } from './supercategory.service';

describe('SupercategoryService', () => {
  let service: SupercategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SupercategoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
