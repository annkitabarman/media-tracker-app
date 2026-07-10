import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaDetailSkeleton } from './media-detail-skeleton';

describe('MediaDetailSkeleton', () => {
  let component: MediaDetailSkeleton;
  let fixture: ComponentFixture<MediaDetailSkeleton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MediaDetailSkeleton]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MediaDetailSkeleton);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
