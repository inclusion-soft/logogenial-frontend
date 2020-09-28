import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NivelesAdminComponent } from './niveles-admin.component';

describe('NivelesAdminComponent', () => {
  let component: NivelesAdminComponent;
  let fixture: ComponentFixture<NivelesAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NivelesAdminComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NivelesAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
