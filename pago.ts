import { Component, AfterViewInit, computed, effect } from '@angular/core';
import { CarritoService } from '../../servicios/carrito.service';

@Component({
  selector: 'app-pago',
  templateUrl: './pago.html',
  styleUrls: ['./pago.css']
})
export class PagoComponent implements AfterViewInit {
  total = computed(() => this.carritoService.total());

  constructor(private carritoService: CarritoService) {
    effect(() => {
      const totalActual = this.total();
      if (typeof window !== 'undefined' && totalActual > 0) {
        this.renderOrUpdatePayPalButton(totalActual);
      }
    });
  }

  ngAfterViewInit(): void {
    if (typeof window !== 'undefined') {
      this.loadPayPalScript().catch(err => console.error('Error al cargar PayPal SDK:', err));
    }
  }

  private loadPayPalScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined') {
        reject('window no está definido (SSR).');
        return;
      }

      if ((window as any).paypal) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://www.paypal.com/sdk/js?client-id=AUDZSYfrOJ6s2arV7zfr11T5v6NgYXcQykDsRdD19s929FYUYrbmXGI8s5NlXKPIe_wFLBuzN_iM4zZa&currency=MXN';
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject('No se pudo cargar el SDK de PayPal.');
      document.body.appendChild(script);
    });
  }

  private renderOrUpdatePayPalButton(total: number): void {
    if (typeof window === 'undefined') return;
    const paypal = (window as any).paypal;
    if (!paypal) {
      console.error('PayPal SDK no está disponible.');
      return;
    }

    const container = document.getElementById('paypal-button-container');
    if (container) container.innerHTML = '';

    paypal.Buttons({
      createOrder: (data: any, actions: any) => {
        return actions.order.create({
          purchase_units: [{
            amount: { value: total.toFixed(2) }
          }]
        });
      },
      onApprove: (data: any, actions: any) => {
        this.carritoService.generarRecibo();
        return actions.order.capture().then((details: any) => {
          alert('Pago completado por ' + details.payer.name.given_name);
          console.log('Detalles del pago:', details);
        });
      },
      onError: (err: any) => {
        console.error('Error en el proceso de pago:', err);
      }
    }).render('#paypal-button-container');
  }
}
