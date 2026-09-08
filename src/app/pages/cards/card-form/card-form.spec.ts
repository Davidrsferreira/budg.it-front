import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';

import { CardForm } from './card-form';

describe('CardForm', () => {
  let component: CardForm;
  let fixture: ComponentFixture<CardForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardForm],
      providers: [{ provide: MatDialogRef, useValue: { close: vi.fn() } }],
    }).compileComponents();

    fixture = TestBed.createComponent(CardForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should use the banks from accounts as select options', () => {
    expect(component.banks()).toEqual(['Nubank', 'Itaú', 'Banco do Brasil']);
  });

  it('should require a bank', () => {
    component.form.controls.bank.setValue('');

    expect(component.form.controls.bank.hasError('required')).toBe(true);
  });
});
