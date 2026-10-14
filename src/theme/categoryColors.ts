export const COLOR_KEYS = ['rose', 'salmon', 'peach', 'sand', 'sage', 'lilac'] as const;
export type ColorKey = (typeof COLOR_KEYS)[number];

export const categoryBg: Record<ColorKey, string> = {
  rose: 'bg-skincare',
  salmon: 'bg-makeup',
  peach: 'bg-nails',
  sand: 'bg-sand',
  sage: 'bg-sage',
  lilac: 'bg-lilac',
};

export const categoryHex: Record<ColorKey, string> = {
  rose: '#E88D90',
  salmon: '#F4A896',
  peach: '#FBD6C6',
  sand: '#EADCD3',
  sage: '#CFE3D4',
  lilac: '#E4D8EE',
};

export function isColorKey(v: string): v is ColorKey {
  return COLOR_KEYS.includes(v as ColorKey);
}
