import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaDetails } from './media-details';

describe('MediaDetails', () => {
  let component: MediaDetails;
  let fixture: ComponentFixture<MediaDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MediaDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MediaDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
