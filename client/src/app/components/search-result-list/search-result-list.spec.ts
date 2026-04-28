import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchResultList } from './search-result-list';

describe('SearchResultList', () => {
  let component: SearchResultList;
  let fixture: ComponentFixture<SearchResultList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchResultList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchResultList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
