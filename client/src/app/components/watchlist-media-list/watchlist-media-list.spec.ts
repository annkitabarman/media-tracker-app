import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RatedMediaList } from './watchlist-media-list';

describe('RatedMediaList', () => {
  let component: RatedMediaList;
  let fixture: ComponentFixture<RatedMediaList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RatedMediaList],
    }).compileComponents();

    fixture = TestBed.createComponent(RatedMediaList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
