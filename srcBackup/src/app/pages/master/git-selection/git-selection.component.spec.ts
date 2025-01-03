import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GitSelectionComponent } from './git-selection.component';

describe('GitSelectionComponent', () => {
  let component: GitSelectionComponent;
  let fixture: ComponentFixture<GitSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GitSelectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GitSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
