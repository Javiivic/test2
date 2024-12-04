import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { RegistroPage } from './registro.page';

// Mock de Router
class MockRouter {
  navigate = jasmine.createSpy('navigate');
}

describe('RegistroPage', () => {
  let component: RegistroPage;
  let fixture: ComponentFixture<RegistroPage>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IonicModule.forRoot()],
      declarations: [RegistroPage],
      providers: [
        { provide: Router, useClass: MockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegistroPage);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);

    // Configuramos el usuario simulado en localStorage
    spyOn(localStorage, 'setItem');
    spyOn(localStorage, 'clear');

    fixture.detectChanges();
  });

  it('should create the RegistroPage component', () => {
    expect(component).toBeTruthy();
  });

  it('should register the user and navigate to the session page', () => {
    component.name = 'John Doe';
    component.email = 'john.doe@example.com';
    component.password = '123456';
    component.repassword = '123456';

    // Simulamos el registro
    component.register();

    const expectedUser = {
      name: 'John Doe',
      password: '123456'
    };

    // Verificamos que se haya guardado en localStorage
    expect(localStorage.setItem).toHaveBeenCalledWith('user', JSON.stringify(expectedUser));
    
    // Verificamos que se haya navegado a la página de sesión
    expect(router.navigate).toHaveBeenCalledWith(['/sesion']);
  });

  it('should clear the localStorage when clearLocalStorage is called', () => {
    component.clearLocalStorage();

    // Verificamos que se haya limpiado localStorage
    expect(localStorage.clear).toHaveBeenCalled();
  });
});
