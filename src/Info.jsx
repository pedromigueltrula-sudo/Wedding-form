export default function Info() {
  return (
    <div className="app-container">

      <header className="header">
        <h1>Victoria & Pedro</h1>
        <p className="subtitle">Nuestra Boda</p>
      </header>

      <main className="form-wrapper">

        <h2>Información de la boda</h2>

        <p>
          El gran día será el <strong>sábado, 29 de Agosto de 2026</strong>.
        </p>

        <h3>📍 Lugar</h3>

        <p>
          <strong>Palacio de Los Acevedos</strong><br/>
          Barrio de Arriba, s/n<br/>
          39190 Hoznayo, Cantabria
        </p>

        <a
          href="https://www.google.com/maps/search/?api=1&query=Palacio+de+los+Acevedo+Hoznayo"
          target="_blank"
        >
          Ver en Google Maps
        </a>

        <h3 style={{marginTop:"2rem"}}>🚌 Transporte</h3>

        <ul>
          <li>Salida desde Santander: <strong>11:45</strong></li>
          <li>Llegada al Palacio: <strong>12:15</strong></li>
          <li>Vuelta desde el Palacio: <strong>1:00</strong></li>
        </ul>

        <h3 style={{marginTop:"2rem"}}>🏨 Alojamiento</h3>

        <p>
          Hemos gestionado tarifas especiales en varios hoteles cercanos.
        </p>

        <ul>
          <li>Hotel Los Pasiegos</li>
          <li>Hotel SPA Villa Pasiega</li>
          <li>Apartamentos Villa Pasiega</li>
          <li>Apartamentos La Albarca</li>
          <li>Palacio de los Acevedo</li>
        </ul>

      </main>

    </div>
  )
}