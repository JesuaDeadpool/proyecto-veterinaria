import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FacturasService } from '../../services/facturas.service';
import { CommonModule, CurrencyPipe, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-facturas-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './facturas.component.html',
  styleUrl: './facturas.component.scss'
})
export class FacturasComponent implements OnInit {

  token = localStorage.getItem('token') || '';
  facturas: any[] = [];
  facturaSeleccionada: any = null;
  errorMessage = '';

  constructor(private facturasService: FacturasService) { }

  ngOnInit(): void {
    this.cargarFacturas();
  }
  cargarFacturas() {
    this.facturasService.getFacturas(this.token).subscribe({
      next: (res: any) => {
        if (res.status === 200) {
          this.facturas = res.data;
          console.log('Facturas:', this.facturas);
        } else {
          this.errorMessage = 'No hay facturas disponibles';
        }
      },
      error: (err) => {
        console.error('Error al cargar facturas:', err);
        this.errorMessage = 'Error al cargar facturas';
      }
    });
  }
  mostrarFactura(id: number) {
    this.facturasService.getFactura(id, this.token).subscribe({
      next: (res: any) => {
        if (res.status === 200 && res.data.length > 0) {
          const datos = res.data;


          const primeraFila = datos[0];

          this.facturaSeleccionada = {
            id_venta: primeraFila.id_venta,
            fecha: primeraFila.fecha,
            cliente: {
              nombre: primeraFila.Cliente,
              telefono: primeraFila.Telefono
            },
            veterinaria: {
              nombre: primeraFila.NombreVeterinaria,
              telefono: primeraFila.VeterinariaTelefono,
              correo: primeraFila.Veterinaria_Correo,
              direccion: primeraFila.direccion
            },
            productos: datos.map((p: any) => ({
              nombre: p.Producto_Nombre,
              cantidad: p.Cantidad,
              subtotal: p.subtotal
            })),
            total: datos.reduce((acc: number, p: any) => acc + p.subtotal, 0)

          };
        } else {
          this.errorMessage = 'Factura no encontrada';
        }
      },
      error: (err) => {
        console.error('Error al obtener factura:', err);
        this.errorMessage = 'Error al obtener la factura';
      }
    });
  }

  cerrarFactura() {
    this.facturaSeleccionada = null;
  }
}



