import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AbortpageComponent } from './abortpage.component.ts';

describe('AbortpageComponent', () => {
  let component: AbortpageComponent;
  let fixture: ComponentFixture<AbortpageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AbortpageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AbortpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
