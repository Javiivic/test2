import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { IonicModule, Platform } from '@ionic/angular';
import { AuthService } from '../auth.service';
import { QrPage } from './qr.page';

// Mock de las dependencias
class MockRouter {
  navigate = jasmine.createSpy('navigate');
}

class MockAuthService {
  registrarAsistencia = jasmine.createSpy('registrarAsistencia').and.returnValue({
    subscribe: jasmine.createSpy('subscribe')
  });
}

class MockPlatform {
  ready = jasmine.createSpy('ready').and.returnValue(Promise.resolve());
}

describe('QrPage', () => {
  let component: QrPage;
  let fixture: ComponentFixture<QrPage>;
  
  // Configuración del TestBed antes de crear el componente
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IonicModule.forRoot()],  // Importamos IonicModule para componentes de Ionic
      declarations: [QrPage],
      providers: [
        { provide: Router, useClass: MockRouter },  // Mock del Router
        { provide: AuthService, useClass: MockAuthService },  // Mock del AuthService
        { provide: Platform, useClass: MockPlatform },  // Mock del Platform
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(QrPage);
    component = fixture.componentInstance;

    // Configuramos el usuario simulado en localStorage
    const mockUser = {
      id: '123',
      asignatura: [
        { asigId: '1', asigName: 'Matemáticas' },
        { asigId: '2', asigName: 'Física' }
      ]
    };
    spyOn(localStorage, 'getItem').and.callFake((key: string) => {
      if (key === 'currentUser') {
        return JSON.stringify(mockUser);
      }
      return null;
    });

    fixture.detectChanges();  // Detectar los cambios en el componente
  });

  it('should create the QrPage component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the user and asignaturas from localStorage', () => {
    expect(component.usuario.id).toBe('123');
    expect(component.asignaturas.length).toBe(2);
  });

  it('should select an asignatura and generate qrText', () => {
    component.asignaturaSeleccionada = '1';  // Seleccionamos la asignatura de ID '1'
    component.seleccionarAsignaturaParaEscaneo();
    expect(component.qrText).toBe('qr_1_Matemáticas');
  });

  it('should validate QR correctly', () => {
    component.asignaturaSeleccionada = '1';
    const validQr = 'qr_1_Matemáticas';
    const invalidQr = 'qr_2_Física';

    expect(component.validarCodigoQR(validQr)).toBeTrue();  // Valida el QR correcto
    expect(component.validarCodigoQR(invalidQr)).toBeFalse();  // Valida el QR incorrecto
  });

  it('should start scan when asignatura is selected', () => {
    spyOn(component, 'startScan');  // Espiar el método startScan
    component.asignaturaSeleccionada = '1';
    component.seleccionarAsignaturaParaEscaneo();
    expect(component.startScan).toHaveBeenCalled();
  });

  it('should call authService.registrarAsistencia when registering attendance', () => {
    component.asignaturaSeleccionada = '1';
    component.botonDesbloqueado = true;

    // Simular el método de registrar asistencia
    component.registrarAsistencia();
    expect(MockAuthService.prototype.registrarAsistencia).toHaveBeenCalledWith('123', '1', jasmine.any(Object));
    expect(component.botonDesbloqueado).toBeFalse();
  });

  it('should navigate to inicio when volver is called', () => {
    component.volver();
    expect(MockRouter.prototype.navigate).toHaveBeenCalledWith(['/inicio']);
  });
});
