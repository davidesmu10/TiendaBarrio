package com.example.demo.controller;

import com.example.demo.model.Resena;
import com.example.demo.service.ResenaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.List;

@RestController
@RequestMapping("/api/resenas")
@CrossOrigin(origins = "*")
public class ResenaController {

    @Autowired
    private ResenaService resenaService;

    @GetMapping("/producto/{idProducto}")
    public List<Resena> obtenerResenas(@PathVariable Long idProducto) {
        return resenaService.obtenerResenas(idProducto);
    }

    @PostMapping
    public Resena crearResena(@RequestBody Resena resena) {
        return resenaService.crearResena(resena);
    }
}
