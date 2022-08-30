import { Component, OnInit } from '@angular/core';
import { CrudService } from '@app/shared/crud.service';
import { Student } from '@app/shared/student';
import { Alert } from '@app/shared/alert';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-client-alerts',
  templateUrl: './client-alerts.component.html',
  styleUrls: ['./client-alerts.component.scss']
})
export class ClientAlertsComponent implements OnInit {
  p: number = 1;

  hideWhenNoStudent: boolean = false;
  noData: boolean = false;
  preLoader: boolean = true;
  Alerts: any = [];
  users: any = [];
  chartData: any;
  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });
  constructor(
    public crudApi: CrudService,
    public toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.loadAlerts();
    // console.log("Data", data);
  }

  exportData() {

    let val  = this.range.value;
    let start = new Date(val.start);
    let end = new Date(val.end);

  
    console.log(start.valueOf(), end.valueOf());
  }
  checkAnswer(options: any) {

  }

  loadAlerts() {
    this.crudApi.GetClientAlerts().subscribe((res) => {
      this.Alerts = res.map((e) => {
        // console.log(e.payload.doc.data());
        let data = {
          id: e.payload.doc.id,
          ...(e.payload.doc.data() as Alert),
        }

        return data;
      });
      console.log("alert", this.Alerts);
      const key = 'userId';
      const arrayUniqueByKey = [...new Map(this.Alerts.map(item => [item[key], item])).values()];
      console.log("unique", arrayUniqueByKey);

      this.users = arrayUniqueByKey.map((m: any) => {
        return {
          "name": m.name,
          "userId": m.userId,
          "email": m.email,
          "data": this.Alerts.filter((f: any) => f.userId === m.userId)
        };
      });

      console.log("users", this.users);
      let totQuestions = this.Alerts.length;

      let lsQuestions = [];
      // this.Alerts.forEach((dt: any, idx: any) => {
      for (let dt of this.Alerts) {
        for (let dt2 of dt.listQuestions) {
          // dt.listQuestions.forEach((dt2: any, idx2: any) => {
          // console.log("ddddd", dt2?.answer?.includes('['));

          if (lsQuestions.length === 0) {
            let lsAnswers = [];

            if (dt2?.answer?.includes('[')) {

              // console.log("this is array", dt2.answer);

              JSON.parse(dt2.answer).forEach((dtAnswer: any, idxAnswer: any) => {
                lsAnswers.push({
                  "answer": dtAnswer,
                  "count": 1
                });

              });

            }
            else {
              // console.log("location 1", dt2.option);
              for (let opt of dt2?.option) {
                lsAnswers.push({
                  "answer": opt,
                  "count": opt === dt2.answer ? 1 : 0
                });

              }

            }


            lsQuestions.push({
              "question": dt2.question,
              "answer": dt2.answer,
              "count": 1,
              "options": lsAnswers
            });
          }
          else {
            let single = lsQuestions.find((f: any) => f.question === dt2.question);
            if (undefined !== single) {
              single.count += 1;
              if (

                single.answer.includes('[')


              ) {
                // console.log("array ansewer", single.answer);
                let arrA = single.answer.replace("[", "").replace("]", "");
                let arrB = arrA.split(',');

                arrB.forEach((a: any, i: any) => {
                  let s = single.options.find((f: any) => f.answer === a);
                  if (undefined !== s) {
                    s.count += 1;
                  }
                });

              }
              else {
                let s = single.options.find((f: any) => f.answer === single.answer);
                if (undefined !== s) {
                  s.count += 1;

                }
              }
            }
            else {
              let lsAnswers = [];
              // console.log(dt2, typeof dt2.option);
              if (typeof dt2.option === 'string') { 

              for (let opt of dt2?.option) {
                // console.log(`type ${opt}`, typeof opt);
                lsAnswers.push({
                  "answer": opt,
                  "count": 1
                });
              }

              lsQuestions.push({
                "question": dt2.question,
                "answer": dt2.answer,
                "count": 1,
                "options": lsAnswers
              });
            }
          }
        }
      }
      // });
    }
      // });

      console.log("q and a", lsQuestions);
    this.chartData = lsQuestions;
  });
}




}
