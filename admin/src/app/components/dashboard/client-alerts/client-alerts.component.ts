import { Component, OnInit } from '@angular/core';
import { CrudService } from '@app/shared/crud.service';
import { Student } from '@app/shared/student';
import { Alert } from '@app/shared/alert';
import { ToastrService } from 'ngx-toastr';

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
  constructor(
    public crudApi: CrudService,
    public toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.loadAlerts();
    // console.log("Data", data);
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
      this.Alerts.forEach((dt: any, idx: any) => {
        dt.listQuestions.forEach((dt2: any, idx2: any) => {

          if (lsQuestions.length === 0) {
            let lsAnswers = [];
            if (Array.isArray(dt2.answer)) {

              dt2.answer.forEach((dtAnswer: any, idxAnswer: any) => {
                lsAnswers.push({
                  "answer": dtAnswer,
                  "count": 1
                });

              });

            }
            else {
              dt2.option.forEach((opt: any, idx3: any) => {
                lsAnswers.push({
                  "answer": opt,
                  "count": opt === dt2.answer ? 1 : 0
                });

              });

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
              if (Array.isArray(single.answer)) {
                single.answer.forEach((a: any, i: any) => {
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
              dt2.option.forEach((o: any, i: any) => {
                lsAnswers.push({
                  "answer": o,
                  "count": 1
                })
              });
              lsQuestions.push({
                "question": dt2.question,
                "answer": dt2.answer,
                "count": 1,
                "options": lsAnswers
              });
            }
          }

        });

      });

      console.log("q and a", lsQuestions);




    });
  }

}
