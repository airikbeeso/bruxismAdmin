import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timezone'
})
export class TimezonePipe implements PipeTransform {


  transform(value: number): any {
    // console.log("timezone", value);
    if(value !== undefined){
      return this.convertedDate(value,'');
    }
    else
      return null;
  }

  convertedDate(event_date, offset) {
    let d = new Date(event_date);
    // let d2 = new Date(event_date * 1000); ///unix time
    let timeCorrection = d.getTimezoneOffset() - new Date().getTimezoneOffset();// offset;
    d.setMinutes(d.getMinutes() + timeCorrection);
    return d;

  }

}
