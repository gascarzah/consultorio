-- Reiniciar la secuencia de empleado
SELECT setval(pg_get_serial_sequence('empleado', 'id_empleado'), 
    COALESCE((SELECT MAX(id_empleado) FROM empleado), 0) + 1, false); 