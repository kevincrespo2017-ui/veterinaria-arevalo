import { AfterViewInit, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { IdiomaServicio } from './Servicios/idioma-servicio';

@Component({ selector: 'app-root', standalone: true, imports: [RouterOutlet],
  templateUrl: './app.html', styleUrl: './app.scss' })
export class App implements AfterViewInit {
  private readonly idioma = inject(IdiomaServicio);
  ngAfterViewInit(): void { this.idioma.iniciar(); }
}
