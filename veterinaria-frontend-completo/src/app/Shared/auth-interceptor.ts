// HttpInterceptorFn permite interceptar todas las peticiones HTTP
// que salen desde nuestra aplicación Angular.
import { HttpInterceptorFn } from '@angular/common/http';

// inject permite utilizar servicios dentro del interceptor.
import { inject } from '@angular/core';

// Servicio donde tenemos almacenado el token JWT.
import { AuthServicio } from '../Servicios/auth-servicio';


// ==========================================================
// INTERCEPTOR JWT
// ==========================================================
// Este interceptor agrega automáticamente:
//
// Authorization: Bearer TOKEN
//
// a las peticiones protegidas que se envían hacia Spring Boot.
// ==========================================================

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  // Obtenemos nuestro servicio de autenticación.
  const authServicio = inject(AuthServicio);

  // Recuperamos el token guardado después del login.
  const token = authServicio.obtenerToken();


  // ========================================================
  // ENDPOINTS PÚBLICOS
  // ========================================================
  // Estas rutas no necesitan token.

  const esRutaPublica =
    req.url.includes('/api/auth/login') ||
    req.url.includes('/api/auth/registro') ||
    req.url.includes('/api/auth/verificar-codigo') ||
    req.url.includes('/api/auth/reenviar-codigo') ||
    req.url.includes('/api/auth/solicitar-recuperacion') ||
    req.url.includes('/api/auth/restablecer-password');


  // Si no existe token o la petición es pública,
  // enviamos la petición normalmente.
  if (!token || esRutaPublica) {

    return next(req);

  }


  // ========================================================
  // AGREGAR TOKEN JWT
  // ========================================================

  // Clonamos la petición original y agregamos
  // la cabecera Authorization.
  const peticionConToken = req.clone({

    setHeaders: {

      Authorization: `Bearer ${token}`

    }

  });


  // Enviamos la petición modificada hacia Spring Boot.
  return next(peticionConToken);

};