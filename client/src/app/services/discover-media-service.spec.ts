import { TestBed } from '@angular/core/testing';

import { DiscoverMediaService } from './discover-media-service';

describe('DiscoverMediaService', () => {
  let service: DiscoverMediaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DiscoverMediaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
