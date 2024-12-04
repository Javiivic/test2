import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { IonicModule, ModalController } from '@ionic/angular';
import { AsistenciaPage } from './asistencia.page';

describe('AsistenciaPage', () => {
  let component: AsistenciaPage;
  let fixture: ComponentFixture<AsistenciaPage>;
  let router: Router;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;

  beforeEach(async () => {
    modalControllerSpy = jasmine.createSpyObj('ModalController', ['create']);

    await TestBed.configureTestingModule({
      declarations: [AsistenciaPage],
      imports: [RouterTestingModule, IonicModule.forRoot()],
      providers: [
        { provide: ModalController, useValue: modalControllerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AsistenciaPage);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should register asistencia for a given asignatura', () => {
    // Datos de prueba
    const mockAsignatura = { 
      asigId: '1', 
      asigName: 'Matemáticas', 
      assists: []  // Inicializamos el arreglo vacío
    };

    const mockUser = {
      asignatura: [mockAsignatura],
    };

    // Simula localStorage
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(mockUser));
    spyOn(localStorage, 'setItem');
    spyOn(window, 'alert');

    // Ejecuta el método
    component.registrarAsistencia(mockAsignatura);

    // Verifica que se haya agregado una asistencia
    expect(mockAsignatura.assists.length).toBe(1);

    
    // Verifica que se haya actualizado el localStorage
    expect(localStorage.setItem).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith('Asistencia registrada para: Matemáticas');
  });
});
