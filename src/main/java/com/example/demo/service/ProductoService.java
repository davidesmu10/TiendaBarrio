package com.example.demo.service;

import com.example.demo.model.Producto;
import com.example.demo.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class ProductoService {

    @Autowired
    private ProductoRepository productoRepository;

    @Transactional(readOnly = true)
    public List<Producto> obtenerTodosLosProductos() {
        return productoRepository.sp_get_all_products();
    }

    @Transactional(readOnly = true)
    public Optional<Producto> obtenerProductoPorId(Long id) {
        Producto producto = productoRepository.sp_get_product_by_id(id);
        return Optional.ofNullable(producto);
    }

    @Transactional
    public Producto crearProducto(Producto producto) {
        // El procedimiento de creación devuelve el ID del nuevo producto
        Integer newId = productoRepository.sp_create_product(
            producto.getNombre(),
            producto.getDescripcion(),
            producto.getPrecio(),
            producto.getStock(),
            producto.getImagenUrl(),
            producto.getRatingPromedio(),
            producto.getCategoria() != null ? producto.getCategoria().getId() : null
        );
        producto.setId(newId.longValue());
        return producto;
    }

    @Transactional
    public Producto actualizarProducto(Long id, Producto producto) {
        productoRepository.sp_update_product(
            id,
            producto.getNombre(),
            producto.getDescripcion(),
            producto.getPrecio(),
            producto.getStock(),
            producto.getImagenUrl(),
            producto.getRatingPromedio(),
            producto.getCategoria() != null ? producto.getCategoria().getId() : null
        );
        producto.setId(id);
        return producto;
    }

    @Transactional
    public void eliminarProducto(Long id) {
        productoRepository.sp_delete_product(id);
    }
}
