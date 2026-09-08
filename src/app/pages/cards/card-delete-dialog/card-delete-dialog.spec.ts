import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CardDeleteDialog } from './card-delete-dialog';

describe('CardDeleteDialog', () => {
  let component: CardDeleteDialog;
  let fixture: ComponentFixture<CardDeleteDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardDeleteDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(CardDeleteDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
