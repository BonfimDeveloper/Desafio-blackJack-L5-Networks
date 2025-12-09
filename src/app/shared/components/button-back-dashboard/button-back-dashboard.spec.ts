import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonBackDashboard } from './button-back-dashboard';

describe('ButtonBackDashboard', () => {
  let component: ButtonBackDashboard;
  let fixture: ComponentFixture<ButtonBackDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonBackDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ButtonBackDashboard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
