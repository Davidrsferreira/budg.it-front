import { DecimalPipe } from '@angular/common';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { NgxEchartsDirective } from 'ngx-echarts';
import { LineChart, PieChart } from 'echarts/charts';
import { GridComponent, LegendComponent, TooltipComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import * as echarts from 'echarts/core';

echarts.use([
  LineChart,
  PieChart,
  GridComponent,
  LegendComponent,
  TooltipComponent,
  CanvasRenderer,
]);

interface DashboardSummary {
  balance: number;
  income: number;
  expenses: number;
  incomeCount: number;
  expenseCount: number;
}

interface FinancialEvolution {
  month: string;
  income: number;
  expenses: number;
}

interface ExpenseCategory {
  category: string;
  amount: number;
}

@Component({
  imports: [MatCardModule, MatIconModule, DecimalPipe, NgxEchartsDirective],
  selector: 'app-dashboard',
  styleUrl: './dashboard.css',
  templateUrl: './dashboard.html',
})
export class Dashboard {
  readonly summary: DashboardSummary = {
    balance: 12450,
    income: 8500,
    expenses: 5200,
    incomeCount: 12,
    expenseCount: 24,
  };

  readonly monthlyBalance = this.summary.income - this.summary.expenses;
  readonly monthlyBalanceAbs = Math.abs(this.monthlyBalance);

  readonly evolution: FinancialEvolution[] = [
    { month: 'Abr', income: 7200, expenses: 4800 },
    { month: 'Mai', income: 8100, expenses: 5100 },
    { month: 'Jun', income: 7900, expenses: 5300 },
    { month: 'Jul', income: 8500, expenses: 4900 },
    { month: 'Ago', income: 8300, expenses: 5500 },
    { month: 'Set', income: 8500, expenses: 5200 },
  ];

  readonly evolutionMonths = this.evolution.map((item) => item.month);
  readonly evolutionIncome = this.evolution.map((item) => item.income);
  readonly evolutionExpenses = this.evolution.map((item) => item.expenses);

  readonly expensesByCategory: ExpenseCategory[] = [
    { category: 'Moradia', amount: 1800 },
    { category: 'Alimentação', amount: 1200 },
    { category: 'Transporte', amount: 700 },
    { category: 'Lazer', amount: 500 },
    { category: 'Outros', amount: 1000 },
  ];

  private formatCurrency(value: number): string {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  }

  readonly evolutionChartOptions = {
    tooltip: {
      trigger: 'axis',
      valueFormatter: (value: number) => this.formatCurrency(value),
    },
    legend: {
      top: 0,
    },
    xAxis: {
      type: 'category',
      data: this.evolutionMonths,
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: (value: number) => this.formatCurrency(value),
      },
    },
    series: [
      {
        name: 'Receitas',
        type: 'line',
        data: this.evolutionIncome,
      },
      {
        name: 'Despesas',
        type: 'line',
        data: this.evolutionExpenses,
      },
    ],
  };

  readonly expensesChartOptions = {
    tooltip: {
      trigger: 'item',
      valueFormatter: (value: number) => this.formatCurrency(value),
    },

    legend: {
      top: 0,
    },

    series: [
      {
        name: 'Despesas',
        type: 'pie',
        radius: '60%',
        label: {
          formatter: '{b}: {d}%',
        },
        data: this.expensesByCategory.map((item) => ({
          name: item.category,
          value: item.amount,
        })),
      },
    ],
  };
}
