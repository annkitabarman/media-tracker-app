import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaCollection } from './media-collection';

describe('MediaCollection', () => {
  let component: MediaCollection;
  let fixture: ComponentFixture<MediaCollection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MediaCollection]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MediaCollection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
