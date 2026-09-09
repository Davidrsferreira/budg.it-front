import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ExpenseForm } from './expense-form';

describe('ExpenseForm', () => {
  let component: ExpenseForm;
  let fixture: ComponentFixture<ExpenseForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpenseForm],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: null },
        { provide: MatDialogRef, useValue: { close: vi.fn() } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ExpenseForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate the installment from the total amount', () => {
    component.form.controls.paymentMethod.setValue('credit');
    component.form.controls.installments.setValue(3);
    component.form.controls.amount.setValue(100);

    expect(component.form.controls.installmentAmount.value).toBe(33.33);
  });

  it('should calculate the total amount from the installment', () => {
    component.form.controls.paymentMethod.setValue('credit');
    component.form.controls.installments.setValue(4);
    component.form.controls.installmentAmount.setValue(25);

    expect(component.form.controls.amount.value).toBe(100);
  });

  it('should require only the target for the selected payment method', () => {
    component.form.controls.paymentMethod.setValue('credit');

    expect(component.form.controls.accountId.hasError('required')).toBe(false);
    expect(component.form.controls.cardId.hasError('required')).toBe(true);

    component.form.controls.paymentMethod.setValue('debit');

    expect(component.form.controls.accountId.hasError('required')).toBe(true);
    expect(component.form.controls.cardId.hasError('required')).toBe(false);
  });
});
