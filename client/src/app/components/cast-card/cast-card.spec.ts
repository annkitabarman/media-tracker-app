import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CastCard } from './cast-card';

describe('CastCard', () => {
  let component: CastCard;
  let fixture: ComponentFixture<CastCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CastCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CastCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
