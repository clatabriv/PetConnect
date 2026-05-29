-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: PetConnectRes
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

--
-- Table structure for table "animales"
--

--
-- Dumping data for table "animales"
--

INSERT INTO "animales" VALUES (9,3,'Gato','DISPONIBLE','En tratamiento','https://res.cloudinary.com/dv4woelyt/image/upload/v1779115952/fwog3yhlldlmmxoqeekx.jpg','Mau','Bombai','Bilbao',11,'Gato negro de pelo brillante, elegante y algo tímido al principio, pero muy dulce cuando gana confianza. Adora las mantitas suaves y las siestas largas.','Macho'),(13,3,'Gato','EN_PROCESO','Regular','https://res.cloudinary.com/dv4woelyt/image/upload/v1779115970/yq8ujqmpw3kbmih0jxr7.jpg','Sunny','Común europeo','Sevilla',11,'Gatita naranja atigrada de ojos verdes, curiosa y juguetona. Le encanta perseguir juguetes, dormir al sol y recibir caricias detrás de las orejas.','Hembra'),(14,2,'Perro','EN_PROCESO','Regular','https://res.cloudinary.com/dv4woelyt/image/upload/v1779114239/j5uwwvtw0vtuy0ns41cj.jpg','Coco','Chiguagua','Málaga',14,'Coco es un chihuahua pequeño, cariñoso y muy juguetón, con una gran personalidad pese a su tamaño.','Macho'),(21,1,'Gato','DISPONIBLE','Regular','https://res.cloudinary.com/dv4woelyt/image/upload/v1779115991/hk47wky0wfqrucpn3s2l.jpg','Mayonesa','','Madrid',11,'Mayonesa es una gatita llena de energía y personalidad. Es sociable, divertida y siempre está explorando cada rincón con entusiasmo.','Hembra'),(23,10,'Perro','DISPONIBLE','Regular','https://res.cloudinary.com/dv4woelyt/image/upload/v1779184107/qh0rr2sjzxicong1wbiy.jpg','Laika','Pastor Belga','Málaga',14,'Laika es una perrita mestiza de color blanco, tranquila, fiel y muy dulce.','Hembra'),(25,1,'Cobaya','DISPONIBLE','Bueno','https://res.cloudinary.com/dv4woelyt/image/upload/v1779115132/a5sqcyncyp0hjrsgxji4.jpg','Trinidad','','Sevilla',18,'Trini ha perdido a su hermanito. Solo adopción conjunta.','Hembra'),(26,1,'Gato','DISPONIBLE','Bueno','https://res.cloudinary.com/dv4woelyt/image/upload/v1779115301/cxzn9lcane1epzy8jjdy.jpg','Dash','','Sevilla',18,'Dash es un cobaya muy activo y divertido. Es la pareja sentimental de Trinidad. Solo se adoptan juntos.','Macho'),(30,1,'Gato','DISPONIBLE','Bueno','https://res.cloudinary.com/dv4woelyt/image/upload/v1779116043/e8jowiznhifczb1gogls.jpg','Kike','Siamés','Almeria',11,'Kike es un gato siamés elegante y cariñoso, muy comunicativo y con una mirada azul intensa que lo hace especial.','Macho'),(37,3,'Conejo','DISPONIBLE','Regular','https://res.cloudinary.com/dv4woelyt/image/upload/v1779115261/qqozsscrch8s6dwuwb2k.jpg','Jason','','Madrid',18,'Jason es un conejo rescatado de una tienda de animales donde no lo alimentaban.','Macho'),(38,2,'Perro','DISPONIBLE','Sano','https://res.cloudinary.com/dv4woelyt/image/upload/v1779113108/ebphlorr2m4zbi8laxtj.jpg','Cuzco','Galgo','Málaga',14,'Cuzco es un perro que rescatamos de una hacienda de las afueras de Málaga. Tenía heridas de bala en el lomo pero ahora está perfecto a la espera de una nueva familia que lo ame.','Macho'),(39,7,'Perro','EN_PROCESO','Bueno','https://res.cloudinary.com/dv4woelyt/image/upload/v1779183725/apmgt4g6opjqkpaciabb.jpg','Bimba','Golden Retriever','Málaga',14,'Bimba es una golden retriever alegre, cariñosa y muy sociable, siempre llena de energía y ternura.','Hembra'),(40,3,'Conejo','ADOPTADO','Bueno','https://res.cloudinary.com/dv4woelyt/image/upload/v1779115591/ljjsltbi5qurfhn4wm0j.jpg','Pipas','','Sevilla',18,'Pipas es un conejo pequeño, curioso y activo, siempre explorando su entorno y llenando su casita de energía y movimiento.','Macho'),(42,2,'Perro','DISPONIBLE','Bueno','https://res.cloudinary.com/dv4woelyt/image/upload/v1779202559/bqv4oyxukwaammmp2vpp.jpg','Bilbo','Beagle','Bilbao',33,'Bilbo es un Beagle abandonado en verano de 2025 con tan solo un año de vida. Es nervioso porque es pequeño y necesita una segunda oportunidad.','Macho');

