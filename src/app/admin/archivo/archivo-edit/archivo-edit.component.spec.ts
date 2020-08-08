import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchivoEditComponent } from './archivo-edit.component';

describe('ArchivoEditComponent', () => {
  let component: ArchivoEditComponent;
  let fixture: ComponentFixture<ArchivoEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArchivoEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchivoEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
