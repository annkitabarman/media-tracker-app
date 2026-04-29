import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DisplayWatchlist } from './display-watchlist';

describe('DisplayWatchlist', () => {
  let component: DisplayWatchlist;
  let fixture: ComponentFixture<DisplayWatchlist>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisplayWatchlist],
    }).compileComponents();

    fixture = TestBed.createComponent(DisplayWatchlist);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