UN

--
-- Table structure for table "favoritos"
--

--
-- Dumping data for table "favoritos"
--

INSERT INTO "favoritos" VALUES (34,'2026-05-15 12:05:21.000000',13,26),(35,'2026-05-15 12:05:23.000000',13,25),(63,'2026-05-18 13:43:49.000000',13,14),(109,'2026-05-20 16:09:54.000000',5,23),(110,'2026-05-20 16:09:56.000000',5,21),(111,'2026-05-20 16:09:57.000000',5,14),(112,'2026-05-20 16:09:58.000000',5,30),(113,'2026-05-20 16:10:00.000000',5,37),(114,'2026-05-20 16:10:01.000000',5,38),(123,'2026-05-21 11:05:28.000000',37,23),(125,'2026-05-21 11:38:55.000000',38,30),(127,'2026-05-21 11:39:03.000000',38,21),(129,'2026-05-21 11:50:31.000000',38,13),(130,'2026-05-21 17:59:10.000000',37,14),(132,'2026-05-21 17:59:17.000000',37,39),(134,'2026-05-22 09:45:19.000000',43,40),(135,'2026-05-22 09:46:06.000000',43,25);

UN

--
-- Table structure for table "solicitudes_adopcion"
--

--
-- Dumping data for table "solicitudes_adopcion"
--

INSERT INTO "solicitudes_adopcion" VALUES (1,'PENDIENTE','2026-05-15 12:06:35.000000','Me gustaría adoptar a Laika porque es hermosa.',13,23),(29,'PENDIENTE','2026-05-21 17:59:59.000000','Me encantaría conocer a Laika.',37,23),(30,'PENDIENTE','2026-05-22 09:46:01.000000','Me gustaría adoptar a Trinidad y a Dash.',43,25);

UN

--
-- Table structure for table "usuarios"
--

--
-- Dumping data for table "usuarios"
--

