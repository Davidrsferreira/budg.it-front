import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CurrencyDirective } from '../../../shared/directives/currency/currency.directive';

import { Account } from '../models/account';

@Component({
  selector: 'app-account-form',
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    CurrencyDirective
  ],
  templateUrl: './account-form.html',
  styleUrl: './account-form.css',
})
export class AccountForm {
  private readonly formBuilder = inject(FormBuilder);

  private readonly dialogRef = inject(MatDialogRef<AccountForm>);

  readonly account = inject<Account | null>(MAT_DIALOG_DATA, {
    optional: true,
  });

  readonly form = this.formBuilder.nonNullable.group({
    name: [this.account?.name ?? '', Validators.required],
    institution: [this.account?.institution ?? '', Validators.required],
    type: [this.account?.type ?? 'checking', Validators.required],
    balance: [this.account?.balance ?? 0, [Validators.required, Validators.min(0)]],
  });

  get isEditMode(): boolean {
    return this.account !== null;
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.dialogRef.close(this.form.getRawValue());
  }
}
