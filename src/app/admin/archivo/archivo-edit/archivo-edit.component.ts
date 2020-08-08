import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ArchivoService } from '../services/archivo.service';
import { ArchivoModel } from '../models/archivo-model';

@Component({
  selector: 'app-archivo-edit',
  templateUrl: './archivo-edit.component.html',
  styleUrls: ['./archivo-edit.component.css']
})
export class ArchivoEditComponent implements OnInit {

  @Output()
  archivoBaseDatosChange = new EventEmitter(); //= new ArchivoModel();

  fileData: File;
  previewUrl: any = null;
  fileUploadProgress: string;
  uploadedFilePath: string ;
  constructor(private archivoService: ArchivoService) { }

  ngOnInit() {
  }

  fileProgress(fileInput: any) {
      this.fileData = <File>fileInput.target.files[0];
      this.preview();
  }

  preview() {
    // Show preview
    var mimeType = this.fileData.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }

    var reader = new FileReader();
    reader.readAsDataURL(this.fileData);
    reader.onload = (_event) => {
      this.previewUrl = reader.result;
      this.onSubmit();
    }
  }

  onSubmit() {
    this.archivoService.create(this.fileData).subscribe( archivoBaseDatos => {
      this.archivoBaseDatosChange.next(archivoBaseDatos.id);
    }, err => {
      alert('error cargando archivo');
    })
  //     const formData = new FormData();
  //     formData.append('file', this.fileData);
  //     this.http.post('url/to/your/api', formData)
  //       .subscribe( (res: any) => {
  //         console.log(res);
  //         this.uploadedFilePath = res.data.filePath;
  //         alert('SUCCESS !!');
  //       })
   }
}
