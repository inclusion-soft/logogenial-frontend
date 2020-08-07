import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatageniaEditComponent } from './datagenia-edit.component';

describe('DatageniaEditComponent', () => {
  let component: DatageniaEditComponent;
  let fixture: ComponentFixture<DatageniaEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatageniaEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatageniaEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
