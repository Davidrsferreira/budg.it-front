import { Routes } from '@angular/router';
import { Shell } from './layout/shell/shell';
import { Home } from './pages/home/home';
import { Accounts } from './pages/accounts/accounts';
import { Settings } from './pages/settings/settings';
import { Incomes } from './pages/incomes/incomes';
import { Expenses } from './pages/expenses/expenses';
import { Cards } from './pages/cards/cards';
import { Budget } from './pages/budget/budget';

export const routes: Routes = [
  {
    path: '',
    component: Shell,
    children: [
      {
        path: '',
        component: Home,
      },
      {
        path: 'accounts',
        component: Accounts,
      },
      {
        path: 'incomes',
        component: Incomes,
      },
      {
        path: 'expenses',
        component: Expenses,
      },
      {
        path: 'cards',
        component: Cards,
      },
      {
        path: 'budget',
        component: Budget,
      },
      {
        path: 'settings',
        component: Settings,
      }
    ],
  }
];
