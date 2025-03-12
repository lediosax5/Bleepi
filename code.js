const {chromium} = require('playwright');
const fs = require('fs');
const csv = require('csv-parser');
const contactos = [];
const delay = process.argv[2] ? parseInt(process.argv[2]) * 1000 : 8 * 1000;

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
      const sendButtonSelector = 'button[aria-label="Enviar"], button[aria-label="Send"], button[aria-label="Envoyer"], button[aria-label="Invia"], button[aria-label="Senden"], button[aria-label="भेजें"]';
      await pagina.waitForSelector(sendButtonSelector, {timeout: 100000, state: 'visible'});
      await pagina.keyboard.press('Enter');
      await pagina.waitForTimeout(delay);
    } catch (error) {console.error(`Error al enviar mensaje a ${numero}:`, error.message)}
  }

  await pagina.waitForSelector('span[data-icon="menu"]', {timeout: 5000, state: 'visible'});
  await pagina.click('span[data-icon="menu"]');
  const logoutSelector = '[aria-label="Cerrar sesión"], [aria-label="Log out"], [aria-label="Déconnexion"], [aria-label="Disconnetti"], [aria-label="Abmelden"], [aria-label="लॉग आउट करें"]';
  await pagina.waitForSelector(logoutSelector, {timeout: 5000, state: 'visible'});
  await pagina.click(logoutSelector);
  const confirmLogoutSelector = 'button:has-text("Cerrar sesión"), button:has-text("Log out"), button:has-text("Déconnexion"), button:has-text("Disconnetti"), button:has-text("Abmelden"), button:has-text("लॉग आउट करें")';
  await pagina.waitForSelector(confirmLogoutSelector, {timeout: 5000, state: 'visible'});
  await pagina.click(confirmLogoutSelector);
  await pagina.waitForTimeout(2000);
  
  await navegador.close();
});
