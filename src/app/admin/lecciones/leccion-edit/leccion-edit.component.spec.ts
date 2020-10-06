import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeccionEditComponent } from './leccion-edit.component';

describe('LeccionEditComponent', () => {
  let component: LeccionEditComponent;
  let fixture: ComponentFixture<LeccionEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeccionEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeccionEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
