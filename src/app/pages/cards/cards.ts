import { Component, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { Card } from './models/card';
import { CardsStore } from './services/cards.store';
import { CardForm } from './card-form/card-form';
import { CardDeleteDialog } from './card-delete-dialog/card-delete-dialog';

@Component({
  selector: 'app-cards',
  imports: [DecimalPipe, MatButtonModule, MatCardModule, MatDialogModule, MatIconModule],
  templateUrl: './cards.html',
  styleUrl: './cards.css',
})
export class Cards {
  readonly cardsStore = inject(CardsStore);

  private readonly dialog = inject(MatDialog);

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(CardForm, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.cardsStore.add(result);
      }
    });
  }

  openEditDialog(card: Card): void {
    const dialogRef = this.dialog.open(CardForm, {
      width: '500px',
      data: card,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.cardsStore.update(card.id, result);
      }
    });
  }

  openDeleteDialog(card: Card): void {
    const dialogRef = this.dialog.open(CardDeleteDialog, {
      width: '400px',
      data: card,
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.cardsStore.remove(card.id);
      }
    });
  }
}
