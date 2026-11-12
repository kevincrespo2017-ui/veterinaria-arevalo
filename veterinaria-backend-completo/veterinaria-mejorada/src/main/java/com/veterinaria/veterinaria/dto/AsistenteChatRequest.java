package com.veterinaria.veterinaria.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class AsistenteChatRequest {
    @NotBlank(message = "Escribe una pregunta para el asistente")
    @Size(max = 2000, message = "El mensaje no puede superar 2000 caracteres")
    private String mensaje;

    public String getMensaje() { return mensaje; }
    public void setMensaje(String mensaje) { this.mensaje = mensaje; }
}
