package com.example.demo.repository;

import com.example.demo.model.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PedidoRepository extends JpaRepository<Pedido, Long> {

    @Procedure(name = "sp_get_all_orders")
    List<Pedido> sp_get_all_orders();

    @Procedure(name = "sp_get_order_by_id")
    Pedido sp_get_order_by_id(@Param("p_id") Long p_id);

    @Procedure(name = "sp_create_order")
    Integer sp_create_order(@Param("p_nombre_cliente") String p_nombre_cliente,
                           @Param("p_direccion_cliente") String p_direccion_cliente,
                           @Param("p_total") double p_total);

    @Procedure(name = "sp_update_order")
    void sp_update_order(@Param("p_id") Long p_id,
                         @Param("p_nombre_cliente") String p_nombre_cliente,
                         @Param("p_direccion_cliente") String p_direccion_cliente,
                         @Param("p_total") double p_total);

    @Procedure(name = "sp_delete_order")
    void sp_delete_order(@Param("p_id") Long p_id);

    @Procedure(name = "sp_get_orders_by_customer_name")
    List<Pedido> sp_get_orders_by_customer_name(@Param("p_nombre_cliente") String p_nombre_cliente);
}
