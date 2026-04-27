import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayRatings } from './display-ratings';

describe('DisplayRatings', () => {
  let component: DisplayRatings;
  let fixture: ComponentFixture<DisplayRatings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisplayRatings]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisplayRatings);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
