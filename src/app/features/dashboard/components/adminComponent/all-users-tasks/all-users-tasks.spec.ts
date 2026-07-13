import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllUsersTasks } from './all-users-tasks';

describe('AllUsersTasks', () => {
  let component: AllUsersTasks;
  let fixture: ComponentFixture<AllUsersTasks>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllUsersTasks],
    }).compileComponents();

    fixture = TestBed.createComponent(AllUsersTasks);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
