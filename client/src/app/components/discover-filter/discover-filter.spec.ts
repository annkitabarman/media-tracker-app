import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscoverFilter } from './discover-filter';

describe('DiscoverFilter', () => {
  let component: DiscoverFilter;
  let fixture: ComponentFixture<DiscoverFilter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiscoverFilter]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiscoverFilter);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
