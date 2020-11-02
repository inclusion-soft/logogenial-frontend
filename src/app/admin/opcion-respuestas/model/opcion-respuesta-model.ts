import { PreguntaModel } from "app/admin/preguntas/model/pregunta-model";
import { DatageniaModel } from "app/admin/datagenia/models/datagenia-model";

export class OpcionRespuestaModel {
  id = 0;
  orden!: number;
  fraseRespuesta: string;
  pregunta!: PreguntaModel;
  opcion!: DatageniaModel;
  activo!: boolean;
  constructor() {
    this.pregunta = new PreguntaModel();
    this.opcion = new DatageniaModel();
    this.activo = true;
  }
}
