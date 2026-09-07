import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface NavigationItem {
  label: string;
  icon: string;
  route: string;
}
@Component({
  imports: [
    RouterLink,
    RouterLinkActive,
    MatListModule,
    MatIconModule
  ],
  selector: 'app-navigation',
  styleUrl: './navigation.css',
  templateUrl: './navigation.html',
})
export class Navigation {
  readonly items: NavigationItem[] = [
    {
      label: 'Dashboard',
      icon: 'dashboard',
      route: '/',
    },
    {
      label: 'Contas',
      icon: 'account_balance',
      route: '/accounts',
    },
    {
      label: 'Receitas',
      icon: 'trending_up',
      route: '/incomes',
    },
    {
      label: 'Despesas',
      icon: 'trending_down',
      route: '/expenses',
    },
    {
      label: 'Cartões',
      icon: 'credit_card',
      route: '/cards',
    },
    {
      label: 'Orçamento',
      icon: 'account_balance_wallet',
      route: '/budget',
    },
    {
      label: 'Configurações',
      icon: 'settings',
      route: '/settings',
    },
  ];
}
