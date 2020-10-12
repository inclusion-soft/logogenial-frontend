import { LeccionModel } from "app/admin/lecciones/model/leccion-model";
import { UsuarioModel } from "app/seguridad/models/usuario-model";
import { DatageniaModel } from "app/admin/datagenia/models/datagenia-model";

export class PreguntaModel {
  id = 0;
  descripcion!: string;
  enumeracion!: number;
  aprobacion!: boolean;
  usocompartido!: boolean;
  usuario!: UsuarioModel;
  activo!: boolean;
  leccion!: LeccionModel;
  datagenia!: DatageniaModel;
  constructor() {
    this.leccion = new LeccionModel();
    this.usuario = new UsuarioModel();
    this.usuario.id = 1;
    this.datagenia = new DatageniaModel();
    this.aprobacion = false;
    this.usocompartido = true;
    this.activo = true;
  }
}