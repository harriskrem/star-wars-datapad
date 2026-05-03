export const paths = {
  home: '/',
  characters: '/characters',
  characterDetail: (id: string | number) => `/characters/${id}`,
  films: '/films',
  filmDetail: (id: string | number) => `/films/${id}`,
  favourites: '/favourites',
} as const
