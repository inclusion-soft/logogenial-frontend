import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeccionAdminComponent } from './leccion-admin.component';

describe('LeccionAdminComponent', () => {
  let component: LeccionAdminComponent;
  let fixture: ComponentFixture<LeccionAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeccionAdminComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeccionAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
