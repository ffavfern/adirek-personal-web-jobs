import { setCookie, getCookie } from '../utils/cookies';

export function loginUser(sessionId) {
    
    setCookie('userSession', sessionId, 7); 
}

export function getSession() {
    return getCookie('userSession');
}
