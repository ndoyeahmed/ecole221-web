import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferentielAddComponent } from './referentiel-add.component';

describe('ReferentielAddComponent', () => {
  let component: ReferentielAddComponent;
  let fixture: ComponentFixture<ReferentielAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReferentielAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferentielAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
