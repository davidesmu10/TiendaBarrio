package com.example.demo.service;

import com.example.demo.model.Producto;
import com.example.demo.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductoService {

    @Autowired
    private ProductoRepository productoRepository;

    public List<Producto> obtenerProductos() {
        return productoRepository.sp_get_all_products();
    }

    public Optional<Producto> obtenerProductoPorId(Long id) {
        return Optional.ofNullable(productoRepository.sp_get_product_by_id(id));
    }
}
