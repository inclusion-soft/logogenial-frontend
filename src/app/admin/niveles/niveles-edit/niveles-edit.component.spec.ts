import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NivelesEditComponent } from './niveles-edit.component';

describe('NivelesEditComponent', () => {
  let component: NivelesEditComponent;
  let fixture: ComponentFixture<NivelesEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NivelesEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NivelesEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
