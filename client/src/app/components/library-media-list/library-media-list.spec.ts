import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibraryMediaList } from './library-media-list';

describe('RatedMediaList', () => {
  let component: LibraryMediaList;
  let fixture: ComponentFixture<LibraryMediaList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LibraryMediaList],
    }).compileComponents();

    fixture = TestBed.createComponent(LibraryMediaList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
