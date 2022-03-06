const PORT = 8080;
let domain = process.env.NODE_ENV === "production"
  ? "https://galaxia-app.herokuapp.com"
  : `http://192.168.1.140:${PORT}`;
export const BASE_URL = `${domain}/api/v1`;
export const RESPONSE_TIMEOUT = 20_000;

