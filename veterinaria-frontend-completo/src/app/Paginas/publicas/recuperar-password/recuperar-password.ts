import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthServicio } from '../../../Servicios/auth-servicio';

const validarConfirmacionPassword: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const password = control.get('nuevaPassword')?.value;
  const confirmar = control.get('confirmarPassword')?.value;

  if (!password || !confirmar) {
    return null;
  }

  return password === confirmar
    ? null
    : { passwordsDiferentes: true };
};

@Component({
  selector: 'app-recuperar-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './recuperar-password.html',
  styleUrl: './recuperar-password.scss'
})
export class RecuperarPassword {

  correoForm: FormGroup;
  restablecerForm: FormGroup;

  paso: 'correo' | 'codigo' = 'correo';

  correo = '';
  cargando = false;
  reenviando = false;
  mostrarNuevaPassword = false;
  mostrarConfirmacionPassword = false;
  mensajeError = '';
  mensajeExito = '';

  constructor(
    private fb: FormBuilder,
    private authServicio: AuthServicio,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {
    this.correoForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]]
    });

    this.restablecerForm = this.fb.group({
      codigo: [
        '',
        [
          Validators.required,
          Validators.pattern(/^\d{6}$/)
        ]
      ],
      nuevaPassword: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(72)
        ]
      ],
      confirmarPassword: ['', Validators.required]
    }, {
      validators: validarConfirmacionPassword
    });
  }

  solicitarCodigo(): void {
    if (this.cargando || this.correoForm.invalid) {
      this.correoForm.markAllAsTouched();
      return;
    }

    this.mensajeError = '';
    this.mensajeExito = '';
    this.cargando = true;

    this.correo = String(
      this.correoForm.get('correo')?.value ?? ''
    ).trim();

    this.authServicio.solicitarRecuperacion(this.correo).subscribe({
      next: (respuesta) => {
        this.cargando = false;
        this.paso = 'codigo';
        this.mensajeExito =
          respuesta?.detalle ||
          'Si el correo corresponde a una cuenta verificada, recibirás un código de seis dígitos. Revisa también spam.';
        this.cd.detectChanges();
      },
      error: (error) => {
        this.cargando = false;
        this.mensajeError =
          error?.error?.mensaje ||
          error?.error?.message ||
          'No fue posible procesar la solicitud. Intenta nuevamente.';
        this.cd.detectChanges();
      }
    });
  }

  reenviarCodigo(): void {
    if (this.reenviando || this.cargando || !this.correo) {
      return;
    }

    this.mensajeError = '';
    this.mensajeExito = '';
    this.reenviando = true;

    this.authServicio.solicitarRecuperacion(this.correo).subscribe({
      next: (respuesta) => {
        this.reenviando = false;
        this.mensajeExito =
          respuesta?.detalle ||
          'Si la cuenta está habilitada, se enviará un nuevo código. Revisa tu correo y spam.';
        this.cd.detectChanges();
      },
      error: (error) => {
        this.reenviando = false;
        this.mensajeError =
          error?.error?.mensaje ||
          error?.error?.message ||
          'No fue posible solicitar otro código. Intenta nuevamente.';
        this.cd.detectChanges();
      }
    });
  }

  limpiarCodigoRecuperacion(evento: Event): void {
    const input = evento.target as HTMLInputElement;
    const limpio = input.value.replace(/\D/g, '').slice(0, 6);

    if (input.value !== limpio) {
      input.value = limpio;
    }

    this.restablecerForm.get('codigo')?.setValue(limpio);
  }

  restablecerPassword(): void {
    if (this.cargando || this.restablecerForm.invalid || !this.correo) {
      this.restablecerForm.markAllAsTouched();

      if (this.restablecerForm.hasError('passwordsDiferentes')) {
        this.mensajeError = 'Las contraseñas no coinciden.';
      }

      return;
    }

    this.mensajeError = '';
    this.mensajeExito = '';
    this.cargando = true;

    const codigo = String(
      this.restablecerForm.get('codigo')?.value ?? ''
    ).trim();

    const nuevaPassword = String(
      this.restablecerForm.get('nuevaPassword')?.value ?? ''
    );

    this.authServicio
      .restablecerPassword(this.correo, codigo, nuevaPassword)
      .subscribe({
        next: (respuesta) => {
          this.cargando = false;
          this.mensajeExito =
            respuesta?.detalle ||
            'Tu contraseña fue actualizada. Ya puedes iniciar sesión.';
          this.restablecerForm.reset();

          this.cd.detectChanges();

          setTimeout(() => {
            void this.router.navigate(['/login']);
          }, 1800);
        },
        error: (error) => {
          this.cargando = false;
          this.mensajeError =
            error?.error?.mensaje ||
            error?.error?.message ||
            'El código es incorrecto o venció. Solicita uno nuevo.';
          this.cd.detectChanges();
        }
      });
  }

  alternarNuevaPassword(): void {
    this.mostrarNuevaPassword = !this.mostrarNuevaPassword;
  }

  alternarConfirmacionPassword(): void {
    this.mostrarConfirmacionPassword = !this.mostrarConfirmacionPassword;
  }

  volverAlCorreo(): void {
    this.paso = 'correo';
    this.mensajeError = '';
    this.mensajeExito = '';
    this.restablecerForm.reset();
  }
}
