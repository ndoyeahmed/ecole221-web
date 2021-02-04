import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionPresenceComponent } from './gestion-presence.component';

describe('GestionPresenceComponent', () => {
  let component: GestionPresenceComponent;
  let fixture: ComponentFixture<GestionPresenceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GestionPresenceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionPresenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
