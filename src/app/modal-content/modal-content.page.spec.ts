import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ModalContentPage } from './modal-content.page';

// Mock del ModalController
class MockModalController {
  dismiss = jasmine.createSpy('dismiss');  // Espía para el método dismiss
  create = jasmine.createSpy('create').and.returnValue({
    present: jasmine.createSpy('present')  // Simula la creación del modal
  });
}

describe('ModalContentPage', () => {
  let component: ModalContentPage;
  let fixture: ComponentFixture<ModalContentPage>;
  let modalController: MockModalController;  // Aquí usamos el tipo MockModalController

  beforeEach(async () => {
    // Configuramos el TestBed como lo harías normalmente pero sin inyectar el ModalController
    await TestBed.configureTestingModule({
      imports: [IonicModule.forRoot()],  // Asegúrate de que IonicModule esté importado
      declarations: [ModalContentPage],  // Declaramos el componente que vamos a probar
      providers: []  // No inyectamos el ModalController en TestBed
    }).compileComponents();

    fixture = TestBed.createComponent(ModalContentPage);  // Creamos el componente
    component = fixture.componentInstance;  // Obtenemos la instancia del componente

    // Instanciamos manualmente el mock
    modalController = new MockModalController();  // Usamos el mock manualmente

  
    fixture.detectChanges();  // Detecta los cambios del componente
  });

  it('should create the ModalContentPage component', () => {
    expect(component).toBeTruthy();  // Verifica que el componente se haya creado correctamente
  });

  it('should dismiss the modal when cerrarModal is called', () => {
    component.cerrarModal();  // Llamamos al método cerrarModal del componente

    // Verificamos que el método dismiss haya sido llamado
    expect(modalController.dismiss).toHaveBeenCalled();
  });

  it('should log an error if Asignatura is not received correctly', () => {
    spyOn(console, 'log');  // Espiamos el log de consola

    component.Asignatura = null;  // Simulamos que no se ha recibido la asignatura
    component.ngOnInit();  // Llamamos al ngOnInit

    // Verificamos que se haya logueado el mensaje de error
    expect(console.log).toHaveBeenCalledWith('No se recibió la asignatura correctamente');
  });
});
