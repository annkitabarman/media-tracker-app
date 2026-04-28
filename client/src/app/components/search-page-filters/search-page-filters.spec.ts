import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchPageFilters } from './search-page-filters';

describe('SearchPageFilters', () => {
  let component: SearchPageFilters;
  let fixture: ComponentFixture<SearchPageFilters>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchPageFilters]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchPageFilters);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
