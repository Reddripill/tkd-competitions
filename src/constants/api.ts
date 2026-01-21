const BASEPATH = process.env.NEXT_PUBLIC_API_URL;

export const API = {
   ARENAS: BASEPATH + "/arenas",
   CATEGORIES: BASEPATH + "/categories",
   DISCIPLINES: BASEPATH + "/disciplines",
   COMPETITIONS: BASEPATH + "/competitions",
   TOURNAMENTS: BASEPATH + "/tournaments",
} as const;
