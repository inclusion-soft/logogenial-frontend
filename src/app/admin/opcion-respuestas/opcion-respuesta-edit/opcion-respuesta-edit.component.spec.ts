import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpcionRespuestaEditComponent } from './opcion-respuesta-edit.component';

describe('OpcionRespuestaEditComponent', () => {
  let component: OpcionRespuestaEditComponent;
  let fixture: ComponentFixture<OpcionRespuestaEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpcionRespuestaEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OpcionRespuestaEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
