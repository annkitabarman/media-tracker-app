import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRatingPopup } from './add-rating-popup';

describe('AddRatingPopup', () => {
  let component: AddRatingPopup;
  let fixture: ComponentFixture<AddRatingPopup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddRatingPopup]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddRatingPopup);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
