/** Seed kullanicisinin bilgileri — mock backend bu kullaniciyla baslar. */
export const SEED_USER = {
  id: 'u-1',
  name: 'Elif Test',
  email: 'qa@nextest.dev',
  password: 'Test1234!',
};

export const SEED_ACCESS_TOKEN = 'seed-access-token';
export const SEED_REFRESH_TOKEN = 'seed-refresh-token';

type StorageState = {
  cookies: {
    name: string;
    value: string;
    domain: string;
    path: string;
    expires: number;
    httpOnly: boolean;
    secure: boolean;
    sameSite: 'Strict' | 'Lax' | 'None';
  }[];
  origins: { origin: string; localStorage: { name: string; value: string }[] }[];
};

/** Oturum acik baslangic durumu: localStorage tokenlari + proxy'nin okudugu cookie. */
export function AUTH_STORAGE_STATE(baseURL: string): StorageState {
  const url = new URL(baseURL);
  return {
    cookies: [
      {
        name: 'access_token',
        value: SEED_ACCESS_TOKEN,
        domain: url.hostname,
        path: '/',
        expires: -1,
        httpOnly: false,
        secure: false,
        sameSite: 'Lax',
      },
    ],
    origins: [
      {
        origin: url.origin,
        localStorage: [
          { name: 'access_token', value: SEED_ACCESS_TOKEN },
          { name: 'refresh_token', value: SEED_REFRESH_TOKEN },
        ],
      },
    ],
  };
}

/** Oturum kapali baslangic durumu. */
export const LOGGED_OUT: StorageState = { cookies: [], origins: [] };
