import {GrupoModel} from '../../grupo/model/grupo-model';
import { NivelModel } from 'app/admin/nivel/models/nivel-model';

export class NivelesModel {
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
