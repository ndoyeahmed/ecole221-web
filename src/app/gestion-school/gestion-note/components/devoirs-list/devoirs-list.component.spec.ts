import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DevoirsListComponent } from './devoirs-list.component';

describe('DevoirsListComponent', () => {
  let component: DevoirsListComponent;
  let fixture: ComponentFixture<DevoirsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DevoirsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DevoirsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
