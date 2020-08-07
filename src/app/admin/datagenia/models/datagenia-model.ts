export class DatageniaModel {
  id: number;
  nombre: string;
  frase!: string;
  usuarioCreadorId!: number;
  compartido!: boolean;
  dificultad!: number;
  activo: boolean;
  constructor() {
    this.id = 0;
    this.nombre = '';
    this.activo = true;
  }
}
