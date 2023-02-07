import { Injectable } from '@angular/core';
import { Student } from '@app/shared/student';
import {
  AngularFireDatabase,
  AngularFireList,
  AngularFireObject,
} from '@angular/fire/compat/database';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Alert } from '@app/shared/alert';

@Injectable({
  providedIn: 'root',
})
export class CrudService {
  // Inject Firestore service

  studentsRef: AngularFireList<any>;
  studentRef: AngularFireObject<any>;

  alertRef: AngularFireObject<any>;


  constructor(private db: AngularFireDatabase, public afs: AngularFirestore) { }
  // Create Student
  AddStudent(student: Student) {
    this.afs.collection("students-list")
      .add(
        {
          firstName: student.firstName,
          lastName: student.lastName,
          email: student.email,
          mobileNumber: student.mobileNumber,
        }
      );
    /////FIREBASE
    // this.studentsRef.push({
    //   firstName: student.firstName,
    //   lastName: student.lastName,
    //   email: student.email,
    //   mobileNumber: student.mobileNumber,
    // });
  }
  // Fetch Single Student Object
  GetStudent(id: string) {
    this.studentRef = this.db.object('students-list/' + id);
    return this.studentRef;
  }
  // Fetch Students List
  GetStudentsList() {
    this.studentsRef = this.db.list('students-list');
    return this.studentsRef;
  }
  // Update Student Object
  UpdateStudent(student: Student) {
    this.studentRef.update({
      firstName: student.firstName,
      lastName: student.lastName,
      email: student.email,
      mobileNumber: student.mobileNumber,
    });
  }
  // Delete Student Object
  DeleteStudent(id: string) {
    this.studentRef = this.db.object('students-list/' + id);
    this.studentRef.remove();
  }

  GetClientAlerts() {

    return this.afs.collection("alerts",
      ref => ref.orderBy('timestamp')).snapshotChanges();

  }
  GetClientAlertsFilterDate(start: number, end: number) {


    return this.afs.collection("alerts",
      ref => ref.where("timestamp", ">", start).where("timestamp", "<=", end).orderBy('timestamp')).snapshotChanges();

  }

  MoveAlertsToAlert2() {
    this.afs.collection("alerts",
      ref => ref.orderBy('timestamp')).snapshotChanges().forEach((doc)=>{
        doc.map((e)=>{
          let data = {
            id: e.payload.doc.id,
            ...(e.payload.doc.data() as Alert),
          }

          // console.log("Data", data);

          this.afs.collection("alerts2").add(data).then(()=>console.log("done"));



        });
      })
  }
}
