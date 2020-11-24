export class UsuarioModel {
  id!: number;
  nombre!: string;
  apellido!: string;
  username!: string;
  email!: string;
  password!: string;
  repetirPassword!: string;
  rol: string;
  avatar: string;
  activo: boolean;
  roles: any[];
}
