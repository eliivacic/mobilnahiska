const UNSPLASH = (id: string, w: number, h: number) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&auto=format&q=75`;

export const HERO_IMAGE = UNSPLASH("1774884736128-841eabe693ce", 1200, 1400);

const EXTERIOR_IDS = [
  "1668015642451-a3bb11afb441",
  "1628394029761-acc83a2a08a6",
  "1626290131022-4e5a5e167173",
  "1632252300695-97c54a0db8e4",
  "1643494837039-a8240d7e069b",
  "1659720879283-7bb2c29370cf",
  "1704211825599-9e2ec712f561",
  "1724931282671-2d3bcd6de8f2",
  "1570290870545-277c2f5ad465",
  "1675747159044-cd54aec604e5",
  "1674201799144-f4af3274e2dc",
  "1746881428319-516620738e63",
  "1623189616600-201ae1f492d3",
  "1728344436686-31c6f5546cb4",
  "1786882547301-1de9322c980f",
];

const INTERIOR_IDS = [
  "1607582544956-a874e6740135",
  "1607582544566-491fce01803b",
  "1607582544644-f1da2a004994",
  "1704018924280-96d1ab64d213",
];

export const CATEGORY_IMAGES = {
  mobilna: UNSPLASH(EXTERIOR_IDS[0], 1200, 900),
  modularna: UNSPLASH(EXTERIOR_IDS[2], 1200, 900),
  zemljisce: UNSPLASH(EXTERIOR_IDS[7], 1200, 900),
};

export const GUIDE_IMAGES = [
  UNSPLASH(EXTERIOR_IDS[5], 1400, 900),
  UNSPLASH(EXTERIOR_IDS[8], 1400, 900),
  UNSPLASH(EXTERIOR_IDS[11], 1400, 900),
  UNSPLASH(EXTERIOR_IDS[6], 1400, 900),
];

// Zazidljiva zemljišča don't have their own photography yet — reusing
// verified exterior shots as stand-ins for test/placeholder listings.
export const LAND_IMAGES = [
  UNSPLASH(EXTERIOR_IDS[4], 1400, 1000),
  UNSPLASH(EXTERIOR_IDS[9], 1400, 1000),
  UNSPLASH(EXTERIOR_IDS[13], 1400, 1000),
  UNSPLASH(EXTERIOR_IDS[1], 1400, 1000),
];

export function listingGallery(index: number, count = 5): string[] {
  const ext = (offset: number) =>
    UNSPLASH(EXTERIOR_IDS[(index + offset) % EXTERIOR_IDS.length], 1400, 1000);
  const interior = (offset: number) =>
    UNSPLASH(INTERIOR_IDS[(index + offset) % INTERIOR_IDS.length], 1400, 1000);

  const images = [ext(0), ext(5), interior(0), ext(9), interior(2)];
  return images.slice(0, count);
}
