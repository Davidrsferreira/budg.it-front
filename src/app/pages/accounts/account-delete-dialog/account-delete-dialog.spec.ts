import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AccountDeleteDialog } from './account-delete-dialog';

describe('AccountDeleteDialog', () => {
  let component: AccountDeleteDialog;
  let fixture: ComponentFixture<AccountDeleteDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountDeleteDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(AccountDeleteDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
