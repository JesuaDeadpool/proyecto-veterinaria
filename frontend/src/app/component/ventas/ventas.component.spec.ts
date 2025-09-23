import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { VentasComponent } from './ventas.component';
import { VentaService } from '../../services/venta.service';
import { of } from 'rxjs';

describe('VentasComponent', () => {
  let component: VentasComponent;
  let fixture: ComponentFixture<VentasComponent>;
  let ventaService: VentaService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VentasComponent],
      imports: [FormsModule, HttpClientTestingModule, RouterTestingModule],
      providers: [VentaService]
    }).compileComponents();

    fixture = TestBed.createComponent(VentasComponent);
    component = fixture.componentInstance;
    ventaService = TestBed.inject(VentaService);

    // Mock de productos para evitar llamadas reales al backend
    spyOn(ventaService, 'getProductos').and.returnValue(
      of([
        { id_producto: 1, nombre: 'Vacuna Antirrábica', precio: 15, stock: 10 },
        { id_producto: 2, nombre: 'Consulta General', precio: 10, stock: 5 }
      ])
    );

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debe cargar productos al iniciar', () => {
    expect(component.productos.length).toBe(2);
    expect(component.productos[0].nombre).toBe('Vacuna Antirrábica');
  });

  it('debe agregar productos al carrito', () => {
    const producto = component.productos[0];
    component.agregarAlCarrito(producto);
    expect(component.carrito.length).toBe(1);
    expect(component.carrito[0].cantidad).toBe(1);
  });

  it('debe calcular el total correctamente', () => {
    const producto1 = component.productos[0];
    const producto2 = component.productos[1];
    component.agregarAlCarrito(producto1);
    component.agregarAlCarrito(producto2);
    component.calcularTotal();
    expect(component.total).toBe(25); // 15 + 10
  });

  it('no debe permitir registrar venta sin cliente ni productos', () => {
    component.clienteNombre = '';
    component.clienteTelefono = '';
    component.carrito = [];
    component.registrarVenta();
    expect(component.errorMessage).toBe('Complete los datos del cliente y agregue productos');
  });
});
