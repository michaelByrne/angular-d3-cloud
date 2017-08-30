import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D3CloudComponent } from './d3-cloud.component';

describe('D3CloudComponent', () => {
  let component: D3CloudComponent;
  let fixture: ComponentFixture<D3CloudComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D3CloudComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D3CloudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
