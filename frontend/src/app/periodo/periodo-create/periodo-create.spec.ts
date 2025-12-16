import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeriodoCreate } from './periodo-create';

describe('PeriodoCreate', () => {
  let component: PeriodoCreate;
  let fixture: ComponentFixture<PeriodoCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PeriodoCreate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PeriodoCreate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
