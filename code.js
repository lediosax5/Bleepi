const {chromium} = require('playwright');
const fs = require('fs');
const csv = require('csv-parser');
const contactos = [];
const delay = process.argv[2] ? parseInt(process.argv[2]) * 1000 : 7 * 1000;

fs.createReadStream('contactos.csv').pipe(csv()).on('data', (row) => {
  contactos.push({
    numero: row.numero,
    mensaje: row.mensaje
  });
}).on('end', async () => {
  const browserOptions = {
    headless: false,
    args: ['--disable-web-security','--disable-blink-features=AutomationControlled','--no-sandbox']
  };
  const navegador = await chromium.launch(browserOptions);
  const pagina = await navegador.newPage();

  for (let {numero, mensaje} of contactos) {
    try {
      const url = `https://web.whatsapp.com/send?phone=${numero}&text=${encodeURIComponent(mensaje)}`;
      await pagina.goto(url);
      const sendButtonSelector = 'button[aria-label="Enviar"], button[aria-label="Send"]';
      await pagina.waitForSelector(sendButtonSelector, {timeout: 100000, state: 'visible'});
      await pagina.keyboard.press('Enter');
      await pagina.waitForTimeout(delay);
    } catch (error) {console.error(`Error al enviar mensaje a ${numero}:`, error.message)}
  }

  await navegador.close();
});
