import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SomeButtonComponent } from './some-button.component';

describe('SomeButtonComponent', () => {
  let component: SomeButtonComponent;
  let fixture: ComponentFixture<SomeButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SomeButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SomeButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
