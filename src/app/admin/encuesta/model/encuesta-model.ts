import { MarcaModel } from "./marca-model";

export class EncuestaModel {
    id = 0;
    nombre!: string;
    anio!: number;
    activo!: boolean;
    usuario!: MarcaModel;
    public constructor() {
      this.activo = true;
    }
  }
