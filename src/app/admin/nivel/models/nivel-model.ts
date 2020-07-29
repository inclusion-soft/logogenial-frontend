export class NivelModel {
  id!: number;
  nombre!: string;
  dificultad!: number;
  activo: boolean;
  NivelModel(): void {
    this.id = 0;
    this.nombre = '';
    this.activo = true;
  }
}