INSERT INTO "usuarios" VALUES (5,'clara@gmail.com','Clara','$2a$10$FtSrpUtRYGSUuEyTrw1Wh.5xBOqOLeLhxbW1osmFUO54s0kX5tzLa','ADMIN',NULL,'',NULL,NULL,'\0'),(11,'RefGatos@gmail.com','Refugio de Gatos','$2a$10$PTpY3ijvRtDSCu.Qpww/6.XmbyGJJAOaxOiK/Rq4SjBHtb/Zcw6Q.','REFUGIO','Un refugio de gatos acogedor y tranquilo, dedicado al cuidado, rescate y bienestar felino. Un espacio seguro donde cada gato recibe atención, cariño y la oportunidad de encontrar un hogar lleno de amor. Rodeado de zonas cómodas para descansar, jugar y socializar, el refugio trabaja para ofrecer una segunda oportunidad a gatos abandonados o en situación vulnerable, promoviendo además la adopción responsable y el respeto por los animales.','https://res.cloudinary.com/dv4woelyt/image/upload/v1779115889/ovlfbqz7fimxwhtsu0a2.jpg','676545344',NULL,''),(13,'marta@gmail.com','Marta','$2a$10$aQchLhK76Ixxq4B.5uV2G.4EJaD0YZWyn2FtUqV/GhZndVqcRm0wW','ADOPTANTE','','https://res.cloudinary.com/dv4woelyt/image/upload/v1779358019/xxfka4ze23jc149tsw2e.jpg',NULL,NULL,'\0'),(14,'RefPerros@gmail.com','Refugio de Perros','$2a$10$7pywB0JficzGrc.tbUAWb.vuVOyc.O6QipSydEHMRyPjskFsnuLhK','REFUGIO','Somos un refugio de perros. Para contactar con nosotros envién un mensaje por correo o llamen a nuestro número de teléfono. ','https://res.cloudinary.com/dv4woelyt/image/upload/v1779113424/rvqidjcawa1etwlhd50k.jpg','665123455',NULL,''),(18,'RefRoedores@gmail.com','Refugio de roedores','$2a$10$6vvleERW2gnEmnO8CHTvg.L.gyK3jiwBUaNIgjtObXRhIc8VB/kL.','REFUGIO','Un refugio de roedores dedicado a rescatar, cuidar y rehabilitar pequeños animales como hámsters, cobayas y ratones. Allí reciben atención veterinaria, alimentación adecuada y un entorno seguro hasta que pueden ser adoptados por familias responsables que les den un hogar definitivo lleno de cariño.','https://res.cloudinary.com/dv4woelyt/image/upload/v1779115394/pyvbhhio2jhz60zrqhha.jpg','667876888',NULL,''),(33,'RefCandela@gmail.com','Refugio Candela','$2a$10$NvTsmutpf6c2BPlWVgy9gudSO0XFJFss9LZeQQJm4TGVFABQOiewq','REFUGIO','La Candela es un refugio de animales dedicado al rescate, cuidado y búsqueda de un hogar para perros y gatos en situación de abandono. Un espacio lleno de cariño y segundas oportunidades, donde cada animal recibe atención, protección y el amor que merece mientras espera encontrar una familia definitiva. En La Candela creemos en la adopción responsable, el respeto animal y la importancia de construir un mundo más compasivo para todos.','https://res.cloudinary.com/dv4woelyt/image/upload/v1779202225/vlfgw6x88xarlfmfumii.jpg','657123444',NULL,''),(37,'Ana@gmail.com','ana','$2a$10$VCdbc35GOyKHGQERPVb6OenfEGvFgBAzJaAfNKEum7p4CTUnd5eGC','ADOPTANTE','Me encantaría adoptar un perrito. ','https://res.cloudinary.com/dv4woelyt/image/upload/v1779375679/h0kb9m75suevgyb0ji9r.jpg',NULL,'Sevilla','\0'),(38,'guille@gmail.com','Guillermo','$2a$10$YwAp2fuX186XxPxQnJDw5.pT9Osnk.SLmCccN2IQOrg/sDOiR3kee','ADOPTANTE','Hola me llamo Guillermo, tengo 27 años y vivo en Zaragoza. Estoy buscando un gato y se género me da igual. ','https://res.cloudinary.com/dv4woelyt/image/upload/v1779354993/qlzmreei6bwhg3xl6l10.jpg',NULL,'Zaragoza','\0'),(43,'usuario@gmail.com','usuario','$2a$10$0gQ0APbqPm5lhYEZZynLpecCDinMafY//bWkWOhS7zOLot4nD1Jh2','ADOPTANTE',NULL,NULL,NULL,NULL,'');

UN

-- Dump completed on 2026-05-22 13:28:22
