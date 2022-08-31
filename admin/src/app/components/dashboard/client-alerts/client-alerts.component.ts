import { Component, OnInit } from '@angular/core';
import { CrudService } from '@app/shared/crud.service';
import { Student } from '@app/shared/student';
import { Alert } from '@app/shared/alert';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup } from '@angular/forms';
import { Utils } from '@app/helpers/utils';

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

    let val = this.range.value;
    let start = new Date(val.start);
    let end = new Date(val.end);

    console.log(start.valueOf(), end.valueOf());
    if (0 > start.valueOf() && 0 > end.valueOf()) {
      ///limit by date range
      let user = this.users[0];
      const dt = user.data[0];
      console.log("here data", dt);
      const de = new Date(dt.init);
      console.log(`de`, new Utils().convertedDate(new Date(de), 'dd-MMM-yyyy h:mm:ss a'));
    }
    else {
      ///not limit
      let collectData = [];

      let user = this.users[0];
      console.log("here data example", user.data[0]);

      let curretDate = 0;
      let data = [];
      for (const d of user.data) {
        if (0 === data.length) {
          data.push(d)
        }
        else {
          let found = data.find((f: any) => f.init === d.init);
          if (undefined === found) {
            data.push(d);
          }
        }
      }

      let nine = [];
      let twelve = [];
      let fifteen = [];
      let eighteen = [];
      let twentyone = [];


      // console.log("last data", data);
      let dayNumber = 1;
      const first = new Date(data[0].init);;
      curretDate = first.getDate();
      for (let dt of data) {

        const de = new Date(dt.init);
        if (curretDate !== de.getDate()) {
          dayNumber += 1;
        }
        dt.dayNumber = dayNumber;
        dt.nine = {};
        dt.twelve = {};
        dt.fifteen = {};
        dt.eighteen = {};
        dt.twentyone = {};
        
        
        console.log(`de ${dt.init}`, new Utils().convertedDate(new Date(de), 'dd-MMM-yyyy h:mm:ss a'));


      }

    }

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
