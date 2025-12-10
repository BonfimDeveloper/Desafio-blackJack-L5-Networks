import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Vitoria } from './vitoria';

describe('Vitoria', () => {
  let component: Vitoria;
  let fixture: ComponentFixture<Vitoria>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Vitoria]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Vitoria);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
