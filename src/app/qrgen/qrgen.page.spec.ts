import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AlertController, IonicModule } from '@ionic/angular';
import { AuthService } from '../auth.service';
import { QrgenPage } from './qrgen.page';

// Mock de las dependencias
class MockRouter {
  navigate = jasmine.createSpy('navigate');
}

class MockAuthService {
  registrarAsistencia = jasmine.createSpy('registrarAsistencia').and.returnValue({
    toPromise: jasmine.createSpy('toPromise').and.returnValue(Promise.resolve())
  });
}

class MockAlertController {
  create = jasmine.createSpy('create').and.returnValue({
    present: jasmine.createSpy('present'),
    onDidDismiss: jasmine.createSpy('onDidDismiss').and.returnValue(Promise.resolve())
  });
}

describe('QrgenPage', () => {
  let component: QrgenPage;
  let fixture: ComponentFixture<QrgenPage>;
  let router: Router;
  let alertController: AlertController;
  let authService: AuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IonicModule.forRoot()],
      declarations: [QrgenPage],
      providers: [
        { provide: Router, useClass: MockRouter },
        { provide: AuthService, useClass: MockAuthService },
        { provide: AlertController, useClass: MockAlertController }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(QrgenPage);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    alertController = TestBed.inject(AlertController);
    authService = TestBed.inject(AuthService);

    // Configuramos el usuario simulado en localStorage
    const mockUser = {
      id: '123',
      asignatura: [
        { asigId: '005', asigName: 'Arquitectura', assists: [] },
        { asigId: '004', asigName: 'CalidadSof', assists: [] }
      ]
    };
    spyOn(localStorage, 'getItem').and.callFake((key: string) => {
      if (key === 'currentUser') {
        return JSON.stringify(mockUser);
      }
      return null;
    });

    fixture.detectChanges();
  });

  it('should create the QrgenPage component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize asignaturas from localStorage', () => {
    expect(component.asignaturas.length).toBe(2);
  });

  it('should generate QR code when an asignatura is selected', () => {
    component.asignaturaSeleccionada = '005';  // Seleccionamos una asignatura
    component.generarCodigoQr();
    expect(component.codigoQR).toBe('qr_005_Arquitectura');
  });

  it('should show error if no asignatura is selected when generating QR code', async () => {
    component.asignaturaSeleccionada = '';  // No seleccionamos asignatura
    await component.generarCodigoQr();
    expect(alertController.create).toHaveBeenCalledWith({
      header: 'Error',
      message: 'Por favor selecciona una asignatura',
      buttons: ['OK']
    });
  });

  it('should register attendance and show success alert', async () => {
    component.asignaturaSeleccionada = '005';
    component.codigoQR = 'qr_005_Arquitectura';
    
    // Simulamos la llamada a `registrarAsistencia`
    await component.registrarAsistencia();
    
    expect(authService.registrarAsistencia).toHaveBeenCalledWith('123', '005', jasmine.any(Object));
    expect(alertController.create).toHaveBeenCalledWith({
      header: 'Éxito',
      message: 'Asistencia registrada correctamente',
      buttons: [{
        text: 'OK',
        handler: jasmine.any(Function)
      }]
    });
    expect(router.navigate).toHaveBeenCalledWith(['./iniciotwo']);
  });

  it('should show error when registration fails', async () => {
    component.asignaturaSeleccionada = '005';
    component.codigoQR = 'qr_005_Arquitectura';
    
    // Simulamos un fallo en `registrarAsistencia`
    authService.registrarAsistencia = jasmine.createSpy('registrarAsistencia').and.returnValue({
      toPromise: jasmine.createSpy('toPromise').and.returnValue(Promise.reject('Error'))
    });
    
    await component.registrarAsistencia();
    expect(alertController.create).toHaveBeenCalledWith({
      header: 'Error',
      message: 'Hubo un error al registrar la asistencia',
      buttons: ['OK']
    });
  });

  it('should navigate back when volver is called', () => {
    component.volver();
    expect(router.navigate).toHaveBeenCalledWith(['/iniciotwo']);
  });
});
