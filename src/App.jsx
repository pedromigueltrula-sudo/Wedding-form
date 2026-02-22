import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import FormStep from './components/FormStep';
import { submitForm } from './services/googleSheets';

export default function App() {
    const [step, setStep] = useState(0);
    const [direction, setDirection] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        allergies: '',
        allergiesDetail: '',
        bus: '',
        accommodationType: '',
        accommodationSpecific: '',
        accommodationCompanions: '',
        accommodationStatus: ''
    });

    const nextStep = () => {
        if (step < 4) {
            setDirection(1);
            setStep(prev => prev + 1);
        } else {
            handleSubmit();
        }
    };

    const prevStep = () => {
        if (step > 0) {
            setDirection(-1);
            setStep(prev => prev - 1);
        }
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setSubmitError('');
        try {
            await submitForm(formData);
            setDirection(1);
            setStep(5); // Success step
        } catch (err) {
            setSubmitError('Hubo un error al enviar el formulario. Por favor, inténtalo de nuevo.');
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="app-container">
            {/* Hide header on step 0 so the landing background is full screen */}
            {step !== 0 && step !== 5 && (
                <header className="header">
                    <h1>Victoria & Pedro</h1>
                    <p className="subtitle">Nuestra Boda</p>
                </header>
            )}

            <main className={`form-wrapper ${step === 0 ? 'full-screen-intro' : ''}`}>
                <AnimatePresence mode="wait" custom={direction}>

                    {/* STEP 0: Intro Landing Page */}
                    {step === 0 && (
                        <FormStep key="step0" direction={direction} isIntro={true}>
                            <div className="intro-content">
                                <h1 className="landing-title" style={{ fontSize: 'clamp(1.8rem, 5vw, 2.6rem)' }}>✨ Nos casamos ✨</h1>

                                <div className="landing-text">
                                    <p>Con muchísima ilusión queremos compartir una noticia muy especial:</p>
                                    <p><strong>Victoria Ochoa Charlón</strong> y <strong>Pedro Miguel Trula</strong> hemos decidido dar el "sí, quiero" y comenzar juntos una nueva etapa en nuestras vidas.</p>

                                    <p>El gran día será el próximo <strong>sábado, 29 de Agosto de 2026</strong>, un momento que deseamos celebrar rodeados de las personas que más queremos.</p>

                                    <p>La celebración se realizará en el <strong>Palacio de Los Acevedos</strong>.<br />
                                        Barrio de Arriba, s/n, 39190, Hoznayo, Cantabria.</p>

                                    <a href="https://www.google.com/maps/search/?api=1&query=Palacio+de+los+Acevedo+Hoznayo" target="_blank" rel="noreferrer" className="maps-link">
                                        📍 Accede a la localización del palacio en Google Maps
                                    </a>

                                    <p>Nos encantaría que nos acompañéis en este día tan significativo para nosotros, lleno de amor, alegría y buenos deseos.</p>
                                    <p>¡Pronto os daremos más detalles! 💕</p>
                                    <p className="signature">Con todo nuestro cariño,<br />Victoria y Pedro</p>
                                </div>

                                <div className="landing-form">
                                    <h3>Por favor, confirma tu asistencia:</h3>

                                    <div className="input-group">
                                        <input
                                            type="text"
                                            className="text-input"
                                            placeholder="Tu Nombre y Apellidos"
                                            value={formData.name}
                                            onChange={(e) => handleChange('name', e.target.value)}
                                        />
                                    </div>

                                    <div className="input-group">
                                        <input
                                            type="tel"
                                            className="text-input"
                                            placeholder="Tu Teléfono"
                                            value={formData.phone}
                                            onChange={(e) => handleChange('phone', e.target.value)}
                                        />
                                    </div>

                                    <button
                                        className="primary-button landing-button"
                                        onClick={nextStep}
                                        disabled={!formData.name.trim() || !formData.phone.trim()}
                                        style={{ opacity: (!formData.name.trim() || !formData.phone.trim()) ? 0.5 : 1, cursor: (!formData.name.trim() || !formData.phone.trim()) ? 'not-allowed' : 'pointer' }}
                                    >
                                        Confirmar Asistencia
                                    </button>
                                </div>
                            </div>
                        </FormStep>
                    )}

                    {/* STEP 1: Alergias */}
                    {step === 1 && (
                        <FormStep key="step1" direction={direction}>
                            <h2>Menú y Necesidades Dietéticas</h2>
                            <p>¿Tienes alguna alergia, intolerancia o necesidad dietética especial que debamos conocer?</p>

                            <div className="input-group options-group">
                                <label className="option-label">
                                    <input type="radio" name="allergies" value="No" className="option-input"
                                        checked={formData.allergies === 'No'}
                                        onChange={() => handleChange('allergies', 'No')} />
                                    <span>No, como de todo</span>
                                </label>
                                <label className="option-label">
                                    <input type="radio" name="allergies" value="Sí" className="option-input"
                                        checked={formData.allergies === 'Sí'}
                                        onChange={() => handleChange('allergies', 'Sí')} />
                                    <span>Sí, tengo necesidades especiales</span>
                                </label>
                            </div>

                            {formData.allergies === 'Sí' && (
                                <div className="input-group" style={{ marginTop: '1rem' }}>
                                    <label className="input-label">Por favor, especifica cuáles:</label>
                                    <textarea
                                        className="textarea-input"
                                        rows="3"
                                        placeholder="Ej: Celíaco, alergia al marisco, vegetariano..."
                                        value={formData.allergiesDetail}
                                        onChange={(e) => handleChange('allergiesDetail', e.target.value)}
                                    />
                                </div>
                            )}

                            <div className="button-group">
                                <button className="secondary-button" onClick={prevStep}>Atrás</button>
                                <button
                                    className="primary-button"
                                    onClick={nextStep}
                                    disabled={!formData.allergies || (formData.allergies === 'Sí' && !formData.allergiesDetail.trim())}
                                >
                                    Siguiente
                                </button>
                            </div>
                        </FormStep>
                    )}

                    {/* STEP 2: Bus */}
                    {step === 2 && (
                        <FormStep key="step2" direction={direction}>
                            <h2>Transporte</h2>
                            <p>Hemos organizado un servicio de autobús que saldrá ese día a las XX h desde Santander para facilitar el traslado. Indícanos por favor si te gustaría reservar plaza.</p>
                            <p style={{ marginTop: '0.8rem', marginBottom: '1.2rem', fontSize: '0.95rem' }}>El autobús recogerá a los pasajeros en Santander, "XXXX" y llegará al Palacio alrededor de las "XX" h. Al final de la celebración, saldrá del Palacio a las "XX" h para dejar a los pasajeros en el mismo lugar de recogida.</p>

                            <div className="input-group options-group">
                                <label className="option-label">
                                    <input type="radio" name="bus" value="Sí, ida y vuelta" className="option-input"
                                        checked={formData.bus === 'Sí, ida y vuelta'}
                                        onChange={() => handleChange('bus', 'Sí, ida y vuelta')} />
                                    <span>Sí, ida y vuelta</span>
                                </label>
                                <label className="option-label">
                                    <input type="radio" name="bus" value="Sí, solo ida" className="option-input"
                                        checked={formData.bus === 'Sí, solo ida'}
                                        onChange={() => handleChange('bus', 'Sí, solo ida')} />
                                    <span>Sí, solo la ida (Santander - Hoznayo)</span>
                                </label>
                                <label className="option-label">
                                    <input type="radio" name="bus" value="Sí, solo vuelta" className="option-input"
                                        checked={formData.bus === 'Sí, solo vuelta'}
                                        onChange={() => handleChange('bus', 'Sí, solo vuelta')} />
                                    <span>Sí, solo la vuelta (Hoznayo - Santander)</span>
                                </label>
                                <label className="option-label">
                                    <input type="radio" name="bus" value="No" className="option-input"
                                        checked={formData.bus === 'No'}
                                        onChange={() => handleChange('bus', 'No')} />
                                    <span>No, iré por mi cuenta</span>
                                </label>
                            </div>

                            <div className="button-group">
                                <button className="secondary-button" onClick={prevStep}>Atrás</button>
                                <button className="primary-button" onClick={nextStep} disabled={!formData.bus}>Siguiente</button>
                            </div>
                        </FormStep>
                    )}

                    {/* STEP 3: Alojamiento */}
                    {step === 3 && (
                        <FormStep key="step3" direction={direction}>
                            <h2>Alojamiento</h2>

                            <div className="accommodation-info text-left text-sm mb-4" style={{ lineHeight: '1.5', background: 'rgba(0,0,0,0.03)', padding: '1.5rem', borderRadius: '8px', marginBottom: '1.5rem', textAlign: 'left' }}>
                                <p>Para vuestra comodidad, hemos gestionado tarifas especiales de alojamiento para la boda en el Palacio de los Acevedo y en los alojamientos de Villa Pasiega.</p>
                                <p style={{ marginTop: '0.8rem', fontWeight: '500' }}>❗ <strong>Importante:</strong> Para acceder a las tarifas especiales, es necesario realizar la reserva por teléfono e indicar que vienes como invitado de nuestra boda. Te recomendamos no efectuar la reserva directamente a través del portal web, ya que en ese caso no se aplicarán dichas condiciones.</p>
                                <p style={{ marginTop: '0.8rem' }}>Los hoteles y apartamentos de Villa Pasiega (incluidos el Hotel SPA Villa Pasiega, el Hotel Los Pasiegos, los Apartamentos Villa Pasiega y los Apartamentos La Albarca) se encuentran todos en la localidad de Hoznayo, muy cerca unos de otros. El Palacio de los Acevedo está situado aproximadamente a 900 m del complejo de Villa Pasiega, lo que supone unos 10–12 minutos caminando o unos pocos minutos en coche.</p>
                                <p style={{ marginTop: '0.8rem' }}>Esto hace que alojarse en cualquiera de estas opciones sea muy cómodo para moverse rápido al Palacio de los Acevedo.</p>
                                <p style={{ marginTop: '0.8rem' }}>Los precios indicados corresponden a habitación o apartamento por noche e incluyen las condiciones especificadas en cada caso (desayuno, acceso al spa y/o posibilidad de alojarse con mascotas).</p>

                                <h4 style={{ marginTop: '1.5rem', fontWeight: 'bold' }}>Resumen de tarifas especiales:</h4>
                                <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem', marginBottom: '1.5rem', listStyleType: 'disc' }}>
                                    <li>Hotel Los Pasiegos (Habitación doble: 86 € Mascotas permitidas)</li>
                                    <li>Hotel SPA Villa Pasiega (Habitación doble con spa: 110 €)</li>
                                    <li>Apartamentos Villa Pasiega (Apartamento 2 habitaciones (4 adultos) con spa: 160 €)</li>
                                    <li>Apartamentos La Albarca (Apartamento 2 habitaciones (4 adultos): 150 € Mascotas permitidas)</li>
                                    <li>Palacio de los Acevedo (Habitación doble con desayuno: 130 €)</li>
                                </ul>

                                <p>Podéis ver las habitaciones y apartamentos de los hoteles aquí:</p>
                                <ul style={{ listStyleType: 'none', padding: 0, marginTop: '0.5rem', marginBottom: '1.5rem' }}>
                                    <li style={{ marginBottom: '0.5rem' }}>🔗 <a href="https://www.grupolospasiegos.es/hotel-spa-villa-pasiega?utm_source=chatgpt.com" target="_blank" rel="noreferrer" style={{ color: '#0066cc', textDecoration: 'underline' }}>Hotel Spa Villa Pasiega</a></li>
                                    <li style={{ marginBottom: '0.5rem' }}>🔗 <a href="https://www.grupolospasiegos.es/hotel-los-pasiegos?utm_source=chatgpt.com" target="_blank" rel="noreferrer" style={{ color: '#0066cc', textDecoration: 'underline' }}>Hotel Los Pasiegos</a></li>
                                    <li style={{ marginBottom: '0.5rem' }}>🔗 <a href="https://www.quehoteles.com/hotel-de-hoznayo-Spa-Villa-Pasiega-4C15P121D23655Z209182EF.htm?utm_source=chatgpt.com" target="_blank" rel="noreferrer" style={{ color: '#0066cc', textDecoration: 'underline' }}>Apartamentos Villa Pasiega</a></li>
                                    <li style={{ marginBottom: '0.5rem' }}>🔗 <a href="https://www.grupolospasiegos.com/apartamentos-la-albarca" target="_blank" rel="noreferrer" style={{ color: '#0066cc', textDecoration: 'underline' }}>Apartamentos La Albarca</a></li>
                                    <li style={{ marginBottom: '0.5rem' }}>🔗 <a href="https://www.palaciodelosacevedo.com/en/rooms?utm_source=chatgpt.com" target="_blank" rel="noreferrer" style={{ color: '#0066cc', textDecoration: 'underline' }}>Palacio de los Acevedo</a></li>
                                </ul>

                                <p>Si queréis más detalle, el <a href="https://drive.google.com/file/d/1rUMrNDAwR0ccgzefl0VJNvy2YQNDBo4t/view?usp=sharing" target="_blank" rel="noreferrer" style={{ color: '#0066cc', fontWeight: 'bold', textDecoration: 'underline' }}>dossier de tarifas de las habitaciones está aquí</a>.</p>

                                <p style={{ marginTop: '1.5rem' }}>Para realizar la reserva o consultar disponibilidad, podéis contactar directamente con los alojamientos:</p>
                                <div className="phone-box">
                                <p>📞 Hotel Los Pasiegos:</p>
                                <a href="tel:942525090">942 525 090</a>
                                <p style={{ marginTop: '1rem' }}>📞 Resto de establecimientos:</p>
                                <a href="tel:942525962">942 525 962</a>
                                </div>
                            </div>

                            <p style={{ fontWeight: 'bold', marginBottom: '1rem' }}>¿Necesitas alojamiento para la boda?</p>

                            <div className="input-group options-group" style={{ marginBottom: '1.5rem' }}>
                                <label className="option-label">
                                    <input type="radio" name="accommodationType" value="Hotel" className="option-input"
                                        checked={formData.accommodationType === 'Hotel'}
                                        onChange={() => { handleChange('accommodationType', 'Hotel'); handleChange('accommodationSpecific', ''); }} />
                                    <span>Sí, habitación de Hotel</span>
                                </label>
                                <label className="option-label">
                                    <input type="radio" name="accommodationType" value="Apartamento" className="option-input"
                                        checked={formData.accommodationType === 'Apartamento'}
                                        onChange={() => { handleChange('accommodationType', 'Apartamento'); handleChange('accommodationSpecific', ''); }} />
                                    <span>Sí, un Apartamento</span>
                                </label>
                                <label className="option-label">
                                    <input type="radio" name="accommodationType" value="No" className="option-input"
                                        checked={formData.accommodationType === 'No'}
                                        onChange={() => {
                                            handleChange('accommodationType', 'No');
                                            handleChange('accommodationSpecific', '');
                                            handleChange('accommodationCompanions', '');
                                            handleChange('accommodationStatus', '');
                                        }} />
                                    <span>No necesito alojamiento</span>
                                </label>
                            </div>

                            {formData.accommodationType === 'Hotel' && (
                                <div className="input-group options-group" style={{ marginBottom: '1.5rem', marginLeft: '1rem', borderLeft: '3px solid var(--color-primary-light)', paddingLeft: '1rem' }}>
                                    <label className="input-label" style={{ textAlign: 'left', display: 'block', marginBottom: '0.5rem' }}>¿Qué hotel eliges?</label>
                                    <label className="option-label">
                                        <input type="radio" name="accommodationSpecific" value="Hotel Los Pasiegos" className="option-input"
                                            checked={formData.accommodationSpecific === 'Hotel Los Pasiegos'}
                                            onChange={() => handleChange('accommodationSpecific', 'Hotel Los Pasiegos')} />
                                        <span>Hotel Los Pasiegos</span>
                                    </label>
                                    <label className="option-label">
                                        <input type="radio" name="accommodationSpecific" value="Hotel SPA Villa Pasiega" className="option-input"
                                            checked={formData.accommodationSpecific === 'Hotel SPA Villa Pasiega'}
                                            onChange={() => handleChange('accommodationSpecific', 'Hotel SPA Villa Pasiega')} />
                                        <span>Hotel SPA Villa Pasiega</span>
                                    </label>
                                    <label className="option-label">
                                        <input type="radio" name="accommodationSpecific" value="Palacio de los Acevedo" className="option-input"
                                            checked={formData.accommodationSpecific === 'Palacio de los Acevedo'}
                                            onChange={() => handleChange('accommodationSpecific', 'Palacio de los Acevedo')} />
                                        <span>Palacio de los Acevedo</span>
                                    </label>
                                </div>
                            )}

                            {formData.accommodationType === 'Apartamento' && (
                                <div className="input-group options-group" style={{ marginBottom: '1.5rem', marginLeft: '1rem', borderLeft: '3px solid var(--color-primary-light)', paddingLeft: '1rem' }}>
                                    <label className="input-label" style={{ textAlign: 'left', display: 'block', marginBottom: '0.5rem' }}>¿Qué apartamento eliges?</label>
                                    <label className="option-label">
                                        <input type="radio" name="accommodationSpecific" value="Apartamentos Villa Pasiega" className="option-input"
                                            checked={formData.accommodationSpecific === 'Apartamentos Villa Pasiega'}
                                            onChange={() => handleChange('accommodationSpecific', 'Apartamentos Villa Pasiega')} />
                                        <span>Apartamentos Villa Pasiega</span>
                                    </label>
                                    <label className="option-label">
                                        <input type="radio" name="accommodationSpecific" value="Apartamentos La Albarca" className="option-input"
                                            checked={formData.accommodationSpecific === 'Apartamentos La Albarca'}
                                            onChange={() => handleChange('accommodationSpecific', 'Apartamentos La Albarca')} />
                                        <span>Apartamentos La Albarca</span>
                                    </label>
                                </div>
                            )}

                            {(formData.accommodationType === 'Hotel' || formData.accommodationType === 'Apartamento') && (
                                <div style={{ marginLeft: '1rem', borderLeft: '3px solid var(--color-primary-light)', paddingLeft: '1rem' }}>
                                    <div className="input-group" style={{ marginBottom: '1.5rem' }}>
                                        <label className="input-label" style={{ textAlign: 'left', display: 'block', marginBottom: '0.5rem' }}>¿Con quién te vas a alojar?</label>
                                        <input
                                            type="text"
                                            className="text-input"
                                            placeholder="Nombres de tus acompañantes"
                                            value={formData.accommodationCompanions}
                                            onChange={(e) => handleChange('accommodationCompanions', e.target.value)}
                                        />
                                    </div>
                                    <div className="input-group options-group">
                                        <label className="input-label" style={{ textAlign: 'left', display: 'block', marginBottom: '0.5rem' }}>¿Ya has realizado la reserva?</label>
                                        <label className="option-label">
                                            <input type="radio" name="accommodationStatus" value="Sí, ya está reservado" className="option-input"
                                                checked={formData.accommodationStatus === 'Sí, ya está reservado'}
                                                onChange={() => handleChange('accommodationStatus', 'Sí, ya está reservado')} />
                                            <span>Sí, ya está reservado</span>
                                        </label>
                                        <label className="option-label">
                                            <input type="radio" name="accommodationStatus" value="No, la haré más adelante" className="option-input"
                                                checked={formData.accommodationStatus === 'No, la haré más adelante'}
                                                onChange={() => handleChange('accommodationStatus', 'No, la haré más adelante')} />
                                            <span>No, la haré más adelante</span>
                                        </label>
                                    </div>
                                </div>
                            )}

                            <div className="button-group" style={{ marginTop: '2rem' }}>
                                <button className="secondary-button" onClick={prevStep}>Atrás</button>
                                <button
                                    className="primary-button"
                                    onClick={nextStep}
                                    disabled={
                                        !formData.accommodationType ||
                                        ((formData.accommodationType === 'Hotel' || formData.accommodationType === 'Apartamento') && (!formData.accommodationSpecific || !formData.accommodationStatus))
                                    }
                                >
                                    Siguiente
                                </button>
                            </div>
                        </FormStep>
                    )}

                    {/* STEP 4: Final Confirmation */}
                    {step === 4 && (
                        <FormStep key="step4" direction={direction}>
                            <h2>Confirmar Datos</h2>
                            <p>Por favor, revisa tus respuestas antes de enviar.</p>

                            <div style={{ textAlign: 'left', background: 'rgba(0,0,0,0.03)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
                                <p><strong>Nombre:</strong> {formData.name}</p>
                                <p><strong>Teléfono:</strong> {formData.phone}</p>
                                <p><strong>Dietas:</strong> {formData.allergies === 'Sí' ? formData.allergiesDetail : 'Ninguna'}</p>
                                <p><strong>Autobús:</strong> {formData.bus}</p>
                                <p><strong>Alojamiento:</strong> {formData.accommodationType}</p>
                                {formData.accommodationType !== 'No' && (
                                    <>
                                        <p style={{ paddingLeft: '1rem' }}><strong>Opción:</strong> {formData.accommodationSpecific}</p>
                                        <p style={{ paddingLeft: '1rem' }}><strong>Acompañantes:</strong> {formData.accommodationCompanions || 'Ninguno'}</p>
                                        <p style={{ paddingLeft: '1rem' }}><strong>Reserva:</strong> {formData.accommodationStatus}</p>
                                    </>
                                )}
                            </div>

                            {submitError && <div style={{ color: 'var(--color-error)', marginBottom: '1rem' }}>{submitError}</div>}

                            <div className="button-group">
                                <button className="secondary-button" onClick={prevStep} disabled={isSubmitting}>Atrás</button>
                                <button className="primary-button" onClick={handleSubmit} disabled={isSubmitting}>
                                    {isSubmitting ? 'Enviando...' : 'Enviar Confirmación'}
                                </button>
                            </div>
                        </FormStep>
                    )}

                    {/* STEP 5: Success */}
                    {step === 5 && (
                       <div className="full-screen-success">
                        <FormStep key="step5" direction={direction}>
                            <h2>¡Muchas Gracias!</h2>
                            <p>Hemos recibido tus respuestas correctamente.</p>
                            <p style={{ marginTop: '1rem' }}>¡Tenemos muchas ganas de celebrar este día contigo!</p>
                            <p style={{ marginTop: '1.2rem' }}>Vuestra presencia es nuestro mejor regalo. Si además queréis tener un detalle, podéis ayudarnos en nuestro viaje de novios:</p>
                            <p style={{ fontWeight: 'bold', marginTop: '0.4rem' }}>IBAN: XXXX XXXX XXXX XXXX XXXX</p>
                                </FormStep>
                        </div>
                    )}

                </AnimatePresence>
            </main>
        </div>
    );
}
