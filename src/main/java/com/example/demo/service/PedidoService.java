package com.example.demo.service;

import com.example.demo.model.Pedido;
import com.example.demo.repository.PedidoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PedidoService {

    @Autowired
    private PedidoRepository pedidoRepository;

    public Pedido crearPedido(Pedido pedido) {
        // El procedimiento almacenado sp_create_order devuelve el ID del nuevo pedido.
        Integer newId = pedidoRepository.sp_create_order(
            pedido.getNombreCliente(), 
            pedido.getDireccionCliente(), 
            pedido.getTotal()
        );
        // Asignamos el nuevo ID al objeto y lo devolvemos.
        pedido.setId(newId.longValue());
        return pedido;
    }

    public List<Pedido> obtenerPedidosCliente(String nombreCliente) {
        return pedidoRepository.sp_get_orders_by_customer_name(nombreCliente);
    }
}
