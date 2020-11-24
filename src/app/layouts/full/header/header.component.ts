import { Component } from '@angular/core';
import { TokenStorageService } from 'app/seguridad/services/token-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: []
})
export class AppHeaderComponent {
  constructor(
    private tokenStorageService: TokenStorageService,
    private router: Router
  ) {
  }
  finalizarSesion(): void {
    this.tokenStorageService.signOut();
    this.router.navigate(['/login']);
  }
}
