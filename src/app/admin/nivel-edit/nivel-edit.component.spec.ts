import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NivelEditComponent } from './nivel-edit.component';

describe('NivelEditComponent', () => {
  let component: NivelEditComponent;
  let fixture: ComponentFixture<NivelEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NivelEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NivelEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
