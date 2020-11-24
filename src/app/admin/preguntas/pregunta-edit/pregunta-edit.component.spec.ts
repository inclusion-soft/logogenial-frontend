import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreguntaEditComponent } from './pregunta-edit.component';

describe('PreguntaEditComponent', () => {
  let component: PreguntaEditComponent;
  let fixture: ComponentFixture<PreguntaEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreguntaEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreguntaEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
