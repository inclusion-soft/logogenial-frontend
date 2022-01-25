import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EncuestaEditComponent } from './encuesta-edit.component';

describe('EncuestaEditComponent', () => {
  let component: EncuestaEditComponent;
  let fixture: ComponentFixture<EncuestaEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EncuestaEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EncuestaEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
