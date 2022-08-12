
//Obtengo la cookie o token de la sesion

export function getCookie(cookieKey, cookieString) {
  return cookieString
    .split(';')
    .find(cookie => cookie.includes(cookieKey))
    .replace(cookieKey+'=','')
    .replaceAll('"','')
    .trim();
}