import { Injectable, signal } from '@angular/core';
import { Producto } from '../models/producto';
import { saveAs } from 'file-saver';

@Injectable({ providedIn: 'root' })
export class CarritoService {
  private productosSignal = signal<Producto[]>([]);
  productos = this.productosSignal.asReadonly();

  agregar(producto: Producto) {
    this.productosSignal.update(lista => [...lista, producto]);
  }

  quitar(id: number) {
    this.productosSignal.update(lista =>
      lista.filter(p => p.id !== id)
    );
  }

  vaciar() {
    this.productosSignal.set([]);
  }

  total() {
    return this.productosSignal().reduce((acc, p) => acc + p.precio, 0);
  }

  generarRecibo() {
    const productos = this.productosSignal();
    if (productos.length === 0) {
      alert('El carrito está vacío.');
      return;
    }

    const fecha = new Date().toISOString();
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<purchase>\n`;
    xml += `  <date>${fecha}</date>\n`;
    xml += `  <items>\n`;

    productos.forEach(p => {
      xml += `    <item>\n`;
      xml += `      <id>p${p.id}</id>\n`;
      xml += `      <name>${p.nombre}</name>\n`;
      xml += `      <quantity>1</quantity>\n`;
      xml += `      <price>${p.precio.toFixed(2)}</price>\n`;
      xml += `      <subtotal>${p.precio.toFixed(2)}</subtotal>\n`;
      xml += `    </item>\n`;
    });

    xml += `  </items>\n`;
    xml += `  <total>${this.total().toFixed(2)}</total>\n`;
    xml += `</purchase>`;

    const blob = new Blob([xml], { type: 'application/xml;charset=utf-8' });
    saveAs(blob, `recibo_${Date.now()}.xml`);
  }
}
