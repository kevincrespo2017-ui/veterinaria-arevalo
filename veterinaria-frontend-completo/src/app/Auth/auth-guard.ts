// inject permite utilizar servicios dentro de un Guard funcional.
import { inject } from '@angular/core';

// CanActivateFn permite decidir si una ruta puede abrirse.
// Router nos permitirá redirigir al usuario al login.
import {
  CanActivateFn,
  Router
} from '@angular/router';

// Importamos nuestro servicio de autenticación
// para comprobar si existe un token JWT.
import { AuthServicio } from '../Servicios/auth-servicio';


// ==========================================================
// GUARD DE AUTENTICACIÓN
// ==========================================================
// Este Guard protege las páginas privadas.
//
// Si existe un token:
//      deja entrar.
//
// Si NO existe un token:
//      envía al usuario al login.
// ==========================================================

export const authGuard: CanActivateFn = (route, state) => {

  // Obtenemos el servicio de autenticación.
  const authServicio = inject(AuthServicio);

  // Obtenemos el Router para poder redirigir.
  const router = inject(Router);


  // Comprobamos si existe una sesión iniciada.
  if (authServicio.estaAutenticado()) {

    // Si existe token, permitimos entrar a la ruta.
    return true;
  }


  // Si no existe token, enviamos al usuario
  // nuevamente a la página de inicio de sesión.
  return router.createUrlTree([
    '/login'
  ]);

};