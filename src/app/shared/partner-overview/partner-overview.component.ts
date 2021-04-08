import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-partner-overview',
  templateUrl: './partner-overview.component.html',
  styleUrls: ['./partner-overview.component.scss']
})
export class PartnerOverviewComponent implements OnInit {

  @Input() partner: any;
  @Input() records: any;
  formatter = new Intl.NumberFormat('hi', {
    style: 'currency',
    currency: 'NPR',
  });
  total = 0;
  constructor() { }

  ngOnInit(): void {
    for (const ownership of this.records) {
      ownership['ltp_value'] = parseFloat(ownership.records[0].stock_close) * ownership.balance;
      this.total += ownership['ltp_value'];
    }
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

