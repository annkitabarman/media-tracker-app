import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RatingsFilters } from './ratings-filters';

describe('RatingsFilters', () => {
  let component: RatingsFilters;
  let fixture: ComponentFixture<RatingsFilters>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RatingsFilters]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RatingsFilters);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
