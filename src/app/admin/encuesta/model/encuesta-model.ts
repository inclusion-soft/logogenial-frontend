import { MarcaModel } from "./marca-model";

export class EncuestaModel {
    id = 0;
    numeroDocumento!: string;
    comentarios!: string;
    email!: string;
    activo!: boolean;
    marca!: MarcaModel;
    public constructor() {
      this.activo = true;
    }
  }
