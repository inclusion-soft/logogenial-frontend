import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NivelListComponent } from './nivel-list.component';

describe('NivelListComponent', () => {
  let component: NivelListComponent;
  let fixture: ComponentFixture<NivelListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NivelListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NivelListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
