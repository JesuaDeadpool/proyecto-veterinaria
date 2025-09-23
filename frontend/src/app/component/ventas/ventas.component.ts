import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { VentaService } from '../../services/venta.service';

@Component({
  selector: 'app-ventas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.scss']
})
export class VentasComponent implements OnInit {
  clienteNombre = '';
  clienteTelefono = '';

  productos: any[] = [];
  carrito: any[] = [];
  total = 0;
  errorMessage = '';
  showModal = false;

  token = localStorage.getItem('token') || '';
  id_usuario = Number(localStorage.getItem('id_usuario')) || 1;
  id_cliente = Number(localStorage.getItem('id_cliente')) || 1;

  constructor(private ventaService: VentaService, private router: Router) { }

  ngOnInit() {
    this.ventaService.getProductos().subscribe({
      next: productos => {
        this.productos = productos;
        console.log('Productos cargados:', this.productos);
      },
      error: err => this.errorMessage = 'Error al cargar productos'
    });
  }

  agregarAlCarrito(producto: any, cantidad: number) {
    const existente = this.carrito.find(p => p.id_producto === producto.id_producto);
    if (existente) {
      existente.cantidad += cantidad;
    } else {
      this.carrito.push({ ...producto, cantidad });
    }
    this.calcularTotal();
  }

  quitarDelCarrito(producto: any) {
    this.carrito = this.carrito.filter(p => p.id_producto !== producto.id_producto);
    this.calcularTotal();
  }

  cambiarCantidad(producto: any, cantidad: number) {
    if (cantidad <= 0) this.quitarDelCarrito(producto);
    else {
      const p = this.carrito.find(c => c.id_producto === producto.id_producto);
      if (p) p.cantidad = cantidad;
    }
    this.calcularTotal();
  }

  calcularTotal() {
    this.total = this.carrito.reduce((acc, p) => acc + p.precio * p.cantidad, 0);
  }

  registrarVenta() {
    if (!this.clienteNombre || !this.clienteTelefono || this.carrito.length === 0) {
      this.errorMessage = 'Complete los datos del cliente y agregue productos';
      return;
    }

    const cliente = { nombre: this.clienteNombre, telefono: this.clienteTelefono };

    const productosVenta = this.carrito.map(p => ({
      id_producto: p.id_producto,
      cantidad: p.cantidad
    }));

    const ventaPayload = {
      id_usuario: 1,
      id_cliente: this.id_cliente,
      fecha: new Date().toISOString().split('T')[0],
      productos: this.carrito.map(item => ({
        id_producto: item.id_producto,
        cantidad: item.cantidad
      }))
    };

    this.ventaService.registrarVenta(ventaPayload, this.token).subscribe({
      next: res => {
        alert('Venta registrada exitosamente');
        this.carrito = [];
        this.total = 0;
        this.clienteNombre = '';
        this.clienteTelefono = '';
        this.errorMessage = '';
        this.showModal = false;
      },
      error: err => console.error('Error backend:', err)
    });


  }

  openModal() { this.showModal = true; }
  closeModal() { this.showModal = false; }
}
