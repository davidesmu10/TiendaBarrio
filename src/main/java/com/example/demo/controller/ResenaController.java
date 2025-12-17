package com.example.demo.controller;

import com.example.demo.model.Resena;
import com.example.demo.service.ResenaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/resenas")
public class ResenaController {

    @Autowired
    private ResenaService resenaService;

    @GetMapping("/producto/{productoId}")
    public ResponseEntity<List<Resena>> getResenasPorProducto(@PathVariable Long productoId) {
        List<Resena> resenas = resenaService.obtenerResenasPorProducto(productoId);
        return new ResponseEntity<>(resenas, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Resena> crearResena(@RequestBody Resena resena) {
        Resena nuevaResena = resenaService.crearResena(resena);
        return new ResponseEntity<>(nuevaResena, HttpStatus.CREATED);
    }
}
