import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatageniaAdminComponent } from './datagenia-admin.component';

describe('DatageniaAdminComponent', () => {
  let component: DatageniaAdminComponent;
  let fixture: ComponentFixture<DatageniaAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatageniaAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatageniaAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
