import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PullCodeComponent } from './pull-code.component';

describe('PullCodeComponent', () => {
  let component: PullCodeComponent;
  let fixture: ComponentFixture<PullCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PullCodeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PullCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
