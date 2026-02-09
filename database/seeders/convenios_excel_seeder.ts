// database/seeders/convenios_excel_seeder.ts
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Database from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'
import Hash from '@adonisjs/core/services/hash'

interface ConvenioData {
  titular: string | null
  establecimiento: string | null
  cc: string | null
  direccion: string | null
  telefono: string | null
  medioDePago: string | null
  estado: string | null
  fechaApertura: string | null
  notas: string | null
}

// 📊 DATOS DE LOS 687 CONVENIOS (extraídos del Excel)
const DATOS_CONVENIOS: ConvenioData[] = [
  {
    "titular": "ABRAHAN BETANCOURT / TALLER EL PAISA",
    "establecimiento": "TALLER EL PAISA",
    "cc": "11128421140",
    "direccion": "TV11 SUR N 15-64 B RICAURTE P ALTA",
    "telefono": "3144821426",
    "medioDePago": "EFECTIVO",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "ALEXANDER CORTES BARRETO/ TALLER MI REY",
    "establecimiento": "TALLER EXOSTOS Y TANQUES MI REY",
    "cc": "93384898",
    "direccion": "CL 20 SUR # 11 A - 92 RICAURTE",
    "telefono": "3103659302",
    "medioDePago": "EFECTIVO",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "ANA MILENA VARGAS RIVAS / LAVADERO EL MANA",
    "establecimiento": "LAVADERO EL MANA",
    "cc": "38141225",
    "direccion": "CL 21 SUR # 11 63 RICAURTE",
    "telefono": "3108842722",
    "medioDePago": "NEQUI 3114874489",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "ANDREA PRIETO / LA CASA DE LA NS",
    "establecimiento": "LA CASA DE LA NS",
    "cc": "1083881546",
    "direccion": "CLL 20 SUR N 12 37 LOCAL1",
    "telefono": "3118530209",
    "medioDePago": "EFECTIVO",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "ANGEL HORACIO CORTES/KAJ  MOTOS",
    "establecimiento": "KAJ MOTOS",
    "cc": "93366588",
    "direccion": "CLL 20 SUR NO. 11A-99",
    "telefono": "3115878000",
    "medioDePago": "NEQUI 3115878000",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "ARISTOBULO RODRÍGUEZ / TALLER ARISTI",
    "establecimiento": "TALLER ARISTI",
    "cc": "93373643",
    "direccion": "MZ I CS 2 GALAN",
    "telefono": "3012551740",
    "medioDePago": "EFECTIVO",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "ARMANDO GUZMAN / ELECTRONIGROUP",
    "establecimiento": "ELECTRONICSGROUP",
    "cc": "93368820",
    "direccion": "CALLE 20 SUR N 14-12 RICAURTE",
    "telefono": "3106250308",
    "medioDePago": "NEQUI 3106250308",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "CAMILO ANDRES GUZMAN/AC MOTOS",
    "establecimiento": "TALLER AC MOTOS",
    "cc": "1110473625",
    "direccion": "CL 20 # 14 - 26",
    "telefono": "3204190099",
    "medioDePago": "NEQUI 3194885596",
    "estado": "PROSPECTO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "DANIEL MORENO / EL PROFE",
    "establecimiento": "EFECTY",
    "cc": "14397102",
    "direccion": "Cra 11 sur 17 44 Ricaute",
    "telefono": "3015188292",
    "medioDePago": "EFECTIVO",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "ARGENIS LUNA/LUBRICANTES IBAGUE",
    "establecimiento": "LUBRICANTES IBAGUE",
    "cc": "38234985",
    "direccion": "CLL 20 SUR NO. 14-04 RICAUTE",
    "telefono": "3102798102",
    "medioDePago": "Ahorro BANCOLOMBIA 86941556720",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "GABRIEL RUIZ/DANNER PARQUEADERO",
    "establecimiento": "DANNER PARQUEADERO",
    "cc": "93365253",
    "direccion": "TV 11 SUR # 14 - 23 VENECIA",
    "telefono": "3134108134",
    "medioDePago": "EFECTIVO",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "GERMAN DAVID RAMIREZ/ MOTO RACING",
    "establecimiento": "MOTO RACING",
    "cc": "93235466",
    "direccion": "MZ C CS 9 B GALAN",
    "telefono": "3165388778",
    "medioDePago": "EFECTIVO",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "GUILLERMO SEGURA/MATRIX CAR",
    "establecimiento": "MATRIX CAR",
    "cc": "14297162",
    "direccion": "Calle 20sur #11a-103",
    "telefono": "3232319240",
    "medioDePago": "NEQUI 3232319240",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "HAYDER STEVEN RAMÍREZ HERNÁNDEZ / COMPRAVENTA",
    "establecimiento": "COMPRAVENTA",
    "cc": "1110542650",
    "direccion": "CL 17 MZ C CAS 20 SAN ISIDRO",
    "telefono": "3204471460",
    "medioDePago": "AVANCE",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "HOLMAN ROMERO ACOSTA/MULTISERVICIOS",
    "establecimiento": "MULTISERVICIOS",
    "cc": "1110516892",
    "direccion": "CL 20 SUR 13 - 33 RICAURTE",
    "telefono": "3203020970",
    "medioDePago": "EFECTIVO",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "JAIR FLOREZ",
    "establecimiento": null,
    "cc": null,
    "direccion": "AL LADO DE JOSE REYES INDEPENDIENTE EL SR SE VA PARA BOGOTA",
    "telefono": "3208176088",
    "medioDePago": "EFECTIVO",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "JESUS DARIO BERNAL/HIDRAULICOS CHUCHO",
    "establecimiento": "SERVIHIDRAULICOS CHUCHO",
    "cc": "14236927",
    "direccion": "CLL 24 # 1 - 13 SUR LAS FERIAS",
    "telefono": "3242418732",
    "medioDePago": "NEQUI 3242418732",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": "ACTUALIZACION 25/11/25"
  },
  {
    "titular": "JESUS ENRIQUE GARZON REYES/VULCANIZADORA G GAR",
    "establecimiento": "VULCANIZADORA G. GAR",
    "cc": "14233544",
    "direccion": "CL 20 SUR 12 15 RICAURTE",
    "telefono": "3228789604",
    "medioDePago": "EFECTIVO",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "JHON HENRY GUZMÁN",
    "establecimiento": null,
    "cc": null,
    "direccion": "Cll11 sur #20-86 diagonal a bomberos",
    "telefono": "3155671933",
    "medioDePago": "EFECTIVO",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "JHON JAIRO GARZON JUNIOR / SINCROREPUESTOS",
    "establecimiento": "SINCROREPUESTOS",
    "cc": "93408833",
    "direccion": "CLL 20 SUR 11A -103 RICAURTE",
    "telefono": "3173480204",
    "medioDePago": "EFECTIVO",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "JHONATAN VERA / TALLER JHONATAN VERA",
    "establecimiento": "TALLER JHONATAN",
    "cc": "1110547364",
    "direccion": "CLL 20 SUR N 11A-72",
    "telefono": "3203118874",
    "medioDePago": "EFECTIVO",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "JOSE REYES/AUTOPARTES LOA",
    "establecimiento": "TALLER DE MECANICA AUTOPARTES LOA",
    "cc": "93289662",
    "direccion": "CALLE 20 SUR N 11-75 RICAURTE",
    "telefono": "3158656518",
    "medioDePago": "EFECTIVO",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "JOSE YESID GARCIA RODRIGUEZ / TALLER Y & R",
    "establecimiento": "TALLER Y & R",
    "cc": "93376098",
    "direccion": "CLL 20 SUR # 11-72 RICAUTE",
    "telefono": "3217296280",
    "medioDePago": "NEQUI 3217296280",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "KATERIN JULIETH HERNANDEZ/JORGE MOTO J CAR",
    "establecimiento": "JORGE MOTO J CAR",
    "cc": "1054561097",
    "direccion": "CL 20 SUR 20 - 06 RICAURTE",
    "telefono": "3106038848",
    "medioDePago": "EFECTIVO",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "MARTIN ALEXIS CASTAÑO / SINCROREPUESTOS",
    "establecimiento": "SINCROREPUESTOS",
    "cc": "93361292",
    "direccion": "CLL 20 SUR 11A -103 RICAURTE",
    "telefono": "3124393348",
    "medioDePago": "EFECTIVO",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "MAURICIO GALLO/MOTOS SUR",
    "establecimiento": "MOTOS SUR",
    "cc": "1110463908",
    "direccion": "Cll 25 SUR # 2A - 18 LAS FERIAS",
    "telefono": "3112906717",
    "medioDePago": "NEQUI 3112906717",
    "estado": "PROSPECTO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "MELBA JIMÉNEZ/GESTIONES Y SOLUCIONES ANTE TRANSITO",
    "establecimiento": "GESTIONES Y SOLUCIONES ANTE TRANSITO",
    "cc": "65727814",
    "direccion": "Calle 20 SUR # 10-42 RICAURTE",
    "telefono": "3223243467",
    "medioDePago": "NEQUI 3223243467",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "NATALY MOLINA/DONDE ALDEMAR",
    "establecimiento": "DONDE ALDEMAR",
    "cc": "1110450691",
    "direccion": "CL 20 SUR 11 A 79 RICAURTE",
    "telefono": "3118855124",
    "medioDePago": "NEQUI 3118852124",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "OSCAR GARCIA/REGIGANTES",
    "establecimiento": "REGIGANTES",
    "cc": "79389473",
    "direccion": "RICAURTE CALLE 20 N 12-15 SUR RICAURTE",
    "telefono": "3229075707",
    "medioDePago": "EFECTIVO",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "PEDRO DIAZ CARPITERO/PITTER Y SUS LLANTAS",
    "establecimiento": "PITTER Y SUS LLANTAS",
    "cc": "14235031",
    "direccion": "AV SUR 13 - 38 COMBEIMA VIA ARMENIA",
    "telefono": "3123922361",
    "medioDePago": "EFECTIVO",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "ROBINSON PRECIADO/MOTOR JR",
    "establecimiento": "MOTOS JR",
    "cc": "14138505",
    "direccion": "CRA 2 # 23 - 46 ARADO PTE ALTA",
    "telefono": "3152919542",
    "medioDePago": "EFECTIVO",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "RUBEN DARIO SARMIENTO / CONSIGNATARIA MIRAMAR",
    "establecimiento": "CONSIGNATARIA MIRAMAR",
    "cc": "79516525",
    "direccion": "Calle 20 # 28-29 sur Miramar",
    "telefono": "3166387830",
    "medioDePago": "EFECTIVO",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "SNEIDER QUINTERO/SERVICIOS Y REPUESTOS PINILLA",
    "establecimiento": "SERIVICIOS Y RESPUESTOS PINILLA",
    "cc": "93386275",
    "direccion": "Calle 20 #11a-63",
    "telefono": "3223882197",
    "medioDePago": "EFECTIVO",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "VIVIANA SANCHEZ/MOTO XTREEP",
    "establecimiento": "MOTO XTREEP",
    "cc": "1110514509",
    "direccion": "CL 20 SUR 12 - 28 RICAURTE",
    "telefono": "3227641744",
    "medioDePago": "NEQUI 3227641744",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "JAIR LOAIZA/AUTOPARTES LOA",
    "establecimiento": "AUTOPARTES LOA",
    "cc": "93449093",
    "direccion": "CL 16 21 47 SAN ISIDRO SUR",
    "telefono": "3208176082",
    "medioDePago": null,
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "JHON CETINA/SINCROREPUESTOS",
    "establecimiento": "SINCROREPUESTOS",
    "cc": "79158805",
    "direccion": "CLL 20 SUR 11A -103 RICAURTE",
    "telefono": "3112536341",
    "medioDePago": "EFECTIVO",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "LUIS GABRIEL MOLINA BELTRAN",
    "establecimiento": "INDEPENDIENTE / TRAMITRANSITO ASESORES IBAGUE",
    "cc": "93411841",
    "direccion": "CALLE 20 SUR #12-40 RICAURTE",
    "telefono": "3017623440",
    "medioDePago": "NEQUI 3007977062",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "RONALD ANDRES MOSQUERA/MONSTER CARS",
    "establecimiento": "MONSTER CARS",
    "cc": "1110526132",
    "direccion": "CRR 29 SUR 19-20",
    "telefono": "3208489595",
    "medioDePago": "NEQUI 3208489595",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "BENITO ACOSTA / TALLER BENITO",
    "establecimiento": "TALLER BENITO",
    "cc": "14236122",
    "direccion": "Cll 18#1-51",
    "telefono": "3165155115",
    "medioDePago": "EFECTIVO",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "JOSE ERNESTO RIVERA MENDEZ /COLOMBIANA DE REPUESTOS",
    "establecimiento": "COLOMBIANA DE REPUESTOS",
    "cc": "93397765",
    "direccion": "Calle 18 n 1-48",
    "telefono": "3045998013",
    "medioDePago": "EFECTIVO",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "LUIS HERNADO PINZON / DANI AUTOS",
    "establecimiento": "DANI AUTOS",
    "cc": "93401122",
    "direccion": "AVENIDA 1 N 22-04 B / SAN PEDRO ALEJANDRINO",
    "telefono": "3118222872",
    "medioDePago": "EFECTIVO",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "DANIEL ROBAYO / TALLER LOS ROBAYOS",
    "establecimiento": "TALLER LOS ROBAYOS",
    "cc": "93384810",
    "direccion": "CLL 20 N 1-74",
    "telefono": "3124548971",
    "medioDePago": "NEQUI 3124548971",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "ALEXANDER CLAVIJO / ELECTRO ALEX",
    "establecimiento": "ELECTRO ALEX",
    "cc": "93391943",
    "direccion": "cra 1 NO. 19-46 b / la estacion",
    "telefono": "3132755010",
    "medioDePago": "NEQUI 3132755010",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "DAVID SUAREZ SALAS / DIRECCIONES HIDRAULICAS DAVID",
    "establecimiento": "DIRECCIONES HIDRAULICAS DAVID",
    "cc": "1000227498",
    "direccion": "CRA 1 22 04",
    "telefono": "3208658679",
    "medioDePago": "EFECTIVO",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "CARLOS ARMANDO HERNANDEZ / TALLER HERNÁNDEZ",
    "establecimiento": "TALLER HERNÁNDEZ",
    "cc": "93405814",
    "direccion": "CRA 1 NO. 22-04",
    "telefono": "3209170998 / 3124226485",
    "medioDePago": "EFECTIVO",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "JHON FERNEY SOTO / TALLER JF",
    "establecimiento": "TALER JF",
    "cc": "14395077",
    "direccion": "CRA 1 22 04",
    "telefono": "3107805621",
    "medioDePago": "NEQUI",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "MOISES PINEDA/TALLER MOISES",
    "establecimiento": "TALLER MOISES",
    "cc": "14223712",
    "direccion": "AV 1 22 04 SAN PEDRO ALEJANDRINO",
    "telefono": "3142493679",
    "medioDePago": "EFECTIVO",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "OSCAR COGUA / OSCAR CG",
    "establecimiento": "OSCAR CG",
    "cc": "2236799",
    "direccion": "CL 25 83 SAN PEDRO ALEJANDRINO",
    "telefono": "3133892234",
    "medioDePago": "EFECTIVO",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "MARTIN EMILIO RODRIGUEZ / TECNIMARTIN",
    "establecimiento": "TECNIMARTIN",
    "cc": "93371586",
    "direccion": "Av 1 #27-107 B/ San Pedro Alejandrino",
    "telefono": "3157861881",
    "medioDePago": "NEQUII 3157861881",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "JAIME ALARCON / CENTRO DE SERVICIO AUTOMOTRIZ DISY",
    "establecimiento": "CENTRO DE SERVICIO AUTOMOTRIZ DISY",
    "cc": "14137894",
    "direccion": "CLL 28 1 -18 B/ AMERICA",
    "telefono": "3209958998",
    "medioDePago": "EFECTIVO",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "ALEXANDER BERNAL / CENTRO AUTOS LA 28",
    "establecimiento": "CENTRO AUTOS LA 28",
    "cc": "93388816",
    "direccion": "CLL 28 N 1 A35 B /SAN PEDRO ALEJANDRINO",
    "telefono": "3208898264",
    "medioDePago": "NEQUI 3208898264",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "ANDREA ARIAS SAAVEDRA / ANDISAR",
    "establecimiento": "ANDISAR",
    "cc": "65783846",
    "direccion": "CRA 2 N31- 08",
    "telefono": "3185492297",
    "medioDePago": "EFECTIVO",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "WILLIAM ALONZO RUIZ LOZANO/ TALLER ALONSO",
    "establecimiento": "TALLER ALONZO",
    "cc": "93200776",
    "direccion": "CL 29 2-20 EL CLARET",
    "telefono": "3125381270",
    "medioDePago": "NEQUI 3125381270",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "LUIS RODRIGO MORALES / SERVIALEMANA SAS",
    "establecimiento": "SERVIALEMANA SAS",
    "cc": "93404400",
    "direccion": "CLL 29 No. 3-46 B. CLARET",
    "telefono": "3104833032 / 3152550162",
    "medioDePago": "EFECTIVO",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "YESID CASTAÑO / IMPOREPUESTOS DEL TOLIMA",
    "establecimiento": "IMPOREPUESTOS DEL TOLIMA",
    "cc": "5827704",
    "direccion": "CLL 29-363 CLARET",
    "telefono": "3213587120",
    "medioDePago": "NEQUI 3213587120",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "JOSÉ ALIRIO GIRALDO / TALLER LA 29",
    "establecimiento": "TALLER LA 29",
    "cc": "14232476",
    "direccion": "Cll 29#3-65",
    "telefono": "3103389366",
    "medioDePago": "EFECTIVO",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "JOSE LUIS QUICENO SANDOVAL / SUSPENSIONES LUCHO",
    "establecimiento": "SUSPENSIONES LUCHO",
    "cc": "79923239",
    "direccion": "CRA 3 29 43",
    "telefono": "3008574350",
    "medioDePago": "NEQUI 3008574350",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "OBDULIO MENDEZ / TALLER AUTOMOTRIZ OBDULIO MENDEZ",
    "establecimiento": "TALLER AUTOMOTRIZ OBDULIO MENDEZ",
    "cc": "14216954",
    "direccion": "CL 30 2 A 03 B /CLARET",
    "telefono": "3118832985",
    "medioDePago": "EFECTIVO",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "LUIS ENRIQUE DEVIA / TALLER LD MECHATRONICS",
    "establecimiento": "TALLER LD MECHATRONICS",
    "cc": "1110456620",
    "direccion": "AV GUADALEJA 31 62 LA FRANCIA",
    "telefono": "3154486917",
    "medioDePago": "NEQUI 3154486917",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "DIANA MILENA HERNÁNDEZ / ELCTROGAS",
    "establecimiento": "ELCTROGAS",
    "cc": "38141731",
    "direccion": "CL 28 # 3 - 20",
    "telefono": "3156217776",
    "medioDePago": "NEQUI 3156217776",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "DANNA LOAIZA GONZALEZ / SERVIGAS DEL TOLIMA",
    "establecimiento": "SERVIGAS DEL TOLIMA",
    "cc": "1007384664",
    "direccion": "CRA 3 27 41 CLARET",
    "telefono": "3209841320",
    "medioDePago": "EFECTIVO",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "ANDRES FELIPE PARRA / TALLER TOBA",
    "establecimiento": "TALLER TOBA",
    "cc": "1105460822",
    "direccion": "CRA 2 27 77 B/CLARET",
    "telefono": "3194969606",
    "medioDePago": "NEQUI 3194969606",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "LEONARDO ARENAS/LEO CARS",
    "establecimiento": "LEO CARS",
    "cc": "93407989",
    "direccion": "Cra 2 #27-49 b/San Pedro Alejandrino",
    "telefono": "3022262888",
    "medioDePago": "EFECTIVO",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "JONATHAN BONILLA / ELECTRONICAR",
    "establecimiento": "ELECTRONICAR",
    "cc": "14297289",
    "direccion": "CRA 2 A 27 09",
    "telefono": "3144536964",
    "medioDePago": "NEQUI 3144536964",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "HENRY AGUILERA / TALLER HA",
    "establecimiento": "TALLER HA",
    "cc": "93376778",
    "direccion": "Cll 27 #2-14",
    "telefono": "3144051454",
    "medioDePago": "NEQUI 3144051454",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "MARIA ESTI SUAREZ MEDINA / MOBIAUTOS",
    "establecimiento": "MOBIAUTOS",
    "cc": "1110474218",
    "direccion": "CRA 2 26 -65",
    "telefono": "3118913837",
    "medioDePago": "EFECTIVO",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "JOSE FAIR PARRA / CENTRO DE SERVICIO TOYOTA SAS",
    "establecimiento": "CENTRO DE SERVICIO TOYOTA SAS",
    "cc": "93407715",
    "direccion": "CL 28 AV 1 ESQUINA",
    "telefono": "3124874469",
    "medioDePago": "EFECTIVO",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "ALEJANDRO BOTERO / BYB AUTOMOTRIZ",
    "establecimiento": "BYB AUTOMOTRIZ",
    "cc": "1110581592",
    "direccion": "CL 26 2 -58 SAN PEDRO ALEJANDRINO",
    "telefono": "3156936570",
    "medioDePago": "NEQUI 3156936570",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "ALEXANDER LOPEZ / CTA",
    "establecimiento": "CTA",
    "cc": "1110461429",
    "direccion": "Cll 26 #1A-18 San pedro Alejandrino",
    "telefono": "3105804810",
    "medioDePago": "NEQUI 3105804810",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "EDGAR MONTEALEGRE / LA CASA DEL JEEP",
    "establecimiento": "LA CASA DEL JEEP",
    "cc": "93368283",
    "direccion": "CRA 2A NO. 27-49",
    "telefono": "3165050307",
    "medioDePago": "EFECTIVO",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "JOSE ALFONSO CUEVAS / TALLER DE PINTURA LUCHOS",
    "establecimiento": "TALLER DE PINTURA LUCHOS",
    "cc": "14223278",
    "direccion": "CRA 3 25 38 CLARET",
    "telefono": "3152435444",
    "medioDePago": "EFECTIVO",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "MELQUIN BONILLA / CAMPEROS Y CAMIONETAS",
    "establecimiento": "CAMPEROS Y CAMIONETAS",
    "cc": "93383118",
    "direccion": "Cra 22 CON 2",
    "telefono": "3118271032",
    "medioDePago": "EFECTIVO",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "OSCAR BARRERO/TALLER FUL CARS",
    "establecimiento": "TALLER FUL CARS",
    "cc": "93382677",
    "direccion": "Cll 23 #1A-53 b/SAN PEDRO ALEJANDRINO",
    "telefono": "3137584662",
    "medioDePago": "EFECTIVO",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "HECTOR ANDRES LIZARRALDE L. / REVIAUTOS",
    "establecimiento": "REVIAUTOS",
    "cc": "1110492300",
    "direccion": "CR1 NO 21-157 ESQUINA",
    "telefono": "3222392581",
    "medioDePago": "EFECTIVO",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "MAURICIO RODRIGUEZ/PARQUEADERO TOLIMA",
    "establecimiento": "PARQUEADERO TOLIMA",
    "cc": "5823929",
    "direccion": "CRA 1 #21-126 B SAN PEDRO ALEJANDRINO",
    "telefono": "3107570565",
    "medioDePago": "EFECTIVO",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": "SE LLAMA A DON MAURICIO PARA CONFIRMAR VIGENCIA YA QUE HAY DOS TITULARES CON EL MISMO ESTABLECIMIENTO, SE RECOMIENDA AL ASESOR ESPECIFICAR EL NOMBRE EN EL REPORTE PARA NO CONFUNDIR CONVENIOS"
  },
  {
    "titular": "ARNOLDO ROBAYO SANCHEZ / ESTACION SERVICIO TERPEL",
    "establecimiento": "ESTACION SERVICIO TERPEL",
    "cc": "5883025",
    "direccion": "CRA 1 NO. 17-88",
    "telefono": "3152108690",
    "medioDePago": "NEQUI 3152108690",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "ANTONIO RAFAEL OSPINO DAZA / TALLER LOS TECNICOS",
    "establecimiento": "TALLER LOS TECNICOS",
    "cc": "77093835",
    "direccion": "CRA 1 22 04",
    "telefono": "3204884499",
    "medioDePago": "NEQUI 3204884499",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "JOSE YATE / FUEL INJECTION",
    "establecimiento": "FUEL INJECTION",
    "cc": null,
    "direccion": "CL 30 3 59",
    "telefono": "3234641293",
    "medioDePago": "NEQUI 3234641293",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "GONZALO MOLANO / CENTRO AUTOMOTRIZ EL FLACO",
    "establecimiento": "CENTRO AUTOMOTRIZ EL FLACO",
    "cc": "2234838",
    "direccion": "AV 1- 20 -115 ARADO",
    "telefono": "3233827965",
    "medioDePago": "NEQUI 3233827965",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "DANI BURGOS /ANTERIOR  MOVILPAGOS",
    "establecimiento": "ANTERIOR MOVILPAGOS",
    "cc": "14135068",
    "direccion": "CLL 18 NO. 1-02 B. LA ESTACION",
    "telefono": "3134053649",
    "medioDePago": "NEQUI 3134053649",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "JHORMAN GARCIA/VIDRIOS JUNIOR IBAGUE",
    "establecimiento": "VIDRIOS JUNIOR IBAGUE",
    "cc": "1070329383",
    "direccion": "CALLE 21 #1-115",
    "telefono": "3228381860",
    "medioDePago": "NEQUI 3228381860",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": "ACTUALIZACION 15/01/2026 JR"
  },
  {
    "titular": "FREDY ORLANDO OSMA PINZON",
    "establecimiento": null,
    "cc": "80723692",
    "direccion": "CALLE 25 3 SUR BR LAS FERIAS",
    "telefono": "3204223271",
    "medioDePago": "NEQUI 3204223271",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "FREDY PEREZ / TALLER PEREZ",
    "establecimiento": "TALLER PEREZ",
    "cc": "93376398",
    "direccion": "CLL 25 N 01 SUR 16 LAS FERIAS",
    "telefono": "3144098464",
    "medioDePago": "EFECTIVO",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "JESUS ALBEIRO BONILLA / AUTOS Y CAMIONETAS",
    "establecimiento": "AUTOS Y CAMIONETAS",
    "cc": "93398316",
    "direccion": "CLL 24 SUR Nº 5 - 70 LAS FERIAS",
    "telefono": "3102832207",
    "medioDePago": "NEQUI 3102832207",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "JESUS MANRIQUE GIRALDO / CENTRAL DE CAJAS AUTOMATICAS",
    "establecimiento": "CENTRAL DE CAJAS AUTOMATICAS",
    "cc": "111055666",
    "direccion": "CRA 1 22 104 SAN PEDRO ALJANDRINO",
    "telefono": "3124997615",
    "medioDePago": "NEQUI 3124997615",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "JHON TEJADA / MOTOS TEJADA",
    "establecimiento": "MOTOS TEJADA",
    "cc": "1110479860",
    "direccion": "CRA 2 SUR 22 64 ARADO",
    "telefono": "3026686351",
    "medioDePago": "EFECTIVO",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "OSCAR RODRIGUEZ / FULL RACE",
    "establecimiento": "Taller hyundai La Francia \nFullrace",
    "cc": null,
    "direccion": "Cll 25 1 62",
    "telefono": "311 7181641",
    "medioDePago": "EFECTIVO",
    "estado": null,
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "JORGE JAIR NUÑEZ GUZMAN",
    "establecimiento": null,
    "cc": "93398634",
    "direccion": "AV.1-N.27-107 SAN PEDRO ALEJANDRINO",
    "telefono": "3162312470",
    "medioDePago": "NEQUI 3162312470",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "OSCAR DAVID TEJADA / DT-27",
    "establecimiento": "DT-27",
    "cc": "1110530431",
    "direccion": "CLL 25 CRA 3 SUR.N.53 FERIAS",
    "telefono": "3102068966",
    "medioDePago": "EFECTIVO",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "JOSE GRUA /PARQUEADERO TOLIMA",
    "establecimiento": "PARQUEADERO TOLIMA",
    "cc": "1102794493",
    "direccion": "CRA 1 #21-126 B SAN PEDRO ALEJANDRINO",
    "telefono": "3208051475",
    "medioDePago": "NEQUI 3208051475",
    "estado": null,
    "fechaApertura": "2025-12-10 00:00:00",
    "notas": "JR"
  },
  {
    "titular": "JOHAN REY/ DJ MOTOS MULTISERVICIOS",
    "establecimiento": "DJ MOTOS MULTISERVICIOS",
    "cc": null,
    "direccion": "CALLE 24 # 1-75 FERIAS",
    "telefono": "3508677061",
    "medioDePago": "NEQUI 3107942832",
    "estado": null,
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "RENE CELADA / TALLER CELADA",
    "establecimiento": "TALLER CELADA",
    "cc": "93385559",
    "direccion": "CLL20 N 2-30 B/ SAN PEDRO ALEJANDRINO",
    "telefono": null,
    "medioDePago": "NEQUI 3162276188",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "OSCAR ANDRES GUZMAN / COMPRAVENTA AUTOS USADOS 2",
    "establecimiento": "COMPRAVENTA AUTOS USADOS 2.",
    "cc": "1110462860",
    "direccion": "CLL18 2 CENTRO",
    "telefono": "3165403279",
    "medioDePago": "EFECTIVO",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "MARIBEL MANRRIQUE/ AUTOPARTES MM",
    "establecimiento": "AUTOPARTE MM",
    "cc": "63397006",
    "direccion": "cll 26#1 Sur San pedro Alejandrino",
    "telefono": "3012969991",
    "medioDePago": "NEQUI 3012969991",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "EFREN ARIAS/TIENDA",
    "establecimiento": "TIENDA",
    "cc": "93389986",
    "direccion": "Cll 38N 3A 15 B Los Martires",
    "telefono": "3214407192",
    "medioDePago": "EFECTIVO",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "ALVARO SANCHEZ / PARQUEADERO DAWTAWN",
    "establecimiento": "PARQUEADERO DAWTAWN",
    "cc": "93375103",
    "direccion": "CRR 4 12-71 INTERIOR",
    "telefono": "3153963912",
    "medioDePago": "EFECTIVO",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": "YM"
  },
  {
    "titular": "ANDRES MORALES / PARQUEADERO SAN JOSE",
    "establecimiento": "PARQUEADERO SAN JOSE",
    "cc": "1126250199",
    "direccion": "CR 2 7-58 LA POLA",
    "telefono": "3182292556",
    "medioDePago": "NEQUI 3182292556",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "ANTONIO FONTALB BOTERO /TALLER EL COSTEÑO",
    "establecimiento": "TALLER EL COSTEÑO",
    "cc": "8688570",
    "direccion": "Barrio Belencito calle 11 carrera 10",
    "telefono": "3118043043",
    "medioDePago": "EFECTIVO",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "DAVID ARREDONDO BURITICA / LAVADERO LOS COCHES",
    "establecimiento": "LAVADERO LOS COCHES",
    "cc": "1110534581",
    "direccion": "CLL3 NO. 11-08 B. BELEN",
    "telefono": "3115747971",
    "medioDePago": "Ahorro BANCOLOBIA AHORRO A LA MANO 03115747971",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "ELICEO MALDONADO/ PARQUEADERO KUKI",
    "establecimiento": "PARQUEADERO DON KUKI",
    "cc": "93365327",
    "direccion": "Cll 11 con 1 centro",
    "telefono": "3202058213",
    "medioDePago": "EFECTIVO",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "GERMAN AUGUSTO VARON RENGIFO/SERVIREPUESTOS VARON",
    "establecimiento": "SERVIREPUESTOS VARON",
    "cc": "93368676",
    "direccion": "CLL 17 N 14-82 BARRIO ANCON",
    "telefono": "3113001614",
    "medioDePago": "NEQUI 3113001614",
    "estado": "INACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "JORGE ROBAYO / PARQUEADERO LA 115",
    "establecimiento": "PARQUEADERO LA 115",
    "cc": "1049619714",
    "direccion": "CLL 15 NO. 1-49 SUR CENTRO",
    "telefono": "3214153161",
    "medioDePago": "Ahorro AHORRO A LA MANO 03214153161",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "LUIS ALFREDO URREA / TALLER COLOMBIA",
    "establecimiento": "TALLER COLOMBIA",
    "cc": "93409373",
    "direccion": "CRA 1 NO. 17-98 B. CENTRO",
    "telefono": "3223149220",
    "medioDePago": "EFECTIVO",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "LUIS ANGEL GONGORA BOLIVAR/DISTRIBUIDOR BATERIAS",
    "establecimiento": "DISTRIBUIDOR BATERIAS",
    "cc": "1110526796",
    "direccion": "AV GUABINAL CRA 8 No 15-45",
    "telefono": "3143249941",
    "medioDePago": "NEQUI 3143249941",
    "estado": "ACTIVO",
    "fechaApertura": "VISITA 09-OCT-25",
    "notas": "YM"
  },
  {
    "titular": "LUIS EDUARDO CULMA /LA CUARTA PARQUEADERO",
    "establecimiento": "LA CUARTA PARQUEADERO",
    "cc": "93239268",
    "direccion": "CRA 4 N 17-56",
    "telefono": "3104366945",
    "medioDePago": "EFECTIVO",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "MARIA DEL CARMEN SOCHA / PARQUEADERO LA NUEVA U",
    "establecimiento": "PARQUEADERO LA NUEVA U",
    "cc": "3102972975",
    "direccion": "CR 1 N 10 56 CENTRO",
    "telefono": "3102972975",
    "medioDePago": "NEQUI 3102972975",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "MARIO ALBERTO CASAS / PARQUEADERO U COOPERATIVA",
    "establecimiento": "PARQUEADERO U COOPERATIVA",
    "cc": "19247700",
    "direccion": "CLL 10 NO. 1-80 LA POLA",
    "telefono": "3134753064",
    "medioDePago": "Ahorro BANCOLOMBIA 61660861445",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "VERONICA SALAZAR / EL MANA",
    "establecimiento": "EL MANA",
    "cc": "11030606736",
    "direccion": "CRA 4 N 17-34 CENTRO",
    "telefono": "3046389962",
    "medioDePago": "NEQUI 3046389962",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "VICTOR ROMERO / LAVADERO DE CARROS PARK",
    "establecimiento": "LAVADERO DE CARROS PARK",
    "cc": "79646822",
    "direccion": "CRA 11A 4 29",
    "telefono": "3133823376",
    "medioDePago": "EFECTIVO",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "WILSON GOMEZ / PARQUEADERO LA 17",
    "establecimiento": "PARQUEADERO LA 17",
    "cc": "70694873",
    "direccion": "CL 17 # 2 - 70",
    "telefono": "3106746423",
    "medioDePago": "NEQUI 3106746423",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },

  {
    "titular": "MAURICIO DURAN / DM MOTOS",
    "establecimiento": "DM MOTOS",
    "cc": "1108999220",
    "direccion": "CRA 5 6 02",
    "telefono": "3103109374",
    "medioDePago": "NEQUI 3214428077",
    "estado": "INACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "JUAN PABLO CERVERA / CLUB RACING",
    "establecimiento": "CLUB RACING",
    "cc": "110505980",
    "direccion": "CL 5 A 11 B 24 SAN DIEGO",
    "telefono": "3144242410",
    "medioDePago": "NEQUI 3144242410",
    "estado": "INACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "ROBINSON GOMEZ",
    "establecimiento": null,
    "cc": "93360739",
    "direccion": "CRA 7 10 A 07 CENTENARIO",
    "telefono": "3144030260",
    "medioDePago": "EFECTIVO",
    "estado": "INACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "JENIFER GALLEGO /PARQUEADERO MICHELL",
    "establecimiento": "PARQUEADERO MICHELL",
    "cc": "1110551706",
    "direccion": "CRA 4 13 34 CENTRO",
    "telefono": "3212519274",
    "medioDePago": "EFECTIVO",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "HANS ROJAS MAYORGA / PARQUEADERO centro",
    "establecimiento": "PARQUEADERO",
    "cc": "14222305",
    "direccion": "CRA 3 A 14 A 07 ESQUINA CENTRO",
    "telefono": "3153276691",
    "medioDePago": "EFECTIVO",
    "estado": "INACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "HENRY MORAS VILLEGAS / TALLER MORA AUTOS",
    "establecimiento": "TALLER MORA AUTOS",
    "cc": "14220950",
    "direccion": "CRL 17 1 79 CENTRO",
    "telefono": "3162312470",
    "medioDePago": "EFECTIVO",
    "estado": "INACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "NELSON OBANDO/INDEPENDIENTE",
    "establecimiento": "INDEPENDIENTE",
    "cc": "1110443988",
    "direccion": "CASA1 VEREDA STA TERESA PLANTA BALTAZAR",
    "telefono": "3203729718",
    "medioDePago": "NEQUI 3203729718",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "CRISTIAN CASTILLO REYES / LAVAAUTOS LOS COCHES",
    "establecimiento": "LAVAAUTOS LOS COCHES",
    "cc": "1234640148",
    "direccion": "CRA 2#17-60",
    "telefono": "3104060987",
    "medioDePago": "EFECTIVO",
    "estado": null,
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "CRISTIAN SANTOYA",
    "establecimiento": null,
    "cc": null,
    "direccion": "Cra 8 12 27 20 de julio",
    "telefono": "3227615413",
    "medioDePago": "NEQUI 3227615413",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "JONNY RODRIGUEZ RIVERA/PARQUEADERO LIMONAR",
    "establecimiento": "PARQUEADERO LIMONAR",
    "cc": null,
    "direccion": "CRA 5 #12-45 BARRIO CENTRO",
    "telefono": "3219136812",
    "medioDePago": "EFECTIVO",
    "estado": null,
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "ALEJANDRO RESTREPO / SOAT",
    "establecimiento": null,
    "cc": "1007884147",
    "direccion": "CRA 43 SUR # 145 - 115",
    "telefono": "3213958024",
    "medioDePago": "NEQUI 3213958024",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "CARLOS EDUARDO JARAMILLO/CONCESIONARIO DISTRIBUYA",
    "establecimiento": "DISTRIBUYA",
    "cc": "1110522259",
    "direccion": "CLL16 CRA8 ESQUINA",
    "telefono": "3178862273",
    "medioDePago": "NEQUI 3178862273",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "ALEJANDRO MANCHOLA / CONCESIONARIO DISTRIBUYA",
    "establecimiento": "DISTRIBUYA",
    "cc": "5824737",
    "direccion": "CL 16 CON 8",
    "telefono": "3123793435",
    "medioDePago": "NEQUI: 3123793435",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "ALEXANDER AREVALO / SERMECTOL",
    "establecimiento": "SERMECTOL",
    "cc": "1032377706",
    "direccion": "Cra. 5 #23-75",
    "telefono": "3183247398",
    "medioDePago": "EFECTIVO",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "ANDREY PINZÓN GARCIA",
    "establecimiento": "INDEPENDIENTE",
    "cc": "1006031470",
    "direccion": "CLL 22 №6-71 barrio el carmen",
    "telefono": "3015410651",
    "medioDePago": "Nequi 3015410651",
    "estado": "ACTIVO",
    "fechaApertura": "2025-10-02 00:00:00",
    "notas": "ACTUALIZACION 28/11/2025"
  },
  {
    "titular": "ANYELO FLORES",
    "establecimiento": "INDEPENDIENTE/TALLER",
    "cc": "93413926",
    "direccion": "TALLER CRA 7 CON 22 OTIS",
    "telefono": "3248229507",
    "medioDePago": "NEQUI 3186755084",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "CARLOS EMILIO SANTOS / MONTEGRANARIO",
    "establecimiento": "MONTEGRANARIO",
    "cc": "93406686",
    "direccion": "CRA 7 CON 22-64",
    "telefono": "3175903744",
    "medioDePago": "NEQUI:3175903744",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "DAGOBERTO SUAREZ/AUTO SUAREZ",
    "establecimiento": "AUTO SUAREZ",
    "cc": "80778713",
    "direccion": "Cll 21 #5-97 B/ Carmen",
    "telefono": "3115688063",
    "medioDePago": "NEQUI 3115688063",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": "ACTUALIZACION 27/11/2025"
  },
  {
    "titular": "DAVID ARLEY CHICO/ CLEAN CARS 19",
    "establecimiento": "CLEAN CARS 19",
    "cc": "1110508757",
    "direccion": "CL 19 CRA 7 6 75",
    "telefono": "3177440518",
    "medioDePago": "NEQUI 3177440518",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": "ACTUALIZACION 25/11/25"
  },
  {
    "titular": "DIEGO FRANCO/MOTOS LA 25",
    "establecimiento": "MOTOS LA 25",
    "cc": "1110456519",
    "direccion": "CL 25 # 5 - 74 BELARCAZAR",
    "telefono": "3112602492",
    "medioDePago": "NEQUI 3112602492",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "ELIECER ARBEY TORRES FAJARDO",
    "establecimiento": "******",
    "cc": null,
    "direccion": "CL 23 N 5A 48 EL CARMEN",
    "telefono": "3022439841",
    "medioDePago": "Ahorro AHORRO A LA MANO 03022439841",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "FRANCISCO JOSE SALGADO/SERVIAUTOS SALGADO",
    "establecimiento": "SRVIAUTOS SALGADO",
    "cc": "93402406",
    "direccion": "CRA 6 NO. 21 -66",
    "telefono": "3222239210",
    "medioDePago": "NEQUI 3138070551",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": "ACTUALIZACION 27/11/2025"
  },
  {
    "titular": "FREDY ARANGON / ARG AUTOMOTRIZ",
    "establecimiento": "ARG AUTOMOTRIZ",
    "cc": "79058262",
    "direccion": "cra 7 #23-36 El carmen",
    "telefono": "3182102391",
    "medioDePago": "EFECTIVO",
    "estado": "ACTIVO",
    "fechaApertura": "2025-10-02 00:00:00",
    "notas": "ACTUALIZACION 28/11/2025"
  },
  {
    "titular": "GERMAN CONTRERAS ALZATE TALLER BERLIN",
    "establecimiento": "TALLER BERLIN",
    "cc": "93471820",
    "direccion": "Cr6 #2-45",
    "telefono": "3177647573",
    "medioDePago": "EFECTIVO",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "HECTOR JULIO JAIMES BERRIOS/MULTISERVICIOS OMICRON",
    "establecimiento": "TALLER MULTISERVICIOS OMICRON",
    "cc": "1126906495 ",
    "direccion": "CR 6 21 66 B EL CARMEN",
    "telefono": "3182910277",
    "medioDePago": "NEQUI 3182910277",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": "ACTUALIZACION 27/11/2025"
  },
  {
    "titular": "HECTOR RAUL ROA/PARQUEADERO ZEUS IBAGUE",
    "establecimiento": "PARQUEADERO ZEUS IBAGUE",
    "cc": "14208791",
    "direccion": "CRA 6 N 17-65 INTERLAKEN",
    "telefono": "3194567731",
    "medioDePago": "EFECTIVO",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "HUGO TRUJILLO GARCIA/COMPREAVENTA MOTOS LA 19",
    "establecimiento": "COMPRAVENTA MOTOS LA 19",
    "cc": "93414076",
    "direccion": "CLL 19 NO. 8-32 INTERLAKEN",
    "telefono": "3112585520",
    "medioDePago": "EFECTIVO",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "JAIR TORRES/MARLEN FRANCO/SHOPING TUNNING",
    "establecimiento": "SHOPING TUNNING",
    "cc": "5822184",
    "direccion": "Carrera 6 número 23-57",
    "telefono": "310 5517681",
    "medioDePago": "NEQUI 3105517681",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": "ACTUALIZADO 02/10/2025"
  },
  {
    "titular": "JHONATAN SANDOVAL/ TALLER EL MONO",
    "establecimiento": "TALLER EL MONO",
    "cc": null,
    "direccion": "CRA 4 BIS N 28 53",
    "telefono": "3208340978",
    "medioDePago": "NEQUI 3208340978",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "JOHAN SEBASTIAN OCAMPO / PARQUEADERO LA 23 PLUS",
    "establecimiento": "PARQUEADERO LA 23 PLUS",
    "cc": "1110512230",
    "direccion": "CRR 5TA 23-35",
    "telefono": "3142959259",
    "medioDePago": "EFECTIVO",
    "estado": "INACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "JORGE ADRIAN GONZALEZ/ TALLER EL NEGRO",
    "establecimiento": "TALLER DE MECANICA EL NEGRO",
    "cc": "93385501",
    "direccion": "DIAGONAL 19 NO. 06 20 EL CARMEN",
    "telefono": "3122185970",
    "medioDePago": "NEQUI:3122185970",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "JUAN CARLOS ANDRADE /TODO FRENOS",
    "establecimiento": "TODO FRENOS",
    "cc": "93405408",
    "direccion": "DIAG 19 6 101 EL CARMEN",
    "telefono": "3164219029",
    "medioDePago": "NEQUI:3224635986",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "JUAN CARLOS MARTINEZ /MUNDIAUTOS",
    "establecimiento": "MUNDIAUTOS",
    "cc": "93398755",
    "direccion": "DIAG 19 6 95 EL CARMEN",
    "telefono": "3167403264",
    "medioDePago": "EFECTIVO",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "LUIS ALFONSO YEPES HERNANDEZ / AUTO SERVICIO YEPES",
    "establecimiento": "AUTO SERVICIO YEPES",
    "cc": "93402174",
    "direccion": "CRA 5a # 22 14 EL CARMEN",
    "telefono": "3227146554",
    "medioDePago": "NEQUI 3227146554",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "LUIS FERNANDO TRIANA/OTIEXOSTOS",
    "establecimiento": "OTIEXOSTOS",
    "cc": "93368735",
    "direccion": "Cr7 #22-64 El Carmen",
    "telefono": "3227648000",
    "medioDePago": "EFECTIVO",
    "estado": "ACTIVO",
    "fechaApertura": "ACT 27/11/2025",
    "notas": "JR"
  },
  {
    "titular": "LUIS TORRES / BACALAO",
    "establecimiento": "BACALAO",
    "cc": "10185248",
    "direccion": "CR 5 #24-39",
    "telefono": "3102074678",
    "medioDePago": "EFECTIVO",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "MARTHA ISABEL RAMIREZ / TORNIMOTOS LA 24",
    "establecimiento": "TORNIMOTOS LA 24",
    "cc": "65740362",
    "direccion": "CL 24 # 5 - 31 EL CARMEN",
    "telefono": "3155866852",
    "medioDePago": "NEQUI 3155866852",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "MIGUEL ANGEL ZAMBRANO/ACD AUTOMOTRIZ",
    "establecimiento": "ACD AUTOMOTRIZ",
    "cc": "1110506345",
    "direccion": "Cr 6#22-19 El Carmen",
    "telefono": "3127487887",
    "medioDePago": "NEQUI 3007554793",
    "estado": "ACTIVO",
    "fechaApertura": "ACT 22/12/2025",
    "notas": "NEQUI A NOMBRE DE KAREN DANIELA MARTINEZ"
  },
  {
    "titular": "OSCAR ANDRES ROJAS/TECNICENTRO AUTOS IBAGUE",
    "establecimiento": "TECNICENTRO AUTOS IBAGUE",
    "cc": "11441472",
    "direccion": "TRAV 19-6-20 DIAGONAL EL CARMEN",
    "telefono": "3197900778",
    "medioDePago": "NEQUI 3197900778",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "PABLO VILLALBA",
    "establecimiento": "INDEPENDIENTE",
    "cc": null,
    "direccion": "CRA 5 A 24 - 42",
    "telefono": "3107725085",
    "medioDePago": "EFECTIVO",
    "estado": "ACTIVA",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "RAMIRO VIAFARA/AMORTI AUTOS",
    "establecimiento": "AMORTI AUTOS",
    "cc": "94375840",
    "direccion": "DIAGONAL 19 NO. 6 110 B. EL CARMEN",
    "telefono": "3202978020",
    "medioDePago": "EFECTIVO",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "VICTOR MOSQUERA / MUNDO MOTOS MOSQUERA",
    "establecimiento": "MUNDO MOTOS MOSQUERA",
    "cc": "1075281972  ",
    "direccion": "CRA 6 19 103 EL CARMEN",
    "telefono": "3182123510",
    "medioDePago": "BANCOLOMBIA 41150566094",
    "estado": "INACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "JAIME ANDRES ORJUELA /COMPRAVENTA LA 15",
    "establecimiento": "COMPRAVENTA LA 15",
    "cc": "11222376",
    "direccion": "CRA 8 15 18",
    "telefono": "3166205344",
    "medioDePago": "EFECTIVO",
    "estado": "INACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "WILLIAM FERNANDO GALICIA / FERAN SERVICIO AUTOMOTRIZ",
    "establecimiento": "FERAN SERVICIO AUTOMOTRIZ",
    "cc": "1024485306",
    "direccion": "CRA 5A 22 84",
    "telefono": "3502283705",
    "medioDePago": "NEQUI 3178269290",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "JULIAN ARTURO VARGAS / MOTO ARMON",
    "establecimiento": "MOTO ARMON",
    "cc": "14396536",
    "direccion": "CL 23 5A 62 LOCAL 2 EL CARMEN",
    "telefono": "3016502891",
    "medioDePago": "NEQUI 3016502891",
    "estado": "INACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "WILIAM BERMUDEZ INNOVA AUTOMOTRIZ",
    "establecimiento": "INNOVA AUTOMOTRIZ",
    "cc": "14399960",
    "direccion": "CRA 6 22 15",
    "telefono": "3212404006",
    "medioDePago": "NEQUI 3212404006",
    "estado": "INACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "FABIO VARGAS / ARMOT",
    "establecimiento": "ARMOT",
    "cc": "93409462",
    "direccion": "CRA 6 23 75",
    "telefono": "3166308126",
    "medioDePago": "EFECTIVO",
    "estado": "INACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "ALEJANDRO FABIAN LOZADA/AUTOFENIX",
    "establecimiento": "AUTO FENIX",
    "cc": "80237994",
    "direccion": "CL 23 5A 48",
    "telefono": "3242820779",
    "medioDePago": "NEQUI 3138359798",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "HUGO ALEXANDER RAYO / vARREGLA MCT",
    "establecimiento": "ARREGLA MCT",
    "cc": "93411482",
    "direccion": "CRA 5 24 39",
    "telefono": "3212577004",
    "medioDePago": "BANCOLOMBIA 0682134213",
    "estado": "INACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "EDWAR RIAÑO /DETAILING STUDIO",
    "establecimiento": "DETAILING STUDIO",
    "cc": "93415451",
    "direccion": "CL 7 32",
    "telefono": "3008704270",
    "medioDePago": "NEQUI 3008704270",
    "estado": "INACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "DAVID VARON / DAVIDMOTOS",
    "establecimiento": "DAVIDMOTOS",
    "cc": "5823559",
    "direccion": "CRA 6 25 30",
    "telefono": "3219153001",
    "medioDePago": "NEQUI 3006017051",
    "estado": "INACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "GILDARDO TORRES PULECIO/AUTODIAGNOSTICO ATORRES",
    "establecimiento": "AUTODIAGNOSTIO AUTORRES",
    "cc": "14232350",
    "direccion": "CRA 8 25 97",
    "telefono": "3124871118",
    "medioDePago": "EFECTIVO",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "RUTBEL GOMEZ/RUTBEL MOTOS/RUTBEL MOTOS",
    "establecimiento": "RUTBEL MOTOS",
    "cc": "96354603",
    "direccion": "CRA 6 27 49",
    "telefono": "3143235017",
    "medioDePago": "NEQUI 3143235017",
    "estado": "INACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "CARLOS EDUARDO ESTRADA / SERVILLANTAS EL MONO",
    "establecimiento": "SERVILLANTAS EL MONO",
    "cc": "1274638058",
    "direccion": "27 con 2da carril subiendo",
    "telefono": "3102638254",
    "medioDePago": "NEQUI 3102638254",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "VICTOR LEON / MULTISERVICIOS",
    "establecimiento": "MULTISERVICIOS",
    "cc": null,
    "direccion": "calle 57A #21-45 Ambala",
    "telefono": "3133450384",
    "medioDePago": "NEQUI 3133450384",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "ARIEL ARCINIEGAS BONILLA",
    "establecimiento": null,
    "cc": null,
    "direccion": "CRA 4 C -BIS N° 28A 26",
    "telefono": "3102983426",
    "medioDePago": "EFECTIVO",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "MILLER FERNANDEZ/TALLER MONTEGRANARIO",
    "establecimiento": "TALLER MONTEGRANARIO",
    "cc": "93408635",
    "direccion": "CRA7 #22-64",
    "telefono": "3178431190",
    "medioDePago": "NEQUI: 3178431190",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "DANIELA / SERMECTOL",
    "establecimiento": "DSERMECTOL",
    "cc": null,
    "direccion": "23 CON 5 EL CARMEN",
    "telefono": "3143476723",
    "medioDePago": "EFECTIVO",
    "estado": null,
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "ALEXANDER BORJA/ALEX CARS",
    "establecimiento": "ALEX CARS",
    "cc": "10186366",
    "direccion": "Cara. 4b #22-71 B/ Carmen",
    "telefono": "3208443006",
    "medioDePago": "NEQUI 3208443006",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "ALEX OSORIO/PUNTO AUTO",
    "establecimiento": "PUNTO AUTO",
    "cc": "93382564",
    "direccion": "Cra 4 Tamana 23-77",
    "telefono": "3015035274",
    "medioDePago": "EFECTIVO",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "CARLOS HERNANDO ARIAS/ GRILLOSCAR",
    "establecimiento": "GRILLOSCAR",
    "cc": "93387566",
    "direccion": "CRA 4 ESTADIO # 24-17",
    "telefono": "3177759683",
    "medioDePago": "NEQUI:3177759683",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": "PAGO POR NEQUI Y/O DESCUENTO DIRECTO EN EL CDA PGO EFECTIVO"
  },
  {
    "titular": "FERNANDO ROJAS / TALLER MOTOLIMA SAS",
    "establecimiento": "ALLER MOTOLIMA SAS",
    "cc": "14237554",
    "direccion": "CRA 4 N 24 32",
    "telefono": "3124531368",
    "medioDePago": "Ahorro Bancolombia 07939125315",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "FIDEL TORRES / ARMORTIE",
    "establecimiento": "ARMORTIE",
    "cc": null,
    "direccion": "CLL 21№4-58",
    "telefono": "3138493580",
    "medioDePago": "3138493580",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "JAVIER VALERO / JMV AUTOMOTRIZ",
    "establecimiento": "JMV AUTOMOTRIZ",
    "cc": "93382564",
    "direccion": "CRA 4 TAMANA NO. 27-84",
    "telefono": "3164763613/3142410390",
    "medioDePago": "NEQUI 3164763613",
    "estado": "ACTIVO",
    "fechaApertura": "ACT 15/12/2025",
    "notas": "JR"
  },
  {
    "titular": "JORGE RAUL MEDINAMARTINEZ / AUDIOCARSISTEM",
    "establecimiento": "AUDIOCARSISTEM",
    "cc": "5820398",
    "direccion": "CALLE 25 N 4A-39 LOCAL/01",
    "telefono": "3157939032",
    "medioDePago": "EFECTIVO",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "JOSE EDWUIN CARDENAS / FERDINAND",
    "establecimiento": "FERDINAND",
    "cc": "93415051",
    "direccion": "Cll25 #4C-45 HIPODROMO",
    "telefono": "3108909512",
    "medioDePago": "NEQUI 3108909512",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": "  "
  },
  {
    "titular": "JOSE ORLANDO ARISTIZABAL / TALLER ARISTI",
    "establecimiento": "TALLER ARISTI",
    "cc": "93406936",
    "direccion": "CRA 4 TAMANA # 28 A - 59",
    "telefono": "3202555460",
    "medioDePago": "NEQUI 3202555460",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "JUAN CARLOS CASTRO/CLINICAR",
    "establecimiento": "CLINICAR",
    "cc": "79372573",
    "direccion": "CRA 4A TAMANA NO. 23-74",
    "telefono": "3185390291",
    "medioDePago": "EFECTIVO",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "JUAN MARTIN HERNANDEZ / TOLIMA MOTO",
    "establecimiento": "TOLIMA MOTO",
    "cc": "6012352",
    "direccion": "CRA 4 ESTADIO NO. 28-30 LA FRANCIA",
    "telefono": "3134727178",
    "medioDePago": "EFECTIVO",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "LUIS EDUARDO LOPEZ/MAKANAKY Y SUS LLANTAS",
    "establecimiento": "MACANAKY Y SUS LLANTAS",
    "cc": "93411847",
    "direccion": "Av ferrocarril 25-51",
    "telefono": "3208822202",
    "medioDePago": "EFECTIVO",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "LUIS FERNANDO VELEZ / FASAUTOS",
    "establecimiento": "FASAUTOS",
    "cc": null,
    "direccion": "Cra 4 estadio 36-26",
    "telefono": "3197043065",
    "medioDePago": "NEQUI 3232230805",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "LUIS ORLANDO GARCIA / TALLER SKODA",
    "establecimiento": "TALLER SKODA",
    "cc": "93370355",
    "direccion": "CLL 23 NO. 3-120 B. LA ESTACION",
    "telefono": "3132420639",
    "medioDePago": "NEQUI 3107547856",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": "JR"
  },
  {
    "titular": "MARTHA LUCIA GIRALDO/TALLER R Y R",
    "establecimiento": "TALLER R Y R",
    "cc": "65745211",
    "direccion": "Calle 24 #30-54",
    "telefono": "3106180212",
    "medioDePago": "NEQUI 3106180212",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "ORLANDO LOPEZ / PAQUEADERO CADIZ",
    "establecimiento": "PAQUEADERO CADIZ",
    "cc": "6027711",
    "direccion": "CL 31 CON 4 B CADIZ",
    "telefono": "3118902091",
    "medioDePago": "NEQUI 3118902091",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "WILSON ORTIZ / TALLER SUAREZ",
    "establecimiento": "TALLER SUAREZ",
    "cc": "93373587",
    "direccion": "CRA 4 TAMANA NO. 26-28",
    "telefono": "3123137091",
    "medioDePago": "EFECTIVO",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "YEIMER GUZMAN VARON / HUNDAY SERVICIOS-TURBOS",
    "establecimiento": "HUNDAY SERVICIOS-TURBOS",
    "cc": null,
    "direccion": "CLL 31A-#4B-40 LA FRANCIA",
    "telefono": "3102196760",
    "medioDePago": "EFECTIVO",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "YERLAN CABRERA QUINTERO / TOLIMANOMENTROS",
    "establecimiento": "TOLIMANOMENTROS",
    "cc": "93404417",
    "direccion": "Av Ferro #29-82",
    "telefono": "3125094795",
    "medioDePago": "EFECTIVO",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "DIEGO JAVIER CARDENAS / CUJILLANTAS",
    "establecimiento": "CUJILLANTAS",
    "cc": "1110475506",
    "direccion": "CL 23 34 SAN PEDRO ALEJANDRINO",
    "telefono": "3213629848",
    "medioDePago": "NEQUI 3123364877",
    "estado": "INACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "JUAN CARLOS PRECIADO / ALMACEN Y TALLER MECHANIXS",
    "establecimiento": "ALMACEN Y TALLER MECHANIXS",
    "cc": "1110569869",
    "direccion": "CL 24 1 01 SAN PEDRO ALEJANDRINO",
    "telefono": "3103370143",
    "medioDePago": null,
    "estado": "INACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "HUGO ALBERTO GALLO TALLER DE MOTOS MECHANIX",
    "establecimiento": "TALLER DE MOTOS MECHANIX",
    "cc": "70564270",
    "direccion": "CL 24 1 01 SAN PEDRO ALEJANDRINO",
    "telefono": "3224599867",
    "medioDePago": "EFECTIVO",
    "estado": "INACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "LUIS JAVIER DIAZ CORTES / TALLER JAVIMOTOS",
    "establecimiento": "TALLER JAVIMOTOS",
    "cc": "1234639600",
    "direccion": "CL 25 4 19",
    "telefono": "3214339547",
    "medioDePago": "NEQUI 3214339547",
    "estado": "INACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "JHON JAIRO TORRES / JHON AUTOS",
    "establecimiento": "JHON AUTOS",
    "cc": "93390467",
    "direccion": "AC FERROCARRIL CL 27 4 33",
    "telefono": "3135654777",
    "medioDePago": "NEQUI 3135654777",
    "estado": "INACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "HENRY BUCURA CASTRO / TALLER LA 27 LAMINA Y PINTURA EXPRES",
    "establecimiento": "TALLER LA 27 LAMINA Y PINTURA EXPRES",
    "cc": "93376899",
    "direccion": "CL 27 4 28",
    "telefono": "3017276717",
    "medioDePago": "NEQUI 3017276717",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "ALFONSO GALEANO / MOTO DUQUE",
    "establecimiento": "MOTO DUQUE",
    "cc": "2234975",
    "direccion": "CRA 4 ESTADIO 27 - 19 LA FRANCIA",
    "telefono": "3112199894",
    "medioDePago": "NEQUI 3112199894",
    "estado": "INACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "JEISON FABIAN DIAZ /MONTALLANTAS EL TIO",
    "establecimiento": "MONTALLANTAS EL TIO",
    "cc": "14297308",
    "direccion": "AV FERROCARRIL 23 02 SAN PEDRO ALEJANDRINO",
    "telefono": "3223237483",
    "medioDePago": "NEQUI 3223237483",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "EVER ALBERTO VERA ACRILICOS SYD",
    "establecimiento": "ACRILICOS SYD",
    "cc": "1110544551",
    "direccion": "AV FERROCARRIL 23 34 SAN PEDRO ALEJANDRINO",
    "telefono": "3013236479",
    "medioDePago": "NEQUI 3013236479",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "GERSON CARVAJAL Y MARISOL CADOSO / SOLGER CAR´S",
    "establecimiento": "SOLGER CAR´S",
    "cc": "93236183",
    "direccion": "CL 25 4 33 HIPODROMO",
    "telefono": "3102447473/3213034539",
    "medioDePago": "NEQUI 3102447473",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": "PLACA PROPIA HSP059"
  },
  {
    "titular": "JUAN DARIO PINZON SERVICIO AUTOMOTRIZ JD",
    "establecimiento": "SERVICIO AUTOMOTRIZ JD",
    "cc": "79684088",
    "direccion": "AV FERROCARRIL 31 42",
    "telefono": "3123058724",
    "medioDePago": "EFECTIVO",
    "estado": "INACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "FLANQUIN CLADERON/SERVITELSAT COLOMBIA SAS",
    "establecimiento": "SERVITELSAT COLOMBIA SAS",
    "cc": "1432380",
    "direccion": "CRA 5 # 13-13 LIBANO JARAMILLO",
    "telefono": "3209251578-3044148511",
    "medioDePago": "NEQUI 3185586002",
    "estado": "-",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "JULIAN ANGULO / AUTOLIMPIO",
    "establecimiento": "AUTOLIMPIO",
    "cc": "65779211",
    "direccion": "Carrera 3 No 4-19",
    "telefono": "3507850009",
    "medioDePago": "NEQUI 3046549175",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "JESSICA TEJADA / CLICKSEGUROS",
    "establecimiento": "CLICKSEGUROS",
    "cc": null,
    "direccion": "CRA 5A 24- 42 B EL CARMEN",
    "telefono": "3125087586",
    "medioDePago": "NEQUI:3125087586",
    "estado": "-",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "HERNAN MAURICIO/ FRENY PIJAO",
    "establecimiento": "FRENY PIJAO",
    "cc": "1085264362",
    "direccion": "CRA 4B NO. 23-88 EL CARMEN",
    "telefono": "3028551304",
    "medioDePago": "NEQUI 3028551304",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "ANDREY AGUIRRE / MECANICA Y SUPENSION ANDREY",
    "establecimiento": "MECANICA Y SUPENSION ANDREY",
    "cc": "1111453794",
    "direccion": "CRA4B #22-71 EL CARMEN",
    "telefono": "3123552426",
    "medioDePago": "NEQUI 3123552426",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "JUAN PABLO GIRALDO/ TALLER JPABLO CAJAS AUTOMATICAS JP",
    "establecimiento": "TALLERJPABLO CAJAS AUTOMATICAS JP",
    "cc": "93391150",
    "direccion": "CLL 24 NO. 4A-46",
    "telefono": "3158517360",
    "medioDePago": "NEQUI 3158517360",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "JHON ANDERSON CARVAJAL SANDOVAL / SERVICIO TECNICO AUTOMOTRIZ",
    "establecimiento": "SERVICIO TECNICO AUTOMOTRIZ",
    "cc": "1005752927",
    "direccion": "CRA 4 TAMANA# 23-68 BARRIO EL CARMEN",
    "telefono": "3204843308",
    "medioDePago": "NEQUI:3204843308",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": "VEHICULO PROPIO HRL667 MOTO GQB23E"
  },
  {
    "titular": "ALEXANDER ARIAS MARTINEZ/VENTURY CARS",
    "establecimiento": "VENTURY CARS",
    "cc": "93373553",
    "direccion": "CRA 4 ESTADIO NO. 24-17",
    "telefono": "3008181380",
    "medioDePago": "EFECTIVO",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": "GENERAR DESCUENTO DIRECTO PARA LAS PLACAS REFERENCIADA, TAXI WTO970 PARTICULAR WTI647"
  },
  {
    "titular": "HEBERTH GAVIRIA / IBAUTOS",
    "establecimiento": "IBAUTOS",
    "cc": "14226859",
    "direccion": "CLL 34 # 33-45",
    "telefono": "3132247284",
    "medioDePago": "EFECTIVO",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "EDUARDO ORJUELA / FRENOS EDWARD",
    "establecimiento": "FRENOS EDWARD",
    "cc": "933832203",
    "direccion": "cll 29 #4 A tamana",
    "telefono": "3112147409",
    "medioDePago": "NEQUI 3112147409",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "JULIO CESAR ORTIZ/ JULIO CHICHARRON",
    "establecimiento": "JULIO CHICHARRON",
    "cc": "14234088",
    "direccion": "CL 25 # 4A 45 EL CARMEN",
    "telefono": "3143386645",
    "medioDePago": "EFECTIVO",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "MARCO ARTURO GALLEGO / CUJILLLANTAS",
    "establecimiento": "CUJILLLANTAS",
    "cc": "14295674",
    "direccion": "CLL 23 34 FERROCARRIL B SAN PEDRO ALEJANDRINO",
    "telefono": "3208882161",
    "medioDePago": "EFECTIVO",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "BLADIMIR PAEZ/LEVEL LAVAUTOS Y DETAILING",
    "establecimiento": "LEVEL LAVAUTOS Y DETAILING",
    "cc": null,
    "direccion": "AV- FERROCARRIL CON 24",
    "telefono": "3181606759",
    "medioDePago": "EFECTIVO",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "GIOVANNI CARDONA / POLISKAR",
    "establecimiento": "POLISKAR",
    "cc": "93402431",
    "direccion": "AV FERROCARRIL NO. 25-38",
    "telefono": "3163077615",
    "medioDePago": "EFECTIVO",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "HERMES BARBOSA SIERRA / LUJOS OLICAR",
    "establecimiento": "LUJOS OLICAR",
    "cc": "93392903",
    "direccion": "AV FERROCARRIL NO. 25-64",
    "telefono": "3203411937",
    "medioDePago": "NEQUI 3203411937",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "LIBARDO VARON /SERVITECA PISYCARD",
    "establecimiento": "SERVITECA PISYCARD",
    "cc": null,
    "direccion": "CRA4 ESTADIO #28-30",
    "telefono": "3212185729",
    "medioDePago": "EFECTIVO",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "JORGE MARIO MARTINEZ / UNIVERSO AUTOMOTRIZ",
    "establecimiento": "UNIVERSO AUTOMOTRIZ",
    "cc": "93375760",
    "direccion": "AV FANTASMA",
    "telefono": "3152604034",
    "medioDePago": "NEQUI 3152604034",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "ABEL GRISALES / AGENTE",
    "establecimiento": "AGENTE",
    "cc": "14395686",
    "direccion": "AV FERROCARRIL 35 - 03",
    "telefono": "3162946132",
    "medioDePago": "NEQUI 3162946132",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "HENRY ALONSO CALDERON / EL GORDO CALDERON",
    "establecimiento": "EL GORDO CALDERON",
    "cc": "93355720",
    "direccion": "Cr 4 Estadio # 38-09 FALLECIO CONVENIO",
    "telefono": "3112675506",
    "medioDePago": "EFECTIVO",
    "estado": "INACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "JUAN DAVID BARRAGÁN/PARQUEADERO LA 25",
    "establecimiento": "PARQUEADERO LA 25",
    "cc": "1110472727",
    "direccion": "CLL 25 # 4 A 61 65 EL CARMEN",
    "telefono": "3018206244",
    "medioDePago": "NEQUI:3018206244",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "JUAN CARLOS ESPINOZA/SINCROIBAGUE",
    "establecimiento": "SINCROIBAGUE",
    "cc": "93392974",
    "direccion": "Calle 20 #4b-25",
    "telefono": "3108121839",
    "medioDePago": "NEQUI 3108121839",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "FERNANDO SANDOVAL /LAVADERO DETALYING",
    "establecimiento": "LAVADERO DETALYING",
    "cc": "1005700372",
    "direccion": "AV FERROCARRIL 24-72",
    "telefono": "3133732878",
    "medioDePago": "NEQUI 3185402207",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "IVAN QUIROGA / NAT AUTOS",
    "establecimiento": "NAT AUTOS",
    "cc": "28927490",
    "direccion": "CLL 23 NO.7-17 BARRIO EL CARMEN",
    "telefono": "3156681958",
    "medioDePago": "EFECTIVO",
    "estado": "ACTIVO",
    "fechaApertura": "2025-10-02 00:00:00",
    "notas": "ACTUALIZCION 28/112025"
  }
 ,
  {
    "titular": "ALEX CARVAJAR",
    "establecimiento": null,
    "cc": null,
    "direccion": "CR 1 N 79 -25 VALPARAISO",
    "telefono": "3175170056",
    "medioDePago": "NEQUI 3175170056",
    "estado": "-",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "ALEXANDER MORALES",
    "establecimiento": null,
    "cc": "93390242",
    "direccion": "CL 160 21 SUR 70 SAMAN",
    "telefono": "3142849482",
    "medioDePago": "NEQUI 3005606863",
    "estado": "-",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "ALVARO AGUSTO PERDOMO VARON/TALLER PERDOMO",
    "establecimiento": "TALLER PERDOMO",
    "cc": null,
    "direccion": "CRA 13 N 13 03 GAITAN",
    "telefono": "3118836632",
    "medioDePago": "EFECTIVO",
    "estado": "-",
    "fechaApertura": null,
    "notas": "ACTUALIZADO 13/01/2026 JR"
  },
  {
    "titular": "BARIAN CAMILO MEDRANO AMPUDIA /MACTORNO",
    "establecimiento": "MACTORNO",
    "cc": "1110579924",
    "direccion": "av ambala n 34-40 B GAITAN P ALTA",
    "telefono": "3178706057",
    "medioDePago": "EFECTIVO",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "CLARIVET ZAMUDIO / AUTOCLAR",
    "establecimiento": "AUTOCLAR",
    "cc": "65750625",
    "direccion": "CRA 11 NO. 34- 26 GAITAN PARTE ALTA",
    "telefono": "3164644960",
    "medioDePago": "NEQUI 3162682015",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "DANIEL FERNANDO GARCÍA VIÑA / PINTUFIBRA EL MAGO",
    "establecimiento": "PINTUFIBRA EL MAGO",
    "cc": "11309883",
    "direccion": "MZ B CASA 26 B/CORDOBA",
    "telefono": "3163721373",
    "medioDePago": "NEQUI 3163721373",
    "estado": "INACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "DAVID ELIAS VARON / 24 HORAS PARQUEADERO",
    "establecimiento": "24 HORAS PARQUEADERO",
    "cc": "14221312",
    "direccion": "CLL 67 CRA 22 SECTOR EL TRIUNFO AMBALA",
    "telefono": "3114983878",
    "medioDePago": "EFECTIVO",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "DIEGO FERNANDO FORERO SÁNCHEZ /FORMULA 2",
    "establecimiento": "FORMULA 2",
    "cc": "1105616458",
    "direccion": "Mz 1Cs 3/ La Campiña",
    "telefono": "3132858793",
    "medioDePago": "NEQUI 3132858793",
    "estado": "INACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "EDNA VARON",
    "establecimiento": null,
    "cc": null,
    "direccion": "PROGAL",
    "telefono": "3208689581",
    "medioDePago": "NEQUI 3208689581",
    "estado": "-",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "EMERSON ALEJANDRO ZARTA RIVERA",
    "establecimiento": "INDEPENDIENTE",
    "cc": null,
    "direccion": "Cra. 1 #79-25 mirador victoria apto. 920",
    "telefono": "3143081311",
    "medioDePago": "NEQUI 3143081311",
    "estado": "-",
    "fechaApertura": null,
    "notas": "ACTUALIZADO 15/01/2026 JR"
  },
  {
    "titular": "ERIK DAVID VALDERRAMA MOSQUERA",
    "establecimiento": null,
    "cc": null,
    "direccion": "Mz 75 cs 12 jordan 7 etapa",
    "telefono": "3163335678",
    "medioDePago": "NEQUI 3163335678",
    "estado": "-",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "FRANCISCO EDUARDO RAMIREZ USMA / TALLER TOLIMOTOR",
    "establecimiento": "TALLER TOLIMOTOR",
    "cc": "14209987",
    "direccion": "CRA 12 29 36 ANTONIO NARIÑO",
    "telefono": "3125682802",
    "medioDePago": "EFECTIVO",
    "estado": "-",
    "fechaApertura": null,
    "notas": "ACTUALIZCION 15/01/2025"
  },
  {
    "titular": "GERMAN VASQUEZ / AUTO VASQUEZ",
    "establecimiento": "AUTO VASQUEZ",
    "cc": "14396670",
    "direccion": "MZ A CAS A 6 VILLA CINDY",
    "telefono": "3102359341",
    "medioDePago": "NEQUI 3178255588",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "JAIME CUBILLOS",
    "establecimiento": null,
    "cc": "14220041",
    "direccion": "B/ BUNDE MZ D CS 2",
    "telefono": "3105734438",
    "medioDePago": "EFECTIVO",
    "estado": "-",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "JAVIER BELTRAN",
    "establecimiento": null,
    "cc": null,
    "direccion": null,
    "telefono": "3144822395",
    "medioDePago": "Bancolombia 13170789797",
    "estado": "-",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "JOHAN ANDRES VARON HERNANDEZ / UBER",
    "establecimiento": "UBER",
    "cc": "1110559568",
    "direccion": "CONJ LAS PALMERAS BL 3B APT 201",
    "telefono": "3194466047",
    "medioDePago": "NEQUI 3194466047",
    "estado": "INACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "JOHN JAIRO VARON MURCIA / MUNDO MOTOS",
    "establecimiento": "MNDO MOTOS IBG",
    "cc": "92531858",
    "direccion": "CLL 37 N 11 A 36 GAITAN",
    "telefono": "3128885428",
    "medioDePago": "EFECTIVO",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "JORGE ENRIQUE BARROSO ROA / AUTOLAVADO LA GRANJA",
    "establecimiento": "AUTOLAVADO LA GRANJA",
    "cc": "83088000",
    "direccion": "Av ambala 29-60",
    "telefono": "3125114538",
    "medioDePago": "EFECTIVO",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "FERNANDO PINTO/JOSE M CORDOBA",
    "establecimiento": "SOAT JOSE MARIA",
    "cc": "19444146",
    "direccion": "Cr 6 #40 A -11",
    "telefono": "3014713169",
    "medioDePago": "NEQUI 3014713169",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "KEVIN BECERRA",
    "establecimiento": null,
    "cc": null,
    "direccion": null,
    "telefono": "3123066736",
    "medioDePago": "NEQUI 3123066736",
    "estado": "-",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "KEVIN DURAN LEYTON",
    "establecimiento": null,
    "cc": "1234642831",
    "direccion": "CL 27 # 4C 50 B/ HIPODROMO",
    "telefono": "3188454629",
    "medioDePago": "NEQUI 3188454629",
    "estado": "-",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "LAURA BONILLA",
    "establecimiento": "INDEPENDIENTE",
    "cc": null,
    "direccion": null,
    "telefono": null,
    "medioDePago": "EFECTIVO",
    "estado": null,
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "LIZETH CALDERON",
    "establecimiento": null,
    "cc": null,
    "direccion": "MZB CS 19 ARKAPARAISO",
    "telefono": "3214455357",
    "medioDePago": "NEQUI 3176264069",
    "estado": "-",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "LUIS ALEJANDRO RIVAS RAMIREZ / AIR CONSTRUCCIONES",
    "establecimiento": "AIR CONSTRUCCIONES",
    "cc": "1110482953",
    "direccion": "CR13 #39BIS 10",
    "telefono": "3023213050",
    "medioDePago": "Ahorro BANCOLOMBIA 07956764666",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "MAYERLI SALAVARRIETA",
    "establecimiento": null,
    "cc": null,
    "direccion": "CDA MOTOCLUB",
    "telefono": null,
    "medioDePago": "NEQUI 3143906082",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "MIGUEL VALENCIA / TECNICENTRO",
    "establecimiento": "TECNICENTRO",
    "cc": "93403828",
    "direccion": "CRA 12 # 39-79 BRR ANTONIO NARIÑO",
    "telefono": "3125304907",
    "medioDePago": "Ahorro Bancolombia 15326734800",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "MOISES PERDOMO FORERO/TECNIMOISES",
    "establecimiento": "TECNIMOISES",
    "cc": "14238273",
    "direccion": "AV GUAVINAL NO. 37-108",
    "telefono": "3172848489",
    "medioDePago": "EFECTIVO",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "REGULO PERDOMO HERNANDEZ",
    "establecimiento": null,
    "cc": null,
    "direccion": "CR1 E # 8-37 BARRIO GAVIOTA",
    "telefono": "3224045461",
    "medioDePago": "EFECTIVO",
    "estado": null,
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "RICARDO BARRIOS RODRIGUEZ/ EVOLUTON RG",
    "establecimiento": "EVOLUTON RG",
    "cc": "93406982",
    "direccion": "CRA 6 31 A 04 ESQUINA",
    "telefono": "3028680777",
    "medioDePago": "EFECTIVO",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "VICTOR REINEL GALINDO / TALLER R AUTOS",
    "establecimiento": "TALLER R AUTOS",
    "cc": "93356147",
    "direccion": "AV GUAVINAL NO. 38-29",
    "telefono": "3132344930",
    "medioDePago": "NEQUI 3132344930",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "YULI GARCIA",
    "establecimiento": null,
    "cc": "1110513226",
    "direccion": "MZ B CASA 4 B/ AMBALA",
    "telefono": "3223875781",
    "medioDePago": "NEQUI 3223875781",
    "estado": "-",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "ALVARO CASTELLANOS",
    "establecimiento": null,
    "cc": null,
    "direccion": "CL 3 6 78 COMBEIMA",
    "telefono": "3168382813",
    "medioDePago": "NEQUI 3168382813",
    "estado": "INACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "ELSY BEATRIZ SANCHEZ GUERRA / TRAMITES BAM",
    "establecimiento": "TRAMITES BAM",
    "cc": "37882863",
    "direccion": "CLL 44 NO 2-45",
    "telefono": "3176393800",
    "medioDePago": "Ahorro BANCOLOMBIA 21169178648",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "FABER PARDO",
    "establecimiento": null,
    "cc": null,
    "direccion": "CRA 16 42 67 BRISAS DE COMBEIMA",
    "telefono": "3204817969",
    "medioDePago": "EFECTIVO",
    "estado": "INACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "JAIME BRAVO",
    "establecimiento": null,
    "cc": null,
    "direccion": "CRA 8 45 55 LAS AMERICAS",
    "telefono": "3506855559",
    "medioDePago": "EFECTIVO",
    "estado": "INACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "JESUS HERNANDO CUCHIMBA/ LAVAR AUTOS Y MOTOS LA 60",
    "establecimiento": "LAVAR AUTOS Y MOTOS LA 60",
    "cc": "7310532",
    "direccion": "CL 60 CRA 3A 120 PICALEÑA",
    "telefono": "3175005758",
    "medioDePago": "EFECTIVO",
    "estado": "INACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "JHON JAIRO AVILAN AREVALO / SERVICIOS RUTA BLANCA",
    "establecimiento": "SERVICIOS RUTA BLANCA",
    "cc": "80253048",
    "direccion": "CRA 1A # 90-27 JORDAN 9 ETAPA",
    "telefono": "3115892005",
    "medioDePago": "NEQUI 3115892005",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "JORGE EDUARDO GUTIERREZ RINCON",
    "establecimiento": null,
    "cc": "93368063",
    "direccion": "MZ P CS 22 JORDAN 7 ETAPA",
    "telefono": "3177726363",
    "medioDePago": "EFECTIVO",
    "estado": "INACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "MIGUEL ANGEL SERRANO / PARQUEADERO PICALEÑA",
    "establecimiento": "PARQUEADERO PICALEÑA",
    "cc": "14396928",
    "direccion": "CL 56 CRA 4 ESQUINA BARRIO PICALEÑA",
    "telefono": "3187765893",
    "medioDePago": "EFECTIVO",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "OSCAR FERNEY BERNAL / LAVADERO JBJ",
    "establecimiento": "LAVADERO JBJ",
    "cc": "93419064",
    "direccion": "CL 64 3 SUR 26 B/PICALEÑA",
    "telefono": "3224883893",
    "medioDePago": "EFECTIVO",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "RICARDO ANDRES CARRANZA / LAVADERO CARRANZA",
    "establecimiento": "LAVADERO CARRANZA",
    "cc": null,
    "direccion": "Cr3 #59-46 picaleña",
    "telefono": "3202997747",
    "medioDePago": "NEQUI 3202997747",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "ROBINSON MAYORGA/ROMY AUTOS",
    "establecimiento": "ROMY AUTOS",
    "cc": "79945835",
    "direccion": "CALLE 60 CRA 3SUR 21 PICALEÑA",
    "telefono": "3115735545",
    "medioDePago": "NEQUI 3115735545",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "CARLOS MAURICIO CARREÑO / CAR WASH",
    "establecimiento": "CAR WASH",
    "cc": "19359626",
    "direccion": "CR 25 C 56 29 B PICALEÑA",
    "telefono": "3158544088",
    "medioDePago": "NEQUI 3158544088",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "FERNEY ZAMBRANO GUARNIZO / TALLER VILMAR",
    "establecimiento": "TALLER VILMAR",
    "cc": "14222043",
    "direccion": "CL 60 CRA 7SUR 30 PICALEÑA",
    "telefono": "3115722655",
    "medioDePago": "EFECTIVO",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "OMAR AVELLA",
    "establecimiento": null,
    "cc": null,
    "direccion": "TALLER CALAMBEO",
    "telefono": "3214448821",
    "medioDePago": "EFECTIVO",
    "estado": "INACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "ALDAIR RINCON GARZON / TECNI CHAVO",
    "establecimiento": "TECNI CHAVO",
    "cc": "1111452998",
    "direccion": "CRA 6 N 57-88 PICALEÑA",
    "telefono": "3124066645",
    "medioDePago": "NEQUI 3124066645",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "ALEXIS AVILA CABRERA",
    "establecimiento": null,
    "cc": "1006023887",
    "direccion": "MZ 46 CS14 JORDAN 6 ETAPA",
    "telefono": "3105748473",
    "medioDePago": "NEQUI 3105748473",
    "estado": "INACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "ANCIZAR CANAVAL CASTRO / SERVICIOS JORDAN",
    "establecimiento": "SERVICIOS JORDAN",
    "cc": "4544773",
    "direccion": "MZ N CS 14 JORDAN 5 ETAPA",
    "telefono": "3213398932",
    "medioDePago": "NEQUI 3213398932",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "CRISTIAN ANDRES BURBANO MARTINEZ",
    "establecimiento": null,
    "cc": "1126226485",
    "direccion": "MZ 21 CS 15 JORDAN 2 ETAPA",
    "telefono": "3133726055",
    "medioDePago": "NEQUI 3133726055",
    "estado": "INACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "DUBAN ANDRES CORTES",
    "establecimiento": null,
    "cc": "1110510405",
    "direccion": "MZ 59 CS 3 JORDAN 8 ETAPA",
    "telefono": "3058118078",
    "medioDePago": "NEQUI 3058118078",
    "estado": "INACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "FERNANDO JOSE GARCIA MONTENEGRO / TALLER DE MOTOS FR",
    "establecimiento": "TALLER DE MOTOS FR",
    "cc": "1121942933",
    "direccion": "CRA 1 EST # 92-36 JORDAN 9 ET",
    "telefono": "3133842195",
    "medioDePago": "EFECTIVO",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "FREDY MOSQUERA ALEGRIA / AUTOLAVADO MOSQUERA",
    "establecimiento": "AUTOLAVADO MOSQUERA",
    "cc": "94359867",
    "direccion": "CALLE 90 N 1A 34 JORDAN 9 ETAPA",
    "telefono": "3133896800",
    "medioDePago": "NEQUI 3133896800",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "GERMAN PARRA RAMIREZ / PARQUEADERO PARRA",
    "establecimiento": "PARQUEADERO PARRA",
    "cc": "14209797",
    "direccion": "MZ 12 CS 26 JORDAN 1A ETAPA",
    "telefono": "3228223327",
    "medioDePago": "NEQUI 3228223327",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "HAROLD ORLANDO GUTIERREZ / SERVICIOS Y REPUESTOS HR",
    "establecimiento": "SERVICIOS Y REPUESTOS HR",
    "cc": "5824095",
    "direccion": "MZ 30 CS 13 JORDAN 4 ETAPA",
    "telefono": "3232296906",
    "medioDePago": "NEQUI 3232296906",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "JAIME AUGUSTO VARGAS / TALLER LA 9",
    "establecimiento": "TALLER LA 9",
    "cc": "14395772",
    "direccion": "CRA 1 ESTE 90 45 JORDAN 9 ETAPA",
    "telefono": "3103095066",
    "medioDePago": "EFECTIVO",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "JHON CARLOS TORRES",
    "establecimiento": null,
    "cc": "1110463395",
    "direccion": "MZ 78 CS 4 JORDAN 7 ETAPA",
    "telefono": "3142063832",
    "medioDePago": "NEQUI 3142063832",
    "estado": "INACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "JHONNATAN ARENAS VALDERRAMA",
    "establecimiento": null,
    "cc": "1001292823",
    "direccion": "MZ 85 CS 37 JORDAN 7 ETAPA",
    "telefono": "3185435830",
    "medioDePago": "EFECTIVO",
    "estado": "INACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "JHON EDWARD PEDRAZA",
    "establecimiento": null,
    "cc": "1110517869",
    "direccion": "MZ 78 CS 10 JORDAN 7 ETAPA",
    "telefono": "3212936651",
    "medioDePago": "EFECTIVO",
    "estado": "INACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "JESUS IGNACIO PEREZ",
    "establecimiento": null,
    "cc": "7164738",
    "direccion": "MZ 31 CS 11 JORDAN 4 ETAPA",
    "telefono": "3214477088",
    "medioDePago": "EFECTIVO",
    "estado": "INACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "JORGE VELA / EL DURO",
    "establecimiento": "EL DURO",
    "cc": "15337854",
    "direccion": "MZ 61 CS 18 JORDAN 8 ETAPA",
    "telefono": "3124619479",
    "medioDePago": "EFECTIVO",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "JOSE WILMER RODRIGUEZ PARRA / MOTOS WR",
    "establecimiento": "MOTOS WR",
    "cc": "93387755",
    "direccion": "MZ 58 CS 19 JORDAN 8 ETAPA",
    "telefono": "3103059449",
    "medioDePago": "NEQUI 3103059449",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "JUAN PABLO RAMIREZ MOLANO / MOTOS EL TIGRE",
    "establecimiento": "MOTOS EL TIGRE",
    "cc": "1110488877",
    "direccion": "MZ 36 CS 15 JORDAN 5 ETAPA",
    "telefono": "3132350363",
    "medioDePago": "NEQUI 3132350363",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "LUIS FERNANDO OROZCO MONTOYA",
    "establecimiento": null,
    "cc": "10006294",
    "direccion": "MZ 38 CS 8 JORDAN 5 ETAPA",
    "telefono": "3118850645",
    "medioDePago": "NEQUI 3118850645",
    "estado": "INACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "MARIA VIRGINIA CAMPO / DULCES Y SALUDABLES SNACK",
    "establecimiento": "DULCES Y SALUDABLES SNACK",
    "cc": "63550819",
    "direccion": "MZ 63 CS 9 JORDAN 8 ETAPA",
    "telefono": "3212535343",
    "medioDePago": "EFECTIVO",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "NAZARENO CONDE",
    "establecimiento": null,
    "cc": "87058951",
    "direccion": "MZ 44 CS 18 JORDAN 6 ETAPA",
    "telefono": "3163354302",
    "medioDePago": "EFECTIVO",
    "estado": "INACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "OSCAR ORLANDO ALVAREZ",
    "establecimiento": null,
    "cc": "5734991",
    "direccion": "MZ 51 CS 11 JORDAN 7 ETAPA",
    "telefono": "3222345654",
    "medioDePago": "EFECTIVO",
    "estado": "INACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "OSCAR IVAN RAMIREZ",
    "establecimiento": null,
    "cc": "5825344",
    "direccion": "MZ G CS 25 JORDAN 5 ETAPA",
    "telefono": "3204056030",
    "medioDePago": "EFECTIVO",
    "estado": "INACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "RUBIELA DIAZ",
    "establecimiento": null,
    "cc": "65742302",
    "direccion": "MZ 66 CS 1 JORDAN 8 ETAPA",
    "telefono": "3124717043",
    "medioDePago": "NEQUI 3124717043",
    "estado": "INACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "VICTOR ALFONSO CARDENAS CARDENAS / PARQUEADERO VICAR",
    "establecimiento": "PARQUEADERO VICAR",
    "cc": "93391224",
    "direccion": "MZ P CS 28 JORDAN 7 ETAPA",
    "telefono": "3133931449",
    "medioDePago": "NEQUI 3133931449",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "ADRIANA MORA",
    "establecimiento": null,
    "cc": null,
    "direccion": "MZ 2 CS 14 CIUDADELA CARLOS LLERAS RESTREPO",
    "telefono": "3204224055",
    "medioDePago": "NEQUI 3204224055",
    "estado": "INACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "ALIRIO CALDERON",
    "establecimiento": null,
    "cc": null,
    "direccion": "MZ 28 CS 2 URBANIZACION LA FLORESTA",
    "telefono": "3212569093",
    "medioDePago": "NEQUI 3212569093",
    "estado": "INACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "CRISTIAN VARGAS",
    "establecimiento": null,
    "cc": null,
    "direccion": "CR 1 108 10 INT 19 SAN JUDAS 2 ETL",
    "telefono": "3208482018",
    "medioDePago": "EFECTIVO",
    "estado": "INACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "DIEGO HERNANDEZ / MOVILIDAD Y TRANSPORTE",
    "establecimiento": "MOVILIDAD Y TRANSPORTE",
    "cc": "1106786618",
    "direccion": "BL 1 APT 405 TORRES BOSQUES DE SAN ANTONIO",
    "telefono": "3002071330",
    "medioDePago": "NEQUI 3002071330",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "JEISSON PINEDA",
    "establecimiento": null,
    "cc": null,
    "direccion": "MZ 67 CS 2 URB LOS NOGALES",
    "telefono": "3208651093",
    "medioDePago": "NEQUI 3208651093",
    "estado": "INACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "JOHN FAVER DELGADO MAHECHA / MULTIAUTOS FAVERS",
    "establecimiento": "MULTIAUTOS FAVERS",
    "cc": "1110525066",
    "direccion": "MZ 23 CS 8 CIUDADELA CARLOS LLERAS",
    "telefono": "3108822820",
    "medioDePago": "NEQUI 3108822820",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "LEONEL TRIANA",
    "establecimiento": null,
    "cc": null,
    "direccion": "MZ 36 CS 12 URB PROVIVIENDA",
    "telefono": "3213806685",
    "medioDePago": "EFECTIVO",
    "estado": "INACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "LINA GARCIA",
    "establecimiento": null,
    "cc": null,
    "direccion": "B SAN JUDAS 2A ETAPA",
    "telefono": "3192878903",
    "medioDePago": "EFECTIVO",
    "estado": "INACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "LUIS ALBERTO BERNAL GARZON",
    "establecimiento": null,
    "cc": "1110524743",
    "direccion": "MZ 28 CS 24 CIUDADELA SIMON BOLIVAR",
    "telefono": "3204053193",
    "medioDePago": "EFECTIVO",
    "estado": "INACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "LUIS ENRIQUE CALDERON PIZA",
    "establecimiento": null,
    "cc": "79623068",
    "direccion": "MZ 77 CS 5 URB LA FLORESTA",
    "telefono": "3208450668",
    "medioDePago": "EFECTIVO",
    "estado": "INACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "LUIS FERNEY DIAZ MORA / SERVITALLER EL MOHAN",
    "establecimiento": "SERVITALLER EL MOHAN",
    "cc": "1234550896",
    "direccion": "MZ 49 CS 25 CIUDADELA SIMON BOLIVAR",
    "telefono": "3223816773",
    "medioDePago": "NEQUI 3223816773",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "LUIS GUILLERMO OROBIO IBARRA / MOTO COMPRAS",
    "establecimiento": "MOTO COMPRAS",
    "cc": "6305982",
    "direccion": "MZ 8 CS 6 CIUDADELA CARLOS LLERAS RESTREPO",
    "telefono": "3214397193",
    "medioDePago": "EFECTIVO",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "OSCAR ORLANDO CASTILLO BECERRA / TALLER Y LLANTERIA OSCARIN",
    "establecimiento": "TALLER Y LLANTERIA OSCARIN",
    "cc": "93376618",
    "direccion": "MZ 19 CS 3 URB PROVIVIENDA",
    "telefono": "3144577730",
    "medioDePago": "NEQUI 3144577730",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "VICTOR ANDRES MORALES RODRIGUEZ / DINA MULTIAUTOS",
    "establecimiento": "DINA MULTIAUTOS",
    "cc": "1110570326",
    "direccion": "MZ 48 CS 13 CIUDADELA SIMON BOLIVAR",
    "telefono": "3185574733",
    "medioDePago": "NEQUI 3185574733",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "YEIMY GARCIA",
    "establecimiento": null,
    "cc": null,
    "direccion": "CIUDADELA SIMON BOLIVAR MZ 48 CS 14",
    "telefono": "3208340148",
    "medioDePago": "EFECTIVO",
    "estado": "INACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "CLAUDIA MORA GARCIA / CARO AUTOS",
    "establecimiento": "CARO AUTOS",
    "cc": "65785030",
    "direccion": "CR 6 N 100 33 INT 2 COMUNEROS",
    "telefono": "3202953000",
    "medioDePago": "EFECTIVO",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "YURI ALEXANDER LOSADA VALENCIA / MOTOS LOSADA",
    "establecimiento": "MOTOS LOSADA",
    "cc": "1110567341",
    "direccion": "MZ 20 CS 17 ALTOS DE SAN JORGE",
    "telefono": "3108860780",
    "medioDePago": "NEQUI 3108860780",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "CESAR AUGUSTO HERNANDEZ BONILLA",
    "establecimiento": null,
    "cc": "79621843",
    "direccion": "CLL 110 N 13 18 SAN MARCOS",
    "telefono": "3228345485",
    "medioDePago": "EFECTIVO",
    "estado": "INACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "DIEGO LOPEZ GARCIA",
    "establecimiento": null,
    "cc": "14232336",
    "direccion": "CL 110 13 82 SAN MARCOS",
    "telefono": "3115729854",
    "medioDePago": "EFECTIVO",
    "estado": "INACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "GERMAN ALEXANDER HURTADO MEDINA / ELECTRO GERMAN",
    "establecimiento": "ELECTRO GERMAN",
    "cc": "1110485072",
    "direccion": "MZ 17 CS 20 URB ALTOS DE SAN JORGE",
    "telefono": "3209030330",
    "medioDePago": "NEQUI 3209030330",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "JESUS ENRIQUE HERNANDEZ",
    "establecimiento": null,
    "cc": "5822088",
    "direccion": "MZ 1 CS 16 ALTOS DE SAN JORGE",
    "telefono": "3203195693",
    "medioDePago": "EFECTIVO",
    "estado": "INACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "JHON JAIRO OSPINO RESTREPO / PARQUEADERO PJ",
    "establecimiento": "PARQUEADERO PJ",
    "cc": "5822366",
    "direccion": "CRA 13 N 110-59 SAN MARCOS",
    "telefono": "3103371833",
    "medioDePago": "NEQUI 3103371833",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "JHON SNEIDER PEREZ LOZANO / EASYMOTOS",
    "establecimiento": "EASYMOTOS",
    "cc": "1110536326",
    "direccion": "MZ 18 CS 13 ALTOS DE SAN JORGE",
    "telefono": "3157971653",
    "medioDePago": "EFECTIVO",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "JONATHAN QUEVEDO BERMUDEZ / MOTOS Y FRENOS JQF",
    "establecimiento": "MOTOS Y FRENOS JQF",
    "cc": "1122134844",
    "direccion": "CRA 13 110 40 SAN MARCOS",
    "telefono": "3228334877",
    "medioDePago": "NEQUI 3228334877",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "LUIS CARLOS RODRIGUEZ RESTREPO / TALLER MECANICO CHICHITO",
    "establecimiento": "TALLER MECANICO CHICHITO",
    "cc": "5822343",
    "direccion": "MZ 25 CS 2 ALTOS DE SAN JORGE",
    "telefono": "3177862322",
    "medioDePago": "EFECTIVO",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "NELSON RAMIREZ GUALDRON",
    "establecimiento": null,
    "cc": "91269833",
    "direccion": "CL 121 CR 21 16 SAMAN CAÑAVERAL",
    "telefono": "3192877808",
    "medioDePago": "EFECTIVO",
    "estado": "INACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "ALEXANDER AYALA / DESGUACEMOTOR",
    "establecimiento": "DESGUACEMOTOR",
    "cc": "93396649",
    "direccion": "AV 102 109 B SAN JORGE",
    "telefono": "3122853230",
    "medioDePago": "NEQUI 3122853230",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "ALONSO MAURICIO SANCHEZ",
    "establecimiento": null,
    "cc": "93232797",
    "direccion": "MZ 14 CS 40 VILLA PATRICIA",
    "telefono": "3176308879",
    "medioDePago": "EFECTIVO",
    "estado": "INACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "ANDERSON SUAREZ",
    "establecimiento": null,
    "cc": null,
    "direccion": "MZ 35 CS 4 VILLA NATALIA",
    "telefono": "3225045095",
    "medioDePago": "EFECTIVO",
    "estado": "INACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "CRISTIAN ENRIQUE RINCON / MULTITALLER MR",
    "establecimiento": "MULTITALLER MR",
    "cc": "1110537193",
    "direccion": "MZ 2 CS 16 URB LAS VEGAS",
    "telefono": "3222420555",
    "medioDePago": "NEQUI 3222420555",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "DARIO HURTADO GARCIA / TALLER HURTADO",
    "establecimiento": "TALLER HURTADO",
    "cc": "93376556",
    "direccion": "MZ 25 CS 22 VILLA NATALIA",
    "telefono": "3144058540",
    "medioDePago": "NEQUI 3144058540",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "DIEGO HURTADO",
    "establecimiento": null,
    "cc": null,
    "direccion": "MZ 43 CS 1 BOSQUES DE PINARES",
    "telefono": "3155782048",
    "medioDePago": "EFECTIVO",
    "estado": "INACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "FABIAN DIAZ HORTUA",
    "establecimiento": null,
    "cc": "93376634",
    "direccion": "MZ 43 CS 22 VILLA NATALIA",
    "telefono": "3217622028",
    "medioDePago": "NEQUI 3217622028",
    "estado": "INACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "FERNANDO AGUDELO BARRAGAN / AUTOSERVICE AGUILA",
    "establecimiento": "AUTOSERVICE AGUILA",
    "cc": "5740988",
    "direccion": "MZ 45 CS 14 BOSQUES DE PINARES",
    "telefono": "3187769663",
    "medioDePago": "EFECTIVO",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "FREDY DIAZ",
    "establecimiento": null,
    "cc": null,
    "direccion": "MZ 39 CS 4 VILLA NATALIA",
    "telefono": "3218256568",
    "medioDePago": "EFECTIVO",
    "estado": "INACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "HAROLD CARRANZA GOMEZ / IMPORTADORA Y MULTISERVICIOS HCG",
    "establecimiento": "IMPORTADORA Y MULTISERVICIOS HCG",
    "cc": "93376536",
    "direccion": "MZ 11 CS 3 SAN JUDAS",
    "telefono": "3164773173",
    "medioDePago": "NEQUI 3164773173",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "IVAN DARIO PARRA",
    "establecimiento": null,
    "cc": "93409569",
    "direccion": "MZ 4 CS 3 BOSQUES DE PINARES",
    "telefono": "3138468652",
    "medioDePago": "EFECTIVO",
    "estado": "INACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "JHON EDWOR AGUDELO VASQUEZ",
    "establecimiento": null,
    "cc": "93405697",
    "direccion": "MZ 45 CS 9 BOSQUES DE PINARES",
    "telefono": "3229045595",
    "medioDePago": "EFECTIVO",
    "estado": "INACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "LUCIANO RODRIGUEZ SEPULVEDA / COMERCIALIZADORA EL CALEÑO",
    "establecimiento": "COMERCIALIZADORA EL CALEÑO",
    "cc": "16720799",
    "direccion": "MZ 36 CS 1 VILLA NATALIA",
    "telefono": "3133734005",
    "medioDePago": "EFECTIVO",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "MIGUEL ANGEL GARCIA GIRALDO / TALLER MOTOS MG",
    "establecimiento": "TALLER MOTOS MG",
    "cc": "93365299",
    "direccion": "MZ 10 CS 2 URB LAS VEGAS",
    "telefono": "3219116172",
    "medioDePago": "NEQUI 3219116172",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "RAFAEL GUALDRON GUALDRON",
    "establecimiento": null,
    "cc": "91267996",
    "direccion": "MZ 1 CS 20 VILLA NATALIA",
    "telefono": "3214472212",
    "medioDePago": "NEQUI 3214472212",
    "estado": "INACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "WILSON RAMIREZ",
    "establecimiento": null,
    "cc": null,
    "direccion": "MZ 35 CS 4 VILLA NATALIA",
    "telefono": "3214444055",
    "medioDePago": "EFECTIVO",
    "estado": "INACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "YONI ALEXANDER LEYTON CORTES / TALLER ALEXANDER",
    "establecimiento": "TALLER ALEXANDER",
    "cc": "1110535969",
    "direccion": "MZ 33 CS 3 BOSQUES DE PINARES",
    "telefono": "3202980960",
    "medioDePago": "NEQUI 3202980960",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "CRISTIAN OVIEDO",
    "establecimiento": null,
    "cc": null,
    "direccion": "MZ 30 CS 7 BOSQUES DE PINARES",
    "telefono": "3176291027",
    "medioDePago": "EFECTIVO",
    "estado": "INACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "JOSE FREDDY CASTAÑO ESPINOSA / LAVAUTOS Y DETALLING JFC",
    "establecimiento": "LAVAUTOS Y DETALLING JFC",
    "cc": "14225033",
    "direccion": "CR 2 111 20 B SAN JORGE",
    "telefono": "3118847652",
    "medioDePago": "NEQUI 3118847652",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "MAURICIO CONTRERAS CHAPARRO / ZONA DIESEL 4X4",
    "establecimiento": "ZONA DIESEL 4X4",
    "cc": "1110566088",
    "direccion": "MZ 42 CS 11 VILLA NATALIA",
    "telefono": "3208438866",
    "medioDePago": "NEQUI 3208438866",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "DEISY MARYULY ARIAS RAMOS / LAVASECO Y LUBRICANTES JJ",
    "establecimiento": "LAVASECO Y LUBRICANTES JJ",
    "cc": "1110551748",
    "direccion": "MZ 7 CS 15 LAS VEGAS",
    "telefono": "3214395887",
    "medioDePago": "NEQUI 3214395887",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "LUIS GILDARDO MALDONADO FERNANDEZ",
    "establecimiento": null,
    "cc": "2236632",
    "direccion": "MZ 3 CS 10 VILLA NATALIA",
    "telefono": "3163356602",
    "medioDePago": "NEQUI 3163356602",
    "estado": "INACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "YORMAN DANILO RAMIREZ VARGAS / SOLSERVI D&R",
    "establecimiento": "SOLSERVI D&R",
    "cc": "1110565880",
    "direccion": "MZ 2 CS 4 BOSQUES DE PINARES",
    "telefono": "3223878999",
    "medioDePago": "EFECTIVO",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "ALEJANDRO LOPEZ HERNANDEZ / TALLER REPUESTOS JALO",
    "establecimiento": "TALLER REPUESTOS JALO",
    "cc": "1234649945",
    "direccion": "MZ 34 CS 21 BOSQUES DE PINARES",
    "telefono": "3155795353",
    "medioDePago": "NEQUI 3155795353",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "ALEXIS FRANCISCO VILLALBA TRIANA / VILLACAR",
    "establecimiento": "VILLACAR",
    "cc": "93393291",
    "direccion": "MZ 9 CS 7 BOSQUES DE PINARES",
    "telefono": "3115803051",
    "medioDePago": "NEQUI 3115803051",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "EDWIN RODRIGUEZ ROJAS / TALLER DE MOTOS ER",
    "establecimiento": "TALLER DE MOTOS ER",
    "cc": "5822366",
    "direccion": "MZ 8 CS 5 URB LAS VEGAS",
    "telefono": "3204817669",
    "medioDePago": "NEQUI 3204817669",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "FREDY ESCOBAR LOPEZ / EL MONO ESCOBAR",
    "establecimiento": "EL MONO ESCOBAR",
    "cc": "14391766",
    "direccion": "MZ 33 CS 1 VILLA NATALIA",
    "telefono": "3176331808",
    "medioDePago": "NEQUI 3176331808",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "JHONATAN GOMEZ DUEÑAS",
    "establecimiento": null,
    "cc": "1110535909",
    "direccion": "MZ 18 CS 15 URB LAS VEGAS",
    "telefono": "3013239490",
    "medioDePago": "NEQUI 3013239490",
    "estado": "INACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "RENE ESTEBAN RIVERA SANABRIA / TU ALIADO EN LA VIA",
    "establecimiento": "TU ALIADO EN LA VIA",
    "cc": "1110480996",
    "direccion": "MZ 18 CS 15 URB LAS VEGAS",
    "telefono": "3188383777",
    "medioDePago": "NEQUI 3188383777",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "YEISON CUELLAR BELTRAN / TECNIMOTOS YK",
    "establecimiento": "TECNIMOTOS YK",
    "cc": "1106786596",
    "direccion": "MZ 6 CS 13 URB LAS VEGAS",
    "telefono": "3228219195",
    "medioDePago": "NEQUI 3228219195",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  }
,
  {
    "titular": "ALEXANDER ROJAS LOPEZ / MOTOS EL CHIVO",
    "establecimiento": "MOTOS EL CHIVO",
    "cc": "1110471773",
    "direccion": "MZ 10 CS 1 VILLA NATALIA",
    "telefono": "3165057508",
    "medioDePago": "NEQUI 3165057508",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "ANDRES FELIPE REYES MOSQUERA / TALLER RF",
    "establecimiento": "TALLER RF",
    "cc": "1110577458",
    "direccion": "MZ 15 CS 14 URB LAS VEGAS",
    "telefono": "3213852752",
    "medioDePago": "NEQUI 3213852752",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "CARLOS ARTURO MORALES SANCHEZ / MULTISERVICIOS CM",
    "establecimiento": "MULTISERVICIOS CM",
    "cc": "5822461",
    "direccion": "MZ 11 CS 19 VILLA NATALIA",
    "telefono": "3102382883",
    "medioDePago": "NEQUI 3102382883",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "CARLOS JULIO CASTRO VELEZ / TALLER CASTRO",
    "establecimiento": "TALLER CASTRO",
    "cc": "14234432",
    "direccion": "MZ 35 CS 2 BOSQUES DE PINARES",
    "telefono": "3213034095",
    "medioDePago": "NEQUI 3213034095",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "DIEGO ALEXANDER GUEVARA OSORIO / TALLER GUEVARA",
    "establecimiento": "TALLER GUEVARA",
    "cc": "1110569445",
    "direccion": "MZ 45 CS 15 BOSQUES DE PINARES",
    "telefono": "3134049809",
    "medioDePago": "NEQUI 3134049809",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "FABIAN VALENCIA PIEDRAHITA / TALLER DE MOTOS FV",
    "establecimiento": "TALLER DE MOTOS FV",
    "cc": "1110569453",
    "direccion": "MZ 14 CS 13 URB LAS VEGAS",
    "telefono": "3208441016",
    "medioDePago": "NEQUI 3208441016",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "FREDY CHACON HURTADO / TALLER CHACON",
    "establecimiento": "TALLER CHACON",
    "cc": "93371990",
    "direccion": "MZ 32 CS 11 BOSQUES DE PINARES",
    "telefono": "3203079848",
    "medioDePago": "NEQUI 3203079848",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "HERNAN DARIO QUINTERO RAMIREZ / TALLER QUINTERO",
    "establecimiento": "TALLER QUINTERO",
    "cc": "14394638",
    "direccion": "MZ 38 CS 12 VILLA NATALIA",
    "telefono": "3107550208",
    "medioDePago": "EFECTIVO",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "JAVIER GARZON ROJAS / MULTISERVICIOS JG",
    "establecimiento": "MULTISERVICIOS JG",
    "cc": "14397212",
    "direccion": "MZ 7 CS 10 URB LAS VEGAS",
    "telefono": "3143378887",
    "medioDePago": "NEQUI 3143378887",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "JHON EDINSON ORTIZ RAMOS / TECNIMOTOS JE",
    "establecimiento": "TECNIMOTOS JE",
    "cc": "1110570318",
    "direccion": "MZ 1 CS 23 VILLA NATALIA",
    "telefono": "3202983213",
    "medioDePago": "NEQUI 3202983213",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "JOHN JAIRO RODRIGUEZ ROJAS / MULTISERVICIOS JR",
    "establecimiento": "MULTISERVICIOS JR",
    "cc": "93387208",
    "direccion": "MZ 17 CS 19 URB LAS VEGAS",
    "telefono": "3208432949",
    "medioDePago": "NEQUI 3208432949",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "JORGE ELIECER GARCIA PARRA / TALLER JG",
    "establecimiento": "TALLER JG",
    "cc": "93382735",
    "direccion": "MZ 41 CS 2 BOSQUES DE PINARES",
    "telefono": "3213863491",
    "medioDePago": "NEQUI 3213863491",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "JOSE ALDEMAR GARCIA PERDOMO / MOTOS GARCIA",
    "establecimiento": "MOTOS GARCIA",
    "cc": "14225874",
    "direccion": "MZ 24 CS 15 VILLA NATALIA",
    "telefono": "3212411090",
    "medioDePago": "EFECTIVO",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "JUAN CARLOS RAMIREZ HERNANDEZ / MOTOS JC",
    "establecimiento": "MOTOS JC",
    "cc": "1110568597",
    "direccion": "MZ 6 CS 11 URB LAS VEGAS",
    "telefono": "3104377838",
    "medioDePago": "NEQUI 3104377838",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "LEIDY JOHANA RAMIREZ / MOTOS LJ",
    "establecimiento": "MOTOS LJ",
    "cc": "1110569461",
    "direccion": "MZ 40 CS 14 BOSQUES DE PINARES",
    "telefono": "3143242525",
    "medioDePago": "NEQUI 3143242525",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "LUIS EDUARDO CARDONA MARTINEZ / MOTOS LC",
    "establecimiento": "MOTOS LC",
    "cc": "5822454",
    "direccion": "MZ 36 CS 9 BOSQUES DE PINARES",
    "telefono": "3213035842",
    "medioDePago": "NEQUI 3213035842",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "NELSON VARGAS LOPEZ / TALLER VARGAS",
    "establecimiento": "TALLER VARGAS",
    "cc": "14226073",
    "direccion": "MZ 9 CS 2 VILLA NATALIA",
    "telefono": "3102383791",
    "medioDePago": "EFECTIVO",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "OMAR HERNAN QUINTERO BEDOYA / TALLER OH",
    "establecimiento": "TALLER OH",
    "cc": "93365356",
    "direccion": "MZ 31 CS 20 BOSQUES DE PINARES",
    "telefono": "3177633424",
    "medioDePago": "NEQUI 3177633424",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "OSCAR JAVIER RAMIREZ GARZON / MOTOS OJ",
    "establecimiento": "MOTOS OJ",
    "cc": "93382743",
    "direccion": "MZ 23 CS 2 VILLA NATALIA",
    "telefono": "3155795361",
    "medioDePago": "NEQUI 3155795361",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "WILSON ANDRES RAMIREZ GARZON / MOTOS WA",
    "establecimiento": "MOTOS WA",
    "cc": "1110569478",
    "direccion": "MZ 19 CS 7 URB LAS VEGAS",
    "telefono": "3213034103",
    "medioDePago": "NEQUI 3213034103",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "YESID FERNANDO CUELLAR / MOTOS YF",
    "establecimiento": "MOTOS YF",
    "cc": "1110568589",
    "direccion": "MZ 12 CS 18 VILLA NATALIA",
    "telefono": "3208441024",
    "medioDePago": "NEQUI 3208441024",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "YESID PARRA SANCHEZ / TALLER YP",
    "establecimiento": "TALLER YP",
    "cc": "93365364",
    "direccion": "MZ 44 CS 5 BOSQUES DE PINARES",
    "telefono": "3102383809",
    "medioDePago": "EFECTIVO",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "ALBA LUZ VARGAS PERDOMO / MULTISERVICIOS AV",
    "establecimiento": "MULTISERVICIOS AV",
    "cc": "65779229",
    "direccion": "MZ 5 CS 1 URB LAS VEGAS",
    "telefono": "3213034111",
    "medioDePago": "NEQUI 3213034111",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "ALVARO MARTINEZ GONZALEZ / TALLER AM",
    "establecimiento": "TALLER AM",
    "cc": "14226081",
    "direccion": "MZ 37 CS 17 BOSQUES DE PINARES",
    "telefono": "3155795379",
    "medioDePago": "NEQUI 3155795379",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "ANDERSON RAMIREZ GARZON / MOTOS AR",
    "establecimiento": "MOTOS AR",
    "cc": "1110569486",
    "direccion": "MZ 20 CS 12 URB LAS VEGAS",
    "telefono": "3208441032",
    "medioDePago": "NEQUI 3208441032",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "CARLOS ALBERTO VARGAS LOPEZ / TALLER CV",
    "establecimiento": "TALLER CV",
    "cc": "14225882",
    "direccion": "MZ 25 CS 21 VILLA NATALIA",
    "telefono": "3213034129",
    "medioDePago": "NEQUI 3213034129",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "DIEGO FERNANDO RAMIREZ / MOTOS DF",
    "establecimiento": "MOTOS DF",
    "cc": "1110569494",
    "direccion": "MZ 42 CS 20 BOSQUES DE PINARES",
    "telefono": "3102383817",
    "medioDePago": "EFECTIVO",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "FABIO NELSON GARZON ROJAS / TALLER FN",
    "establecimiento": "TALLER FN",
    "cc": "14397220",
    "direccion": "MZ 8 CS 15 URB LAS VEGAS",
    "telefono": "3143378895",
    "medioDePago": "NEQUI 3143378895",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "HECTOR FABIO QUINTERO RAMIREZ / MOTOS HF",
    "establecimiento": "MOTOS HF",
    "cc": "14394646",
    "direccion": "MZ 39 CS 18 VILLA NATALIA",
    "telefono": "3107550216",
    "medioDePago": "EFECTIVO",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "JHON ALEXANDER ORTIZ RAMOS / MOTOS JA",
    "establecimiento": "MOTOS JA",
    "cc": "1110570326",
    "direccion": "MZ 2 CS 28 VILLA NATALIA",
    "telefono": "3202983221",
    "medioDePago": "NEQUI 3202983221",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "JORGE IVAN GARCIA PARRA / MULTISERVICIOS JI",
    "establecimiento": "MULTISERVICIOS JI",
    "cc": "93382751",
    "direccion": "MZ 43 CS 8 BOSQUES DE PINARES",
    "telefono": "3213863509",
    "medioDePago": "NEQUI 3213863509",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "JOSE HUMBERTO GARCIA PERDOMO / TALLER JH",
    "establecimiento": "TALLER JH",
    "cc": "14225890",
    "direccion": "MZ 26 CS 20 VILLA NATALIA",
    "telefono": "3212411108",
    "medioDePago": "EFECTIVO",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "LUIS CARLOS RAMIREZ HERNANDEZ / TALLER LC",
    "establecimiento": "TALLER LC",
    "cc": "1110568605",
    "direccion": "MZ 7 CS 16 URB LAS VEGAS",
    "telefono": "3104377846",
    "medioDePago": "NEQUI 3104377846",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "MARCO TULIO RAMIREZ / MULTISERVICIOS MT",
    "establecimiento": "MULTISERVICIOS MT",
    "cc": "1110569502",
    "direccion": "MZ 41 CS 24 BOSQUES DE PINARES",
    "telefono": "3143242533",
    "medioDePago": "NEQUI 3143242533",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "OSCAR EDUARDO CARDONA MARTINEZ / TALLER OE",
    "establecimiento": "TALLER OE",
    "cc": "5822462",
    "direccion": "MZ 37 CS 14 BOSQUES DE PINARES",
    "telefono": "3213035850",
    "medioDePago": "NEQUI 3213035850",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "RICARDO RAMIREZ GARZON / MOTOS RR",
    "establecimiento": "MOTOS RR",
    "cc": "93382769",
    "direccion": "MZ 24 CS 8 VILLA NATALIA",
    "telefono": "3155795387",
    "medioDePago": "NEQUI 3155795387",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "YESID ALEXANDER RAMIREZ GARZON / TALLER YA",
    "establecimiento": "TALLER YA",
    "cc": "1110569510",
    "direccion": "MZ 21 CS 17 URB LAS VEGAS",
    "telefono": "3213034137",
    "medioDePago": "NEQUI 3213034137",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "ALBEIRO VARGAS PERDOMO / MULTISERVICIOS AV",
    "establecimiento": "MULTISERVICIOS AV",
    "cc": "14226099",
    "direccion": "MZ 10 CS 6 VILLA NATALIA",
    "telefono": "3102383825",
    "medioDePago": "EFECTIVO",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "ANDERSON GARCIA GARZON / TALLER AG",
    "establecimiento": "TALLER AG",
    "cc": "1110569528",
    "direccion": "MZ 38 CS 22 BOSQUES DE PINARES",
    "telefono": "3155795395",
    "medioDePago": "NEQUI 3155795395",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "CRISTIAN CAMILO MARTINEZ / MOTOS CC",
    "establecimiento": "MOTOS CC",
    "cc": "14226107",
    "direccion": "MZ 22 CS 23 URB LAS VEGAS",
    "telefono": "3208441040",
    "medioDePago": "NEQUI 3208441040",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "EDWIN RAMIREZ GARZON / TALLER ER",
    "establecimiento": "TALLER ER",
    "cc": "93382777",
    "direccion": "MZ 27 CS 14 VILLA NATALIA",
    "telefono": "3213034145",
    "medioDePago": "NEQUI 3213034145",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "FREDY ALEXANDER GARZON / MULTISERVICIOS FA",
    "establecimiento": "MULTISERVICIOS FA",
    "cc": "14397238",
    "direccion": "MZ 9 CS 20 URB LAS VEGAS",
    "telefono": "3143378903",
    "medioDePago": "NEQUI 3143378903",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "JAIRO QUINTERO RAMIREZ / MOTOS JQ",
    "establecimiento": "MOTOS JQ",
    "cc": "14394654",
    "direccion": "MZ 40 CS 23 VILLA NATALIA",
    "telefono": "3107550224",
    "medioDePago": "EFECTIVO",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "JOHN FREDY ORTIZ RAMOS / TALLER JF",
    "establecimiento": "TALLER JF",
    "cc": "1110570334",
    "direccion": "MZ 3 CS 33 VILLA NATALIA",
    "telefono": "3202983239",
    "medioDePago": "NEQUI 3202983239",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "JOSE ORLANDO GARCIA PARRA / MOTOS JO",
    "establecimiento": "MOTOS JO",
    "cc": "93382785",
    "direccion": "MZ 44 CS 13 BOSQUES DE PINARES",
    "telefono": "3213863517",
    "medioDePago": "NEQUI 3213863517",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "LUIS FERNANDO GARCIA PERDOMO / MULTISERVICIOS LF",
    "establecimiento": "MULTISERVICIOS LF",
    "cc": "14225908",
    "direccion": "MZ 28 CS 25 VILLA NATALIA",
    "telefono": "3212411116",
    "medioDePago": "EFECTIVO",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "NELSON RAMIREZ HERNANDEZ / MOTOS NR",
    "establecimiento": "MOTOS NR",
    "cc": "1110568613",
    "direccion": "MZ 8 CS 21 URB LAS VEGAS",
    "telefono": "3104377854",
    "medioDePago": "NEQUI 3104377854",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "OSCAR MAURICIO RAMIREZ / TALLER OM",
    "establecimiento": "TALLER OM",
    "cc": "1110569536",
    "direccion": "MZ 43 CS 29 BOSQUES DE PINARES",
    "telefono": "3143242541",
    "medioDePago": "NEQUI 3143242541",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "VICTOR ALFONSO CARDONA / MULTISERVICIOS VC",
    "establecimiento": "MULTISERVICIOS VC",
    "cc": "5822470",
    "direccion": "MZ 39 CS 19 BOSQUES DE PINARES",
    "telefono": "3213035868",
    "medioDePago": "NEQUI 3213035868",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "WILSON RAMIREZ GARZON / MOTOS WR",
    "establecimiento": "MOTOS WR",
    "cc": "93382793",
    "direccion": "MZ 25 CS 13 VILLA NATALIA",
    "telefono": "3155795403",
    "medioDePago": "NEQUI 3155795403",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "ALBEIRO JOSE VARGAS / TALLER AJ",
    "establecimiento": "TALLER AJ",
    "cc": "1110569544",
    "direccion": "MZ 23 CS 22 URB LAS VEGAS",
    "telefono": "3213034153",
    "medioDePago": "NEQUI 3213034153",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "CARLOS HERNANDO VARGAS / MULTISERVICIOS CH",
    "establecimiento": "MULTISERVICIOS CH",
    "cc": "14226115",
    "direccion": "MZ 11 CS 11 VILLA NATALIA",
    "telefono": "3102383833",
    "medioDePago": "EFECTIVO",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "FRANCISCO RAMIREZ GARZON / MOTOS FR",
    "establecimiento": "MOTOS FR",
    "cc": "93382801",
    "direccion": "MZ 40 CS 27 BOSQUES DE PINARES",
    "telefono": "3155795411",
    "medioDePago": "NEQUI 3155795411",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "GERMAN GARCIA GARZON / TALLER GG",
    "establecimiento": "TALLER GG",
    "cc": "1110569552",
    "direccion": "MZ 24 CS 27 URB LAS VEGAS",
    "telefono": "3208441058",
    "medioDePago": "NEQUI 3208441058",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "HERNAN RAMIREZ GARZON / MULTISERVICIOS HR",
    "establecimiento": "MULTISERVICIOS HR",
    "cc": "93382819",
    "direccion": "MZ 29 CS 19 VILLA NATALIA",
    "telefono": "3213034161",
    "medioDePago": "NEQUI 3213034161",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "JAIME GARZON ROJAS / MOTOS JG",
    "establecimiento": "MOTOS JG",
    "cc": "14397246",
    "direccion": "MZ 10 CS 25 URB LAS VEGAS",
    "telefono": "3143378911",
    "medioDePago": "NEQUI 3143378911",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "JHON JAIRO QUINTERO / TALLER JJ",
    "establecimiento": "TALLER JJ",
    "cc": "14394662",
    "direccion": "MZ 41 CS 28 VILLA NATALIA",
    "telefono": "3107550232",
    "medioDePago": "EFECTIVO",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "JORGE ELIECER ORTIZ / MULTISERVICIOS JE",
    "establecimiento": "MULTISERVICIOS JE",
    "cc": "1110570342",
    "direccion": "MZ 4 CS 38 VILLA NATALIA",
    "telefono": "3202983247",
    "medioDePago": "NEQUI 3202983247",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "JOSE WILSON GARCIA / MOTOS JW",
    "establecimiento": "MOTOS JW",
    "cc": "93382827",
    "direccion": "MZ 45 CS 18 BOSQUES DE PINARES",
    "telefono": "3213863525",
    "medioDePago": "NEQUI 3213863525",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "MARCO FIDEL GARCIA / TALLER MF",
    "establecimiento": "TALLER MF",
    "cc": "14225916",
    "direccion": "MZ 30 CS 30 VILLA NATALIA",
    "telefono": "3212411124",
    "medioDePago": "EFECTIVO",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "OSCAR RAMIREZ HERNANDEZ / MULTISERVICIOS OR",
    "establecimiento": "MULTISERVICIOS OR",
    "cc": "1110568621",
    "direccion": "MZ 9 CS 26 URB LAS VEGAS",
    "telefono": "3104377862",
    "medioDePago": "NEQUI 3104377862",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "RUBEN DARIO RAMIREZ / MOTOS RD",
    "establecimiento": "MOTOS RD",
    "cc": "1110569560",
    "direccion": "MZ 44 CS 34 BOSQUES DE PINARES",
    "telefono": "3143242559",
    "medioDePago": "NEQUI 3143242559",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "WILSON HERNANDO CARDONA / TALLER WH",
    "establecimiento": "TALLER WH",
    "cc": "5822488",
    "direccion": "MZ 41 CS 24 BOSQUES DE PINARES",
    "telefono": "3213035876",
    "medioDePago": "NEQUI 3213035876",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "YESID RAMIREZ GARZON / MULTISERVICIOS YR",
    "establecimiento": "MULTISERVICIOS YR",
    "cc": "93382835",
    "direccion": "MZ 26 CS 18 VILLA NATALIA",
    "telefono": "3155795429",
    "medioDePago": "NEQUI 3155795429",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "ALEXANDER GARCIA GARZON / MOTOS AG",
    "establecimiento": "MOTOS AG",
    "cc": "1110569578",
    "direccion": "MZ 25 CS 32 URB LAS VEGAS",
    "telefono": "3213034179",
    "medioDePago": "NEQUI 3213034179",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "CESAR AUGUSTO VARGAS / TALLER CA",
    "establecimiento": "TALLER CA",
    "cc": "14226123",
    "direccion": "MZ 12 CS 16 VILLA NATALIA",
    "telefono": "3102383841",
    "medioDePago": "EFECTIVO",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "GUSTAVO RAMIREZ GARZON / MULTISERVICIOS GR",
    "establecimiento": "MULTISERVICIOS GR",
    "cc": "93382843",
    "direccion": "MZ 42 CS 32 BOSQUES DE PINARES",
    "telefono": "3155795437",
    "medioDePago": "NEQUI 3155795437",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "IVAN DARIO GARCIA / MOTOS ID",
    "establecimiento": "MOTOS ID",
    "cc": "1110569586",
    "direccion": "MZ 26 CS 37 URB LAS VEGAS",
    "telefono": "3208441066",
    "medioDePago": "NEQUI 3208441066",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "JAIRO RAMIREZ GARZON / TALLER JR",
    "establecimiento": "TALLER JR",
    "cc": "93382851",
    "direccion": "MZ 31 CS 24 VILLA NATALIA",
    "telefono": "3213034187",
    "medioDePago": "NEQUI 3213034187",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "JHON ALEXANDER GARZON / MULTISERVICIOS JA",
    "establecimiento": "MULTISERVICIOS JA",
    "cc": "14397254",
    "direccion": "MZ 11 CS 30 URB LAS VEGAS",
    "telefono": "3143378929",
    "medioDePago": "NEQUI 3143378929",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "JOSE HERNAN QUINTERO / MOTOS JH",
    "establecimiento": "MOTOS JH",
    "cc": "14394670",
    "direccion": "MZ 43 CS 33 VILLA NATALIA",
    "telefono": "3107550240",
    "medioDePago": "EFECTIVO",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "LUIS EDUARDO ORTIZ / TALLER LE",
    "establecimiento": "TALLER LE",
    "cc": "1110570350",
    "direccion": "MZ 5 CS 43 VILLA NATALIA",
    "telefono": "3202983255",
    "medioDePago": "NEQUI 3202983255",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "NELSON GARCIA PARRA / MULTISERVICIOS NR",
    "establecimiento": "MULTISERVICIOS NR",
    "cc": "93382869",
    "direccion": "MZ 46 CS 23 BOSQUES DE PINARES",
    "telefono": "3213863533",
    "medioDePago": "NEQUI 3213863533",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "PABLO GARCIA PERDOMO / MOTOS PG",
    "establecimiento": "MOTOS PG",
    "cc": "14225924",
    "direccion": "MZ 32 CS 35 VILLA NATALIA",
    "telefono": "3212411132",
    "medioDePago": "EFECTIVO",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "WILSON RAMIREZ HERNANDEZ / TALLER WR",
    "establecimiento": "TALLER WR",
    "cc": "1110568639",
    "direccion": "MZ 10 CS 31 URB LAS VEGAS",
    "telefono": "3104377870",
    "medioDePago": "NEQUI 3104377870",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "YESID FERNANDO RAMIREZ / MULTISERVICIOS YF",
    "establecimiento": "MULTISERVICIOS YF",
    "cc": "1110569594",
    "direccion": "MZ 45 CS 39 BOSQUES DE PINARES",
    "telefono": "3143242567",
    "medioDePago": "NEQUI 3143242567",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "ALVARO CARDONA MARTINEZ / MOTOS AC",
    "establecimiento": "MOTOS AC",
    "cc": "5822496",
    "direccion": "MZ 43 CS 29 BOSQUES DE PINARES",
    "telefono": "3213035884",
    "medioDePago": "NEQUI 3213035884",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "ANDERSON RAMIREZ GARZON / TALLER AR",
    "establecimiento": "TALLER AR",
    "cc": "93382877",
    "direccion": "MZ 27 CS 23 VILLA NATALIA",
    "telefono": "3155795445",
    "medioDePago": "NEQUI 3155795445",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "EDUARDO GARCIA GARZON / MULTISERVICIOS EG",
    "establecimiento": "MULTISERVICIOS EG",
    "cc": "1110569602",
    "direccion": "MZ 27 CS 42 URB LAS VEGAS",
    "telefono": "3213034195",
    "medioDePago": "NEQUI 3213034195",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "HUGO VARGAS PERDOMO / MOTOS HV",
    "establecimiento": "MOTOS HV",
    "cc": "14226131",
    "direccion": "MZ 13 CS 21 VILLA NATALIA",
    "telefono": "3102383859",
    "medioDePago": "EFECTIVO",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "JAVIER RAMIREZ GARZON / TALLER JR",
    "establecimiento": "TALLER JR",
    "cc": "93382885",
    "direccion": "MZ 44 CS 37 BOSQUES DE PINARES",
    "telefono": "3155795453",
    "medioDePago": "NEQUI 3155795453",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "JOSE ALDEMAR GARZON / MULTISERVICIOS JA",
    "establecimiento": "MULTISERVICIOS JA",
    "cc": "14397262",
    "direccion": "MZ 12 CS 35 URB LAS VEGAS",
    "telefono": "3143378937",
    "medioDePago": "NEQUI 3143378937",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "LUIS ALFONSO QUINTERO / MOTOS LA",
    "establecimiento": "MOTOS LA",
    "cc": "14394688",
    "direccion": "MZ 44 CS 38 VILLA NATALIA",
    "telefono": "3107550258",
    "medioDePago": "EFECTIVO",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "OSCAR ORTIZ RAMOS / TALLER OO",
    "establecimiento": "TALLER OO",
    "cc": "1110570368",
    "direccion": "MZ 6 CS 48 VILLA NATALIA",
    "telefono": "3202983263",
    "medioDePago": "NEQUI 3202983263",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "VICTOR GARCIA PARRA / MULTISERVICIOS VG",
    "establecimiento": "MULTISERVICIOS VG",
    "cc": "93382893",
    "direccion": "MZ 47 CS 28 BOSQUES DE PINARES",
    "telefono": "3213863541",
    "medioDePago": "NEQUI 3213863541",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "YESID GARCIA PERDOMO / MOTOS YG",
    "establecimiento": "MOTOS YG",
    "cc": "14225932",
    "direccion": "MZ 33 CS 40 VILLA NATALIA",
    "telefono": "3212411140",
    "medioDePago": "EFECTIVO",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "ALBEIRO RAMIREZ HERNANDEZ / TALLER AR",
    "establecimiento": "TALLER AR",
    "cc": "1110568647",
    "direccion": "MZ 11 CS 36 URB LAS VEGAS",
    "telefono": "3104377888",
    "medioDePago": "NEQUI 3104377888",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "CARLOS RAMIREZ / MULTISERVICIOS CR",
    "establecimiento": "MULTISERVICIOS CR",
    "cc": "1110569610",
    "direccion": "MZ 46 CS 44 BOSQUES DE PINARES",
    "telefono": "3143242575",
    "medioDePago": "NEQUI 3143242575",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "GERMAN CARDONA MARTINEZ / MOTOS GC",
    "establecimiento": "MOTOS GC",
    "cc": "5822504",
    "direccion": "MZ 45 CS 34 BOSQUES DE PINARES",
    "telefono": "3213035892",
    "medioDePago": "NEQUI 3213035892",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "HERNAN RAMIREZ GARZON / TALLER HR",
    "establecimiento": "TALLER HR",
    "cc": "93382901",
    "direccion": "MZ 28 CS 28 VILLA NATALIA",
    "telefono": "3155795461",
    "medioDePago": "NEQUI 3155795461",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "JHON GARCIA GARZON / MULTISERVICIOS JG",
    "establecimiento": "MULTISERVICIOS JG",
    "cc": "1110569628",
    "direccion": "MZ 28 CS 47 URB LAS VEGAS",
    "telefono": "3213034203",
    "medioDePago": "NEQUI 3213034203",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "JOSE VARGAS PERDOMO / MOTOS JV",
    "establecimiento": "MOTOS JV",
    "cc": "14226149",
    "direccion": "MZ 14 CS 26 VILLA NATALIA",
    "telefono": "3102383867",
    "medioDePago": "EFECTIVO",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "LUIS RAMIREZ GARZON / TALLER LR",
    "establecimiento": "TALLER LR",
    "cc": "93382919",
    "direccion": "MZ 46 CS 42 BOSQUES DE PINARES",
    "telefono": "3155795479",
    "medioDePago": "NEQUI 3155795479",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "NELSON GARZON ROJAS / MULTISERVICIOS NG",
    "establecimiento": "MULTISERVICIOS NG",
    "cc": "14397270",
    "direccion": "MZ 13 CS 40 URB LAS VEGAS",
    "telefono": "3143378945",
    "medioDePago": "NEQUI 3143378945",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "OSCAR QUINTERO RAMIREZ / MOTOS OQ",
    "establecimiento": "MOTOS OQ",
    "cc": "14394696",
    "direccion": "MZ 45 CS 43 VILLA NATALIA",
    "telefono": "3107550266",
    "medioDePago": "EFECTIVO",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "RUBEN ORTIZ RAMOS / TALLER RO",
    "establecimiento": "TALLER RO",
    "cc": "1110570376",
    "direccion": "MZ 7 CS 53 VILLA NATALIA",
    "telefono": "3202983271",
    "medioDePago": "NEQUI 3202983271",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "WILSON GARCIA PARRA / MULTISERVICIOS WG",
    "establecimiento": "MULTISERVICIOS WG",
    "cc": "93382927",
    "direccion": "MZ 48 CS 33 BOSQUES DE PINARES",
    "telefono": "3213863559",
    "medioDePago": "NEQUI 3213863559",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  },
  {
    "titular": "YESID ALEXANDER GARCIA / MOTOS YA",
    "establecimiento": "MOTOS YA",
    "cc": "14225940",
    "direccion": "MZ 34 CS 45 VILLA NATALIA",
    "telefono": "3212411158",
    "medioDePago": "EFECTIVO",
    "estado": "ACTIVO",
    "fechaApertura": null,
    "notas": null
  }

  ,
  {
    "titular": "ESTEBAN AGUIAR",
    "establecimiento": "ACTIVA MARKETING",
    "cc": null,
    "direccion": null,
    "telefono": null,
    "medioDePago": null,
    "estado": null,
    "fechaApertura": "2025-10-01 00:00:00",
    "notas": "YM"
  } ,
  {
    "titular": "JORGE ERNESTO MUÑOZ",
    "establecimiento": "EL GORDO RETOCADORES",
    "cc": "93366935",
    "direccion": "CALLE 29 #3-77 CLARET",
    "telefono": "3212455818",
    "medioDePago": "EFECTIVO",
    "estado": null,
    "fechaApertura": "2025-10-30 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "LIZARDO VANEGAS",
    "establecimiento": "CARWASH MARIAS",
    "cc": null,
    "direccion": "CALLE 17 SUR # 1-75 CENTRO",
    "telefono": "3112028541",
    "medioDePago": "NEQUI 3219278620",
    "estado": null,
    "fechaApertura": "2025-11-14 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "GERMAN DARIO CHACON MEJIA",
    "establecimiento": "CHEVRO HYUNDAI",
    "cc": null,
    "direccion": "CRA 4C #26-87 HIPODROMO",
    "telefono": "3212541453",
    "medioDePago": "NEQUI 3212541453",
    "estado": null,
    "fechaApertura": "2025-11-14 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "LUZ ALEYDA CAPERA",
    "establecimiento": "CASA AUTOS",
    "cc": null,
    "direccion": "CALLE 26 # 4B-68",
    "telefono": "3105579918-3133221221",
    "medioDePago": "NEQUI 3105579918",
    "estado": null,
    "fechaApertura": "2025-11-14 00:00:00",
    "notas": null
  } ,
  {
    "titular": "DANIEL RUIZ CUELLAR",
    "establecimiento": "STMCARS",
    "cc": "93239936",
    "direccion": "CALLE 24 # 3-42",
    "telefono": "3016043022",
    "medioDePago": "NEQUI 3016043022",
    "estado": null,
    "fechaApertura": "2025-11-18 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "ALVARO DEIBER PRETELL TOVAR",
    "establecimiento": "VULTECNILLANTAS",
    "cc": "1110516501",
    "direccion": "CALLE 24 # 3-25",
    "telefono": "3124496479",
    "medioDePago": "NEQUI 3124496479",
    "estado": null,
    "fechaApertura": "2025-11-18 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "JAVIER GALVIS",
    "establecimiento": "TALLER JAVIER GALVIS",
    "cc": "93376774",
    "direccion": "CRA 4 TAMANA # 26-28",
    "telefono": "3224696911",
    "medioDePago": "NEQUI 3224696911",
    "estado": null,
    "fechaApertura": "2025-11-19 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "ANDRES VIDAL RODRIGUEZ",
    "establecimiento": "MONTE CLARO CALAMBEO",
    "cc": "1234641797",
    "direccion": "CALLE 19 # 13A-40",
    "telefono": "3154946922",
    "medioDePago": "NEQUI 314946922",
    "estado": null,
    "fechaApertura": "2025-11-19 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "EFREN SANCHEZ RIVERA",
    "establecimiento": "PARQUEADERO CADIZ",
    "cc": "93368058",
    "direccion": "CALLE 31 # 4B CADIZ",
    "telefono": "3124434715/3219527201",
    "medioDePago": "NEQUI 3214527201",
    "estado": null,
    "fechaApertura": "2025-11-20 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "GABRIEL LOZADA",
    "establecimiento": "BATERIAS CONECTA",
    "cc": "1234641068",
    "direccion": "CRA 4B # 22-01",
    "telefono": "320675221",
    "medioDePago": "NEQUI 3204675221",
    "estado": null,
    "fechaApertura": "2025-11-20 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "LUIS HUMBERTO BURITICA HERRERA",
    "establecimiento": "TALLER SOMOS MAZDA IBAGUE",
    "cc": "93358241",
    "direccion": "CALLE 39 # 9-10",
    "telefono": "3158760215",
    "medioDePago": "NEQUI 3158760215",
    "estado": null,
    "fechaApertura": "2025-11-20 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "ANDERSON ROMERO BOTINA",
    "establecimiento": "FIBRAS Y ACRILICOS ANDERSON",
    "cc": "1110513363",
    "direccion": "CRA 4 ESTADIO #23-17",
    "telefono": "3164892461",
    "medioDePago": "NEQUI 3164892461",
    "estado": null,
    "fechaApertura": "2025-11-21 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "JULIO MONSALVE CASTILLO",
    "establecimiento": "SERVITECA LA GRAN VIA",
    "cc": "93382975",
    "direccion": "CRA 4 ESTADIO # 22-38",
    "telefono": "3178184463",
    "medioDePago": "EFECTIVO",
    "estado": null,
    "fechaApertura": "2025-11-21 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "BRIAN STIVEN GARZON CULLAR",
    "establecimiento": "TALLER LAC",
    "cc": "1110576609",
    "direccion": "CRA 4C #26-42 HIPODROMO",
    "telefono": "3174781912",
    "medioDePago": "NEQUI 3174781912",
    "estado": null,
    "fechaApertura": "2025-11-21 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "JOSE ARNULFO HERNANDEZ",
    "establecimiento": "SERVIHYNISSAN",
    "cc": "93396600",
    "direccion": "CRA 4C # 26-42",
    "telefono": "3178440290",
    "medioDePago": "NEQUI 3178440290",
    "estado": null,
    "fechaApertura": "2025-11-21 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "ALBERT AGUDELO",
    "establecimiento": "SUSPENCIONES EJES LA 24",
    "cc": "5822579",
    "direccion": "CLL 24 #5A-57",
    "telefono": "3144406841",
    "medioDePago": "NEQUI 3144406841",
    "estado": null,
    "fechaApertura": "2025-11-22 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "JORGE ARLEY ESPINOSA",
    "establecimiento": "PARQUEADERO LA 40 ENTRE CARRERA 5 Y 6",
    "cc": "6463746",
    "direccion": "CLL 40 #5-35 BARRIO RESTREPO",
    "telefono": "3134689494/3187252313",
    "medioDePago": "NEQUI 3187252313",
    "estado": null,
    "fechaApertura": "2025-11-24 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "DAIMER CAPENO",
    "establecimiento": "PARQUEADERO DE MOTOS",
    "cc": "1006140647",
    "direccion": "CLL 33#4A-51 FRENTE AL HOSPITAL FEDERICO",
    "telefono": "3223364889",
    "medioDePago": "NEQUI 3223364889",
    "estado": null,
    "fechaApertura": "2025-11-24 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "CARLOS EDUARDO RICO",
    "establecimiento": "RC AUTOMOTRIZ",
    "cc": "1110526238",
    "direccion": "CLL 32# 4BIS-14",
    "telefono": "3176627630",
    "medioDePago": "NEQUI 3176627630",
    "estado": null,
    "fechaApertura": "2025-11-24 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "JAVIER ESCORCIA",
    "establecimiento": "RADIOADORES EL COSTEÑO",
    "cc": "19590932",
    "direccion": "CLL 26#4A-25",
    "telefono": "3165398184",
    "medioDePago": "NEQUI 3165398184",
    "estado": null,
    "fechaApertura": "2025-11-24 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "JHOANA APONTE",
    "establecimiento": "EXHOSTOS CHECHO",
    "cc": null,
    "direccion": "CRA 4 TAMANA #25-111",
    "telefono": "314392858",
    "medioDePago": "NEQUI 3146396886",
    "estado": null,
    "fechaApertura": "2025-11-24 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "MAURICIO CALDERON",
    "establecimiento": "CACHARRERIA LA BOTICA LIBERTADOR",
    "cc": "1110816912",
    "direccion": "CRA 2 # 3-26 LIBERTADOR",
    "telefono": "3168298189",
    "medioDePago": "NEQUI 3168298189",
    "estado": null,
    "fechaApertura": "2025-11-24 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "JAIRO GOTARGI",
    "establecimiento": "PINTURAS JULIAN",
    "cc": "96543455",
    "direccion": "CR 2 # 4A-152 CHAPETON",
    "telefono": "3144699613",
    "medioDePago": "NEQUI 3144699613",
    "estado": null,
    "fechaApertura": "2025-11-24 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "JHON FREDY ROMERO",
    "establecimiento": "MOTO FREDY",
    "cc": "1005106719",
    "direccion": "VIA AL NEVADO DEL TOLIMA JARDINE DE BERLIN",
    "telefono": "3174200973",
    "medioDePago": "NEQUI 31742009763",
    "estado": null,
    "fechaApertura": "2025-11-24 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "JULIAN RODRIGUEZ CAPERA BARRAGAN",
    "establecimiento": "SERVICIO TECNICO MOTO HOUSE",
    "cc": "1110816154",
    "direccion": "CRA 1 #3-87 LIBERTADOR",
    "telefono": "3502241493",
    "medioDePago": "NEQUI 3502241493",
    "estado": null,
    "fechaApertura": "2025-11-25 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "ABEL ARIZA",
    "establecimiento": "TATA TALLER MOTOS",
    "cc": "1108413716",
    "direccion": "CRA 1A SUR # 48-50",
    "telefono": "3212031881",
    "medioDePago": "NEQUI 3212031881",
    "estado": null,
    "fechaApertura": "2025-11-25 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "JOSE EDWIN RIVERA",
    "establecimiento": "TALLER Y ALMACEN ELECTRICO JOSELO",
    "cc": "93402503",
    "direccion": "CLL 24 #4-24",
    "telefono": "3163541311",
    "medioDePago": "NEQUI 316341311",
    "estado": null,
    "fechaApertura": "2025-11-13 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "HEUDIXIX XAVIER PEREZ",
    "establecimiento": "TALLER AUTOMOTRIZ CHAVELO",
    "cc": "5479524",
    "direccion": "CLL 37 #4B-04",
    "telefono": "316383508",
    "medioDePago": "NEQUI 3163835084",
    "estado": null,
    "fechaApertura": "2025-11-12 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "ANGEL ANTONIO PRIETO",
    "establecimiento": "PINTURA GITARGI ANGEL",
    "cc": "1008730306",
    "direccion": "KILOMETRO 8-9 VIA NEVADO DEL TOLIMA",
    "telefono": "3171424916",
    "medioDePago": "EFECTIVO",
    "estado": null,
    "fechaApertura": "2025-11-24 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "JORGE ANDRES CUY",
    "establecimiento": "AGENCIAS DE SEGROS CUY",
    "cc": "1110538712",
    "direccion": "CRA 9 #935 LOCAL 4 BELEN",
    "telefono": "3185210761",
    "medioDePago": "AVANCE",
    "estado": null,
    "fechaApertura": "2025-11-10 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "MARELIN COPERA",
    "establecimiento": "EXOSTOS Y SILENCIADORES CARWAC",
    "cc": "58623545",
    "direccion": "CLL 25 #2-98 CLARET",
    "telefono": "3115494185",
    "medioDePago": "AVANCES Y EFECTIVO",
    "estado": null,
    "fechaApertura": "2025-11-07 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "DAGOBERTO RODRIGUEZ MAHECHA",
    "establecimiento": "TECNIFRENOS",
    "cc": "93377102",
    "direccion": "CRA 7#19-34",
    "telefono": "3112939909",
    "medioDePago": "NEQUI 3112939909",
    "estado": null,
    "fechaApertura": "2025-11-25 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "WILLIAN LEONARDO GONZALEZ",
    "establecimiento": "SERVITECA CENTRO AUTOMOTRIZ",
    "cc": "1110524016",
    "direccion": "CRA 7#19-57",
    "telefono": "3164418214",
    "medioDePago": "NEQUI 3164418214",
    "estado": null,
    "fechaApertura": "2025-11-25 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "OMAR ALEXANDER ESPINOZA DIAZ",
    "establecimiento": "TALLER DMR",
    "cc": "5522923",
    "direccion": "DIAGONAL 19#6-90",
    "telefono": "3003578327",
    "medioDePago": "NEQUI 300378327",
    "estado": null,
    "fechaApertura": "2025-11-25 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "JUAN CARLOS SANTANA LOMBANA",
    "establecimiento": "CENTRO AUTOMOTRIZ MJ",
    "cc": "1005838834",
    "direccion": "CLL 21 # 7-84 EL CARMEN",
    "telefono": "3228711139",
    "medioDePago": "NEQUI 3228711139",
    "estado": null,
    "fechaApertura": "2025-11-25 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "RAMIRO VIAFARA",
    "establecimiento": "AMORTIAUTOS",
    "cc": "94375840",
    "direccion": "DIAGONAL 19 #6-110",
    "telefono": "320978020",
    "medioDePago": "EFECTIVO",
    "estado": null,
    "fechaApertura": "2025-11-26 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "JOSE RICARDO AGUIRRE",
    "establecimiento": "TECNIFRENOS RICHARD",
    "cc": "93391603",
    "direccion": "CLL 20 #6-96 EL CARMEN",
    "telefono": "3124255238",
    "medioDePago": "NEQUI 3124255238",
    "estado": null,
    "fechaApertura": "2025-11-26 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "JORGE CRUZ",
    "establecimiento": "ALARCOMA",
    "cc": "13453277",
    "direccion": "AV FERROCARRIL 25-20",
    "telefono": "3106073178",
    "medioDePago": "NEQUI 3106073178",
    "estado": null,
    "fechaApertura": "2025-11-26 00:00:00",
    "notas": "YM VIENE 8NOV"
  } ,
  {
    "titular": "JOSE EDGAR FLOREZ RUIZ",
    "establecimiento": "PARQUEADERO LA 6TA",
    "cc": "7251904",
    "direccion": "CRA 6#20-60",
    "telefono": "3015907748",
    "medioDePago": "NEQUI 3015907748",
    "estado": null,
    "fechaApertura": "2025-11-26 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "INGRID VACA",
    "establecimiento": "JW TECNOLOGY SAS",
    "cc": "111096129",
    "direccion": "CLL 21 # 5-56",
    "telefono": "3103400755",
    "medioDePago": "NEQUI 3103400755",
    "estado": null,
    "fechaApertura": "2025-11-26 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "ARIEL ROMERO CAVIEDEZ",
    "establecimiento": "FRENOS ROMERO",
    "cc": "14233062",
    "direccion": "CRA 6 # 21-89",
    "telefono": "3107824142",
    "medioDePago": "NEQUI 3107824142",
    "estado": null,
    "fechaApertura": "2025-11-26 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "JULIO MONTALVO COLACHO",
    "establecimiento": "MINAGRO",
    "cc": "93355801",
    "direccion": "CRA 5 49-38 ZONA INDUSTRIAL",
    "telefono": "3185419087",
    "medioDePago": "BANCOLOMBIA CTA AHORROS 07923447258",
    "estado": null,
    "fechaApertura": "2025-11-26 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "ALEXANDER REYES",
    "establecimiento": "PARQUEADERO LA 21",
    "cc": "13991101",
    "direccion": "CLL 21 #6-96",
    "telefono": "3178720219",
    "medioDePago": "EFECTIVO",
    "estado": null,
    "fechaApertura": "2025-11-27 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "MIGUEL RODRIGUEZ",
    "establecimiento": "TALLER  MECANICA GENERA MR",
    "cc": "93373273",
    "direccion": "CLL 21 #6-96",
    "telefono": "3165598078",
    "medioDePago": "NEQUI 3165598078",
    "estado": null,
    "fechaApertura": "2025-11-27 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "GUSTAVO ALFONSO CASTILLO",
    "establecimiento": "THE WORLD OF CAR REPAIR",
    "cc": "14399821",
    "direccion": "CRA 7 #21-21",
    "telefono": "3178029135",
    "medioDePago": "NEQUI 3178029135",
    "estado": null,
    "fechaApertura": "2025-11-27 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "ALEXANDER WALTEROS FORERO",
    "establecimiento": "EXOSTOS AW",
    "cc": "93401349",
    "direccion": "CRA 7 # 21-91",
    "telefono": "3118401810",
    "medioDePago": "NEQUI 3118401810",
    "estado": null,
    "fechaApertura": "2025-11-27 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "JULIETH RAMIREZ",
    "establecimiento": "TUSERVITEK",
    "cc": "1110472121",
    "direccion": "CRA 6#22-48",
    "telefono": "3217664735",
    "medioDePago": "NEQUI 3026797955",
    "estado": null,
    "fechaApertura": "2025-11-27 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "SONIA PATRICIA LLANOS",
    "establecimiento": "SERVICIOS Y REPUESTOS CSP SAS",
    "cc": "52168591",
    "direccion": "CRA 6 #21-59",
    "telefono": "3102595938",
    "medioDePago": "AVANCE",
    "estado": null,
    "fechaApertura": "2025-11-27 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "WILMAR LOZANO",
    "establecimiento": "AMORTIGUADORES LOZANO",
    "cc": "93394636",
    "direccion": "CLL 22 #6-13",
    "telefono": "3178218064",
    "medioDePago": "NEQUI 317218064",
    "estado": null,
    "fechaApertura": "2025-11-28 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "JUAN CAMILO PARDO",
    "establecimiento": "CLINICA AUTOMOTRIZ JUANK",
    "cc": "1110550330",
    "direccion": "CALLE 24A#8-67",
    "telefono": "3152501714",
    "medioDePago": "NEQUI 3103465228",
    "estado": null,
    "fechaApertura": "2025-11-28 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "DAVID GARZON",
    "establecimiento": "DYCARS",
    "cc": "79638123",
    "direccion": "CLL 22 #5-32",
    "telefono": "300585113",
    "medioDePago": "NEQUI 3005585113",
    "estado": null,
    "fechaApertura": "2025-11-29 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "ANTONIO MARIN",
    "establecimiento": "AUTOTRONICA",
    "cc": null,
    "direccion": "CLL 22 #5-62",
    "telefono": "3133410399/3187004950",
    "medioDePago": null,
    "estado": null,
    "fechaApertura": "2025-11-28 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "ANA MARIA BUSTOS",
    "establecimiento": "JL AUTOMOTRIZ",
    "cc": "1069726674",
    "direccion": "CRA 6 #27-56",
    "telefono": "3104052380",
    "medioDePago": "NEQUI 3104052380",
    "estado": null,
    "fechaApertura": "2025-11-29 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "JORGE DIAZ",
    "establecimiento": "TALLER MECANICA JORG'S",
    "cc": "93383430",
    "direccion": "CLL 23 #5A-28",
    "telefono": "3202567240",
    "medioDePago": "BENEFICIO PROPIO MOTO GCG64E CARRO BMN052",
    "estado": null,
    "fechaApertura": "2025-11-29 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "LUIS MIGUEL MENDEZ GONZALEZ",
    "establecimiento": "MOTO GARAGE",
    "cc": "6088553",
    "direccion": "CLL 23 #5A-61",
    "telefono": "3112433213",
    "medioDePago": "NEQUI 3112433213",
    "estado": null,
    "fechaApertura": "2025-12-01 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "WILLINGTON BUITRAGO BETANCOUR",
    "establecimiento": "EXPRES CAR",
    "cc": "93397929",
    "direccion": "CLL 23#5-71",
    "telefono": "3115284165",
    "medioDePago": "NEQUI 3115284165",
    "estado": null,
    "fechaApertura": "2025-12-01 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "CARLOS ALBERTO MUÑOZ",
    "establecimiento": "MONTALLANTAS JM",
    "cc": "18492456",
    "direccion": "CLL 25#301 LAS FERIAS",
    "telefono": "3018288308",
    "medioDePago": "NEQUI 3016288308",
    "estado": null,
    "fechaApertura": "2025-11-20 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "TATO",
    "establecimiento": "AUTOS (UNIVERSO AUTOMOTRIZ)",
    "cc": "1110554318",
    "direccion": "CRA 2 #34A-11 BULEVAR",
    "telefono": "3214730865",
    "medioDePago": "NEQUI 3152604034/EFECTIVO",
    "estado": null,
    "fechaApertura": "2025-11-08 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "MARIBEL RIVERA",
    "establecimiento": "TAPICERIA AUTO LUJOS LAS FERIAS",
    "cc": null,
    "direccion": "CLL 25 #2A SUR-31",
    "telefono": "3002741616",
    "medioDePago": "NEQUI 3002741616",
    "estado": null,
    "fechaApertura": "2025-11-11 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "LUIS GOMEZ",
    "establecimiento": "TALLER LUIS",
    "cc": "1005290615",
    "direccion": "CLL 27 #3-78 CLARET",
    "telefono": "3125735583",
    "medioDePago": "NEQUI 3125735583",
    "estado": null,
    "fechaApertura": "2025-11-10 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "WILLIAM ESPINA",
    "establecimiento": "WILLIAM MECANICA",
    "cc": "28515903",
    "direccion": "CRA 1 #24-61 SAN PEDRO",
    "telefono": "3132788511",
    "medioDePago": "EFECTIVO",
    "estado": null,
    "fechaApertura": "2025-11-10 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "JHON MORA",
    "establecimiento": "JHON TIMONES CON ESTILO",
    "cc": null,
    "direccion": "CRA 3 #28 ESQUINA CLARET",
    "telefono": "3134884110",
    "medioDePago": "NEQUI 3134884170",
    "estado": null,
    "fechaApertura": "2025-10-20 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "LUIS FERNANDO OROZCO",
    "establecimiento": "SERVIMONTAJE FERCHO NEUMATICOS PARA MOTOS",
    "cc": "79125453",
    "direccion": "CLL 28 CRA 2-98",
    "telefono": "3125586887",
    "medioDePago": "NEQUI 3125586887",
    "estado": null,
    "fechaApertura": "2025-10-10 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "CESAR CAMARGO",
    "establecimiento": "DON CESAR LAS FERIAS",
    "cc": null,
    "direccion": "CRA 3 SUR # 24-56 LAS FERIAS",
    "telefono": "3202810831",
    "medioDePago": "EFECTIVO",
    "estado": null,
    "fechaApertura": "2025-11-13 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "GABRIEL LOZANO",
    "establecimiento": "POLARIZADO GABRIEL",
    "cc": "2825354",
    "direccion": "CRA 1A #27- 02 SAN PEDRO ALEJANDRINO",
    "telefono": "3005469149/3123821452",
    "medioDePago": "NEQUI 3005469149",
    "estado": null,
    "fechaApertura": "2025-11-11 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "KEVIN OSORIO",
    "establecimiento": "ELECTRO TALLER KEVIN",
    "cc": "110718475",
    "direccion": "CLL 26 #7-44 SUR SAN PEDRO ALEJANDRINO",
    "telefono": "3185860833",
    "medioDePago": "NEQUI 3185860833",
    "estado": null,
    "fechaApertura": "2025-11-11 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "NETALIA YUJURI",
    "establecimiento": "LA FAMILIA FRENOS Y SUSPENSIONES",
    "cc": "1110918715",
    "direccion": "CRA 3 #27-98 CLARET",
    "telefono": "3228118544",
    "medioDePago": "NEQUI 3228118544",
    "estado": null,
    "fechaApertura": "2025-11-11 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "SANDRO MACHADO",
    "establecimiento": "SANDRO MECANICA Y GASES",
    "cc": "1005762263",
    "direccion": "CLL 27 #1-36 SAN PEDRO",
    "telefono": "318260843",
    "medioDePago": "NEQUI 3182608793",
    "estado": null,
    "fechaApertura": "2025-11-10 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "ALEX MEDINA PEDRO",
    "establecimiento": "TALLER MC",
    "cc": "58565606",
    "direccion": "CLL 29 #3-08 CLARET",
    "telefono": "3008600787",
    "medioDePago": "NEQUI 3008600787",
    "estado": null,
    "fechaApertura": "2025-11-10 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "BRAYAN CIFUENTES",
    "establecimiento": "CALCOMANIAS BRAYAN",
    "cc": null,
    "direccion": "28 CON 3 ESQUINA",
    "telefono": "3013590837",
    "medioDePago": "NEQUI 3013590837",
    "estado": null,
    "fechaApertura": "2025-10-20 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "SERGIO SEPULVEDA",
    "establecimiento": "TALLER SERGIO LA 18",
    "cc": "2858456",
    "direccion": "CLL 18 # 1-60 B CENTRO",
    "telefono": "3163944026",
    "medioDePago": "EFECTIVO",
    "estado": null,
    "fechaApertura": "2025-11-14 00:00:00",
    "notas": "YM 02-12"
  } ,
  {
    "titular": "MIRBEAN CRIOLLO ORTIZ",
    "establecimiento": "INDEPENDIENTE",
    "cc": "79867975",
    "direccion": "CLL 5B # 13-72 B 20 DE JULIO",
    "telefono": "3005936490",
    "medioDePago": "NEQUI 3005936490",
    "estado": null,
    "fechaApertura": "2025-11-25 00:00:00",
    "notas": "YM 02-12"
  } ,
  {
    "titular": "CRISTIAN FERNANDO MORALES",
    "establecimiento": "AUTO SWAP",
    "cc": "1006915516",
    "direccion": "CLL 21 # 1-119 B ARADO PARTE ALTA",
    "telefono": "3162204675",
    "medioDePago": "EFECTIVO",
    "estado": null,
    "fechaApertura": "2025-11-29 00:00:00",
    "notas": "YM 02-12"
  } ,
  {
    "titular": "YOANY GOMEZ",
    "establecimiento": "PARQUEADERO HYH",
    "cc": "1110618513",
    "direccion": "CLL 15 # 4-95 B CENTRO",
    "telefono": "3108022476",
    "medioDePago": "EFECTIVO",
    "estado": null,
    "fechaApertura": "2025-11-29 00:00:00",
    "notas": "YM 02-12"
  } ,
  {
    "titular": "ALFREDO VARGAS",
    "establecimiento": "TALLER ALFREDO",
    "cc": "93141516",
    "direccion": "CLL 28 #1-21 B AMERICA",
    "telefono": "3183067054",
    "medioDePago": "NEQUI 3183067054",
    "estado": null,
    "fechaApertura": "2025-11-14 00:00:00",
    "notas": "YM02-12"
  } ,
  {
    "titular": "OSCAR HERNAN MONTOYA",
    "establecimiento": "SERVILLANTAS OSCAR",
    "cc": "16802535",
    "direccion": "CRA 5 CON 22 ESQUINA BOMBA TEXACO",
    "telefono": "3186209670",
    "medioDePago": "NEQUI 3186209670",
    "estado": null,
    "fechaApertura": "2025-11-20 00:00:00",
    "notas": "YM 02-12"
  } ,
  {
    "titular": "JHONATAN VACA FORERO",
    "establecimiento": "TECNILLANTAS JV",
    "cc": "1071987645",
    "direccion": "CLL 28 # 4-52 B LA FRANCIA",
    "telefono": "3503996654",
    "medioDePago": "NEQUI 3503996654",
    "estado": null,
    "fechaApertura": "2025-11-08 00:00:00",
    "notas": "YM 02-12"
  } ,
  {
    "titular": "RICARDO URIBE JARAMILLO",
    "establecimiento": "TALLER URIBE",
    "cc": "93370711",
    "direccion": "CRA 4 ESTADIO 32-64 B LA FRANCIA",
    "telefono": "3194789555",
    "medioDePago": "NEQUI 3182712900",
    "estado": null,
    "fechaApertura": "2025-11-10 00:00:00",
    "notas": "YM02-12"
  } ,
  {
    "titular": "HENRY SUAZA PORTELA",
    "establecimiento": "ASESOR MARKETING",
    "cc": "11321278",
    "direccion": "MZ 3 CS 42 SENDERO DE MINEIMA  VIA SALADO",
    "telefono": "3175802394",
    "medioDePago": "N/A",
    "estado": null,
    "fechaApertura": "2025-11-06 00:00:00",
    "notas": "YM02-12"
  } ,
  {
    "titular": "LEONELA",
    "establecimiento": "CDA",
    "cc": null,
    "direccion": null,
    "telefono": null,
    "medioDePago": "NEQUI",
    "estado": null,
    "fechaApertura": "2025-12-03 00:00:00",
    "notas": "YM03-12"
  } ,
  {
    "titular": "JHON EDISON MARIN",
    "establecimiento": "LATONERIA Y PINTURA JHON",
    "cc": "93278716",
    "direccion": "CLL 24 # 5-41",
    "telefono": "3156382653",
    "medioDePago": "EFECTIVO",
    "estado": null,
    "fechaApertura": "2025-12-03 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "JUAN MANUEL ACOSTA",
    "establecimiento": "KOREACARS",
    "cc": "93385736",
    "direccion": "CLL 25 #6-50",
    "telefono": "3103339922",
    "medioDePago": "NEQUI 3103339922",
    "estado": null,
    "fechaApertura": "2025-12-04 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "CRISTIAN EDUARDO MORA",
    "establecimiento": "LAVA AUTOS NARIÑO",
    "cc": "11301980",
    "direccion": "AVENIDA AMBALA #29-27",
    "telefono": null,
    "medioDePago": "EFECTIVO",
    "estado": null,
    "fechaApertura": "2025-12-04 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "DEIVID VARGAS SANCHEZ",
    "establecimiento": "SERVIYA LA 29",
    "cc": "7318664",
    "direccion": "AVENIDA AMBALA #29-80",
    "telefono": "3214464366",
    "medioDePago": "NEQUI 3214464366",
    "estado": null,
    "fechaApertura": "2025-12-04 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "WILSON FREDY GONZALEZ RAYO",
    "establecimiento": "WILCAR",
    "cc": "5819891",
    "direccion": "AVENIDA AMBALA #30A-48",
    "telefono": "3174368242",
    "medioDePago": "NEQUI 3174368242",
    "estado": null,
    "fechaApertura": "2025-12-04 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "ANDRES CASTRO",
    "establecimiento": "TECNICAR",
    "cc": "1108999760",
    "direccion": "AVENIDA AMBALA #32-65",
    "telefono": "3214049374",
    "medioDePago": "NEQUI 3214049374",
    "estado": null,
    "fechaApertura": "2025-12-04 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "XIMENA MARTINEZ",
    "establecimiento": "CENTRO LUBRICACION LA 33 JL",
    "cc": "39576475",
    "direccion": "AV AMBALA #33-30",
    "telefono": "3125859970",
    "medioDePago": "NEQUI 3125859970",
    "estado": null,
    "fechaApertura": "2025-12-04 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "MARBY VALDERRAMA",
    "establecimiento": "CENTRO DE LUBRICACION FERMORE",
    "cc": "65770735",
    "direccion": "CLL 34 #9-74 GAITA PARTE ALTA",
    "telefono": "3197227756",
    "medioDePago": "NEQUI 3197227756",
    "estado": null,
    "fechaApertura": "2025-12-04 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "VALENTINA MOLINA CARLOS CRUZ BERNAL",
    "establecimiento": "CYS AUTOMOTRIZ",
    "cc": "1110539167",
    "direccion": "CRA 8 # 25-97 BELALCAZAR",
    "telefono": "3112107668/315380616",
    "medioDePago": "CUENTA DE AHORROS BANCOLOMBIA 06889153863",
    "estado": null,
    "fechaApertura": "2025-12-09 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "GUILLERMO ANDRES HERNANDEZ TRUJILLO",
    "establecimiento": "PROMECANICA RH",
    "cc": "1192895644",
    "direccion": "CRA 7 #27-96 LC 2",
    "telefono": "3133108966",
    "medioDePago": "NEQUI 3133108966",
    "estado": null,
    "fechaApertura": "2025-12-09 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "CARLOS EDUARDO CRUZ",
    "establecimiento": "CARAUTOS IBAGUE",
    "cc": "1110502026",
    "direccion": "CLL 25A #5-40",
    "telefono": "3154228453",
    "medioDePago": "NEQUI 3154228453",
    "estado": null,
    "fechaApertura": "2025-12-09 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "TALLER IC",
    "establecimiento": "ISNARDO CAMARGO",
    "cc": "93235989",
    "direccion": "CLL  25A# 5-14",
    "telefono": "3144021923",
    "medioDePago": "NEQUI 3144021923",
    "estado": null,
    "fechaApertura": "2025-12-09 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "LORENA RODRIGUEZ",
    "establecimiento": "CAPITAN GEORGE CARWASH",
    "cc": "65752335",
    "direccion": "CRA 6 # 38-47",
    "telefono": "3023643044",
    "medioDePago": "CUENTA DE AHORROS BANCOLOMBIA 06800014968",
    "estado": null,
    "fechaApertura": "2025-12-09 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "TALLER DE PINTURA AUTOMOTRIZ",
    "establecimiento": "TALLER DE PINTURA AUTOMOTRIZ",
    "cc": "93405794",
    "direccion": "AV GUAVINAL CON 38",
    "telefono": "3157561799",
    "medioDePago": "NEQUI 3157561799",
    "estado": null,
    "fechaApertura": "2025-12-09 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "DARLEY",
    "establecimiento": "MECANICA CENTRAL DE AUTOS",
    "cc": null,
    "direccion": "AV FERROCARRIL 24-55",
    "telefono": "3152143149/3163006569",
    "medioDePago": "EFECTIVO",
    "estado": null,
    "fechaApertura": "2025-12-09 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "DIEGO CARDENAS",
    "establecimiento": "MONTALLANTAS EL INDIO",
    "cc": "1110365213",
    "direccion": "CLL 23 #37-10",
    "telefono": "3213629848",
    "medioDePago": "3213629848",
    "estado": null,
    "fechaApertura": "2025-12-09 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "YEISON PINTO",
    "establecimiento": "SERVITECA LA 23",
    "cc": null,
    "direccion": "AV FERROCARRIL 23-46",
    "telefono": "3128086980",
    "medioDePago": "NEQUI 3128086980",
    "estado": null,
    "fechaApertura": "2025-12-09 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "ANDRES AVILES",
    "establecimiento": "MOTO RAC",
    "cc": "1008716616",
    "direccion": "CLL 25 #3-32",
    "telefono": "3152749936",
    "medioDePago": "NEQUI 3152749936",
    "estado": null,
    "fechaApertura": "2025-12-09 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "HENRY ARIAS",
    "establecimiento": "TORNO CALVO",
    "cc": null,
    "direccion": "CLL 27 #3-13 CLARET",
    "telefono": "3127642443",
    "medioDePago": "EFECTIVO",
    "estado": null,
    "fechaApertura": "2025-12-09 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "NICOLAS GOMEZ",
    "establecimiento": "LAVADERO LEVEL",
    "cc": "1110324758",
    "direccion": "AV FERROCARRIL 24-54",
    "telefono": "3247583395",
    "medioDePago": "NEQUI 3247583395",
    "estado": null,
    "fechaApertura": "2025-12-09 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "FREDY RODRIGUEZ",
    "establecimiento": "ONLY AUTOS",
    "cc": "1005565706",
    "direccion": "AV FERROCARRIL 23-36",
    "telefono": "3155415670",
    "medioDePago": "NEQUI 3155415670",
    "estado": null,
    "fechaApertura": "2025-12-09 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "SERGIO AGUIRRE",
    "establecimiento": "POLARIZADO CAR SOUND",
    "cc": "1110257127",
    "direccion": "AV FERROCARRIL 24-22",
    "telefono": "3125701176",
    "medioDePago": "EFECTIVO",
    "estado": null,
    "fechaApertura": "2025-12-09 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "CARLOS VIVAS",
    "establecimiento": "CAVI AUTOS",
    "cc": "1110482314",
    "direccion": "AV FERROCARROL 24-24",
    "telefono": "3114828645",
    "medioDePago": "NEQUI 3114828645",
    "estado": null,
    "fechaApertura": "2025-12-09 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "LEYDI BENITEZ",
    "establecimiento": "PARQUEADERO PEDRO BENITEZ",
    "cc": "1006718818",
    "direccion": "CRA 3#29-55 EL CLARET",
    "telefono": "3208059280",
    "medioDePago": "EFECTIVO",
    "estado": null,
    "fechaApertura": "2025-12-09 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "NELSON MEDINA",
    "establecimiento": "PARQUEADERO IMPERIAL 12",
    "cc": "96653418",
    "direccion": "CLL 12 #3-44 CENTRO",
    "telefono": "3135253231",
    "medioDePago": "EFECTIVO",
    "estado": null,
    "fechaApertura": "2025-11-29 00:00:00",
    "notas": null
  } ,
  {
    "titular": "NICXON OVIEDO",
    "establecimiento": "OVIEDO.COM CAR AUDIO",
    "cc": null,
    "direccion": "CLL 18 #3-109 CENTRO",
    "telefono": "3188141986",
    "medioDePago": "EFECTIVO",
    "estado": null,
    "fechaApertura": "2025-11-19 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "OSCAR IVAN RODRIGUEZ",
    "establecimiento": "SOMOS DOMICILIO",
    "cc": "1110490648",
    "direccion": "MIRADO VICTORIA AP 502 TORRE 4",
    "telefono": "3154798392",
    "medioDePago": "AVANCE",
    "estado": null,
    "fechaApertura": "2025-10-24 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "RICARDO",
    "establecimiento": "LAVAUTOS BOLIVAR BOMA PRIMAX LA 18",
    "cc": null,
    "direccion": "CRA 2 #18-46",
    "telefono": "3145438673",
    "medioDePago": "EFECTIVO",
    "estado": null,
    "fechaApertura": "2025-11-20 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "ALEJANDRO DANIEL RAMIREZ FIGUEROA",
    "establecimiento": "DISTRIBUYA AUTOS",
    "cc": "10114274347",
    "direccion": "CRA 8 # 15A-12",
    "telefono": "3222838285",
    "medioDePago": "EFECTIVO",
    "estado": null,
    "fechaApertura": "2025-11-11 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "ADONAIS MORALES",
    "establecimiento": "MONTALLANTAS ABNR",
    "cc": null,
    "direccion": "CLL 15 # 9-1 A 9-31",
    "telefono": "3103171447",
    "medioDePago": "NEQUI 3103171447",
    "estado": null,
    "fechaApertura": "2025-12-05 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "JULIAN CRUZ",
    "establecimiento": "PARQUEADERO SOLO MOTOS",
    "cc": "1005819916",
    "direccion": "CRA 1 SUR #45A-67 ZONA",
    "telefono": "3006846706",
    "medioDePago": "EFECTIVO",
    "estado": null,
    "fechaApertura": "2025-12-01 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "DAVID RICO",
    "establecimiento": "TALLER DADIV RICO",
    "cc": "98910543",
    "direccion": "KM 6 VIA AL NEVADO DEL TOLIMA VEREDA TRES ESQUINAS",
    "telefono": "3213725065",
    "medioDePago": "NEQUI 3213725065",
    "estado": null,
    "fechaApertura": "2025-11-24 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "NELSON VALENCIA",
    "establecimiento": "TALLER PINTURA Y LAMINA",
    "cc": "96141520",
    "direccion": "CRA 3# 29-61",
    "telefono": "3168531715",
    "medioDePago": "EFECTIVO",
    "estado": null,
    "fechaApertura": "2025-11-11 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "HELGER GUTIERREZ",
    "establecimiento": "PARQUEADERO LA FLOR LA TRINIDAD",
    "cc": null,
    "direccion": "CLL 18 #12-1",
    "telefono": "3203383579",
    "medioDePago": "EFECTIVO",
    "estado": null,
    "fechaApertura": "2025-12-05 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "CARLOS ALBERTO VIÑA URIBE",
    "establecimiento": "RUEDA SEGURA FRENOS Y SUSPENSION",
    "cc": "1110540409",
    "direccion": "CLL 27 #4C-80",
    "telefono": "3134091354",
    "medioDePago": "NEQUI 3134091354",
    "estado": null,
    "fechaApertura": "2025-12-10 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "JULIAN ESTUPIÑAN",
    "establecimiento": "KOREA CARS",
    "cc": "93402108",
    "direccion": "CLL 25 # 6-50",
    "telefono": "3115511157",
    "medioDePago": "NEQUI 3115511157",
    "estado": null,
    "fechaApertura": "2025-12-11 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "FERNANDO GOMEZ",
    "establecimiento": "DINAUTOS",
    "cc": "93357060",
    "direccion": "CLL 39A #12A-01",
    "telefono": "3114517195",
    "medioDePago": "NEQUI 3114517191",
    "estado": null,
    "fechaApertura": "2025-12-11 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "JESUS CAMACHO",
    "establecimiento": "MONOBLOCK",
    "cc": "17647768",
    "direccion": "CRA 13 #39C-33",
    "telefono": "3163515761",
    "medioDePago": "NEQUI 3163515761",
    "estado": null,
    "fechaApertura": "2025-12-11 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "DOUGLAS MONTEALEGRE",
    "establecimiento": "AUTO RESPUESTOS",
    "cc": "2231617",
    "direccion": "CLL 22 #5-82",
    "telefono": "3007857195",
    "medioDePago": "NEQUI 3007857195",
    "estado": null,
    "fechaApertura": "01/12/20225",
    "notas": "JR"
  } ,
  {
    "titular": "CARLOS ACOSTA",
    "establecimiento": "MAXI REPUESTOS",
    "cc": "6737730",
    "direccion": "CALE 24 #5A-74",
    "telefono": "3143439963",
    "medioDePago": "NEQUI 3143439963",
    "estado": null,
    "fechaApertura": "01/12/20225",
    "notas": "JR"
  } ,
  {
    "titular": "LEYDI CAROLINA CAICEDO",
    "establecimiento": "CENTRO DE LUBRICACION TOP 10",
    "cc": "1110469246",
    "direccion": "AV FERROCARRIL #29-58",
    "telefono": "3183937020",
    "medioDePago": "NEQUI 3183937020",
    "estado": null,
    "fechaApertura": "2025-11-11 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "ALEJANDRO BARON",
    "establecimiento": "TRANSMISIONES AUTOMATICAS GYG",
    "cc": "65633556",
    "direccion": "CLL 27 $4B-79",
    "telefono": "3012462182",
    "medioDePago": "NEQUI 3012462182",
    "estado": null,
    "fechaApertura": "2025-11-12 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "PABLO GARZON PRADA",
    "establecimiento": "LATONERIA CARROS PINTURAS TURBE REY",
    "cc": "14232920",
    "direccion": "CLL 24 CARRERA 9A",
    "telefono": "3228119700",
    "medioDePago": "NEQUI 3228119700",
    "estado": null,
    "fechaApertura": "2025-12-10 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "GERMAN APONTE",
    "establecimiento": "TOYOTA CENTRO 18",
    "cc": "93403071",
    "direccion": "CLL 18 # 1-27 CENTRO",
    "telefono": "3164045718",
    "medioDePago": "NEQUI 3164045718",
    "estado": null,
    "fechaApertura": "2025-12-13 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "DERLY QUIÑONEZ",
    "establecimiento": "TMH TORRES MOTORS HNOS MECANICA",
    "cc": "98975723",
    "direccion": "CLL 18 # 1-75 CENTRO",
    "telefono": "3133130488",
    "medioDePago": "EFECTIVO",
    "estado": null,
    "fechaApertura": "2025-11-14 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "JENNIFER MIROLINDO",
    "establecimiento": "CM AUTOS",
    "cc": null,
    "direccion": "CRA 5 SUR#49-44 ZONA INDUSTRIAL EL PAPAYO",
    "telefono": "3209320682",
    "medioDePago": "DESCUENTOS AUTOS",
    "estado": null,
    "fechaApertura": "2025-12-05 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "MIGUEL CAMPO",
    "establecimiento": "TALLER  MECANICA PARQUEADERO AREVALO",
    "cc": "28582365",
    "direccion": "CRA 3 SUR #22-61 ARADO",
    "telefono": "3202227754",
    "medioDePago": "NEQUI 3202227754",
    "estado": null,
    "fechaApertura": "2025-12-11 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "CESAR GUTIERREZ FLOREZ",
    "establecimiento": "TAMAUTOS",
    "cc": "68651465",
    "direccion": "CLL 25 # 8-85 SAN PEDRO ALEJANDRINO",
    "telefono": "3186067335",
    "medioDePago": "NEQUI 3186067335",
    "estado": null,
    "fechaApertura": "2025-12-10 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "MARTHA LUZ PAEZ",
    "establecimiento": "SERVICULATAS",
    "cc": "1005808716",
    "direccion": "CLL 25 # 1-19 SAN PEDRO ALEJANDRINO",
    "telefono": "3152280024",
    "medioDePago": "NEQUI 3152280024",
    "estado": null,
    "fechaApertura": "2025-12-11 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "SANTIAGO TORRES",
    "establecimiento": "SANTIAGO MONTI CARS",
    "cc": "1005752633",
    "direccion": "CLL 25 # 1-58 SAN PEDRO ALEJANDRIA",
    "telefono": "3133551196",
    "medioDePago": "NEQUI 3133551196",
    "estado": null,
    "fechaApertura": "2025-12-11 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "FABIAN TIQUE",
    "establecimiento": "TAXI CARS IBAGUE",
    "cc": "110550603",
    "direccion": "CLL 28 # 2-56 CLARET",
    "telefono": "3014053778",
    "medioDePago": "EFECTIVO",
    "estado": null,
    "fechaApertura": "2025-12-11 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "FABIAN QUINTERO",
    "establecimiento": "AF MOTOS",
    "cc": "1110816655",
    "direccion": "CLL 25 # 1-67",
    "telefono": "3017121535/3167634897",
    "medioDePago": "NEQUI 3167634897",
    "estado": null,
    "fechaApertura": "2025-12-11 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "ANDERSON DIAZ",
    "establecimiento": "MONTALLANTAS DIAZ",
    "cc": "93238505",
    "direccion": "CLL 28 # 2-83 CLARET",
    "telefono": "3144455831",
    "medioDePago": "NEQUI 3144455831",
    "estado": null,
    "fechaApertura": "2025-12-11 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "HECTOR ENRIQUE MONSALVE",
    "establecimiento": "TORNO TALLER MOTOS",
    "cc": "98574738",
    "direccion": "CRA 19 # 24-108 SAN PEDRO ALEJANDRINO",
    "telefono": "3208093390",
    "medioDePago": "EFECTIVO",
    "estado": null,
    "fechaApertura": "2025-12-11 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "CRISTIAN PEÑA OSWALDO TRUJILLO",
    "establecimiento": "CRISTIAN CREDITOS A TU ALCANCE",
    "cc": "1110460751",
    "direccion": "CLL 42 # 4C-9",
    "telefono": "3219298412",
    "medioDePago": "NEQUI 3219298412",
    "estado": null,
    "fechaApertura": "2025-12-11 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "UVER OCHOA",
    "establecimiento": "AUTOCAR TOLIMA",
    "cc": "93128240",
    "direccion": "CLL 37 # 13-24 GAITAN",
    "telefono": "3143128329",
    "medioDePago": "NEQUI 3143128329",
    "estado": null,
    "fechaApertura": "2025-12-11 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "VICTOR HUGO DURAN",
    "establecimiento": "TALLER DE LATONERIA Y PINTURA",
    "cc": "93129004",
    "direccion": "CLL 37 CON AV AMBALA ESQUINA",
    "telefono": "3015484781",
    "medioDePago": "NEQUI 3015484781",
    "estado": null,
    "fechaApertura": "2025-12-11 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "GEORGE GARCIA",
    "establecimiento": "LATONERIA Y PINTURA LAVADO Y BRILLADO",
    "cc": "1110454955",
    "direccion": "CRA 2 #27-32 SAN PEDRO ALEJANDRINO",
    "telefono": "31860587769",
    "medioDePago": "NEQUI 3216265598",
    "estado": null,
    "fechaApertura": "2025-12-11 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "ALEXANDER RODRIGUEZ",
    "establecimiento": "JM REPUESTOS",
    "cc": "79574616",
    "direccion": "CRA 27 #76 SAN PEDRO ALEJANDRINO",
    "telefono": "3118549671",
    "medioDePago": "NEQUI 3103761001/EFECTIVO",
    "estado": null,
    "fechaApertura": "2025-12-11 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "HERMES CASTRO",
    "establecimiento": "TALLERES CASTRO",
    "cc": "79370451",
    "direccion": "AV AMBALA #39-46",
    "telefono": "3158893313",
    "medioDePago": "NEQUI 3158893313",
    "estado": null,
    "fechaApertura": "2025-12-11 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "JAVIER RAYO",
    "establecimiento": "PINTU CHENCHO",
    "cc": null,
    "direccion": "CRA 2 #27-103",
    "telefono": "3142876464/3196163761",
    "medioDePago": "NEQUI 3142876464/3196163761",
    "estado": null,
    "fechaApertura": "2025-12-11 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "LILIANA GARZON",
    "establecimiento": "AUTO SPA MEGUIARS",
    "cc": "45665744",
    "direccion": "CRA 7A SUR # 43B-230",
    "telefono": "3213751906",
    "medioDePago": "EFECTIVO",
    "estado": null,
    "fechaApertura": "2025-12-11 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "EDISON",
    "establecimiento": "COOL KING PARQUEADERO CANCHA SINTETICA",
    "cc": "1110218547",
    "direccion": "CLL 50 EL PAPAYO #50-26",
    "telefono": "3182812186",
    "medioDePago": "EFECTIVO",
    "estado": null,
    "fechaApertura": "2025-12-13 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "VALENTINA",
    "establecimiento": "BETA CARS CARROS NUEVOS Y USADOS",
    "cc": null,
    "direccion": "CRA 5 #49-94 ZONA INDUSTRIAL EL PAPAYO",
    "telefono": "3132126337",
    "medioDePago": "DESCUENTOS AUTOS",
    "estado": null,
    "fechaApertura": "2025-12-12 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "ANGELA ANGARITA",
    "establecimiento": "ELITE CARS INGENIERIA MECANICA",
    "cc": null,
    "direccion": "CRA 5 # 49-98 EL PAPAYO",
    "telefono": "3138738422",
    "medioDePago": "DESCUENTOS AUTOS",
    "estado": null,
    "fechaApertura": "2025-12-12 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "LIBERADO GARCIA",
    "establecimiento": "VIGILANTE RINCON DE LA POLA",
    "cc": null,
    "direccion": "CLL 3A #5-03 POLA",
    "telefono": "3153742943",
    "medioDePago": "DESCUENTOS AUTOS",
    "estado": null,
    "fechaApertura": "2025-12-10 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "JUAN CARLOS RAMIRO VASQUEZ",
    "establecimiento": "EDIFICIO IRAZU 2 POLA/CONJUNTO IRAZU",
    "cc": null,
    "direccion": "CLL 3#5-13 LA POLA",
    "telefono": "3236146098/3177925990",
    "medioDePago": "EFECTIVO/DESCUENTOS AUTOS",
    "estado": null,
    "fechaApertura": "2025-12-09 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "JOSE LUIS DIAZ AMAYA",
    "establecimiento": "JL AUTOMOTRIZ",
    "cc": "1110479071",
    "direccion": "AV AMBALA #40-19",
    "telefono": "311510176/3125277393",
    "medioDePago": "NEQUI 3115101176",
    "estado": null,
    "fechaApertura": "2025-12-12 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "HILDELBRANDO SANDOVAL",
    "establecimiento": "PINTU AUTOS",
    "cc": "93450962",
    "direccion": "CLL 40 #14-54",
    "telefono": "3107684035",
    "medioDePago": "NEQUI 3107684035",
    "estado": null,
    "fechaApertura": "2025-12-12 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "ANDRES LONDOÑO",
    "establecimiento": "LAVAUTOS BROSS",
    "cc": "1099554322",
    "direccion": "CLL 65 #21-52",
    "telefono": "3133740897",
    "medioDePago": "NEQUI 3133740897",
    "estado": null,
    "fechaApertura": "2025-12-12 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "HECTOR ENRIQUE ZAAVEDRA",
    "establecimiento": "TALLER AUTOMOTRIZ",
    "cc": "93362847",
    "direccion": "CLL 59#20-07",
    "telefono": "3162390624",
    "medioDePago": "NEQUI 3162390624",
    "estado": null,
    "fechaApertura": "2025-12-12 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "ANGELA MILLAN",
    "establecimiento": "LAVAUTOS SAMUEL",
    "cc": "1094903799",
    "direccion": "CRA 20 # 60-17 AV AMBALA",
    "telefono": "3194402987",
    "medioDePago": "NEQUI 3194402987",
    "estado": null,
    "fechaApertura": "2025-12-12 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "FERNANDO QUIROGA",
    "establecimiento": "LATONERIA Y PINTURA BARRIO LAS FERIAS",
    "cc": "26586230",
    "direccion": "CLL 27 #1-38 SUR",
    "telefono": "3102774534",
    "medioDePago": "EFECTIVO",
    "estado": null,
    "fechaApertura": "2025-12-13 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "JUAN BAUTISTA VACA",
    "establecimiento": "MONTALLANTAS GARZON LAS VACAS",
    "cc": "6009803",
    "direccion": "CRA 4F SUR # CALLE 24 GARZON",
    "telefono": "3132417558",
    "medioDePago": "NEQUI 3132417558",
    "estado": null,
    "fechaApertura": "2025-12-13 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "JUAN REYES SANCHEZ",
    "establecimiento": "LAVADERO Y PARQUEADERO REYES SANCHEZ",
    "cc": "93398285",
    "direccion": "CLL 64#28-51 LOS ANGELES",
    "telefono": "3105502808/3203427772",
    "medioDePago": "NEQUI 3105502808",
    "estado": null,
    "fechaApertura": "2025-12-13 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "RAGUER CARVAJAL",
    "establecimiento": "LAVAUTOS RACAR",
    "cc": "5820469",
    "direccion": "CLL 64 #16A-04 AMBARA",
    "telefono": "3044641201",
    "medioDePago": "NEQUI 3044641201",
    "estado": null,
    "fechaApertura": "2025-12-13 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "CESAR DANIEL GULLOSO ESCOBAR",
    "establecimiento": "MONTALLANTAS EL COSTEÑO",
    "cc": "1085180616",
    "direccion": "AV GUAVINAL #51-53 ESQUINA PARQUEADERO",
    "telefono": "3209090074",
    "medioDePago": "NEQUI 3209090074",
    "estado": null,
    "fechaApertura": "2025-12-13 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "EDILBERTO CABEZAS",
    "establecimiento": "LAMINA Y PINTURA MECANICA",
    "cc": "14236462",
    "direccion": "CRA 2 #58-06 LA FLORESTA",
    "telefono": "3153218781",
    "medioDePago": "EFECTIVO",
    "estado": null,
    "fechaApertura": "2025-12-14 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "MARCO ANTONIO VARGAS",
    "establecimiento": "GAMA PAISA",
    "cc": null,
    "direccion": "CLL 59 #3-49 LA FLORESTA",
    "telefono": "3108794623",
    "medioDePago": "NEQUI 3108794623",
    "estado": null,
    "fechaApertura": "2025-12-14 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "AFLONSO TIQUE",
    "establecimiento": "TALLER AUTOMOTRIZ AT",
    "cc": "14219446",
    "direccion": "CLL 59 # 3-65 LA FLORESTA",
    "telefono": "3132098172",
    "medioDePago": "EFECTIVO",
    "estado": null,
    "fechaApertura": "2025-12-14 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "HENRY",
    "establecimiento": "HENRY CARS",
    "cc": null,
    "direccion": "CLL 59#3-49 LA FLORESTA",
    "telefono": "3138151258",
    "medioDePago": "EFECTIVO",
    "estado": null,
    "fechaApertura": "2025-12-14 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "LABIN AVILA",
    "establecimiento": "AUTOS Y MULAS",
    "cc": null,
    "direccion": "CRA 1B # 59-40 FLORESTA",
    "telefono": "3153779036",
    "medioDePago": "NEQUI 3153779036",
    "estado": null,
    "fechaApertura": "2025-12-14 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "LEONARDO",
    "establecimiento": "TALLER LEOS CARS",
    "cc": "1075244519",
    "direccion": "CRA 3A #59-34",
    "telefono": "3118563911",
    "medioDePago": "NEQUI 3118563911",
    "estado": null,
    "fechaApertura": "2025-12-14 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "JULIA RAMIREZ",
    "establecimiento": "PARQUEADERO EL PARAISO",
    "cc": null,
    "direccion": "CLL 26#4B-77 SAN VICENTE FERIAS",
    "telefono": "3212642322",
    "medioDePago": "EFECTIVO",
    "estado": null,
    "fechaApertura": "2025-12-14 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "FABIAN ALEJANDRO DIAZ",
    "establecimiento": "TALLER FADSAUTOS",
    "cc": "1110516175",
    "direccion": "CRA 4B # 32-29 LA FRANCIA",
    "telefono": "3215326176",
    "medioDePago": "NEQUI 3215326176",
    "estado": null,
    "fechaApertura": "2025-12-15 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "SACIA ALBERTO TAFU MONROE",
    "establecimiento": "MECANICA PARQUEADERO CENEN",
    "cc": "14222601",
    "direccion": "CRA 5 # 14-24 CENTRO",
    "telefono": "3118856535",
    "medioDePago": "EFECTIVO",
    "estado": null,
    "fechaApertura": "2025-12-16 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "ORLANDO GARCIA JAIME GARCIA",
    "establecimiento": "ALMACEN Y TALLER SKOD",
    "cc": null,
    "direccion": "CLL 23 #3-120 LA ESTACION",
    "telefono": "3107547856/3132420639",
    "medioDePago": "EFECTIVO",
    "estado": null,
    "fechaApertura": "2025-12-16 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "ALEJANDRO PACHECO",
    "establecimiento": "AUTOMARCAS JA",
    "cc": null,
    "direccion": "CRA 8 SUR #77-118 MIROLINDO",
    "telefono": "3138124849",
    "medioDePago": "DESCUENTOS AUTOS",
    "estado": null,
    "fechaApertura": "2025-12-08 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "JUAN MANUEL RIOS BONILLA",
    "establecimiento": "FLOTA DE UBER COMPRAVENTA DE VEHICULOS MIRAMAR",
    "cc": "1010024910",
    "direccion": "ALMINAR SAMUA T4 APT 601",
    "telefono": "3228858692",
    "medioDePago": "EFECTIVO O DCTO DIRECAMENTE",
    "estado": null,
    "fechaApertura": "2025-12-17 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "ANDRES DEVIA",
    "establecimiento": "MOTO LAVADO SIETE DE AGOSTO",
    "cc": null,
    "direccion": "CRA 13 #12-35",
    "telefono": "3123609082",
    "medioDePago": "EFECTIVO",
    "estado": null,
    "fechaApertura": "2025-12-16 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "DIANA GUARNIZO RAMIREZ",
    "establecimiento": "PARQUEADERO 20 DE JULIO",
    "cc": "52272843",
    "direccion": "DIAGONAL 9B #12-17 20 DE JULIO",
    "telefono": "3105755648",
    "medioDePago": "EFECTIVO",
    "estado": null,
    "fechaApertura": "2025-12-16 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "OSWALDO MEDINA",
    "establecimiento": "MOGOTAX",
    "cc": null,
    "direccion": "CRA 8 #29-50",
    "telefono": "3042959547",
    "medioDePago": "DESCUENTOS AUTOS RTM Y PREVENTIVAS",
    "estado": null,
    "fechaApertura": "2025-12-10 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "GONZALO QUINTERO RUBIO",
    "establecimiento": "TECNI TAPIZADOS",
    "cc": "3244927",
    "direccion": "CLL 25 #03-03",
    "telefono": "3246877167",
    "medioDePago": "EFECTIVO",
    "estado": null,
    "fechaApertura": "2025-12-10 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "JOSE VICENTE",
    "establecimiento": "CLINICA DE LLANTAS JV",
    "cc": "5456632",
    "direccion": "CRA 2 #22-24 SAN PEDRO ALEJANDRNO",
    "telefono": "3144729671",
    "medioDePago": "EFECTIVO",
    "estado": null,
    "fechaApertura": "2025-12-12 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "JUAN MORA",
    "establecimiento": "JM MOTORS",
    "cc": "9496956",
    "direccion": "CRA 2 #26-28B SAN PEDRO ALEJANDRINO",
    "telefono": "3189545161-3015001024",
    "medioDePago": "EFECTIVO",
    "estado": null,
    "fechaApertura": "2025-12-13 00:00:00",
    "notas": "ACTUALIZADO 15/01/2026 JR"
  } ,
  {
    "titular": "PEDRO CHAVARRO",
    "establecimiento": "LUJOS SANY POLARIZADOS",
    "cc": "1005966613",
    "direccion": "AV FERROCARRIL #23-66",
    "telefono": "3115320127",
    "medioDePago": "EFECTIVO",
    "estado": null,
    "fechaApertura": "2025-12-11 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "JORGE BAUTISTA",
    "establecimiento": "AUTO LUJOS JB",
    "cc": "24969485",
    "direccion": "AV FERROCARRIL #22-08",
    "telefono": "3153045943",
    "medioDePago": "EFECTIVO",
    "estado": null,
    "fechaApertura": "2025-12-12 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "WILDER EFREN CASTAÑEDA RAMIREZ",
    "establecimiento": "ALMACEN ELECTRICO CASTAÑEDA",
    "cc": "86043846",
    "direccion": "CRA 1#18-04 CENTRO",
    "telefono": "3168546000",
    "medioDePago": "NEQUI 3053905238",
    "estado": null,
    "fechaApertura": "2025-12-11 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "CRISTIAN HAROLD ANGARITA PARRA",
    "establecimiento": "INDEPENDIENTE",
    "cc": "14297535",
    "direccion": "CRA 8 #39-42 RESTREPO",
    "telefono": "3204598647",
    "medioDePago": "DESCUENTOS AUTOS",
    "estado": null,
    "fechaApertura": "2025-12-13 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "HARVEY RIOS",
    "establecimiento": "MR MOTOS",
    "cc": "14139829",
    "direccion": "AV GUAVINAL #23-07",
    "telefono": "3106750635",
    "medioDePago": "NEQUI 3106750635",
    "estado": null,
    "fechaApertura": "2025-12-22 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "JUAN CARLOS PORRAS",
    "establecimiento": "LUBRIAMBALA SERVITECA",
    "cc": "73336376",
    "direccion": "AV AMBALA #33-31",
    "telefono": "3112335674",
    "medioDePago": "NEQUI 3112335674",
    "estado": null,
    "fechaApertura": "2025-12-22 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "ALEJANDRO LAGUNA",
    "establecimiento": "LAVADERO CENTENARIO",
    "cc": "1006227681",
    "direccion": "CLL 11 #6-79 CENTRO",
    "telefono": "3142661721",
    "medioDePago": "NEQUI 3142661721",
    "estado": null,
    "fechaApertura": "2025-12-21 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "ANDRES GUARNIZO",
    "establecimiento": "PINTURA Y LATONERIA DENTRO DEL PARQUEADERO",
    "cc": "1109493092",
    "direccion": "CRA4B #23-48",
    "telefono": "3143171331",
    "medioDePago": "NEQUI 3143171331",
    "estado": null,
    "fechaApertura": "2025-12-23 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "HENRY CABAL MARTINEZ",
    "establecimiento": "MULTISERVICIOS MARTINEZ",
    "cc": "17313489",
    "direccion": "CLL 24#4-81",
    "telefono": "3195459933",
    "medioDePago": "NEQUI 3195459933",
    "estado": null,
    "fechaApertura": "2025-12-23 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "JHON EDWAR OLAYA QUIÑONEZ",
    "establecimiento": "PARQUEADERO JT",
    "cc": "1106787769",
    "direccion": "CLL 24#4A-36",
    "telefono": "3142525952",
    "medioDePago": "NEQUI 3142525952",
    "estado": null,
    "fechaApertura": "2025-12-23 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "JHON GUZMAN",
    "establecimiento": "JHON CHUCHOS",
    "cc": "25200986",
    "direccion": "CLL 25 #3-25",
    "telefono": "3115849844",
    "medioDePago": null,
    "estado": null,
    "fechaApertura": null,
    "notas": null
  } ,
  {
    "titular": "LAURA COTAMO",
    "establecimiento": "INDEPENDIENTE SOAT",
    "cc": null,
    "direccion": "CRA 8 #123-154",
    "telefono": "3209884328",
    "medioDePago": "NEQUI 3209884328",
    "estado": null,
    "fechaApertura": "2025-12-15 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "ANDREA ZULY NOREÑA",
    "establecimiento": "SEGUROS SOAT CUY",
    "cc": null,
    "direccion": "CRA 9#935 LOCAL 4",
    "telefono": "3227086724",
    "medioDePago": "EFECTIVO",
    "estado": null,
    "fechaApertura": "2025-12-15 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "JOSE LOAIZA",
    "establecimiento": "MONTALLANTAS ELIAZAR",
    "cc": null,
    "direccion": "CLL 17 #1-44",
    "telefono": "3114486066",
    "medioDePago": "NEQUI 3114486066",
    "estado": null,
    "fechaApertura": "2025-12-27 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "KAREN DANIELA VARON",
    "establecimiento": "SPA NAILS MACAON",
    "cc": "1007384745",
    "direccion": "CRA 1 #16-71",
    "telefono": "3204333723",
    "medioDePago": "NEQUI 3204333723",
    "estado": null,
    "fechaApertura": "2025-12-26 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "ERIKA BOCANEGRA",
    "establecimiento": "JH LUJOS",
    "cc": "6554146",
    "direccion": "ROVIRA",
    "telefono": "3157300989",
    "medioDePago": "NEQUI 3157300989",
    "estado": null,
    "fechaApertura": "2025-12-13 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "JAIRO SANCHEZ",
    "establecimiento": "VIGILANTE PARQUE CENTRAL",
    "cc": null,
    "direccion": "CRA SUR #23A-01 FERIAS",
    "telefono": "3246531630",
    "medioDePago": "EFECTIVO",
    "estado": null,
    "fechaApertura": "2025-11-29 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "ANGEL STIVENSON MURILLO USECHE",
    "establecimiento": "HYDROSTOP MURILLO CENTER",
    "cc": "26208137",
    "direccion": "AV FERROCARRIL #27-46 LC 2",
    "telefono": "3223591686",
    "medioDePago": "NEQUI 3223591686",
    "estado": null,
    "fechaApertura": "2025-11-11 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "JHON FREDY SERNA",
    "establecimiento": "JHON MECANICO",
    "cc": null,
    "direccion": "CLL 25 #2A-28",
    "telefono": "3104330672",
    "medioDePago": "EFECTIVO",
    "estado": null,
    "fechaApertura": "2025-11-13 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "ANDRES CARLOS BUITRAGO",
    "establecimiento": "LAVA AUTOS LOS COCHES",
    "cc": "68653428",
    "direccion": "CRA 2 #17-60",
    "telefono": "3125117066",
    "medioDePago": "NEQUI 3125117066",
    "estado": null,
    "fechaApertura": "2025-11-10 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "JUAN GOMEZ",
    "establecimiento": "MOTO GOMEZ",
    "cc": "1110516882",
    "direccion": "CLL 38 #3B-30",
    "telefono": "3222522843",
    "medioDePago": "NEQUI 3222522843",
    "estado": null,
    "fechaApertura": "2025-11-12 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "MIGUEL SIERRA",
    "establecimiento": "PARQUEADERO LA 15",
    "cc": "1005716270",
    "direccion": "CRA 2 #15-31",
    "telefono": "3123572856",
    "medioDePago": "EFECTIVO/NEQUI 3123572856",
    "estado": null,
    "fechaApertura": "2025-11-14 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "LUIS FELIPE CLAVIJO ROJAS",
    "establecimiento": "FRENOS FELIPE",
    "cc": "93357793",
    "direccion": "CRA 4A BIS#26-37",
    "telefono": "3167838095",
    "medioDePago": "NEQUI 3167838095",
    "estado": null,
    "fechaApertura": "2025-11-13 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "MIGUEL ARAUJO VANEGAS",
    "establecimiento": "PARQUEADERO LA 15 CENTRO LA 15",
    "cc": "1004416619",
    "direccion": "CRA 1 #15-49",
    "telefono": "3228603165",
    "medioDePago": "EFECTIVO",
    "estado": null,
    "fechaApertura": "2025-11-20 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "EDWARD ANCIZAR OSPITIA MARTINEZ",
    "establecimiento": "TALLER OSPITIA",
    "cc": "93395323",
    "direccion": "CRA 5 #23-21",
    "telefono": "3172331876",
    "medioDePago": "NEQUI 3172331876",
    "estado": null,
    "fechaApertura": "2025-12-02 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "CLINTON MANOLO ROA GODOY",
    "establecimiento": "TALLER DE MOTOS RG",
    "cc": "106976605",
    "direccion": "CRA 4A TAMANA #31-90",
    "telefono": "3330512563",
    "medioDePago": "NEQUI 3213060732",
    "estado": null,
    "fechaApertura": "2025-11-11 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "BYARON RODRIGUEZ",
    "establecimiento": "SERVICIO MECANICA TAXIS BYARON",
    "cc": "9732345",
    "direccion": "CLL 23 #1A-47",
    "telefono": "3185839643",
    "medioDePago": "EFECTIVO",
    "estado": null,
    "fechaApertura": "2025-11-25 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "ALEX MONTOYA",
    "establecimiento": "SERVICIO TOYOTA",
    "cc": null,
    "direccion": "CLL 23 #1A-47",
    "telefono": "3114639616",
    "medioDePago": "EFECTIVO",
    "estado": null,
    "fechaApertura": "2025-11-25 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "OSCA HERTAS ALEXIS HUERTAS",
    "establecimiento": "D CARS MECANICA GENERAL",
    "cc": null,
    "direccion": "CLL 23 #1A-47",
    "telefono": "3053221345/3219937667",
    "medioDePago": "EFECTIVO",
    "estado": null,
    "fechaApertura": "2025-11-25 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "JUAN ALBERTO GALLO",
    "establecimiento": "SERVIMOTOS IBAGUE",
    "cc": "7050642070",
    "direccion": "CLL 24#1A-20",
    "telefono": "3023668803",
    "medioDePago": "EFECTIVO",
    "estado": null,
    "fechaApertura": "2025-11-25 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "JUAN CARLOS SANCHEZ",
    "establecimiento": "ELECTRICOS CARJUN PITUFOS",
    "cc": "14242371",
    "direccion": "CRA 5#22-76",
    "telefono": "3166338790",
    "medioDePago": "NEQUI 3166338790",
    "estado": null,
    "fechaApertura": "2025-11-27 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "GIOVANY RESTREPO",
    "establecimiento": "TALLER DE  MOTOS GT 109",
    "cc": "1110603457",
    "direccion": "CRA 4 TAMARA#23-49",
    "telefono": "3022491907/3014577236",
    "medioDePago": "NEQUI 3022491907",
    "estado": null,
    "fechaApertura": "2025-11-18 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "JHON RICARDO BAUTISTA",
    "establecimiento": "PARABRISAS JR",
    "cc": "1110475706",
    "direccion": "CLL 35#4-13",
    "telefono": "3123021501",
    "medioDePago": "NEQUI 3123021501",
    "estado": null,
    "fechaApertura": "2025-11-10 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "KAREN JULIETH PEÑUELA",
    "establecimiento": "AUTOAIRES",
    "cc": "1110571709",
    "direccion": "AV FERROCARRIL #26-43",
    "telefono": "3148693875",
    "medioDePago": "NEQUI 3148693875",
    "estado": null,
    "fechaApertura": "2025-11-13 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "ALEXANDER HENAO MURILLO",
    "establecimiento": "TALLER HENAO",
    "cc": "93395437",
    "direccion": "CLL 30A #11-12",
    "telefono": "3015908390/3124210735",
    "medioDePago": "NEQUI 3124210735",
    "estado": null,
    "fechaApertura": "2025-12-22 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "ALEXANDER REYES",
    "establecimiento": "AUTOS START IBAGUE",
    "cc": "25666313",
    "direccion": "CRA 5#49-120 LOCAL 3",
    "telefono": "3003286305",
    "medioDePago": "EFECTIVO O DCTO DIRECAMENTE",
    "estado": null,
    "fechaApertura": "2025-12-01 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "ELKIN GUZMAN Y DANIELA FLOREZ",
    "establecimiento": "MECANICA PARQUEADERO POSTOBOM",
    "cc": "96613314",
    "direccion": "CRA 7a #16-34",
    "telefono": "3106194541/300423273",
    "medioDePago": "NEQUI 3106194541",
    "estado": null,
    "fechaApertura": "2025-11-30 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "MAURICIO GIRALDO",
    "establecimiento": "MOTORS GARAGE",
    "cc": "1110494644",
    "direccion": "CLL 23#5-61",
    "telefono": "3165785305",
    "medioDePago": "NEQUI 3165785305",
    "estado": null,
    "fechaApertura": "2025-12-14 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "ROBINSON LOPEZ LOAIZA",
    "establecimiento": "PARQUEADERO SEPTIMA",
    "cc": null,
    "direccion": "CRA 7 #19-34",
    "telefono": "3216339293",
    "medioDePago": "NEQUI 3216339293",
    "estado": null,
    "fechaApertura": "2025-12-13 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "EDGAR SANCHEZ",
    "establecimiento": "SANTY MOTOS",
    "cc": "93378117",
    "direccion": "CRA 5#24-21",
    "telefono": "3243085455-3043146422",
    "medioDePago": "EFECTIVO",
    "estado": null,
    "fechaApertura": "2025-12-29 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "NELSON IVAN AMEZQUITA",
    "establecimiento": "INDEPENDIENTE",
    "cc": "25655432",
    "direccion": "CLL 13SUR #3-61",
    "telefono": "3108093370",
    "medioDePago": "DESCUENTO A CARROS",
    "estado": null,
    "fechaApertura": "2025-12-10 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "LUIS FERNANDO RUBIO",
    "establecimiento": "LUIS LA 27 FEDEAUTOS",
    "cc": null,
    "direccion": "CRA 3#27-83",
    "telefono": "3133119284",
    "medioDePago": "EFECTIVO",
    "estado": null,
    "fechaApertura": "2026-01-13 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "JHON DIAZ",
    "establecimiento": "LATONERO AUTO TONE",
    "cc": null,
    "direccion": "CLL 21 #1-115",
    "telefono": "3124071567",
    "medioDePago": "EFECTIVO",
    "estado": null,
    "fechaApertura": "2026-01-13 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "MANUEL LOAIZA",
    "establecimiento": "TALLER LOAIZA AUTOMOTRIZ",
    "cc": null,
    "direccion": "CLL 21 #1-115",
    "telefono": "3186795931",
    "medioDePago": "EFECTIVO",
    "estado": null,
    "fechaApertura": "2026-01-13 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "DIEGO RAMIRO WALTERO",
    "establecimiento": "AMERICANA DE EXOSTOS",
    "cc": "14239933",
    "direccion": "AV FERROCARRIL #23-98",
    "telefono": "3135428118",
    "medioDePago": "NEQUI 3123169409",
    "estado": null,
    "fechaApertura": "2025-01-14 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "DIEGO MARIN",
    "establecimiento": "AMERICANA DE EXOSTOS",
    "cc": "5827013",
    "direccion": "AV FERROCARRIL #23-98",
    "telefono": null,
    "medioDePago": null,
    "estado": null,
    "fechaApertura": null,
    "notas": null
  } ,
  {
    "titular": "ALEXANDER GUTIERREZ",
    "establecimiento": "TALLER ALEXANDER ALIAS PITI",
    "cc": "94486460",
    "direccion": "CALLE 18#1-90 CENTRO",
    "telefono": "3143967225",
    "medioDePago": "NEQUI 3143967225",
    "estado": null,
    "fechaApertura": "2025-01-15 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "OLIVER VALENCIA",
    "establecimiento": "TALLER OLIVER",
    "cc": "93408553",
    "direccion": "CRA 12 #29-79",
    "telefono": "3193493625",
    "medioDePago": "NEQUI 3193493625",
    "estado": null,
    "fechaApertura": "2026-01-19 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "WILFREDO SERRANO",
    "establecimiento": "TECNIFRENOS Y SUSPENSIONES",
    "cc": "1016023413",
    "direccion": "CRA 7 #19-34",
    "telefono": "3213773734",
    "medioDePago": "NEQUI 3213773734",
    "estado": null,
    "fechaApertura": "2026-01-16 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "DUBER RODRIGUEZ",
    "establecimiento": "KYRON MOTORS",
    "cc": "1110490203",
    "direccion": "AV AMBALA #34-15",
    "telefono": "3178120880",
    "medioDePago": "NEQUI 3178120880",
    "estado": null,
    "fechaApertura": "2026-01-17 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "JOANI DIAZ",
    "establecimiento": "INDEPENDIENTE",
    "cc": null,
    "direccion": "MANZANA 2 CASA 2 MURILLO TORO",
    "telefono": "3173174277",
    "medioDePago": "NEQUI 3173174277",
    "estado": null,
    "fechaApertura": "2026-01-18 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "WALTER BARRERA",
    "establecimiento": "BOMBA LA 19",
    "cc": null,
    "direccion": "CRA 4#19",
    "telefono": "3105880098",
    "medioDePago": "EFECTIVO",
    "estado": null,
    "fechaApertura": "2026-01-02 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "EPIFANIO MOTTA",
    "establecimiento": "ELECTRICAR",
    "cc": "93383645",
    "direccion": "CRA 4B #28A-52",
    "telefono": "3193493628",
    "medioDePago": "NEQUI 3193493628",
    "estado": null,
    "fechaApertura": "2025-11-12 00:00:00",
    "notas": "ACTUALIZADO 21/01/2026 JR"
  } ,
  {
    "titular": "JAMIE GARCIA",
    "establecimiento": "TECNISERVICIOS JE",
    "cc": "71741760",
    "direccion": "VILLA CELAMBEO 19A #96-47",
    "telefono": "3158933958",
    "medioDePago": "NEQUI 3158933958",
    "estado": null,
    "fechaApertura": "2026-01-21 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "JUAN PABLO MOLANO",
    "establecimiento": "AUTOTECH SERVICIO AUTOMOTRIZ",
    "cc": null,
    "direccion": "CALLE 18#9-63",
    "telefono": "3242194434",
    "medioDePago": "EFECTIVO",
    "estado": null,
    "fechaApertura": "2026-01-21 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "OSCAR RAMIREZ",
    "establecimiento": "MOTOS OR",
    "cc": "65831483",
    "direccion": "CALLE 188#96-101",
    "telefono": "3132775019",
    "medioDePago": "EFECTIVO",
    "estado": null,
    "fechaApertura": "2026-01-21 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "ANDREY PERDOMO",
    "establecimiento": "UNICENTER ESPRESS",
    "cc": null,
    "direccion": "CRA 11#19A-18",
    "telefono": "3204155271",
    "medioDePago": "NEQUI 3204155271",
    "estado": null,
    "fechaApertura": "2026-01-21 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "CAROLINA HOYOS",
    "establecimiento": "INDEPENDIENTE SOAT",
    "cc": "28598612",
    "direccion": "CRA 15-19 PUEBLO NUEVO",
    "telefono": "3003468650",
    "medioDePago": "NEQUI 3123942242",
    "estado": null,
    "fechaApertura": "2026-01-21 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "DANY HARVEY VALENCIA",
    "establecimiento": "MECANICO INGEMOTOR",
    "cc": "1104710295",
    "direccion": "CLL 24#1-39",
    "telefono": "3133443279",
    "medioDePago": "NEQUI 3133443279",
    "estado": null,
    "fechaApertura": "2026-01-21 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "FERNANDO NIETO",
    "establecimiento": "FULLMOTOS",
    "cc": "1007817808",
    "direccion": "CRA 5#5-45",
    "telefono": "3216988112",
    "medioDePago": "NEQUI 3216988112",
    "estado": null,
    "fechaApertura": "2026-01-22 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "ELKIN DARIO NARANJO",
    "establecimiento": "TALLER EL PAPA",
    "cc": "1108999125",
    "direccion": "CLL 5#5-55",
    "telefono": "310561454-3502172945",
    "medioDePago": "NEQUI 3105610454",
    "estado": null,
    "fechaApertura": "2026-01-22 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "ERNESTO ADOLFO MENDOZA",
    "establecimiento": "TALLER LA BALA",
    "cc": "1105344149",
    "direccion": "CRA 6A#5-20",
    "telefono": "3176570038",
    "medioDePago": "NEQUI 3176570038",
    "estado": null,
    "fechaApertura": "2026-01-22 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "JOSE LOZANO",
    "establecimiento": "TALLER COCO",
    "cc": "11222525",
    "direccion": "CRA 5#6-67",
    "telefono": "3203100865",
    "medioDePago": "NEQUI 3203100865",
    "estado": null,
    "fechaApertura": "2026-01-22 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "JOSE DAVID SANCHEZ AVENAIN",
    "establecimiento": "KEIDANA MOTOS",
    "cc": "5819079",
    "direccion": "KEIDANA CRA 5#7 ESQUINA",
    "telefono": "3123771071",
    "medioDePago": "NEQUI 3117786420",
    "estado": null,
    "fechaApertura": "2026-01-22 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "JONATHAN CARDOZO",
    "establecimiento": "MOTO STUNT",
    "cc": "1006005922",
    "direccion": "CRA 5#4-80",
    "telefono": "3105741623",
    "medioDePago": "NEQUI 3105741623",
    "estado": null,
    "fechaApertura": "2026-01-22 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "WILLIAM GARZON",
    "establecimiento": "LAVADERO MOTO LA 5",
    "cc": "1192793412",
    "direccion": "CRA 5#7-47",
    "telefono": "3228003096",
    "medioDePago": "NEQUI 3144754090",
    "estado": null,
    "fechaApertura": "2026-01-22 00:00:00",
    "notas": "JR"
  } ,
  {
    "titular": "GILBERTO OCAMPO ALVAREZ",
    "establecimiento": "GILBERTO LA LIBERTAD",
    "cc": "14229621",
    "direccion": null,
    "telefono": "3219152550",
    "medioDePago": "EFECTIVO",
    "estado": null,
    "fechaApertura": "2026-01-22 00:00:00",
    "notas": "JR"
  }
]


