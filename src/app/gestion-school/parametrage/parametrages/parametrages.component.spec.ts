import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParametragesComponent } from './parametrages.component';

describe('ParametragesComponent', () => {
  let component: ParametragesComponent;
  let fixture: ComponentFixture<ParametragesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParametragesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParametragesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
