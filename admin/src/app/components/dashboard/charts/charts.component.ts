import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss']
})
export class ChartsComponent implements OnInit {
  @Input() data: any;

  single: any[];
  view: any = [700, 400]

  showXAxis: boolean = true;
  showYAxis: boolean = true;
  gradient: boolean = false;
  showLegend: boolean = true;
  showXAxisLabel: boolean = true;
  yAxisLabel: string = 'Answers';
  showYAxisLabel: boolean = true;
  xAxisLabel: string = 'percent';

  colorScheme: any = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  title: any;
  totUser: number;
  chartData: any =  [];
  constructor() {
    // Object.assign(this, { this.data });




  }

  ngOnInit(): void {
    this.title = this.data.question;
    
    this.data.options.forEach((dt, idx) => {
      const p = (dt.count * 100) / this.data.count;
      this.chartData.push({
        "name": dt.answer,
        "value": (Math.round((p + Number.EPSILON) * 100) / 100)
      });
    });
    Object.assign(this,  this.chartData );

  }


  onSelect(data): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }


}
