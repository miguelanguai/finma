import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovimientoEdit } from './movimiento-edit';

describe('MovimientoEdit', () => {
  let component: MovimientoEdit;
  let fixture: ComponentFixture<MovimientoEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovimientoEdit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MovimientoEdit);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
