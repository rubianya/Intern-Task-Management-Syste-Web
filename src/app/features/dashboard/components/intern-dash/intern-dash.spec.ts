import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternDash } from './intern-dash';

describe('InternDash', () => {
  let component: InternDash;
  let fixture: ComponentFixture<InternDash>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InternDash],
    }).compileComponents();

    fixture = TestBed.createComponent(InternDash);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
