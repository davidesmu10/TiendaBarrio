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

    public Resena crearResena(Resena resena) {
        resenaRepository.sp_create_review(
            resena.getProducto().getId(),
            resena.getNombreCliente(),
            resena.getCalificacion(),
            resena.getComentario()
        );
        // A diferencia de pedidos, el SP de reseñas no devuelve un ID,
        // por lo que devolvemos el objeto original. 
        // Considerar ajustar el SP si se necesita el ID de vuelta.
        return resena;
    }

    public List<Resena> obtenerResenasPorProducto(Long productoId) {
        return resenaRepository.sp_get_reviews_by_product_id(productoId);
    }
}
