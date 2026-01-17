const BASEPATH = "http://localhost:3001";

export const API = {
   ARENAS: BASEPATH + "/arenas",
   CATEGORIES: BASEPATH + "/categories",
   DISCIPLINES: BASEPATH + "/disciplines",
   COMPETITIONS: BASEPATH + "/competitions",
   TOURNAMENTS: BASEPATH + "/tournaments",
} as const;
