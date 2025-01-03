import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GitLabSelectionComponent } from './git-lab-selection.component';

describe('GitLabSelectionComponent', () => {
  let component: GitLabSelectionComponent;
  let fixture: ComponentFixture<GitLabSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GitLabSelectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GitLabSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
