import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Baralho } from './baralho';

describe('Baralho', () => {
  let component: Baralho;
  let fixture: ComponentFixture<Baralho>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Baralho]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Baralho);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
