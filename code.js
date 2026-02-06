const {chromium} = require('playwright');
const fs = require('fs');
const csv = require('csv-parser');
const contactos = [];
const delay = process.argv[2] ? parseInt(process.argv[2]) * 1000 : 8 * 1000;

async function intentarLogout(pagina) {
  try {
    const menuBtn = pagina.locator('[data-icon="more-refreshed"], [data-icon="menu"]');
    await menuBtn.first().waitFor({timeout: 3000});
    await menuBtn.first().click();
    const logoutText = pagina.locator('text=/Cerrar sesión|Log out|Déconnexion|Disconnetti|Abmelden|लॉग आउट करें/i');
    await logoutText.first().waitFor({timeout: 3000});
    await logoutText.first().click();
    const confirmBtn = pagina.locator('button:has-text("Cerrar sesión"),button:has-text("Log out"),button:has-text("Déconnexion"),button:has-text("Disconnetti"),button:has-text("Abmelden"),button:has-text("लॉग आउट करें")');
    await confirmBtn.first().waitFor({timeout: 3000});
    await confirmBtn.first().click();
    await pagina.waitForTimeout(2000);
    console.log('Sesión cerrada correctamente.');
  } catch (err) {console.warn('No se pudo cerrar sesión. Se continúa igual.')}
}

fs.createReadStream('contactos.csv').pipe(csv()).on('data', (row) => {
  contactos.push({numero: row.numero, mensaje: row.mensaje});
}).on('end', async () => {
  const browserOptions = {
    headless: false,
    args: ['--disable-web-security','--disable-blink-features=AutomationControlled','--no-sandbox']
  };
  const navegador = await chromium.launch(browserOptions);
  const pagina = await navegador.newPage();

  let contador = 0;
  for (let {numero, mensaje} of contactos) {
    contador++;
    console.log(`Enviando mensaje ${contador}/${contactos.length} a ${numero}...`);
    try {
      const url = `https://web.whatsapp.com/send?phone=${numero}&text=${encodeURIComponent(mensaje)}`;
      await pagina.goto(url, {timeout: 15000});
      const sendButtonSelector =
        'button[aria-label="Enviar"],' +
        'button[aria-label="Send"],' +
        'button[aria-label="Envoyer"],' +
        'button[aria-label="Invia"],' +
        'button[aria-label="Senden"],' +
        'button[aria-label="भेजें"]';
      await pagina.waitForSelector(sendButtonSelector, {timeout: 90000, state: 'visible'});
      await pagina.keyboard.press('Enter');
      await pagina.waitForTimeout(delay);
    } catch (error) {
      console.error(`No se pudo enviar mensaje a ${numero}. Error: ${error.message}`);
      continue;
    }
  }

  console.log('Todos los mensajes han sido procesados. Intentando cerrar sesión...');
  await intentarLogout(pagina);
  await navegador.close();
  console.log('Proceso finalizado. ¡Hasta la próxima!');
});
