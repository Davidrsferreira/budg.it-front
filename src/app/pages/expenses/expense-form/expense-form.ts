import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { CurrencyDirective } from '../../../shared/directives/currency/currency.directive';
import { AccountsStore } from '../../accounts/services/accounts.store';
import { CardsStore } from '../../cards/services/cards.store';
import { Expense, PaymentMethod } from '../models/expense';

@Component({
  selector: 'app-expense-form',
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    CurrencyDirective,
  ],
  templateUrl: './expense-form.html',
  styleUrl: './expense-form.css',
})
export class ExpenseForm {
  private readonly formBuilder = inject(FormBuilder);

  private readonly dialogRef = inject(MatDialogRef<ExpenseForm>);

  readonly accountsStore = inject(AccountsStore);

  readonly cardsStore = inject(CardsStore);

  readonly expense = inject<Expense | null>(MAT_DIALOG_DATA, {
    optional: true,
  });

  readonly form = this.formBuilder.nonNullable.group({
    description: [this.expense?.description ?? '', Validators.required],
    amount: [this.expense?.amount ?? 0, [Validators.required, Validators.min(0.01)]],
    installmentAmount: [
      this.expense?.installmentAmount ?? this.expense?.amount ?? 0,
      [Validators.required, Validators.min(0.01)],
    ],
    installments: [this.expense?.installments ?? 1, [Validators.required, Validators.min(1)]],
    date: [this.expense?.date ?? this.getToday(), Validators.required],
    paymentMethod: [this.expense?.paymentMethod ?? 'debit' as PaymentMethod, Validators.required],
    accountId: [this.expense?.accountId ?? null],
    cardId: [this.expense?.cardId ?? null],
    category: [this.expense?.category ?? '', Validators.required],
  });

  private isUpdatingAmounts = false;

  constructor() {
    this.updatePaymentValidators(this.form.controls.paymentMethod.value);

    this.form.controls.paymentMethod.valueChanges.subscribe((paymentMethod) => {
      this.updatePaymentValidators(paymentMethod);
    });

    this.form.controls.amount.valueChanges.subscribe((amount) => {
      if (this.isUpdatingAmounts || !this.isCreditPayment()) {
        return;
      }

      this.setInstallmentAmount(amount);
    });

    this.form.controls.installmentAmount.valueChanges.subscribe((installmentAmount) => {
      if (this.isUpdatingAmounts || !this.isCreditPayment()) {
        return;
      }

      const installments = this.form.controls.installments.value;

      if (installments > 0) {
        this.setTotalAmount(installmentAmount * installments);
      }
    });

    this.form.controls.installments.valueChanges.subscribe((installments) => {
      if (this.isUpdatingAmounts || !this.isCreditPayment() || installments < 1) {
        return;
      }

      this.setInstallmentAmount(this.form.controls.amount.value, installments);
    });
  }

  get isEditMode(): boolean {
    return this.expense !== null;
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();

    this.dialogRef.close({
      ...value,
      accountId: value.paymentMethod === 'debit' ? value.accountId : null,
      cardId: value.paymentMethod === 'credit' ? value.cardId : null,
      installments: value.paymentMethod === 'credit' ? value.installments : 1,
      installmentAmount: value.paymentMethod === 'credit' ? value.installmentAmount : value.amount,
    });
  }

  isCreditPayment(): boolean {
    return this.form.controls.paymentMethod.value === 'credit';
  }

  private updatePaymentValidators(paymentMethod: PaymentMethod): void {
    const accountControl = this.form.controls.accountId;
    const cardControl = this.form.controls.cardId;
    const installmentsControl = this.form.controls.installments;

    if (paymentMethod === 'debit') {
      accountControl.setValidators(Validators.required);
      cardControl.clearValidators();
      installmentsControl.clearValidators();
      cardControl.setValue(null, { emitEvent: false });
      installmentsControl.setValue(1, { emitEvent: false });
    } else {
      accountControl.clearValidators();
      cardControl.setValidators(Validators.required);
      installmentsControl.setValidators([Validators.required, Validators.min(1)]);
      accountControl.setValue(null, { emitEvent: false });
    }

    accountControl.updateValueAndValidity({ emitEvent: false });
    cardControl.updateValueAndValidity({ emitEvent: false });
    installmentsControl.updateValueAndValidity({ emitEvent: false });
  }

  private setInstallmentAmount(amount: number, installments = this.form.controls.installments.value): void {
    this.isUpdatingAmounts = true;
    this.form.controls.installmentAmount.setValue(
      installments > 0 ? Number((amount / installments).toFixed(2)) : 0,
    );
    this.isUpdatingAmounts = false;
  }

  private setTotalAmount(amount: number): void {
    this.isUpdatingAmounts = true;
    this.form.controls.amount.setValue(Number(amount.toFixed(2)));
    this.isUpdatingAmounts = false;
  }

  private getToday(): string {
    return new Date().toISOString().split('T')[0];
  }
}
