import styles from './book.module.css'
import libro from './../../../public/svg/claims.svg'
import Image from 'next/image'

const ClaimsBook = () => {
    return (
        <div className={styles.book}>
            <div className={styles.book_wrapper}>
                <div>
                    <Image src={libro} alt="libroimg" />
                    <h3>Libro de reclamaciones virtual</h3>
                    <p>Conforme a lo establecido en el Código de Protección y Defensa del Consumidor esta institución cuenta con un Libro de Reclamaciones a tu disposición.</p>
                    <div>
                        <strong>INJOYPLAN S.A.C. <br />RUC N° 20603074956</strong>
                        <span>Fecha: 29/06/2020</span>
                    </div>
                </div>
                <hr />
                <div className={styles.form_wrapper}>
                    <form>
                        <h5>Datos del Consumidor</h5>
                        <div className={styles.form_group}>
                            <label htmlFor="nombre"><span className={styles.symbol}>* </span> Nombre completo</label>
                            <input
                                type="text"
                                id="nombre"
                                name="nombre"
                                required
                            />
                        </div>

                        <div className={styles.form_group}>
                            <label htmlFor="tipoDocumento"><span className={styles.symbol}>* </span> Tipo de documento</label>
                            <select
                                id="tipoDocumento"
                                name="tipoDocumento"
                                required
                            >
                                <option value="">Seleccionar</option>
                                {/* Agregar opciones */}
                            </select>
                        </div>

                        <div className={styles.form_group}>
                            <label htmlFor="numeroDocumento"><span className={styles.symbol}>* </span> Número de documento</label>
                            <input
                                type="text"
                                id="numeroDocumento"
                                name="numeroDocumento"
                                required
                            />
                        </div>

                        <div className={styles.form_group}>
                            <label htmlFor="domicilio"><span className={styles.symbol}>* </span> Domicilio</label>
                            <input
                                type="text"
                                id="domicilio"
                                name="domicilio"
                                required
                            />
                        </div>

                        <div className={styles.form_group}>
                            <label htmlFor="departamento"><span className={styles.symbol}>* </span> Departamento</label>
                            <select
                                id="departamento"
                                name="departamento"
                                required
                            >
                                <option value="">Seleccionar</option>
                                {/* Agregar opciones */}
                            </select>
                        </div>

                        <div className={styles.form_group}>
                            <label htmlFor="provincia"><span className={styles.symbol}>* </span> Provincia</label>
                            <select
                                id="provincia"
                                name="provincia"
                                required
                            >
                                <option value="">Seleccionar</option>
                                {/* Agregar opciones */}
                            </select>
                        </div>

                        <div className={styles.form_group}>
                            <label htmlFor="distrito"><span className={styles.symbol}>* </span> Distrito</label>
                            <select
                                id="distrito"
                                name="distrito"
                                required
                            >
                                <option value="">Seleccionar</option>
                                {/* Agregar opciones */}
                            </select>
                        </div>

                        <div className={styles.form_group}>
                            <label htmlFor="telefono"><span className={styles.symbol}>* </span> Celular/Teléfono</label>
                            <input
                                type="tel"
                                id="telefono"
                                name="telefono"
                                required
                            />
                        </div>

                        <div className={styles.form_group}>
                            <label htmlFor="correo"><span className={styles.symbol}>* </span> Correo electrónico</label>
                            <input
                                type="email"
                                id="correo"
                                name="correo"
                                required
                            />
                        </div>

                        <div className={styles.input_final}>
                            <label>
                                <input
                                    type="checkbox"
                                    name="menorEdad"
                                />
                                <p> Soy menor de edad</p>
                            </label>
                        </div>

                        <h6>Datos del Bien Contratado</h6>

                        <div className={styles.form_group}>
                            <label></label>
                            <label>
                                <input
                                    type="radio"
                                    name="tipoBien"
                                    value="producto"
                                /> Producto
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="tipoBien"
                                    value="servicio"
                                /> Servicio
                            </label>
                        </div>

                        <div className={styles.form_group}>
                            <label htmlFor="monto"><span className={styles.symbol}>* </span> Monto reclamado</label>
                            <input
                                type="number"
                                id="monto"
                                name="monto"
                                placeholder="S/ 0.00"
                                required
                            />
                        </div>

                        <div className={styles.form_group}>
                            <label htmlFor="descripcion"><span className={styles.symbol}>* </span> Descripción</label>
                            <textarea
                                id="descripcion"
                                name="descripcion"
                                required
                            />
                        </div>

                        <h6>Detalle del Reclamo y Pedido del Consumidor</h6>

                        <div className={styles.form_group}>
                            <label></label>
                            <label>
                                <input
                                    type="radio"
                                    name="tipoReclamo"
                                    value="reclamo"
                                /> Reclamo
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="tipoQueja"
                                    value="queja"
                                /> Queja
                            </label>
                        </div>

                        <div className={styles.form_group}>
                            <label htmlFor="detalleReclamo"><span className={styles.symbol}>* </span> Detalles del reclamo o queja</label>
                            <textarea
                                id="detalleReclamo"
                                name="detalleReclamo"
                                required
                            />
                        </div>
                        <div className={styles.form_group}>
                            <label htmlFor="detallePedido"><span className={styles.symbol}>* </span> Detalles del pedido</label>
                            <textarea
                                id="detallePedido"
                                name="detallePedido"
                                required
                            />
                        </div>
                        <div className={styles.last_wrapper}>
                            <div>
                                <p><strong>Reclamo: </strong>Inconformidad con los bienes adquiridos o por el producto.</p>
                                <p><strong>Queja: </strong>Inconformidad o malestar por el servicio prestado (atención).</p>
                            </div>
                            <div className='mt-10'>
                                <p><strong>Nota: </strong>La respuesta a la presente queja o reclamo será brindada mediante comunicación electrónica enviada a la dirección que usted ha consignado en la presente Hoja de Reclamación. En caso de que usted desee que la respuesta le sea enviada a su domicilio deberá expresar ello en el detalle del reclamo o queja. <br /> <br />

                                    El proveedor deberá dar respuesta al reclamo en un plazo no mayor a treinta (30) días calendario, pudiendo ampliar el plazo hasta por treinta (30) días más, previa comunicación al consumidor. <br /> <br />

                                    La formulación del reclamo no impide acudir a otras vías de solución de controversias ni de requisitos previos para interponer una denuncia ante el INDECOPI.</p>
                            </div>
                            <div className={styles.form_group}>
                                <label>
                                    <input
                                        type="checkbox"
                                        name="menorEdad"
                                    /> <p>Declaro ser el titular del servicio y acepto el contenido del presente formulario manifestado bajo Declaración Jurada la veracidad de los hechos descritos.</p>
                                </label>
                            </div>
                            <div className={styles.input_final}>
                                <label>
                                    <input
                                        type="checkbox"
                                        name="menorEdad"
                                    /> <p>He leído y Acepto la Política de privacidad </p>
                                </label>
                            </div>
                            <div>
                            <button type="submit">ENVIAR</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <hr />
        </div>
    )
}

export default ClaimsBook