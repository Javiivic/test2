import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing'; // Asegúrate de importar RouterTestingModule
import { AuthService } from '../auth.service';
import { InicioPage } from './inicio.page';

// Mock de AuthService si es necesario
class MockAuthService {
  // Aquí puedes agregar los métodos mockeados necesarios
}

describe('InicioPage', () => {
  let component: InicioPage;
  let fixture: ComponentFixture<InicioPage>;
  let router: Router;  // Inyectar Router desde RouterTestingModule

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],  // Usar RouterTestingModule para simular el enrutamiento
      declarations: [InicioPage],
      providers: [
        { provide: AuthService, useClass: MockAuthService },  // Si es necesario mockear AuthService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(InicioPage);
    component = fixture.componentInstance;

    // Inyectamos el Router desde RouterTestingModule
    router = TestBed.inject(Router);  // Inyección correcta del Router

    fixture.detectChanges();
  });

  it('should create the InicioPage component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize userName and userId based on localStorage', () => {
    // Mock de localStorage
    const mockUser = { id: '123', name: 'John Doe' };
    spyOn(localStorage, 'getItem').and.callFake((key: string) => {
      if (key === 'currentUser') {
        return JSON.stringify(mockUser);
      } else if (key === 'userName_123') {
        return 'John Doe';
      }
      return null;
    });

    // Ejecutar ngOnInit() para inicializar los valores
    component.ngOnInit();

    // Verificar que los valores se hayan inicializado correctamente
    expect(component.userId).toBe('123');
    expect(component.userName).toBe('John Doe');
  });

  it('should set userName to "Usuario desconocido" when there is no currentUser in localStorage', () => {
    // Mock de localStorage para no tener un currentUser
    spyOn(localStorage, 'getItem').and.callFake(() => null);

    // Ejecutar ngOnInit() para inicializar los valores
    component.ngOnInit();

    // Verificar que el userName se haya establecido como "Usuario desconocido"
    expect(component.userName).toBe('Usuario desconocido');
  });

  it('should clear localStorage and navigate to /sesion on logout', () => {
    // Espiar localStorage.clear y router.navigate
    spyOn(localStorage, 'clear');
    spyOn(router, 'navigate');  // Verificar que el router navegue correctamente

    // Llamar al método logout
    component.logout();

    // Verificar que localStorage.clear() haya sido llamado
    expect(localStorage.clear).toHaveBeenCalled();

    // Verificar que el router haya navegado a '/sesion'
    expect(router.navigate).toHaveBeenCalledWith(['/sesion']);
  });
});
