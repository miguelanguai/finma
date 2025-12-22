import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriaEdit } from './categoria-edit';

describe('CategoriaEdit', () => {
  let component: CategoriaEdit;
  let fixture: ComponentFixture<CategoriaEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoriaEdit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoriaEdit);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
