import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { AuthService } from '../auth.service'; // Ajusta según tu ruta
import { SesionPage } from './sesion.page'; // Ajusta según tu ruta

describe('SesionPage', () => {
  let component: SesionPage;
  let fixture: ComponentFixture<SesionPage>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [SesionPage],
      imports: [RouterTestingModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SesionPage);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should redirect to iniciotwo if the user is a professor', () => {
    const usuario = { name: 'John Doe', tipo: 'profesor' };
    authService.login.and.returnValue(of(usuario));

    component.name = 'John Doe';
    component.password = 'password123';
    component.login();

    expect(localStorage.getItem('userName')).toBe('John Doe');
    expect(localStorage.getItem('userType')).toBe('profesor');
    expect(router.navigate).toHaveBeenCalledWith(['iniciotwo']);
  });

  it('should redirect to inicio if the user is a student', () => {
    const usuario = { name: 'Jane Doe', tipo: 'estudiante' };
    authService.login.and.returnValue(of(usuario));

    component.name = 'Jane Doe';
    component.password = 'password123';
    component.login();

    expect(localStorage.getItem('userName')).toBe('Jane Doe');
    expect(localStorage.getItem('userType')).toBe('estudiante');
    expect(router.navigate).toHaveBeenCalledWith(['/inicio']);
  });

  it('should show an error message if login fails', () => {
    authService.login.and.returnValue(
      throwError(() => new Error('Usuario o contraseña incorrectos'))
    );

    component.name = 'Wrong User';
    component.password = 'wrongPassword';
    component.login();

    expect(component.errorMessage).toBe('Usuario o contraseña incorrectos');
  });
});
