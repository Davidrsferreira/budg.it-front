import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IncomeDeleteDialog } from './income-delete-dialog';

describe('IncomeDeleteDialog', () => {
  let component: IncomeDeleteDialog;
  let fixture: ComponentFixture<IncomeDeleteDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncomeDeleteDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(IncomeDeleteDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
