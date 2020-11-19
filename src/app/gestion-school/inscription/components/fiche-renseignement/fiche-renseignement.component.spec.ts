import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FicheRenseignementComponent } from './fiche-renseignement.component';

describe('FicheRenseignementComponent', () => {
  let component: FicheRenseignementComponent;
  let fixture: ComponentFixture<FicheRenseignementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FicheRenseignementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FicheRenseignementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
