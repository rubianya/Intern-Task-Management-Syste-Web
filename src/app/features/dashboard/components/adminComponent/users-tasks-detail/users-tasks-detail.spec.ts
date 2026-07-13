import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersTasksDetail } from './users-tasks-detail';

describe('UsersTasksDetail', () => {
  let component: UsersTasksDetail;
  let fixture: ComponentFixture<UsersTasksDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsersTasksDetail],
    }).compileComponents();

    fixture = TestBed.createComponent(UsersTasksDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
