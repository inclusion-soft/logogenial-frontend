import { Component, OnInit, Inject } from '@angular/core';
import { GrupoNivelTemaModel } from '../model/grupo-nivel-tema-model';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA, MatDialogConfig, MatDialog } from '@angular/material';
import { GrupoNivelTemaService } from '../service/grupo-nivel-tema.service';
import { GRUPO_NIVELTEMA_CONSTANTS } from '../model/grupo-nivel-tema-constant';
import { UtilitiesService } from 'app/admin/shared/services/utilities.service';
import { GeneralConfirmComponent } from 'app/admin/shared/components/general-confirm/general-confirm.component';
import { NivelModel } from 'app/admin/nivel/models/nivel-model';
import { TemaModel } from 'app/admin/tema/models/tema-model';

@Component({
  selector: 'app-grupo-nivel-tema-edit',
  templateUrl: './grupo-nivel-tema-edit.component.html',
  styleUrls: ['./grupo-nivel-tema-edit.component.css']
})
export class GrupoNivelTemaEditComponent implements OnInit {
  model: GrupoNivelTemaModel = new GrupoNivelTemaModel();
  form: FormGroup;
  submitted = false;
  constants = GRUPO_NIVELTEMA_CONSTANTS;
  clone = {};
  disableSubmit = false;
  temaList: TemaModel[] = [];
  temaListFiltered: TemaModel[] = this.temaList;
  // selected:any;

  // public options2 = [
  //   {"id": 1, "name": "option1"},
  //   {"id": 2, "name": "option2"}
  // ]
  // selected2 :any;
  //public grupo-nivelCtrl: FormControl = new FormControl();

  constructor(private dialogRef: MatDialogRef<GrupoNivelTemaEditComponent>,
    private formBuilder: FormBuilder,
    private servicio: GrupoNivelTemaService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private utilitiesService: UtilitiesService,
    @Inject(MAT_DIALOG_DATA) data: any) {
      this.model = data.itemData;
      this.temaList = data.temaList;
      this.temaListFiltered = this.temaList.slice();
    }

  ngOnInit(): void {
    // this.selected2 = this.options2[1].id;
    if (this.model.id > 0) {
      this.clone = JSON.parse(JSON.stringify(this.model));
    }
    this.initForm();
    if (this.model.id > 0) {
      const formValue = this.form as any;
      formValue.value = this.model;
      const toSelect = this.temaList.find(c => c.id === this.model.tema.id);
      this.form.get('tema')!.setValue(toSelect);
    }
  }

  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  initForm() {
   this.form = this.formBuilder.group({
    'id': [this.model.id, null],
    'activo': [this.model.activo, Validators.compose([Validators.required])],
    'tema': [null, Validators.compose([Validators.required])],
    'grupoNivel': [this.model.grupoNivel, null],
   });
  }

  onSubmit() {
    this.submitted = true;
    // se actualizan las listas con el model
    this.markFormGroupTouched(this.form);
    this.model = this.form.value;
    if (this.form.valid === true) {
      // this.enviada = true;
      this.save();
    } else {
      this.utilitiesService.formWarningMessage(this.snackBar);
    }
  }

  save() {
    this.disableSubmit = true;
    if (this.model.id === 0) {
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

  private markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach((control: FormGroup) => {
      control.markAsTouched();
      control.updateValueAndValidity();
      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
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
        Object.assign(this.model, this.clone);
        this.dialogRef.close();
      }
    });
  }

}
