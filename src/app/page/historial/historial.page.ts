import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { SessionService } from 'src/app/services/session.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import * as XLSX from 'xlsx';

interface ScanResult {
  asignatura: string;
  seccion: string;
  fecha: string;
}

@Component({
  selector: 'app-historial',
  templateUrl: './historial.page.html',
  styleUrls: ['./historial.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class HistorialPage implements OnInit {

  results: ScanResult[] = [];
  groupedResults: { [key: string]: ScanResult[] } = {};
  groupedKeys: string[] = [];
  username: string;
  asignaturas: { [key: string]: string } = {
    'PROG101': 'Programación',
    'BD202': 'Bases de Datos',
    'RED303': 'Redes de Computadoras',
    'SO404': 'Sistemas Operativos',
    'IA505': 'Inteligencia Artificial'
  };

  constructor(
    private localStorageService: LocalStorageService,
    private sessionService: SessionService,
    private router: Router,
    private alertCtrl: AlertController
  ) {
    this.username = this.sessionService.getUserSession() ?? '';
  }

  ngOnInit() {
    this.loadAttendance();
  }

  ionViewWillEnter() {
    this.loadAttendance();
  }

  loadAttendance() {
    this.results = this.localStorageService.getItem(`attendance_${this.username}`) ?? [];
    this.groupResults();
  }

  groupResults() {
    this.groupedResults = this.results.reduce((acc: { [key: string]: ScanResult[] }, result) => {
      const key = result.asignatura.split('/')[0];
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(result);
      return acc;
    }, {});
    this.groupedKeys = Object.keys(this.asignaturas);
  }

  async showAttendance(asignatura: string) {
    const attendance = this.groupedResults[asignatura] || [];
    let message = '';

    if (attendance.length > 0) {
      message = attendance.map(scan => `Seccion: ${scan.seccion} / ${scan.fecha}`).join('<br>');
    } else {
      message = 'No hay asistencias registradas.';
    }

    const alert = await this.alertCtrl.create({
      header: this.asignaturas[asignatura] || asignatura,
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }

  navigateTo(route: string) {
    if (this.router.url !== route) {
      this.router.navigate([route]);
    }
  }

  exportToExcel() {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.results);
    const workbook: XLSX.WorkBook = { Sheets: { 'Asistencias': worksheet }, SheetNames: ['Asistencias'] };
    XLSX.writeFile(workbook, 'Asistencias.xlsx');
  }
}