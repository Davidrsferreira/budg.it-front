import { DecimalPipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { NgxEchartsDirective } from 'ngx-echarts';
import { LineChart, PieChart } from 'echarts/charts';
import { GridComponent, LegendComponent, TooltipComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import * as echarts from 'echarts/core';
import { IncomesStore } from '../incomes/services/incomes.store';
import { ExpensesStore } from '../expenses/services/expenses.store';

echarts.use([
  LineChart,
  PieChart,
  GridComponent,
  LegendComponent,
  TooltipComponent,
  CanvasRenderer,
]);
@Component({
  imports: [MatCardModule, MatIconModule, DecimalPipe, NgxEchartsDirective],
  selector: 'app-dashboard',
  styleUrl: './dashboard.css',
  templateUrl: './dashboard.html',
})
export class Dashboard {
  readonly incomesStore = inject(IncomesStore);
  readonly expensesStore = inject(ExpensesStore);

  readonly totalBalance = computed(() => this.totalIncome() - this.totalExpenses());

  readonly totalIncome = computed(() =>
    this.incomesStore.incomes().reduce((total, income) => total + income.amount, 0),
  );

  readonly totalExpenses = computed(() =>
    this.expensesStore.expenses().reduce((total, expense) => total + expense.amount, 0),
  );

  readonly evolution = computed(() => {
    const incomes = this.incomesStore.incomes();
    const expenses = this.expensesStore.expenses();

    const months = new Map<string, { income: number; expenses: number }>();

    for (const income of incomes) {
      const month = income.date.slice(0, 7);

      const current = months.get(month) ?? {
        income: 0,
        expenses: 0,
      };

      current.income += income.amount;

      months.set(month, current);
    }

    for (const expense of expenses) {
      const month = expense.date.slice(0, 7);

      const current = months.get(month) ?? {
        income: 0,
        expenses: 0,
      };

      current.expenses += expense.amount;

      months.set(month, current);
    }

    return Array.from(months.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, values]) => ({
        month,
        ...values,
      }));
  });

  readonly evolutionMonths = computed(() => this.evolution().map((item) => item.month));

  readonly evolutionIncome = computed(() => this.evolution().map((item) => item.income));

  readonly evolutionExpenses = computed(() => this.evolution().map((item) => item.expenses));

  readonly expensesByCategory = computed(() => {
    const categories = new Map<string, number>();

    for (const expense of this.expensesStore.expenses()) {
      categories.set(expense.category, (categories.get(expense.category) ?? 0) + expense.amount);
    }

    return Array.from(categories.entries()).map(([category, amount]) => ({
      category,
      amount,
    }));
  });

  readonly evolutionChartOptions = computed(() => ({
    xAxis: {
      type: 'category',
      data: this.evolutionMonths(),
    },

    yAxis: {
      type: 'value',
    },

    tooltip: {
      trigger: 'axis',
    },

    legend: {
      data: ['Receitas', 'Despesas'],
    },

    series: [
      {
        name: 'Receitas',
        type: 'line',
        data: this.evolutionIncome(),
      },
      {
        name: 'Despesas',
        type: 'line',
        data: this.evolutionExpenses(),
      },
    ],
  }));

  readonly expensesChartOptions = computed(() => ({
    tooltip: {
      trigger: 'item',
    },

    legend: {
      orient: 'vertical',
      left: 'left',
    },

    series: [
      {
        type: 'pie',
        radius: '60%',
        data: this.expensesByCategory().map((item) => ({
          name: item.category,
          value: item.amount,
        })),
      },
    ],
  }));
}
