import { DatePipe } from "@angular/common";

export class Utils {
    public convertedDate(event_date, dformat) {

        try {
          let d = new Date(event_date);
          // let d2 = new Date(event_date * 1000); ///unix time
          let timeCorrection = d.getTimezoneOffset() - new Date().getTimezoneOffset();// offset;
          d.setMinutes(d.getMinutes() + timeCorrection);
          const pipe = new DatePipe('en-US');
          // return pipe.transform(d, 'MM/dd/yyyy, h:mm:ss a');
          return pipe.transform(d, dformat);
        }
        catch (e){
          console.log(`${event_date} ${dformat}`);
          console.error(`${event_date} ${dformat}`);
          return `${event_date} ${dformat}`;
        }
    
    
      }
}
