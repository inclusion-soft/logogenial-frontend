import {GrupoNivelModel} from '../../grupo-nivel/model/grupo-nivel-model';
import { TemaModel } from '../../tema/models/tema-model';

export class GrupoNivelTemaModel {
  id = 0;
  nombre!: string;
  anio!: number;
  activo!: boolean;
  grupoNivel!: GrupoNivelModel;
  tema!: TemaModel;
  constructor() {
    this.grupoNivel = new GrupoNivelModel();
    this.tema = new TemaModel();
    this.activo = true;
  }
}
