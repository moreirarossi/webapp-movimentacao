import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClienteCriarComponent } from './cliente-criar.component';

describe('ClienteCriarComponent', () => {
  let component: ClienteCriarComponent;
  let fixture: ComponentFixture<ClienteCriarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClienteCriarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClienteCriarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
