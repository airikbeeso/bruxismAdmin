import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientAlertsComponent } from './client-alerts.component';

describe('ClientAlertsComponent', () => {
  let component: ClientAlertsComponent;
  let fixture: ComponentFixture<ClientAlertsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientAlertsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientAlertsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