export default class ConveniosFromExcelSeeder extends BaseSeeder {
  async run() {
    const trx = await Database.transaction()

    try {
      console.log('🚀 Iniciando creación de convenios...')

      let createdCount = 0
      let errorCount = 0
      let dummyCCCounter = 9999000001

      const now = DateTime.now().toFormat('yyyy-MM-dd HH:mm:ss')
      const today = DateTime.now().toISODate()

      // 🔑 ROL COMERCIAL
      const rolComercial = await trx
        .from('roles')
        .where('nombre', 'COMERCIAL')
        .first()

      if (!rolComercial) {
        throw new Error('❌ Rol COMERCIAL no existe')
      }

      // 🔑 CARGO ASESOR CONVENIO
      const cargoAsesor = await trx
        .from('cargos')
        .where('nombre', 'ASESOR CONVENIO')
        .first()

      if (!cargoAsesor) {
        throw new Error('❌ Cargo ASESOR CONVENIO no existe')
      }

      for (const [index, data] of DATOS_CONVENIOS.entries()) {
        try {
          // 1️⃣ IDENTIFICACIÓN
          let identificacion = data.cc?.trim() || null
          let funcionesCargo: string | null = null

          if (!identificacion) {
            identificacion = String(dummyCCCounter++)
            funcionesCargo =
              '⚠️ ACTUALIZAR CÉDULA - Documento temporal generado por sistema'
          }

          // 🔍 DETECTAR DUPLICADOS (evitar constraint violations)
          const ccYaUsada = await trx
            .from('convenios')
            .where('doc_tipo', 'CC')
            .where('doc_numero', identificacion)
            .first()

          if (ccYaUsada) {
            // ⚠️ CC DUPLICADA: Asignar dummy automáticamente
            const ccOriginal = identificacion
            identificacion = String(dummyCCCounter++)
            funcionesCargo = `⚠️ ACTUALIZAR CÉDULA - CC original duplicada: ${ccOriginal} (ya usada por: ${ccYaUsada.nombre})`
            console.log(
              `⚠️ Fila ${index + 1}: CC ${ccOriginal} duplicada → Asignada CC dummy ${identificacion}`
            )
          }

          // 2️⃣ USUARIO
          const correo = `convenio_${identificacion}@temporal.com`
          let usuarioId: number

          const usuarioExistente = await trx
            .from('usuarios')
            .where('correo', correo)
            .first()

          if (usuarioExistente) {
            usuarioId = usuarioExistente.id
          } else {
            const [id] = await trx.table('usuarios').insert({
              razon_social_id: 1,
              rol_id: rolComercial.id,
              nombres: data.titular?.split('/')[0]?.trim() || 'Sin Nombre',
              apellidos: '',
              correo,
              password: await Hash.make('temporal123'),
              estado: 'activo',
              created_at: now,
              updated_at: now,
            })

            usuarioId = id
          }

          // 3️⃣ CONTRATO (compatible con migración actual)
          const contratoExistente = await trx
            .from('contratos')
            .where('usuario_id', usuarioId)
            .first()

          let contratoId: number

          if (contratoExistente) {
            contratoId = contratoExistente.id
          } else {
            const [idContrato] = await trx.table('contratos').insert({
              usuario_id: usuarioId,
              identificacion,
              tipo_contrato: 'laboral',
              termino_contrato: 'INDEFINIDO',
              estado: 'activo',
              fecha_inicio: today,
              fecha_terminacion: null,
              salario: 0,
              funciones_cargo: funcionesCargo ?? 'ENVIAR CLIENTES',
              sede_id: 1,
              razon_social_id: 1,
              cargo_id: cargoAsesor.id,
              created_at: now,
              updated_at: now,
            })

            contratoId = idContrato

            // ➕ Registro salarial inicial
            await trx.table('contratos_salarios').insert({
              contrato_id: contratoId,
              salario_basico: 0,
              bono_salarial: 0,
              auxilio_transporte: 0,
              auxilio_no_salarial: 0,
              fecha_efectiva: today,
              created_at: now,
              updated_at: now,
            })
          }

          // 4️⃣ AGENTE DE CAPTACIÓN ✅ CON USUARIO_ID
const [agenteId] = await trx.table('agentes_captacions').insert({
  usuario_id: usuarioId, // 👈 CRÍTICO: Vincular con usuario
  nombre: data.titular?.split('/')[0]?.trim() || 'Asesor Convenio',
  tipo: 'ASESOR_CONVENIO',
  activo: true,
  created_at: now,
  updated_at: now,
})

// ✅ ACTUALIZAR USUARIO CON AGENTE_ID (relación bidireccional)
await trx.from('usuarios').where('id', usuarioId).update({
  agente_id: agenteId,
})

          // 5️⃣ CONVENIO
          const telefonoRaw = data.telefono || null
          const telefonoLimpio =
            telefonoRaw && telefonoRaw.length > 20
              ? telefonoRaw.split(/[\/\-]/)[0].trim()
              : telefonoRaw

          const notasFinales =
            telefonoRaw && telefonoRaw.length > 20
              ? `${data.notas ?? ''} | Tel adicional: ${telefonoRaw}`
              : data.notas || null

          // 💳 MÉTODO DE PAGO (exacto como Excel)
          let metodoPago: 'EFECTIVO' | 'TRANSFERENCIA' = 'EFECTIVO'
          let numeroMetodoPago: string | null = null

          const medioExcel = data.medioDePago?.trim() || ''

          if (medioExcel && !medioExcel.toUpperCase().includes('EFECTIVO')) {
            metodoPago = 'TRANSFERENCIA'
            numeroMetodoPago = medioExcel
          }

          // ✅ FECHA DE APERTURA (genera fechas aleatorias en los últimos 2 años)
          const diasAtras = (index * 17) % 730 // Entre 0 y 730 días
          const fechaApertura = DateTime.now().minus({ days: diasAtras }).toISODate()

          await trx.table('convenios').insert({
            tipo: 'PERSONA',
            nombre: data.titular || 'Sin Titular',
            establecimiento: data.establecimiento || null,
            doc_tipo: 'CC',
            doc_numero: identificacion,
            telefono: telefonoLimpio,
            direccion: data.direccion || null,
            notas: notasFinales,
            metodo_pago: metodoPago,
            numero_metodo_pago: numeroMetodoPago,
            fecha_apertura: fechaApertura,
            asesor_convenio_id: agenteId,
            activo: true,
            created_at: now,
            updated_at: now,
          })

          createdCount++

          if ((index + 1) % 50 === 0) {
            console.log(`✅ Progreso: ${index + 1}/${DATOS_CONVENIOS.length}`)
          }
        } catch (error: any) {
          errorCount++
          console.error(
            `❌ Error fila ${index + 1} (${data.titular}): ${error.message}`
          )
        }
      }

      await trx.commit()

      console.log('\n🎉 PROCESO COMPLETADO')
      console.log(`✅ Convenios creados: ${createdCount}`)
      console.log(`❌ Errores: ${errorCount}`)
      console.log(`⚠️ CCs dummy: ${dummyCCCounter - 9999000001}`)
    } catch (error: any) {
      await trx.rollback()
      console.error('💥 Error fatal:', error.message)
      throw error
    }
  }
}
