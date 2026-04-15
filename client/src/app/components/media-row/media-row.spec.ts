import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaRow } from './media-row';

describe('MediaRow', () => {
  let component: MediaRow;
  let fixture: ComponentFixture<MediaRow>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MediaRow]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MediaRow);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
