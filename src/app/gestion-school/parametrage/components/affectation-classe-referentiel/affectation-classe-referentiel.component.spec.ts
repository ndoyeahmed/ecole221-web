import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AffectationClasseReferentielComponent } from './affectation-classe-referentiel.component';

describe('AffectationClasseReferentielComponent', () => {
  let component: AffectationClasseReferentielComponent;
  let fixture: ComponentFixture<AffectationClasseReferentielComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AffectationClasseReferentielComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AffectationClasseReferentielComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
