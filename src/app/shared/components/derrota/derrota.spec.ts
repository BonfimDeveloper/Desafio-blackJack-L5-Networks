import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Derrota } from './derrota';

describe('Derrota', () => {
  let component: Derrota;
  let fixture: ComponentFixture<Derrota>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Derrota]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Derrota);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
