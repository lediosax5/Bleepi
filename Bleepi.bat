@echo off
cd /d "%~dp0"

set /p delay="Cada cuantos segundos se envian los mensajes? (Ejemplo: 6): "
for /f "delims=0123456789" %%a in ("%delay%") do set delay=7
if "%delay%"=="" set delay=7
set /a "delay=%delay%" 2>nul
if %delay% lss 1 set delay=7

echo Se usaran %delay% segundos como intervalo entre mensajes.

echo Instalando dependencias...
call npm install || (echo Error al instalar dependencias. Verifique Node.js e intenta nuevamente. && pause && exit)

echo Instalando navegadores...
call npx playwright install chromium || (echo Error al instalar el navegador. Verifica tu conexion a internet e intenta nuevamente. && pause && exit)

echo Ejecutando la aplicacion...
call node code.js %delay% || (echo Error al ejecutar el script. Revisa el archivo code.js o contactos.csv e intenta nuevamente, si dio TimeoutError escanea el codigo QR mas rapido. && pause && exit)

pause
