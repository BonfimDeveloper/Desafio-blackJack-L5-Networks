import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayingCard } from './playing-card';

describe('PlayingCard', () => {
  let component: PlayingCard;
  let fixture: ComponentFixture<PlayingCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayingCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayingCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
