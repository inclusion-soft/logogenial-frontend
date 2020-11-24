import { GrupoModel } from "app/admin/grupo/model/grupo-model";
import { SimpleModel } from "app/admin/shared/model/simple-model";

export class GrupoEstudianteModel {
  id = 0;
  activo!: boolean;
  grupo!: GrupoModel;
  usuarioestudiante!: SimpleModel;
  docente!: SimpleModel;
  constructor() {
    this.grupo = new GrupoModel();
    this.usuarioestudiante = new SimpleModel();
    this.activo = true;
  }
}
