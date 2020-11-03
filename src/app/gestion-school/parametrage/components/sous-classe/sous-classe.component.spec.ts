import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SousClasseComponent } from './sous-classe.component';

describe('SousClasseComponent', () => {
  let component: SousClasseComponent;
  let fixture: ComponentFixture<SousClasseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SousClasseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SousClasseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
