interface Header {
    CODE: number;
    CODE_RESPONSE: string;
    MESSAGE: string;
}

export interface Event {
    esfavorito: number | null;
    HoraInicio: string;
    HoraFinal: string;
    FechaInicio: string;
    idEventos: string | number;
    ideventos: string | number;
    titulo: string;
    NombreLocal: string;
    urlFuente: string;
    url: string;
    Monto: number;
    Destacado: number;
    categoria_id: string | number;
    EsGratis: number;
    Distrito: string;
    estado: string | null;
    idfecha: string | number;
    usuario_id: string | number;
    favorito: number;

    // Optional extra fields used in some UI screens
    direccion?: string;
    latitud_longitud?: string;
    descripcionEvento?: string;
    createdAt?: string | Date;
    imageUrl?: string;
    id?: string;
}

export interface IResponse {
    HEADER: Header;
    RESPONSE: Event[];
}