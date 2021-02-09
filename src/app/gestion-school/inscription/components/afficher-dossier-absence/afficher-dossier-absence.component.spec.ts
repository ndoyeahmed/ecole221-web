import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AfficherDossierAbsenceComponent } from './afficher-dossier-absence.component';

describe('AfficherDossierAbsenceComponent', () => {
  let component: AfficherDossierAbsenceComponent;
  let fixture: ComponentFixture<AfficherDossierAbsenceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AfficherDossierAbsenceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AfficherDossierAbsenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
