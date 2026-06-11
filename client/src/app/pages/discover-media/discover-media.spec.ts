import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscoverMedia } from './discover-media';

describe('DiscoverMedia', () => {
  let component: DiscoverMedia;
  let fixture: ComponentFixture<DiscoverMedia>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiscoverMedia]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiscoverMedia);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
