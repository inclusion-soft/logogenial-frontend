import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrupoEstudianteEditComponent } from './grupo-estudiante-edit.component';

describe('GrupoEstudianteEditComponent', () => {
  let component: GrupoEstudianteEditComponent;
  let fixture: ComponentFixture<GrupoEstudianteEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GrupoEstudianteEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GrupoEstudianteEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
