import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNativeDateAdapter } from '@angular/material/core';
import { Expenses } from './expenses';

describe('Expenses', () => {
  let component: Expenses;
  let fixture: ComponentFixture<Expenses>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Expenses],
      providers: [provideNativeDateAdapter()],
    }).compileComponents();

    fixture = TestBed.createComponent(Expenses);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should filter expenses by the current month by default', () => {
    const currentMonth = getCurrentMonth();

    component.expensesStore.expenses.set([
      {
        id: 1,
        description: 'Despesa atual',
        amount: 100,
        date: `${currentMonth}-05`,
        paymentMethod: 'debit',
        accountId: 1,
        cardId: null,
        installments: 1,
        installmentAmount: 100,
        category: 'Outros',
      },
      {
        id: 2,
        description: 'Despesa anterior',
        amount: 200,
        date: '2025-01-05',
        paymentMethod: 'debit',
        accountId: 1,
        cardId: null,
        installments: 1,
        installmentAmount: 200,
        category: 'Outros',
      },
    ]);

    expect(component.selectedMonth()).toBe(currentMonth);
    expect(component.filteredExpenses().map((expense) => expense.id)).toEqual([1]);
  });

  it('should calculate the total for filtered expenses', () => {
    const currentMonth = getCurrentMonth();

    component.expensesStore.expenses.set([
      {
        id: 1,
        description: 'Moradia',
        amount: 800,
        date: `${currentMonth}-05`,
        paymentMethod: 'debit',
        accountId: 1,
        cardId: null,
        installments: 1,
        installmentAmount: 800,
        category: 'Moradia',
      },
      {
        id: 2,
        description: 'Lazer',
        amount: 150,
        date: `${currentMonth}-10`,
        paymentMethod: 'debit',
        accountId: 1,
        cardId: null,
        installments: 1,
        installmentAmount: 150,
        category: 'Lazer',
      },
      {
        id: 3,
        description: 'Despesa anterior',
        amount: 200,
        date: '2025-01-05',
        paymentMethod: 'debit',
        accountId: 1,
        cardId: null,
        installments: 1,
        installmentAmount: 200,
        category: 'Outros',
      },
    ]);

    expect(component.filteredTotal()).toBe(950);

    component.selectedCategory.set('Moradia');

    expect(component.filteredTotal()).toBe(800);
  });

  it('should update the selected month and close the datepicker', () => {
    const datepicker = { close: vi.fn() };

    component.onMonthSelected(new Date(2025, 0, 1), datepicker as never);

    expect(component.selectedMonth()).toBe('2025-01');
    expect(datepicker.close).toHaveBeenCalledOnce();
  });

  it('should return predefined icons for expense categories', () => {
    expect(component.getCategoryIcon('Moradia')).toBe('home');
    expect(component.getCategoryIcon('Alimentação')).toBe('restaurant');
    expect(component.getCategoryIcon('Transporte')).toBe('directions_car');
    expect(component.getCategoryIcon('Lazer')).toBe('celebration');
    expect(component.getCategoryIcon('Saúde')).toBe('health_and_safety');
    expect(component.getCategoryIcon('Educação')).toBe('school');
    expect(component.getCategoryIcon('Outros')).toBe('category');
  });

  it('should restore the current month when clearing filters', () => {
    component.selectedCategory.set('Moradia');
    component.selectedMonth.set('2025-01');

    component.clearFilters();

    expect(component.selectedCategory()).toBe('');
    expect(component.selectedMonth()).toBe(getCurrentMonth());
  });
});

function getCurrentMonth(): string {
  const date = new Date();
  const month = String(date.getMonth() + 1).padStart(2, '0');

  return `${date.getFullYear()}-${month}`;
}
