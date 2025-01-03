import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SFTPSelectionComponent } from './sftp-selection.component';

describe('SFTPSelectionComponent', () => {
  let component: SFTPSelectionComponent;
  let fixture: ComponentFixture<SFTPSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SFTPSelectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SFTPSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
