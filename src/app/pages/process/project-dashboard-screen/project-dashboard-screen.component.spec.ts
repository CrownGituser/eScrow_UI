import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectDashboardScreenComponent } from './project-dashboard-screen.component';

describe('ProjectDashboardScreenComponent', () => {
  let component: ProjectDashboardScreenComponent;
  let fixture: ComponentFixture<ProjectDashboardScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectDashboardScreenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectDashboardScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
