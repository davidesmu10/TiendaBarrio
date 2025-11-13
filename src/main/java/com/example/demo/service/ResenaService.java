package com.example.demo.service;

import com.example.demo.model.Resena;
import com.example.demo.repository.ResenaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ResenaService {

    @Autowired
    private ResenaRepository resenaRepository;

    public List<Resena> obtenerResenas(Long idProducto) {
        return resenaRepository.findByIdProducto(idProducto);
    }

    public Resena crearResena(Resena resena) {
        return resenaRepository.save(resena);
    }
}
