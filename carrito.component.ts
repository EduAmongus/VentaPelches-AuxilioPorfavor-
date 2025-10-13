import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarritoService } from '../servicios/carrito.service';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.css']
})
export class CarritoComponent {
  constructor(public carritoService: CarritoService) {}

  generarRecibo() {
    this.carritoService.generarRecibo();
  }
}
