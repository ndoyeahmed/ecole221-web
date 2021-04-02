import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecapReferentielComponent } from './recap-referentiel.component';

describe('RecapReferentielComponent', () => {
  let component: RecapReferentielComponent;
  let fixture: ComponentFixture<RecapReferentielComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecapReferentielComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecapReferentielComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
