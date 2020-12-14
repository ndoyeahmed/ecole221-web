import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangementClasseComponent } from './changement-classe.component';

describe('ChangementClasseComponent', () => {
  let component: ChangementClasseComponent;
  let fixture: ComponentFixture<ChangementClasseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangementClasseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangementClasseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
