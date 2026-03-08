const allergiesText =
  data.allergies === "Sí"
    ? data.allergiesDetail
    : "Ninguna";

const accommodationText =
  data.accommodationType === "No"
    ? "No necesita alojamiento"
    : `${data.accommodationType} - ${data.accommodationSpecific || ""}`;

const html = `
<div style="background:#f8f5f0;padding:30px 15px;font-family:Georgia,serif;color:#333;">
  <div style="max-width:600px;margin:auto;background:white;border-radius:12px;padding:35px;box-shadow:0 8px 25px rgba(0,0,0,0.08);">

    <h1 style="text-align:center;font-weight:normal;margin-bottom:5px;">
      Victoria & Pedro
    </h1>

    <p style="text-align:center;color:#777;margin-top:0;">
      Nuestra Boda · 29 de Agosto de 2026
    </p>

    <hr style="margin:25px 0;border:none;border-top:1px solid #eee"/>

    <p>Hola <strong>${data.name}</strong>,</p>

    <p>
      Hemos recibido correctamente tu confirmación para nuestra boda.
      Nos hace muchísima ilusión poder compartir este día contigo.
    </p>

    <h3 style="margin-top:30px;">📋 Tu confirmación</h3>

    <ul style="line-height:1.8;padding-left:18px;">
      <li><strong>Email:</strong> ${data.email}</li>
      <li><strong>Teléfono:</strong> ${data.phone}</li>
      <li><strong>Dietas:</strong> ${allergiesText}</li>
      <li><strong>Autobús:</strong> ${data.bus}</li>
      <li><strong>Alojamiento:</strong> ${accommodationText}</li>
      <li><strong>Acompañantes:</strong> ${data.accommodationCompanions || "Ninguno"}</li>
    </ul>

    <p style="margin-top:20px;">
      Puedes volver a consultar esta información siempre que lo necesites
      simplemente abriendo este correo.
    </p>

    <hr style="margin:30px 0;border:none;border-top:1px solid #eee"/>

    <h3>📍 Lugar de la celebración</h3>

    <p>
      <strong>Palacio de Los Acevedos</strong><br/>
      Barrio de Arriba, s/n<br/>
      39190 Hoznayo, Cantabria
    </p>

    <p>
      <a href="https://www.google.com/maps/search/?api=1&query=Palacio+de+los+Acevedo+Hoznayo"
      style="color:#b48b4e;text-decoration:none;font-weight:bold;">
      Ver ubicación en Google Maps
      </a>
    </p>

    <hr style="margin:30px 0;border:none;border-top:1px solid #eee"/>

    <h3>🚌 Transporte</h3>

    <p>
      Hemos organizado un servicio de autobús desde Santander.
    </p>

    <ul style="line-height:1.7;padding-left:18px;">
      <li>Salida aproximada: <strong>11:45 h</strong> desde Santander</li>
      <li>Llegada al Palacio: <strong>12:15 h</strong></li>
      <li>Regreso desde el Palacio: <strong>1:00 h</strong></li>
    </ul>

    <hr style="margin:30px 0;border:none;border-top:1px solid #eee"/>

    <h3>🏨 Alojamiento</h3>

    <p>
      Hemos gestionado tarifas especiales en varios alojamientos cercanos al
      Palacio de los Acevedo.
    </p>

    <p style="font-weight:bold;">
      Importante: para acceder a estas tarifas es necesario reservar por teléfono
      e indicar que vienes como invitado de nuestra boda.
    </p>

    <h4 style="margin-top:20px;">Resumen de tarifas</h4>

    <ul style="line-height:1.7;padding-left:18px;">
      <li>Hotel Los Pasiegos — 86€ (mascotas permitidas)</li>
      <li>Hotel SPA Villa Pasiega — 110€ (con spa)</li>
      <li>Apartamentos Villa Pasiega — 160€ (4 adultos + spa)</li>
      <li>Apartamentos La Albarca — 150€ (mascotas permitidas)</li>
      <li>Palacio de los Acevedo — 130€ (desayuno incluido)</li>
    </ul>

    <p style="margin-top:15px;">Más información:</p>

    <ul style="padding-left:18px;line-height:1.7;">
      <li><a href="https://www.grupolospasiegos.es/hotel-spa-villa-pasiega">Hotel Spa Villa Pasiega</a></li>
      <li><a href="https://www.grupolospasiegos.es/hotel-los-pasiegos">Hotel Los Pasiegos</a></li>
      <li><a href="https://www.quehoteles.com/hotel-de-hoznayo-Spa-Villa-Pasiega-4C15P121D23655Z209182EF.htm">Apartamentos Villa Pasiega</a></li>
      <li><a href="https://www.grupolospasiegos.com/apartamentos-la-albarca">Apartamentos La Albarca</a></li>
      <li><a href="https://www.palaciodelosacevedo.com/en/rooms">Palacio de los Acevedo</a></li>
    </ul>

    <p>
      Dossier completo de habitaciones:
      <a href="https://drive.google.com/file/d/1rUMrNDAwR0ccgzefl0VJNvy2YQNDBo4t/view?usp=sharing">
      Ver dossier
      </a>
    </p>

    <h4 style="margin-top:20px;">Teléfonos de reserva</h4>

    <p>
      📞 Hotel Los Pasiegos<br/>
      <a href="tel:942525090">942 525 090</a>
    </p>

    <p>
      📞 Resto de establecimientos<br/>
      <a href="tel:942525962">942 525 962</a>
    </p>

    <hr style="margin:30px 0;border:none;border-top:1px solid #eee"/>

    <p style="text-align:center;">
      ¡Tenemos muchas ganas de celebrar este día contigo!
    </p>

    <p style="text-align:center;margin-top:25px;font-style:italic;">
      Con todo nuestro cariño<br/>
      Victoria y Pedro
    </p>

  </div>
</div>
`;