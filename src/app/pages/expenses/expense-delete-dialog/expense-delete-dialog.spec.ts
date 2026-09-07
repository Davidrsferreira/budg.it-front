import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExpenseDeleteDialog } from './expense-delete-dialog';

describe('ExpenseDeleteDialog', () => {
  let component: ExpenseDeleteDialog;
  let fixture: ComponentFixture<ExpenseDeleteDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpenseDeleteDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(ExpenseDeleteDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
