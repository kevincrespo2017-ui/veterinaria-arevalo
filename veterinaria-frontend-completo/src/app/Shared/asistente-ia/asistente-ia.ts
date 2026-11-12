import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, ViewChild, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AsistenteServicio } from '../../Servicios/asistente-servicio';

interface MensajeChat { autor: 'usuario' | 'asistente'; texto: string; }

@Component({
  selector: 'app-asistente-ia', standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './asistente-ia.html', styleUrl: './asistente-ia.scss'
})
export class AsistenteIa {
  private readonly api = inject(AsistenteServicio);
  private readonly cd = inject(ChangeDetectorRef);
  @ViewChild('panel') panel?: ElementRef<HTMLElement>;

  abierto = false;
  cargando = false;
  pregunta = '';
  error = '';
  mensajes: MensajeChat[] = [{
    autor: 'asistente',
    texto: '¡Hola! Soy el asistente virtual de Veterinaria Arévalo. Puedo orientarte sobre cómo usar la plataforma, tus citas y servicios. No reemplazo la atención de un veterinario.'
  }];

  alternar(): void {
    this.abierto = !this.abierto;
    if (this.abierto) setTimeout(() => this.panel?.nativeElement.querySelector<HTMLTextAreaElement>('textarea')?.focus());
  }
  cerrar(): void { this.abierto = false; }

  enviar(): void {
    const mensaje = this.pregunta.trim();
    if (!mensaje || this.cargando || mensaje.length > 2000) return;
    this.error = '';
    this.pregunta = '';
    this.mensajes.push({ autor: 'usuario', texto: mensaje });
    this.cargando = true;
    this.api.conversar(mensaje).subscribe({
      next: r => {
        this.mensajes.push({ autor: 'asistente', texto: r.respuesta || 'No recibí una respuesta. Prueba de nuevo.' });
        this.cargando = false;
        this.cd.detectChanges();
        this.desplazarAbajo();
      },
      error: e => {
        this.cargando = false;
        this.error = e?.status === 503
          ? 'La IA todavía no está habilitada en el backend. Configura OPENAI_API_KEY y APP_AI_ENABLED=true.'
          : e?.status === 401 || e?.status === 403
            ? 'Tu sesión venció o no tienes permisos. Inicia sesión nuevamente.'
            : 'No se pudo consultar al asistente. Comprueba la conexión y la configuración del backend.';
        this.cd.detectChanges();
        this.desplazarAbajo();
      }
    });
    this.desplazarAbajo();
  }

  sugerir(pregunta: string): void { this.pregunta = pregunta; this.enviar(); }
  alPresionar(evento: KeyboardEvent): void {
    if (evento.key === 'Enter' && !evento.shiftKey && !evento.isComposing) {
      evento.preventDefault(); this.enviar();
    }
  }
  private desplazarAbajo(): void {
    setTimeout(() => {
      const lista = this.panel?.nativeElement.querySelector<HTMLElement>('.asistente-mensajes');
      if (lista) lista.scrollTop = lista.scrollHeight;
    });
  }
}
