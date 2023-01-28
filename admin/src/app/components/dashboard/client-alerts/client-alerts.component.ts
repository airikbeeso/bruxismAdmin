import { Component, OnInit } from '@angular/core';
import { CrudService } from '@app/shared/crud.service';
import { Student } from '@app/shared/student';
import { Alert } from '@app/shared/alert';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup } from '@angular/forms';
import { Utils } from '@app/helpers/utils';
import { ngxCsv } from 'ngx-csv/ngx-csv';

@Component({
  selector: 'app-client-alerts',
  templateUrl: './client-alerts.component.html',
  styleUrls: ['./client-alerts.component.scss']
})
export class ClientAlertsComponent implements OnInit {
  p: number = 1;
  printCol = [];
  dtTbl = [];
  hideWhenNoStudent: boolean = false;
  noData: boolean = false;
  preLoader: boolean = true;
  Alerts: any = [];
  users: any = [];
  chartData: any;
  collectQuestions: string[] = [];
  value: string = "";
  tbl_option: any;
  showTbl: boolean = false;

  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });
  constructor(
    public crudApi: CrudService,
    public toastr: ToastrService
  ) { }

  ngOnInit(): void {
    // this.loadAlerts();
    // console.log("Data", data);

  }
  exportTableToCSV() {
    var csv = [];
    var rows = document.querySelectorAll("table tbody tr,table thead tr");

    for (var i = 0; i < rows.length; i++) {
      var row = [], cols = rows[i].querySelectorAll("td,th");

      for (var j = 0; j < cols.length; j++)
        row.push(cols[j].innerHTML);

      csv.push(row.join(","));
    }

    this.value = csv.join("\n");
    // Download CSV file
  }

  tableToCSV() {

    // Variable to store the final csv data
    var csv_data = [];

    // Get each row data
    var rows = document.getElementsByTagName('tr');
    for (var i = 0; i < rows.length; i++) {

      // Get each column data
      var cols = rows[i].querySelectorAll('td,th');

      // Stores each csv row data
      var csvrow = [];
      for (var j = 0; j < cols.length; j++) {

        // Get the text data of each cell of
        // a row and push it to csvrow
        csvrow.push(cols[j].innerHTML);
      }

      // Combine each column value with comma
      csv_data.push(csvrow.join(","));
    }
    // combine each row data with new line character
    this.value = csv_data.join('\n');

    /* We will use this function later to download
    the data in a csv file downloadCSVFile(csv_data);
    */
  }
  exportData() {

    this.showTbl = false;
    this.tbl_option = {};


    let val = this.range.value;

    let start = new Date(val.start);
    let end = new Date(val.end);
    console.log(start.getMonth());
    let startCol = 0;
    let endCol = 0;
    const modes = [9, 12, 15, 18, 21];
    let collectData = [];
    let collectData2: any[] = [];
    console.log(start.valueOf(), end.valueOf());
    const st: number = start.valueOf();
    const ed: number = end.valueOf();
    let start_day = 0;
    let end_day = 0;
    if (0 > start.valueOf() && 0 > end.valueOf()) {
      ///limit by date range
      // let user = this.users[0];
      // const dt = user.data[0];
      // console.log("here data", dt);
      // const de = new Date(dt.init);
      // console.log(`de`, new Utils().convertedDate(new Date(de), 'dd-MMM-yyyy h:mm:ss a'));
    }
    else {
      ///not limit




      this.loadAlertsFilterDate(start.valueOf(), end.valueOf()).then((d: any) => {

        for (let user of this.users) {
          // let user = this.users[0];
          // console.log("here data example", user.data[0]);


          let cDate = 0;
          let cMonth = 0;
          let cYear = 0;

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
          this.printCol = [];
          this.dtTbl = [];
          // let modes = [9, 12, 15, 18, 21];


          for (const m of modes) {
            // console.log("last data", data);
            let dayNumber = 1;
            const first = new Date(data[0].init);;
            cDate = first.getDate();
            // let fData =
            for (let dt of data.filter((f: any) => f.mode === m)) {
              ///
              const de = new Date(dt.init);
              if (cDate !== de.getDate()) {
                dayNumber += 1;
              }
              dt.dayNumber = dayNumber;
              dt.nine = {};
              dt.twelve = {};
              dt.fifteen = {};
              dt.eighteen = {};
              dt.twentyone = {};

              // const gid = `${user.email}-${de.getDate()}-${de.getMonth()}-${de.getFullYear()}-${dt.mode}`;
              var genId =
                `${de.getFullYear()}-${de.getMonth()}-${de.getDate()}-${dt.mode}-${user.userId}`;
              // console.log(`genid: ${genId}`);

              let context = {
                mode: dt.mode,
                day: dayNumber,
                email: user.email,
                name: user.name,
                userId: user.userId,
                date: de.getDate(),
                month: de.getMonth(),
                year: de.getFullYear(),
                id: genId,
                listQuestions: dt.listQuestions,
                timestamp: dt.timestamp
              }
              if (undefined === collectData.find((f: any) => f.id === genId)) {
                collectData.push(context);
              }
              // console.log("collectData", collectData);
              // console.log(`de ${dt.init}`, new Utils().convertedDate(new Date(de), 'dd-MMM-yyyy h:mm:ss a'));
            }

          }
        }
        //end this.user loop

        const start = collectData.sort((m: any, n: any) => m.day - n.day)[0];
        const end = collectData.sort((m: any, n: any) => n.day - m.day)[0];
        console.log(`start  ${start?.day} end ${end?.day}`);
        start_day = start?.day;
        end_day = end?.day;

        for (let user of this.users) {
          for (const m of modes) {
            for (var i = start.day; i <= end.day; i++) {
              const one = collectData.filter((f: any) => f.email === user.email && f.mode === m && f.day === i);
              if (undefined !== one && one.length > 0) {

                const gid2 = `${user.email}-${one[0].date}-${one[0].month}-${one[0].year}-${one[0].year}-${one[0].mode}`;
                if (undefined === collectData2.find((f: any) => f.id === gid2)) {
                  collectData2.push(one[0]);
                  if (this.collectQuestions.length === 0) {
                    for (let q of one[0].listQuestions) {
                      this.collectQuestions.push(q.question);
                    }
                  }
                  else {
                    for (let q of one[0].listQuestions) {
                      if (undefined === this.collectQuestions.find((f) => f === q.question)) {
                        this.collectQuestions.push(q.question);
                      }
                    }
                  }
                }
              }

            }
          }
        }

        console.log(`final`, collectData2);
        let header = [];
        for (let i = 0; i < (collectData2.length * 5); i++) {
          if (0 === i) {
            header.push("No");
          }
          else if (1 === i) {
            header.push("Name");
          }
          else {
            header.push(" ");
          }
        }
        let header2 = [];
        let day = 1;
        for (let i = 0; i < (collectData2.length * 5); i++) {
          if (0 === i) {
            header2.push(" ");
          }
          else if (1 === i) {
            header2.push(" ");
          }
          else {

            if (i === 13) {
              header2.push(`Hari ${day}`); day++;

            }
            else if (i > 13) {
              if (i % 15 === 0) {
                header2.push(`Hari ${day}`); day++;

              }
              else {
                header2.push(" ");

              }
            }


          }
        }


        let html = header.join(",") + "\n";
        html += header2.join(",") + "\n";
        let colData = [];

        for (let col of collectData2) {


        }

        if (collectData2.length > 0) {


          console.log(`final`, start_day, end_day);
          let columns = [];


          for (let i = start_day; i <= end_day; i++) {
            for (let m of modes) {
              for (let col of collectData2.filter((f: any) => f?.day === i && f?.mode === m)) {

                // let start = new Date(val.start);
                // let end = new Date(val.end);
                // if (col.date >= start.getDate() && col.month >= start.getMonth() && col.year >= start.getFullYear()
                //   && col.date <= end.getDate() && col.month <= end.getMonth() && col.year <= end.getFullYear())
                this.printCol.push(col);

                this.dtTbl.push({
                  email: col.email,
                  name: col.name,
                  q1: col.listQuestions[0]?.answer,
                  q2: col.listQuestions[1]?.answer,
                  q3: col.listQuestions[2]?.answer,
                  q4: col.listQuestions[3]?.answer,
                  q5: col.listQuestions[4]?.answer,
                  day: col.day,
                  mode: col.mode,
                  date: this.convertToDateString(col.timestamp)

                });

              }
            }
          }
          // console.log("printing", this.printCol);
          // console.log("column question", this.collectQuestions);
          // this.exportTableToCSV()

          /*
           let context = {
                mode: dt.mode,
                day: dayNumber,
                email: user.email,
                name: user.name,
                userId: user.userId,
                date: de.getDate(),
                month: de.getMonth(),
                year: de.getFullYear(),
                id: genId,
                listQuestions: dt.listQuestions,
                timestamp: dt.timestamp
              };

                "draw": 0,
  "recordsTotal": 258,
  "recordsFiltered": 258,
  "data": [
    {

        email: col.email,
                  name: col.name,
                  q1: col.listQuestions[0]?.answer,
                  q2: col.listQuestions[1]?.answer,
                  q3: col.listQuestions[2]?.answer,
                  q4: col.listQuestions[3]?.answer,
                  q5: col.listQuestions[4]?.answer,
                  day: col.day,
                  mode: col.mode,
                  date: this.convertToDateString(col.timestamp)

          */

          this.tbl_option = {
            // ajax: {
            //   draw: 0,
            //   recordsTotal: this.printCol.length,
            //   recordsFiltered: this.printCol.length,
            //   data: this.dtTbl
            // },
            pagingType: 'full_numbers',
            // pageLength: 2,
            // serverSide: true,
            // processing: true,
            draw: 0,
            recordsTotal: this.printCol.length,
            recordsFiltered: this.printCol.length,
            data: this.dtTbl,
            columns: [
              {
                title: "Email",
                data: "email"
              },
              {
                title: "Name",
                data: "name"
              },

              {
                title: "Q1",
                data: "q1"
              },
              {
                title: "Q2",
                data: "q2"
              }, {
                title: "Q3",
                data: "q3"
              }, {
                title: "Q4",
                data: "q4"
              }, {
                title: "Q5",
                data: "q5"
              }, {
                title: "Day",
                data: "day"
              }, {
                title: "Mode",
                data: "mode"
              },

              {
                title: "Date",
                data: "date"
              }


            ]

          };
          this.showTbl = true;

          var options = {
            fieldSeparator: ',',
            quoteStrings: '"',
            decimalseparator: '.',
            showLabels: true,
            showTitle: true,
            title: 'Bruxism',
            useBom: true,
            noDownload: true,
            headers: ["Email", "Name", "Q1", "Q2", "Q3", "Q4", "Q5", "Q6", "Day", "Hour", "Date"]
          };
          let csvData = [];

          for (let col of this.printCol) {
            let l = col.listQuestions.length;
            let cl = [];
            this.collectQuestions.forEach((dt, idx) => {
              let cd = col.listQuestions.find((f) => f.question === dt)
              if (undefined !== cd) {
                cl.push({
                  idx: idx,
                  a: cd.answer
                });
              }
            });
            console.log("u", cl.find((f2) => f2.idx === 5));

            csvData.push({
              email: col.email,
              name: col.name,
              q1: undefined !== cl.find((f2) => f2.idx === 0) ? cl.find((f2) => f2.idx === 0).a : "",
              q2: undefined !== cl.find((f2) => f2.idx === 1) ? cl.find((f2) => f2.idx === 1).a : "",
              q3: undefined !== cl.find((f2) => f2.idx === 2) ? cl.find((f2) => f2.idx === 2).a : "",
              q4: undefined !== cl.find((f2) => f2.idx === 3) ? cl.find((f2) => f2.idx === 3).a : "",
              q5: undefined !== cl.find((f2) => f2.idx === 4) ? cl.find((f2) => f2.idx === 4).a : "",
              q6: undefined !== cl.find((f2) => f2.idx === 5) ? cl.find((f2) => f2.idx === 5).a : "",
              day: col.day,
              hour: col.mode,
              date: `${col.year}-${col.month}-${col.date}`
            });
          }
          let data: ngxCsv = new ngxCsv(csvData, "bruxismData.csv", options);
          this.value = data.getCsv();
        }


      });





    }





    // setTimeout(() => this.tableToCSV(), 1000);

  }


  checkAnswer(options: any) {

  }
  jsonStringify(value: any) {
    return JSON.stringify(value);
  }
  getFormattedDate(date: Date) {
    var year = date.getFullYear();

    var month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;

    var day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;

    return year + '-' + month + '-' + day;
    // return month + '/' + day + '/' + year;

  }
  convertToDateString(value: number) {
    const nd = new Date(value);

    return `${this.getFormattedDate(nd)} <br/>

      ${nd.toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
      `;
  }

  loadAlertsFilterDate(st: number, ed: number) {
    // console.log(`start ${st} to ${ed}`);
    return new Promise((resolve, reject) => {

      this.crudApi.GetClientAlertsFilterDate(st, ed).subscribe((res) => {

        this.Alerts = res.map((e) => {
          console.log(e.payload.doc.data());
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
        resolve(this.Alerts);
      });
    });

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


