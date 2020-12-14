import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParcoursEtudiantComponent } from './parcours-etudiant.component';

describe('ParcoursEtudiantComponent', () => {
  let component: ParcoursEtudiantComponent;
  let fixture: ComponentFixture<ParcoursEtudiantComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParcoursEtudiantComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParcoursEtudiantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
