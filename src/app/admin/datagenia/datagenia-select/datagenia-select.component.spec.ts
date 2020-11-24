import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatageniaSelectComponent } from './datagenia-select.component';

describe('DatageniaSelectComponent', () => {
  let component: DatageniaSelectComponent;
  let fixture: ComponentFixture<DatageniaSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatageniaSelectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatageniaSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
