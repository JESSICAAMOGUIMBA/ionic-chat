// home.page.ts
import { Component, ViewChild } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { NavController } from '@ionic/angular';

interface StudentData {
  Name: string;
  Message: string;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  @ViewChild('content') content: any;
  studentList = [];
  studentData: StudentData;
  studentForm: FormGroup;

  constructor(
    private firebaseService: FirebaseService,
    public fb: FormBuilder,
    public navCtrl: NavController
  ) {
    this.studentData = {} as StudentData;
  }

  ngOnInit() {
    this.firebaseService.read_students().subscribe(data => {
      console.log("Al inicio", this.studentList);
      this.studentList = data.map(e => {
        return {
          id: e.payload.doc.id,
          isEdit: false,
          Name: e.payload.doc.data()['Name'],
          Message: e.payload.doc.data()['Message'],
        };
      })
      console.log("Al finalizar inicio", this.studentList);



    });
  }

  CreateRecord() {
    console.log("Que se va a enviar", this.studentData)
    this.firebaseService.create_student(this.studentData)
      .then(resp => {
        this.studentData.Message = null;
      })
      .catch(error => {
        console.log(error);
      });
    var poss = document.getElementById("final-scroll").offsetTop;
    this.content.scrollTo(0, poss, 300);
  }

  RemoveRecord(rowID) {
    this.firebaseService.delete_student(rowID);
  }

  EditRecord(record) {
    record.isEdit = true;
    record.EditName = record.Name;
    record.EditAge = record.Age;
    record.EditAddress = record.Address;
  }

  UpdateRecord(recordRow) {
    let record = {};
    record['Name'] = recordRow.EditName;
    record['Age'] = recordRow.EditAge;
    record['Address'] = recordRow.EditAddress;
    this.firebaseService.update_student(recordRow.id, record);
    recordRow.isEdit = false;
  }

}
