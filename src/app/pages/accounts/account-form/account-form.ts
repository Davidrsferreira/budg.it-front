import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { Account, Bank } from '../models/account';

@Component({
  selector: 'app-account-form',
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
  ],
  templateUrl: './account-form.html',
  styleUrl: './account-form.css',
})
export class AccountForm {
  readonly banks: Bank[] = ['Nubank', 'Itaú', 'Banco do Brasil', 'Inter', 'Btg Pactual'];

  private readonly formBuilder = inject(FormBuilder);

  private readonly dialogRef = inject(MatDialogRef<AccountForm>);

  readonly account = inject<Account | null>(MAT_DIALOG_DATA, {
    optional: true,
  });

  readonly form = this.formBuilder.nonNullable.group({
    name: [this.account?.name ?? '', Validators.required],
    bank: [this.account?.bank ?? ('Nubank' as Bank), Validators.required],
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
