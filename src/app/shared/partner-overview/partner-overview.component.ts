import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AfterViewInit } from '@angular/core';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
export interface IRecord {
  company_symbol: string;
  company_title: string;
  company_url: string;
  date: string;
  diff: string;
  diff_percent: string;
  fifty_two_weeks_high: string;
  fifty_two_weeks_low: string;
  id: number;
  one_eighty_days: string;
  one_twenty_days: string;
  previous_close: string;
  range_percent: string;
  stock_close: string;
  stock_confidence: string;
  stock_high: string;
  stock_low: string;
  stock_open: string;
  stock_range: string;
  trans: number;
  turnover: string;
  volume: string;
  vwap: string;
  vwap_percent: string;
}

export interface ICompany {
  id: number;
  name: string;
  symbol: string;
}
export interface PeriodicElement {
  balance: number;
  company: ICompany;
  id: number;
  ltp_value: number;
  records: IRecord[];
}


@Component({
  selector: 'app-partner-overview',
  templateUrl: './partner-overview.component.html',
  styleUrls: ['./partner-overview.component.scss']
})
export class PartnerOverviewComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSort)
  sort: MatSort = new MatSort();
  displayedColumns: string[] = ['symbol', 'company', 'fifty_two_weeks_high', 'fifty_two_weeks_low', 'previous_close', 'stock_close', 'balance', 'ltp_value', 'date'];
  footerColumns: string[] = ['symbol', 'ltp_value'];
  ELEMENT_DATA: PeriodicElement[] = [];
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  isSmall = false;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => {
        return result.matches;
      }),
      shareReplay()
    );
  isTablet$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Tablet)
    .pipe(
      map(result => {
        return result.matches;
      }),
      shareReplay()
    );

  @Input() partner: any;
  @Input() records: any;
  formatter = new Intl.NumberFormat('hi', {
    style: 'currency',
    currency: 'NPR',
  });
  total = 0;
  constructor(private breakpointObserver: BreakpointObserver) { }

  ngOnInit(): void {
    for (const ownership of this.records) {
      ownership['ltp_value'] = parseFloat(ownership.records[0].stock_close) * ownership.balance;
      this.total += ownership['ltp_value'];
    }
    this.dataSource = new MatTableDataSource(this.records);
    this.isHandset$.subscribe(x => {
      if (x) {
        this.isSmall = true;
        this.displayedColumns = ['symbol', 'previous_close', 'stock_close', 'balance', 'ltp_value'];
      }
    });

    this.isTablet$.subscribe(x => {
      if (x) {
        this.isSmall = true;
        this.displayedColumns = ['symbol', 'previous_close', 'stock_close', 'balance', 'ltp_value'];
      }
    });

  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  getStatus(prev: string, latest: string): string {
    if ((parseFloat(prev)) > parseFloat(latest)) {
      return 'loss';
    } else if ((parseFloat(prev)) < parseFloat(latest)) {
      return 'profit';
    } else {
      return 'normal';
    }
  }

  getDiffData(prev: string, lat: string, balance: number) {
    const pv = parseFloat(prev);
    const lt = parseFloat(lat);
    if (pv > lt) {
      return `- ${(pv - lt) * balance}`;
    } else if (pv < lt) {

      return `+ ${(lt - pv) * balance}`;
    } else {
      return '';
    }
  }


}

