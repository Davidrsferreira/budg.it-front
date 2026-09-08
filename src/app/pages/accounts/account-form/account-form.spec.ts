import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AccountForm } from './account-form';

describe('AccountForm', () => {
  let component: AccountForm;
  let fixture: ComponentFixture<AccountForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountForm],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: null },
        { provide: MatDialogRef, useValue: { close: vi.fn() } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AccountForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expose only name and bank fields', () => {
    expect(Object.keys(component.form.controls)).toEqual(['name', 'bank']);
  });

  it('should expose the supported banks', () => {
    expect(component.banks).toEqual(['Nubank', 'Itaú', 'Banco do Brasil', 'Inter', 'Btg Pactual']);
  });

  it('should require a bank', () => {
    component.form.controls.bank.setValue('' as never);

    expect(component.form.controls.bank.hasError('required')).toBe(true);
  });
});
