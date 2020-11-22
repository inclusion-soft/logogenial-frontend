import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrupoEstudianteAdminComponent } from './grupo-estudiante-admin.component';

describe('GrupoEstudianteAdminComponent', () => {
  let component: GrupoEstudianteAdminComponent;
  let fixture: ComponentFixture<GrupoEstudianteAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GrupoEstudianteAdminComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GrupoEstudianteAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
