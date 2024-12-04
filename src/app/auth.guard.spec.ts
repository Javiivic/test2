import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing'; // Necesario para el router
import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule], // Proporciona un módulo de enrutamiento para el guard
      providers: [AuthGuard], // Proporciona el guard
    });

    // Obtener instancias inyectadas
    authGuard = TestBed.inject(AuthGuard);
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(authGuard).toBeTruthy(); // Verifica que el guard se haya creado correctamente
  });

  // Aquí puedes agregar más pruebas para las funciones del guard
});
