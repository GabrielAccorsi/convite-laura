'use strict';
// Brasília: meia-noite de 24/11 equivale a 03:00 UTC.
const CLOSES_AT = Date.parse('2026-11-24T00:00:00-03:00');
const FORM_URL = 'https://forms.gle/8HCY7EkYahpFaVXp9';
const PUBLIC_URL = 'https://gabrielaccorsi.github.io/convite-laura/';
const confirmLink = document.getElementById('confirm');
const status = document.getElementById('rsvp-status');
let lastOpen;
function updateDeadline() {
  const open = Date.now() < CLOSES_AT;
  if (open !== lastOpen) {
    confirmLink.hidden = !open;
    if (open) confirmLink.href = FORM_URL;
    else confirmLink.removeAttribute('href');
    status.innerHTML = open
      ? '<p class="deadline">⏰ Confirme sua presença até 23 de novembro!</p><small class="timezone">Até 23/11/2026, às 23h59min59s, horário de Brasília.</small>'
      : '<p class="deadline">O prazo para confirmar presença foi encerrado. Agradecemos a compreensão!</p>';
    lastOpen = open;
  }
  return open;
}
updateDeadline();
setInterval(updateDeadline, 1000);
document.addEventListener('visibilitychange', updateDeadline);
window.addEventListener('pageshow', updateDeadline);
window.addEventListener('focus', updateDeadline);
confirmLink.addEventListener('click', (event) => { if (!updateDeadline()) event.preventDefault(); });
const shareButton = document.getElementById('share');
shareButton.hidden = false;
shareButton.addEventListener('click', async () => {
  const feedback = document.getElementById('share-status');
  const text = 'A Laura vai completar 8 aninhos!\n\nVocê é nosso convidado especial para comemorar esse dia!\n\n28 de novembro, às 17h30.\n\n' +
    (updateDeadline() ? '⏰ Confirme sua presença até 23/11!\n\nAcesse o convite e confirme sua presença:' : 'Acesse o convite:');
  if (navigator.share) {
    try { await navigator.share({title: 'Laura — 8 Aninhos', text, url: PUBLIC_URL}); return; }
    catch (error) { if (error.name === 'AbortError') return; }
  }
  try { await navigator.clipboard.writeText(PUBLIC_URL); feedback.textContent = 'Link copiado! Cole na conversa do WhatsApp.'; }
  catch {
    document.getElementById('copy-fallback').hidden = false;
    const field = document.getElementById('share-link');
    field.focus(); field.select();
    feedback.textContent = 'Selecione e copie o link abaixo para compartilhar.';
  }
});
