package com.example.demo.repository;

import com.example.demo.model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {
    // No se necesita nada aquí.
    // JpaRepository ya provee findAll(), findById(), save(), deleteById(), etc.
}
