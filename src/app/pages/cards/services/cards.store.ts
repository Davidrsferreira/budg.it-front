import { computed, Injectable, signal } from '@angular/core';

import { Card } from '../models/card';

@Injectable({
  providedIn: 'root',
})
export class CardsStore {
  readonly cards = signal<Card[]>([
    {
      id: 1,
      name: 'Cartão Principal',
      institution: 'Banco Principal',
      limit: 10000,
      closingDay: 15,
      dueDay: 22,
    },
    {
      id: 2,
      name: 'Cartão Secundário',
      institution: 'Banco Principal',
      limit: 5000,
      closingDay: 5,
      dueDay: 12,
    },
  ]);

  readonly totalLimit = computed(() => this.cards().reduce((total, card) => total + card.limit, 0));

  add(card: Omit<Card, 'id'>): void {
    this.cards.update((cards) => [
      ...cards,
      {
        id: this.getNextId(cards),
        ...card,
      },
    ]);
  }

  update(id: number, card: Omit<Card, 'id'>): void {
    this.cards.update((cards) =>
      cards.map((item) =>
        item.id === id
          ? {
              id,
              ...card,
            }
          : item,
      ),
    );
  }

  remove(id: number): void {
    this.cards.update((cards) => cards.filter((card) => card.id !== id));
  }

  findById(id: number): Card | undefined {
    return this.cards().find((card) => card.id === id);
  }

  private getNextId(cards: Card[]): number {
    if (cards.length === 0) {
      return 1;
    }

    return Math.max(...cards.map((card) => card.id)) + 1;
  }
}
