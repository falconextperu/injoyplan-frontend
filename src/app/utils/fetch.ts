// Backend nuevo con NestJS
const BASE_URL = 'http://localhost:4201'
// const BASE_URL_PROD = 'https://api.injoyplan.com'

export async function refreshTokens<T>(token: string, refreshToken: string): Promise<T> {
    const url = `${BASE_URL}/authentication/refresh-token`;
    const data = { token, refreshToken };
    console.log(token)
    console.log(refreshToken)
    const options: RequestInit = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Agregar el token al encabezado de la solicitud
        },
        body: JSON.stringify(data)
    };
    return await fetchData<T>(url, options);
}

async function fetchData<T>(url: string, options?: any): Promise<T> {
    try {
        const response = await fetch(url, options);
        
        // Si es 401 y había un token, intentar refresh
        if (response.status === 401) {
            const token = localStorage.getItem('tokenRP');
            const refreshToken = localStorage.getItem('refreshTokenRP');
            const hasAuthHeader = options?.headers?.['Authorization'];

            // Solo intentar refresh si había un token en la petición original
            if (token && refreshToken && hasAuthHeader) {
                console.log("Intentando refrescar token...")
                const refreshResp: any = await refreshTokens(token, refreshToken);
                
                if (refreshResp.code === 1) {
                    // Token refrescado con éxito
                    const newToken = refreshResp.data.token;
                    localStorage.setItem('tokenRP', newToken);
                    localStorage.setItem('refreshTokenRP', refreshResp.data.refreshToken);
                    
                    // Actualizar header y reintentar
                    if (options && options.headers) {
                        options.headers['Authorization'] = `Bearer ${newToken}`;
                    }
                    return await fetchData<T>(url, options);
                } else {
                    // Refresh falló, limpiar tokens
                    localStorage.removeItem('tokenRP');
                    localStorage.removeItem('refreshTokenRP');
                    throw new Error('No se pudo refrescar el token de acceso');
                }
            }
            // Si no había token, es un endpoint público que requiere auth - devolver error normal
        }
        
        if (!response.ok) {
            const errorData = await response.json();
            console.log(errorData)
            return errorData;
        }
        return response.json();
    } catch (error) {
        console.error('Error en solicitud:', error);
        throw error;
    }
}

export async function get<T>(endpoint: string): Promise<T> {
    const token = localStorage.getItem('token');
    const url = `${BASE_URL}/${endpoint}`;
    if(token) {
        const options: RequestInit = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // Agregar el token al encabezado de la solicitud
            }
        };
        return await fetchData<T>(url, options);
    }
    return await fetchData<T>(url);
}

export async function getWithBody<T>(endpoint: string, data: any): Promise<T> {
    const url = `${BASE_URL}/${endpoint}`;
    const options: RequestInit = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data), // Pasar los datos en el cuerpo de la solicitud
    };
    return await fetchData<T>(url, options);
}

export async function post<T>(endpoint: string, data: any): Promise<T> {
    const token = localStorage.getItem('token'); // Obtener el token antes de cada solicitud
    const url = `${BASE_URL}/${endpoint}`;
    const options: RequestInit = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(data),
    };
    return await fetchData<T>(url, options);
}

export async function patch<T>(endpoint: string, data: any): Promise<T> {
    const token = localStorage.getItem('token');
    const url = `${BASE_URL}/${endpoint}`;
    const options: RequestInit = {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(data),
    };
    return await fetchData<T>(url, options);
}

export async function postFormData<T>(endpoint: string, formData: FormData): Promise<T> {
    const token = localStorage.getItem('token');
    const url = `${BASE_URL}/${endpoint}`;

    // IMPORTANT: Do NOT set Content-Type here; the browser will set the multipart boundary.
    const headers: Record<string, string> = {};
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const options: RequestInit = {
        method: 'POST',
        headers,
        body: formData,
    };

    return await fetchData<T>(url, options);
}

export async function put<T>(endpoint: string, data: any): Promise<T> {
    const token = localStorage.getItem('token'); // Obtener el token antes de cada solicitud
    const url = `${BASE_URL}/${endpoint}`;
    const options: RequestInit = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(data),
    };
    return await fetchData<T>(url, options);
}

export async function del<T>(endpoint: string): Promise<T> {
    const token = localStorage.getItem('token'); // Obtener el token antes de cada solicitud
    const url = `${BASE_URL}/${endpoint}`;
    const options: RequestInit = {
        method: 'DELETE',
        headers: {
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
    };
    return await fetchData<T>(url, options);
}
