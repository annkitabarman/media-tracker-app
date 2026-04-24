import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RatedMedia } from './rated-media';

describe('RatedMedia', () => {
  let component: RatedMedia;
  let fixture: ComponentFixture<RatedMedia>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RatedMedia]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RatedMedia);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
