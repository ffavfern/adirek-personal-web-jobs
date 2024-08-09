import { setSecureCookie, getCookie } from '../utils/cookies';

export function loginUser(sessionId) {
  setSecureCookie('userSession', sessionId, 7);
}

export function getSession() {
  return getCookie('userSession');
}
