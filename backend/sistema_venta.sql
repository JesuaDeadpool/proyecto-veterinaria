Create database DB_Sistema_Venta;

CREATE USER 'cristhian'@'localhost' IDENTIFIED BY 'Honduras2025';
GRANT ALL PRIVILEGES ON DB_Sistema_Venta.* TO 'cristhian'@'localhost';
FLUSH PRIVILEGES;

Use DB_Sistema_Venta;

Create table Usuario(
	id_usuario int not null primary key auto_increment,
    nombre varchar (30),
    correo_electronico varchar (40),
    contraseña varchar(255)
);

Create table Cliente(
	id_cliente int not null primary key auto_increment,
    nombre varchar (30),
    telefono varchar(20)
);

Create table Venta (
	id_venta int not null primary key auto_increment,
    id_usuario int not null,
    foreign key(id_usuario) references Usuario(id_usuario),
    id_cliente int not null,
    foreign key(id_cliente) references Cliente(id_cliente),
    fecha date,
    total Decimal(10,2)
);



Create table Producto(
	id_producto int not null primary key auto_increment,
    nombre varchar(30),
    precio Decimal(10,2),
    stock int
);

Create table DetalleVenta (
	id_detalle_venta int not null primary key auto_increment,
    id_venta int not null,
    foreign key(id_venta) references Venta(id_venta),
    id_producto int not null,
    foreign key(id_producto) references Producto(id_producto),
    cantidad Decimal(10,2),
    subtotal Decimal(10,2)
);

Create table DatosVeterinaria(
	id_datos_veterinaria int primary key auto_increment,
    nombre varchar(50),
    telefono varchar(20),
    correo_electronico varchar(40),
    direccion varchar(100)
);

Insert into Producto(nombre,precio,stock) values ('Champús antiparasitarios',259,5);
Insert into Producto(nombre,precio,stock) values ('Cepillos para grooming',45,10);
Insert into Producto(nombre,precio,stock) values ('Tijeras profesionales',30,10);
Insert into Producto(nombre,precio,stock) values ('Antibióticos inyectables',145,10);
Insert into Producto(nombre,precio,stock) values ('Antiparasitarios internos',135,10);

Insert into Cliente(nombre,telefono) values ('Maria','50498101405');
Insert into Cliente(nombre,telefono) values ('Fernando','50499054165');
Insert into Cliente(nombre,telefono) values ('Guillermo','50498061038');
Insert into Cliente(nombre,telefono) values ('Marisol','50499650184');
Insert into Cliente(nombre,telefono) values ('Victor','50499011384');

    
Insert into Usuario(nombre,correo_electronico,contraseña) values ('Cristhian','cris01@gmail.com','Honduras2025');
Insert into Usuario(nombre,correo_electronico,contraseña) values ('Miguel','miguel_14@gmail.com','Barcelona1994');
Insert into Usuario(nombre,correo_electronico,contraseña) values ('Nicole','nicky07@gmail.com','Aventura2000');

update usuario set contraseña='$2b$10$Sy/7KNYyvufFSEhanG4E.OTkDtytXhnB39rSRkIE0pb1fRrx5iINu' where nombre='Cristhian';
update usuario set contraseña='$2b$10$r5Cna9KkdYT26M4ZWZKAa.hvUwIx2F3KyhkoB6RTa1UuptFjdJ.ti' where nombre='Miguel';
update usuario set contraseña='$2b$10$frtrQXRTTZebN4yBvjwKkeAaMrPeLjJF/WHeuRmuxL9Ov6vdlzuze' where nombre='Nicole';

Insert into Venta(id_venta,id_usuario,id_cliente,fecha,total) values (1,1,1,"2025-09-21",45);
Insert into DetalleVenta(id_detalle_venta,id_venta,id_producto,cantidad,subtotal) values (1,1,2,1,45);

Insert into Venta(id_venta,id_usuario,id_cliente,fecha,total) values (2,3,5,"2025-09-20",30);
Insert into DetalleVenta(id_detalle_venta,id_venta,id_producto,cantidad,subtotal) values (2,2,3,2,30);

-- Registro automático de fecha/hora y usuario que realizó la venta.
Select 		v.id_venta,v.fecha, 
			u.nombre as NombreUsuario, u.id_usuario as CodigoUsuario
			from Venta v
			Join Usuario u ON v.id_venta = u.id_usuario;


Select precio, stock from producto where id_producto=1;

ALTER TABLE Usuario
ADD UNIQUE (nombre,correo_electronico);

Select * from Usuario;
Select * from Cliente;
Select * from Venta;
Select * from Producto;
Select * from DetalleVenta;

Delete from Usuario where id_usuario IS NULL and nombre is null and correo_electronico is null and contraseña is null;

SELECT id_usuario FROM Usuario;
INSERT INTO DatosVeterinaria(id_datos_veterinaria,nombre,telefono,correo_electronico,direccion) 
			values (1,"El Amigo Rescatado","+504-2566-4025","rescate_amigo@gmail.com","Colonia Los Laureles, 20 calle 7 avenida, San Pedro Sula, HN");






-- FacturaEjemplo

Select v.id_venta,v.fecha,
		-- DatosVeterinaria
		d.nombre as NombreVeterinaria, d.telefono as VeterinariaTelefono,d.correo_electronico as Veterinaria_Correo,
        d.direccion as direccion, 
        
        -- DatosCliente
        c.nombre as Cliente, c.telefono as Telefono,
        
        -- ProductosAdquiridos
        p.nombre as Producto_Nombre, 
        p.precio as Precio,
	
		-- DetallesVenta
        dv.cantidad as Cantidad
        
		From Venta v
        Join Cliente c on v.id_cliente = c.id_cliente
        Join Usuario u on v.id_usuario = u.id_usuario
		Join DetalleVenta dv on dv.id_venta = v.id_venta
        Join Producto p on dv.id_producto = p.id_producto
        Join DatosVeterinaria d on d.id_datos_veterinaria =1;


