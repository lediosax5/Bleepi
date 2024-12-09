# Bleepi

- Bleepi permite enviar mensajes de forma automatizada a múltiples contactos de WhatsApp desde una interfaz web utilizando Playwright y js, es capaz de leer los números de teléfono y los mensajes de forma individual o desde un archivo CSV, lo que facilita la gestión de grandes volúmenes de mensajes.

- Instalación y configuración:
1. Descargar la app con el comando: git clone https://github.com/lediosax5/Bleepi.git o descargando el repositorio.
2. Instalar node.js, si no lo tenes aca dejo el link: https://nodejs.org/en
3. Configurar los números y mensajes en el archivo contactos.csv sin borrar las columnas mensaje,numero o numero,mensaje.

Listo! Ahora podes ejecutar Bleepi.bat y escanear el QR para enviar mensajes.

- Al descargarlo como .ZIP algunos antivirus pueden detectarlo como potencialmente malicioso debido al uso de scripts de automatización. Esto es un falso positivo, si tu antivirus lo bloquea, considera añadirlo a la lista de exclusiones o clonarlo en vez de descargarlo como un .ZIP.

- Al ser un archivo separado por comas, los mensajes con comas van entre comillas, por ejemplo: "Hola, ¿cómo estás?"
