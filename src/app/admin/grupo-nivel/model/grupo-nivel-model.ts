
import {GrupoModel} from '../../grupo/model/grupo-model';
import { NivelModel } from '../../nivel/models/nivel-model';

export class GrupoNivelModel {
  id = 0;
  nombre!: string;
  anio!: number;
  activo!: boolean;
  grupo!: GrupoModel;
  nivel!: NivelModel;
  constructor() {
    this.grupo = new GrupoModel();
    this.nivel = new NivelModel();
    this.activo = true;
  }
}
