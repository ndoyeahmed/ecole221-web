import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnneescolaireComponent } from './anneescolaire.component';

describe('AnneescolaireComponent', () => {
  let component: AnneescolaireComponent;
  let fixture: ComponentFixture<AnneescolaireComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnneescolaireComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnneescolaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
