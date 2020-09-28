import { Component, OnInit, Inject } from '@angular/core';
import { NivelesModel } from '../model/niveles-model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA, MatDialogConfig, MatDialog } from '@angular/material';
import { NivelesService } from '../service/niveles.service';
import { NIVELES_CONSTANTS } from '../model/niveles-constants';
import { Menu } from 'app/shared/menu-items/menu-items';
import { UtilitiesService } from 'app/admin/shared/services/utilities.service';
import { GeneralConfirmComponent } from 'app/admin/shared/components/general-confirm/general-confirm.component';
import { NivelModel } from 'app/admin/nivel/models/nivel-model';

@Component({
  selector: 'app-niveles-edit',
  templateUrl: './niveles-edit.component.html',
  styleUrls: ['./niveles-edit.component.css']
})
export class NivelesEditComponent implements OnInit {
  niveles: NivelesModel = new NivelesModel();
  form: FormGroup;
  submitted = false;
  constants = NIVELES_CONSTANTS;
  clone = {};
  disableSubmit = false;
  nivelesList: NivelModel[] = [];
  nivelesListFiltered: NivelModel[] = this.nivelesList;

  //public nivelesListFiltered = this.nivelesList.slice();

  constructor(private dialogRef: MatDialogRef<NivelesEditComponent>,
    private formBuilder: FormBuilder,
    private servicio: NivelesService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private utilitiesService: UtilitiesService,
    @Inject(MAT_DIALOG_DATA) data: any) {
      this.niveles = data.itemData;
      this.nivelesList = data.nivelesList;
      this.nivelesListFiltered = this.nivelesList.slice();
    }

  ngOnInit(): void {
    if(this.niveles.id > 0) {
      this.clone = JSON.parse(JSON.stringify(this.niveles));
    }
    this.initForm();
  }

  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  initForm() {
   this.form = this.formBuilder.group({
    'id': [this.niveles.id, null],
    'activo': [this.niveles.activo, Validators.compose([Validators.required])],
    'nombre': [this.niveles.nombre, Validators.compose([Validators.required, Validators.maxLength(30)])],
    'grupo': [this.niveles.grupo, null],
   });
  }

  onSubmit() {
    this.submitted = true;
    // se actualizan las listas con el model
    this.niveles = this.form.value;
    // this.form.value.permiso = this.menu.permiso;
    // this.form.value.parent = this.menu.parent;
    if (this.form.valid === true) {
      // this.enviada = true;
      // this.disabledBtn_Login = true;
      this.save();
    } else {
      this.utilitiesService.formWarningMessage(this.snackBar);
    }
  }

  save() {
    //this.niveles.dificultad = Number(this.niveles.dificultad);
    this.disableSubmit = true;
    if (this.niveles.id === 0) {
      this.servicio.create(this.form.value).subscribe(
        data => {
          this.disableSubmit = false;
          this.dialogRef.close(this.form.value);
        },
        error => {
          this.disableSubmit = false;
          this.utilitiesService.formErrorMessages(error, this.form, this.snackBar);
        }
      );
    }
    this.servicio.update(this.form.value).subscribe(
      data => {
        this.dialogRef.close(this.form.value);
      },
      error => {
        this.disableSubmit = false;
        this.utilitiesService.formErrorMessages(error, this.form, this.snackBar);
      }
    );
  }


  close() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'custom-modalbox';
    dialogConfig.width = '30%';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    const dialogRef = this.dialog.open(GeneralConfirmComponent, dialogConfig);

    dialogRef.beforeClosed().subscribe((val: any) => {
      if (val === 1) {
        Object.assign(this.niveles, this.clone);
        this.dialogRef.close();
      }
    });
  }

}
