-- Insertar horarios desde 7:00 AM hasta 7:00 PM con rangos de 30 minutos
INSERT INTO horario (id_horario, descripcion, id_empresa) VALUES (1, '07:00 AM - 07:30 AM', 2);
INSERT INTO horario (id_horario, descripcion, id_empresa) VALUES (2, '07:30 AM - 08:00 AM', 2);
INSERT INTO horario (id_horario, descripcion, id_empresa) VALUES (3, '08:00 AM - 08:30 AM', 2);
INSERT INTO horario (id_horario, descripcion, id_empresa) VALUES (4, '08:30 AM - 09:00 AM', 2);
INSERT INTO horario (id_horario, descripcion, id_empresa) VALUES (5, '09:00 AM - 09:30 AM', 2);
INSERT INTO horario (id_horario, descripcion, id_empresa) VALUES (6, '09:30 AM - 10:00 AM', 2);
INSERT INTO horario (id_horario, descripcion, id_empresa) VALUES (7, '10:00 AM - 10:30 AM', 2);
INSERT INTO horario (id_horario, descripcion, id_empresa) VALUES (8, '10:30 AM - 11:00 AM', 2);
INSERT INTO horario (id_horario, descripcion, id_empresa) VALUES (9, '11:00 AM - 11:30 AM', 2);
INSERT INTO horario (id_horario, descripcion, id_empresa) VALUES (10, '11:30 AM - 12:00 PM', 2);
INSERT INTO horario (id_horario, descripcion, id_empresa) VALUES (11, '12:00 PM - 12:30 PM', 2);
INSERT INTO horario (id_horario, descripcion, id_empresa) VALUES (12, '12:30 PM - 01:00 PM', 2);
INSERT INTO horario (id_horario, descripcion, id_empresa) VALUES (13, '01:00 PM - 01:30 PM', 2);
INSERT INTO horario (id_horario, descripcion, id_empresa) VALUES (14, '01:30 PM - 02:00 PM', 2);
INSERT INTO horario (id_horario, descripcion, id_empresa) VALUES (15, '02:00 PM - 02:30 PM', 2);
INSERT INTO horario (id_horario, descripcion, id_empresa) VALUES (16, '02:30 PM - 03:00 PM', 2);
INSERT INTO horario (id_horario, descripcion, id_empresa) VALUES (17, '03:00 PM - 03:30 PM', 2);
INSERT INTO horario (id_horario, descripcion, id_empresa) VALUES (18, '03:30 PM - 04:00 PM', 2);
INSERT INTO horario (id_horario, descripcion, id_empresa) VALUES (19, '04:00 PM - 04:30 PM', 2);
INSERT INTO horario (id_horario, descripcion, id_empresa) VALUES (20, '04:30 PM - 05:00 PM', 2);
INSERT INTO horario (id_horario, descripcion, id_empresa) VALUES (21, '05:00 PM - 05:30 PM', 2);
INSERT INTO horario (id_horario, descripcion, id_empresa) VALUES (22, '05:30 PM - 06:00 PM', 2);
INSERT INTO horario (id_horario, descripcion, id_empresa) VALUES (23, '06:00 PM - 06:30 PM', 2);
INSERT INTO horario (id_horario, descripcion, id_empresa) VALUES (24, '06:30 PM - 07:00 PM', 2);

-- Si prefieres usar una secuencia para el id_horario, puedes crear primero la secuencia:
/*
CREATE SEQUENCE horario_seq START WITH 1 INCREMENT BY 1;

-- Y luego usar nextval en los INSERT:
INSERT INTO horario (id_horario, descripcion, id_empresa) VALUES (nextval('horario_seq'), '07:00 AM - 07:30 AM', 2);
*/ 