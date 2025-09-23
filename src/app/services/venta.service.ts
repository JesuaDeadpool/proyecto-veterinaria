import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class VentaService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  getProductos() {
    return this.http.get<any>(`${this.apiUrl}/productos`).pipe(
      map(res => {
        const valores = Object.values(res);
        console.log(valores);
        return Array.isArray(valores[2]) ? valores[2] : [];
      })
    );
  }

  registrarVenta(venta: any, token: string): Observable<any> {
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    return this.http.post(`${this.apiUrl}/ventas`, venta, { headers });
  }
}
