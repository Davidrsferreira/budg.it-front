import { ComponentFixture, TestBed } from '@angular/core/testing';
import * as echarts from 'echarts/core';
import { provideEchartsCore } from 'ngx-echarts';
import { Dashboard } from './dashboard';

class ResizeObserverMock {
  observe(): void {
    return undefined;
  }

  unobserve(): void {
    return undefined;
  }

  disconnect(): void {
    return undefined;
  }
}

Object.defineProperty(globalThis, 'ResizeObserver', {
  configurable: true,
  value: ResizeObserverMock,
});

describe('Dashboard', () => {
  let component: Dashboard;
  let fixture: ComponentFixture<Dashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Dashboard],
      providers: [provideEchartsCore({ echarts })],
    }).compileComponents();

    fixture = TestBed.createComponent(Dashboard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate the total balance from income minus expenses', () => {
    expect(component.totalBalance()).toBe(component.totalIncome() - component.totalExpenses());
  });
});
