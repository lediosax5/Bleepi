@echo off
cd /d "%~dp0"

echo Instalando dependencias...
call npm install || (echo Error al instalar dependencias. Verifique Node.js e intenta nuevamente. && pause && exit)

echo Instalando navegadores...
call npx playwright install chromium || (echo Error al instalar los navegadores. Verifica tu conexion a internet e intenta nuevamente. && pause && exit)

echo Ejecutando la aplicacion...
call node code.js || (echo Error al ejecutar el script. Revisa el archivo bleepicsv.js o contactos.csv e intenta nuevamente, si dio TimeoutError escanea el codigo QR mas rapido. && pause && exit)

pause
