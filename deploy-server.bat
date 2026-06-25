@echo off
setlocal
set SERVER=deploy@activautossgc.org
set REMOTE=/home/deploy/apps/backend-sgc

echo.
echo ============================================================
echo FASE D - Verificar y subir estaticos
echo ============================================================

echo [D1] Verificando carpeta logo_tramites en servidor...
ssh %SERVER% "ls /home/deploy/apps/backend-sgc/storage/logo_tramites/ 2>/dev/null || echo CARPETA_NO_EXISTE"

echo [D2] Creando carpeta logo_tramites si no existe...
ssh %SERVER% "mkdir -p /home/deploy/apps/backend-sgc/storage/logo_tramites"

echo [D3] Subiendo logo_tramites_centro.png...
scp "C:\Users\Diego Gomez\backend-sgc\storage\logo_tramites\logo_tramites_centro.png" %SERVER%:%REMOTE%/storage/logo_tramites/

echo [D4] Subiendo runt_mandato_datos.xlsx actualizado...
scp "C:\Users\Diego Gomez\backend-sgc\storage\runt\runt_mandato_datos.xlsx" %SERVER%:%REMOTE%/storage/runt/

echo.
echo ============================================================
echo FASE E - Subir codigo fuente al servidor
echo ============================================================

echo [E01] .gitignore
scp "C:\Users\Diego Gomez\backend-sgc\.gitignore" %SERVER%:%REMOTE%/

echo [E02] adonisrc.ts
scp "C:\Users\Diego Gomez\backend-sgc\adonisrc.ts" %SERVER%:%REMOTE%/

echo [E03] app/controllers/formularios_runt_controller.ts
scp "C:\Users\Diego Gomez\backend-sgc\app\controllers\formularios_runt_controller.ts" %SERVER%:%REMOTE%/app/controllers/

echo [E04] app/controllers/liquidacion_pagos_controller.ts
scp "C:\Users\Diego Gomez\backend-sgc\app\controllers\liquidacion_pagos_controller.ts" %SERVER%:%REMOTE%/app/controllers/

echo [E05] app/controllers/tramite_checklists_controller.ts
scp "C:\Users\Diego Gomez\backend-sgc\app\controllers\tramite_checklists_controller.ts" %SERVER%:%REMOTE%/app/controllers/

echo [E06] app/controllers/tramite_liquidaciones_controller.ts
scp "C:\Users\Diego Gomez\backend-sgc\app\controllers\tramite_liquidaciones_controller.ts" %SERVER%:%REMOTE%/app/controllers/

echo [E07] app/controllers/tramites_controller.ts
scp "C:\Users\Diego Gomez\backend-sgc\app\controllers\tramites_controller.ts" %SERVER%:%REMOTE%/app/controllers/

echo [E08] app/models/tramite_checklist.ts
scp "C:\Users\Diego Gomez\backend-sgc\app\models\tramite_checklist.ts" %SERVER%:%REMOTE%/app/models/

echo [E09] bin/console.ts
scp "C:\Users\Diego Gomez\backend-sgc\bin\console.ts" %SERVER%:%REMOTE%/bin/

echo [E10] bin/server.ts
scp "C:\Users\Diego Gomez\backend-sgc\bin\server.ts" %SERVER%:%REMOTE%/bin/

echo [E11] config/database.ts
scp "C:\Users\Diego Gomez\backend-sgc\config\database.ts" %SERVER%:%REMOTE%/config/

echo [E12] start/routes.ts
scp "C:\Users\Diego Gomez\backend-sgc\start\routes.ts" %SERVER%:%REMOTE%/start/

echo [E13] migración nueva fotocopia_cedula
scp "C:\Users\Diego Gomez\backend-sgc\database\migrations\1779503000000_create_add_fotocopia_cedula_to_tramite_checklists_table.ts" %SERVER%:%REMOTE%/database/migrations/

echo [E14] storage/.gitignore
scp "C:\Users\Diego Gomez\backend-sgc\storage\.gitignore" %SERVER%:%REMOTE%/storage/

echo.
echo ============================================================
echo FASE F - Build, migracion y restart en servidor
echo ============================================================

echo [F1] node ace build (puede tardar ~30s)...
ssh %SERVER% "cd %REMOTE% && node ace build"
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo *** ERROR EN BUILD - DETENIENDO DEPLOY ***
    echo Revisa los errores arriba antes de continuar.
    pause
    exit /b 1
)

echo [F2] Ejecutando migracion fotocopia_cedula...
ssh %SERVER% "cd %REMOTE% && node ace migration:run --force"
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo *** ERROR EN MIGRACION - DETENIENDO DEPLOY ***
    pause
    exit /b 1
)

echo [F3] Reiniciando PM2...
ssh %SERVER% "pm2 restart backend-sgc"

echo [F4] Verificando estado PM2...
ssh %SERVER% "pm2 show backend-sgc | grep -E 'status|uptime|restarts'"

echo.
echo ============================================================
echo BACKEND DEPLOY COMPLETADO
echo ============================================================
pause
