import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MentorDash } from './mentor-dash';

describe('MentorDash', () => {
  let component: MentorDash;
  let fixture: ComponentFixture<MentorDash>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MentorDash],
    }).compileComponents();

    fixture = TestBed.createComponent(MentorDash);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
