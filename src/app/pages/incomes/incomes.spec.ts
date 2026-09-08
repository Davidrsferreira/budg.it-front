import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNativeDateAdapter } from '@angular/material/core';
import { Incomes } from './incomes';

describe('Incomes', () => {
  let component: Incomes;
  let fixture: ComponentFixture<Incomes>;

  const getCurrentMonth = (): string => {
    const date = new Date();
    const month = String(date.getMonth() + 1).padStart(2, '0');

    return `${date.getFullYear()}-${month}`;
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Incomes],
      providers: [provideNativeDateAdapter()],
    }).compileComponents();

    fixture = TestBed.createComponent(Incomes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should filter incomes by the current month by default', () => {
    const currentMonth = getCurrentMonth();

    component.incomesStore.incomes.set([
      {
        id: 1,
        description: 'Receita atual',
        amount: 100,
        date: `${currentMonth}-05`,
        accountId: 1,
        category: 'Outros',
      },
      {
        id: 2,
        description: 'Receita anterior',
        amount: 200,
        date: '2025-01-05',
        accountId: 1,
        category: 'Outros',
      },
    ]);

    expect(component.selectedMonth()).toBe(currentMonth);
    expect(component.filteredIncomes().map((income) => income.id)).toEqual([1]);
  });

  it('should update the selected month and close the datepicker', () => {
    const datepicker = { close: vi.fn() };

    component.onMonthSelected(new Date(2025, 0, 1), datepicker as never);

    expect(component.selectedMonth()).toBe('2025-01');
    expect(datepicker.close).toHaveBeenCalledOnce();
  });

  it('should restore the current month when clearing filters', () => {
    component.selectedCategory.set('Salário');
    component.selectedMonth.set('2025-01');

    component.clearFilters();

    expect(component.selectedCategory()).toBe('');
    expect(component.selectedMonth()).toBe(getCurrentMonth());
  });
});
