import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Producto } from '../models/producto';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private apiUrl = 'http://localhost:4000/api/catalogo/productos';

  constructor(private http: HttpClient) {}

  async getProductos(): Promise<Producto[]> {
    try {
      const productos = await firstValueFrom(
        this.http.get<Producto[]>(this.apiUrl)
      );

      console.log('Productos cargados desde backend:', productos);
      return productos;
    } catch (error) {
      console.error('Error al cargar productos:', error);
      return [];
    }
  }
}
