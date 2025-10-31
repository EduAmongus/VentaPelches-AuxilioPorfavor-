import { Injectable, signal } from '@angular/core';
import { Producto } from '../models/producto';
import { saveAs } from 'file-saver';

interface ItemCarrito extends Producto {
  cantidad: number;
}

@Injectable({ providedIn: 'root' })
export class CarritoService {
  private productosSignal = signal<ItemCarrito[]>([]);
  productos = this.productosSignal.asReadonly();

  agregar(producto: Producto, cantidad: number = 1) {
    const lista = [...this.productosSignal()];
    const index = lista.findIndex(p => p.id === producto.id);

    // Si ya existe en el carrito
    if (index !== -1) {
      const existente = lista[index];
      const nuevaCantidad = existente.cantidad + cantidad;

      if (nuevaCantidad > producto.stock) {
        alert('No hay suficiente stock disponible.');
        return;
      }

      lista[index] = { ...existente, cantidad: nuevaCantidad };
    } else {
      if (cantidad > producto.stock) {
        alert('No hay suficiente stock disponible.');
        return;
      }
      lista.push({ ...producto, cantidad });
    }

    this.productosSignal.set(lista);
  }

  quitar(id: number) {
    const nuevaLista = this.productosSignal().filter(p => p.id !== id);
    this.productosSignal.set(nuevaLista);
  }

  actualizarCantidad(id: number, cantidad: number) {
    const lista = [...this.productosSignal()];
    const index = lista.findIndex(p => p.id === id);
    if (index !== -1) {
      lista[index].cantidad = cantidad;
      this.productosSignal.set(lista);
    }
  }

  total() {
    return this.productosSignal().reduce((acc, p) => acc + p.precio * p.cantidad, 0);
  }

  getItemsForBackend() {
    return this.productosSignal().map(p => ({
      id_producto: p.id,
      cantidad: p.cantidad
    }));
  }

  generarRecibo() {
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<purchase>\n  <items>\n`;
    this.productosSignal().forEach((p) => {
      xml += `    <item>\n`;
      xml += `      <id>${p.id}</id>\n`;
      xml += `      <name>${p.nombre}</name>\n`;
      xml += `      <quantity>${p.cantidad}</quantity>\n`;
      xml += `      <price>${p.precio.toFixed(2)}</price>\n`;
      xml += `      <subtotal>${(p.precio * p.cantidad).toFixed(2)}</subtotal>\n`;
      xml += `    </item>\n`;
    });

    xml += `  </items>\n  <total>${this.total().toFixed(2)}</total>\n</purchase>`;

    const blob = new Blob([xml], { type: 'application/xml;charset=utf-8' });
    saveAs(blob, `recibo_${Date.now()}.xml`);
  }

  vaciar() {
    this.productosSignal.set([]);
  }
}
