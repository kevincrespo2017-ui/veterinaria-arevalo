package com.veterinaria.veterinaria.controller;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.veterinaria.veterinaria.dto.AsistenteChatRequest;
import com.veterinaria.veterinaria.dto.AsistenteChatResponse;
import com.veterinaria.veterinaria.service.AsistenteService;

@RestController
@RequestMapping("/api/asistente")
public class AsistenteController {

    private final AsistenteService asistenteService;

    public AsistenteController(AsistenteService asistenteService) {
        this.asistenteService = asistenteService;
    }

    @PostMapping("/chat")
    @PreAuthorize("hasAnyRole('ADMIN','VETERINARIO','USER')")
    public ResponseEntity<AsistenteChatResponse> conversar(
            @Valid @RequestBody AsistenteChatRequest request) {
        return ResponseEntity.ok(new AsistenteChatResponse(
                asistenteService.responder(request.getMensaje())));
    }
}
