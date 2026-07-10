import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DisplayLibrary } from './display-library';

describe('DisplayWatchlist', () => {
  let component: DisplayLibrary;
  let fixture: ComponentFixture<DisplayLibrary>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisplayLibrary],
    }).compileComponents();

    fixture = TestBed.createComponent(DisplayLibrary);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
