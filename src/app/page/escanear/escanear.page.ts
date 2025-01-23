import { Component, OnInit } from '@angular/core';
import { CapacitorBarcodeScanner, CapacitorBarcodeScannerTypeHint } from '@capacitor/barcode-scanner';
import { ViewWillEnter, AlertController } from '@ionic/angular';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { SessionService } from 'src/app/services/session.service';
import { Router, ActivatedRoute } from '@angular/router';
import * as XLSX from 'xlsx';

interface ScanResult {
  asignatura: string;
  seccion: string;
  fecha: string;
  grabado?: boolean; 
}

@Component({
  selector: 'app-escanear',
  templateUrl: './escanear.page.html',
  styleUrls: ['./escanear.page.scss'],
  standalone: false,
})
export class EscanearPage implements OnInit, ViewWillEnter {

  result: ScanResult = { asignatura: '', seccion: '', fecha: '' };
  results: ScanResult[] = [];
  username: string;
  Attendanc: ScanResult[] = [];

  constructor(
    private localStorageService: LocalStorageService,
    private sessionService: SessionService,
    private alertCtrl: AlertController,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.username = this.sessionService.getUserSession() ?? '';
  }
  
  async scan() {
    const result = await CapacitorBarcodeScanner.scanBarcode({
      hint: CapacitorBarcodeScannerTypeHint.ALL
    });
    console.log('Scan result:', result);
    const [asignatura, seccion, fecha] = result.ScanResult.split('/');
    const currentDate = new Date();
    const [day, month, year] = fecha.split('-').map(Number);
    const scanDate = new Date(year, month - 1, day);

    if (scanDate.toDateString() !== currentDate.toDateString()) {
      const alert = await this.alertCtrl.create({
        header: 'Fecha incorrecta',
        message: 'La fecha del código escaneado no es la actual.',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    this.result = {
      asignatura,
      seccion,
      fecha,
      grabado: false
    };

    if (!this.results.some(r => r.asignatura === this.result.asignatura && r.seccion === this.result.seccion && r.fecha === this.result.fecha)) {
      this.results.push(this.result);
    }
  }

  async saveAttendance(scan: ScanResult) {
    if (!this.Attendanc.some(r => r.asignatura === scan.asignatura && r.seccion === scan.seccion && r.fecha === scan.fecha)) {
      this.Attendanc.push(scan);
      this.localStorageService.setItem(`attendance_${this.username}`, this.Attendanc);
      scan.grabado = true; // Eliminar del listado
      const alert = await this.alertCtrl.create({
        header: 'Guardado',
        message: 'El escaneo se ha guardado correctamente.',
        buttons: ['OK']
      });
      await alert.present();
    } else {
      const alert = await this.alertCtrl.create({
        header: 'Escaneo duplicado',
        message: 'El escaneo ya existe en la lista.',
        buttons: ['OK']
      });
      await alert.present();
    }
  }

  delete(scan: ScanResult) {
    this.results = this.results.filter(result => result !== scan);
    this.Attendanc = this.Attendanc.filter(result => result !== scan);
    this.localStorageService.setItem(`attendance_${this.username}`, this.Attendanc);
  }

  ngOnInit() {
  }

  ionViewWillEnter(): void {
    this.results = this.localStorageService.getItem(`attendance_${this.username}`) ?? [];
    this.Attendanc = this.localStorageService.getItem(`attendance_${this.username}`) ?? [];
  }

  navigateTo(route: string) {
    if (this.router.url !== route) {
      this.router.navigate([route]);
    }
  }

  exportToExcel() {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.Attendanc);
    const workbook: XLSX.WorkBook = { Sheets: { 'Asistencias': worksheet }, SheetNames: ['Asistencias'] };
    XLSX.writeFile(workbook, 'Asistencias.xlsx');
  }
}