import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FacturasService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }


  getFacturas(token: string): Observable<any> {

    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    return this.http.get(`${this.apiUrl}/facturas`, { headers });
  }

  getFactura(id: number, token: string): Observable<any> {

    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    return this.http.get(`${this.apiUrl}/factura/${id}`, { headers });
  }
}
