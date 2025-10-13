import { Component, Inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Producto } from '../models/producto';
import { ProductoService } from '../services/producto.service';
import { CarritoService } from '../servicios/carrito.service';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [CommonModule],
  providers: [ProductoService],
  templateUrl: './catalogo.component.html',
  styleUrls: ['./catalogo.css']
})
export class CatalogoComponent implements OnInit {
  productos = signal<Producto[]>([]);

  constructor(
    private productoService: ProductoService,
    private carritoService: CarritoService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  async ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const data = await this.productoService.getProductos();
      this.productos.set(data);
      console.log('Productos en el componente (signal):', data);
    }
  }

  agregarAlCarrito(producto: Producto) {
    this.carritoService.agregar(producto);
  }
}
