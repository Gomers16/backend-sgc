-- MySQL dump 10.13  Distrib 8.0.44, for Linux (x86_64)
--
-- Host: localhost    Database: sgc
-- ------------------------------------------------------
-- Server version	8.0.44-0ubuntu0.24.04.2

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `adonis_schema`
--

DROP TABLE IF EXISTS `adonis_schema`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `adonis_schema` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL,
  `migration_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `adonis_schema`
--

LOCK TABLES `adonis_schema` WRITE;
/*!40000 ALTER TABLE `adonis_schema` DISABLE KEYS */;
INSERT INTO `adonis_schema` VALUES (1,'database/migrations/1752570000000_create_ciudades_table',1,'2025-12-15 18:59:00'),(2,'database/migrations/1752601341991_create_razon_social_table',1,'2025-12-15 18:59:00'),(3,'database/migrations/1752601538003_create_entidades_salud_table',1,'2025-12-15 18:59:00'),(4,'database/migrations/1752601617317_create_roles_table',1,'2025-12-15 18:59:00'),(5,'database/migrations/1752601692000_create_sedes_table',1,'2025-12-15 18:59:00'),(6,'database/migrations/1752601692900_create_cargos_table',1,'2025-12-15 18:59:00'),(7,'database/migrations/1752601692958_create_usuarios_table',1,'2025-12-15 18:59:00'),(8,'database/migrations/1752601767160_create_contrato_table',1,'2025-12-15 18:59:00'),(9,'database/migrations/1752601917327_create_items_table',1,'2025-12-15 18:59:00'),(10,'database/migrations/1752601995717_create_permisos_table',1,'2025-12-15 18:59:00'),(11,'database/migrations/1752602038920_create_permiso_items_table',1,'2025-12-15 18:59:00'),(12,'database/migrations/1752602114012_create_rol_permiso_items_table',1,'2025-12-15 18:59:00'),(13,'database/migrations/1752612194078_create_contrato_pasos_table',1,'2025-12-15 18:59:01'),(14,'database/migrations/1752687708028_create_auth_access_tokens_table',1,'2025-12-15 18:59:01'),(15,'database/migrations/1752760000000_create_servicios_table',1,'2025-12-15 18:59:01'),(16,'database/migrations/1754318241886_create_contrato_eventos_table',1,'2025-12-15 18:59:01'),(17,'database/migrations/1754402092451_create_contrato_historial_estados_table',1,'2025-12-15 18:59:01'),(18,'database/migrations/1754490600879_create_contrato_salarios_table',1,'2025-12-15 18:59:01'),(19,'database/migrations/1754490631331_create_alter_contratos_add_termino_and_drop_salarios_table',1,'2025-12-15 18:59:01'),(20,'database/migrations/1755106537206_create_contrato_cambios_table',1,'2025-12-15 18:59:01'),(21,'database/migrations/1758644517726_create_clases_vehiculos_table',1,'2025-12-15 18:59:01'),(22,'database/migrations/1758645786274_create_clientes_table',1,'2025-12-15 18:59:01'),(23,'database/migrations/1758646459407_create_vehiculos_table',1,'2025-12-15 18:59:01'),(24,'database/migrations/1758646600000_create_captacion_canales_table',1,'2025-12-15 18:59:01'),(25,'database/migrations/1758646982056_create_agentes_captacions_table',1,'2025-12-15 18:59:01'),(26,'database/migrations/1758647000000_create_agente_canal_membresias',1,'2025-12-15 18:59:01'),(27,'database/migrations/1758647400000_create_conductores_table',1,'2025-12-15 18:59:02'),(28,'database/migrations/1758647435984_create_turnos_rtms_table',1,'2025-12-15 18:59:02'),(29,'database/migrations/1759154693735_create_convenios_table',1,'2025-12-15 18:59:02'),(30,'database/migrations/1759154741077_create_asesor_convenio_asignaciones_table',1,'2025-12-15 18:59:02'),(31,'database/migrations/1759154774320_create_prospectos_table',1,'2025-12-15 18:59:03'),(32,'database/migrations/1759154804286_create_asesor_prospecto_asignaciones_table',1,'2025-12-15 18:59:03'),(33,'database/migrations/1759154950000_create_captacion_dateos_table',1,'2025-12-15 18:59:04'),(34,'database/migrations/1759155000000_create_comisiones_table',1,'2025-12-15 18:59:05'),(35,'database/migrations/1759160000000_create_facturacion_tickets_table',1,'2025-12-15 18:59:05'),(36,'database/migrations/1762375200888_create_certificaciones_table',1,'2025-12-15 18:59:06'),(37,'database/migrations/1764776177801_create_fix_abilities_column_for_mysqls_table',1,'2025-12-15 18:59:06');
/*!40000 ALTER TABLE `adonis_schema` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `adonis_schema_versions`
--

DROP TABLE IF EXISTS `adonis_schema_versions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `adonis_schema_versions` (
  `version` int unsigned NOT NULL,
  PRIMARY KEY (`version`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `adonis_schema_versions`
--

LOCK TABLES `adonis_schema_versions` WRITE;
/*!40000 ALTER TABLE `adonis_schema_versions` DISABLE KEYS */;
INSERT INTO `adonis_schema_versions` VALUES (2);
/*!40000 ALTER TABLE `adonis_schema_versions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `agente_canal_membresias`
--

DROP TABLE IF EXISTS `agente_canal_membresias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `agente_canal_membresias` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `agente_id` int unsigned NOT NULL,
  `canal_id` int unsigned NOT NULL,
  `is_default` tinyint(1) NOT NULL DEFAULT '0',
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_agente_canal` (`agente_id`,`canal_id`),
  KEY `idx_membresias_agente_activo` (`agente_id`,`activo`),
  KEY `idx_membresias_canal_activo` (`canal_id`,`activo`),
  CONSTRAINT `agente_canal_membresias_agente_id_foreign` FOREIGN KEY (`agente_id`) REFERENCES `agentes_captacions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `agente_canal_membresias_canal_id_foreign` FOREIGN KEY (`canal_id`) REFERENCES `captacion_canales` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `agente_canal_membresias`
--

LOCK TABLES `agente_canal_membresias` WRITE;
/*!40000 ALTER TABLE `agente_canal_membresias` DISABLE KEYS */;
/*!40000 ALTER TABLE `agente_canal_membresias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `agentes_captacions`
--

DROP TABLE IF EXISTS `agentes_captacions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `agentes_captacions` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `tipo` enum('ASESOR_COMERCIAL','ASESOR_CONVENIO','ASESOR_TELEMERCADEO') COLLATE utf8mb4_unicode_ci NOT NULL,
  `usuario_id` int unsigned DEFAULT NULL,
  `nombre` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `telefono` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `doc_tipo` enum('CC','NIT') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `doc_numero` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `agentes_captacions_doc_tipo_doc_numero_unique` (`doc_tipo`,`doc_numero`),
  UNIQUE KEY `agentes_captacions_usuario_id_unique` (`usuario_id`),
  KEY `agentes_captacions_telefono_index` (`telefono`),
  KEY `agentes_captacions_tipo_activo_index` (`tipo`,`activo`),
  CONSTRAINT `agentes_captacions_usuario_id_foreign` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `agentes_captacions`
--

LOCK TABLES `agentes_captacions` WRITE;
/*!40000 ALTER TABLE `agentes_captacions` DISABLE KEYS */;
INSERT INTO `agentes_captacions` VALUES (1,'ASESOR_COMERCIAL',13,'Juan Morales','3010000002',NULL,NULL,1,'2025-12-15 18:59:16','2025-12-15 18:59:16'),(2,'ASESOR_COMERCIAL',14,'Diana Castro','3010000003',NULL,NULL,1,'2025-12-15 18:59:16','2025-12-15 18:59:16'),(3,'ASESOR_CONVENIO',15,'Taller El Cambio','3011000001',NULL,NULL,1,'2025-12-15 18:59:16','2025-12-15 18:59:16'),(4,'ASESOR_CONVENIO',16,'Parqueadero Central','3011000002',NULL,NULL,1,'2025-12-15 18:59:16','2025-12-15 18:59:16'),(5,'ASESOR_CONVENIO',17,'Lavadero TurboWash','3011000003',NULL,NULL,1,'2025-12-15 18:59:16','2025-12-15 18:59:16'),(6,'ASESOR_CONVENIO',18,'Carolina Rojas','3011000004',NULL,NULL,1,'2025-12-15 18:59:16','2025-12-17 14:13:08'),(7,'ASESOR_CONVENIO',19,'Taller ProService','3011000005',NULL,NULL,1,'2025-12-15 18:59:16','2025-12-15 18:59:16'),(8,'ASESOR_COMERCIAL',20,'prueba flujo  completo','3249624220',NULL,NULL,1,'2025-12-15 20:25:55','2025-12-16 14:53:05'),(9,'ASESOR_COMERCIAL',21,'puerta prueba','214124',NULL,NULL,1,'2025-12-15 21:04:17','2025-12-16 14:52:05'),(10,'ASESOR_COMERCIAL',1,'Admin Sistema','3001111111',NULL,NULL,1,'2025-12-16 14:10:13','2025-12-16 14:10:15'),(11,'ASESOR_COMERCIAL',22,'diego avila','123124535',NULL,NULL,1,'2025-12-16 14:17:22','2025-12-16 14:32:26'),(12,'ASESOR_COMERCIAL',3,'Carlos Rodríguez','3003333333',NULL,NULL,1,'2025-12-16 14:33:31','2025-12-16 17:27:02'),(13,'ASESOR_COMERCIAL',4,'Sandra Martínez','3004444444',NULL,NULL,1,'2025-12-16 14:35:35','2025-12-16 14:35:37'),(14,'ASESOR_COMERCIAL',5,'Patricia Gómez','3101234567',NULL,NULL,1,'2025-12-16 14:37:01','2025-12-16 14:37:01'),(15,'ASESOR_CONVENIO',24,'prueba  convenio','124324532',NULL,NULL,1,'2025-12-16 17:15:55','2025-12-16 17:23:01');
/*!40000 ALTER TABLE `agentes_captacions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `asesor_convenio_asignaciones`
--

DROP TABLE IF EXISTS `asesor_convenio_asignaciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `asesor_convenio_asignaciones` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `convenio_id` int unsigned NOT NULL,
  `asesor_id` int unsigned NOT NULL,
  `asignado_por` int unsigned DEFAULT NULL,
  `fecha_asignacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_fin` datetime DEFAULT NULL,
  `motivo_fin` varchar(180) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `asesor_convenio_asignaciones_asignado_por_foreign` (`asignado_por`),
  KEY `idx_convenio_activo` (`convenio_id`,`activo`),
  KEY `idx_convenio_fecha_fin` (`convenio_id`,`fecha_fin`),
  KEY `idx_asesor_activo` (`asesor_id`,`activo`),
  CONSTRAINT `asesor_convenio_asignaciones_asesor_id_foreign` FOREIGN KEY (`asesor_id`) REFERENCES `agentes_captacions` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `asesor_convenio_asignaciones_asignado_por_foreign` FOREIGN KEY (`asignado_por`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL,
  CONSTRAINT `asesor_convenio_asignaciones_convenio_id_foreign` FOREIGN KEY (`convenio_id`) REFERENCES `convenios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `asesor_convenio_asignaciones`
--

LOCK TABLES `asesor_convenio_asignaciones` WRITE;
/*!40000 ALTER TABLE `asesor_convenio_asignaciones` DISABLE KEYS */;
INSERT INTO `asesor_convenio_asignaciones` VALUES (1,1,1,1,'2025-12-15 18:59:16','2025-12-16 21:14:27','Retiro manual',0),(2,2,2,1,'2025-12-15 18:59:16','2025-12-16 19:40:09','Reasignación',0),(3,3,1,1,'2025-12-15 18:59:16','2025-12-16 19:40:49','Reasignación',0),(4,4,2,1,'2025-12-15 18:59:16','2025-12-15 20:32:29','Reasignación',0),(5,5,1,1,'2025-12-15 18:59:16','2025-12-15 20:32:21','Reasignación',0),(6,5,8,1,'2025-12-15 20:32:21','2025-12-16 19:39:47','Reasignación',0),(7,4,8,1,'2025-12-15 20:32:28',NULL,NULL,1),(8,6,8,1,'2025-12-16 19:39:08','2025-12-16 19:39:21','Reasignación',0),(9,6,3,1,'2025-12-16 19:39:20','2025-12-16 19:39:36','Reasignación',0),(10,6,8,1,'2025-12-16 19:39:35','2025-12-16 20:29:13','Reasignación',0),(11,5,4,1,'2025-12-16 19:39:46','2025-12-16 20:56:40','Reasignación',0),(12,2,4,1,'2025-12-16 19:40:09','2025-12-16 21:14:25','Reasignación',0),(13,3,10,1,'2025-12-16 19:40:49','2025-12-16 21:00:13','por q si',0),(14,6,1,6,'2025-12-16 20:29:13','2025-12-16 21:00:41','Reasignación',0),(15,5,15,25,'2025-12-16 20:56:39',NULL,NULL,1),(16,6,8,25,'2025-12-16 21:00:41',NULL,NULL,1),(17,2,1,25,'2025-12-16 21:14:25',NULL,NULL,1);
/*!40000 ALTER TABLE `asesor_convenio_asignaciones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `asesor_prospecto_asignaciones`
--

DROP TABLE IF EXISTS `asesor_prospecto_asignaciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `asesor_prospecto_asignaciones` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `prospecto_id` int unsigned NOT NULL,
  `asesor_id` int unsigned NOT NULL,
  `asignado_por` int unsigned DEFAULT NULL,
  `fecha_asignacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_fin` datetime DEFAULT NULL,
  `motivo_fin` varchar(180) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_prospecto_asignacion_activa` (`prospecto_id`,`activo`),
  KEY `asesor_prospecto_asignaciones_asignado_por_foreign` (`asignado_por`),
  KEY `asesor_prospecto_asignaciones_asesor_id_activo_index` (`asesor_id`,`activo`),
  CONSTRAINT `asesor_prospecto_asignaciones_asesor_id_foreign` FOREIGN KEY (`asesor_id`) REFERENCES `agentes_captacions` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `asesor_prospecto_asignaciones_asignado_por_foreign` FOREIGN KEY (`asignado_por`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL,
  CONSTRAINT `asesor_prospecto_asignaciones_prospecto_id_foreign` FOREIGN KEY (`prospecto_id`) REFERENCES `prospectos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=54 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `asesor_prospecto_asignaciones`
--

LOCK TABLES `asesor_prospecto_asignaciones` WRITE;
/*!40000 ALTER TABLE `asesor_prospecto_asignaciones` DISABLE KEYS */;
INSERT INTO `asesor_prospecto_asignaciones` VALUES (1,1,3,1,'2025-12-15 18:59:16',NULL,NULL,1),(2,2,3,1,'2025-12-15 18:59:16',NULL,NULL,1),(3,3,5,1,'2025-12-15 18:59:16',NULL,NULL,1),(4,4,5,1,'2025-12-15 18:59:16',NULL,NULL,1),(5,5,1,1,'2025-12-15 18:59:16',NULL,NULL,1),(6,6,1,1,'2025-12-15 18:59:16',NULL,NULL,1),(7,7,2,1,'2025-12-15 18:59:16',NULL,NULL,1),(8,8,5,1,'2025-12-15 18:59:16',NULL,NULL,1),(9,9,2,1,'2025-12-15 18:59:16',NULL,NULL,1),(10,10,3,1,'2025-12-15 18:59:16',NULL,NULL,1),(11,11,5,1,'2025-12-15 18:59:16',NULL,NULL,1),(12,12,7,1,'2025-12-15 18:59:16',NULL,NULL,1),(13,13,6,1,'2025-12-15 18:59:16',NULL,NULL,1),(14,14,6,1,'2025-12-15 18:59:16',NULL,NULL,1),(15,15,3,1,'2025-12-15 18:59:16',NULL,NULL,1),(16,16,6,1,'2025-12-15 18:59:16',NULL,NULL,1),(17,17,1,1,'2025-12-15 18:59:16',NULL,NULL,1),(18,18,4,1,'2025-12-15 18:59:16',NULL,NULL,1),(19,19,7,1,'2025-12-15 18:59:16',NULL,NULL,1),(20,20,2,1,'2025-12-15 18:59:16',NULL,NULL,1),(21,21,2,1,'2025-12-15 18:59:16',NULL,NULL,1),(22,22,4,1,'2025-12-15 18:59:16',NULL,NULL,1),(23,23,2,1,'2025-12-15 18:59:16',NULL,NULL,1),(24,24,1,1,'2025-12-15 18:59:16',NULL,NULL,1),(25,25,5,1,'2025-12-15 18:59:16',NULL,NULL,1),(26,26,1,1,'2025-12-15 18:59:16',NULL,NULL,1),(27,27,5,1,'2025-12-15 18:59:16',NULL,NULL,1),(28,28,2,1,'2025-12-15 18:59:16',NULL,NULL,1),(29,29,4,1,'2025-12-15 18:59:16',NULL,NULL,1),(30,30,1,1,'2025-12-15 18:59:16',NULL,NULL,1),(31,31,3,1,'2025-12-15 18:59:16',NULL,NULL,1),(32,32,4,1,'2025-12-15 18:59:16',NULL,NULL,1),(33,33,2,1,'2025-12-15 18:59:16',NULL,NULL,1),(34,34,4,1,'2025-12-15 18:59:16',NULL,NULL,1),(35,35,4,1,'2025-12-15 18:59:16',NULL,NULL,1),(36,36,4,1,'2025-12-15 18:59:16',NULL,NULL,1),(37,37,1,1,'2025-12-15 18:59:16',NULL,NULL,1),(38,38,3,1,'2025-12-15 18:59:16',NULL,NULL,1),(39,39,3,1,'2025-12-15 18:59:16',NULL,NULL,1),(40,40,4,1,'2025-12-15 18:59:16',NULL,NULL,1),(41,41,7,1,'2025-12-15 18:59:16',NULL,NULL,1),(42,42,5,1,'2025-12-15 18:59:16',NULL,NULL,1),(43,43,7,1,'2025-12-15 18:59:16',NULL,NULL,1),(44,44,1,1,'2025-12-15 18:59:16',NULL,NULL,1),(45,45,5,1,'2025-12-15 18:59:16',NULL,NULL,1),(46,46,2,1,'2025-12-15 18:59:16',NULL,NULL,1),(47,47,6,1,'2025-12-15 18:59:16',NULL,NULL,1),(48,48,6,1,'2025-12-15 18:59:16',NULL,NULL,1),(49,49,6,1,'2025-12-15 18:59:16',NULL,NULL,1),(50,50,1,1,'2025-12-15 18:59:16',NULL,NULL,1),(51,51,8,20,'2025-12-15 20:30:36',NULL,NULL,1),(52,52,8,20,'2025-12-16 20:00:11',NULL,NULL,1),(53,53,15,24,'2025-12-16 20:24:24',NULL,NULL,1);
/*!40000 ALTER TABLE `asesor_prospecto_asignaciones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_access_tokens`
--

DROP TABLE IF EXISTS `auth_access_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_access_tokens` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_id` int unsigned NOT NULL,
  `tokenable_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Usuario',
  `hash` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `abilities` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_tokenable` (`tokenable_id`,`tokenable_type`),
  CONSTRAINT `auth_access_tokens_tokenable_id_foreign` FOREIGN KEY (`tokenable_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=122 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_access_tokens`
--

LOCK TABLES `auth_access_tokens` WRITE;
/*!40000 ALTER TABLE `auth_access_tokens` DISABLE KEYS */;
INSERT INTO `auth_access_tokens` VALUES (1,3,'Usuario','423eb732b79c0530574747d0506a6017fcd073c4e7840d6ab5759d47b4ab089f','auth_token',NULL,'[\"*\"]','2025-12-15 20:17:10','2026-01-14 20:17:01','2025-12-15 20:17:01','2025-12-15 20:17:01'),(2,1,'Usuario','f654b47fd70b52c0e8391f3383be0b3efc1f8f0721151aa5109d43ef64ecc1a6','auth_token',NULL,'[\"*\"]','2025-12-15 20:18:28','2026-01-14 20:17:59','2025-12-15 20:17:59','2025-12-15 20:17:59'),(3,8,'Usuario','aa4a9505186581ef8c2658cffaa2c9d8facb6c0a133f42af83c1ff3530e9b847','auth_token',NULL,'[\"*\"]','2025-12-15 20:29:13','2026-01-14 20:18:53','2025-12-15 20:18:53','2025-12-15 20:18:53'),(4,20,'Usuario','0d93b0617550922c02ffd3aa3284f2b784ef591a2f71b254fd2e9910a259645e','auth_token',NULL,'[\"*\"]','2025-12-15 20:56:57','2026-01-14 20:29:46','2025-12-15 20:29:46','2025-12-15 20:29:46'),(5,1,'Usuario','b1e65ff3db731a7e4a4fa5215433b22e0306c2f094a3068a23ff9330da130646','auth_token',NULL,'[\"*\"]','2025-12-15 20:55:42','2026-01-14 20:32:02','2025-12-15 20:32:02','2025-12-15 20:32:02'),(6,3,'Usuario','797681c789569faaff58ccb07d11d7ce8f28cf23d4c1d9be3a7c03ae24551fe7','auth_token',NULL,'[\"*\"]','2025-12-15 20:42:41','2026-01-14 20:41:27','2025-12-15 20:41:27','2025-12-15 20:41:27'),(7,8,'Usuario','ca4c0961dd19d357c6a0d9043990ae3d8c255f0729884ca873a586f6babf57d6','auth_token',NULL,'[\"*\"]','2025-12-15 20:51:54','2026-01-14 20:42:23','2025-12-15 20:42:23','2025-12-15 20:42:23'),(8,8,'Usuario','00be373ddab29d25ec8a78e3f018bf69ee77a6f482bb02f014f9379c5c3ee9fe','auth_token',NULL,'[\"*\"]','2025-12-15 20:48:50','2026-01-14 20:43:24','2025-12-15 20:43:24','2025-12-15 20:43:24'),(9,3,'Usuario','1312115da70cee9474467ad6e4edb908c6998f78e747dd9f9e7d5081c3c265ea','auth_token',NULL,'[\"*\"]','2025-12-15 21:41:48','2026-01-14 20:43:52','2025-12-15 20:43:52','2025-12-15 20:43:52'),(10,20,'Usuario','1a3f5f29450374bce13f55986c508937b57d6bfec75b83c4f9bbfd34784f9aa4','auth_token',NULL,'[\"*\"]','2025-12-15 20:50:23','2026-01-14 20:49:18','2025-12-15 20:49:18','2025-12-15 20:49:18'),(11,9,'Usuario','4afe2ccf6b77f8e4a2c5e8f6a11a561a5b51de83461d5590e4f9b4e610c8ea5a','auth_token',NULL,'[\"*\"]','2025-12-15 20:52:43','2026-01-14 20:52:03','2025-12-15 20:52:03','2025-12-15 20:52:03'),(12,3,'Usuario','136032bcc5d8afe613a2df782e80e02f6ac9850522b3fd4a5f5d40f49998fe91','auth_token',NULL,'[\"*\"]','2025-12-15 21:04:19','2026-01-14 21:01:38','2025-12-15 21:01:38','2025-12-15 21:01:38'),(13,3,'Usuario','6be6d2f53d1e0be1d9637f6b028b766d7c237d37a184fe0cd1d6fcda995d180f','auth_token',NULL,'[\"*\"]','2025-12-15 21:04:37','2026-01-14 21:04:36','2025-12-15 21:04:36','2025-12-15 21:04:36'),(14,3,'Usuario','867f4861cd8abf3f5703fbff2fc814e8b34d42b837482bfda51b657dc4617ef8','auth_token',NULL,'[\"*\"]','2025-12-15 22:47:41','2026-01-14 21:05:27','2025-12-15 21:05:27','2025-12-15 21:05:27'),(15,2,'Usuario','98c83279482039b55098dff47d5cf60522fc8ca98ff18c855c123f9d8ce4631b','auth_token',NULL,'[\"*\"]','2025-12-16 14:03:38','2026-01-14 21:28:27','2025-12-15 21:28:27','2025-12-15 21:28:27'),(16,2,'Usuario','0d0d5af2677638e15f7dd195e4074d4474dcdefe6acf66287dc2a6ca6cc2ca4f','auth_token',NULL,'[\"*\"]','2025-12-15 21:39:04','2026-01-14 21:28:41','2025-12-15 21:28:41','2025-12-15 21:28:41'),(17,1,'Usuario','5125e067c2c0697aa8e790eb728979c5db78cf1bbec2d1cf7045b7b5d0386722','auth_token',NULL,'[\"*\"]','2025-12-16 14:03:34','2026-01-14 21:37:00','2025-12-15 21:37:00','2025-12-15 21:37:00'),(18,2,'Usuario','399d11494877671ca575246cf8c4742615ba9b3e26a34261db291db65fcb3466','auth_token',NULL,'[\"*\"]','2025-12-15 21:50:49','2026-01-14 21:49:40','2025-12-15 21:49:40','2025-12-15 21:49:40'),(19,3,'Usuario','34a7f1ca08a185575da8ed04a2c1e359ee4fcbbf0ba94e0f85f4c7c397c62136','auth_token',NULL,'[\"*\"]','2025-12-16 13:20:35','2026-01-15 12:55:34','2025-12-16 12:55:34','2025-12-16 12:55:34'),(20,3,'Usuario','f4284eaa75c06b6b9d269c6c4592b9c7d19fd4dc9900699d582590fa50bc941c','auth_token',NULL,'[\"*\"]','2025-12-16 14:10:15','2026-01-15 13:21:01','2025-12-16 13:21:01','2025-12-16 13:21:01'),(21,3,'Usuario','59b1e77b01a4acd1565120031152e784dec3c713a01798883e57f74c425a9c6b','auth_token',NULL,'[\"*\"]','2025-12-16 14:11:38','2026-01-15 14:11:38','2025-12-16 14:11:38','2025-12-16 14:11:38'),(22,3,'Usuario','ce5b9c0cce3383c259f54466d514d87239bc242bce4203792a7404376b0566ad','auth_token',NULL,'[\"*\"]','2025-12-16 14:11:54','2026-01-15 14:11:38','2025-12-16 14:11:38','2025-12-16 14:11:38'),(23,20,'Usuario','2a6b52439a03b133324d6d0b70d9c5ac0d1137784b912cd29c27fe18b98e84d9','auth_token',NULL,'[\"*\"]','2025-12-16 14:12:20','2026-01-15 14:12:18','2025-12-16 14:12:18','2025-12-16 14:12:18'),(24,21,'Usuario','39e272a8d94d50d493dacbf129809b819fd507d65b156b8cdf079d6d26c07c17','auth_token',NULL,'[\"*\"]','2025-12-16 14:14:30','2026-01-15 14:12:28','2025-12-16 14:12:28','2025-12-16 14:12:28'),(25,8,'Usuario','2d970b727c1068ddf8682c719bbedc3e80812d8905b815011dfc79741f96c007','auth_token',NULL,'[\"*\"]','2025-12-16 14:17:23','2026-01-15 14:14:43','2025-12-16 14:14:43','2025-12-16 14:14:43'),(26,20,'Usuario','f366860942624caa87de5cdff3752e1efa3ee90e542b4bd39a22017f2b746ebe','auth_token',NULL,'[\"*\"]','2025-12-16 14:24:23','2026-01-15 14:19:15','2025-12-16 14:19:15','2025-12-16 14:19:15'),(27,3,'Usuario','ad646460e21ea9a16bb043584527d682ca925225ce08e431ecf9cbc5212f6010','auth_token',NULL,'[\"*\"]','2025-12-16 14:25:42','2026-01-15 14:19:17','2025-12-16 14:19:17','2025-12-16 14:19:17'),(28,20,'Usuario','8e7fd63ca7da1e72725bcea833b8bb6bab151d2c868f8f951a85a89251e15cd2','auth_token',NULL,'[\"*\"]','2025-12-16 14:22:19','2026-01-15 14:22:18','2025-12-16 14:22:18','2025-12-16 14:22:18'),(29,21,'Usuario','1fb6e745699b07173628e621f5b74b1389a93370a489bd95d2495ad804e03ee6','auth_token',NULL,'[\"*\"]','2025-12-16 14:25:01','2026-01-15 14:23:58','2025-12-16 14:23:58','2025-12-16 14:23:58'),(30,1,'Usuario','8f55b2577fb15ad9f6ea68deea8ebdc703d8befb14503857c7ca786c9349b504','auth_token',NULL,'[\"*\"]','2025-12-16 14:24:36','2026-01-15 14:24:32','2025-12-16 14:24:32','2025-12-16 14:24:32'),(31,8,'Usuario','549905cdc691551c296322814165cb8adc777373cf0e5ed3f1f60e621c604913','auth_token',NULL,'[\"*\"]','2025-12-16 14:27:52','2026-01-15 14:26:08','2025-12-16 14:26:08','2025-12-16 14:26:08'),(32,3,'Usuario','cb08b9db5c18b6cc4823062fb0bb5d76f9124274e57a98c54cdf693b1c932978','auth_token',NULL,'[\"*\"]','2025-12-16 14:29:28','2026-01-15 14:28:45','2025-12-16 14:28:45','2025-12-16 14:28:45'),(33,8,'Usuario','c4a7d7a93e53c990f6a713e90489d143904ccb0c87af1a50d33aacf99f57d86a','auth_token',NULL,'[\"*\"]','2025-12-16 14:58:57','2026-01-15 14:28:52','2025-12-16 14:28:52','2025-12-16 14:28:52'),(34,8,'Usuario','aa2811bead23aeacbfbea27e4fbb4c4fe7588f343a231d26eb39bb5eaf09a5ca','auth_token',NULL,'[\"*\"]','2025-12-16 14:29:41','2026-01-15 14:29:40','2025-12-16 14:29:40','2025-12-16 14:29:40'),(35,8,'Usuario','eb4a84eef1470ebbbb2fa98a408838680d2009e66d5abd4237e64bbf081f278a','auth_token',NULL,'[\"*\"]','2025-12-16 14:37:04','2026-01-15 14:30:26','2025-12-16 14:30:26','2025-12-16 14:30:26'),(36,8,'Usuario','0ed4602b43020bad98a7bb133f9af6c6ef115aa50bc542ac2b9e77fc475f3c7e','auth_token',NULL,'[\"*\"]','2025-12-16 14:41:06','2026-01-15 14:38:56','2025-12-16 14:38:56','2025-12-16 14:38:56'),(37,1,'Usuario','d7f441304f9f05b4eb421e398ff6b413af4a0e756073ee07570de894b8f59595','auth_token',NULL,'[\"*\"]','2025-12-16 14:50:40','2026-01-15 14:43:34','2025-12-16 14:43:34','2025-12-16 14:43:34'),(38,23,'Usuario','18d9ba205750c10bc3df5402e580829f1e0854789d51cb5b931565cbf98a0ed1','auth_token',NULL,'[\"*\"]','2025-12-16 14:51:02','2026-01-15 14:51:02','2025-12-16 14:51:02','2025-12-16 14:51:02'),(39,23,'Usuario','9e11d09301faa81a2fd33c2f596d49139b77b8ed29d6781c01f47988018ee861','auth_token',NULL,'[\"*\"]','2025-12-16 14:51:17','2026-01-15 14:51:17','2025-12-16 14:51:17','2025-12-16 14:51:17'),(40,23,'Usuario','013dcca45aa4c8a5c3528474abee8df7e0b7999b4f5d48a7a079595e11e166f1','auth_token',NULL,'[\"*\"]','2025-12-16 15:06:42','2026-01-15 14:51:36','2025-12-16 14:51:36','2025-12-16 14:51:36'),(41,8,'Usuario','3b89b759d75cb47e551bf5a7fd346d10ef32989de1019fd50807336154cf28e0','auth_token',NULL,'[\"*\"]','2025-12-16 15:28:07','2026-01-15 15:09:22','2025-12-16 15:09:22','2025-12-16 15:09:22'),(42,3,'Usuario','ed2a0b35b7d6e1dda62176fcc42a271580666b589f741521b526e3c701c15087','auth_token',NULL,'[\"*\"]',NULL,'2026-01-15 16:13:26','2025-12-16 16:13:26','2025-12-16 16:13:26'),(43,3,'Usuario','ad32c06b9f045bebf2c0fcafc734a20706ac064751629ea50baac46de55f5103','auth_token',NULL,'[\"*\"]',NULL,'2026-01-15 16:16:15','2025-12-16 16:16:15','2025-12-16 16:16:15'),(44,3,'Usuario','55ea7b28c2081c4a81e3fecd01b03141f52452f39b057ad00fc65dd7d8f76e7f','auth_token',NULL,'[\"*\"]',NULL,'2026-01-15 16:16:15','2025-12-16 16:16:15','2025-12-16 16:16:15'),(45,3,'Usuario','e349649847f0e0cfbb2c856ac7b07b8624e47808df745336e98e87ab214e8241','auth_token',NULL,'[\"*\"]',NULL,'2026-01-15 16:16:16','2025-12-16 16:16:16','2025-12-16 16:16:16'),(46,3,'Usuario','33d9560155a547bb685e3e1863ed4162703a30ed40713a430d3aa2d8904632b3','auth_token',NULL,'[\"*\"]',NULL,'2026-01-15 16:16:16','2025-12-16 16:16:16','2025-12-16 16:16:16'),(47,3,'Usuario','fc0d2082d031cd4a08c0a09aa948a1247b8118def8acc4b326b4ec01aa5e0191','auth_token',NULL,'[\"*\"]',NULL,'2026-01-15 16:16:16','2025-12-16 16:16:16','2025-12-16 16:16:16'),(48,3,'Usuario','d4975a4e940e1621ab1fd4fa61c9c2e134159c63ca9bf19d0aa7a7c13180a7bf','auth_token',NULL,'[\"*\"]',NULL,'2026-01-15 16:16:16','2025-12-16 16:16:16','2025-12-16 16:16:16'),(49,3,'Usuario','be846b1f744af6a2babbd6fda9bd0bf123ce4b976ed6f6b8a04e6bf5996d895d','auth_token',NULL,'[\"*\"]',NULL,'2026-01-15 16:16:16','2025-12-16 16:16:16','2025-12-16 16:16:16'),(50,3,'Usuario','29520ba902b42f071d8bb0ff6ee1181548752ec45e977df066cd5124ab98058c','auth_token',NULL,'[\"*\"]',NULL,'2026-01-15 16:16:16','2025-12-16 16:16:16','2025-12-16 16:16:16'),(51,3,'Usuario','0894a3828842d080fa1bfd51c41253ceaf7f2ea262db1d0f8a2b46ff9e845bde','auth_token',NULL,'[\"*\"]',NULL,'2026-01-15 16:16:17','2025-12-16 16:16:17','2025-12-16 16:16:17'),(52,3,'Usuario','b555d55ce63528bc94fd8ed6343965657b28badc8c783f4389c30b2a4942316e','auth_token',NULL,'[\"*\"]',NULL,'2026-01-15 16:16:17','2025-12-16 16:16:17','2025-12-16 16:16:17'),(53,3,'Usuario','6382aa32bc385d1e36bd7d017c2beb7248a990bbc02cafdea940a8b2398cc84f','auth_token',NULL,'[\"*\"]',NULL,'2026-01-15 16:16:17','2025-12-16 16:16:17','2025-12-16 16:16:17'),(54,3,'Usuario','14d71779d7ae2736051e25805136f126e0b8d2d111ffa098264d4db8bef8dc48','auth_token',NULL,'[\"*\"]',NULL,'2026-01-15 16:16:28','2025-12-16 16:16:28','2025-12-16 16:16:28'),(55,1,'Usuario','989cd8e05eae9969c0d645139a87032af9b953036116740f71ad8283f1848182','auth_token',NULL,'[\"*\"]',NULL,'2026-01-15 16:19:21','2025-12-16 16:19:21','2025-12-16 16:19:21'),(56,3,'Usuario','386ca64f51535e28e437747caa100780f750439f503ee995b13ae1af55f66783','auth_token',NULL,'[\"*\"]',NULL,'2026-01-15 16:19:25','2025-12-16 16:19:25','2025-12-16 16:19:25'),(57,3,'Usuario','18dd36f68dc91a185a3d8c0a91e4782b079a4b0058828c2d994b4959c442c83c','auth_token',NULL,'[\"*\"]',NULL,'2026-01-15 16:19:41','2025-12-16 16:19:41','2025-12-16 16:19:41'),(58,3,'Usuario','ba9429c5502133c49a303d27484f706dda88a41c669b2d3df06fbc863966943b','auth_token',NULL,'[\"*\"]',NULL,'2026-01-15 16:23:29','2025-12-16 16:23:29','2025-12-16 16:23:29'),(59,3,'Usuario','1cdeec0a8647bdccd6cf659f24773a3673d3187a1bffc81586a068778ab062fa','auth_token',NULL,'[\"*\"]',NULL,'2026-01-15 16:32:35','2025-12-16 16:32:35','2025-12-16 16:32:35'),(60,1,'Usuario','ea94e7e62eef79fb1721dc4cae2526945343ad9478ffb0fbc41557bd74d70b57','auth_token',NULL,'[\"*\"]',NULL,'2026-01-15 16:35:50','2025-12-16 16:35:50','2025-12-16 16:35:50'),(61,3,'Usuario','77e39138f9703a2827d129ed8bce109750bc347149e35d8eb18b52676239a36b','auth_token',NULL,'[\"*\"]',NULL,'2026-01-15 16:35:51','2025-12-16 16:35:51','2025-12-16 16:35:51'),(62,8,'Usuario','f166534397a64da26a54eb27dbd6f64ed47b05b122274832d225d527ced07dec','auth_token',NULL,'[\"*\"]',NULL,'2026-01-15 16:35:54','2025-12-16 16:35:54','2025-12-16 16:35:54'),(63,22,'Usuario','06580e83c619d8279345033524d2f565297cfc4299d6288f4ca12945ddef5acf','auth_token',NULL,'[\"*\"]',NULL,'2026-01-15 16:35:57','2025-12-16 16:35:57','2025-12-16 16:35:57'),(64,22,'Usuario','7fc4f30b422bb4f1935e9db5a3ed67e365cf75868be5233126a40050b7d0b3a0','auth_token',NULL,'[\"*\"]',NULL,'2026-01-15 16:36:08','2025-12-16 16:36:08','2025-12-16 16:36:08'),(65,9,'Usuario','33ffc5f8e1d0e692d39cd08d12ad9a68dd9a8a2a48c058755db017b053c44cd5','auth_token',NULL,'[\"*\"]',NULL,'2026-01-15 16:36:11','2025-12-16 16:36:11','2025-12-16 16:36:11'),(66,3,'Usuario','abf06434ed7f4a28fd1a9e373ce3e6f85a78e4ca6168e29587786f03b24aba9c','auth_token',NULL,'[\"*\"]',NULL,'2026-01-15 16:41:22','2025-12-16 16:41:22','2025-12-16 16:41:22'),(67,3,'Usuario','88f5ef92915fb5f47ff05e46c96724246524579ae755356c742473ec67c0e3e5','auth_token',NULL,'[\"*\"]',NULL,'2026-01-15 16:41:23','2025-12-16 16:41:23','2025-12-16 16:41:23'),(68,3,'Usuario','9aa8c0d91d565d1e8e3cf77294f1810da8cd121575366f31a260e6db329af2c9','auth_token',NULL,'[\"*\"]',NULL,'2026-01-15 16:41:23','2025-12-16 16:41:23','2025-12-16 16:41:23'),(69,3,'Usuario','ae68563a38b36b524e739a1317d56fee41427972014a15dbdf1e689ff216372f','auth_token',NULL,'[\"*\"]',NULL,'2026-01-15 16:41:23','2025-12-16 16:41:23','2025-12-16 16:41:23'),(70,3,'Usuario','82a120e30f4da4beeb0a7a8131bb9491aaee23dbc4962f9a01c875b24bc1384d','auth_token',NULL,'[\"*\"]',NULL,'2026-01-15 16:41:23','2025-12-16 16:41:23','2025-12-16 16:41:23'),(71,3,'Usuario','48ea02157ece2060d7f3b13a04fdbc1c1688d9a59c8d93fb4596f5b468d23ca6','auth_token',NULL,'[\"*\"]',NULL,'2026-01-15 16:41:24','2025-12-16 16:41:24','2025-12-16 16:41:24'),(72,3,'Usuario','47cc4e026c9e2cfbf444fcacd1cb55aec078eef3406abb89bfac7f7f0818ef89','auth_token',NULL,'[\"*\"]',NULL,'2026-01-15 16:41:24','2025-12-16 16:41:24','2025-12-16 16:41:24'),(73,3,'Usuario','c3c070c4985c020118cdbe938bc0efc3f56ee7052a1257ca5339ee323806744d','auth_token',NULL,'[\"*\"]',NULL,'2026-01-15 16:41:24','2025-12-16 16:41:24','2025-12-16 16:41:24'),(74,3,'Usuario','62213a8a48a9aeefd4ce70245a80f57ace6993fc14c84b4946c272332d353197','auth_token',NULL,'[\"*\"]',NULL,'2026-01-15 16:41:24','2025-12-16 16:41:24','2025-12-16 16:41:24'),(75,3,'Usuario','f64dbaf03e65d69b1c51f95ffb871c81ad727a60659e6e40264e3c9aa693b9d4','auth_token',NULL,'[\"*\"]',NULL,'2026-01-15 16:41:24','2025-12-16 16:41:24','2025-12-16 16:41:24'),(76,3,'Usuario','d99638d183b920fada4c8cee21a074947ac6378a63f8b561eb222ddbdef5cb57','auth_token',NULL,'[\"*\"]','2025-12-16 16:44:47','2026-01-15 16:41:54','2025-12-16 16:41:54','2025-12-16 16:41:54'),(77,3,'Usuario','24d35c7703b33d8ce14acb5e0fe08bd79495f28c80068a330b17a9c5ef450929','auth_token',NULL,'[\"*\"]','2025-12-16 17:27:02','2026-01-15 16:54:19','2025-12-16 16:54:19','2025-12-16 16:54:19'),(78,1,'Usuario','4640f47d5734e2236888b7d3ef485f8839a99dfe6ba9df27774a7e84310430a8','auth_token',NULL,'[\"*\"]',NULL,'2026-01-15 16:54:51','2025-12-16 16:54:51','2025-12-16 16:54:51'),(79,1,'Usuario','d2624f312a37041b8a1528c27034a79493b37249e71cee7b02bb99120fe24986','auth_token',NULL,'[\"*\"]',NULL,'2026-01-15 16:54:52','2025-12-16 16:54:52','2025-12-16 16:54:52'),(80,1,'Usuario','f71c0f766da4917b8d181404aa5bc469c4b22942cc3a11a9f1600e354ddb6812','auth_token',NULL,'[\"*\"]','2025-12-16 16:55:02','2026-01-15 16:55:02','2025-12-16 16:55:02','2025-12-16 16:55:02'),(81,1,'Usuario','ef0a670f979c35fa0517b5b95954a4e25487baf86890e6daf5525db82eaf1623','auth_token',NULL,'[\"*\"]','2025-12-16 16:59:33','2026-01-15 16:59:28','2025-12-16 16:59:28','2025-12-16 16:59:28'),(82,23,'Usuario','2b61170c081bae6c35d50990a064b670429d738d695dfd887fe7b8d2ae84f96d','auth_token',NULL,'[\"*\"]','2025-12-16 17:13:07','2026-01-15 17:00:09','2025-12-16 17:00:09','2025-12-16 17:00:09'),(83,23,'Usuario','7eede34e5e3fd805a1866739447a5c3af6895eb10c7961d57cb473d11fccad5c','auth_token',NULL,'[\"*\"]','2025-12-16 17:26:31','2026-01-15 17:13:50','2025-12-16 17:13:50','2025-12-16 17:13:50'),(84,8,'Usuario','d7873eeec73bb55a48a91680eb85f4e8548f9ed3032942903c84f8c3984c2f54','auth_token',NULL,'[\"*\"]','2025-12-16 17:32:28','2026-01-15 17:32:24','2025-12-16 17:32:24','2025-12-16 17:32:24'),(85,3,'Usuario','e13168e8b5aac5e89ecebf37df6d4009415026236af73c59b87458d8d4fd4ef7','auth_token',NULL,'[\"*\"]','2025-12-16 19:02:04','2026-01-15 19:02:03','2025-12-16 19:02:03','2025-12-16 19:02:03'),(86,3,'Usuario','f88fbe68f038bd1b754e7926ed51bc7e98081d6e1f8b610f6a1b180d7e8349b2','auth_token',NULL,'[\"*\"]','2025-12-16 19:06:12','2026-01-15 19:06:05','2025-12-16 19:06:05','2025-12-16 19:06:05'),(87,3,'Usuario','a167440ce75897bc1d610e0f1b84700a5e2b7c59c9c5d47b324c397defff175d','auth_token',NULL,'[\"*\"]','2025-12-16 19:30:38','2026-01-15 19:24:15','2025-12-16 19:24:15','2025-12-16 19:24:15'),(88,3,'Usuario','7a2f9f26137d46c27751391eb96097003520c8ac813bcc4575cff59db0afe5c5','auth_token',NULL,'[\"*\"]','2025-12-16 19:30:45','2026-01-15 19:30:45','2025-12-16 19:30:45','2025-12-16 19:30:45'),(89,20,'Usuario','752ce9bcbff614880121860013e924e29ffdcee3321b45dbd264ca2db00fb7aa','auth_token',NULL,'[\"*\"]','2025-12-16 20:15:03','2026-01-15 19:36:10','2025-12-16 19:36:10','2025-12-16 19:36:10'),(90,1,'Usuario','b8db6aea61c3bb0f7ecb9ec4d5440f887219675b18865e9c3979b3aed5238893','auth_token',NULL,'[\"*\"]','2025-12-16 19:38:21','2026-01-15 19:37:57','2025-12-16 19:37:57','2025-12-16 19:37:57'),(91,24,'Usuario','c17e12bde22d92fae950b1925e0e48a4091f2cb695d638b6c41097f6e83c3b11','auth_token',NULL,'[\"*\"]','2025-12-16 20:24:27','2026-01-15 19:38:36','2025-12-16 19:38:36','2025-12-16 19:38:36'),(92,1,'Usuario','3a767abfaaf90e2b06846122dc0ed3d52f2bacd9c444816f27567cd9b4e6c4fd','auth_token',NULL,'[\"*\"]','2025-12-16 20:12:48','2026-01-15 19:38:52','2025-12-16 19:38:52','2025-12-16 19:38:52'),(93,3,'Usuario','766d1503e270baab4d64d9267a1280bb1601f166a5e9bf77a9932103b24c2401','auth_token',NULL,'[\"*\"]','2025-12-16 19:42:38','2026-01-15 19:42:37','2025-12-16 19:42:37','2025-12-16 19:42:37'),(94,3,'Usuario','a57b1b48766abf056320452310bfb5cd4b2a6e2513b1f45f26b4de9cb84a5ba1','auth_token',NULL,'[\"*\"]','2025-12-16 19:58:44','2026-01-15 19:58:43','2025-12-16 19:58:43','2025-12-16 19:58:43'),(95,20,'Usuario','6af42f5c2d5b442ceced744684fd2b55e8917116bf66c5a23082151ca22992f1','auth_token',NULL,'[\"*\"]','2025-12-16 20:01:19','2026-01-15 20:01:18','2025-12-16 20:01:18','2025-12-16 20:01:18'),(96,21,'Usuario','44426eafbfe488f40b415bd7f1575fdd20385f8e4db259905f1b3dcac4571d83','auth_token',NULL,'[\"*\"]','2025-12-17 13:26:36','2026-01-15 20:01:27','2025-12-16 20:01:27','2025-12-16 20:01:27'),(97,6,'Usuario','8aa59f0b4aef250d2137fae6f1040710ae7477c3608767088264ab63802f947a','auth_token',NULL,'[\"*\"]','2025-12-16 20:23:48','2026-01-15 20:13:37','2025-12-16 20:13:37','2025-12-16 20:13:37'),(98,3,'Usuario','f46ec2d9b50e3e4bb7721069bc2763d79ce5575a4d49d80f3cf0409cbafe0330','auth_token',NULL,'[\"*\"]','2025-12-16 20:22:53','2026-01-15 20:21:33','2025-12-16 20:21:33','2025-12-16 20:21:33'),(99,6,'Usuario','70d1f157ff51666b94a82339790c2c5c5fb0858e9a5fea767876eadcdddf5164','auth_token',NULL,'[\"*\"]','2025-12-16 20:30:16','2026-01-15 20:27:23','2025-12-16 20:27:23','2025-12-16 20:27:23'),(100,8,'Usuario','3e20efbd94b4e26c3a41b1b9dba020f2de24c29eb1ee897fed9210906e9d763f','auth_token',NULL,'[\"*\"]','2025-12-16 20:51:35','2026-01-15 20:31:06','2025-12-16 20:31:06','2025-12-16 20:31:06'),(101,25,'Usuario','d38922c2607575e171fa03b0ad1b211a74e48a2a4daa875d463f5fe96f9e8ab5','auth_token',NULL,'[\"*\"]','2025-12-16 21:14:31','2026-01-15 20:51:46','2025-12-16 20:51:46','2025-12-16 20:51:46'),(102,8,'Usuario','127087ae467015c22dbac63ada936fb91c72199d4433f6e15883148a9524af56','auth_token',NULL,'[\"*\"]','2025-12-16 20:56:05','2026-01-15 20:55:52','2025-12-16 20:55:52','2025-12-16 20:55:52'),(103,3,'Usuario','ec655700e6ed74b6cb1c3f53801673e585c1bbaaa90ef0b6a14f9feb0787c184','auth_token',NULL,'[\"*\"]','2025-12-16 20:56:58','2026-01-15 20:56:25','2025-12-16 20:56:25','2025-12-16 20:56:25'),(104,3,'Usuario','519b8ee66f72ddac27f387dd4546538e9793c92b8677dc5c396620e2a1c19abd','auth_token',NULL,'[\"*\"]','2025-12-16 21:12:21','2026-01-15 21:01:54','2025-12-16 21:01:54','2025-12-16 21:01:54'),(105,1,'Usuario','817a64dfdd385452e15f105b975cd98ada698026cd361e1caf1741e7225a09e6','auth_token',NULL,'[\"*\"]','2025-12-16 21:05:14','2026-01-15 21:05:08','2025-12-16 21:05:08','2025-12-16 21:05:08'),(106,6,'Usuario','f45953c8cd742016d4dfdd34e6ad9a419fd422474acfe2f3186409b895b60a8f','auth_token',NULL,'[\"*\"]','2025-12-16 21:18:16','2026-01-15 21:06:11','2025-12-16 21:06:11','2025-12-16 21:06:11'),(107,20,'Usuario','62a717d614ca857c3fa415d9c6a0c2daa87e5afc0efa35b18cc166d5035b64fd','auth_token',NULL,'[\"*\"]','2025-12-16 21:06:29','2026-01-15 21:06:14','2025-12-16 21:06:14','2025-12-16 21:06:14'),(108,23,'Usuario','1382d3c10bc5b187af7a999efe97cab17928599e241b6b228db410a5d288cf25','auth_token',NULL,'[\"*\"]','2025-12-16 21:50:23','2026-01-15 21:11:47','2025-12-16 21:11:47','2025-12-16 21:11:47'),(109,26,'Usuario','3a468111aa0a017e65d3890263596266563e74a3d2dab61ef370f5a7cf069dc4','auth_token',NULL,'[\"*\"]','2025-12-16 21:25:52','2026-01-15 21:20:40','2025-12-16 21:20:40','2025-12-16 21:20:40'),(110,9,'Usuario','1daeb53d2ded1c9b3b212566d7f447a6a7d8f92292ffaffbf5cc674b2f301102','auth_token',NULL,'[\"*\"]','2025-12-16 21:47:35','2026-01-15 21:29:20','2025-12-16 21:29:20','2025-12-16 21:29:20'),(111,27,'Usuario','54b30520675bb5208cb6ff5fb88e65068b7f1e7a541003d42bb63230c03c51cd','auth_token',NULL,'[\"*\"]','2025-12-16 21:51:02','2026-01-15 21:50:42','2025-12-16 21:50:42','2025-12-16 21:50:42'),(112,27,'Usuario','f1a6db9d8388658b350c77faeca42edcc1ebe8c5dfdf05b39c21b85799360047','auth_token',NULL,'[\"*\"]','2025-12-16 21:52:32','2026-01-15 21:52:27','2025-12-16 21:52:27','2025-12-16 21:52:27'),(113,3,'Usuario','c811401145e7ee06b7ff85a156eb8cc623b141e77c7a61bc17c620c87d144dad','auth_token',NULL,'[\"*\"]','2025-12-17 15:00:44','2026-01-16 13:04:14','2025-12-17 13:04:14','2025-12-17 13:04:14'),(114,1,'Usuario','517c91b8245d8e01cc73018a43a0e304db4caa3d27c5ae260d928cc7bd39a579','auth_token',NULL,'[\"*\"]','2025-12-17 13:59:48','2026-01-16 13:26:55','2025-12-17 13:26:55','2025-12-17 13:26:55'),(115,21,'Usuario','f7f0792a14fb9cac7bda13828033604abf5dc9bdcedb4f69b1dc6f99eca6a5c6','auth_token',NULL,'[\"*\"]','2025-12-17 14:00:36','2026-01-16 14:00:36','2025-12-17 14:00:36','2025-12-17 14:00:36'),(116,24,'Usuario','0527751cc97735008234ef462c793552a5ac14ff03ad3d82fb99f554f5b47025','auth_token',NULL,'[\"*\"]','2025-12-17 14:00:59','2026-01-16 14:00:58','2025-12-17 14:00:58','2025-12-17 14:00:58'),(117,20,'Usuario','ff18f4afa58450e64ba31d3ab0b8fc753cdafcc2a9b0867377df0711a54ab2f7','auth_token',NULL,'[\"*\"]','2025-12-17 14:09:11','2026-01-16 14:03:12','2025-12-17 14:03:12','2025-12-17 14:03:12'),(118,26,'Usuario','a099ab008fa0cc74fa12f8146a923ddc48c3b6e6ed0254239e3adaf95e1a2e51','auth_token',NULL,'[\"*\"]','2025-12-17 14:10:20','2026-01-16 14:09:16','2025-12-17 14:09:16','2025-12-17 14:09:16'),(119,23,'Usuario','0b1207718f6350079ac798d6e89eb9e2f5b2b87db993067a626946b55d017d11','auth_token',NULL,'[\"*\"]','2025-12-17 14:16:44','2026-01-16 14:15:34','2025-12-17 14:15:34','2025-12-17 14:15:34'),(120,1,'Usuario','a3a89185a65e9632c57861cfa689c47ca52ea3ca37a2045e674d44858a1f0ade','auth_token',NULL,'[\"*\"]','2025-12-17 15:01:05','2026-01-16 14:56:55','2025-12-17 14:56:55','2025-12-17 14:56:55'),(121,26,'Usuario','88092438c6f79caded1436f88ee4a847113c08b38572ba7231d0fb182ce37328','auth_token',NULL,'[\"*\"]','2025-12-17 15:06:06','2026-01-16 15:04:26','2025-12-17 15:04:26','2025-12-17 15:04:26');
/*!40000 ALTER TABLE `auth_access_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `captacion_canales`
--

DROP TABLE IF EXISTS `captacion_canales`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `captacion_canales` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `codigo` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nombre` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `color_hex` varchar(7) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  `orden` smallint unsigned NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL,
  `updated_at` timestamp NOT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `captacion_canales_codigo_unique` (`codigo`),
  KEY `captacion_canales_activo_orden_idx` (`activo`,`orden`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `captacion_canales`
--

LOCK TABLES `captacion_canales` WRITE;
/*!40000 ALTER TABLE `captacion_canales` DISABLE KEYS */;
INSERT INTO `captacion_canales` VALUES (1,'FACHADA','Fachada','Ingreso por puerta / mostrador','#F59E0B',1,1,'2025-12-15 18:59:16','2025-12-15 18:59:16',NULL),(2,'ASESOR_COMERCIAL','Asesor Comercial','Captación hecha por un asesor comercial (interno)','#10B981',1,2,'2025-12-15 18:59:16','2025-12-15 18:59:16',NULL),(3,'ASESOR_CONVENIO','Asesor Convenio','Captación hecha por asesor de convenio (externo/aliado)','#34D399',1,3,'2025-12-15 18:59:16','2025-12-15 18:59:16',NULL),(4,'TELEMERCADEO','Telemercadeo','Llamadas / call center','#6366F1',1,4,'2025-12-15 18:59:16','2025-12-15 18:59:16',NULL),(5,'REDES','Redes Sociales','Leads desde redes sociales','#8B5CF6',1,5,'2025-12-15 18:59:16','2025-12-15 18:59:16',NULL);
/*!40000 ALTER TABLE `captacion_canales` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `captacion_dateos`
--

DROP TABLE IF EXISTS `captacion_dateos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `captacion_dateos` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `canal` enum('FACHADA','ASESOR_COMERCIAL','ASESOR_CONVENIO','TELE','REDES') COLLATE utf8mb4_unicode_ci NOT NULL,
  `agente_id` int unsigned DEFAULT NULL,
  `placa` varchar(12) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `telefono` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `origen` enum('UI','WHATSAPP','IMPORT') COLLATE utf8mb4_unicode_ci NOT NULL,
  `observacion` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `imagen_url` varchar(512) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `imagen_mime` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `imagen_tamano_bytes` int unsigned DEFAULT NULL,
  `imagen_hash` varchar(128) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `imagen_origen_id` varchar(128) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `imagen_subida_por` int unsigned DEFAULT NULL,
  `consumido_turno_id` int unsigned DEFAULT NULL,
  `consumido_at` datetime DEFAULT NULL,
  `payload_hash` varchar(128) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `convenio_id` int unsigned DEFAULT NULL,
  `asesor_convenio_id` int unsigned DEFAULT NULL,
  `asesor_convenio_usuario_id` int unsigned DEFAULT NULL,
  `prospecto_id` int unsigned DEFAULT NULL,
  `vehiculo_id` int unsigned DEFAULT NULL,
  `cliente_id` int unsigned DEFAULT NULL,
  `resultado` enum('PENDIENTE','EN_PROCESO','EXITOSO','NO_EXITOSO','RE_DATEAR') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDIENTE',
  `liberado` tinyint(1) NOT NULL DEFAULT '0',
  `motivo_no_exitoso` varchar(180) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `detectado_por_convenio` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `captacion_dateos_payload_hash_unique` (`payload_hash`),
  KEY `captacion_dateos_agente_id_foreign` (`agente_id`),
  KEY `captacion_dateos_consumido_turno_id_foreign` (`consumido_turno_id`),
  KEY `captacion_dateos_asesor_convenio_usuario_id_foreign` (`asesor_convenio_usuario_id`),
  KEY `captacion_dateos_vehiculo_id_foreign` (`vehiculo_id`),
  KEY `captacion_dateos_cliente_id_foreign` (`cliente_id`),
  KEY `captacion_dateos_placa_created_at_index` (`placa`,`created_at`),
  KEY `captacion_dateos_telefono_created_at_index` (`telefono`,`created_at`),
  KEY `captacion_dateos_canal_agente_id_created_at_index` (`canal`,`agente_id`,`created_at`),
  KEY `captacion_dateos_consumido_at_index` (`consumido_at`),
  KEY `captacion_dateos_resultado_created_at_index` (`resultado`,`created_at`),
  KEY `captacion_dateos_convenio_id_index` (`convenio_id`),
  KEY `captacion_dateos_asesor_convenio_id_index` (`asesor_convenio_id`),
  KEY `captacion_dateos_prospecto_id_index` (`prospecto_id`),
  KEY `captacion_dateos_liberado_resultado_index` (`liberado`,`resultado`),
  CONSTRAINT `captacion_dateos_agente_id_foreign` FOREIGN KEY (`agente_id`) REFERENCES `agentes_captacions` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `captacion_dateos_asesor_convenio_id_foreign` FOREIGN KEY (`asesor_convenio_id`) REFERENCES `agentes_captacions` (`id`) ON DELETE SET NULL,
  CONSTRAINT `captacion_dateos_asesor_convenio_usuario_id_foreign` FOREIGN KEY (`asesor_convenio_usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL,
  CONSTRAINT `captacion_dateos_cliente_id_foreign` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`) ON DELETE SET NULL,
  CONSTRAINT `captacion_dateos_consumido_turno_id_foreign` FOREIGN KEY (`consumido_turno_id`) REFERENCES `turnos_rtms` (`id`) ON DELETE SET NULL,
  CONSTRAINT `captacion_dateos_convenio_id_foreign` FOREIGN KEY (`convenio_id`) REFERENCES `convenios` (`id`) ON DELETE SET NULL,
  CONSTRAINT `captacion_dateos_prospecto_id_foreign` FOREIGN KEY (`prospecto_id`) REFERENCES `prospectos` (`id`) ON DELETE SET NULL,
  CONSTRAINT `captacion_dateos_vehiculo_id_foreign` FOREIGN KEY (`vehiculo_id`) REFERENCES `vehiculos` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `captacion_dateos`
--

LOCK TABLES `captacion_dateos` WRITE;
/*!40000 ALTER TABLE `captacion_dateos` DISABLE KEYS */;
INSERT INTO `captacion_dateos` VALUES (1,'ASESOR_COMERCIAL',2,'YKT519','3559923816','UI','Escenario 1 (1/8): Diana datea con convenio asignado (Parqueadero Central)\n[AUTO] Vencido por inactividad - Disponible para re-dateo',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,NULL,NULL,NULL,'RE_DATEAR',1,NULL,0,'2025-12-13 09:25:00','2025-12-15 20:29:47'),(2,'ASESOR_COMERCIAL',2,'LAB546','3511919301','UI','Escenario 1 (2/8): Diana datea con convenio asignado (Carolina Rojas)\n[AUTO] Vencido por inactividad - Disponible para re-dateo',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,4,NULL,NULL,NULL,NULL,NULL,'RE_DATEAR',1,NULL,0,'2025-12-13 10:07:00','2025-12-15 20:29:47'),(3,'ASESOR_COMERCIAL',2,'HRV148','3284837542','UI','Escenario 1 (3/8): Diana datea con convenio asignado (Parqueadero Central)\n[AUTO] Vencido por inactividad - Disponible para re-dateo',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,NULL,NULL,NULL,'RE_DATEAR',1,NULL,0,'2025-12-14 07:32:00','2025-12-15 20:29:47'),(4,'ASESOR_COMERCIAL',2,'RVS708','3853741780','UI','Escenario 1 (4/8): Diana datea con convenio asignado (Carolina Rojas)\n[AUTO] Vencido por inactividad - Disponible para re-dateo',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,4,NULL,NULL,NULL,NULL,NULL,'RE_DATEAR',1,NULL,0,'2025-12-13 18:59:00','2025-12-15 20:29:47'),(5,'ASESOR_COMERCIAL',2,'VUR169','3624717273','UI','Escenario 1 (5/8): Diana datea con convenio asignado (Parqueadero Central)\n[AUTO] Vencido por inactividad - Disponible para re-dateo',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,NULL,NULL,NULL,'RE_DATEAR',1,NULL,0,'2025-12-13 05:33:00','2025-12-15 20:29:47'),(6,'ASESOR_COMERCIAL',2,'NCY842','3894033178','UI','Escenario 1 (6/8): Diana datea con convenio asignado (Carolina Rojas)\n[AUTO] Vencido por inactividad - Disponible para re-dateo',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,4,NULL,NULL,NULL,NULL,NULL,'RE_DATEAR',1,NULL,0,'2025-12-13 22:24:00','2025-12-15 20:29:47'),(7,'ASESOR_COMERCIAL',2,'ZJD849','3878400301','UI','Escenario 1 (7/8): Diana datea con convenio asignado (Parqueadero Central)\n[AUTO] Vencido por inactividad - Disponible para re-dateo',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,NULL,NULL,NULL,'RE_DATEAR',1,NULL,0,'2025-12-14 06:26:00','2025-12-15 20:29:47'),(8,'ASESOR_COMERCIAL',2,'RFZ773','3826340586','UI','Escenario 1 (8/8): Diana datea con convenio asignado (Carolina Rojas)\n[AUTO] Vencido por inactividad - Disponible para re-dateo',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,4,NULL,NULL,NULL,NULL,NULL,'RE_DATEAR',1,NULL,0,'2025-12-13 05:55:00','2025-12-15 20:29:47'),(9,'ASESOR_COMERCIAL',1,'ARE261','3577994384','UI','Escenario 2 (1/4): Juan datea SIN convenio\n[AUTO] Vencido por inactividad - Disponible para re-dateo',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'RE_DATEAR',1,NULL,0,'2025-12-13 02:21:00','2025-12-15 20:29:47'),(10,'ASESOR_COMERCIAL',1,'NUH705','3252999251','UI','Escenario 2 (2/4): Juan datea SIN convenio\n[AUTO] Vencido por inactividad - Disponible para re-dateo',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'RE_DATEAR',1,NULL,0,'2025-12-13 19:12:00','2025-12-15 20:29:47'),(11,'ASESOR_COMERCIAL',1,'GWM866','3993026398','UI','Escenario 2 (3/4): Juan datea SIN convenio\n[AUTO] Vencido por inactividad - Disponible para re-dateo',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'RE_DATEAR',1,NULL,0,'2025-12-14 15:21:00','2025-12-15 20:29:47'),(12,'ASESOR_COMERCIAL',1,'WEP357','3556841170','UI','Escenario 2 (4/4): Juan datea SIN convenio\n[AUTO] Vencido por inactividad - Disponible para re-dateo',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'RE_DATEAR',1,NULL,0,'2025-12-14 15:10:00','2025-12-15 20:29:47'),(13,'ASESOR_CONVENIO',3,'LUY166','3396294206','UI','Escenario 3 (1/9): Taller El Cambio datea él mismo\n[AUTO] Vencido por inactividad - Disponible para re-dateo',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,'RE_DATEAR',1,NULL,0,'2025-12-14 03:02:00','2025-12-15 20:29:47'),(14,'ASESOR_CONVENIO',3,'WGW185','3841548183','UI','Escenario 3 (2/9): Taller El Cambio datea él mismo\n[AUTO] Vencido por inactividad - Disponible para re-dateo',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,'RE_DATEAR',1,NULL,0,'2025-12-14 11:58:00','2025-12-15 20:29:47'),(15,'ASESOR_CONVENIO',3,'KRN953','3569787944','UI','Escenario 3 (3/9): Taller El Cambio datea él mismo\n[AUTO] Vencido por inactividad - Disponible para re-dateo',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,'RE_DATEAR',1,NULL,0,'2025-12-13 00:41:00','2025-12-15 20:29:47'),(16,'ASESOR_CONVENIO',4,'JEF205','3420635133','UI','Escenario 3 (4/9): Parqueadero Central datea él mismo\n[AUTO] Vencido por inactividad - Disponible para re-dateo',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,NULL,NULL,NULL,'RE_DATEAR',1,NULL,0,'2025-12-14 08:59:00','2025-12-15 20:29:47'),(17,'ASESOR_CONVENIO',4,'JBH947','3187787604','UI','Escenario 3 (5/9): Parqueadero Central datea él mismo\n[AUTO] Vencido por inactividad - Disponible para re-dateo',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,NULL,NULL,NULL,'RE_DATEAR',1,NULL,0,'2025-12-13 18:31:00','2025-12-15 20:29:47'),(18,'ASESOR_CONVENIO',4,'PMU944','3851483896','UI','Escenario 3 (6/9): Parqueadero Central datea él mismo\n[AUTO] Vencido por inactividad - Disponible para re-dateo',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,NULL,NULL,NULL,NULL,NULL,'RE_DATEAR',1,NULL,0,'2025-12-13 06:57:00','2025-12-15 20:29:47'),(19,'ASESOR_CONVENIO',5,'ZCF758','3162983617','UI','Escenario 3 (7/9): Lavadero TurboWash datea él mismo\n[AUTO] Vencido por inactividad - Disponible para re-dateo',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,3,NULL,NULL,NULL,NULL,NULL,'RE_DATEAR',1,NULL,0,'2025-12-13 08:37:00','2025-12-15 20:29:47'),(20,'ASESOR_CONVENIO',5,'ZZS485','3339901763','UI','Escenario 3 (8/9): Lavadero TurboWash datea él mismo\n[AUTO] Vencido por inactividad - Disponible para re-dateo',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,3,NULL,NULL,NULL,NULL,NULL,'RE_DATEAR',1,NULL,0,'2025-12-14 11:34:00','2025-12-15 20:29:47'),(21,'ASESOR_CONVENIO',5,'UPP313','3862137949','UI','Escenario 3 (9/9): Lavadero TurboWash datea él mismo\n[AUTO] Vencido por inactividad - Disponible para re-dateo',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,3,NULL,NULL,NULL,NULL,NULL,'RE_DATEAR',1,NULL,0,'2025-12-13 17:08:00','2025-12-15 20:29:47'),(22,'ASESOR_COMERCIAL',1,'YUT986','3137237385','UI','Escenario 4 (1/4): Miguel datea para convenio asignado (Taller El Cambio)\n[AUTO] Vencido por inactividad - Disponible para re-dateo',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,'RE_DATEAR',1,NULL,0,'2025-12-13 05:32:00','2025-12-15 20:29:47'),(23,'ASESOR_COMERCIAL',1,'ERW386','3641462499','UI','Escenario 4 (2/4): Miguel datea para convenio asignado (Lavadero TurboWash)\n[AUTO] Vencido por inactividad - Disponible para re-dateo',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,3,NULL,NULL,NULL,NULL,NULL,'RE_DATEAR',1,NULL,0,'2025-12-14 00:03:00','2025-12-15 20:29:47'),(24,'ASESOR_COMERCIAL',1,'LVD214','3927621499','UI','Escenario 4 (3/4): Miguel datea para convenio asignado (Taller ProService)\n[AUTO] Vencido por inactividad - Disponible para re-dateo',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,5,NULL,NULL,NULL,NULL,NULL,'RE_DATEAR',1,NULL,0,'2025-12-13 00:01:00','2025-12-15 20:29:47'),(25,'ASESOR_COMERCIAL',1,'XAX464','3850668082','UI','Escenario 4 (4/4): Miguel datea para convenio asignado (Taller El Cambio)\n[AUTO] Vencido por inactividad - Disponible para re-dateo',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,'RE_DATEAR',1,NULL,0,'2025-12-13 01:14:00','2025-12-15 20:29:47'),(26,'TELE',NULL,'VAH915','3191216258','UI','OTRO (TELE) (1/3): dateo de telemercadeo\n[AUTO] Vencido por inactividad - Disponible para re-dateo',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'RE_DATEAR',1,NULL,0,'2025-12-13 18:24:00','2025-12-15 20:29:47'),(27,'TELE',NULL,'CCS827','3283669623','UI','OTRO (TELE) (2/3): dateo de telemercadeo\n[AUTO] Vencido por inactividad - Disponible para re-dateo',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'RE_DATEAR',1,NULL,0,'2025-12-13 01:16:00','2025-12-15 20:29:47'),(28,'TELE',NULL,'FPM353','3625748342','UI','OTRO (TELE) (3/3): dateo de telemercadeo\n[AUTO] Vencido por inactividad - Disponible para re-dateo',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'RE_DATEAR',1,NULL,0,'2025-12-14 08:43:00','2025-12-15 20:29:47'),(29,'FACHADA',NULL,'HAN494','3268655109','UI','OTRO (FACHADA) (1/2): dateo tomado en fachada\n[AUTO] Vencido por inactividad - Disponible para re-dateo',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'RE_DATEAR',1,NULL,0,'2025-12-13 11:50:00','2025-12-15 20:29:47'),(30,'FACHADA',NULL,'SNY685','3168133651','UI','OTRO (FACHADA) (2/2): dateo tomado en fachada\n[AUTO] Vencido por inactividad - Disponible para re-dateo',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'RE_DATEAR',1,NULL,0,'2025-12-14 08:43:00','2025-12-15 20:29:47'),(31,'REDES',NULL,'DVK667','3284350911','UI','OTRO (REDES) (1/2): dateo proveniente de redes\n[AUTO] Vencido por inactividad - Disponible para re-dateo',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'RE_DATEAR',1,NULL,0,'2025-12-13 08:43:00','2025-12-15 20:29:47'),(32,'REDES',NULL,'RZY880','3894279205','UI','OTRO (REDES) (2/2): dateo proveniente de redes\n[AUTO] Vencido por inactividad - Disponible para re-dateo',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'RE_DATEAR',1,NULL,0,'2025-12-13 19:47:00','2025-12-15 20:29:47'),(34,'ASESOR_COMERCIAL',1,'123ERT','11111111','UI','12121212\n[AUTO] Vencido por inactividad - Disponible para re-dateo','/api/uploads/dateos/2025/12/ob01504um56staxev5wnuu21.jpg','image',65536,NULL,'ob01504um56staxev5wnuu21.jpg',NULL,NULL,NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,'RE_DATEAR',1,NULL,0,'2025-12-15 20:44:24','2025-12-15 20:49:20'),(36,'ASESOR_COMERCIAL',1,'BCD123',NULL,'UI','[AUTO] Vencido por inactividad - Disponible para re-dateo','/api/uploads/dateos/2025/12/uxndgd6witnsnmvbci71iv89.jpg','image',110360,NULL,'uxndgd6witnsnmvbci71iv89.jpg',NULL,NULL,NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,'RE_DATEAR',1,NULL,0,'2025-12-15 21:34:39','2025-12-16 13:24:23'),(37,'ASESOR_COMERCIAL',1,'123FGH',NULL,'UI','[AUTO] Vencido por inactividad - Disponible para re-dateo','/api/uploads/dateos/2025/12/amqxch89f193cv18nallqq51.jpg','image',87111,NULL,'amqxch89f193cv18nallqq51.jpg',NULL,NULL,NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,'RE_DATEAR',1,NULL,0,'2025-12-16 13:26:45','2025-12-16 14:12:19'),(39,'ASESOR_COMERCIAL',8,'BBB333',NULL,'UI',NULL,'/api/uploads/dateos/2025/12/uvgtauiqbk5weusry0gk0zjl.jpeg','image',9308,NULL,'uvgtauiqbk5weusry0gk0zjl.jpeg',NULL,96,'2025-12-16 09:24:50',NULL,4,NULL,NULL,51,NULL,NULL,'EN_PROCESO',0,NULL,0,'2025-12-16 14:24:21','2025-12-16 09:24:50'),(40,'ASESOR_COMERCIAL',8,'ASD123',NULL,'UI',NULL,'/api/uploads/dateos/2025/12/zrdeb6kx378l76owcs9bnoyq.jpeg','image',7589,NULL,'zrdeb6kx378l76owcs9bnoyq.jpeg',NULL,97,'2025-12-16 15:02:09',NULL,4,NULL,NULL,52,NULL,NULL,'EXITOSO',0,NULL,0,'2025-12-16 20:00:57','2025-12-16 20:07:10'),(41,'ASESOR_COMERCIAL',8,'QWE123','3123213','UI',NULL,'/api/uploads/dateos/2025/12/hv34ou799lqg5fhue5c7lczt.jpg','image',82616,NULL,'hv34ou799lqg5fhue5c7lczt.jpg',NULL,99,'2025-12-16 15:28:00',NULL,6,NULL,NULL,NULL,NULL,NULL,'EN_PROCESO',0,NULL,0,'2025-12-16 20:08:36','2025-12-16 15:28:00'),(42,'ASESOR_COMERCIAL',8,'DDD222',NULL,'UI',NULL,NULL,NULL,NULL,NULL,NULL,NULL,100,'2025-12-16 16:06:37',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'EXITOSO',0,NULL,0,'2025-12-16 21:06:26','2025-12-16 21:07:37');
/*!40000 ALTER TABLE `captacion_dateos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cargos`
--

DROP TABLE IF EXISTS `cargos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cargos` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NOT NULL,
  `updated_at` timestamp NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `cargos_nombre_unique` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cargos`
--

LOCK TABLES `cargos` WRITE;
/*!40000 ALTER TABLE `cargos` DISABLE KEYS */;
INSERT INTO `cargos` VALUES (1,'DIRECCION DE CALIDAD Y AUDITORÍA','2025-12-15 18:59:14','2025-12-15 18:59:14'),(2,'DIRECCION ADMINISTRATIVA Y COMERCIAL','2025-12-15 18:59:14','2025-12-15 18:59:14'),(3,'GERENCIA','2025-12-15 18:59:14','2025-12-15 18:59:14'),(4,'TALENTO HUMANO','2025-12-15 18:59:14','2025-12-15 18:59:14'),(5,'CONTADOR','2025-12-15 18:59:14','2025-12-15 18:59:14'),(6,'LIDER DE SEDE','2025-12-15 18:59:14','2025-12-15 18:59:14'),(7,'LIDER DE INFORMES','2025-12-15 18:59:14','2025-12-15 18:59:14'),(8,'ASESOR COMERCIAL','2025-12-15 18:59:14','2025-12-15 18:59:14'),(9,'ASESOR CONVENIO','2025-12-15 18:59:14','2025-12-15 18:59:14'),(10,'ASESOR SERVICIO AL CLIENTE','2025-12-15 18:59:14','2025-12-15 18:59:14'),(11,'INGENIERO','2025-12-15 18:59:14','2025-12-15 18:59:14'),(12,'INSPECTOR','2025-12-15 18:59:14','2025-12-15 18:59:14');
/*!40000 ALTER TABLE `cargos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `certificaciones`
--

DROP TABLE IF EXISTS `certificaciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `certificaciones` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `turno_id` int unsigned NOT NULL,
  `usuario_id` int unsigned DEFAULT NULL,
  `imagen_path` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `observaciones` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `certificaciones_turno_id_foreign` (`turno_id`),
  KEY `certificaciones_usuario_id_foreign` (`usuario_id`),
  CONSTRAINT `certificaciones_turno_id_foreign` FOREIGN KEY (`turno_id`) REFERENCES `turnos_rtms` (`id`) ON DELETE CASCADE,
  CONSTRAINT `certificaciones_usuario_id_foreign` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `certificaciones`
--

LOCK TABLES `certificaciones` WRITE;
/*!40000 ALTER TABLE `certificaciones` DISABLE KEYS */;
INSERT INTO `certificaciones` VALUES (1,92,1,'uploads/certificaciones/1765835983465_92.jpg',NULL,'2025-12-15 21:59:43','2025-12-15 21:59:43');
/*!40000 ALTER TABLE `certificaciones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ciudades`
--

DROP TABLE IF EXISTS `ciudades`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ciudades` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `departamento` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ciudades_nombre_unique` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ciudades`
--

LOCK TABLES `ciudades` WRITE;
/*!40000 ALTER TABLE `ciudades` DISABLE KEYS */;
INSERT INTO `ciudades` VALUES (1,'Ibagué','Tolima',1,'2025-12-15 18:59:14','2025-12-15 18:59:14'),(2,'Bogotá D.C.','Cundinamarca ',1,'2025-12-15 18:59:14','2025-12-15 18:59:14');
/*!40000 ALTER TABLE `ciudades` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clases_vehiculos`
--

DROP TABLE IF EXISTS `clases_vehiculos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clases_vehiculos` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `codigo` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nombre` varchar(60) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NOT NULL,
  `updated_at` timestamp NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `clases_vehiculos_codigo_unique` (`codigo`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clases_vehiculos`
--

LOCK TABLES `clases_vehiculos` WRITE;
/*!40000 ALTER TABLE `clases_vehiculos` DISABLE KEYS */;
INSERT INTO `clases_vehiculos` VALUES (1,'LIV_PART','Liviano Particular','2025-12-15 18:59:15','2025-12-15 18:59:15'),(2,'LIV_TAXI','Liviano Taxi','2025-12-15 18:59:15','2025-12-15 18:59:15'),(3,'LIV_PUBLICO','Liviano Público','2025-12-15 18:59:15','2025-12-15 18:59:15'),(4,'MOTO','Motocicleta','2025-12-15 18:59:15','2025-12-15 18:59:15');
/*!40000 ALTER TABLE `clases_vehiculos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clientes`
--

DROP TABLE IF EXISTS `clientes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clientes` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(120) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `doc_tipo` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `doc_numero` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `telefono` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(120) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ciudad_id` int unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `clientes_telefono_unique` (`telefono`),
  UNIQUE KEY `clientes_doc_tipo_doc_numero_unique` (`doc_tipo`,`doc_numero`)
) ENGINE=InnoDB AUTO_INCREMENT=67 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clientes`
--

LOCK TABLES `clientes` WRITE;
/*!40000 ALTER TABLE `clientes` DISABLE KEYS */;
INSERT INTO `clientes` VALUES (1,'Andrés Pérezs','CC','1012345678','3000000001','andres.perez@example.com',NULL,'2025-12-15 18:59:15','2025-12-16 21:03:07'),(2,'María Torres','CC','1034567890','3010000003','maria.torres@example.com',NULL,'2025-12-15 18:59:15','2025-12-15 18:59:15'),(3,'Carlos Ruiz','CC','79876543','3020000005','carlos.ruiz@example.com',NULL,'2025-12-15 18:59:15','2025-12-15 18:59:15'),(4,'Juanita Rojas','CE','A1234567','3030000007','juanita.rojas@example.com',NULL,'2025-12-15 18:59:15','2025-12-15 18:59:15'),(5,'Diego Lozano','PAS','P9876543','3050000009','diego.lozano@example.com',NULL,'2025-12-15 18:59:15','2025-12-15 18:59:15'),(6,'Transporte Gómez SAS','NIT','900123456','3200000002','contacto@tgomez.com',NULL,'2025-12-15 18:59:15','2025-12-15 18:59:15'),(7,'Taller Los Andes SAS','NIT','901234567','3210000004','recepcion@tallerandes.com',NULL,'2025-12-15 18:59:15','2025-12-15 18:59:15'),(8,'Importadora Zeta LTDA','NIT','830112233','3220000006','ventas@zeta.com',NULL,'2025-12-15 18:59:15','2025-12-15 18:59:15'),(9,'Acme Logistics SAS','NIT','900987654','3230000010','info@acmelogistics.co',NULL,'2025-12-15 18:59:15','2025-12-15 18:59:15'),(10,NULL,NULL,NULL,'3040000008',NULL,NULL,'2025-12-15 18:59:15','2025-12-15 18:59:15'),(11,'Empresa 0015','NIT','900070015','3758164437',NULL,NULL,'2025-12-15 18:59:15','2025-12-15 18:59:15'),(12,'Sofía López','CC','1063424741','3162785598',NULL,NULL,'2025-12-15 18:59:15','2025-12-15 18:59:15'),(13,'Laura Hernández','CC','1246310862','3542974266',NULL,NULL,'2025-12-15 18:59:15','2025-12-15 18:59:15'),(14,'Sofía Ruiz','CC','1456826260','3417215092','sofía.ruiz@mail.com',NULL,'2025-12-15 18:59:15','2025-12-15 18:59:15'),(15,'Empresa 4155','NIT','900054155','3771803368',NULL,NULL,'2025-12-15 18:59:15','2025-12-15 18:59:15'),(16,'María Ruiz','CC','1153054109','3993890924',NULL,NULL,'2025-12-15 18:59:15','2025-12-15 18:59:15'),(17,'María Hernández','CC','1805555461','3709241581',NULL,NULL,'2025-12-15 18:59:15','2025-12-15 18:59:15'),(18,'Paula Pérez','CC','1752440223','3970880800','paula.pérez@mail.com',NULL,'2025-12-15 18:59:15','2025-12-15 18:59:15'),(19,'Mateo Gómez','CC','1852896700','3694860784','mateo.gómez@mail.com',NULL,'2025-12-15 18:59:15','2025-12-15 18:59:15'),(20,'Empresa 8736','NIT','900048736','3115182630',NULL,NULL,'2025-12-15 18:59:15','2025-12-15 18:59:15'),(21,'Empresa 9533','NIT','900069533','3247957152',NULL,NULL,'2025-12-15 18:59:15','2025-12-15 18:59:15'),(22,'Andrés López','CC','1002306794','3628361112',NULL,NULL,'2025-12-15 18:59:15','2025-12-15 18:59:15'),(23,'Camila Gómez','CC','1547220327','3972129333',NULL,NULL,'2025-12-15 18:59:15','2025-12-15 18:59:15'),(24,'Empresa 6362','NIT','900006362','3704337046','contacto362@empresa.com',NULL,'2025-12-15 18:59:15','2025-12-15 18:59:15'),(25,'Daniela Ruiz','CC','1573691950','3709476172','daniela.ruiz@mail.com',NULL,'2025-12-15 18:59:15','2025-12-15 18:59:15'),(26,'Empresa 5175','NIT','900075175','3391033366','contacto175@empresa.com',NULL,'2025-12-15 18:59:15','2025-12-15 18:59:15'),(27,'Daniela Hernández','CE','E172190','3874815640','daniela.hernández@mail.com',NULL,'2025-12-15 18:59:15','2025-12-15 18:59:15'),(28,'Andrés Rojas','CE','E521701','3519871124','andrés.rojas@mail.com',NULL,'2025-12-15 18:59:15','2025-12-15 18:59:15'),(29,'Empresa 8533','NIT','900008533','3457496118',NULL,NULL,'2025-12-15 18:59:15','2025-12-15 18:59:15'),(30,'María Hernández','CE','E232139','3493986439','maría.hernández@mail.com',NULL,'2025-12-15 18:59:15','2025-12-15 18:59:15'),(31,'Julián Gómez','PAS','P5980754','3163529257',NULL,NULL,'2025-12-15 18:59:15','2025-12-15 18:59:15'),(32,'Empresa 1408','NIT','900001408','3443760865',NULL,NULL,'2025-12-15 18:59:15','2025-12-15 18:59:15'),(33,'Carlos Pérez','CC','1877817160','3494766499','carlos.pérez@mail.com',NULL,'2025-12-15 18:59:15','2025-12-15 18:59:15'),(34,'Empresa 6210','NIT','900056210','3383760221',NULL,NULL,'2025-12-15 18:59:15','2025-12-15 18:59:15'),(35,'Empresa 4747','NIT','900094747','3312831339','contacto747@empresa.com',NULL,'2025-12-15 18:59:15','2025-12-15 18:59:15'),(36,'Andrés Gómez','CC','1662440724','3206706460',NULL,NULL,'2025-12-15 18:59:15','2025-12-15 18:59:15'),(37,'Julián Pérez','CC','1142544012','3650828293',NULL,NULL,'2025-12-15 18:59:15','2025-12-15 18:59:15'),(38,'Felipe Hernández','CC','1194347835','3486715442',NULL,NULL,'2025-12-15 18:59:15','2025-12-15 18:59:15'),(39,'Luis Rojas','CC','1546598714','3414789180','luis.rojas@mail.com',NULL,'2025-12-15 18:59:15','2025-12-15 18:59:15'),(40,'Ana Rodríguez','CC','1052266774','3917965993','ana.rodríguez@mail.com',NULL,'2025-12-15 18:59:15','2025-12-15 18:59:15'),(41,'Empresa 9640','NIT','900009640','3612688756','contacto640@empresa.com',NULL,'2025-12-15 18:59:15','2025-12-15 18:59:15'),(42,'Andrés Castro','CC','1651783817','3336027191','andrés.castro@mail.com',NULL,'2025-12-15 18:59:15','2025-12-15 18:59:15'),(43,'Andrés Pérez','CC','1046959294','3635223649',NULL,NULL,'2025-12-15 18:59:15','2025-12-15 18:59:15'),(44,'Empresa 9390','NIT','900049390','3757918809','contacto390@empresa.com',NULL,'2025-12-15 18:59:15','2025-12-15 18:59:15'),(45,'Paula Martínez','CC','1740076867','3569641201','paula.martínez@mail.com',NULL,'2025-12-15 18:59:15','2025-12-15 18:59:15'),(46,'María Hernández','CC','1399566987','3404977560',NULL,NULL,'2025-12-15 18:59:15','2025-12-15 18:59:15'),(47,'Empresa 7386','NIT','900077386','3201678349','contacto386@empresa.com',NULL,'2025-12-15 18:59:15','2025-12-15 18:59:15'),(48,'Felipe Martínez','CE','E863959','3155736808','felipe.martínez@mail.com',NULL,'2025-12-15 18:59:15','2025-12-15 18:59:15'),(49,'Julián Hernández','CC','1024276986','3630560749',NULL,NULL,'2025-12-15 18:59:15','2025-12-15 18:59:15'),(50,'Julián Hernández','CC','1805297345','3665396534','julián.hernández@mail.com',NULL,'2025-12-15 18:59:15','2025-12-15 18:59:15'),(51,'FABIO SÁNCHEZ DIAZ','CC','93397652','3004938880',NULL,NULL,'2025-12-17 14:09:36','2025-12-17 14:09:36'),(52,'MARIA RODRIGUEZ JIMENEZ','CC','28935992','3114787798','MARIARODRIGUEZJIMENEZ04@HOTMAIL.COM',NULL,'2025-12-17 14:09:36','2025-12-17 14:09:36'),(53,'JOSE EVER FANDIÑO','CC','5833142','3108770598',NULL,NULL,'2025-12-17 14:09:36','2025-12-17 14:09:36'),(54,'JESÚS ANTONIO SAENZ','CC','93117443','3178252882','JASAENZQ@GMAIL.COM',NULL,'2025-12-17 14:09:36','2025-12-17 14:09:36'),(55,'MONICA CARRERA ANGARITA','CC','1105750069','3133706868','HERMANOSROMEROSAS@GMAIL.COM',NULL,'2025-12-17 14:09:36','2025-12-17 14:09:36'),(56,'MARIA ALEJANDRA RAMIREZ','CC','1110525494','3123097365',NULL,NULL,'2025-12-17 14:09:36','2025-12-17 14:09:36'),(57,'diegop alejandro','CC','1001277604','3224515459',NULL,NULL,'2025-12-17 14:09:36','2025-12-17 14:09:36'),(58,'ALEJANDRO BERMUDEZ','CC','1104939675','3228276699',NULL,NULL,'2025-12-17 14:09:36','2025-12-17 14:09:36'),(59,'MARY LUZ REYES SERNA','CC','28551296','3158517360','JUANPABLOGIRALDO45@GMAIL.COM',NULL,'2025-12-17 14:09:36','2025-12-17 14:09:36'),(60,'CAREN GISETH NARVAEZ RODRIGUEZ','CC','1110504178','3213603317','DIEGOVALLEJO0807@HOTMAIL.COM',NULL,'2025-12-17 14:09:36','2025-12-17 14:09:36'),(61,'JORGE LUIS LEYTON','CC','1110524866','3144036944',NULL,NULL,'2025-12-17 14:09:36','2025-12-17 14:09:36'),(62,'MARTHA RUTH LOZANO','CC','65753763','3214520327',NULL,NULL,'2025-12-17 14:09:36','2025-12-17 14:09:36'),(63,'LOREN JULIETH DÍAZ CAMPOS','CC','1075280424','3144785825','LORENJULITHDIAZ@GMAIL.COM',NULL,'2025-12-17 14:09:36','2025-12-17 14:09:36'),(64,'PEREZ SALINAS MARCO FIDEL','CC','6006701','3025465352','CALICHE_723@HOTMAIL.COM',NULL,'2025-12-17 14:09:36','2025-12-17 14:09:36'),(65,'YAMILE BONILLA HENAO','CC','28541416','3202129330',NULL,NULL,'2025-12-17 14:09:36','2025-12-17 14:09:36'),(66,'Denis','CC','23012312','3249623203',NULL,NULL,'2025-12-17 14:09:36','2025-12-17 14:09:36');
/*!40000 ALTER TABLE `clientes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comisiones`
--

DROP TABLE IF EXISTS `comisiones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comisiones` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `captacion_dateo_id` int unsigned DEFAULT NULL,
  `asesor_id` int unsigned DEFAULT NULL,
  `convenio_id` int unsigned DEFAULT NULL,
  `tipo_servicio` enum('RTM','TECNOMECANICA','PREVENTIVA','SOAT','OTRO') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'RTM',
  `tipo_vehiculo` enum('MOTO','VEHICULO') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `base` decimal(12,2) NOT NULL DEFAULT '0.00',
  `porcentaje` decimal(5,2) NOT NULL DEFAULT '0.00',
  `monto` decimal(12,2) NOT NULL DEFAULT '0.00',
  `monto_asesor` decimal(12,2) DEFAULT NULL,
  `monto_convenio` decimal(12,2) DEFAULT NULL,
  `asesor_secundario_id` int unsigned DEFAULT NULL,
  `meta_rtm` int unsigned NOT NULL DEFAULT '0',
  `valor_rtm_moto` decimal(12,2) NOT NULL DEFAULT '0.00',
  `valor_rtm_vehiculo` decimal(12,2) NOT NULL DEFAULT '0.00',
  `porcentaje_comision_meta` decimal(5,2) NOT NULL DEFAULT '0.00',
  `estado` enum('PENDIENTE','APROBADA','PAGADA','ANULADA') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDIENTE',
  `es_config` tinyint(1) NOT NULL DEFAULT '0',
  `fecha_calculo` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `calculado_por` int unsigned DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `comisiones_captacion_dateo_id_foreign` (`captacion_dateo_id`),
  KEY `comisiones_convenio_id_foreign` (`convenio_id`),
  KEY `comisiones_calculado_por_foreign` (`calculado_por`),
  KEY `comisiones_asesor_id_estado_index` (`asesor_id`,`estado`),
  KEY `comisiones_asesor_secundario_id_index` (`asesor_secundario_id`),
  KEY `comisiones_tipo_servicio_estado_index` (`tipo_servicio`,`estado`),
  KEY `comisiones_fecha_calculo_index` (`fecha_calculo`),
  KEY `comisiones_es_config_index` (`es_config`),
  KEY `comisiones_tipo_vehiculo_es_config_index` (`tipo_vehiculo`,`es_config`),
  CONSTRAINT `comisiones_asesor_id_foreign` FOREIGN KEY (`asesor_id`) REFERENCES `agentes_captacions` (`id`) ON DELETE SET NULL,
  CONSTRAINT `comisiones_asesor_secundario_id_foreign` FOREIGN KEY (`asesor_secundario_id`) REFERENCES `agentes_captacions` (`id`) ON DELETE SET NULL,
  CONSTRAINT `comisiones_calculado_por_foreign` FOREIGN KEY (`calculado_por`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL,
  CONSTRAINT `comisiones_captacion_dateo_id_foreign` FOREIGN KEY (`captacion_dateo_id`) REFERENCES `captacion_dateos` (`id`) ON DELETE CASCADE,
  CONSTRAINT `comisiones_convenio_id_foreign` FOREIGN KEY (`convenio_id`) REFERENCES `convenios` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comisiones`
--

LOCK TABLES `comisiones` WRITE;
/*!40000 ALTER TABLE `comisiones` DISABLE KEYS */;
INSERT INTO `comisiones` VALUES (1,NULL,NULL,NULL,'OTRO','MOTO',4000.00,0.00,15000.00,NULL,NULL,NULL,0,0.00,0.00,0.00,'PENDIENTE',1,'2025-12-15 20:39:51',NULL,'2025-12-15 20:39:51','2025-12-15 20:39:51'),(2,NULL,NULL,NULL,'OTRO','VEHICULO',3000.00,0.00,12000.00,NULL,NULL,NULL,0,0.00,0.00,0.00,'PENDIENTE',1,'2025-12-15 20:40:01',NULL,'2025-12-15 20:40:01','2025-12-15 20:40:01'),(3,NULL,8,NULL,'OTRO','MOTO',100.00,0.00,200.00,NULL,NULL,NULL,0,0.00,0.00,0.00,'PENDIENTE',1,'2025-12-15 20:41:15',NULL,'2025-12-15 20:41:15','2025-12-15 20:41:15'),(4,NULL,8,NULL,'OTRO','VEHICULO',200.00,0.00,300.00,NULL,NULL,NULL,0,0.00,0.00,0.00,'PENDIENTE',1,'2025-12-15 20:41:30',NULL,'2025-12-15 20:41:30','2025-12-15 20:41:30'),(5,40,8,4,'RTM','MOTO',4000.00,0.00,200.00,200.00,4000.00,6,0,0.00,0.00,0.00,'ANULADA',0,'2025-12-16 20:07:10',21,'2025-12-16 20:07:10','2025-12-16 21:05:14'),(6,NULL,6,NULL,'OTRO','MOTO',900.00,0.00,800.00,NULL,NULL,NULL,0,0.00,0.00,0.00,'PENDIENTE',1,'2025-12-16 20:07:57',NULL,'2025-12-16 20:07:57','2025-12-16 20:07:57'),(7,41,8,6,'RTM','VEHICULO',3000.00,0.00,300.00,300.00,3000.00,15,0,0.00,0.00,0.00,'PAGADA',0,'2025-12-16 20:10:41',21,'2025-12-16 20:10:41','2025-12-16 20:13:54'),(8,42,8,NULL,'RTM','VEHICULO',200.00,0.00,300.00,300.00,200.00,NULL,0,0.00,0.00,0.00,'ANULADA',0,'2025-12-16 21:07:37',21,'2025-12-16 21:07:37','2025-12-16 21:18:15');
/*!40000 ALTER TABLE `comisiones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `conductores`
--

DROP TABLE IF EXISTS `conductores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `conductores` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `doc_tipo` varchar(8) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `doc_numero` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `telefono` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `conductores_telefono_index` (`telefono`),
  KEY `conductores_doc_tipo_doc_numero_index` (`doc_tipo`,`doc_numero`)
) ENGINE=InnoDB AUTO_INCREMENT=71 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `conductores`
--

LOCK TABLES `conductores` WRITE;
/*!40000 ALTER TABLE `conductores` DISABLE KEYS */;
INSERT INTO `conductores` VALUES (1,'Paula Pérez (Conductor)','CC','1752440223','3970880800',NULL,'2025-12-15 18:59:16','2025-12-15 18:59:16'),(2,'María Hernández (Conductor)','CC','1399566987','3404977560',NULL,'2025-12-15 18:59:16','2025-12-15 18:59:16'),(3,'Andrés Gómez (Conductor)','CC','1662440724','3206706460',NULL,'2025-12-15 18:59:16','2025-12-15 18:59:16'),(4,'Empresa 8736 (Conductor)','NIT','900048736','3115182630',NULL,'2025-12-15 18:59:16','2025-12-15 18:59:16'),(5,'Andrés López (Conductor)','CC','1002306794','3628361112',NULL,'2025-12-15 18:59:16','2025-12-15 18:59:16'),(6,'Daniela Ruiz (Conductor)','CC','1573691950','3709476172',NULL,'2025-12-15 18:59:16','2025-12-15 18:59:16'),(7,'Camila Gómez (Conductor)','CC','1547220327','3972129333',NULL,'2025-12-15 18:59:16','2025-12-15 18:59:16'),(8,'Conductor DXT363','CC',NULL,'3040000008',NULL,'2025-12-15 18:59:16','2025-12-15 18:59:16'),(9,'Conductor DFA291','CC',NULL,'3040000008',NULL,'2025-12-15 18:59:16','2025-12-15 18:59:16'),(10,'Julián Hernández (Conductor)','CC','1805297345','3665396534',NULL,'2025-12-15 18:59:16','2025-12-15 18:59:16'),(11,'Empresa 9390 (Conductor)','NIT','900049390','3757918809',NULL,'2025-12-15 18:59:16','2025-12-15 18:59:16'),(12,'Empresa 4155 (Conductor)','NIT','900054155','3771803368',NULL,'2025-12-15 18:59:16','2025-12-15 18:59:16'),(13,'Empresa 0015 (Conductor)','NIT','900070015','3758164437',NULL,'2025-12-15 18:59:16','2025-12-15 18:59:16'),(14,'Empresa 9533 (Conductor)','NIT','900069533','3247957152',NULL,'2025-12-15 18:59:16','2025-12-15 18:59:16'),(15,'Felipe Hernández (Conductor)','CC','1194347835','3486715442',NULL,'2025-12-15 18:59:16','2025-12-15 18:59:16'),(16,'Laura Hernández (Conductor)','CC','1246310862','3542974266',NULL,'2025-12-15 18:59:16','2025-12-15 18:59:16'),(17,'Empresa 9640 (Conductor)','NIT','900009640','3612688756',NULL,'2025-12-15 18:59:16','2025-12-15 18:59:16'),(18,'Julián Gómez (Conductor)','PAS','P5980754','3163529257',NULL,'2025-12-15 18:59:16','2025-12-15 18:59:16'),(19,'María Ruiz (Conductor)','CC','1153054109','3993890924',NULL,'2025-12-15 18:59:16','2025-12-15 18:59:16'),(20,'Sofía Ruiz (Conductor)','CC','1456826260','3417215092',NULL,'2025-12-15 18:59:16','2025-12-15 18:59:16'),(21,'Empresa 7386 (Conductor)','NIT','900077386','3201678349',NULL,'2025-12-15 18:59:16','2025-12-15 18:59:16'),(22,'Felipe Martínez (Conductor)','CE','E863959','3155736808',NULL,'2025-12-15 18:59:16','2025-12-15 18:59:16'),(23,'Empresa 4747 (Conductor)','NIT','900094747','3312831339',NULL,'2025-12-15 18:59:16','2025-12-15 18:59:16'),(24,'Diego Lozano (Conductor)','PAS','P9876543','3050000009',NULL,'2025-12-15 18:59:16','2025-12-15 18:59:16'),(25,'Paula Martínez (Conductor)','CC','1740076867','3569641201',NULL,'2025-12-15 18:59:16','2025-12-15 18:59:16'),(26,'Carlos Pérez (Conductor)','CC','1877817160','3494766499',NULL,'2025-12-15 18:59:16','2025-12-15 18:59:16'),(27,'Conductor WMR961','CC',NULL,NULL,NULL,'2025-12-15 18:59:16','2025-12-15 18:59:16'),(28,'Conductor XJT152','CC',NULL,NULL,NULL,'2025-12-15 18:59:16','2025-12-15 18:59:16'),(29,'Luis Rojas (Conductor)','CC','1546598714','3414789180',NULL,'2025-12-15 18:59:16','2025-12-15 18:59:16'),(30,'Empresa 6362 (Conductor)','NIT','900006362','3704337046',NULL,'2025-12-15 18:59:16','2025-12-15 18:59:16'),(31,'Conductor NTS075','CC',NULL,NULL,NULL,'2025-12-15 18:59:16','2025-12-15 18:59:16'),(32,'Andrés Pérez (Conductor)','CC','1012345678','3000000001',NULL,'2025-12-15 18:59:16','2025-12-15 18:59:16'),(33,'María Torres (Conductor)','CC','1034567890','3010000003',NULL,'2025-12-15 18:59:16','2025-12-15 18:59:16'),(34,'Carlos Ruiz (Conductor)','CC','79876543','3020000005',NULL,'2025-12-15 18:59:16','2025-12-15 18:59:16'),(35,'Juanita Rojas (Conductor)','CE','A1234567','3030000007',NULL,'2025-12-15 18:59:16','2025-12-15 18:59:16'),(36,'Sofía López (Conductor)','CC','1063424741','3162785598',NULL,'2025-12-15 18:59:16','2025-12-15 18:59:16'),(37,'Transporte Gómez SAS (Conductor)','NIT','900123456','3200000002',NULL,'2025-12-15 18:59:16','2025-12-15 18:59:16'),(38,'Taller Los Andes SAS (Conductor)','NIT','901234567','3210000004',NULL,'2025-12-15 18:59:16','2025-12-15 18:59:16'),(39,'Importadora Zeta LTDA (Conductor)','NIT','830112233','3220000006',NULL,'2025-12-15 18:59:16','2025-12-15 18:59:16'),(40,'Acme Logistics SAS (Conductor)','NIT','900987654','3230000010',NULL,'2025-12-15 18:59:16','2025-12-15 18:59:16'),(41,'Andrés Castro (Conductor)','CC','1651783817','3336027191',NULL,'2025-12-15 18:59:16','2025-12-15 18:59:16'),(42,'Empresa 6210 (Conductor)','NIT','900056210','3383760221',NULL,'2025-12-15 18:59:16','2025-12-15 18:59:16'),(43,'Empresa 5175 (Conductor)','NIT','900075175','3391033366',NULL,'2025-12-15 18:59:16','2025-12-15 18:59:16'),(44,'Empresa 1408 (Conductor)','NIT','900001408','3443760865',NULL,'2025-12-15 18:59:16','2025-12-15 18:59:16'),(45,'Empresa 8533 (Conductor)','NIT','900008533','3457496118',NULL,'2025-12-15 18:59:16','2025-12-15 18:59:16'),(46,'María Hernández (Conductor)','CE','E232139','3493986439',NULL,'2025-12-15 18:59:16','2025-12-15 18:59:16'),(47,'Andrés Rojas (Conductor)','CE','E521701','3519871124',NULL,'2025-12-15 18:59:16','2025-12-15 18:59:16'),(48,'Julián Hernández (Conductor)','CC','1024276986','3630560749',NULL,'2025-12-15 18:59:16','2025-12-15 18:59:16'),(49,'Andrés Pérez (Conductor)','CC','1046959294','3635223649',NULL,'2025-12-15 18:59:16','2025-12-15 18:59:16'),(50,'Julián Pérez (Conductor)','CC','1142544012','3650828293',NULL,'2025-12-15 18:59:16','2025-12-15 18:59:16'),(51,'Mateo Gómez (Conductor)','CC','1852896700','3694860784',NULL,'2025-12-15 18:59:16','2025-12-15 18:59:16'),(52,'María Hernández (Conductor)','CC','1805555461','3709241581',NULL,'2025-12-15 18:59:16','2025-12-15 18:59:16'),(53,'Daniela Hernández (Conductor)','CE','E172190','3874815640',NULL,'2025-12-15 18:59:16','2025-12-15 18:59:16'),(54,'Ana Rodríguez (Conductor)','CC','1052266774','3917965993',NULL,'2025-12-15 18:59:16','2025-12-15 18:59:16'),(55,'FABIO SÁNCHEZ','CC','93397652','3004938880',NULL,'2025-12-17 14:09:36','2025-12-17 14:09:36'),(56,'VICTOR MANUEL NARVAES GOMEZ','CC','93363185','3114787798',NULL,'2025-12-17 14:09:36','2025-12-17 14:09:36'),(57,'JACQUELINE SARMIENTO','CC','28559448','3108770598',NULL,'2025-12-17 14:09:36','2025-12-17 14:09:36'),(58,'JESÚS ANTONIO SAENZ','CC','93117443','3178252882',NULL,'2025-12-17 14:09:36','2025-12-17 14:09:36'),(59,'CAMPO ELIAS ROMERO VARGAS','CC','93365354','3133706868',NULL,'2025-12-17 14:09:36','2025-12-17 14:09:36'),(60,'ALVARO DOMINGUES','CC','14296614','3123097365',NULL,'2025-12-17 14:09:36','2025-12-17 14:09:36'),(61,'DIEGOP ALEJANDRO','CC','1001277604','3224515459',NULL,'2025-12-17 14:09:36','2025-12-17 14:09:36'),(62,'ALEJANDRO BERMUDEZ','CC','1104939675','3228276699',NULL,'2025-12-17 14:09:36','2025-12-17 14:09:36'),(63,'JUAN PABLO GIRALDO','CC','93391150','3158517360',NULL,'2025-12-17 14:09:36','2025-12-17 14:09:36'),(64,'DIEGO VALLEJO','CC','14295135','3125900942',NULL,'2025-12-17 14:09:36','2025-12-17 14:09:36'),(65,'JORGE LUIS LEYTON','CC','1110524866','3144036944',NULL,'2025-12-17 14:09:36','2025-12-17 14:09:36'),(66,'ALVARO BERNAL','CC','93379794','3214520327',NULL,'2025-12-17 14:09:36','2025-12-17 14:09:36'),(67,'LOREN JULIETH DÍAZ CAMPOS','CC','1075280424','3144785825',NULL,'2025-12-17 14:09:36','2025-12-17 14:09:36'),(68,'JAIME VALENCIA','CC','1116865389','3126528046',NULL,'2025-12-17 14:09:36','2025-12-17 14:09:36'),(69,'JOSÉ ESPINOZA','CC','14237780','3202129330',NULL,'2025-12-17 14:09:36','2025-12-17 14:09:36'),(70,'Deiby','CC','1022953641','3202329331',NULL,'2025-12-17 14:09:36','2025-12-17 14:09:36');
/*!40000 ALTER TABLE `conductores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contrato_cambios`
--

DROP TABLE IF EXISTS `contrato_cambios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contrato_cambios` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `contrato_id` int unsigned NOT NULL,
  `usuario_id` int unsigned DEFAULT NULL,
  `campo` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `old_value` text COLLATE utf8mb4_unicode_ci,
  `new_value` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `contrato_cambios_contrato_id_foreign` (`contrato_id`),
  KEY `contrato_cambios_usuario_id_foreign` (`usuario_id`),
  CONSTRAINT `contrato_cambios_contrato_id_foreign` FOREIGN KEY (`contrato_id`) REFERENCES `contratos` (`id`) ON DELETE CASCADE,
  CONSTRAINT `contrato_cambios_usuario_id_foreign` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=116 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contrato_cambios`
--

LOCK TABLES `contrato_cambios` WRITE;
/*!40000 ALTER TABLE `contrato_cambios` DISABLE KEYS */;
INSERT INTO `contrato_cambios` VALUES (1,4,20,'creacion','null','{\"estado\":\"activo\",\"by\":8}','2025-12-15 20:25:55','2025-12-15 20:25:55'),(2,5,1,'creacion','null','{\"estado\":\"activo\",\"by\":3}','2025-12-15 20:42:40','2025-12-15 20:42:40'),(3,5,1,'contrato_fisico_archivo','null','{\"nombre\":\"bt6ynnhkyl3y2jf29y0a86d4.pdf\",\"url\":\"/uploads/contratos/bt6ynnhkyl3y2jf29y0a86d4.pdf\",\"by\":3}','2025-12-15 20:42:40','2025-12-15 20:42:40'),(4,5,1,'arl_afiliacion_archivo','null','{\"nombre\":\"rcq9h91ylj23tuofgt9chqa1_CC1110563140_20251124165214.pdf\",\"url\":\"/uploads/contratos/afiliaciones/arl/5/rcq9h91ylj23tuofgt9chqa1_CC1110563140_20251124165214.pdf\",\"by\":3}','2025-12-15 20:42:41','2025-12-15 20:42:41'),(5,5,1,'ccf_afiliacion_archivo','null','{\"nombre\":\"ubygr1remw8wznbbjcpt3axv_CC1110563140_20251124165214.pdf\",\"url\":\"/uploads/contratos/afiliaciones/ccf/5/ubygr1remw8wznbbjcpt3axv_CC1110563140_20251124165214.pdf\",\"by\":3}','2025-12-15 20:42:41','2025-12-15 20:42:41'),(6,5,1,'eps_afiliacion_archivo','null','{\"nombre\":\"d72nkjoj2oiitlbc5esbjpla_CC1110563140_20251124165214.pdf\",\"url\":\"/uploads/contratos/afiliaciones/eps/5/d72nkjoj2oiitlbc5esbjpla_CC1110563140_20251124165214.pdf\",\"by\":3}','2025-12-15 20:42:41','2025-12-15 20:42:41'),(7,5,1,'afc_afiliacion_archivo','null','{\"nombre\":\"bwrdf6fq61oyx2vha842m6hf_CC1110563140_20251124165214.pdf\",\"url\":\"/uploads/contratos/afiliaciones/afc/5/bwrdf6fq61oyx2vha842m6hf_CC1110563140_20251124165214.pdf\",\"by\":3}','2025-12-15 20:42:41','2025-12-15 20:42:41'),(8,5,1,'afp_afiliacion_archivo','null','{\"nombre\":\"zjk5fn6uu6wkk5wzj91jg883_CC1110563140_20251124165214.pdf\",\"url\":\"/uploads/contratos/afiliaciones/afp/5/zjk5fn6uu6wkk5wzj91jg883_CC1110563140_20251124165214.pdf\",\"by\":3}','2025-12-15 20:42:41','2025-12-15 20:42:41'),(9,4,20,'salarioBasico','\"1500000.00\"','1500000','2025-12-15 20:44:13','2025-12-15 20:44:13'),(10,4,20,'bonoSalarial','\"0.00\"','0','2025-12-15 20:44:13','2025-12-15 20:44:13'),(11,4,20,'auxilioTransporte','\"200000.00\"','200000','2025-12-15 20:44:13','2025-12-15 20:44:13'),(12,4,20,'auxilioNoSalarial','\"0.00\"','0','2025-12-15 20:44:13','2025-12-15 20:44:13'),(13,4,20,'afc_afiliacion_archivo','null','{\"nombre\":\"iubypt5xm5x7tsx04r7selve_vistas_wo.pdf\",\"url\":\"/uploads/contratos/afiliaciones/afc/4/iubypt5xm5x7tsx04r7selve_vistas_wo.pdf\",\"by\":8}','2025-12-15 20:45:42','2025-12-15 20:45:42'),(14,4,20,'salarioBasico','\"1500000.00\"','1500000','2025-12-15 20:45:46','2025-12-15 20:45:46'),(15,4,20,'bonoSalarial','\"0.00\"','0','2025-12-15 20:45:46','2025-12-15 20:45:46'),(16,4,20,'auxilioTransporte','\"200000.00\"','200000','2025-12-15 20:45:46','2025-12-15 20:45:46'),(17,4,20,'auxilioNoSalarial','\"0.00\"','0','2025-12-15 20:45:46','2025-12-15 20:45:46'),(18,6,20,'creacion','null','{\"estado\":\"activo\",\"by\":8}','2025-12-15 20:48:46','2025-12-15 20:48:46'),(19,7,21,'creacion','null','{\"estado\":\"activo\",\"by\":1}','2025-12-15 20:55:41','2025-12-15 20:55:41'),(20,8,5,'creacion','null','{\"estado\":\"activo\",\"by\":3}','2025-12-15 21:01:26','2025-12-15 21:01:26'),(21,8,5,'contrato_fisico_archivo','null','{\"nombre\":\"ymjd45s0a4zzymiymcjvn7vb.pdf\",\"url\":\"/uploads/contratos/ymjd45s0a4zzymiymcjvn7vb.pdf\",\"by\":3}','2025-12-15 21:01:27','2025-12-15 21:01:27'),(22,8,5,'eps_afiliacion_archivo','null','{\"nombre\":\"tu581azhegg4ib819bs0vtym_CC1110563140_20251124165214.pdf\",\"url\":\"/uploads/contratos/afiliaciones/eps/8/tu581azhegg4ib819bs0vtym_CC1110563140_20251124165214.pdf\",\"by\":3}','2025-12-15 21:01:27','2025-12-15 21:01:27'),(23,8,5,'arl_afiliacion_archivo','null','{\"nombre\":\"uv0khmow1decxi98vozzv6kt_CC1110563140_20251124165214.pdf\",\"url\":\"/uploads/contratos/afiliaciones/arl/8/uv0khmow1decxi98vozzv6kt_CC1110563140_20251124165214.pdf\",\"by\":3}','2025-12-15 21:01:27','2025-12-15 21:01:27'),(24,8,5,'afc_afiliacion_archivo','null','{\"nombre\":\"hvoo5vs3yjqxfdzc8u6ymdaw_CC1110563140_20251124165214.pdf\",\"url\":\"/uploads/contratos/afiliaciones/afc/8/hvoo5vs3yjqxfdzc8u6ymdaw_CC1110563140_20251124165214.pdf\",\"by\":3}','2025-12-15 21:01:27','2025-12-15 21:01:27'),(25,8,5,'afp_afiliacion_archivo','null','{\"nombre\":\"in6p1wf35fawrpw328uhr59d_CC1110563140_20251124165214.pdf\",\"url\":\"/uploads/contratos/afiliaciones/afp/8/in6p1wf35fawrpw328uhr59d_CC1110563140_20251124165214.pdf\",\"by\":3}','2025-12-15 21:01:27','2025-12-15 21:01:27'),(26,8,5,'ccf_afiliacion_archivo','null','{\"nombre\":\"dnf0bs0tbfsmhhko6j2cvl6x_CC1110563140_20251124165214.pdf\",\"url\":\"/uploads/contratos/afiliaciones/ccf/8/dnf0bs0tbfsmhhko6j2cvl6x_CC1110563140_20251124165214.pdf\",\"by\":3}','2025-12-15 21:01:27','2025-12-15 21:01:27'),(27,9,21,'creacion','null','{\"estado\":\"activo\",\"by\":3}','2025-12-15 21:04:17','2025-12-15 21:04:17'),(28,10,20,'creacion','null','{\"estado\":\"activo\",\"by\":3}','2025-12-15 21:20:48','2025-12-15 21:20:48'),(29,10,20,'estado','\"activo\"','\"inactivo\"','2025-12-15 21:21:04','2025-12-15 21:21:04'),(30,10,20,'estado','\"inactivo\"','\"activo\"','2025-12-15 21:21:09','2025-12-15 21:21:09'),(31,11,21,'creacion','null','{\"estado\":\"activo\",\"by\":3}','2025-12-15 21:44:21','2025-12-15 21:44:21'),(32,12,1,'creacion','null','{\"estado\":\"activo\",\"by\":3}','2025-12-16 14:10:13','2025-12-16 14:10:13'),(33,12,1,'contrato_fisico_archivo','null','{\"nombre\":\"cbhc6l0rq9glhamywdb14fs3.pdf\",\"url\":\"/uploads/contratos/cbhc6l0rq9glhamywdb14fs3.pdf\",\"by\":3}','2025-12-16 14:10:15','2025-12-16 14:10:15'),(34,13,22,'creacion','null','{\"estado\":\"activo\",\"by\":8}','2025-12-16 14:17:22','2025-12-16 14:17:22'),(35,14,22,'creacion','null','{\"estado\":\"activo\",\"by\":8}','2025-12-16 14:27:52','2025-12-16 14:27:52'),(36,15,3,'creacion','null','{\"estado\":\"activo\",\"by\":8}','2025-12-16 14:29:27','2025-12-16 14:29:27'),(37,16,22,'creacion','null','{\"estado\":\"activo\",\"by\":3}','2025-12-16 14:29:27','2025-12-16 14:29:27'),(38,16,22,'contrato_fisico_archivo','null','{\"nombre\":\"yr5ygnm4y3jjnhwgdfnefbk1.pdf\",\"url\":\"/uploads/contratos/yr5ygnm4y3jjnhwgdfnefbk1.pdf\",\"by\":3}','2025-12-16 14:29:28','2025-12-16 14:29:28'),(39,15,3,'contrato_fisico_archivo','null','{\"nombre\":\"b6oerl2eore4zb62g4g379u7.pdf\",\"url\":\"/uploads/contratos/b6oerl2eore4zb62g4g379u7.pdf\",\"by\":8}','2025-12-16 14:29:29','2025-12-16 14:29:29'),(40,17,22,'creacion','null','{\"estado\":\"activo\",\"by\":8}','2025-12-16 14:31:23','2025-12-16 14:31:23'),(41,17,22,'contrato_fisico_archivo','null','{\"nombre\":\"onumxaqkk04oj0aqmo2lch54.pdf\",\"url\":\"/uploads/contratos/onumxaqkk04oj0aqmo2lch54.pdf\",\"by\":8}','2025-12-16 14:32:26','2025-12-16 14:32:26'),(42,17,22,'recomendacion_medica_archivo','null','{\"nombre\":\"c82ki0v456ip5yng94703v4c.pdf\",\"url\":\"/uploads/recomendaciones_medicas/c82ki0v456ip5yng94703v4c.pdf\",\"by\":8}','2025-12-16 14:32:26','2025-12-16 14:32:26'),(43,18,3,'creacion','null','{\"estado\":\"activo\",\"by\":8}','2025-12-16 14:33:31','2025-12-16 14:33:31'),(44,19,3,'creacion','null','{\"estado\":\"activo\",\"by\":8}','2025-12-16 14:33:42','2025-12-16 14:33:42'),(45,20,4,'creacion','null','{\"estado\":\"activo\",\"by\":8}','2025-12-16 14:35:35','2025-12-16 14:35:35'),(46,20,4,'contrato_fisico_archivo','null','{\"nombre\":\"le8zye4lir2emba091jqma5b.pdf\",\"url\":\"/uploads/contratos/le8zye4lir2emba091jqma5b.pdf\",\"by\":8}','2025-12-16 14:35:37','2025-12-16 14:35:37'),(47,21,5,'creacion','null','{\"estado\":\"activo\",\"by\":8}','2025-12-16 14:37:01','2025-12-16 14:37:01'),(48,22,7,'creacion','null','{\"estado\":\"activo\",\"by\":8}','2025-12-16 14:41:04','2025-12-16 14:41:04'),(49,22,7,'contrato_fisico_archivo','null','{\"nombre\":\"i13auuux5i3lahrftgcg0uek.pdf\",\"url\":\"/uploads/contratos/i13auuux5i3lahrftgcg0uek.pdf\",\"by\":8}','2025-12-16 14:41:05','2025-12-16 14:41:05'),(50,22,7,'recomendacion_medica_archivo','null','{\"nombre\":\"dil3479kpkvz37i8vxm31wfi.pdf\",\"url\":\"/uploads/recomendaciones_medicas/dil3479kpkvz37i8vxm31wfi.pdf\",\"by\":8}','2025-12-16 14:41:05','2025-12-16 14:41:05'),(51,22,7,'eps_afiliacion_archivo','null','{\"nombre\":\"jot4pk6r2u3m05ethh2kfc8v_constancia_NotasAprendiz.pdf\",\"url\":\"/uploads/contratos/afiliaciones/eps/22/jot4pk6r2u3m05ethh2kfc8v_constancia_NotasAprendiz.pdf\",\"by\":8}','2025-12-16 14:41:05','2025-12-16 14:41:05'),(52,22,7,'afp_afiliacion_archivo','null','{\"nombre\":\"xl58yqnxd8kd6lricys97pib_constancia_NotasAprendiz.pdf\",\"url\":\"/uploads/contratos/afiliaciones/afp/22/xl58yqnxd8kd6lricys97pib_constancia_NotasAprendiz.pdf\",\"by\":8}','2025-12-16 14:41:05','2025-12-16 14:41:05'),(53,22,7,'ccf_afiliacion_archivo','null','{\"nombre\":\"k8x31irhh52iqmpjcid09rz3_constancia_NotasAprendiz.pdf\",\"url\":\"/uploads/contratos/afiliaciones/ccf/22/k8x31irhh52iqmpjcid09rz3_constancia_NotasAprendiz.pdf\",\"by\":8}','2025-12-16 14:41:05','2025-12-16 14:41:05'),(54,22,7,'arl_afiliacion_archivo','null','{\"nombre\":\"n6l5vwyizou6y8zuejcgwkt8_e084701.pdf\",\"url\":\"/uploads/contratos/afiliaciones/arl/22/n6l5vwyizou6y8zuejcgwkt8_e084701.pdf\",\"by\":8}','2025-12-16 14:41:06','2025-12-16 14:41:06'),(55,22,7,'afc_afiliacion_archivo','null','{\"nombre\":\"q7k4p5wghzd5hvld1x4ar452_CDA ACTIVA LOGO new .pdf\",\"url\":\"/uploads/contratos/afiliaciones/afc/22/q7k4p5wghzd5hvld1x4ar452_CDA ACTIVA LOGO new .pdf\",\"by\":8}','2025-12-16 14:41:06','2025-12-16 14:41:06'),(56,23,23,'creacion','null','{\"estado\":\"activo\",\"by\":1}','2025-12-16 14:50:37','2025-12-16 14:50:37'),(57,23,23,'contrato_fisico_archivo','null','{\"nombre\":\"kgkj2gjl2kkxwdzm2v71brl4.pdf\",\"url\":\"/uploads/contratos/kgkj2gjl2kkxwdzm2v71brl4.pdf\",\"by\":1}','2025-12-16 14:50:38','2025-12-16 14:50:38'),(58,23,23,'recomendacion_medica_archivo','null','{\"nombre\":\"o1kkf1r958qsmquo92h97bj8.pdf\",\"url\":\"/uploads/recomendaciones_medicas/o1kkf1r958qsmquo92h97bj8.pdf\",\"by\":1}','2025-12-16 14:50:38','2025-12-16 14:50:38'),(59,23,23,'eps_afiliacion_archivo','null','{\"nombre\":\"xas89s9xwz87hibz9tm0hodz_constancia_NotasAprendiz.pdf\",\"url\":\"/uploads/contratos/afiliaciones/eps/23/xas89s9xwz87hibz9tm0hodz_constancia_NotasAprendiz.pdf\",\"by\":1}','2025-12-16 14:50:39','2025-12-16 14:50:39'),(60,23,23,'arl_afiliacion_archivo','null','{\"nombre\":\"uamxo6qic8cne8m9wnq5pahu_constancia_NotasAprendiz.pdf\",\"url\":\"/uploads/contratos/afiliaciones/arl/23/uamxo6qic8cne8m9wnq5pahu_constancia_NotasAprendiz.pdf\",\"by\":1}','2025-12-16 14:50:39','2025-12-16 14:50:39'),(61,23,23,'afp_afiliacion_archivo','null','{\"nombre\":\"g0yvfim7a0sel4v5d8nvzm0n_constancia_TituladaPresencial.pdf\",\"url\":\"/uploads/contratos/afiliaciones/afp/23/g0yvfim7a0sel4v5d8nvzm0n_constancia_TituladaPresencial.pdf\",\"by\":1}','2025-12-16 14:50:39','2025-12-16 14:50:39'),(62,23,23,'ccf_afiliacion_archivo','null','{\"nombre\":\"hlmj1n97feinjv3tq56oeea5_BOLIVAR_ARL_certificado.pdf\",\"url\":\"/uploads/contratos/afiliaciones/ccf/23/hlmj1n97feinjv3tq56oeea5_BOLIVAR_ARL_certificado.pdf\",\"by\":1}','2025-12-16 14:50:39','2025-12-16 14:50:39'),(63,23,23,'afc_afiliacion_archivo','null','{\"nombre\":\"av74zvyfwuqigrrnukquxllp_F-1539 Conocimiento del cliente persona natural.pdf\",\"url\":\"/uploads/contratos/afiliaciones/afc/23/av74zvyfwuqigrrnukquxllp_F-1539 Conocimiento del cliente persona natural.pdf\",\"by\":1}','2025-12-16 14:50:39','2025-12-16 14:50:39'),(64,9,21,'salarioBasico','\"1500000.00\"','1500000','2025-12-16 14:52:04','2025-12-16 14:52:04'),(65,9,21,'bonoSalarial','\"0.00\"','0','2025-12-16 14:52:04','2025-12-16 14:52:04'),(66,9,21,'auxilioTransporte','\"0.00\"','0','2025-12-16 14:52:04','2025-12-16 14:52:04'),(67,9,21,'auxilioNoSalarial','\"0.00\"','0','2025-12-16 14:52:04','2025-12-16 14:52:04'),(68,9,21,'contrato_fisico_archivo','null','{\"nombre\":\"rl5xx9kj82ia90fejwra51wb.pdf\",\"url\":\"/uploads/contratos/rl5xx9kj82ia90fejwra51wb.pdf\",\"by\":23}','2025-12-16 14:52:05','2025-12-16 14:52:05'),(69,10,20,'salarioBasico','\"1500000.00\"','1500000','2025-12-16 14:53:05','2025-12-16 14:53:05'),(70,10,20,'bonoSalarial','\"20000.00\"','20000','2025-12-16 14:53:05','2025-12-16 14:53:05'),(71,10,20,'auxilioTransporte','\"0.00\"','0','2025-12-16 14:53:05','2025-12-16 14:53:05'),(72,10,20,'auxilioNoSalarial','\"0.00\"','0','2025-12-16 14:53:05','2025-12-16 14:53:05'),(73,10,20,'contrato_fisico_archivo','null','{\"nombre\":\"rxwarm8cs016nz3qtwwxfmn4.pdf\",\"url\":\"/uploads/contratos/rxwarm8cs016nz3qtwwxfmn4.pdf\",\"by\":23}','2025-12-16 14:53:05','2025-12-16 14:53:05'),(74,7,21,'eps_afiliacion_archivo','null','{\"nombre\":\"x3s03e9qymjd8v9fpvrog3kx_constancia_TituladaPresencial.pdf\",\"url\":\"/uploads/contratos/afiliaciones/eps/7/x3s03e9qymjd8v9fpvrog3kx_constancia_TituladaPresencial.pdf\",\"by\":23}','2025-12-16 14:54:00','2025-12-16 14:54:00'),(75,5,1,'estado','\"activo\"','\"inactivo\"','2025-12-16 17:11:23','2025-12-16 17:11:23'),(76,5,1,'estado','\"inactivo\"','\"activo\"','2025-12-16 17:11:46','2025-12-16 17:11:46'),(77,12,1,'recomendacion_medica_archivo','null','{\"nombre\":\"db02156o5jnd05d52a45biz2.jpg\",\"url\":\"/uploads/recomendaciones_medicas/db02156o5jnd05d52a45biz2.jpg\",\"by\":23}','2025-12-16 17:12:57','2025-12-16 17:12:57'),(78,24,24,'creacion','null','{\"estado\":\"activo\",\"by\":23}','2025-12-16 17:15:55','2025-12-16 17:15:55'),(79,24,24,'contrato_fisico_archivo','null','{\"nombre\":\"kuqi3brr1x3pt17uqrikersb.pdf\",\"url\":\"/uploads/contratos/kuqi3brr1x3pt17uqrikersb.pdf\",\"by\":23}','2025-12-16 17:17:09','2025-12-16 17:17:09'),(80,24,24,'salarioBasico','\"0.00\"','0','2025-12-16 17:17:27','2025-12-16 17:17:27'),(81,24,24,'bonoSalarial','\"0.00\"','0','2025-12-16 17:17:27','2025-12-16 17:17:27'),(82,24,24,'auxilioTransporte','\"0.00\"','0','2025-12-16 17:17:27','2025-12-16 17:17:27'),(83,24,24,'auxilioNoSalarial','\"0.00\"','0','2025-12-16 17:17:27','2025-12-16 17:17:27'),(84,24,24,'salarioBasico','\"0.00\"','0','2025-12-16 17:21:55','2025-12-16 17:21:55'),(85,24,24,'bonoSalarial','\"0.00\"','0','2025-12-16 17:21:55','2025-12-16 17:21:55'),(86,24,24,'auxilioTransporte','\"0.00\"','0','2025-12-16 17:21:55','2025-12-16 17:21:55'),(87,24,24,'auxilioNoSalarial','\"0.00\"','0','2025-12-16 17:21:55','2025-12-16 17:21:55'),(88,24,24,'salarioBasico','\"0.00\"','0','2025-12-16 17:22:26','2025-12-16 17:22:26'),(89,24,24,'bonoSalarial','\"0.00\"','0','2025-12-16 17:22:26','2025-12-16 17:22:26'),(90,24,24,'auxilioTransporte','\"0.00\"','0','2025-12-16 17:22:26','2025-12-16 17:22:26'),(91,24,24,'auxilioNoSalarial','\"0.00\"','0','2025-12-16 17:22:26','2025-12-16 17:22:26'),(92,24,24,'salarioBasico','\"0.00\"','0','2025-12-16 17:23:01','2025-12-16 17:23:01'),(93,24,24,'bonoSalarial','\"0.00\"','0','2025-12-16 17:23:01','2025-12-16 17:23:01'),(94,24,24,'auxilioTransporte','\"0.00\"','0','2025-12-16 17:23:01','2025-12-16 17:23:01'),(95,24,24,'auxilioNoSalarial','\"0.00\"','0','2025-12-16 17:23:01','2025-12-16 17:23:01'),(96,24,24,'contrato_fisico_archivo','{\"nombre\":\"kuqi3brr1x3pt17uqrikersb.pdf\",\"url\":\"/uploads/contratos/kuqi3brr1x3pt17uqrikersb.pdf\"}','{\"nombre\":\"awspuwiycbguacwae0w4t3uf.pdf\",\"url\":\"/uploads/contratos/awspuwiycbguacwae0w4t3uf.pdf\",\"by\":23}','2025-12-16 17:23:01','2025-12-16 17:23:01'),(97,25,3,'creacion','null','{\"estado\":\"activo\",\"by\":3}','2025-12-16 17:25:20','2025-12-16 17:25:20'),(98,26,3,'creacion','null','{\"estado\":\"activo\",\"by\":3}','2025-12-16 17:27:02','2025-12-16 17:27:02'),(99,27,25,'creacion','null','{\"estado\":\"activo\",\"by\":8}','2025-12-16 20:46:59','2025-12-16 20:46:59'),(100,27,25,'contrato_fisico_archivo','null','{\"nombre\":\"sad7dysehrj5o1szo6xds11i.pdf\",\"url\":\"/uploads/contratos/sad7dysehrj5o1szo6xds11i.pdf\",\"by\":8}','2025-12-16 20:51:34','2025-12-16 20:51:34'),(101,27,25,'recomendacion_medica_archivo','null','{\"nombre\":\"ppeyr2qsb6aqz8s5p4a8gjsa.pdf\",\"url\":\"/uploads/recomendaciones_medicas/ppeyr2qsb6aqz8s5p4a8gjsa.pdf\",\"by\":8}','2025-12-16 20:51:34','2025-12-16 20:51:34'),(102,9,21,'estado','\"activo\"','\"inactivo\"','2025-12-16 20:56:04','2025-12-16 20:56:04'),(103,28,26,'creacion','null','{\"estado\":\"activo\",\"by\":23}','2025-12-16 21:18:26','2025-12-16 21:18:26'),(104,28,26,'contrato_fisico_archivo','null','{\"nombre\":\"wbkl3paw8zwwohhe0p191mwj.pdf\",\"url\":\"/uploads/contratos/wbkl3paw8zwwohhe0p191mwj.pdf\",\"by\":23}','2025-12-16 21:19:36','2025-12-16 21:19:36'),(105,28,26,'recomendacion_medica_archivo','null','{\"nombre\":\"anqix2rociz8sweo1yh8c0ja.pdf\",\"url\":\"/uploads/recomendaciones_medicas/anqix2rociz8sweo1yh8c0ja.pdf\",\"by\":23}','2025-12-16 21:19:36','2025-12-16 21:19:36'),(106,29,27,'creacion','null','{\"estado\":\"activo\",\"by\":23}','2025-12-16 21:50:20','2025-12-16 21:50:20'),(107,29,27,'contrato_fisico_archivo','null','{\"nombre\":\"a035ductnq4nhf6mc0s2ehpl.pdf\",\"url\":\"/uploads/contratos/a035ductnq4nhf6mc0s2ehpl.pdf\",\"by\":23}','2025-12-16 21:50:21','2025-12-16 21:50:21'),(108,30,1,'creacion','null','{\"estado\":\"activo\",\"by\":3}','2025-12-17 13:57:51','2025-12-17 13:57:51'),(109,31,1,'creacion','null','{\"estado\":\"activo\",\"by\":3}','2025-12-17 13:58:26','2025-12-17 13:58:26'),(110,31,1,'contrato_fisico_archivo','null','{\"nombre\":\"jfjr7mr81lbsjjm9ci8v0fa8.pdf\",\"url\":\"/uploads/contratos/jfjr7mr81lbsjjm9ci8v0fa8.pdf\",\"by\":3}','2025-12-17 14:12:22','2025-12-17 14:12:22'),(111,31,1,'recomendacion_medica_archivo','null','{\"nombre\":\"c0grmaeg5srvlcc882d7veg8.pdf\",\"url\":\"/uploads/recomendaciones_medicas/c0grmaeg5srvlcc882d7veg8.pdf\",\"by\":3}','2025-12-17 14:12:22','2025-12-17 14:12:22'),(112,32,18,'creacion','null','{\"estado\":\"activo\",\"by\":3}','2025-12-17 14:13:07','2025-12-17 14:13:07'),(113,32,18,'contrato_fisico_archivo','null','{\"nombre\":\"ikkh6bxdoggg5nnepvt4fmr7.pdf\",\"url\":\"/uploads/contratos/ikkh6bxdoggg5nnepvt4fmr7.pdf\",\"by\":3}','2025-12-17 14:13:08','2025-12-17 14:13:08'),(114,33,6,'creacion','null','{\"estado\":\"activo\",\"by\":23}','2025-12-17 14:16:40','2025-12-17 14:16:40'),(115,33,6,'contrato_fisico_archivo','null','{\"nombre\":\"yc2gzx02qk7cxlrw4fajasxn.pdf\",\"url\":\"/uploads/contratos/yc2gzx02qk7cxlrw4fajasxn.pdf\",\"by\":23}','2025-12-17 14:16:44','2025-12-17 14:16:44');
/*!40000 ALTER TABLE `contrato_cambios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contrato_eventos`
--

DROP TABLE IF EXISTS `contrato_eventos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contrato_eventos` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `contrato_id` int unsigned NOT NULL,
  `tipo` enum('incapacidad','suspension','licencia','permiso','vacaciones','cesantias','disciplinario','terminacion') COLLATE utf8mb4_unicode_ci NOT NULL,
  `subtipo` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fecha_inicio` date NOT NULL,
  `fecha_fin` date DEFAULT NULL,
  `descripcion` text COLLATE utf8mb4_unicode_ci,
  `documento_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `usuario_id` int unsigned DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `contrato_eventos_contrato_id_index` (`contrato_id`),
  KEY `contrato_eventos_usuario_id_index` (`usuario_id`),
  KEY `contrato_eventos_tipo_index` (`tipo`),
  KEY `contrato_eventos_fecha_inicio_index` (`fecha_inicio`),
  CONSTRAINT `contrato_eventos_contrato_id_foreign` FOREIGN KEY (`contrato_id`) REFERENCES `contratos` (`id`) ON DELETE CASCADE,
  CONSTRAINT `contrato_eventos_usuario_id_foreign` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contrato_eventos`
--

LOCK TABLES `contrato_eventos` WRITE;
/*!40000 ALTER TABLE `contrato_eventos` DISABLE KEYS */;
INSERT INTO `contrato_eventos` VALUES (1,11,'suspension','nada','2025-12-10','2025-12-17','nada','/uploads/contratos/11/eventos/tikbof7j2rytsqidibyz54a4.png',23,'2025-12-16 15:04:03','2025-12-16 15:04:03'),(2,11,'licencia','COMERCIAL','2025-12-09','2025-12-16','gsx e',NULL,23,'2025-12-16 15:04:38','2025-12-16 15:04:38'),(3,11,'suspension','error','2025-12-19',NULL,'descarga','/uploads/contratos/11/eventos/y1psl8bxuxocqa7bf9eto8no.png',23,'2025-12-16 15:06:42','2025-12-16 15:06:42'),(4,16,'incapacidad','error','2025-12-18',NULL,'descarga','/uploads/contratos/16/eventos/suz83yl0pfu0fhvuh2kk970n.pdf',8,'2025-12-16 15:10:19','2025-12-16 15:10:19'),(5,16,'incapacidad','error','2025-12-04',NULL,NULL,'/uploads/contratos/16/eventos/vv7kpypc6io1f7g6vvilpvrw.png',8,'2025-12-16 15:10:48','2025-12-16 15:10:48'),(6,16,'suspension','Andrés Pérezs','2025-12-11',NULL,'dasd','/uploads/contratos/16/eventos/ts87nl8zs3sq54yhsbpqcgjp.jpg',8,'2025-12-16 15:11:54','2025-12-16 15:11:54'),(7,9,'suspension','error','2025-12-18',NULL,'descarga','/uploads/contratos/9/eventos/b8iea4d192lq1qwd1dy1om51.jpg',8,'2025-12-16 15:13:24','2025-12-16 15:13:24'),(8,5,'suspension','asdasd','2025-12-25',NULL,'dasdsad','/uploads/contratos/5/eventos/kcwma1kfddm8kbk1kl7ypqqw.jpg',23,'2025-12-16 17:11:10','2025-12-16 17:11:10');
/*!40000 ALTER TABLE `contrato_eventos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contrato_historial_estados`
--

DROP TABLE IF EXISTS `contrato_historial_estados`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contrato_historial_estados` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `contrato_id` int unsigned NOT NULL,
  `usuario_id` int unsigned DEFAULT NULL,
  `old_estado` enum('activo','inactivo') COLLATE utf8mb4_unicode_ci NOT NULL,
  `new_estado` enum('activo','inactivo') COLLATE utf8mb4_unicode_ci NOT NULL,
  `fecha_cambio` timestamp NOT NULL,
  `fecha_inicio_contrato` date NOT NULL,
  `motivo` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `contrato_historial_estados_contrato_id_foreign` (`contrato_id`),
  KEY `contrato_historial_estados_usuario_id_foreign` (`usuario_id`),
  CONSTRAINT `contrato_historial_estados_contrato_id_foreign` FOREIGN KEY (`contrato_id`) REFERENCES `contratos` (`id`) ON DELETE CASCADE,
  CONSTRAINT `contrato_historial_estados_usuario_id_foreign` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contrato_historial_estados`
--

LOCK TABLES `contrato_historial_estados` WRITE;
/*!40000 ALTER TABLE `contrato_historial_estados` DISABLE KEYS */;
INSERT INTO `contrato_historial_estados` VALUES (1,4,8,'inactivo','activo','2025-12-15 20:25:55','2025-12-11','Creación de contrato','2025-12-15 20:25:55','2025-12-15 20:25:55'),(2,5,3,'inactivo','activo','2025-12-15 20:42:40','2025-12-16','Creación de contrato','2025-12-15 20:42:40','2025-12-15 20:42:40'),(3,6,8,'inactivo','activo','2025-12-15 20:48:46','2025-12-16','Creación de contrato','2025-12-15 20:48:46','2025-12-15 20:48:46'),(4,7,1,'inactivo','activo','2025-12-15 20:55:41','2025-12-15','Creación de contrato','2025-12-15 20:55:41','2025-12-15 20:55:41'),(5,8,3,'inactivo','activo','2025-12-15 21:01:26','2025-12-15','Creación de contrato','2025-12-15 21:01:26','2025-12-15 21:01:26'),(6,9,3,'inactivo','activo','2025-12-15 21:04:17','2025-12-09','Creación de contrato','2025-12-15 21:04:17','2025-12-15 21:04:17'),(7,10,3,'inactivo','activo','2025-12-15 21:20:48','2025-12-09','Creación de contrato','2025-12-15 21:20:48','2025-12-15 21:20:48'),(8,10,3,'activo','inactivo','2025-12-15 21:21:04','2025-12-09',NULL,'2025-12-15 21:21:04','2025-12-15 21:21:04'),(9,10,3,'inactivo','activo','2025-12-15 21:21:09','2025-12-09',NULL,'2025-12-15 21:21:09','2025-12-15 21:21:09'),(10,11,3,'inactivo','activo','2025-12-15 21:44:21','2025-12-09','Creación de contrato','2025-12-15 21:44:21','2025-12-15 21:44:21'),(11,12,3,'inactivo','activo','2025-12-16 14:10:13','2025-12-16','Creación de contrato','2025-12-16 14:10:13','2025-12-16 14:10:13'),(12,13,8,'inactivo','activo','2025-12-16 14:17:22','2025-12-24','Creación de contrato','2025-12-16 14:17:22','2025-12-16 14:17:22'),(13,14,8,'inactivo','activo','2025-12-16 14:27:52','2025-12-05','Creación de contrato','2025-12-16 14:27:52','2025-12-16 14:27:52'),(14,15,8,'inactivo','activo','2025-12-16 14:29:27','2025-12-16','Creación de contrato','2025-12-16 14:29:27','2025-12-16 14:29:27'),(15,16,3,'inactivo','activo','2025-12-16 14:29:27','2025-12-03','Creación de contrato','2025-12-16 14:29:27','2025-12-16 14:29:27'),(16,17,8,'inactivo','activo','2025-12-16 14:31:23','2025-12-17','Creación de contrato','2025-12-16 14:31:23','2025-12-16 14:31:23'),(17,18,8,'inactivo','activo','2025-12-16 14:33:31','2025-12-09','Creación de contrato','2025-12-16 14:33:31','2025-12-16 14:33:31'),(18,19,8,'inactivo','activo','2025-12-16 14:33:42','2025-12-16','Creación de contrato','2025-12-16 14:33:42','2025-12-16 14:33:42'),(19,20,8,'inactivo','activo','2025-12-16 14:35:35','2025-12-17','Creación de contrato','2025-12-16 14:35:35','2025-12-16 14:35:35'),(20,21,8,'inactivo','activo','2025-12-16 14:37:01','2025-12-16','Creación de contrato','2025-12-16 14:37:01','2025-12-16 14:37:01'),(21,22,8,'inactivo','activo','2025-12-16 14:41:04','2025-12-16','Creación de contrato','2025-12-16 14:41:04','2025-12-16 14:41:04'),(22,23,1,'inactivo','activo','2025-12-16 14:50:37','2025-12-03','Creación de contrato','2025-12-16 14:50:37','2025-12-16 14:50:37'),(23,5,23,'activo','inactivo','2025-12-16 17:11:23','2025-12-16','nadad','2025-12-16 17:11:23','2025-12-16 17:11:23'),(24,5,23,'inactivo','activo','2025-12-16 17:11:46','2025-12-16',NULL,'2025-12-16 17:11:46','2025-12-16 17:11:46'),(25,24,23,'inactivo','activo','2025-12-16 17:15:55','2025-12-16','Creación de contrato','2025-12-16 17:15:55','2025-12-16 17:15:55'),(26,25,3,'inactivo','activo','2025-12-16 17:25:20','2025-12-26','Creación de contrato','2025-12-16 17:25:20','2025-12-16 17:25:20'),(27,26,3,'inactivo','activo','2025-12-16 17:27:02','2025-12-16','Creación de contrato','2025-12-16 17:27:02','2025-12-16 17:27:02'),(28,27,8,'inactivo','activo','2025-12-16 20:46:59','2025-12-03','Creación de contrato','2025-12-16 20:46:59','2025-12-16 20:46:59'),(29,9,8,'activo','inactivo','2025-12-16 20:56:04','2025-12-09',NULL,'2025-12-16 20:56:04','2025-12-16 20:56:04'),(30,28,23,'inactivo','activo','2025-12-16 21:18:26','2025-12-10','Creación de contrato','2025-12-16 21:18:26','2025-12-16 21:18:26'),(31,29,23,'inactivo','activo','2025-12-16 21:50:20','2025-12-11','Creación de contrato','2025-12-16 21:50:20','2025-12-16 21:50:20'),(32,30,3,'inactivo','activo','2025-12-17 13:57:51','2025-12-17','Creación de contrato','2025-12-17 13:57:51','2025-12-17 13:57:51'),(33,31,3,'inactivo','activo','2025-12-17 13:58:26','2025-12-17','Creación de contrato','2025-12-17 13:58:26','2025-12-17 13:58:26'),(34,32,3,'inactivo','activo','2025-12-17 14:13:07','2025-12-17','Creación de contrato','2025-12-17 14:13:07','2025-12-17 14:13:07'),(35,33,23,'inactivo','activo','2025-12-17 14:16:40','2025-12-03','Creación de contrato','2025-12-17 14:16:40','2025-12-17 14:16:40');
/*!40000 ALTER TABLE `contrato_historial_estados` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contrato_pasos`
--

DROP TABLE IF EXISTS `contrato_pasos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contrato_pasos` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `contrato_id` int unsigned NOT NULL,
  `usuario_id` int unsigned DEFAULT NULL,
  `fase` enum('inicio','desarrollo','fin') COLLATE utf8mb4_unicode_ci NOT NULL,
  `nombre_paso` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fecha` date DEFAULT NULL,
  `archivo_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `observacion` text COLLATE utf8mb4_unicode_ci,
  `orden` int NOT NULL,
  `completado` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `contrato_pasos_contrato_id_index` (`contrato_id`),
  KEY `contrato_pasos_usuario_id_index` (`usuario_id`),
  KEY `contrato_pasos_fase_index` (`fase`),
  KEY `contrato_pasos_orden_index` (`orden`),
  CONSTRAINT `contrato_pasos_contrato_id_foreign` FOREIGN KEY (`contrato_id`) REFERENCES `contratos` (`id`) ON DELETE CASCADE,
  CONSTRAINT `contrato_pasos_usuario_id_foreign` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=64 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contrato_pasos`
--

LOCK TABLES `contrato_pasos` WRITE;
/*!40000 ALTER TABLE `contrato_pasos` DISABLE KEYS */;
INSERT INTO `contrato_pasos` VALUES (10,1,NULL,'inicio','Reclutamiento/selección','2024-01-05','','Proceso completado sin observaciones',1,1,'2025-12-15 18:59:16','2025-12-15 18:59:16'),(11,1,NULL,'inicio','Referenciación','2024-01-06','','',2,1,'2025-12-15 18:59:16','2025-12-15 18:59:16'),(12,1,NULL,'inicio','Pruebas','2024-01-07','','Pruebas satisfactorias',3,1,'2025-12-15 18:59:16','2025-12-15 18:59:16'),(13,2,NULL,'inicio','Solicitud','2024-02-25','','',1,1,'2025-12-15 18:59:16','2025-12-15 18:59:16'),(14,2,NULL,'inicio','Pruebas','2024-02-26','','Pruebas técnicas entregadas',2,1,'2025-12-15 18:59:16','2025-12-15 18:59:16'),(15,5,3,'inicio','Solicitud Personal',NULL,NULL,NULL,1,0,'2025-12-15 20:42:41','2025-12-15 20:42:41'),(16,5,3,'inicio','Contratación y Documentación',NULL,NULL,NULL,5,0,'2025-12-15 20:42:41','2025-12-15 20:42:41'),(17,5,3,'inicio','Examen Médico Pre-ocupacional',NULL,NULL,NULL,4,0,'2025-12-15 20:42:41','2025-12-15 20:42:41'),(18,5,3,'inicio','Entrevista Inicial',NULL,NULL,NULL,2,0,'2025-12-15 20:42:41','2025-12-15 20:42:41'),(19,5,3,'inicio','Pruebas Psicotécnicas',NULL,NULL,NULL,3,0,'2025-12-15 20:42:41','2025-12-15 20:42:41'),(20,8,3,'inicio','Inicio Contrato',NULL,NULL,NULL,1,0,'2025-12-15 21:01:28','2025-12-15 21:01:28'),(21,8,3,'inicio','Afiliación Seguridad Social',NULL,NULL,NULL,3,0,'2025-12-15 21:01:28','2025-12-15 21:01:28'),(22,8,3,'inicio','Firma Documentos',NULL,NULL,NULL,2,0,'2025-12-15 21:01:28','2025-12-15 21:01:28'),(23,12,3,'inicio','Proceso de Selección',NULL,NULL,NULL,1,0,'2025-12-16 14:10:15','2025-12-16 14:10:15'),(24,12,3,'inicio','Verificación de Referencias',NULL,NULL,NULL,2,0,'2025-12-16 14:10:15','2025-12-16 14:10:15'),(25,12,3,'inicio','Entrevista Final',NULL,NULL,NULL,3,0,'2025-12-16 14:10:15','2025-12-16 14:10:15'),(26,12,3,'inicio','Firma de Contrato',NULL,NULL,NULL,5,0,'2025-12-16 14:10:15','2025-12-16 14:10:15'),(27,12,3,'inicio','Examen Médico de Ingreso',NULL,NULL,NULL,4,0,'2025-12-16 14:10:15','2025-12-16 14:10:15'),(28,12,3,'inicio','Inducción y Bienvenida',NULL,NULL,NULL,6,0,'2025-12-16 14:10:15','2025-12-16 14:10:15'),(29,16,3,'inicio','Proceso de Selección',NULL,NULL,NULL,1,0,'2025-12-16 14:29:28','2025-12-16 14:29:28'),(30,16,3,'inicio','Verificación de Referencias',NULL,NULL,NULL,2,0,'2025-12-16 14:29:28','2025-12-16 14:29:28'),(31,16,3,'inicio','Entrevista Final',NULL,NULL,NULL,3,0,'2025-12-16 14:29:28','2025-12-16 14:29:28'),(32,16,3,'inicio','Examen Médico de Ingreso',NULL,NULL,NULL,4,0,'2025-12-16 14:29:28','2025-12-16 14:29:28'),(33,16,3,'inicio','Firma de Contrato',NULL,NULL,NULL,5,0,'2025-12-16 14:29:28','2025-12-16 14:29:28'),(34,16,3,'inicio','Inducción y Bienvenida',NULL,NULL,NULL,6,0,'2025-12-16 14:29:28','2025-12-16 14:29:28'),(35,15,8,'inicio','Firma Documentos',NULL,NULL,NULL,2,0,'2025-12-16 14:29:29','2025-12-16 14:29:29'),(36,15,8,'inicio','Afiliación Seguridad Social',NULL,NULL,NULL,3,0,'2025-12-16 14:29:29','2025-12-16 14:29:29'),(37,15,8,'inicio','Inicio Contrato',NULL,NULL,NULL,1,0,'2025-12-16 14:29:29','2025-12-16 14:29:29'),(38,20,8,'inicio','Proceso de Selección',NULL,NULL,NULL,1,0,'2025-12-16 14:35:38','2025-12-16 14:35:38'),(39,20,8,'inicio','Verificación de Referencias',NULL,NULL,NULL,2,0,'2025-12-16 14:35:38','2025-12-16 14:35:38'),(40,20,8,'inicio','Entrevista Final',NULL,NULL,NULL,3,0,'2025-12-16 14:35:38','2025-12-16 14:35:38'),(41,20,8,'inicio','Examen Médico de Ingreso',NULL,NULL,NULL,4,0,'2025-12-16 14:35:38','2025-12-16 14:35:38'),(42,20,8,'inicio','Inducción y Bienvenida',NULL,NULL,NULL,6,0,'2025-12-16 14:35:38','2025-12-16 14:35:38'),(43,20,8,'inicio','Firma de Contrato',NULL,NULL,NULL,5,0,'2025-12-16 14:35:38','2025-12-16 14:35:38'),(44,22,8,'inicio','Inicio Contrato',NULL,NULL,NULL,1,0,'2025-12-16 14:41:06','2025-12-16 14:41:06'),(45,22,8,'inicio','Firma Documentos',NULL,NULL,NULL,2,0,'2025-12-16 14:41:06','2025-12-16 14:41:06'),(46,22,8,'inicio','Afiliación Seguridad Social',NULL,NULL,NULL,3,0,'2025-12-16 14:41:06','2025-12-16 14:41:06'),(47,23,1,'inicio','Entrevista Inicial','2025-12-16',NULL,NULL,2,1,'2025-12-16 14:50:39','2025-12-16 14:50:39'),(48,23,1,'inicio','Solicitud Personal','2025-12-16',NULL,NULL,1,1,'2025-12-16 14:50:39','2025-12-16 14:50:39'),(49,23,1,'inicio','Pruebas Psicotécnicas','2025-12-16',NULL,NULL,3,1,'2025-12-16 14:50:39','2025-12-16 14:50:39'),(50,23,1,'inicio','Contratación y Documentación','2025-12-16',NULL,NULL,5,1,'2025-12-16 14:50:39','2025-12-16 14:50:39'),(51,23,1,'inicio','Examen Médico Pre-ocupacional','2025-12-16',NULL,NULL,4,1,'2025-12-16 14:50:39','2025-12-16 14:50:39'),(52,29,23,'inicio','Proceso de Selección',NULL,NULL,NULL,1,0,'2025-12-16 21:50:21','2025-12-16 21:50:21'),(53,29,23,'inicio','Entrevista Final',NULL,NULL,NULL,3,0,'2025-12-16 21:50:21','2025-12-16 21:50:21'),(54,29,23,'inicio','Verificación de Referencias',NULL,NULL,NULL,2,0,'2025-12-16 21:50:21','2025-12-16 21:50:21'),(55,29,23,'inicio','Examen Médico de Ingreso',NULL,NULL,NULL,4,0,'2025-12-16 21:50:21','2025-12-16 21:50:21'),(56,29,23,'inicio','Firma de Contrato',NULL,NULL,NULL,5,0,'2025-12-16 21:50:21','2025-12-16 21:50:21'),(57,29,23,'inicio','Inducción y Bienvenida',NULL,NULL,NULL,6,0,'2025-12-16 21:50:21','2025-12-16 21:50:21'),(58,33,23,'inicio','Proceso de Selección',NULL,NULL,NULL,1,0,'2025-12-17 14:16:44','2025-12-17 14:16:44'),(59,33,23,'inicio','Verificación de Referencias',NULL,NULL,NULL,2,0,'2025-12-17 14:16:44','2025-12-17 14:16:44'),(60,33,23,'inicio','Entrevista Final',NULL,NULL,NULL,3,0,'2025-12-17 14:16:44','2025-12-17 14:16:44'),(61,33,23,'inicio','Examen Médico de Ingreso',NULL,NULL,NULL,4,0,'2025-12-17 14:16:44','2025-12-17 14:16:44'),(62,33,23,'inicio','Inducción y Bienvenida',NULL,NULL,NULL,6,0,'2025-12-17 14:16:44','2025-12-17 14:16:44'),(63,33,23,'inicio','Firma de Contrato',NULL,NULL,NULL,5,0,'2025-12-17 14:16:44','2025-12-17 14:16:44');
/*!40000 ALTER TABLE `contrato_pasos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contratos`
--

DROP TABLE IF EXISTS `contratos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contratos` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `identificacion` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tipo_contrato` enum('prestacion','temporal','laboral','aprendizaje') COLLATE utf8mb4_unicode_ci NOT NULL,
  `estado` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'activo',
  `fecha_inicio` date NOT NULL,
  `fecha_terminacion` date DEFAULT NULL,
  `funciones_cargo` text COLLATE utf8mb4_unicode_ci,
  `salario` decimal(15,2) NOT NULL,
  `termino_contrato` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `periodo_prueba` int DEFAULT NULL,
  `horario_trabajo` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `centro_costo` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nombre_archivo_contrato_fisico` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ruta_archivo_contrato_fisico` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `motivo_finalizacion` text COLLATE utf8mb4_unicode_ci,
  `tiene_recomendaciones_medicas` tinyint(1) DEFAULT '0',
  `ruta_archivo_recomendacion_medica` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `eps_doc_path` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `eps_doc_nombre` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `eps_doc_mime` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `eps_doc_size` bigint DEFAULT NULL,
  `arl_doc_path` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `arl_doc_nombre` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `arl_doc_mime` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `arl_doc_size` bigint DEFAULT NULL,
  `afp_doc_path` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `afp_doc_nombre` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `afp_doc_mime` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `afp_doc_size` bigint DEFAULT NULL,
  `afc_doc_path` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `afc_doc_nombre` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `afc_doc_mime` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `afc_doc_size` bigint DEFAULT NULL,
  `ccf_doc_path` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ccf_doc_nombre` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ccf_doc_mime` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ccf_doc_size` bigint DEFAULT NULL,
  `usuario_id` int unsigned NOT NULL,
  `sede_id` int unsigned NOT NULL,
  `razon_social_id` int unsigned NOT NULL,
  `cargo_id` int unsigned NOT NULL,
  `eps_id` int unsigned DEFAULT NULL,
  `arl_id` int unsigned DEFAULT NULL,
  `afp_id` int unsigned DEFAULT NULL,
  `afc_id` int unsigned DEFAULT NULL,
  `ccf_id` int unsigned DEFAULT NULL,
  `actor_id` int unsigned DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `contratos_actor_id_index` (`actor_id`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contratos`
--

LOCK TABLES `contratos` WRITE;
/*!40000 ALTER TABLE `contratos` DISABLE KEYS */;
INSERT INTO `contratos` VALUES (1,'1020304050','laboral','activo','2024-01-10',NULL,'Dirección administrativa, comercial y gestión de proyectos estratégicos.',4500000.00,'indefinido',NULL,NULL,'GER-ADM',NULL,NULL,NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,3,2,1,3,1,41,25,30,35,NULL,'2025-12-15 18:59:16','2025-12-15 18:59:16'),(2,'1098765432','laboral','activo','2024-03-01','2025-02-28','Gestión contable, financiera y análisis de estados financieros.',3200000.00,'termino_fijo',NULL,NULL,'CONTABILIDAD',NULL,NULL,NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,6,2,1,5,1,41,25,30,35,NULL,'2025-12-15 18:59:16','2025-12-15 18:59:16'),(3,'1123456789','prestacion','activo','2024-06-01','2024-12-31','Gestión de recursos humanos, nómina y bienestar laboral.',2500000.00,NULL,NULL,NULL,'TH-01',NULL,NULL,NULL,1,'/uploads/recomendaciones_medicas/andrea_lopez_recomendacion.pdf',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,8,2,1,4,1,41,25,NULL,35,NULL,'2025-12-15 18:59:16','2025-12-15 18:59:16'),(4,'10203040','laboral','activo','2025-12-11',NULL,'Asesor comercial',1500000.00,'indefinido',NULL,NULL,'COMERCIAL',NULL,NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'/uploads/contratos/afiliaciones/afc/4/iubypt5xm5x7tsx04r7selve_vistas_wo.pdf','vistas_wo.pdf','application/pdf',980821,NULL,NULL,NULL,NULL,20,3,4,8,18,42,25,30,40,8,'2025-12-15 20:25:55','2025-12-15 20:45:46'),(5,'1111111','temporal','activo','2025-12-16','2025-12-16','11111',1111.00,'obra_o_labor_determinada',NULL,NULL,NULL,'bt6ynnhkyl3y2jf29y0a86d4.pdf','/uploads/contratos/bt6ynnhkyl3y2jf29y0a86d4.pdf','nadad',0,NULL,'/uploads/contratos/afiliaciones/eps/5/d72nkjoj2oiitlbc5esbjpla_CC1110563140_20251124165214.pdf','CC1110563140_20251124165214.pdf','application/pdf',61626,'/uploads/contratos/afiliaciones/arl/5/rcq9h91ylj23tuofgt9chqa1_CC1110563140_20251124165214.pdf','CC1110563140_20251124165214.pdf','application/pdf',61626,'/uploads/contratos/afiliaciones/afp/5/zjk5fn6uu6wkk5wzj91jg883_CC1110563140_20251124165214.pdf','CC1110563140_20251124165214.pdf','application/pdf',61626,'/uploads/contratos/afiliaciones/afc/5/bwrdf6fq61oyx2vha842m6hf_CC1110563140_20251124165214.pdf','CC1110563140_20251124165214.pdf','application/pdf',61626,'/uploads/contratos/afiliaciones/ccf/5/ubygr1remw8wznbbjcpt3axv_CC1110563140_20251124165214.pdf','CC1110563140_20251124165214.pdf','application/pdf',61626,1,2,1,5,5,43,27,31,37,3,'2025-12-15 20:42:40','2025-12-16 17:11:46'),(6,'7657567','laboral','activo','2025-12-16',NULL,'prueba anexo',1500000.00,'indefinido',NULL,NULL,'COMERCIAL',NULL,NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,20,1,4,8,21,47,29,30,40,8,'2025-12-15 20:48:46','2025-12-15 20:48:46'),(7,'123213','prestacion','activo','2025-12-15','2025-12-25','error contratos',1200000.00,'fijo',NULL,NULL,'TALENTO HUMANO',NULL,NULL,NULL,0,NULL,'/uploads/contratos/afiliaciones/eps/7/x3s03e9qymjd8v9fpvrog3kx_constancia_TituladaPresencial.pdf','constancia_TituladaPresencial.pdf','application/pdf',13566,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,21,3,2,10,5,43,26,33,40,1,'2025-12-15 20:55:41','2025-12-16 14:54:00'),(8,'33333333','prestacion','activo','2025-12-15','2025-12-19','1111',1111111.00,'obra_o_labor_determinada',NULL,NULL,NULL,'ymjd45s0a4zzymiymcjvn7vb.pdf','/uploads/contratos/ymjd45s0a4zzymiymcjvn7vb.pdf',NULL,0,NULL,'/uploads/contratos/afiliaciones/eps/8/tu581azhegg4ib819bs0vtym_CC1110563140_20251124165214.pdf','CC1110563140_20251124165214.pdf','application/pdf',61626,'/uploads/contratos/afiliaciones/arl/8/uv0khmow1decxi98vozzv6kt_CC1110563140_20251124165214.pdf','CC1110563140_20251124165214.pdf','application/pdf',61626,'/uploads/contratos/afiliaciones/afp/8/in6p1wf35fawrpw328uhr59d_CC1110563140_20251124165214.pdf','CC1110563140_20251124165214.pdf','application/pdf',61626,'/uploads/contratos/afiliaciones/afc/8/hvoo5vs3yjqxfdzc8u6ymdaw_CC1110563140_20251124165214.pdf','CC1110563140_20251124165214.pdf','application/pdf',61626,'/uploads/contratos/afiliaciones/ccf/8/dnf0bs0tbfsmhhko6j2cvl6x_CC1110563140_20251124165214.pdf','CC1110563140_20251124165214.pdf','application/pdf',61626,5,4,1,3,5,43,27,31,36,3,'2025-12-15 21:01:26','2025-12-15 21:01:27'),(9,'4324324','prestacion','inactivo','2025-12-09','2025-12-25','00',1500000.00,'fijo',NULL,NULL,'TALENTO HUMANO','rl5xx9kj82ia90fejwra51wb.pdf','/uploads/contratos/rl5xx9kj82ia90fejwra51wb.pdf',NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,21,1,2,8,22,43,27,31,39,3,'2025-12-15 21:04:17','2025-12-16 20:56:04'),(10,'4234324','prestacion','activo','2025-12-09','2025-12-18','fsdf',1500000.00,'fijo',NULL,NULL,'COMERCIAL','rxwarm8cs016nz3qtwwxfmn4.pdf','/uploads/contratos/rxwarm8cs016nz3qtwwxfmn4.pdf',NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,20,4,4,8,5,43,27,34,36,3,'2025-12-15 21:20:48','2025-12-16 14:53:05'),(11,'4234234324','laboral','activo','2025-12-09',NULL,'dsa',1500000.00,'indefinido',NULL,NULL,'SERVICIO AL CLIENTE',NULL,NULL,NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,21,4,2,10,5,43,27,31,39,3,'2025-12-15 21:44:21','2025-12-15 21:44:21'),(12,'222222222','laboral','activo','2025-12-16',NULL,'22222',22222.00,'indefinido',NULL,NULL,'SERVICIO AL CLIENTE','cbhc6l0rq9glhamywdb14fs3.pdf','/uploads/contratos/cbhc6l0rq9glhamywdb14fs3.pdf',NULL,1,'/uploads/recomendaciones_medicas/db02156o5jnd05d52a45biz2.jpg',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,1,1,8,5,43,27,31,37,3,'2025-12-16 14:10:13','2025-12-16 17:12:57'),(13,'7642345','laboral','activo','2025-12-24','2026-01-08','comercial',678768.00,'fijo',NULL,NULL,'CONTABILIDAD',NULL,NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,22,1,2,8,22,43,27,30,36,8,'2025-12-16 14:17:22','2025-12-16 14:17:22'),(14,'4234234','laboral','activo','2025-12-05',NULL,'hgfh',0.00,'indefinido',NULL,NULL,'CONTABILIDAD',NULL,NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,22,1,2,8,5,43,28,34,38,8,'2025-12-16 14:27:52','2025-12-16 14:27:52'),(15,'11111','prestacion','activo','2025-12-16','2025-12-28','1111',111.00,'fijo',NULL,NULL,NULL,'b6oerl2eore4zb62g4g379u7.pdf','/uploads/contratos/b6oerl2eore4zb62g4g379u7.pdf',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,3,4,2,5,5,43,27,31,37,8,'2025-12-16 14:29:27','2025-12-16 14:29:29'),(16,'5435435','laboral','activo','2025-12-03',NULL,'0',0.00,'indefinido',NULL,NULL,'SERVICIO AL CLIENTE','yr5ygnm4y3jjnhwgdfnefbk1.pdf','/uploads/contratos/yr5ygnm4y3jjnhwgdfnefbk1.pdf',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,22,4,2,8,21,46,28,32,40,3,'2025-12-16 14:29:27','2025-12-16 14:29:28'),(17,'4324234','laboral','activo','2025-12-17',NULL,'sad',0.00,'indefinido',NULL,NULL,'CONTABILIDAD','onumxaqkk04oj0aqmo2lch54.pdf','/uploads/contratos/onumxaqkk04oj0aqmo2lch54.pdf',NULL,1,'/uploads/recomendaciones_medicas/c82ki0v456ip5yng94703v4c.pdf',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,22,4,2,8,22,43,28,34,38,8,'2025-12-16 14:31:23','2025-12-16 14:32:26'),(18,'546456','laboral','activo','2025-12-09','2025-12-24','0',0.00,'fijo',NULL,NULL,'TALENTO HUMANO',NULL,NULL,NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,3,4,2,8,5,43,27,31,36,8,'2025-12-16 14:33:31','2025-12-16 14:33:31'),(19,'111111','temporal','activo','2025-12-16','2025-12-20','1111',111.00,'obra_o_labor_determinada',NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,3,4,2,5,11,45,27,31,36,8,'2025-12-16 14:33:42','2025-12-16 14:33:42'),(20,'234324','laboral','activo','2025-12-17',NULL,'dasd',0.00,'indefinido',NULL,NULL,'TALENTO HUMANO','le8zye4lir2emba091jqma5b.pdf','/uploads/contratos/le8zye4lir2emba091jqma5b.pdf',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,4,1,1,8,5,43,27,31,36,8,'2025-12-16 14:35:35','2025-12-16 14:35:37'),(21,'967567','laboral','activo','2025-12-16','2025-12-26','d',9.00,'fijo',NULL,NULL,'ADMINISTRACIÓN',NULL,NULL,NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,5,4,1,8,5,43,25,31,39,8,'2025-12-16 14:37:01','2025-12-16 14:37:01'),(22,'324324324','aprendizaje','activo','2025-12-16','2025-12-27','dasd',0.00,'fijo',NULL,NULL,'OPERACIÓN','i13auuux5i3lahrftgcg0uek.pdf','/uploads/contratos/i13auuux5i3lahrftgcg0uek.pdf',NULL,1,'/uploads/recomendaciones_medicas/dil3479kpkvz37i8vxm31wfi.pdf','/uploads/contratos/afiliaciones/eps/22/jot4pk6r2u3m05ethh2kfc8v_constancia_NotasAprendiz.pdf','constancia_NotasAprendiz.pdf','application/pdf',24107,'/uploads/contratos/afiliaciones/arl/22/n6l5vwyizou6y8zuejcgwkt8_e084701.pdf','e084701.pdf','application/pdf',557962,'/uploads/contratos/afiliaciones/afp/22/xl58yqnxd8kd6lricys97pib_constancia_NotasAprendiz.pdf','constancia_NotasAprendiz.pdf','application/pdf',24107,'/uploads/contratos/afiliaciones/afc/22/q7k4p5wghzd5hvld1x4ar452_CDA ACTIVA LOGO new .pdf','CDA ACTIVA LOGO new .pdf','application/pdf',224966,'/uploads/contratos/afiliaciones/ccf/22/k8x31irhh52iqmpjcid09rz3_constancia_NotasAprendiz.pdf','constancia_NotasAprendiz.pdf','application/pdf',24107,7,2,1,5,5,43,27,31,36,8,'2025-12-16 14:41:04','2025-12-16 14:41:06'),(23,'123456','temporal','activo','2025-12-03','2025-12-11','das',1233333.00,'obra_o_labor_determinada',NULL,NULL,'TALENTO HUMANO','kgkj2gjl2kkxwdzm2v71brl4.pdf','/uploads/contratos/kgkj2gjl2kkxwdzm2v71brl4.pdf',NULL,1,'/uploads/recomendaciones_medicas/o1kkf1r958qsmquo92h97bj8.pdf','/uploads/contratos/afiliaciones/eps/23/xas89s9xwz87hibz9tm0hodz_constancia_NotasAprendiz.pdf','constancia_NotasAprendiz.pdf','application/pdf',24107,'/uploads/contratos/afiliaciones/arl/23/uamxo6qic8cne8m9wnq5pahu_constancia_NotasAprendiz.pdf','constancia_NotasAprendiz.pdf','application/pdf',24107,'/uploads/contratos/afiliaciones/afp/23/g0yvfim7a0sel4v5d8nvzm0n_constancia_TituladaPresencial.pdf','constancia_TituladaPresencial.pdf','application/pdf',13566,'/uploads/contratos/afiliaciones/afc/23/av74zvyfwuqigrrnukquxllp_F-1539 Conocimiento del cliente persona natural.pdf','F-1539 Conocimiento del cliente persona natural.pdf','application/pdf',372623,'/uploads/contratos/afiliaciones/ccf/23/hlmj1n97feinjv3tq56oeea5_BOLIVAR_ARL_certificado.pdf','BOLIVAR_ARL_certificado.pdf','application/pdf',204498,23,1,2,4,5,43,27,31,36,1,'2025-12-16 14:50:37','2025-12-16 14:50:39'),(24,'78657657','prestacion','activo','2025-12-16','2025-12-27','das',0.00,'fijo',NULL,NULL,NULL,'awspuwiycbguacwae0w4t3uf.pdf','/uploads/contratos/awspuwiycbguacwae0w4t3uf.pdf',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,24,1,2,9,NULL,NULL,NULL,NULL,NULL,23,'2025-12-16 17:15:55','2025-12-16 17:23:01'),(25,'2222222','prestacion','activo','2025-12-26','2025-12-19','2222',222.00,'fijo',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,3,4,2,8,5,43,27,31,36,3,'2025-12-16 17:25:20','2025-12-16 17:25:20'),(26,'1111111','prestacion','activo','2025-12-16','2025-12-28','11111',1111.00,'fijo',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,3,4,2,8,5,45,27,31,37,3,'2025-12-16 17:27:02','2025-12-16 17:27:02'),(27,'45654656','laboral','activo','2025-12-03',NULL,'fas',2342343.00,'indefinido',NULL,NULL,'CONTABILIDAD','sad7dysehrj5o1szo6xds11i.pdf','/uploads/contratos/sad7dysehrj5o1szo6xds11i.pdf',NULL,1,'/uploads/recomendaciones_medicas/ppeyr2qsb6aqz8s5p4a8gjsa.pdf',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,25,2,2,5,5,43,27,31,37,8,'2025-12-16 20:46:59','2025-12-16 20:51:34'),(28,'543534543','prestacion','activo','2025-12-10','2025-12-19','f',345.00,'fijo',NULL,NULL,'SERVICIO AL CLIENTE','wbkl3paw8zwwohhe0p191mwj.pdf','/uploads/contratos/wbkl3paw8zwwohhe0p191mwj.pdf',NULL,1,'/uploads/recomendaciones_medicas/anqix2rociz8sweo1yh8c0ja.pdf',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,26,4,4,11,11,46,29,30,36,23,'2025-12-16 21:18:26','2025-12-16 21:19:36'),(29,'42423423','laboral','activo','2025-12-11',NULL,'dada',456546.00,'indefinido',NULL,NULL,'DIRECCIÓN','a035ductnq4nhf6mc0s2ehpl.pdf','/uploads/contratos/a035ductnq4nhf6mc0s2ehpl.pdf',NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,27,4,4,1,5,43,27,31,37,23,'2025-12-16 21:50:20','2025-12-16 21:50:21'),(30,'11111','prestacion','activo','2025-12-17','2025-12-28','11111',111.00,'fijo',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,4,1,9,NULL,NULL,NULL,NULL,NULL,3,'2025-12-17 13:57:51','2025-12-17 13:57:51'),(31,'11111','prestacion','activo','2025-12-17','2025-12-28','11111',111.00,'fijo',NULL,NULL,NULL,'jfjr7mr81lbsjjm9ci8v0fa8.pdf','/uploads/contratos/jfjr7mr81lbsjjm9ci8v0fa8.pdf',NULL,1,'/uploads/recomendaciones_medicas/c0grmaeg5srvlcc882d7veg8.pdf',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,4,1,5,5,43,27,31,37,3,'2025-12-17 13:58:26','2025-12-17 14:12:22'),(32,'4444444','prestacion','activo','2025-12-17','2025-12-28','444444',44444.00,'obra_o_labor_determinada',NULL,NULL,NULL,'ikkh6bxdoggg5nnepvt4fmr7.pdf','/uploads/contratos/ikkh6bxdoggg5nnepvt4fmr7.pdf',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,18,2,1,9,NULL,NULL,NULL,NULL,NULL,3,'2025-12-17 14:13:07','2025-12-17 14:13:08'),(33,'324234324','laboral','activo','2025-12-03',NULL,'d',4324.00,'indefinido',NULL,NULL,'DIRECCIÓN','yc2gzx02qk7cxlrw4fajasxn.pdf','/uploads/contratos/yc2gzx02qk7cxlrw4fajasxn.pdf',NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,6,4,1,5,18,42,26,31,39,23,'2025-12-17 14:16:40','2025-12-17 14:16:44');
/*!40000 ALTER TABLE `contratos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contratos_salarios`
--

DROP TABLE IF EXISTS `contratos_salarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contratos_salarios` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `contrato_id` int unsigned NOT NULL,
  `salario_basico` decimal(15,2) NOT NULL,
  `bono_salarial` decimal(15,2) NOT NULL DEFAULT '0.00',
  `auxilio_transporte` decimal(15,2) NOT NULL DEFAULT '0.00',
  `auxilio_no_salarial` decimal(15,2) NOT NULL DEFAULT '0.00',
  `fecha_efectiva` date NOT NULL,
  `created_at` timestamp NOT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `contratos_salarios_contrato_id_foreign` (`contrato_id`),
  CONSTRAINT `contratos_salarios_contrato_id_foreign` FOREIGN KEY (`contrato_id`) REFERENCES `contratos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contratos_salarios`
--

LOCK TABLES `contratos_salarios` WRITE;
/*!40000 ALTER TABLE `contratos_salarios` DISABLE KEYS */;
INSERT INTO `contratos_salarios` VALUES (1,1,4500000.00,0.00,162000.00,0.00,'2025-12-15','2025-12-15 18:59:16','2025-12-15 18:59:16'),(2,2,3200000.00,0.00,162000.00,0.00,'2025-12-15','2025-12-15 18:59:16','2025-12-15 18:59:16'),(3,3,2500000.00,0.00,0.00,0.00,'2025-12-15','2025-12-15 18:59:16','2025-12-15 18:59:16'),(4,4,1500000.00,0.00,200000.00,0.00,'2025-12-15','2025-12-15 20:25:55','2025-12-15 20:45:46'),(5,5,1111.00,1111.00,111.00,1111.00,'2025-12-15','2025-12-15 20:42:40','2025-12-15 20:42:40'),(6,6,1500000.00,0.00,200000.00,0.00,'2025-12-15','2025-12-15 20:48:46','2025-12-15 20:48:46'),(7,7,1200000.00,0.00,0.00,0.00,'2025-12-15','2025-12-15 20:55:41','2025-12-15 20:55:41'),(8,8,1111111.00,1111.00,111.00,111.00,'2025-12-15','2025-12-15 21:01:26','2025-12-15 21:01:26'),(9,9,1500000.00,0.00,0.00,0.00,'2025-12-16','2025-12-15 21:04:17','2025-12-16 14:52:04'),(10,10,1500000.00,20000.00,0.00,0.00,'2025-12-16','2025-12-15 21:20:48','2025-12-16 14:53:05'),(11,11,1500000.00,0.00,0.00,0.00,'2025-12-15','2025-12-15 21:44:21','2025-12-15 21:44:21'),(12,12,22222.00,222.00,222.00,22222.00,'2025-12-16','2025-12-16 14:10:13','2025-12-16 14:10:13'),(13,13,678768.00,0.00,0.00,0.00,'2025-12-16','2025-12-16 14:17:22','2025-12-16 14:17:22'),(14,14,0.00,0.00,0.00,0.00,'2025-12-16','2025-12-16 14:27:52','2025-12-16 14:27:52'),(15,15,111.00,111.00,111.00,111.00,'2025-12-16','2025-12-16 14:29:27','2025-12-16 14:29:27'),(16,16,0.00,0.00,0.00,0.00,'2025-12-16','2025-12-16 14:29:27','2025-12-16 14:29:27'),(17,17,0.00,0.00,0.00,0.00,'2025-12-16','2025-12-16 14:31:23','2025-12-16 14:31:23'),(18,18,0.00,0.00,0.00,0.00,'2025-12-16','2025-12-16 14:33:31','2025-12-16 14:33:31'),(19,19,111.00,111.00,111.00,111.00,'2025-12-16','2025-12-16 14:33:42','2025-12-16 14:33:42'),(20,20,0.00,0.00,0.00,0.00,'2025-12-16','2025-12-16 14:35:35','2025-12-16 14:35:35'),(21,21,9.00,9.00,9.00,9.00,'2025-12-16','2025-12-16 14:37:01','2025-12-16 14:37:01'),(22,22,0.00,0.00,0.00,0.00,'2025-12-16','2025-12-16 14:41:04','2025-12-16 14:41:04'),(23,23,1233333.00,200000.00,0.00,0.00,'2025-12-16','2025-12-16 14:50:37','2025-12-16 14:50:37'),(24,24,0.00,0.00,0.00,0.00,'2025-12-16','2025-12-16 17:15:55','2025-12-16 17:23:01'),(25,25,222.00,222.00,222.00,222.00,'2025-12-16','2025-12-16 17:25:20','2025-12-16 17:25:20'),(26,26,1111.00,1111.00,1111.00,11111.00,'2025-12-16','2025-12-16 17:27:02','2025-12-16 17:27:02'),(27,27,2342343.00,23400.00,0.00,0.00,'2025-12-16','2025-12-16 20:46:59','2025-12-16 20:46:59'),(28,28,345.00,5.00,435.00,345.00,'2025-12-16','2025-12-16 21:18:26','2025-12-16 21:18:26'),(29,29,456546.00,65646.00,0.00,0.00,'2025-12-16','2025-12-16 21:50:20','2025-12-16 21:50:20'),(30,30,111.00,11.00,1111.00,11.00,'2025-12-17','2025-12-17 13:57:51','2025-12-17 13:57:51'),(31,31,111.00,11.00,1111.00,11.00,'2025-12-17','2025-12-17 13:58:26','2025-12-17 13:58:26'),(32,32,44444.00,4.00,4.00,4.00,'2025-12-17','2025-12-17 14:13:07','2025-12-17 14:13:07'),(33,33,4324.00,0.00,0.00,0.00,'2025-12-17','2025-12-17 14:16:40','2025-12-17 14:16:40');
/*!40000 ALTER TABLE `contratos_salarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `convenios`
--

DROP TABLE IF EXISTS `convenios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `convenios` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `tipo` enum('PERSONA','TALLER','PARQUEADERO','LAVADERO') COLLATE utf8mb4_unicode_ci NOT NULL,
  `codigo` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nombre` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `doc_tipo` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `doc_numero` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `telefono` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `whatsapp` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(120) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ciudad_id` int unsigned DEFAULT NULL,
  `direccion` varchar(180) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `notas` text COLLATE utf8mb4_unicode_ci,
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  `asesor_convenio_id` int unsigned DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `convenios_doc_tipo_doc_numero_unique` (`doc_tipo`,`doc_numero`),
  KEY `convenios_ciudad_id_foreign` (`ciudad_id`),
  KEY `convenios_asesor_convenio_id_foreign` (`asesor_convenio_id`),
  KEY `convenios_activo_tipo_index` (`activo`,`tipo`),
  KEY `idx_convenios_codigo` (`codigo`),
  CONSTRAINT `convenios_asesor_convenio_id_foreign` FOREIGN KEY (`asesor_convenio_id`) REFERENCES `agentes_captacions` (`id`) ON DELETE SET NULL,
  CONSTRAINT `convenios_ciudad_id_foreign` FOREIGN KEY (`ciudad_id`) REFERENCES `ciudades` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `convenios`
--

LOCK TABLES `convenios` WRITE;
/*!40000 ALTER TABLE `convenios` DISABLE KEYS */;
INSERT INTO `convenios` VALUES (1,'PERSONA',NULL,'Taller El Cambio','CC','1010000015','3011000001','3121000001','taller.cambio@convenios.com',NULL,'Cra 20 #12-05','Convenio creado 1:1 desde usuario ASESOR CONVENIO',1,3,'2025-12-15 18:59:16','2025-12-15 18:59:16'),(2,'PERSONA',NULL,'Parqueadero Central','NIT','900000016','3011000002','3121000002','parqueadero.central@convenios.com',NULL,'Calle 5 #8-20','Convenio creado 1:1 desde usuario ASESOR CONVENIO',1,4,'2025-12-15 18:59:16','2025-12-15 18:59:16'),(3,'PERSONA',NULL,'Lavadero TurboWash','NIT','900000017','3011000003','3121000003','lavadero.turbowash@convenios.com',NULL,'Av 60 #20-30','Convenio creado 1:1 desde usuario ASESOR CONVENIO',1,5,'2025-12-15 18:59:16','2025-12-15 18:59:16'),(4,'PERSONA',NULL,'Carolina Rojas','NIT','900000018','3011000004','3121000004','carolina.rojas@convenios.com',NULL,'Calle 92 #25-15','Convenio creado 1:1 desde usuario ASESOR CONVENIO',1,6,'2025-12-15 18:59:16','2025-12-15 18:59:16'),(5,'PERSONA',NULL,'Taller ProService','CC','1010000019','3011000005','3121000005','taller.proservice@convenios.com',NULL,'Calle 100 #12-02','Convenio creado 1:1 desde usuario ASESOR CONVENIO',1,7,'2025-12-15 18:59:16','2025-12-15 18:59:16'),(6,'PERSONA',NULL,'prueba  convenio','CC','78657657','124324532','124324532','prueba3@cda.com',NULL,'rdasdas',NULL,1,15,'2025-12-16 17:15:55','2025-12-16 17:15:55'),(7,'PERSONA',NULL,'Carolina Rojas','CC','4444444','3011000004','3011000004','carolina.rojas@convenios.com',NULL,'Calle 92 #25-15',NULL,1,6,'2025-12-17 14:13:07','2025-12-17 14:13:07');
/*!40000 ALTER TABLE `convenios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `entidades_salud`
--

DROP TABLE IF EXISTS `entidades_salud`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `entidades_salud` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tipo` enum('eps','arl','afp','afc','ccf') COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=48 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `entidades_salud`
--

LOCK TABLES `entidades_salud` WRITE;
/*!40000 ALTER TABLE `entidades_salud` DISABLE KEYS */;
INSERT INTO `entidades_salud` VALUES (1,'COOSALUD','eps','2025-12-15 18:59:14','2025-12-15 18:59:14'),(2,'NUEVA EPS','eps','2025-12-15 18:59:14','2025-12-15 18:59:14'),(3,'MUTUAL SER','eps','2025-12-15 18:59:14','2025-12-15 18:59:14'),(4,'SALUD MIA','eps','2025-12-15 18:59:14','2025-12-15 18:59:14'),(5,'ALIANSALUD','eps','2025-12-15 18:59:14','2025-12-15 18:59:14'),(6,'SALUD TOTAL','eps','2025-12-15 18:59:14','2025-12-15 18:59:14'),(7,'SANITAS','eps','2025-12-15 18:59:14','2025-12-15 18:59:14'),(8,'SURA','eps','2025-12-15 18:59:14','2025-12-15 18:59:14'),(9,'FAMISANAR','eps','2025-12-15 18:59:14','2025-12-15 18:59:14'),(10,'SOS - SERVICIO OCCIDENTAL DE SALUD','eps','2025-12-15 18:59:14','2025-12-15 18:59:14'),(11,'COMFENALCO VALLE','eps','2025-12-15 18:59:14','2025-12-15 18:59:14'),(12,'COMPENSAR','eps','2025-12-15 18:59:14','2025-12-15 18:59:14'),(13,'EPM - EMPRESAS PUBLICAS DE MEDELLIN','eps','2025-12-15 18:59:14','2025-12-15 18:59:14'),(14,'FONDO DE PASIVO SOCIAL DE FERROCARRILES NACIONALES','eps','2025-12-15 18:59:14','2025-12-15 18:59:14'),(15,'EPS FAMILIAR DE COLOMBIA','eps','2025-12-15 18:59:14','2025-12-15 18:59:14'),(16,'ASMET SALUD','eps','2025-12-15 18:59:14','2025-12-15 18:59:14'),(17,'EMSSANAR ESS','eps','2025-12-15 18:59:14','2025-12-15 18:59:14'),(18,'CAPITAL SALUD','eps','2025-12-15 18:59:14','2025-12-15 18:59:14'),(19,'SAVIA SALUD','eps','2025-12-15 18:59:14','2025-12-15 18:59:14'),(20,'DUSAKAWI EPSI','eps','2025-12-15 18:59:14','2025-12-15 18:59:14'),(21,'ASOCIACION INDIGENA DEL CAUCA','eps','2025-12-15 18:59:14','2025-12-15 18:59:14'),(22,'ANAS WAYU EPSI','eps','2025-12-15 18:59:14','2025-12-15 18:59:14'),(23,'MALLAMAS EPSI','eps','2025-12-15 18:59:14','2025-12-15 18:59:14'),(24,'PIJAOS SALUD','eps','2025-12-15 18:59:14','2025-12-15 18:59:14'),(25,'PORVENIR','afp','2025-12-15 18:59:14','2025-12-15 18:59:14'),(26,'PROTECCION','afp','2025-12-15 18:59:14','2025-12-15 18:59:14'),(27,'COLFONDOS','afp','2025-12-15 18:59:14','2025-12-15 18:59:14'),(28,'COLPENSIONES','afp','2025-12-15 18:59:14','2025-12-15 18:59:14'),(29,'OLD MUTUAL','afp','2025-12-15 18:59:14','2025-12-15 18:59:14'),(30,'PORVENIR','afc','2025-12-15 18:59:14','2025-12-15 18:59:14'),(31,'COLFONDOS','afc','2025-12-15 18:59:14','2025-12-15 18:59:14'),(32,'PROTECCION','afc','2025-12-15 18:59:14','2025-12-15 18:59:14'),(33,'SKANDIA (OLD MUTUAL)','afc','2025-12-15 18:59:14','2025-12-15 18:59:14'),(34,'FONDO NACIONAL DEL AHORRO','afc','2025-12-15 18:59:14','2025-12-15 18:59:14'),(35,'COLSUBSIDIO','ccf','2025-12-15 18:59:14','2025-12-15 18:59:14'),(36,'CAFAM','ccf','2025-12-15 18:59:14','2025-12-15 18:59:14'),(37,'COMPENSAR','ccf','2025-12-15 18:59:14','2025-12-15 18:59:14'),(38,'COMFACUNDI','ccf','2025-12-15 18:59:14','2025-12-15 18:59:14'),(39,'COMFENALCO','ccf','2025-12-15 18:59:14','2025-12-15 18:59:14'),(40,'COMFATOLIMA','ccf','2025-12-15 18:59:14','2025-12-15 18:59:14'),(41,'SURA ARL','arl','2025-12-15 18:59:14','2025-12-15 18:59:14'),(42,'POSITIVA ARL','arl','2025-12-15 18:59:14','2025-12-15 18:59:14'),(43,'AXA COLPATRIA ARL','arl','2025-12-15 18:59:14','2025-12-15 18:59:14'),(44,'COLMENA ARL','arl','2025-12-15 18:59:14','2025-12-15 18:59:14'),(45,'BOLIVAR ARL','arl','2025-12-15 18:59:14','2025-12-15 18:59:14'),(46,'LIBERTY ARL','arl','2025-12-15 18:59:14','2025-12-15 18:59:14'),(47,'LA EQUIDAD ARL','arl','2025-12-15 18:59:14','2025-12-15 18:59:14');
/*!40000 ALTER TABLE `entidades_salud` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `facturacion_tickets`
--

DROP TABLE IF EXISTS `facturacion_tickets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `facturacion_tickets` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `hash` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `file_path` varchar(512) COLLATE utf8mb4_unicode_ci NOT NULL,
  `file_mime` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `file_size` int unsigned DEFAULT NULL,
  `image_rotation` int unsigned NOT NULL DEFAULT '0',
  `estado` enum('BORRADOR','OCR_LISTO','LISTA_CONFIRMAR','CONFIRMADA','REVERTIDA') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'BORRADOR',
  `placa` varchar(12) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `total` decimal(14,2) DEFAULT NULL,
  `fecha_pago` datetime DEFAULT NULL,
  `subtotal` decimal(14,2) DEFAULT NULL,
  `iva` decimal(14,2) DEFAULT NULL,
  `total_factura` decimal(14,2) DEFAULT NULL,
  `nit` varchar(40) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pin` varchar(60) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `marca` varchar(120) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `vendedor_text` varchar(180) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pago_consignacion` decimal(14,2) DEFAULT NULL,
  `pago_tarjeta` decimal(14,2) DEFAULT NULL,
  `pago_efectivo` decimal(14,2) DEFAULT NULL,
  `pago_cambio` decimal(14,2) DEFAULT NULL,
  `agente_id` int unsigned DEFAULT NULL,
  `sede_id` int unsigned DEFAULT NULL,
  `turno_id` int unsigned DEFAULT NULL,
  `dateo_id` int unsigned DEFAULT NULL,
  `servicio_id` int unsigned DEFAULT NULL,
  `turno_numero_global` int unsigned DEFAULT NULL,
  `turno_numero_servicio` int unsigned DEFAULT NULL,
  `turno_codigo` varchar(40) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tipo_vehiculo` varchar(40) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `placa_turno` varchar(12) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `servicio_codigo` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `servicio_nombre` varchar(120) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sede_nombre` varchar(120) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `funcionario_nombre` varchar(160) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `canal_atribucion` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `medio_entero` varchar(40) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `captacion_canal` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `agente_comercial_nombre` varchar(160) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `asesor_convenio_nombre` varchar(160) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `convenio_nombre` varchar(160) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `prefijo` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `consecutivo` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `forma_pago` enum('EFECTIVO','TARJETA','TRANSFERENCIA','MIXTO') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `doc_tipo` enum('CC','NIT') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `doc_numero` varchar(40) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nombre` varchar(180) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `telefono` varchar(40) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `observaciones` text COLLATE utf8mb4_unicode_ci,
  `cliente_id` int unsigned DEFAULT NULL,
  `vehiculo_id` int unsigned DEFAULT NULL,
  `ocr_text` text COLLATE utf8mb4_unicode_ci,
  `ocr_conf_placa` float(8,2) NOT NULL DEFAULT '0.00',
  `ocr_conf_total` float(8,2) NOT NULL DEFAULT '0.00',
  `ocr_conf_fecha` float(8,2) NOT NULL DEFAULT '0.00',
  `ocr_conf_agente` float(8,2) NOT NULL DEFAULT '0.00',
  `ocr_conf_baja_revisado` tinyint(1) NOT NULL DEFAULT '0',
  `duplicado_por_hash` tinyint(1) NOT NULL DEFAULT '0',
  `duplicado_por_contenido` tinyint(1) NOT NULL DEFAULT '0',
  `posible_duplicado_at` datetime DEFAULT NULL,
  `confirmado_at` datetime DEFAULT NULL,
  `confirmed_by_id` int unsigned DEFAULT NULL,
  `ajuste_total_flag` tinyint(1) NOT NULL DEFAULT '0',
  `ajuste_total_diff` decimal(14,2) NOT NULL DEFAULT '0.00',
  `revertida_flag` tinyint(1) NOT NULL DEFAULT '0',
  `revertida_motivo` varchar(180) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `revertida_at` datetime DEFAULT NULL,
  `created_by_id` int unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `facturacion_tickets_placa_index` (`placa`),
  KEY `facturacion_tickets_total_index` (`total`),
  KEY `facturacion_tickets_fecha_pago_index` (`fecha_pago`),
  KEY `facturacion_tickets_agente_id_index` (`agente_id`),
  KEY `facturacion_tickets_sede_id_index` (`sede_id`),
  KEY `facturacion_tickets_turno_id_index` (`turno_id`),
  KEY `facturacion_tickets_dateo_id_index` (`dateo_id`),
  KEY `facturacion_tickets_servicio_id_index` (`servicio_id`),
  KEY `facturacion_tickets_turno_numero_global_index` (`turno_numero_global`),
  KEY `facturacion_tickets_turno_numero_servicio_index` (`turno_numero_servicio`),
  KEY `facturacion_tickets_tipo_vehiculo_index` (`tipo_vehiculo`),
  KEY `facturacion_tickets_placa_turno_index` (`placa_turno`),
  KEY `facturacion_tickets_servicio_codigo_index` (`servicio_codigo`),
  KEY `facturacion_tickets_canal_atribucion_index` (`canal_atribucion`),
  KEY `facturacion_tickets_captacion_canal_index` (`captacion_canal`),
  KEY `facturacion_tickets_cliente_id_foreign` (`cliente_id`),
  KEY `facturacion_tickets_vehiculo_id_foreign` (`vehiculo_id`),
  KEY `facturacion_tickets_confirmed_by_id_index` (`confirmed_by_id`),
  KEY `facturacion_tickets_created_by_id_index` (`created_by_id`),
  KEY `idx_fact_placa_total_fecha` (`placa`,`total`,`fecha_pago`),
  KEY `facturacion_tickets_prefijo_consecutivo_index` (`prefijo`,`consecutivo`),
  KEY `facturacion_tickets_estado_index` (`estado`),
  CONSTRAINT `facturacion_tickets_agente_id_foreign` FOREIGN KEY (`agente_id`) REFERENCES `agentes_captacions` (`id`) ON DELETE SET NULL,
  CONSTRAINT `facturacion_tickets_cliente_id_foreign` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`) ON DELETE SET NULL,
  CONSTRAINT `facturacion_tickets_confirmed_by_id_foreign` FOREIGN KEY (`confirmed_by_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL,
  CONSTRAINT `facturacion_tickets_created_by_id_foreign` FOREIGN KEY (`created_by_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL,
  CONSTRAINT `facturacion_tickets_dateo_id_foreign` FOREIGN KEY (`dateo_id`) REFERENCES `captacion_dateos` (`id`) ON DELETE SET NULL,
  CONSTRAINT `facturacion_tickets_sede_id_foreign` FOREIGN KEY (`sede_id`) REFERENCES `sedes` (`id`) ON DELETE SET NULL,
  CONSTRAINT `facturacion_tickets_servicio_id_foreign` FOREIGN KEY (`servicio_id`) REFERENCES `servicios` (`id`) ON DELETE SET NULL,
  CONSTRAINT `facturacion_tickets_turno_id_foreign` FOREIGN KEY (`turno_id`) REFERENCES `turnos_rtms` (`id`) ON DELETE SET NULL,
  CONSTRAINT `facturacion_tickets_vehiculo_id_foreign` FOREIGN KEY (`vehiculo_id`) REFERENCES `vehiculos` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `facturacion_tickets`
--

LOCK TABLES `facturacion_tickets` WRITE;
/*!40000 ALTER TABLE `facturacion_tickets` DISABLE KEYS */;
INSERT INTO `facturacion_tickets` VALUES (1,'7012cae4c5339412d3f405d77daf4f0c451051240315de105a99a75b4568a919','uploads/tickets/2025/12/pdkdw08slfys64h9g8p22o2o.jpg','image',115654,0,'OCR_LISTO','ABC123',307850.00,'2025-12-15 21:33:12',NULL,NULL,307850.00,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,89,NULL,1,3,2,'RTM-20251215163218','Liviano Particular','BCD123','RTM','RTM (Revisión Técnico Mecánica)','Ibagué','María Sánchez','FACHADA','Fachada',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'TICKET\nTOTAL: 307850\nPLACA: ABC123\nFECHA: 2025-12-15T21:33:12.791+00:00',0.86,0.92,0.78,0.55,0,0,0,NULL,NULL,NULL,0,0.00,0,NULL,NULL,1,'2025-12-15 21:37:09','2025-12-15 21:38:12'),(2,'d3f1ee7c5736849854205558c4ccc9ca3dab0120226bd241f07e5b345f902b9c','uploads/tickets/2025/12/l77gxzc1cizhx7pf6nkpdpe1.jpg','image',115025,0,'OCR_LISTO','QQX91C',307850.00,'2025-12-15 21:40:46',NULL,NULL,307850.00,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,90,NULL,1,4,3,'RTM-20251215164056','Liviano Particular','CCC222','RTM','RTM (Revisión Técnico Mecánica)','Ibagué','Admin Sistema','FACHADA','Fachada',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'TICKET\nTOTAL: 307850\nPLACA: QQX91C\nFECHA: 2025-12-15T21:40:46.762+00:00',0.86,0.92,0.78,0.55,0,0,0,NULL,NULL,NULL,0,0.00,0,NULL,NULL,1,'2025-12-15 21:41:06','2025-12-15 21:45:46'),(3,'f619025be8c3464772d2723a75932c6bf11b1249cb11aa4934d40b5a37afec83','uploads/tickets/2025/12/xq93tykfjg0t8wroa8aofaah.jpg','image',82616,0,'CONFIRMADA','AVC332',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,91,NULL,3,1,1,'PERI-20251215164605','Liviano Particular','AVC332','PERI','Peritaje','Bogotá','Carlos Rodríguez','FACHADA','Fachada',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0.00,0.00,0.00,0.00,0,0,0,NULL,'2025-12-15 21:47:57',3,0,0.00,0,NULL,NULL,3,'2025-12-15 21:47:55','2025-12-15 21:47:57'),(4,'f619025be8c3464772d2723a75932c6bf11b1249cb11aa4934d40b5a37afec83','uploads/tickets/2025/12/u7lwwa5fn3kowjyh4knfsb7i.jpg','image',82616,0,'CONFIRMADA','RRR123',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,92,NULL,3,2,2,'PERI-20251215164830','Liviano Particular','RRR123','PERI','Peritaje','Bogotá','Carlos Rodríguez','FACHADA','Fachada',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0.00,0.00,0.00,0.00,0,0,0,NULL,'2025-12-15 22:09:37',1,0,0.00,0,NULL,NULL,1,'2025-12-15 22:09:35','2025-12-15 22:09:37'),(5,'f94c349e2715570c30bfef41d8f8d2790cafbc93664ee457abdd1dedaf1e5464','uploads/tickets/2025/12/k0ltq6lbnhvubqr49y5jxt0w.jpg','image',102858,0,'CONFIRMADA','123RTY',307850.00,'2025-10-28 17:07:11',267686.00,28164.00,307850.00,'222.222.222.222','3381154966 TE9','CHEVROLET AVEO L','ERIKA PAOLA USECHE GONZALEZ',NULL,NULL,NULL,NULL,NULL,1,93,NULL,1,1,1,'RTM-20251216085628','Motocicleta','123RTY','RTM','RTM (Revisión Técnico Mecánica)','Bogotá','Carlos Rodríguez','FACHADA','Fachada',NULL,NULL,NULL,NULL,'FV','1987',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'TICKET\nTOTAL: 90000\nPLACA: QQX91C\nFECHA: 2025-12-16T14:06:51.205+00:00',0.86,0.92,0.78,0.55,0,0,0,NULL,'2025-12-16 14:11:53',3,0,0.00,0,NULL,NULL,3,'2025-12-16 13:56:45','2025-12-16 14:11:53'),(6,'ea59c4808a548d06d6f12864198ce0063752efbfa4514da974b0d946cc6d66ee','uploads/tickets/2025/12/w32p6w4zkdikbyosaewymwze.jpg','image',118050,0,'CONFIRMADA','BBB222',307850.00,'2025-10-28 17:08:54',267686.00,28164.00,307850.00,'222.222.222.222','3301154969 TES','HONDA CR V 2.4L SDR 24D LX CVT','ERIKA PAOLA USECHE GONZALEZ',NULL,NULL,NULL,NULL,NULL,4,94,NULL,1,1,1,'RTM-20251216091244','Liviano Particular','BBB222','RTM','RTM (Revisión Técnico Mecánica)','Activa Marketing','puerta prueba','FACHADA','Fachada',NULL,NULL,NULL,NULL,'FV','1986',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'TICKET\nTOTAL: 307850\nPLACA: ABC123\nFECHA: 2025-12-16T14:08:15.189+00:00',0.86,0.92,0.78,0.55,0,0,0,NULL,'2025-12-16 14:13:26',21,0,0.00,0,NULL,NULL,21,'2025-12-16 14:13:14','2025-12-16 14:13:26'),(7,'f619025be8c3464772d2723a75932c6bf11b1249cb11aa4934d40b5a37afec83','uploads/tickets/2025/12/zo69s2o2pw5euzibqaxt2sqe.jpg','image',82616,0,'CONFIRMADA','BBB222',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,4,95,NULL,3,2,1,'PERI-20251216091352','Liviano Particular','BBB222','PERI','Peritaje','Activa Marketing','puerta prueba','FACHADA','Fachada',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0.00,0.00,0.00,0.00,0,0,0,NULL,'2025-12-16 14:14:04',21,0,0.00,0,NULL,NULL,21,'2025-12-16 14:14:00','2025-12-16 14:14:04'),(8,'2f3b2daac98fba891467dcc02f96dc829591f195dc2c4ad846ea2b2f5468043b','uploads/tickets/2025/12/qo5onax5afkvtc14op64cd1i.jpg','image',113804,0,'CONFIRMADA','ASD123',206464.00,'2025-10-28 17:06:29',182408.00,24056.00,206464.00,'222.222.222.222','3301154971 T19','KYMCO AGILITY RS NAKED','ERIKA PAOLA USECHE GONZALEZ',NULL,NULL,NULL,NULL,8,1,97,40,1,2,2,'RTM-20251216150209','Motocicleta','ASD123','RTM','RTM (Revisión Técnico Mecánica)','Bogotá','puerta prueba','ASESOR','Asesor Comercial','ASESOR_COMERCIAL','prueba flujo  completo',NULL,'Carolina Rojas','FV','1988',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'TICKET\nTOTAL: 150000\nPLACA: QQX91C\nFECHA: 2025-12-16T20:02:06.116+00:00',0.86,0.92,0.78,0.55,0,0,0,NULL,'2025-12-16 20:07:10',21,0,0.00,0,NULL,NULL,21,'2025-12-16 20:07:05','2025-12-16 20:07:10'),(9,'044eea3898f8120d98328848c40d45144ed01ba5fce28e40440469ce1d4ae2db','uploads/tickets/2025/12/icks76wojup9c29mwapkvigx.jpg','image',99881,0,'CONFIRMADA','QWE123',307550.00,'2025-10-28 17:05:50',267386.00,240164.00,307550.00,'222.222.222.222','3301154991 T11','KYMCO AGILITY RS NAKED','ERIKA PAOLA USECHE GONZALEZ',NULL,NULL,NULL,NULL,8,1,98,41,1,3,3,'RTM-20251216150858','Liviano Particular','QWE123','RTM','RTM (Revisión Técnico Mecánica)','Bogotá','puerta prueba','ASESOR','Asesor Comercial','ASESOR_COMERCIAL','prueba flujo  completo',NULL,'prueba  convenio','FV','1989',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'TICKET\nTOTAL: 307850\nPLACA: FDS456\nFECHA: 2025-12-16T20:05:35.593+00:00',0.86,0.92,0.78,0.55,0,0,0,NULL,'2025-12-16 20:10:41',21,0,0.00,0,NULL,NULL,21,'2025-12-16 20:09:14','2025-12-16 20:10:41'),(10,'c9c461f269893673183e8674bd952c7ae7e7f1bba6db202e808dcfa1fd4bc050','uploads/tickets/2025/12/p5pa17ox9gvrftlb1sq0g3oa.png','image',7767,0,'CONFIRMADA','QWE123',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,8,1,99,41,3,4,1,'PERI-20251216152800','Liviano Particular','QWE123','PERI','Peritaje','Bogotá','puerta prueba','ASESOR','Asesor Comercial','ASESOR_COMERCIAL','prueba flujo  completo',NULL,'prueba  convenio',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0.00,0.00,0.00,0.00,0,0,0,NULL,'2025-12-16 20:28:09',21,0,0.00,0,NULL,NULL,21,'2025-12-16 20:28:07','2025-12-16 20:28:09'),(11,'4efb82719f68c0ae0fa85c95b17ddad3df26bc5ebae45a8d5ca7bbadc683cce8','uploads/tickets/2025/12/a4djvm38u6yaw1rhsdf5615j.jpg','image',6510,0,'CONFIRMADA','DDD222',307850.00,'2025-10-28 17:02:54',267686.00,248164.00,307850.00,'222.222.222.222','3381155864 T13','CHEVROLET N208','ERIKA PAOLA USECHE GONZALEZ',NULL,NULL,NULL,NULL,8,3,100,42,1,1,1,'RTM-20251216160637','Liviano Particular','DDD222','RTM','RTM (Revisión Técnico Mecánica)','Cemoto','puerta prueba','ASESOR','Asesor Comercial','ASESOR_COMERCIAL','prueba flujo  completo',NULL,NULL,'FV','1991',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'TICKET\nTOTAL: 307850\nPLACA: ABC123\nFECHA: 2025-12-16T21:02:22.158+00:00',0.86,0.92,0.78,0.55,0,0,0,NULL,'2025-12-16 21:07:37',21,0,0.00,0,NULL,NULL,21,'2025-12-16 21:07:10','2025-12-16 21:07:37'),(12,'414a2bd4560714bfb1d6d127432d069e07916c586aa0006a446143929df94e6f','uploads/tickets/2025/12/hol60qny5yo8b1rg0vaxt600.jpg','image',97871,0,'CONFIRMADA','PPP333',307850.00,'2025-10-28 17:02:54',267686.00,248164.00,307850.00,'222.222.222.222','3381155864 T13','CHEVROLET N208','ERIKA PAOLA USECHE GONZALEZ',NULL,NULL,NULL,NULL,NULL,4,101,NULL,1,4,3,'RTM-20251216162107','Liviano Particular','PPP333','RTM','RTM (Revisión Técnico Mecánica)','Activa Marketing','ingeniero  prueba','FACHADA','Fachada',NULL,NULL,NULL,NULL,'FV','1991',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'TICKET\nTOTAL: 307850\nPLACA: ABC123\nFECHA: 2025-12-16T21:16:52.083+00:00',0.86,0.92,0.78,0.55,0,0,0,NULL,'2025-12-16 21:21:54',26,0,0.00,0,NULL,NULL,26,'2025-12-16 21:21:51','2025-12-16 21:21:54');
/*!40000 ALTER TABLE `facturacion_tickets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `items`
--

DROP TABLE IF EXISTS `items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `items` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ruta` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `descripcion` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `items_nombre_unique` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `items`
--

LOCK TABLES `items` WRITE;
/*!40000 ALTER TABLE `items` DISABLE KEYS */;
INSERT INTO `items` VALUES (1,'Gestión Documental','/documental','Módulo para registrar y consultar documentación del personal','2025-12-15 18:59:14','2025-12-15 18:59:14'),(2,'Contratos','/contratos','Visualización y seguimiento de contratos por usuario','2025-12-15 18:59:14','2025-12-15 18:59:14'),(3,'Usuarios','/usuarios','Administración de usuarios del sistema','2025-12-15 18:59:14','2025-12-15 18:59:14'),(4,'Permisos','/permisos','Configuración de roles, permisos y accesos','2025-12-15 18:59:14','2025-12-15 18:59:14');
/*!40000 ALTER TABLE `items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permiso_items`
--

DROP TABLE IF EXISTS `permiso_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `permiso_items` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `item_id` int unsigned DEFAULT NULL,
  `permiso_id` int unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `permiso_items_item_id_foreign` (`item_id`),
  KEY `permiso_items_permiso_id_foreign` (`permiso_id`),
  CONSTRAINT `permiso_items_item_id_foreign` FOREIGN KEY (`item_id`) REFERENCES `items` (`id`) ON DELETE CASCADE,
  CONSTRAINT `permiso_items_permiso_id_foreign` FOREIGN KEY (`permiso_id`) REFERENCES `permisos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permiso_items`
--

LOCK TABLES `permiso_items` WRITE;
/*!40000 ALTER TABLE `permiso_items` DISABLE KEYS */;
INSERT INTO `permiso_items` VALUES (1,1,1,'2025-12-15 18:59:14','2025-12-15 18:59:14'),(2,1,2,'2025-12-15 18:59:14','2025-12-15 18:59:14'),(3,1,3,'2025-12-15 18:59:14','2025-12-15 18:59:14'),(4,2,1,'2025-12-15 18:59:14','2025-12-15 18:59:14'),(5,2,2,'2025-12-15 18:59:14','2025-12-15 18:59:14'),(6,2,3,'2025-12-15 18:59:14','2025-12-15 18:59:14'),(7,3,1,'2025-12-15 18:59:14','2025-12-15 18:59:14'),(8,3,2,'2025-12-15 18:59:14','2025-12-15 18:59:14'),(9,3,3,'2025-12-15 18:59:14','2025-12-15 18:59:14'),(10,3,4,'2025-12-15 18:59:14','2025-12-15 18:59:14'),(11,4,1,'2025-12-15 18:59:14','2025-12-15 18:59:14'),(12,4,3,'2025-12-15 18:59:14','2025-12-15 18:59:14');
/*!40000 ALTER TABLE `permiso_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permisos`
--

DROP TABLE IF EXISTS `permisos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `permisos` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `permisos_nombre_unique` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permisos`
--

LOCK TABLES `permisos` WRITE;
/*!40000 ALTER TABLE `permisos` DISABLE KEYS */;
INSERT INTO `permisos` VALUES (1,'ver','Permite visualizar registros','2025-12-15 18:59:14','2025-12-15 18:59:14'),(2,'crear','Permite crear nuevos registros','2025-12-15 18:59:14','2025-12-15 18:59:14'),(3,'editar','Permite modificar registros existentes','2025-12-15 18:59:14','2025-12-15 18:59:14'),(4,'eliminar','Permite borrar registros','2025-12-15 18:59:14','2025-12-15 18:59:14');
/*!40000 ALTER TABLE `permisos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `prospectos`
--

DROP TABLE IF EXISTS `prospectos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `prospectos` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `convenio_id` int unsigned DEFAULT NULL,
  `placa` varchar(12) COLLATE utf8mb4_unicode_ci NOT NULL,
  `telefono` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nombre` varchar(120) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cedula` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `observaciones` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `soat_vigente` tinyint(1) NOT NULL DEFAULT '0',
  `soat_vencimiento` date DEFAULT NULL,
  `tecno_vigente` tinyint(1) NOT NULL DEFAULT '0',
  `tecno_vencimiento` date DEFAULT NULL,
  `preventiva_vigente` tinyint(1) NOT NULL DEFAULT '0',
  `preventiva_vencimiento` date DEFAULT NULL,
  `peritaje_ultima_fecha` date DEFAULT NULL,
  `origen` enum('IMPORT','CAMPO','EVENTO','OTRO') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'OTRO',
  `creado_por` int unsigned DEFAULT NULL,
  `archivado` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `prospectos_creado_por_foreign` (`creado_por`),
  KEY `prospectos_convenio_id_index` (`convenio_id`),
  KEY `prospectos_placa_index` (`placa`),
  KEY `prospectos_telefono_index` (`telefono`),
  KEY `prospectos_cedula_index` (`cedula`),
  KEY `prospectos_soat_vigente_soat_vencimiento_index` (`soat_vigente`,`soat_vencimiento`),
  KEY `prospectos_tecno_vigente_tecno_vencimiento_index` (`tecno_vigente`,`tecno_vencimiento`),
  KEY `prospectos_preventiva_vigente_preventiva_vencimiento_index` (`preventiva_vigente`,`preventiva_vencimiento`),
  KEY `prospectos_origen_index` (`origen`),
  KEY `prospectos_archivado_index` (`archivado`),
  CONSTRAINT `prospectos_convenio_id_foreign` FOREIGN KEY (`convenio_id`) REFERENCES `convenios` (`id`) ON DELETE SET NULL,
  CONSTRAINT `prospectos_creado_por_foreign` FOREIGN KEY (`creado_por`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=54 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `prospectos`
--

LOCK TABLES `prospectos` WRITE;
/*!40000 ALTER TABLE `prospectos` DISABLE KEYS */;
INSERT INTO `prospectos` VALUES (1,NULL,'VAW095','3937202380','Carlos Gómez','91198005','Prospecto demo',1,'2026-10-24',1,'2026-09-02',0,'2025-09-14','2025-04-07','CAMPO',15,0,'2025-12-11 00:00:00','2025-12-11 00:00:00'),(2,NULL,'ZUJ786','3581215686','Carlos Hernández','99395379','Prospecto demo',1,'2026-05-19',1,'2026-02-17',1,'2026-04-28','2025-05-26','EVENTO',15,0,'2025-11-24 00:00:00','2025-11-24 00:00:00'),(3,NULL,'ZZN617','3348888842','Luis Pérez','20432571',NULL,0,'2025-07-27',0,'2025-12-07',1,'2026-08-01',NULL,'CAMPO',17,0,'2025-11-28 00:00:00','2025-11-28 00:00:00'),(4,NULL,'CEM652','3766460088','María López','42640312',NULL,0,'2025-06-29',1,'2026-10-03',1,'2026-09-02','2025-05-18','EVENTO',17,0,'2025-11-17 00:00:00','2025-11-17 00:00:00'),(5,NULL,'ZNC200','3443333325','Andrés Hernández','55371638',NULL,1,'2026-08-05',1,'2026-08-31',0,'2025-10-20','2025-10-28','EVENTO',13,0,'2025-11-05 00:00:00','2025-11-05 00:00:00'),(6,NULL,'FJR493','3433938273','Carlos Gómez','48116919',NULL,0,'2025-12-03',0,'2025-08-25',0,'2025-07-27','2025-04-05','OTRO',13,0,'2025-12-12 00:00:00','2025-12-12 00:00:00'),(7,NULL,'TWG135','3921202384','Andrés Rodríguez','12908256','Prospecto demo',0,'2025-11-11',1,'2026-05-22',1,'2026-05-06',NULL,'EVENTO',14,0,'2025-11-23 00:00:00','2025-11-23 00:00:00'),(8,NULL,'EGH588','3683287510','Ana Gómez','41330556','Prospecto demo',0,'2025-11-24',0,'2025-11-21',0,'2025-09-19',NULL,'EVENTO',17,0,'2025-12-13 00:00:00','2025-12-13 00:00:00'),(9,NULL,'VSP843','3563592530','Sofía Pérez','36532688',NULL,1,'2026-01-09',1,'2026-09-15',1,'2026-04-19','2025-11-27','OTRO',14,0,'2025-11-25 00:00:00','2025-11-25 00:00:00'),(10,NULL,'YLP544','3902234278','María Hernández','53065964',NULL,0,'2025-07-21',1,'2026-02-23',0,'2025-06-22','2025-12-05','CAMPO',15,0,'2025-12-13 00:00:00','2025-12-13 00:00:00'),(11,NULL,'VJC219','3450603391','María Rodríguez','92843081','Prospecto demo',1,'2026-06-29',1,'2026-08-06',1,'2026-03-07',NULL,'OTRO',17,0,'2025-11-28 00:00:00','2025-11-28 00:00:00'),(12,NULL,'BGN336','3644291351','Andrés Hernández','87151621',NULL,0,'2025-06-25',0,'2025-07-09',0,'2025-11-17',NULL,'OTRO',19,0,'2025-12-15 00:00:00','2025-12-15 00:00:00'),(13,NULL,'CYS402','3274425616','Ana López','43528083',NULL,1,'2026-10-03',1,'2026-02-19',1,'2026-09-18','2025-05-08','IMPORT',18,0,'2025-12-09 00:00:00','2025-12-09 00:00:00'),(14,NULL,'LCB313','3320823704','Camila López','18637464','Prospecto demo',1,'2026-06-25',1,'2026-06-30',0,'2025-08-04','2025-10-06','EVENTO',18,0,'2025-11-10 00:00:00','2025-11-10 00:00:00'),(15,NULL,'BZF332','3947652456','Carlos Rodríguez','30079869',NULL,0,'2025-08-07',1,'2026-07-19',1,'2026-02-20','2025-07-17','CAMPO',15,0,'2025-11-30 00:00:00','2025-11-30 00:00:00'),(16,NULL,'CUA927','3416977410','Julián Hernández','21321587',NULL,0,'2025-10-25',1,'2026-07-01',0,'2025-11-08','2025-08-15','OTRO',18,0,'2025-11-11 00:00:00','2025-11-11 00:00:00'),(17,NULL,'URN820','3425735219','Ana Hernández','14476765',NULL,1,'2026-03-19',1,'2026-08-25',0,'2025-06-20',NULL,'CAMPO',13,0,'2025-11-30 00:00:00','2025-11-30 00:00:00'),(18,NULL,'LXK437','3736808172','Sofía Pérez','57565643','Prospecto demo',1,'2026-06-25',1,'2026-03-25',1,'2026-07-16','2024-12-14','OTRO',16,0,'2025-11-11 00:00:00','2025-11-11 00:00:00'),(19,NULL,'EDY241','3349110391','Sofía Gómez','43066688',NULL,0,'2025-11-05',1,'2026-10-10',1,'2026-06-08','2025-11-11','IMPORT',19,0,'2025-11-22 00:00:00','2025-11-22 00:00:00'),(20,NULL,'MDC591','3139094240','Carlos Gómez','67217987',NULL,1,'2026-01-07',0,'2025-09-02',1,'2026-07-13','2025-01-30','CAMPO',14,0,'2025-11-25 00:00:00','2025-11-25 00:00:00'),(21,NULL,'MYP027','3329472110','Pedro Martínez','17014142',NULL,1,'2026-08-19',0,'2025-08-30',1,'2026-04-08','2025-06-09','EVENTO',14,0,'2025-11-19 00:00:00','2025-11-19 00:00:00'),(22,NULL,'PJP748','3210825418','Carlos Gómez','35931930',NULL,0,'2025-08-26',0,'2025-10-12',0,'2025-10-05',NULL,'OTRO',16,0,'2025-11-25 00:00:00','2025-11-25 00:00:00'),(23,NULL,'WZC062','3191264968','Sofía Hernández','13121257','Prospecto demo',1,'2026-07-04',0,'2025-09-01',1,'2026-02-27','2025-11-24','OTRO',14,0,'2025-11-03 00:00:00','2025-11-03 00:00:00'),(24,NULL,'YMT682','3240524861','Andrés Martínez','33121789',NULL,1,'2026-05-12',0,'2025-07-21',1,'2026-07-10','2025-08-18','EVENTO',13,0,'2025-11-17 00:00:00','2025-11-17 00:00:00'),(25,NULL,'HVV295','3812181320','Julián Rodríguez','66035265',NULL,0,'2025-12-06',1,'2026-10-10',0,'2025-07-23','2025-04-27','OTRO',17,0,'2025-12-04 00:00:00','2025-12-04 00:00:00'),(26,NULL,'UCT416','3882213750','Luis Rodríguez','65016128',NULL,0,'2025-09-05',1,'2026-06-02',0,'2025-09-28','2025-03-25','OTRO',13,0,'2025-11-28 00:00:00','2025-11-28 00:00:00'),(27,NULL,'BYD440','3137729848','Julián López','33580082','Prospecto demo',1,'2026-05-07',0,'2025-08-30',0,'2025-07-14','2025-09-11','OTRO',17,0,'2025-12-06 00:00:00','2025-12-06 00:00:00'),(28,NULL,'TUA281','3439521767','Carlos Martínez','54481710',NULL,0,'2025-10-06',1,'2026-08-22',1,'2026-03-20','2024-12-16','OTRO',14,0,'2025-11-04 00:00:00','2025-11-04 00:00:00'),(29,NULL,'NKP777','3117639918','María Rodríguez','95098872',NULL,0,'2025-10-18',1,'2026-01-26',1,'2026-10-26',NULL,'EVENTO',16,0,'2025-11-25 00:00:00','2025-11-25 00:00:00'),(30,NULL,'GFZ104','3667847939','Julián Gómez','69837159',NULL,1,'2026-07-17',1,'2026-05-17',1,'2026-08-01','2025-11-02','EVENTO',13,0,'2025-12-14 00:00:00','2025-12-14 00:00:00'),(31,NULL,'VKL641','3691486778','Luis Martínez','65535085',NULL,0,'2025-10-28',0,'2025-09-30',1,'2026-08-24',NULL,'IMPORT',15,0,'2025-12-09 00:00:00','2025-12-09 00:00:00'),(32,NULL,'JFH829','3623023778','Sofía Pérez','14672692','Prospecto demo',0,'2025-08-03',1,'2026-09-29',1,'2026-03-15',NULL,'IMPORT',16,0,'2025-12-07 00:00:00','2025-12-07 00:00:00'),(33,NULL,'DHS174','3346943262','María Rodríguez','32342393','Prospecto demo',1,'2026-05-14',1,'2026-04-24',1,'2026-04-18',NULL,'CAMPO',14,0,'2025-11-13 00:00:00','2025-11-13 00:00:00'),(34,NULL,'WCV542','3472041172','Luis Rodríguez','78050921','Prospecto demo',0,'2025-09-20',0,'2025-10-31',0,'2025-10-01',NULL,'EVENTO',16,0,'2025-12-11 00:00:00','2025-12-11 00:00:00'),(35,NULL,'TLG637','3586851852','Carlos Pérez','49318845',NULL,0,'2025-07-27',0,'2025-09-23',0,'2025-10-18','2025-10-21','CAMPO',16,0,'2025-12-04 00:00:00','2025-12-04 00:00:00'),(36,NULL,'PFW145','3357127617','Sofía Rodríguez','96362669','Prospecto demo',0,'2025-06-18',0,'2025-10-04',0,'2025-10-13','2024-11-24','IMPORT',16,0,'2025-12-09 00:00:00','2025-12-09 00:00:00'),(37,NULL,'AUW037','3800700202','Laura Pérez','85939843','Prospecto demo',1,'2026-09-26',1,'2026-04-28',0,'2025-08-10','2024-12-12','EVENTO',13,0,'2025-11-14 00:00:00','2025-11-14 00:00:00'),(38,NULL,'SWB691','3332285108','Pedro Rodríguez','97523146',NULL,0,'2025-07-22',0,'2025-06-20',0,'2025-10-21',NULL,'CAMPO',15,0,'2025-11-08 00:00:00','2025-11-08 00:00:00'),(39,NULL,'RUD526','3495244684','Camila Pérez','67822879',NULL,1,'2026-06-12',1,'2026-04-04',0,'2025-09-19','2025-03-28','EVENTO',15,0,'2025-12-08 00:00:00','2025-12-08 00:00:00'),(40,NULL,'DVV248','3231828851','Julián Rodríguez','39644156',NULL,0,'2025-07-02',0,'2025-06-19',1,'2026-04-14',NULL,'CAMPO',16,0,'2025-11-14 00:00:00','2025-11-14 00:00:00'),(41,NULL,'GGA063','3776938726','María Hernández','67636048',NULL,1,'2026-02-21',1,'2026-02-19',0,'2025-12-10','2025-12-04','CAMPO',19,0,'2025-11-10 00:00:00','2025-11-10 00:00:00'),(42,NULL,'USV712','3241019259','Laura López','26963120','Prospecto demo',0,'2025-08-16',0,'2025-07-18',0,'2025-09-15',NULL,'CAMPO',17,0,'2025-11-01 00:00:00','2025-11-01 00:00:00'),(43,NULL,'YRV724','3727758105','Sofía Pérez','45539319',NULL,1,'2026-08-01',1,'2026-07-03',1,'2026-02-10',NULL,'EVENTO',19,0,'2025-11-02 00:00:00','2025-11-02 00:00:00'),(44,NULL,'ELB620','3213213213213','Camila Rodríguez','72839246',NULL,0,'2026-07-07',1,'2026-10-24',0,'2025-09-07','2024-12-30','IMPORT',13,0,'2025-12-13 00:00:00','2025-12-16 20:29:52'),(45,NULL,'BUN160','3937041202','Laura Hernández','55159898',NULL,1,'2026-03-15',1,'2026-05-07',1,'2026-03-01','2025-10-07','OTRO',17,0,'2025-11-17 00:00:00','2025-11-17 00:00:00'),(46,NULL,'UMZ750','3542698264','Camila Gómez','96373475',NULL,1,'2026-06-08',1,'2026-06-22',0,'2025-07-05','2025-01-02','OTRO',14,0,'2025-12-05 00:00:00','2025-12-05 00:00:00'),(47,NULL,'KKD526','3916733422','Sofía Martínez','89825941',NULL,0,'2025-09-03',0,'2025-07-14',1,'2026-03-07','2025-09-04','EVENTO',18,0,'2025-11-21 00:00:00','2025-11-21 00:00:00'),(48,NULL,'MKU050','3307594274','Andrés López','34989021',NULL,0,'2025-08-23',0,'2025-09-02',1,'2026-02-09','2025-11-15','CAMPO',18,0,'2025-12-11 00:00:00','2025-12-16 21:02:09'),(49,NULL,'YNT103','3480421919','Laura Hernández','90702347',NULL,1,'2026-03-25',0,'2025-10-07',0,'2025-11-22','2024-11-21','OTRO',18,0,'2025-11-17 00:00:00','2025-11-17 00:00:00'),(50,NULL,'TLN831','3568379731','Luis López','75350188','Prospecto demo',0,'2025-11-18',1,'2026-08-06',1,'2026-09-11',NULL,'CAMPO',13,0,'2025-11-02 00:00:00','2025-11-02 00:00:00'),(51,NULL,'BBB333','33332123','Prueba de prospecto','12333123',NULL,0,'2025-12-12',0,'2025-12-25',0,'2025-12-04','2025-12-10','OTRO',20,1,'2025-12-15 20:30:36','2025-12-16 14:22:18'),(52,NULL,'ASD123','5233213','Mariscal','543543','das',0,'2025-12-19',0,'2025-12-26',0,'2025-12-17',NULL,'OTRO',20,1,'2025-12-16 20:00:11','2025-12-16 20:00:11'),(53,NULL,'FFF222','234234324','dasdsad','2434234324','dsad',0,'2025-12-11',0,NULL,0,'2025-12-18','2025-12-02','OTRO',24,0,'2025-12-16 20:24:24','2025-12-16 21:09:49');
/*!40000 ALTER TABLE `prospectos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `razon_social`
--

DROP TABLE IF EXISTS `razon_social`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `razon_social` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nit` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `razon_social_nombre_unique` (`nombre`),
  UNIQUE KEY `razon_social_nit_unique` (`nit`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `razon_social`
--

LOCK TABLES `razon_social` WRITE;
/*!40000 ALTER TABLE `razon_social` DISABLE KEYS */;
INSERT INTO `razon_social` VALUES (1,'CDA del Centro','900123456-7',1,'2025-12-15 18:59:14','2025-12-15 18:59:14'),(2,'CDA Activa','901234567-8',1,'2025-12-15 18:59:14','2025-12-15 18:59:14'),(3,'JEF & CO','902345678-9',1,'2025-12-15 18:59:14','2025-12-15 18:59:14'),(4,'Activa Marketing','903456789-0',1,'2025-12-15 18:59:14','2025-12-15 18:59:14');
/*!40000 ALTER TABLE `razon_social` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rol_permiso_items`
--

DROP TABLE IF EXISTS `rol_permiso_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rol_permiso_items` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `rol_id` int unsigned DEFAULT NULL,
  `permiso_item_id` int unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `rol_permiso_items_rol_id_foreign` (`rol_id`),
  KEY `rol_permiso_items_permiso_item_id_foreign` (`permiso_item_id`),
  CONSTRAINT `rol_permiso_items_permiso_item_id_foreign` FOREIGN KEY (`permiso_item_id`) REFERENCES `permiso_items` (`id`) ON DELETE CASCADE,
  CONSTRAINT `rol_permiso_items_rol_id_foreign` FOREIGN KEY (`rol_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rol_permiso_items`
--

LOCK TABLES `rol_permiso_items` WRITE;
/*!40000 ALTER TABLE `rol_permiso_items` DISABLE KEYS */;
INSERT INTO `rol_permiso_items` VALUES (1,1,1,'2025-12-15 18:59:14','2025-12-15 18:59:14'),(2,1,2,'2025-12-15 18:59:14','2025-12-15 18:59:14'),(3,1,3,'2025-12-15 18:59:14','2025-12-15 18:59:14'),(4,1,4,'2025-12-15 18:59:14','2025-12-15 18:59:14'),(5,1,5,'2025-12-15 18:59:14','2025-12-15 18:59:14'),(6,1,6,'2025-12-15 18:59:14','2025-12-15 18:59:14'),(7,1,7,'2025-12-15 18:59:14','2025-12-15 18:59:14'),(8,1,8,'2025-12-15 18:59:14','2025-12-15 18:59:14'),(9,1,9,'2025-12-15 18:59:14','2025-12-15 18:59:14'),(10,1,10,'2025-12-15 18:59:14','2025-12-15 18:59:14'),(11,1,11,'2025-12-15 18:59:14','2025-12-15 18:59:14'),(12,1,12,'2025-12-15 18:59:14','2025-12-15 18:59:14'),(13,2,1,'2025-12-15 18:59:14','2025-12-15 18:59:14'),(14,2,2,'2025-12-15 18:59:14','2025-12-15 18:59:14'),(15,2,3,'2025-12-15 18:59:14','2025-12-15 18:59:14'),(16,2,4,'2025-12-15 18:59:14','2025-12-15 18:59:14'),(17,2,5,'2025-12-15 18:59:14','2025-12-15 18:59:14'),(18,2,6,'2025-12-15 18:59:14','2025-12-15 18:59:14'),(19,2,7,'2025-12-15 18:59:14','2025-12-15 18:59:14'),(20,2,8,'2025-12-15 18:59:14','2025-12-15 18:59:14'),(21,2,9,'2025-12-15 18:59:14','2025-12-15 18:59:14'),(22,3,4,'2025-12-15 18:59:14','2025-12-15 18:59:14'),(23,4,1,'2025-12-15 18:59:14','2025-12-15 18:59:14');
/*!40000 ALTER TABLE `rol_permiso_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `roles_nombre_unique` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'SUPER_ADMIN','2025-12-15 18:59:14','2025-12-15 18:59:14'),(2,'GERENCIA','2025-12-15 18:59:14','2025-12-15 18:59:14'),(3,'COMERCIAL','2025-12-15 18:59:14','2025-12-15 18:59:14'),(4,'CONTABILIDAD','2025-12-15 18:59:14','2025-12-15 18:59:14'),(5,'TALENTO_HUMANO','2025-12-15 18:59:14','2025-12-15 18:59:14'),(6,'OPERATIVO_TURNOS','2025-12-15 18:59:14','2025-12-15 18:59:14');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sedes`
--

DROP TABLE IF EXISTS `sedes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sedes` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `razon_social_id` int unsigned NOT NULL,
  `ciudad_id` int unsigned NOT NULL,
  `nombre` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `direccion` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `timezone` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'America/Bogota',
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `sedes_razon_social_id_nombre_unique` (`razon_social_id`,`nombre`),
  KEY `sedes_ciudad_id_index` (`ciudad_id`),
  KEY `sedes_razon_social_id_index` (`razon_social_id`),
  CONSTRAINT `sedes_ciudad_id_foreign` FOREIGN KEY (`ciudad_id`) REFERENCES `ciudades` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `sedes_razon_social_id_foreign` FOREIGN KEY (`razon_social_id`) REFERENCES `razon_social` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sedes`
--

LOCK TABLES `sedes` WRITE;
/*!40000 ALTER TABLE `sedes` DISABLE KEYS */;
INSERT INTO `sedes` VALUES (1,2,2,'Bogotá',NULL,'America/Bogota',1,'2025-12-15 18:59:14','2025-12-15 18:59:14'),(2,1,1,'Ibagué',NULL,'America/Bogota',1,'2025-12-15 18:59:14','2025-12-15 18:59:14'),(3,3,2,'Cemoto',NULL,'America/Bogota',1,'2025-12-15 18:59:14','2025-12-15 18:59:14'),(4,4,2,'Activa Marketing',NULL,'America/Bogota',1,'2025-12-15 18:59:14','2025-12-15 18:59:14');
/*!40000 ALTER TABLE `sedes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `servicios`
--

DROP TABLE IF EXISTS `servicios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `servicios` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `codigo_servicio` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nombre_servicio` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `servicios_codigo_servicio_unique` (`codigo_servicio`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `servicios`
--

LOCK TABLES `servicios` WRITE;
/*!40000 ALTER TABLE `servicios` DISABLE KEYS */;
INSERT INTO `servicios` VALUES (1,'RTM','RTM (Revisión Técnico Mecánica)','2025-12-15 18:59:15','2025-12-15 18:59:15'),(2,'PREV','Preventiva','2025-12-15 18:59:15','2025-12-15 18:59:15'),(3,'PERI','Peritaje','2025-12-15 18:59:15','2025-12-15 18:59:15'),(4,'SOAT','SOAT','2025-12-15 18:59:15','2025-12-15 18:59:15');
/*!40000 ALTER TABLE `servicios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `turnos_rtms`
--

DROP TABLE IF EXISTS `turnos_rtms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `turnos_rtms` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `funcionario_id` int unsigned NOT NULL,
  `sede_id` int unsigned NOT NULL,
  `servicio_id` int unsigned NOT NULL,
  `vehiculo_id` int unsigned DEFAULT NULL,
  `cliente_id` int unsigned DEFAULT NULL,
  `clase_vehiculo_id` int unsigned DEFAULT NULL,
  `conductor_id` int unsigned DEFAULT NULL,
  `agente_captacion_id` int unsigned DEFAULT NULL,
  `captacion_dateo_id` int unsigned DEFAULT NULL,
  `fecha` date NOT NULL,
  `hora_ingreso` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `hora_salida` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tiempo_servicio` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tiene_facturacion` tinyint(1) NOT NULL DEFAULT '0',
  `hora_facturacion` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `turno_numero` int NOT NULL,
  `turno_numero_servicio` int NOT NULL,
  `turno_codigo` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `placa` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tipo_vehiculo` enum('Liviano Particular','Liviano Taxi','Liviano Público','Motocicleta') COLLATE utf8mb4_unicode_ci NOT NULL,
  `medio_entero` enum('Redes Sociales','Convenio o Referido Externo','Call Center','Fachada','Referido Interno','Asesor Comercial') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `observaciones` text COLLATE utf8mb4_unicode_ci,
  `canal_atribucion` enum('FACHADA','ASESOR','TELE','REDES') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `estado` enum('activo','inactivo','cancelado','finalizado') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'activo',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `turnos_rtms_turno_codigo_unique` (`turno_codigo`),
  UNIQUE KEY `uq_turno_por_dia_y_sede` (`sede_id`,`fecha`,`turno_numero`),
  UNIQUE KEY `uq_turno_por_servicio_dia_sede` (`sede_id`,`fecha`,`servicio_id`,`turno_numero_servicio`),
  KEY `turnos_rtms_funcionario_id_foreign` (`funcionario_id`),
  KEY `turnos_rtms_clase_vehiculo_id_foreign` (`clase_vehiculo_id`),
  KEY `turnos_rtms_agente_captacion_id_foreign` (`agente_captacion_id`),
  KEY `idx_turno_servicio` (`servicio_id`),
  KEY `idx_turno_placa` (`placa`),
  KEY `idx_turno_fecha_sede` (`fecha`,`sede_id`),
  KEY `idx_turno_vehiculo` (`vehiculo_id`),
  KEY `idx_turno_cliente` (`cliente_id`),
  KEY `idx_turno_conductor` (`conductor_id`),
  KEY `idx_turno_canal` (`canal_atribucion`),
  KEY `idx_turno_dateo` (`captacion_dateo_id`),
  CONSTRAINT `turnos_rtms_agente_captacion_id_foreign` FOREIGN KEY (`agente_captacion_id`) REFERENCES `agentes_captacions` (`id`) ON DELETE SET NULL,
  CONSTRAINT `turnos_rtms_clase_vehiculo_id_foreign` FOREIGN KEY (`clase_vehiculo_id`) REFERENCES `clases_vehiculos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `turnos_rtms_cliente_id_foreign` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`) ON DELETE SET NULL,
  CONSTRAINT `turnos_rtms_conductor_id_foreign` FOREIGN KEY (`conductor_id`) REFERENCES `conductores` (`id`) ON DELETE SET NULL,
  CONSTRAINT `turnos_rtms_funcionario_id_foreign` FOREIGN KEY (`funcionario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  CONSTRAINT `turnos_rtms_sede_id_foreign` FOREIGN KEY (`sede_id`) REFERENCES `sedes` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `turnos_rtms_servicio_id_foreign` FOREIGN KEY (`servicio_id`) REFERENCES `servicios` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `turnos_rtms_vehiculo_id_foreign` FOREIGN KEY (`vehiculo_id`) REFERENCES `vehiculos` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=103 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `turnos_rtms`
--

LOCK TABLES `turnos_rtms` WRITE;
/*!40000 ALTER TABLE `turnos_rtms` DISABLE KEYS */;
INSERT INTO `turnos_rtms` VALUES (1,12,2,3,28,41,1,36,1,NULL,'2025-12-15','13:54',NULL,NULL,0,NULL,1,1,'PERI-20251215-001','UXX786','Liviano Taxi','Asesor Comercial',NULL,'ASESOR','cancelado','2025-12-15 18:59:16','2025-12-15 18:59:16'),(2,16,2,3,29,31,2,49,2,NULL,'2025-11-14','14:50',NULL,NULL,0,NULL,1,1,'PERI-20251114-001','GEF153','Motocicleta','Asesor Comercial',NULL,'ASESOR','activo','2025-12-15 18:59:16','2025-12-15 18:59:16'),(3,19,2,3,30,16,4,48,2,NULL,'2025-10-28','09:41',NULL,NULL,0,NULL,1,1,'PERI-20251028-001','BZZ309','Motocicleta','Asesor Comercial',NULL,'ASESOR','cancelado','2025-12-15 18:59:16','2025-12-15 18:59:16'),(4,1,2,1,56,6,4,4,2,NULL,'2025-12-08','15:19',NULL,NULL,0,NULL,1,1,'RTM-20251208-001','NZU686','Liviano Particular','Asesor Comercial',NULL,'ASESOR','cancelado','2025-12-15 18:59:16','2025-12-15 18:59:16'),(5,6,2,4,72,27,1,54,2,NULL,'2025-12-08','08:52',NULL,NULL,0,NULL,2,1,'SOAT-20251208-002','PVN841','Motocicleta','Asesor Comercial',NULL,'ASESOR','cancelado','2025-12-15 18:59:16','2025-12-15 18:59:16'),(6,17,2,2,61,34,1,35,1,NULL,'2025-11-27','12:19','17:00:00','60 min',0,NULL,1,1,'PREV-20251127-001','NPE150','Liviano Particular','Asesor Comercial',NULL,'ASESOR','finalizado','2025-12-15 18:59:16','2025-12-15 18:59:16'),(7,19,2,2,40,45,4,14,2,NULL,'2025-11-04','15:07','17:00:00','45 min',0,NULL,1,1,'PREV-20251104-001','HNY545','Motocicleta','Asesor Comercial',NULL,'ASESOR','finalizado','2025-12-15 18:59:16','2025-12-15 18:59:16'),(8,8,2,4,6,36,4,22,2,NULL,'2025-11-04','15:43','17:00:00','71 min',0,NULL,2,1,'SOAT-20251104-002','YYG233','Liviano Particular','Asesor Comercial',NULL,'ASESOR','finalizado','2025-12-15 18:59:16','2025-12-15 18:59:16'),(9,1,2,1,69,37,2,8,1,NULL,'2025-11-19','15:02','17:00:00','31 min',0,NULL,1,1,'RTM-20251119-001','LKN198','Liviano Taxi','Asesor Comercial','Observación demo','ASESOR','finalizado','2025-12-15 18:59:16','2025-12-15 18:59:16'),(10,7,2,2,10,25,4,41,6,NULL,'2025-11-18','16:30','17:00:00','32 min',0,NULL,1,1,'PREV-20251118-001','LFD807','Motocicleta','Asesor Comercial','Observación demo','ASESOR','finalizado','2025-12-15 18:59:16','2025-12-15 18:59:16'),(11,8,2,2,53,3,4,1,2,NULL,'2025-11-11','09:42',NULL,NULL,0,NULL,1,1,'PREV-20251111-001','WDH594','Motocicleta','Asesor Comercial','Observación demo','ASESOR','cancelado','2025-12-15 18:59:16','2025-12-15 18:59:16'),(12,19,2,4,73,40,4,45,1,NULL,'2025-11-16','13:06','17:00:00','25 min',0,NULL,1,1,'SOAT-20251116-001','CSC300','Motocicleta','Asesor Comercial',NULL,'ASESOR','finalizado','2025-12-15 18:59:16','2025-12-15 18:59:16'),(13,6,2,4,29,31,2,23,5,NULL,'2025-12-08','16:13','17:00:00','59 min',0,NULL,3,2,'SOAT-20251208-003','GEF153','Liviano Taxi','Asesor Comercial',NULL,'ASESOR','finalizado','2025-12-15 18:59:16','2025-12-15 18:59:16'),(14,13,2,2,26,13,2,28,3,NULL,'2025-12-13','12:40',NULL,NULL,0,NULL,1,1,'PREV-20251213-001','ZTX764','Liviano Público','Asesor Comercial',NULL,'ASESOR','activo','2025-12-15 18:59:16','2025-12-15 18:59:16'),(15,15,2,2,15,10,1,7,2,NULL,'2025-11-07','17:52','17:00:00','48 min',0,NULL,1,1,'PREV-20251107-001','DFA291','Motocicleta','Asesor Comercial',NULL,'ASESOR','finalizado','2025-12-15 18:59:16','2025-12-15 18:59:16'),(16,4,2,1,10,25,4,31,4,NULL,'2025-10-29','17:45',NULL,NULL,0,NULL,1,1,'RTM-20251029-001','LFD807','Liviano Particular','Asesor Comercial','Observación demo','ASESOR','activo','2025-12-15 18:59:16','2025-12-15 18:59:16'),(17,12,2,3,63,32,2,53,7,NULL,'2025-10-27','10:50',NULL,NULL,0,NULL,1,1,'PERI-20251027-001','LDE216','Liviano Taxi','Asesor Comercial',NULL,'ASESOR','cancelado','2025-12-15 18:59:16','2025-12-15 18:59:16'),(18,10,2,1,4,46,2,22,1,NULL,'2025-11-01','09:41',NULL,NULL,0,NULL,1,1,'RTM-20251101-001','HJS825','Motocicleta','Asesor Comercial',NULL,'ASESOR','activo','2025-12-15 18:59:16','2025-12-15 18:59:16'),(19,1,2,4,50,50,4,21,2,NULL,'2025-11-22','09:34','17:00:00','61 min',0,NULL,1,1,'SOAT-20251122-001','NTS075','Motocicleta','Asesor Comercial',NULL,'ASESOR','finalizado','2025-12-15 18:59:16','2025-12-15 18:59:16'),(20,9,2,2,38,35,1,4,4,NULL,'2025-10-26','12:20','17:00:00','18 min',0,NULL,1,1,'PREV-20251026-001','AGL164','Motocicleta','Asesor Comercial',NULL,'ASESOR','finalizado','2025-12-15 18:59:16','2025-12-15 18:59:16'),(21,9,2,4,17,44,1,20,1,NULL,'2025-10-23','09:45','17:00:00','25 min',0,NULL,1,1,'SOAT-20251023-001','FFM348','Liviano Taxi','Asesor Comercial','Observación demo','ASESOR','finalizado','2025-12-15 18:59:16','2025-12-15 18:59:16'),(22,18,2,1,20,11,1,24,1,NULL,'2025-12-15','11:28','17:00:00','53 min',0,NULL,2,1,'RTM-20251215-002','LPR876','Liviano Público','Asesor Comercial',NULL,'ASESOR','finalizado','2025-12-15 18:59:16','2025-12-15 18:59:16'),(23,6,2,1,40,45,4,3,2,NULL,'2025-11-10','15:51','17:00:00','75 min',0,NULL,1,1,'RTM-20251110-001','HNY545','Liviano Taxi','Asesor Comercial',NULL,'ASESOR','finalizado','2025-12-15 18:59:16','2025-12-15 18:59:16'),(24,15,2,4,72,27,1,31,1,NULL,'2025-11-08','13:01','17:00:00','21 min',0,NULL,1,1,'SOAT-20251108-001','PVN841','Liviano Taxi','Asesor Comercial',NULL,'ASESOR','finalizado','2025-12-15 18:59:16','2025-12-15 18:59:16'),(25,9,2,1,14,10,1,47,1,NULL,'2025-11-11','15:58','17:00:00','77 min',0,NULL,2,1,'RTM-20251111-002','DXT363','Motocicleta','Asesor Comercial',NULL,'ASESOR','finalizado','2025-12-15 18:59:16','2025-12-15 18:59:16'),(26,10,2,1,51,1,4,1,2,NULL,'2025-10-18','12:14','17:00:00','16 min',0,NULL,1,1,'RTM-20251018-001','MKT457','Liviano Público','Asesor Comercial',NULL,'ASESOR','finalizado','2025-12-15 18:59:16','2025-12-15 18:59:16'),(27,18,2,2,5,36,1,26,2,NULL,'2025-11-08','14:28','17:00:00','22 min',0,NULL,2,1,'PREV-20251108-002','ASS700','Motocicleta','Asesor Comercial','Observación demo','ASESOR','finalizado','2025-12-15 18:59:16','2025-12-15 18:59:16'),(28,12,2,3,63,32,2,23,1,NULL,'2025-11-03','17:11','17:00:00','52 min',0,NULL,1,1,'PERI-20251103-001','LDE216','Liviano Público','Asesor Comercial',NULL,'ASESOR','finalizado','2025-12-15 18:59:16','2025-12-15 18:59:16'),(29,13,2,3,10,25,4,22,1,NULL,'2025-11-11','17:30','17:00:00','20 min',0,NULL,3,1,'PERI-20251111-003','LFD807','Motocicleta','Asesor Comercial',NULL,'ASESOR','finalizado','2025-12-15 18:59:16','2025-12-15 18:59:16'),(30,8,2,3,28,41,1,52,1,NULL,'2025-11-26','17:47','17:00:00','16 min',0,NULL,1,1,'PERI-20251126-001','UXX786','Motocicleta','Asesor Comercial',NULL,'ASESOR','finalizado','2025-12-15 18:59:16','2025-12-15 18:59:16'),(31,2,2,2,53,3,4,25,1,NULL,'2025-11-06','12:44',NULL,NULL,0,NULL,1,1,'PREV-20251106-001','WDH594','Liviano Taxi','Asesor Comercial',NULL,'ASESOR','cancelado','2025-12-15 18:59:16','2025-12-15 18:59:16'),(32,5,2,3,67,49,2,32,4,NULL,'2025-11-23','12:52','17:00:00','45 min',0,NULL,1,1,'PERI-20251123-001','ZWF943','Liviano Particular','Asesor Comercial','Observación demo','ASESOR','finalizado','2025-12-15 18:59:16','2025-12-15 18:59:16'),(33,7,2,1,37,35,4,4,4,NULL,'2025-12-11','10:58','17:00:00','73 min',0,NULL,1,1,'RTM-20251211-001','SGM950','Liviano Público','Asesor Comercial',NULL,'ASESOR','finalizado','2025-12-15 18:59:16','2025-12-15 18:59:16'),(34,1,2,1,60,42,4,22,1,NULL,'2025-11-12','08:57',NULL,NULL,0,NULL,1,1,'RTM-20251112-001','AMT828','Liviano Público','Asesor Comercial',NULL,'ASESOR','activo','2025-12-15 18:59:16','2025-12-15 18:59:16'),(35,1,2,3,8,20,1,36,2,NULL,'2025-12-11','16:46','17:00:00','72 min',0,NULL,2,1,'PERI-20251211-002','NTV111','Liviano Particular','Asesor Comercial',NULL,'ASESOR','finalizado','2025-12-15 18:59:16','2025-12-15 18:59:16'),(36,11,2,1,42,45,1,3,1,NULL,'2025-11-12','07:40','17:00:00','64 min',0,NULL,2,2,'RTM-20251112-002','CYY603','Liviano Público','Asesor Comercial',NULL,'ASESOR','finalizado','2025-12-15 18:59:16','2025-12-15 18:59:16'),(37,2,2,1,73,40,4,41,1,NULL,'2025-12-11','14:04','17:00:00','70 min',0,NULL,3,2,'RTM-20251211-003','CSC300','Motocicleta','Asesor Comercial',NULL,'ASESOR','finalizado','2025-12-15 18:59:16','2025-12-15 18:59:16'),(38,9,2,4,2,46,1,17,2,NULL,'2025-10-26','13:58','17:00:00','50 min',0,NULL,2,1,'SOAT-20251026-002','GNE560','Liviano Taxi','Asesor Comercial',NULL,'ASESOR','finalizado','2025-12-15 18:59:16','2025-12-15 18:59:16'),(39,1,2,1,1,18,4,37,1,NULL,'2025-12-02','10:43',NULL,NULL,0,NULL,1,1,'RTM-20251202-001','LJF790','Liviano Público','Asesor Comercial','Observación demo','ASESOR','activo','2025-12-15 18:59:16','2025-12-15 18:59:16'),(40,18,2,1,71,17,1,11,1,NULL,'2025-11-15','11:28',NULL,NULL,0,NULL,1,1,'RTM-20251115-001','SPH021','Liviano Público','Asesor Comercial','Observación demo','ASESOR','cancelado','2025-12-15 18:59:16','2025-12-15 18:59:16'),(41,15,2,1,50,33,4,44,2,NULL,'2025-11-04','13:27','17:00:00','43 min',0,NULL,3,1,'RTM-20251104-003','NTS075','Liviano Taxi','Asesor Comercial','Observación demo','ASESOR','finalizado','2025-12-15 18:59:16','2025-12-15 18:59:16'),(42,14,2,4,43,33,4,50,2,NULL,'2025-10-22','08:32','17:00:00','51 min',0,NULL,1,1,'SOAT-20251022-001','FAX994','Liviano Público','Asesor Comercial',NULL,'ASESOR','finalizado','2025-12-15 18:59:16','2025-12-15 18:59:16'),(43,18,2,1,61,34,1,29,5,NULL,'2025-11-14','11:28',NULL,NULL,0,NULL,2,1,'RTM-20251114-002','NPE150','Liviano Taxi','Asesor Comercial',NULL,'ASESOR','cancelado','2025-12-15 18:59:16','2025-12-15 18:59:16'),(44,15,2,1,60,42,4,48,3,NULL,'2025-11-17','17:49','17:00:00','79 min',0,NULL,1,1,'RTM-20251117-001','AMT828','Liviano Público','Asesor Comercial',NULL,'ASESOR','finalizado','2025-12-15 18:59:16','2025-12-15 18:59:16'),(45,9,2,4,21,21,1,15,2,NULL,'2025-11-14','13:24',NULL,NULL,0,NULL,3,1,'SOAT-20251114-003','WFH767','Liviano Particular','Asesor Comercial',NULL,'ASESOR','activo','2025-12-15 18:59:16','2025-12-15 18:59:16'),(46,10,2,2,1,18,4,44,2,NULL,'2025-11-17','13:36',NULL,NULL,0,NULL,2,1,'PREV-20251117-002','LJF790','Liviano Público','Asesor Comercial',NULL,'ASESOR','cancelado','2025-12-15 18:59:16','2025-12-15 18:59:16'),(47,15,2,1,1,18,4,7,3,NULL,'2025-11-06','13:13',NULL,NULL,0,NULL,2,1,'RTM-20251106-002','LJF790','Liviano Taxi','Asesor Comercial',NULL,'ASESOR','cancelado','2025-12-15 18:59:16','2025-12-15 18:59:16'),(48,12,2,2,67,49,2,51,1,NULL,'2025-11-03','17:45',NULL,NULL,0,NULL,2,1,'PREV-20251103-002','ZWF943','Liviano Particular','Asesor Comercial',NULL,'ASESOR','cancelado','2025-12-15 18:59:16','2025-12-15 18:59:16'),(49,11,2,1,35,48,3,48,1,NULL,'2025-11-16','14:59','17:00:00','73 min',0,NULL,2,1,'RTM-20251116-002','UFJ472','Motocicleta','Asesor Comercial',NULL,'ASESOR','finalizado','2025-12-15 18:59:16','2025-12-15 18:59:16'),(50,4,2,3,62,26,4,12,4,NULL,'2025-11-01','13:43','17:00:00','54 min',0,NULL,2,1,'PERI-20251101-002','BBJ417','Motocicleta','Asesor Comercial',NULL,'ASESOR','finalizado','2025-12-15 18:59:16','2025-12-15 18:59:16'),(51,1,2,1,3,46,4,7,NULL,NULL,'2025-11-18','08:15:00','09:05:00','50 min',0,NULL,2,1,'RTM-20251118-002','CUU544','Liviano Particular','Asesor Comercial','Visita garantizada por seeder','ASESOR','finalizado','2025-12-15 18:59:16','2025-12-15 18:59:16'),(52,1,2,1,7,36,1,50,NULL,NULL,'2025-10-30','08:15:00','09:05:00','50 min',0,NULL,1,1,'RTM-20251030-001','XPM341','Liviano Particular','Asesor Comercial','Visita garantizada por seeder','ASESOR','finalizado','2025-12-15 18:59:16','2025-12-15 18:59:16'),(53,1,2,1,9,22,1,20,NULL,NULL,'2025-11-24','08:15:00','09:05:00','50 min',0,NULL,1,1,'RTM-20251124-001','BCB251','Liviano Particular','Asesor Comercial','Visita garantizada por seeder','ASESOR','finalizado','2025-12-15 18:59:16','2025-12-15 18:59:16'),(54,1,2,1,11,25,1,31,NULL,NULL,'2025-09-23','08:15:00','09:05:00','50 min',0,NULL,1,1,'RTM-20250923-001','FPG901','Liviano Particular','Asesor Comercial','Visita garantizada por seeder','ASESOR','finalizado','2025-12-15 18:59:16','2025-12-15 18:59:16'),(55,1,2,1,12,25,4,39,NULL,NULL,'2025-10-22','08:15:00','09:05:00','50 min',0,NULL,2,1,'RTM-20251022-002','LMD130','Liviano Particular','Asesor Comercial','Visita garantizada por seeder','ASESOR','finalizado','2025-12-15 18:59:16','2025-12-15 18:59:16'),(56,1,2,1,13,23,4,24,NULL,NULL,'2025-10-22','08:15:00','09:05:00','50 min',0,NULL,3,2,'RTM-20251022-003','AUB022','Liviano Particular','Asesor Comercial','Visita garantizada por seeder','ASESOR','finalizado','2025-12-15 18:59:16','2025-12-15 18:59:16'),(57,1,2,1,16,50,1,16,NULL,NULL,'2025-09-22','08:15:00','09:05:00','50 min',0,NULL,1,1,'RTM-20250922-001','SFT556','Liviano Particular','Asesor Comercial','Visita garantizada por seeder','ASESOR','finalizado','2025-12-15 18:59:16','2025-12-15 18:59:16'),(58,1,2,1,18,15,1,25,NULL,NULL,'2025-11-04','08:15:00','09:05:00','50 min',0,NULL,4,2,'RTM-20251104-004','GNK561','Liviano Particular','Asesor Comercial','Visita garantizada por seeder','ASESOR','finalizado','2025-12-15 18:59:16','2025-12-15 18:59:16'),(59,1,2,1,19,11,2,33,NULL,NULL,'2025-10-01','08:15:00','09:05:00','50 min',0,NULL,1,1,'RTM-20251001-001','VBK479','Liviano Particular','Asesor Comercial','Visita garantizada por seeder','ASESOR','finalizado','2025-12-15 18:59:16','2025-12-15 18:59:16'),(60,1,2,1,22,21,1,54,NULL,NULL,'2025-09-29','08:15:00','09:05:00','50 min',0,NULL,1,1,'RTM-20250929-001','PKT075','Liviano Particular','Asesor Comercial','Visita garantizada por seeder','ASESOR','finalizado','2025-12-15 18:59:16','2025-12-15 18:59:16'),(61,1,2,1,23,38,1,5,NULL,NULL,'2025-10-27','08:15:00','09:05:00','50 min',0,NULL,2,1,'RTM-20251027-002','GTB236','Liviano Particular','Asesor Comercial','Visita garantizada por seeder','ASESOR','finalizado','2025-12-15 18:59:16','2025-12-15 18:59:16'),(62,1,2,1,24,38,2,45,NULL,NULL,'2025-09-18','08:15:00','09:05:00','50 min',0,NULL,1,1,'RTM-20250918-001','WFX699','Liviano Particular','Asesor Comercial','Visita garantizada por seeder','ASESOR','finalizado','2025-12-15 18:59:16','2025-12-15 18:59:16'),(63,1,2,1,25,38,1,12,NULL,NULL,'2025-09-24','08:15:00','09:05:00','50 min',0,NULL,1,1,'RTM-20250924-001','GRF532','Liviano Particular','Asesor Comercial','Visita garantizada por seeder','ASESOR','finalizado','2025-12-15 18:59:16','2025-12-15 18:59:16'),(64,1,2,1,27,13,4,26,NULL,NULL,'2025-10-07','08:15:00','09:05:00','50 min',0,NULL,1,1,'RTM-20251007-001','LSV632','Liviano Particular','Asesor Comercial','Visita garantizada por seeder','ASESOR','finalizado','2025-12-15 18:59:16','2025-12-15 18:59:16'),(65,1,2,1,31,14,1,40,NULL,NULL,'2025-11-15','08:15:00','09:05:00','50 min',0,NULL,2,2,'RTM-20251115-002','RSS765','Liviano Particular','Asesor Comercial','Visita garantizada por seeder','ASESOR','finalizado','2025-12-15 18:59:16','2025-12-15 18:59:16'),(66,1,2,1,32,47,1,23,NULL,NULL,'2025-10-14','08:15:00','09:05:00','50 min',0,NULL,1,1,'RTM-20251014-001','GXW554','Liviano Particular','Asesor Comercial','Visita garantizada por seeder','ASESOR','finalizado','2025-12-15 18:59:16','2025-12-15 18:59:16'),(67,1,2,1,33,47,4,18,NULL,NULL,'2025-10-23','08:15:00','09:05:00','50 min',0,NULL,2,1,'RTM-20251023-002','XNB149','Liviano Particular','Asesor Comercial','Visita garantizada por seeder','ASESOR','finalizado','2025-12-15 18:59:16','2025-12-15 18:59:16'),(68,1,2,1,34,47,1,46,NULL,NULL,'2025-10-10','08:15:00','09:05:00','50 min',0,NULL,1,1,'RTM-20251010-001','DLJ509','Liviano Particular','Asesor Comercial','Visita garantizada por seeder','ASESOR','finalizado','2025-12-15 18:59:16','2025-12-15 18:59:16'),(69,1,2,1,36,35,4,18,NULL,NULL,'2025-11-24','08:15:00','09:05:00','50 min',0,NULL,2,2,'RTM-20251124-002','XXU944','Liviano Particular','Asesor Comercial','Visita garantizada por seeder','ASESOR','finalizado','2025-12-15 18:59:16','2025-12-15 18:59:16'),(70,1,2,1,39,5,3,32,NULL,NULL,'2025-10-15','08:15:00','09:05:00','50 min',0,NULL,1,1,'RTM-20251015-001','SGY649','Liviano Particular','Asesor Comercial','Visita garantizada por seeder','ASESOR','finalizado','2025-12-15 18:59:16','2025-12-15 18:59:16'),(71,1,2,1,41,45,3,11,NULL,NULL,'2025-11-08','08:15:00','09:05:00','50 min',0,NULL,3,1,'RTM-20251108-003','CEA566','Liviano Particular','Asesor Comercial','Visita garantizada por seeder','ASESOR','finalizado','2025-12-15 18:59:16','2025-12-15 18:59:16'),(72,1,2,1,44,31,1,53,NULL,NULL,'2025-09-27','08:15:00','09:05:00','50 min',0,NULL,1,1,'RTM-20250927-001','ZDN783','Liviano Particular','Asesor Comercial','Visita garantizada por seeder','ASESOR','finalizado','2025-12-15 18:59:16','2025-12-15 18:59:16'),(73,1,2,1,45,23,1,46,NULL,NULL,'2025-10-19','08:15:00','09:05:00','50 min',0,NULL,1,1,'RTM-20251019-001','ETK578','Liviano Particular','Asesor Comercial','Visita garantizada por seeder','ASESOR','finalizado','2025-12-15 18:59:16','2025-12-15 18:59:16'),(74,1,2,1,46,NULL,1,4,NULL,NULL,'2025-09-18','08:15:00','09:05:00','50 min',0,NULL,2,2,'RTM-20250918-002','WMR961','Liviano Particular','Asesor Comercial','Visita garantizada por seeder','ASESOR','finalizado','2025-12-15 18:59:16','2025-12-15 18:59:16'),(75,1,2,1,47,NULL,1,46,NULL,NULL,'2025-10-05','08:15:00','09:05:00','50 min',0,NULL,1,1,'RTM-20251005-001','XJT152','Liviano Particular','Asesor Comercial','Visita garantizada por seeder','ASESOR','finalizado','2025-12-15 18:59:16','2025-12-15 18:59:16'),(76,1,2,1,48,39,3,21,NULL,NULL,'2025-10-19','08:15:00','09:05:00','50 min',0,NULL,2,2,'RTM-20251019-002','GPE123','Liviano Particular','Asesor Comercial','Visita garantizada por seeder','ASESOR','finalizado','2025-12-15 18:59:16','2025-12-15 18:59:16'),(77,1,2,1,49,24,1,12,NULL,NULL,'2025-10-11','08:15:00','09:05:00','50 min',0,NULL,1,1,'RTM-20251011-001','HUK832','Liviano Particular','Asesor Comercial','Visita garantizada por seeder','ASESOR','finalizado','2025-12-15 18:59:16','2025-12-15 18:59:16'),(78,1,2,1,52,2,1,26,NULL,NULL,'2025-10-04','08:15:00','09:05:00','50 min',0,NULL,1,1,'RTM-20251004-001','LRV408','Liviano Particular','Asesor Comercial','Visita garantizada por seeder','ASESOR','finalizado','2025-12-15 18:59:17','2025-12-15 18:59:17'),(79,1,2,1,54,4,1,15,NULL,NULL,'2025-09-20','08:15:00','09:05:00','50 min',0,NULL,1,1,'RTM-20250920-001','LYG577','Liviano Particular','Asesor Comercial','Visita garantizada por seeder','ASESOR','finalizado','2025-12-15 18:59:17','2025-12-15 18:59:17'),(80,1,2,1,55,12,4,27,NULL,NULL,'2025-11-25','08:15:00','09:05:00','50 min',0,NULL,1,1,'RTM-20251125-001','HPD327','Liviano Particular','Asesor Comercial','Visita garantizada por seeder','ASESOR','finalizado','2025-12-15 18:59:17','2025-12-15 18:59:17'),(81,1,2,1,57,7,2,28,NULL,NULL,'2025-09-28','08:15:00','09:05:00','50 min',0,NULL,1,1,'RTM-20250928-001','VYR714','Liviano Particular','Asesor Comercial','Visita garantizada por seeder','ASESOR','finalizado','2025-12-15 18:59:17','2025-12-15 18:59:17'),(82,1,2,1,58,8,4,5,NULL,NULL,'2025-10-28','08:15:00','09:05:00','50 min',0,NULL,2,1,'RTM-20251028-002','CBW253','Liviano Particular','Asesor Comercial','Visita garantizada por seeder','ASESOR','finalizado','2025-12-15 18:59:17','2025-12-15 18:59:17'),(83,1,2,1,59,9,4,18,NULL,NULL,'2025-11-05','08:15:00','09:05:00','50 min',0,NULL,1,1,'RTM-20251105-001','UKR164','Liviano Particular','Asesor Comercial','Visita garantizada por seeder','ASESOR','finalizado','2025-12-15 18:59:17','2025-12-15 18:59:17'),(84,1,2,1,64,29,1,13,NULL,NULL,'2025-11-27','08:15:00','09:05:00','50 min',0,NULL,2,1,'RTM-20251127-002','VTN678','Liviano Particular','Asesor Comercial','Visita garantizada por seeder','ASESOR','finalizado','2025-12-15 18:59:17','2025-12-15 18:59:17'),(85,1,2,1,65,30,4,5,NULL,NULL,'2025-11-23','08:15:00','09:05:00','50 min',0,NULL,2,1,'RTM-20251123-002','AVL307','Liviano Particular','Asesor Comercial','Visita garantizada por seeder','ASESOR','finalizado','2025-12-15 18:59:17','2025-12-15 18:59:17'),(86,1,2,1,66,28,4,10,NULL,NULL,'2025-11-14','08:15:00','09:05:00','50 min',0,NULL,4,2,'RTM-20251114-004','CJP256','Liviano Particular','Asesor Comercial','Visita garantizada por seeder','ASESOR','finalizado','2025-12-15 18:59:17','2025-12-15 18:59:17'),(87,1,2,1,68,43,4,13,NULL,NULL,'2025-11-29','08:15:00','09:05:00','50 min',0,NULL,1,1,'RTM-20251129-001','BCK969','Liviano Particular','Asesor Comercial','Visita garantizada por seeder','ASESOR','finalizado','2025-12-15 18:59:17','2025-12-15 18:59:17'),(88,1,2,1,70,19,1,50,NULL,NULL,'2025-10-12','08:15:00','09:05:00','50 min',0,NULL,1,1,'RTM-20251012-001','MFR288','Liviano Particular','Asesor Comercial','Visita garantizada por seeder','ASESOR','finalizado','2025-12-15 18:59:17','2025-12-15 18:59:17'),(89,2,2,1,NULL,NULL,NULL,NULL,NULL,NULL,'2025-12-15','16:29',NULL,NULL,0,NULL,3,2,'RTM-20251215163218','BCD123','Liviano Particular','Fachada','Google Ads','FACHADA','activo','2025-12-15 21:32:18','2025-12-15 21:32:18'),(90,1,2,1,NULL,NULL,NULL,NULL,NULL,NULL,'2025-12-15','16:38',NULL,NULL,0,NULL,4,3,'RTM-20251215164056','CCC222','Liviano Particular','Fachada',NULL,'FACHADA','activo','2025-12-15 21:40:56','2025-12-15 21:40:56'),(91,3,1,3,NULL,NULL,NULL,NULL,NULL,NULL,'2025-12-15','16:45',NULL,NULL,1,'16:47:57',1,1,'PERI-20251215164605','AVC332','Liviano Particular','Fachada',NULL,'FACHADA','activo','2025-12-15 21:46:05','2025-12-15 21:47:57'),(92,3,1,3,NULL,NULL,NULL,NULL,NULL,NULL,'2025-12-15','16:48','16:59:43',NULL,1,'17:09:37',2,2,'PERI-20251215164830','RRR123','Liviano Particular','Fachada',NULL,'FACHADA','finalizado','2025-12-15 21:48:30','2025-12-15 22:09:37'),(93,3,1,1,NULL,NULL,NULL,NULL,NULL,NULL,'2025-12-16','08:56',NULL,NULL,1,'09:11:53',1,1,'RTM-20251216085628','123RTY','Motocicleta','Fachada',NULL,'FACHADA','activo','2025-12-16 13:56:28','2025-12-16 14:11:53'),(94,21,4,1,NULL,NULL,NULL,NULL,NULL,NULL,'2025-12-16','09:12',NULL,NULL,1,'09:13:26',1,1,'RTM-20251216091244','BBB222','Liviano Particular','Fachada',NULL,'FACHADA','activo','2025-12-16 14:12:44','2025-12-16 14:13:26'),(95,21,4,3,NULL,NULL,NULL,NULL,NULL,NULL,'2025-12-16','09:13',NULL,NULL,1,'09:14:04',2,1,'PERI-20251216091352','BBB222','Liviano Particular','Fachada',NULL,'FACHADA','activo','2025-12-16 14:13:52','2025-12-16 14:14:04'),(96,21,4,1,NULL,NULL,NULL,NULL,8,39,'2025-12-16','09:24',NULL,NULL,0,NULL,3,2,'RTM-20251216092450','BBB333','Motocicleta','Asesor Comercial',NULL,'ASESOR','activo','2025-12-16 14:24:50','2025-12-16 14:24:50'),(97,21,1,1,NULL,NULL,NULL,NULL,8,40,'2025-12-16','15:01',NULL,NULL,1,'15:07:10',2,2,'RTM-20251216150209','ASD123','Motocicleta','Asesor Comercial',NULL,'ASESOR','activo','2025-12-16 20:02:09','2025-12-16 20:07:10'),(98,21,1,1,NULL,NULL,NULL,NULL,8,41,'2025-12-16','15:08',NULL,NULL,1,'15:10:41',3,3,'RTM-20251216150858','QWE123','Liviano Particular','Asesor Comercial',NULL,'ASESOR','activo','2025-12-16 20:08:58','2025-12-16 20:10:41'),(99,21,1,3,NULL,NULL,NULL,NULL,8,41,'2025-12-16','15:27',NULL,NULL,1,'15:28:09',4,1,'PERI-20251216152800','QWE123','Liviano Particular','Asesor Comercial',NULL,'ASESOR','activo','2025-12-16 20:28:00','2025-12-16 20:28:09'),(100,21,3,1,NULL,NULL,NULL,NULL,8,42,'2025-12-16','16:06',NULL,NULL,1,'16:07:37',1,1,'RTM-20251216160637','DDD222','Liviano Particular','Asesor Comercial',NULL,'ASESOR','activo','2025-12-16 21:06:37','2025-12-16 21:07:37'),(101,1,4,1,NULL,NULL,NULL,NULL,NULL,NULL,'2025-12-16','16:20',NULL,NULL,1,'16:21:54',4,3,'RTM-20251216162107','PPP333D','Liviano Particular','Fachada','n','FACHADA','activo','2025-12-16 21:21:07','2025-12-16 21:24:44'),(102,21,3,3,NULL,NULL,NULL,NULL,NULL,NULL,'2025-12-16','16:15',NULL,NULL,0,NULL,2,1,'PERI-20251216175656','DAS123','Liviano Particular','Fachada',NULL,'FACHADA','activo','2025-12-16 22:56:56','2025-12-16 22:56:56');
/*!40000 ALTER TABLE `turnos_rtms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `razon_social_id` int unsigned DEFAULT NULL,
  `rol_id` int unsigned DEFAULT NULL,
  `sede_id` int unsigned DEFAULT NULL,
  `cargo_id` int unsigned DEFAULT NULL,
  `agente_id` int unsigned DEFAULT NULL COMMENT 'ID del agente de captación (si el usuario ES un agente)',
  `eps_id` int unsigned DEFAULT NULL,
  `arl_id` int unsigned DEFAULT NULL,
  `afp_id` int unsigned DEFAULT NULL,
  `afc_id` int unsigned DEFAULT NULL,
  `ccf_id` int unsigned DEFAULT NULL,
  `nombres` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `apellidos` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `correo` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `foto_perfil` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `direccion` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `celular_personal` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `celular_corporativo` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `centro_costo` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `estado` enum('activo','inactivo') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'activo',
  `recomendaciones` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL,
  `updated_at` timestamp NOT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `usuarios_correo_unique` (`correo`),
  KEY `usuarios_razon_social_id_foreign` (`razon_social_id`),
  KEY `usuarios_rol_id_foreign` (`rol_id`),
  KEY `usuarios_sede_id_foreign` (`sede_id`),
  KEY `usuarios_cargo_id_foreign` (`cargo_id`),
  KEY `usuarios_eps_id_foreign` (`eps_id`),
  KEY `usuarios_arl_id_foreign` (`arl_id`),
  KEY `usuarios_afp_id_foreign` (`afp_id`),
  KEY `usuarios_afc_id_foreign` (`afc_id`),
  KEY `usuarios_ccf_id_foreign` (`ccf_id`),
  CONSTRAINT `usuarios_afc_id_foreign` FOREIGN KEY (`afc_id`) REFERENCES `entidades_salud` (`id`) ON DELETE SET NULL,
  CONSTRAINT `usuarios_afp_id_foreign` FOREIGN KEY (`afp_id`) REFERENCES `entidades_salud` (`id`) ON DELETE SET NULL,
  CONSTRAINT `usuarios_arl_id_foreign` FOREIGN KEY (`arl_id`) REFERENCES `entidades_salud` (`id`) ON DELETE SET NULL,
  CONSTRAINT `usuarios_cargo_id_foreign` FOREIGN KEY (`cargo_id`) REFERENCES `cargos` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `usuarios_ccf_id_foreign` FOREIGN KEY (`ccf_id`) REFERENCES `entidades_salud` (`id`) ON DELETE SET NULL,
  CONSTRAINT `usuarios_eps_id_foreign` FOREIGN KEY (`eps_id`) REFERENCES `entidades_salud` (`id`) ON DELETE SET NULL,
  CONSTRAINT `usuarios_razon_social_id_foreign` FOREIGN KEY (`razon_social_id`) REFERENCES `razon_social` (`id`) ON DELETE CASCADE,
  CONSTRAINT `usuarios_rol_id_foreign` FOREIGN KEY (`rol_id`) REFERENCES `roles` (`id`) ON DELETE SET NULL,
  CONSTRAINT `usuarios_sede_id_foreign` FOREIGN KEY (`sede_id`) REFERENCES `sedes` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,1,1,4,5,NULL,5,43,27,31,37,'Admin','Sistema','admin@cda.com','$scrypt$n=16384,r=8,p=1$mY/bznGvy5rHU8MMclwfbg$oeyo6RdQ+ylQ+jVs26NUyAoArl0YKKStNLsA1tLpDOPEIgaMwXNAtkOAokoeufx1ks07dEasKvx3HXQYF3UdFg','','Calle 123 #45-67','3001111111','3109999999','SERVICIO AL CLIENTE','activo',1,'2025-12-15 18:59:14','2025-12-17 13:58:26',NULL),(2,1,2,2,3,NULL,1,11,17,22,27,'María','Sánchez','maria.sanchez@cda.com','$scrypt$n=16384,r=8,p=1$cW89jAOx2fZAIt0mBpxQ8A$2vPADq7MSYao3Nwd8iu9OuIwwLrAX/SNE/QA99zyk+PTwCsusDPH0UKsNDBe61BAzxvu8LkM7j4kG66SaE59pw','','Cra 5 #12-34','3002222222','3118888888','GER-01','activo',1,'2025-12-15 18:59:14','2025-12-15 18:59:14',NULL),(3,2,2,4,8,NULL,5,45,27,31,37,'Carlos','Rodríguez','carlos.rodriguez@cda.com','$scrypt$n=16384,r=8,p=1$Qo+Wb9pbBI7QK9atlUhB+Q$ijVp/Rbj1F1umVIGHpcZlpXHZ8rIP34eao5z1uY5x5I/MgkAgT259djffoL9Zwg8vg8+5UVEwEe3snwSEU6Gqg','','Calle 80 #10-20','3003333333','3127777777','TALENTO HUMANO','activo',0,'2025-12-15 18:59:15','2025-12-16 17:27:02',NULL),(4,1,2,1,8,NULL,5,43,27,31,36,'Sandra','Martínez','sandra.martinez@cda.com','$scrypt$n=16384,r=8,p=1$co6d3z2l07RrD/x0s2TbPw$izId1eyl0TgkExfG5lZRN67LWVHOVyFJNhAVSpZ2GiLZ57BjO+Zg+3S7nLBAp55q/yjB6Oc0rJFswHRcH4FCXw','','Cra 10 #15-25','3004444444','3136666666','TALENTO HUMANO','activo',1,'2025-12-15 18:59:15','2025-12-16 14:35:35',NULL),(5,1,2,4,8,NULL,5,43,25,31,39,'Patricia','Gómez','patricia.gomez@cda.com','$scrypt$n=16384,r=8,p=1$2XjLeS4m524cb3SNuMB8iw$JLlGxFetI9vHmNMPqj8NSIykajzCzd+gKt6DbkPSvec5vumZ7QEPW1bUjxKnEMjDtTjpPQrK3o9kIh7Fq2Q9BQ','','Carrera 5 #10-20','3101234567','3201234567','ADMINISTRACIÓN','activo',1,'2025-12-15 18:59:15','2025-12-16 14:37:01',NULL),(6,1,4,4,5,NULL,18,42,26,31,39,'Laura','González','laura.gonzalez@cda.com','$scrypt$n=16384,r=8,p=1$SE1yjHRXm8L6f7pXpdcK4g$balOmpt35gnQc1mGpxse5bZTJjk1BkH/Wclewi2cwg+4IOdeJ1T/TQV+V57BJth8slrFd8MPoBmtvHhpkRflLw','','Cra 9 #10-20','3005555555','3145555555','DIRECCIÓN','activo',0,'2025-12-15 18:59:15','2025-12-17 14:16:40',NULL),(7,1,4,2,5,NULL,5,43,27,31,36,'Pedro','Ramírez','pedro.ramirez@cda.com','$scrypt$n=16384,r=8,p=1$5aqc15I5BpvViVSJ6+4BCw$ncS+qDDKJEvWxipkTIpZ1E2mvk6AlEtazf0f7+eSQO3ICLS9yQrdR3JHhipdlmWJNBZRd0Vm4miQDxkd8jVGgg','','Calle 45 #23-10','3006666666','3154444444','OPERACIÓN','activo',1,'2025-12-15 18:59:15','2025-12-16 14:41:04',NULL),(8,1,5,2,4,NULL,1,11,17,22,27,'Andrea','López','andrea.lopez@cda.com','$scrypt$n=16384,r=8,p=1$tQGBxdaX2rr4X0D9J4cXnA$ol1yWWiFPVCWFuIeAND79L8QOJF0K6ogAcSlonYvp/zLEQLz6hIfn8zvzOoy0dCK3/HkwiLI56kKCEsSM/k6sg','','Calle 72 #10-30','3007777777','3163333333','TH-01','activo',1,'2025-12-15 18:59:15','2025-12-15 18:59:15',NULL),(9,1,6,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Luis','Romero','luis.romero@cda.com','$scrypt$n=16384,r=8,p=1$/sqNb5/QS/xp7AP1a1jTrw$b7cJnHwQqXjM7C8MhY0dGJta5gRrBU+9YEHmjHM5KohEX6bZja27a1k27QCCUuBzF4g/xKHLmEG0pvatMG9OzQ','','Calle 40 #18-30','3008888888','3172222222','OPE-01','activo',1,'2025-12-15 18:59:15','2025-12-15 20:51:53',NULL),(10,1,6,2,10,NULL,1,11,17,22,27,'Gabriela','Ortiz','gabriela.ortiz@cda.com','$scrypt$n=16384,r=8,p=1$JBGs/jb4NSWKrT2DrKBcIA$sNH8F9Vg0kRoKkIYki0zvZx13N+mmD67rRZ4400D3V9afewDj2sDjey02IjZN7tjXrbwfIlLXCuMqjUww0cX6w','','Cra 5 #25-18','3009999999','3181111111','OPE-02','activo',0,'2025-12-15 18:59:15','2025-12-15 18:59:15',NULL),(11,1,6,2,11,NULL,1,11,17,22,27,'Roberto','Navarro','roberto.navarro@cda.com','$scrypt$n=16384,r=8,p=1$CqdhCALw89o24YliZwk0Vg$NTLAe6Dv4wAuxR19Uwl8qcX1O1SLq4yZukTHDoKmwv5AekVEfTCXpDQqieFTqQTfsi6qLlXxibaJNNxQ9C7x4A','','Av 30 #45-20','3010000000','3190000000','ING-01','activo',1,'2025-12-15 18:59:15','2025-12-15 18:59:15',NULL),(12,1,6,2,12,NULL,1,11,17,22,27,'Miguel','Torres','miguel.torres@cda.com','$scrypt$n=16384,r=8,p=1$UpoUm+yx4M3H0I/s9SFVew$WIi7DSMvB6xQwr2+n06gjgEWsvRPyk6UPMfBwH41cBKmcRlMQIKg4tgNTjdDTMeW5cZC92uGIJC7bjPZaTDe0A','','Calle 50 #22-10','3010000001','3190000001','INS-01','activo',0,'2025-12-15 18:59:15','2025-12-15 18:59:15',NULL),(13,1,3,2,8,1,1,11,17,22,27,'Juan','Morales','juan.morales@cda.com','$scrypt$n=16384,r=8,p=1$Vtc0SUySZPmm7ljcH9sqsA$x8m4KDrK3JWHxJpwiQBupszHcl0qo9rI1Mnn/fdjJcV7Dhn9T9J61AEbmnFsUtJQyVhuZzKy0tm1c8FMAY0ZnA','','Calle 85 #30-40','3010000002','3190000002','COM-01','activo',1,'2025-12-15 18:59:15','2025-12-15 18:59:16',NULL),(14,1,3,2,8,2,1,11,17,22,27,'Diana','Castro','diana.castro@cda.com','$scrypt$n=16384,r=8,p=1$ASj2MkoP9pJKv5ZZd9/o/w$/lJLjE7mgrzwxb2+FELme+TboTHb9Ui2u9hDc0IQeCv3Iy5e8kUc2LHonM6zFGb42PZBYzm5WmCsT2QkpHPXKg','','Cra 4 #20-15','3010000003','3190000003','COM-02','activo',0,'2025-12-15 18:59:15','2025-12-15 18:59:16',NULL),(15,1,3,2,9,3,1,11,17,22,27,'Taller','El Cambio','taller.cambio@convenios.com','$scrypt$n=16384,r=8,p=1$CESqvW9w8aG0ZaQBf6Tryg$7ggXKwEFlUaHqxqjNqTOhMl0NxED3l8gNYVKhal4FbN9F1fCr0DEWSENvlmqT0XrZ0Plu9VAvx/AqbUn3k/JxQ','','Cra 20 #12-05','3011000001','3121000001','CONV-01','activo',0,'2025-12-15 18:59:15','2025-12-15 18:59:16',NULL),(16,1,3,2,9,4,1,11,17,22,27,'Parqueadero','Central','parqueadero.central@convenios.com','$scrypt$n=16384,r=8,p=1$KfSlsRzO2jQJfCvJx4q9mw$PGfduQDJSC9YJgH8gGWbfP71+MuKoip97NhvksJUFIfsjiHZ/e96M+uZCrqeg0dwUDn+lEGEzBo6HOCuuDkZaQ','','Calle 5 #8-20','3011000002','3121000002','CONV-02','activo',0,'2025-12-15 18:59:15','2025-12-15 18:59:16',NULL),(17,1,3,2,9,5,1,11,17,22,27,'Lavadero','TurboWash','lavadero.turbowash@convenios.com','$scrypt$n=16384,r=8,p=1$ES2u+ZSwwhQIRF8ZHbo6iA$AxiS/bhdouBqluil5VwinKm5UzWJIBN0z6jGghQMk2yhWIDyK+AquI7anuE4j9j1GPaeODtx8jami+ZveCGqog','','Av 60 #20-30','3011000003','3121000003','CONV-03','activo',0,'2025-12-15 18:59:15','2025-12-15 18:59:16',NULL),(18,1,3,2,9,6,1,11,17,22,27,'Carolina','Rojas','carolina.rojas@convenios.com','$scrypt$n=16384,r=8,p=1$cKDhe84pg6+WkchlmGrZeg$6R/UskOLIex745dJEBUOqj1+efEtl0ydCSOsd+kOhPKBeTr5vFVJteGtI2Q0tsWMEEZrEH0I+i/bYHZ0e2vavA','','Calle 92 #25-15','3011000004','3121000004','CONV-04','activo',0,'2025-12-15 18:59:15','2025-12-15 18:59:16',NULL),(19,1,3,2,9,7,1,11,17,22,27,'Taller','ProService','taller.proservice@convenios.com','$scrypt$n=16384,r=8,p=1$/jNVgBh8k6ygnwK1tXm4JQ$Vv+OSasqmB8tovkHQSz4F3xkRCnvuYN+Zwdh+isAoGItw4BgoRJ5eJo/rKukXWVtj7+IVVLS5BqnxAw8p9sIlQ','','Calle 100 #12-02','3011000005','3121000005','CONV-05','activo',0,'2025-12-15 18:59:15','2025-12-15 18:59:16',NULL),(20,4,3,4,8,NULL,5,43,27,34,36,'prueba flujo ','completo','prueba@cda.com','$scrypt$n=16384,r=8,p=1$suz5Tqxd82ihk5AIcbo4iQ$2aggGp0BRuv9XNiKhX6NoQDa5wOZ/m7np6BPZmkfXwjsKm/XlF8ifI21FdYVzgOQhXLJhM8mU9AItPgGIfimSg',NULL,'Av. Calle 6 #16-80','3249624220','3249624220','COMERCIAL','activo',0,'2025-12-15 20:20:43','2025-12-15 21:21:09',NULL),(21,2,6,3,10,NULL,5,43,26,33,40,'puerta','prueba','prueba2@cda.com','$scrypt$n=16384,r=8,p=1$f5DAM6zSNFjfTS80bdWF0A$Y7WugtF8P/B2Yla89Zv6JwIsnD+MSh794WgtoHE+3GfESBV1pqUAfGNmCJQ/Qh0aqnVBsGl+1tXq4zmqShTH6w',NULL,'prueba','214124','1241243423','TALENTO HUMANO','activo',0,'2025-12-15 20:54:21','2025-12-16 20:56:04',NULL),(22,2,3,4,8,NULL,22,43,28,34,38,'diego','avila','diego@cda.com','$scrypt$n=16384,r=8,p=1$ToEcR2PhhT0E3+/aVJyh1g$w+pLFrK76HqUMIUxgzjVxWmbvBboELES76eecz6jZL2EQLstsghKbvJ53OeRtMbttXFSCwrWTXlVBoGGUaQvKA',NULL,'567 7','123124535','23423432','CONTABILIDAD','activo',0,'2025-12-16 14:15:19','2025-12-16 14:31:23',NULL),(23,2,5,1,4,NULL,5,43,27,31,36,'talento','humano','talento@cda.com','$scrypt$n=16384,r=8,p=1$qK1ukMc6aAkPGSjYOoueLQ$oFyt6MG3tUh0pFE+Z3agjYyDtzu3MQVrrxsCK+uO4Sn0z9TTao/c5SJHra7tbTvTLeJsAVCOUOvYPVtV43PaDw',NULL,'24asd','6325435','999999999','TALENTO HUMANO','activo',0,'2025-12-16 14:44:12','2025-12-16 14:50:37',NULL),(24,2,3,1,9,NULL,NULL,NULL,NULL,NULL,NULL,'prueba ','convenio','prueba3@cda.com','$scrypt$n=16384,r=8,p=1$BZ6gqfZiA0XOAShODGmLAg$i1uReJfXBMeWShuo5Fi0qK473VQVGqwfTExkeI+ewVyl8jW73DvkjulOdxpbGzfGHDOWfv0SSEKcFrrYcBFTIw',NULL,'rdasdas','124324532','4234234',NULL,'activo',0,'2025-12-16 17:15:00','2025-12-16 17:15:55',NULL),(25,2,4,2,5,NULL,5,43,27,31,37,'contabilidad','prueba','contabilidad@cda.com','$scrypt$n=16384,r=8,p=1$jOtwKhATIwUYYTbhr5hWyQ$IMvqBcV1XyqptRAcOr19AEdKyGlXUg9mnOiyZ/XHZCMWYJSQKxJ6T1Nq89RKq+PcDGuJw0/7bxQYrqXwQjsNkA',NULL,'dasdsa','45678','65546546','CONTABILIDAD','activo',0,'2025-12-16 20:31:46','2025-12-16 20:46:59',NULL),(26,4,6,4,11,NULL,11,46,29,30,36,'ingeniero',' prueba','pruebaing@cda.com','$scrypt$n=16384,r=8,p=1$2gCpHd5lgG75MQRlmJYirw$qLihH3UL79M4f21pkeuS5+e4msfD2xkkjbhkOdUA1OWf3dvp55EPcf7SVY42GJ5aDYBsQeVFQJPcKAarFnx7eQ',NULL,'5dasdsa','87654356','34543534534','SERVICIO AL CLIENTE','activo',0,'2025-12-16 21:16:37','2025-12-16 21:18:26',NULL),(27,4,2,4,1,NULL,5,43,27,31,37,'gerencia','prueba','gerencia@cda.com','$scrypt$n=16384,r=8,p=1$gRd36Am3URA4qfCvL+3MCg$tIdaFwMtxMLVhuS60MC+2tAnAyP9kzPaEXaw1MdzLoX+il/pN0wi7oBDVALmxywfe/Gjb+S+CYxupYIFbFMyNQ',NULL,'sadasd213','4234324','324234234','DIRECCIÓN','activo',0,'2025-12-16 21:46:17','2025-12-16 21:50:20',NULL);
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vehiculos`
--

DROP TABLE IF EXISTS `vehiculos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vehiculos` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `placa` varchar(12) COLLATE utf8mb4_unicode_ci NOT NULL,
  `clase_vehiculo_id` int unsigned NOT NULL,
  `marca` varchar(60) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `linea` varchar(80) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `modelo` int DEFAULT NULL,
  `color` varchar(40) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `matricula` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cliente_id` int unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `vehiculos_placa_unique` (`placa`),
  KEY `vehiculos_clase_vehiculo_id_index` (`clase_vehiculo_id`),
  KEY `vehiculos_cliente_id_index` (`cliente_id`),
  CONSTRAINT `vehiculos_clase_vehiculo_id_foreign` FOREIGN KEY (`clase_vehiculo_id`) REFERENCES `clases_vehiculos` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `vehiculos_cliente_id_foreign` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=89 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vehiculos`
--

LOCK TABLES `vehiculos` WRITE;
/*!40000 ALTER TABLE `vehiculos` DISABLE KEYS */;
INSERT INTO `vehiculos` VALUES (1,'LJF790',4,'AKT','NKD',2022,'Blanco','TP-LJF790',18,'2025-12-15 18:59:15','2025-12-15 18:59:15'),(2,'GNE560',1,'Mazda','Spark GT',2024,'Verde','TP-GNE560',46,'2025-12-15 18:59:15','2025-12-15 18:59:15'),(3,'CUU544',4,'Honda','Pulsar',2012,'Verde','TP-CUU544',46,'2025-12-15 18:59:15','2025-12-15 18:59:15'),(4,'HJS825',2,'Chevrolet','Sail',2011,'Amarillo','TP-HJS825',46,'2025-12-15 18:59:15','2025-12-15 18:59:15'),(5,'ASS700',1,'Nissan','Sandero',2016,'Amarillo','TP-ASS700',36,'2025-12-15 18:59:15','2025-12-15 18:59:15'),(6,'YYG233',4,'AKT','XR',2015,'Azul','TP-YYG233',36,'2025-12-15 18:59:15','2025-12-15 18:59:15'),(7,'XPM341',1,'Kia','Picanto',2022,'Gris','TP-XPM341',36,'2025-12-15 18:59:15','2025-12-15 18:59:15'),(8,'NTV111',1,'Kia','Spark GT',2015,'Negro','TP-NTV111',20,'2025-12-15 18:59:15','2025-12-15 18:59:15'),(9,'BCB251',1,'Kia','Logan',2017,'Gris','TP-BCB251',22,'2025-12-15 18:59:16','2025-12-15 18:59:16'),(10,'LFD807',4,'Suzuki','FZ',2020,'Rojo','TP-LFD807',25,'2025-12-15 18:59:16','2025-12-15 18:59:16'),(11,'FPG901',1,'Mazda','Corolla',2020,'Verde','TP-FPG901',25,'2025-12-15 18:59:16','2025-12-15 18:59:16'),(12,'LMD130',4,'Yamaha','FZ',2012,'Beige','TP-LMD130',25,'2025-12-15 18:59:16','2025-12-15 18:59:16'),(13,'AUB022',4,'Honda','XR',2019,'Azul','TP-AUB022',23,'2025-12-15 18:59:16','2025-12-15 18:59:16'),(14,'DXT363',1,'Nissan','Duster',2012,'Beige','TP-DXT363',10,'2025-12-15 18:59:16','2025-12-15 18:59:16'),(15,'DFA291',1,'Renault','Duster',2022,'Blanco','TP-DFA291',10,'2025-12-15 18:59:16','2025-12-15 18:59:16'),(16,'SFT556',1,'Renault','Duster',2013,'Gris','TP-SFT556',50,'2025-12-15 18:59:16','2025-12-15 18:59:16'),(17,'FFM348',1,'Mazda','Corolla',2011,'Negro','TP-FFM348',44,'2025-12-15 18:59:16','2025-12-15 18:59:16'),(18,'GNK561',1,'Kia','Corolla',2020,'Rojo','TP-GNK561',15,'2025-12-15 18:59:16','2025-12-15 18:59:16'),(19,'VBK479',2,'Toyota','Rio',2017,'Beige','TP-VBK479',11,'2025-12-15 18:59:16','2025-12-15 18:59:16'),(20,'LPR876',1,'Chevrolet','Logan',2010,'Azul','TP-LPR876',11,'2025-12-15 18:59:16','2025-12-15 18:59:16'),(21,'WFH767',1,'Chevrolet','March',2022,'Beige','TP-WFH767',21,'2025-12-15 18:59:16','2025-12-15 18:59:16'),(22,'PKT075',1,'Toyota','Rio',2022,'Verde','TP-PKT075',21,'2025-12-15 18:59:16','2025-12-15 18:59:16'),(23,'GTB236',1,'Toyota','Corolla',2016,'Azul','TP-GTB236',38,'2025-12-15 18:59:16','2025-12-15 18:59:16'),(24,'WFX699',2,'Chevrolet','Rio',2024,'Plata','TP-WFX699',38,'2025-12-15 18:59:16','2025-12-15 18:59:16'),(25,'GRF532',1,'Nissan','Sail',2014,'Negro','TP-GRF532',38,'2025-12-15 18:59:16','2025-12-15 18:59:16'),(26,'ZTX764',2,'Kia','Rio',2017,'Plata','TP-ZTX764',13,'2025-12-15 18:59:16','2025-12-15 18:59:16'),(27,'LSV632',4,'Honda','NKD',2022,'Rojo','TP-LSV632',13,'2025-12-15 18:59:16','2025-12-15 18:59:16'),(28,'UXX786',1,'Toyota','Rio',2019,'Beige','TP-UXX786',41,'2025-12-15 18:59:16','2025-12-15 18:59:16'),(29,'GEF153',2,'Nissan','Sail',2020,'Gris','TP-GEF153',31,'2025-12-15 18:59:16','2025-12-15 18:59:16'),(30,'BZZ309',4,'Honda','Gixxer',2014,'Amarillo','TP-BZZ309',16,'2025-12-15 18:59:16','2025-12-15 18:59:16'),(31,'RSS765',1,'Renault','Rio',2015,'Gris','TP-RSS765',14,'2025-12-15 18:59:16','2025-12-15 18:59:16'),(32,'GXW554',1,'Chevrolet','Versa',2010,'Negro','TP-GXW554',47,'2025-12-15 18:59:16','2025-12-15 18:59:16'),(33,'XNB149',4,'Yamaha','NKD',2019,'Gris','TP-XNB149',47,'2025-12-15 18:59:16','2025-12-15 18:59:16'),(34,'DLJ509',1,'Renault','Mazda 3',2014,'Rojo','TP-DLJ509',47,'2025-12-15 18:59:16','2025-12-15 18:59:16'),(35,'UFJ472',3,'Mazda','Sandero',2019,'Blanco','TP-UFJ472',48,'2025-12-15 18:59:16','2025-12-15 18:59:16'),(36,'XXU944',4,'Bajaj','Gixxer',2013,'Blanco','TP-XXU944',35,'2025-12-15 18:59:16','2025-12-15 18:59:16'),(37,'SGM950',4,'Bajaj','Gixxer',2017,'Negro','TP-SGM950',35,'2025-12-15 18:59:16','2025-12-15 18:59:16'),(38,'AGL164',1,'Chevrolet','Picanto',2021,'Verde','TP-AGL164',35,'2025-12-15 18:59:16','2025-12-15 18:59:16'),(39,'SGY649',3,'Renault','Versa',2010,'Blanco','TP-SGY649',5,'2025-12-15 18:59:16','2025-12-15 18:59:16'),(40,'HNY545',4,'Honda','FZ',2013,'Verde','TP-HNY545',45,'2025-12-15 18:59:16','2025-12-15 18:59:16'),(41,'CEA566',3,'Renault','Rio',2020,'Negro','TP-CEA566',45,'2025-12-15 18:59:16','2025-12-15 18:59:16'),(42,'CYY603',1,'Toyota','Yaris',2019,'Azul','TP-CYY603',45,'2025-12-15 18:59:16','2025-12-15 18:59:16'),(43,'FAX994',4,'Suzuki','Pulsar',2017,'Azul','TP-FAX994',33,'2025-12-15 18:59:16','2025-12-15 18:59:16'),(44,'ZDN783',1,'Kia','Rio',2016,'Verde','TP-ZDN783',31,'2025-12-15 18:59:16','2025-12-15 18:59:16'),(45,'ETK578',1,'Renault','Spark GT',2011,'Rojo','TP-ETK578',23,'2025-12-15 18:59:16','2025-12-15 18:59:16'),(46,'WMR961',1,'Mazda','Yaris',2018,'Negro','TP-WMR961',NULL,'2025-12-15 18:59:16','2025-12-15 18:59:16'),(47,'XJT152',1,'Chevrolet','Picanto',2014,'Azul','TP-XJT152',NULL,'2025-12-15 18:59:16','2025-12-15 18:59:16'),(48,'GPE123',3,'Nissan','Corolla',2012,'Gris','TP-GPE123',39,'2025-12-15 18:59:16','2025-12-15 18:59:16'),(49,'HUK832',1,'Kia','Duster',2024,'Verde','TP-HUK832',24,'2025-12-15 18:59:16','2025-12-15 18:59:16'),(50,'NTS075',4,'AKT','Gixxer',2021,'Amarillo','TP-NTS075',NULL,'2025-12-15 18:59:16','2025-12-15 18:59:16'),(51,'MKT457',4,'Honda','Gixxer',2016,'Beige','TP-MKT457',1,'2025-12-15 18:59:16','2025-12-15 18:59:16'),(52,'LRV408',1,'Mazda','Logan',2018,'Plata','TP-LRV408',2,'2025-12-15 18:59:16','2025-12-15 18:59:16'),(53,'WDH594',4,'AKT','FZ',2017,'Amarillo','TP-WDH594',3,'2025-12-15 18:59:16','2025-12-15 18:59:16'),(54,'LYG577',1,'Kia','Spark GT',2023,'Beige','TP-LYG577',4,'2025-12-15 18:59:16','2025-12-15 18:59:16'),(55,'HPD327',4,'Yamaha','XR',2013,'Verde','TP-HPD327',12,'2025-12-15 18:59:16','2025-12-15 18:59:16'),(56,'NZU686',4,'AKT','Pulsar',2019,'Beige','TP-NZU686',6,'2025-12-15 18:59:16','2025-12-15 18:59:16'),(57,'VYR714',2,'Toyota','Mazda 3',2023,'Rojo','TP-VYR714',7,'2025-12-15 18:59:16','2025-12-15 18:59:16'),(58,'CBW253',4,'Suzuki','Pulsar',2022,'Verde','TP-CBW253',8,'2025-12-15 18:59:16','2025-12-15 18:59:16'),(59,'UKR164',4,'Suzuki','Gixxer',2022,'Azul','TP-UKR164',9,'2025-12-15 18:59:16','2025-12-15 18:59:16'),(60,'AMT828',4,'TVS','Gixxer',2015,'Amarillo','TP-AMT828',42,'2025-12-15 18:59:16','2025-12-15 18:59:16'),(61,'NPE150',1,'Mazda','Logan',2024,'Plata','TP-NPE150',34,'2025-12-15 18:59:16','2025-12-15 18:59:16'),(62,'BBJ417',4,'Suzuki','NKD',2017,'Gris','TP-BBJ417',26,'2025-12-15 18:59:16','2025-12-15 18:59:16'),(63,'LDE216',2,'Renault','Logan',2016,'Rojo','TP-LDE216',32,'2025-12-15 18:59:16','2025-12-15 18:59:16'),(64,'VTN678',1,'Chevrolet','Versa',2011,'Rojo','TP-VTN678',29,'2025-12-15 18:59:16','2025-12-15 18:59:16'),(65,'AVL307',4,'TVS','Gixxer',2013,'Beige','TP-AVL307',30,'2025-12-15 18:59:16','2025-12-15 18:59:16'),(66,'CJP256',4,'Honda','Sport',2017,'Beige','TP-CJP256',28,'2025-12-15 18:59:16','2025-12-15 18:59:16'),(67,'ZWF943',2,'Mazda','Picanto',2010,'Gris','TP-ZWF943',49,'2025-12-15 18:59:16','2025-12-15 18:59:16'),(68,'BCK969',4,'Yamaha','FZ',2017,'Negro','TP-BCK969',43,'2025-12-15 18:59:16','2025-12-15 18:59:16'),(69,'LKN198',2,'Chevrolet','Sandero',2017,'Beige','TP-LKN198',37,'2025-12-15 18:59:16','2025-12-15 18:59:16'),(70,'MFR288',1,'Chevrolet','Sandero',2022,'Beige','TP-MFR288',19,'2025-12-15 18:59:16','2025-12-15 18:59:16'),(71,'SPH021',1,'Kia','Yaris',2015,'Blanco','TP-SPH021',17,'2025-12-15 18:59:16','2025-12-15 18:59:16'),(72,'PVN841',1,'Renault','Sandero',2020,'Beige','TP-PVN841',27,'2025-12-15 18:59:16','2025-12-15 18:59:16'),(73,'CSC300',4,'Honda','XR',2014,'Verde','TP-CSC300',40,'2025-12-15 18:59:16','2025-12-15 18:59:16'),(74,'EBQ787',1,'RENAULT','SANDERO LIFE+',2018,'GRIS ESTRELLA','A812UD60444',51,'2025-12-17 14:09:36','2025-12-17 14:09:36'),(75,'IBZ133',1,'RENAULT','LOGAN',2006,'ROJO ALMAGRO','A71OUB59932',52,'2025-12-17 14:09:36','2025-12-17 14:09:36'),(76,'OGK46F',1,'VICTORY','ADVANCE R',2020,'BLANCO NEGRO','1P50FMHHJ1599142',53,'2025-12-17 14:09:36','2025-12-17 14:09:36'),(77,'YIO35F',1,'BAJAJ','PULSAR NS 200 FI',2022,'AZUL PLASMA','JLXCMD66482',54,'2025-12-17 14:09:36','2025-12-17 14:09:36'),(78,'DVV355',1,'TOYOTA','HILUX',2020,'GRIS METALICO','2GD-4795709',55,'2025-12-17 14:09:36','2025-12-17 14:09:36'),(79,'BOY284',1,'CHEVROLET','CORSA @CTIVE',2004,'AZUL EUROPA','2H0006186',56,'2025-12-17 14:09:36','2025-12-17 14:09:36'),(80,'QFA839',1,'JEEP','GRAND CHEROKEE',1996,'BEIGE CHAMPAGNA','******',57,'2025-12-17 14:09:36','2025-12-17 14:09:36'),(81,'ARP47',1,'YAMAHA','XTZ-125',2006,'AZUL','E371E001963',58,'2025-12-17 14:09:36','2025-12-17 14:09:36'),(82,'GRF743',1,'CHEVROLET','CAPTIVA SPORT',2011,'PLATA SABLE','CBS560348',59,'2025-12-17 14:09:36','2025-12-17 14:09:36'),(83,'ICL313',1,'CHEVROLET','SPARK',2007,'PLATA ESCUNA','B10S1717894KA2',60,'2025-12-17 14:09:36','2025-12-17 14:09:36'),(84,'WCM09D',1,'TVS','TVS SPORT',2016,'NEGRO VERDE','DF5AG1190601',61,'2025-12-17 14:09:36','2025-12-17 14:09:36'),(85,'MWK711',1,'CHERY','YOYO',2013,'BLANCO CHERY','SQR472WBAFCF05132',62,'2025-12-17 14:09:36','2025-12-17 14:09:36'),(86,'UUR333',1,'CHEVROLET','SAIL',2015,'ROJO LISBOA','LCU*142900052*',64,'2025-12-17 14:09:36','2025-12-17 14:09:36'),(87,'HBB475',1,'CHEVROLET','LUV KB 21',1985,'VERDE OTO?AL','804925',65,'2025-12-17 14:09:36','2025-12-17 14:09:36'),(88,'ABC123',1,'CHEVROLET','LUV KB 22',1986,'NEGRO VERDE','804926',66,'2025-12-17 14:09:36','2025-12-17 14:09:36');
/*!40000 ALTER TABLE `vehiculos` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-17 15:29:20
