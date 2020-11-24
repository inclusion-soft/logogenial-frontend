import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatageniaListComponent } from './datagenia-list.component';

describe('DatageniaListComponent', () => {
  let component: DatageniaListComponent;
  let fixture: ComponentFixture<DatageniaListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatageniaListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatageniaListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
