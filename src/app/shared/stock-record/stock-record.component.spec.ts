import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockRecordComponent } from './stock-record.component';

describe('StockRecordComponent', () => {
  let component: StockRecordComponent;
  let fixture: ComponentFixture<StockRecordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockRecordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StockRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
