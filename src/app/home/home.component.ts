import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { IApplicationUser } from '../models/application-user';
import { AuthService } from '../services/auth.service';
import { PartnerService } from '../services/partner.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  accessToken: any;
  refreshToken: any;
  usr$: Observable<IApplicationUser>;
  partners: any[] = [];
  total = 0;
  prevTotal = 0;
  diff = '';
  formatter = new Intl.NumberFormat('hi', {
    style: 'currency',
    currency: 'NPR',
  });
  interval: any;
  constructor(
    private readonly partnerService: PartnerService,
    private readonly authService: AuthService) {
    this.usr$ = authService.user$;
  }

  ngOnInit(): void {
    this.refreshData(true);
    this.interval = setInterval(() => {
      this.refreshData();
    }, 10000);
    this.accessToken = localStorage.getItem('access_token');
    this.refreshToken = localStorage.getItem('refresh_token');
  }

  refreshData(init = false): void {
    this.partnerService.getPartners(init).subscribe(data => {
      this.total = 0;
      this.prevTotal = 0;
      for (const item of data) {
        for (const ownership of item.partner.stock_ownerships) {
          const recs = [];
          for (const rec of item.records) {
            if (ownership.company.symbol === rec.company_symbol) {
              recs.push(rec);
            }
          }
          ownership['records'] = recs;
        }

        for (const ownership of item.partner.stock_ownerships) {
          this.total += parseFloat(ownership.records[0].stock_close) * ownership.balance;
          this.prevTotal += parseFloat(ownership.records[0].previous_close) * ownership.balance;
        }


      }
      this.partners = data;

      this.updateTotalDiff();

    });
  }

  updateTotalDiff(): void {
    const formatter = new Intl.NumberFormat('hi', {
      style: 'currency',
      currency: 'NPR',
    });

    this.diff =
      this.total > this.prevTotal ?
        `+ ${formatter.format(this.total - this.prevTotal)}`
        : `- ${formatter.format(this.prevTotal - this.total)}`;
  }

}