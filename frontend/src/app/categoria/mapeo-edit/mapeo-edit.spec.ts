import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapeoEdit } from './mapeo-edit';

describe('MapeoEdit', () => {
  let component: MapeoEdit;
  let fixture: ComponentFixture<MapeoEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapeoEdit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapeoEdit);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
