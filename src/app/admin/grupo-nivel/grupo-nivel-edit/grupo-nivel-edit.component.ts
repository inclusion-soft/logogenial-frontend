
import { Component, OnInit, Inject } from '@angular/core';
import { GrupoNivelModel } from '../model/grupo-nivel-model';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA, MatDialogConfig, MatDialog } from '@angular/material';
import { GrupoNivelService } from '../service/grupo-nivel.service';
import { GRUPO_NIVEL_CONSTANTS } from '../model/grupo-nivel-constant';
import { UtilitiesService } from 'app/admin/shared/services/utilities.service';
import { GeneralConfirmComponent } from 'app/admin/shared/components/general-confirm/general-confirm.component';
import { NivelModel } from 'app/admin/nivel/models/nivel-model';

@Component({
  selector: 'app-grupo-nivel-edit',
  templateUrl: './grupo-nivel-edit.component.html',
  styleUrls: ['./grupo-nivel-edit.component.css']
})
export class GrupoNivelEditComponent implements OnInit {
  grupoNivel: GrupoNivelModel = new GrupoNivelModel();
  form: FormGroup;
  submitted = false;
  constants = GRUPO_NIVEL_CONSTANTS;
  clone = {};
  disableSubmit = false;
  grupoNivelList: NivelModel[] = [];
  grupoNivelListFiltered: NivelModel[] = this.grupoNivelList;
  // selected:any;

  // public options2 = [
  //   {"id": 1, "name": "option1"},
  //   {"id": 2, "name": "option2"}
  // ]
  // selected2 :any;
  //public grupo-nivelCtrl: FormControl = new FormControl();

  constructor(private dialogRef: MatDialogRef<GrupoNivelEditComponent>,
    private formBuilder: FormBuilder,
    private servicio: GrupoNivelService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private utilitiesService: UtilitiesService,
    @Inject(MAT_DIALOG_DATA) data: any) {
      this.grupoNivel = data.itemData;
      this.grupoNivelList = data.grupoNivelList;
      this.grupoNivelListFiltered = this.grupoNivelList.slice();
    }

    // onAfterViewInit(): void {
    //   // setTimeout(function(_this:any){
    //   // },300,this);
    // }

  ngOnInit(): void {
    // this.selected2 = this.options2[1].id;
    if(this.grupoNivel.id > 0) {
      this.clone = JSON.parse(JSON.stringify(this.grupoNivel));
    }
    this.initForm();
    if (this.grupoNivel.id > 0) {
      const formValue = this.form as any;
      formValue.value = this.grupoNivel;
      const toSelect = this.grupoNivelList.find(c => c.id === this.grupoNivel.nivel.id);
      this.form.get('nivel')!.setValue(toSelect);
    }
  }

  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  initForm() {
   this.form = this.formBuilder.group({
    'id': [this.grupoNivel.id, null],
    'activo': [this.grupoNivel.activo, Validators.compose([Validators.required])],
    'nivel': [null, Validators.compose([Validators.required])],
    'grupo': [this.grupoNivel.grupo, null],
   });

  }

  onSubmit() {
    this.submitted = true;
    // se actualizan las listas con el model
    this.markFormGroupTouched(this.form);
    this.grupoNivel = this.form.value;
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
    this.disableSubmit = true;
    if (this.grupoNivel.id === 0) {
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

  /**
   * Método encargado de marcar las validaciones erroneas en el formulario
   * @param anyForm Grupo del formulario q se esta procesando
   */
  // private markAndValidateAllInputs(anyForm: FormGroup) {
  //   // tslint:disable-next-line: forin
  //   try {
  //     // tslint:disable-next-line: forin
  //     for (const inner in anyForm.controls) {
  //       anyForm.get('xx').markAsTouched();
  //       anyForm.get(inner).updateValueAndValidity();
  //     }
  //   } catch (error) {

  //   }

  // }

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
        Object.assign(this.grupoNivel, this.clone);
        this.dialogRef.close();
      }
    });
  }

}
