// Configuración principal de Angular.
import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners
} from '@angular/core';

// Permite trabajar con las rutas de Angular.
import { provideRouter } from '@angular/router';

// HttpClient permite realizar peticiones HTTP.
// withInterceptors permite registrar nuestro interceptor JWT.
import {
  provideHttpClient,
  withInterceptors
} from '@angular/common/http';

// Rutas de la aplicación.
import { routes } from './app.routes';

// Interceptor que agregará automáticamente el JWT.
import { authInterceptor }
  from './Shared/auth-interceptor';


// ==========================================================
// CONFIGURACIÓN PRINCIPAL
// ==========================================================

export const appConfig: ApplicationConfig = {

  providers: [

    // Manejo global de errores.
    provideBrowserGlobalErrorListeners(),

    // Habilita las rutas.
    provideRouter(routes),

    // Habilita HttpClient y registra el interceptor JWT.
    provideHttpClient(

      withInterceptors([
        authInterceptor
      ])

    )

  ]

};