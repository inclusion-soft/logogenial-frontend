import { Injectable } from '@angular/core';
import { CONSTANTS_SHARED } from '../constants-shared';
import { FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class UtilitiesService {
  constants = CONSTANTS_SHARED;
  constructor() { }

  formSuccessCreateMessage(snackBar: MatSnackBar) {
    snackBar.open(this.constants.successSave, 'X', {
      duration: 5000,
      panelClass: ['bg-primary']
    });
  }

  formSuccessUpdateMessage(snackBar: MatSnackBar) {
    snackBar.open(this.constants.successEdit, 'X', {
      duration: 5000,
      panelClass: ['bg-primary']
    });
  }

  actionSuccessDeleteMessage(snackBar: MatSnackBar) {
    snackBar.open(this.constants.registroEliminado, 'X', {
      duration: 5000,
      panelClass: ['bg-primary']
    });
  }

  formWarningMessage(snackBar: MatSnackBar) {
    snackBar.open(this.constants.errorForm, 'X', {
      duration: 5000,
      panelClass: ['bg-warning']
    });
  }

  simpleWarningMessage(mensaje: string, snackBar: MatSnackBar) {
    snackBar.open(mensaje, 'X', {
      duration: 5000,
      panelClass: ['bg-warning']
    });
  }

  // actionNotFoundWarningMessage(snackBar: MatSnackBar) {
  //   snackBar.open(this.constants.errorForm, 'X', {
  //     duration: 5000,
  //     panelClass: ['bg-warning']
  //   });
  // }

  actionErrorMessages(error:any, snackBar: MatSnackBar) {
    if (error.status === 400 || error.status === 409) {
      snackBar.open(
        this.constants.errorFormatData, 'X', {
        duration: 6000,
        panelClass: ['bg-danger']
      }
      );
    } else if (error.status === 401 || error.status === 403) {
      snackBar.open(
        this.constants.unauthorized, 'X', {
        duration: 6000,
        panelClass: ['bg-danger']
      }
      );
    } else if (error.status === 404) {
      snackBar.open(
        this.constants.noResultados, 'X', {
        duration: 6000,
        panelClass: ['error-snackbar']
      }
      );
    } else if (error.status === 500) {
      let errorMessage: String;
      try {
        snackBar.open(
          error.error.message, 'X', {
          duration: 6000,
          panelClass: ['error-snackbar']
        }
        );
      } catch (error) {
        snackBar.open(
          this.constants.error500, 'X', {
          duration: 6000,
          panelClass: ['error-snackbar']
        }
        );
      }

    } else {
      snackBar.open(
        this.constants.error500, 'X', {
        duration: 6000,
        panelClass: ['bg-danger']
      }
      );
    }
  }


  formErrorMessages(error:any, form: FormGroup, snackBar: MatSnackBar) {
    let errorMessage = '';
    if (error.error !== undefined && error.error.message !== undefined){
      errorMessage = error.error.message;
    }
    if (error.status === 400 || error.status === 409) {
      try {
        form.controls[error.error[0].field].setErrors({ 'incorrect': true });
      } catch (error) { }
      // snackBar.openFromComponent(
      //   MultipleErrorMatSnackbarComponent,
      //   {
      //     data: error.error,
      //     duration: 6000,
      //     panelClass: ['error-snackbar']
      //   }
      // );
    } else if (error.status === 401 || error.status === 403) {
      snackBar.open(
        errorMessage === '' ? this.constants.unauthorized : errorMessage, 'X', {
        duration: 6000,
        panelClass: ['error-snackbar']
      }
      );
    } else if (error.status === 404) {
      snackBar.open(
        errorMessage === '' ? this.constants.noResultados : errorMessage , 'X', {
        duration: 6000,
        panelClass: ['error-snackbar']
      }
      );
    } else if (error.status === 500) {
      try {
        snackBar.open(
          errorMessage === '' ? this.constants.error500 : errorMessage, 'X', {
          duration: 6000,
          panelClass: ['error-snackbar']
        }
        );
      } catch (error) {
        snackBar.open(
          errorMessage === '' ? this.constants.error500 : errorMessage, 'X', {
          duration: 6000,
          panelClass: ['error-snackbar']
        }
        );
      }

    } else {
      snackBar.open(
        errorMessage === '' ? this.constants.error500 : errorMessage, 'X', {
        duration: 6000,
        panelClass: ['error-snackbar']
      }
      );
    }
  }
}
