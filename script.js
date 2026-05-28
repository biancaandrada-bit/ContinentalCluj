const recipients = [
  "registratura@primariaclujnapoca.ro",
  "cabinet@primariaclujnapoca.ro",
];

const subject = "Solicitare civică privind protejarea Hotelului Continental Cluj";

function buildEmailBody() {
  return `Către Domnul Primar Emil Boc,

Vă scriu în calitate de cetățean preocupat al orașului Cluj-Napoca, pentru a-mi exprima îngrijorarea profundă cu privire la recentul interes manifestat de frații Tate pentru achiziționarea Hotelului Continental. Consider că o astfel de tranzacție ar aduce prejudicii iremediabile imaginii și valorilor comunității noastre.

Hotelul Continental nu este doar o clădire, ci o parte esențială a patrimoniului și istoriei Clujului. Construit în stil secession la începutul secolului XX, a fost martorul multor evenimente importante și a jucat un rol central în viața socială și culturală a orașului nostru. Conservarea și respectarea istoriei sale arhitecturale și culturale sunt cruciale pentru identitatea Clujului. Permiterea achiziționării sale de către persoane cu o reputație controversată ar diminua valoarea simbolică și istorică a acestei clădiri emblematice.

Frații Tate au fost implicați în numeroase controverse și acuzații grave, inclusiv:
- Acuzații de trafic de persoane și viol: aceștia au fost investigați și acuzați de infracțiuni grave, ceea ce a generat condamnări ample la nivel internațional.
- Mesaje misogine și promovarea unor comportamente dăunătoare: ei sunt cunoscuți pentru declarații publice misogine, care denigrează femeile și încurajează atitudini toxice în societate.
- Promovarea unui stil de viață ostentativ și controversat: imaginea lor publică este adesea asociată cu opulența excesivă și lipsa de etică, aspecte care nu reprezintă valorile pe care Clujul ar trebui să le promoveze.

Cluj-Napoca este un oraș european, valorizat pentru inovație, educație, cultură și respect. Asocierea numelui Hotelului Continental, un simbol al istoriei și eleganței orașului, cu persoane a căror reputație este profund afectată de acuzații penale și discursuri dăunătoare, ar arunca o umbră negativă asupra întregii comunități.

Vă rog, Domnule Primar, să luați în considerare aceste aspecte și să interveniți, în limitele atribuțiilor legale, pentru a preveni o astfel de achiziție. Păstrarea integrității și a valorilor Clujului trebuie să fie o prioritate.

Vă mulțumesc pentru timpul și atenția dumneavoastră.`;
}

const emailButton = document.querySelector("#emailButton");
const emailChoices = document.querySelector("#emailChoices");
const emailPreview = document.querySelector("#emailPreview");
const emailStatus = document.querySelector("#emailStatus");

function updatePreview() {
  emailPreview.textContent = `Subiect: ${subject}\nCătre: ${recipients.join(", ")}\n\n${buildEmailBody()}`;
}

function buildComposeUrl(service) {
  const body = buildEmailBody();
  const bodyWithEmailParagraphs = body.replace(/\n/g, "\r\n");
  const to = recipients.join(",");
  const encodedTo = encodeURIComponent(to);
  const encodedSubject = encodeURIComponent(subject);
  const encodedBody = encodeURIComponent(bodyWithEmailParagraphs);

  if (service === "gmail") {
    return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodedTo}&su=${encodedSubject}&body=${encodedBody}`;
  }

  if (service === "yahoo") {
    return `https://compose.mail.yahoo.com/?to=${encodedTo}&subject=${encodedSubject}`;
  }

  if (service === "outlook") {
    return `https://outlook.live.com/mail/0/deeplink/compose?to=${encodedTo}&subject=${encodedSubject}&body=${encodedBody}`;
  }

  return `mailto:${to}?subject=${encodedSubject}&body=${encodedBody}`;
}

function buildMobileAppUrl(service) {
  const body = buildEmailBody().replace(/\n/g, "\r\n");
  const to = encodeURIComponent(recipients.join(","));
  const encodedSubject = encodeURIComponent(subject);
  const encodedBody = encodeURIComponent(body);

  if (service === "gmail") {
    return `googlegmail:///co?to=${to}&subject=${encodedSubject}&body=${encodedBody}`;
  }

  if (service === "yahoo") {
    return `ymail://mail/compose?to=${to}&subject=${encodedSubject}`;
  }

  if (service === "outlook") {
    return `ms-outlook://compose?to=${to}&subject=${encodedSubject}&body=${encodedBody}`;
  }

  return buildComposeUrl(service);
}

function isMobileDevice() {
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

function toggleChoices() {
  const isHidden = emailChoices.hidden;
  emailChoices.hidden = !isHidden;
  emailButton.setAttribute("aria-expanded", String(isHidden));
  updateChoiceLinks();
}

function sendEmail(service) {
  if (service === "yahoo") {
    const copied = copyEmailBody();
    emailStatus.textContent = copied
      ? "Pentru Yahoo, textul emailului a fost copiat automat. Dă click dreapta și alege Paste/Lipește, apoi semnează cu numele tău."
      : "Nu am putut copia automat. Selectează textul din preview și copiază-l manual în Yahoo.";
  }
}

function updateChoiceLinks() {
  emailChoices.querySelectorAll("[data-service]").forEach((link) => {
    const service = link.dataset.service;
    link.href = isMobileDevice() ? buildMobileAppUrl(service) : buildComposeUrl(service);
  });
}

function copyEmailBody() {
  const body = buildEmailBody();
  const textarea = document.createElement("textarea");

  try {
    textarea.value = body;
    textarea.setAttribute("readonly", "");
    textarea.style.opacity = "0";
    textarea.style.position = "fixed";
    textarea.style.top = "0";
    textarea.style.left = "0";
    textarea.style.width = "1px";
    textarea.style.height = "1px";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    textarea.setSelectionRange(0, textarea.value.length);

    const copied = document.execCommand("copy");
    document.body.removeChild(textarea);
    return copied;
  } catch {
    if (textarea.parentNode) {
      document.body.removeChild(textarea);
    }

    return false;
  }
}

emailButton.addEventListener("click", toggleChoices);
emailChoices.addEventListener("click", (event) => {
  const button = event.target.closest("[data-service]");

  if (!button) {
    return;
  }

  sendEmail(button.dataset.service);
});
updateChoiceLinks();
updatePreview();
