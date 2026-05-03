// Mock data for home page — set USE_MOCK_DATA = false when backend is ready
// To remove: delete this file and remove USE_MOCK_DATA guard in home.ts

import { ProductPageResponseModel } from '../../models/product';

export const USE_MOCK_DATA = true;

export interface MockCategory {
  id: string;
  name: string;
  image: string;
  label: string;
  description: string;
}

export const MOCK_CATEGORIES: MockCategory[] = [
  {
    id: '1',
    name: 'Furniture',
    label: 'Category I',
    image: 'images/furniture/605535438_122262447206035806_6564141998420686595_n.jpg',
    description: 'Architectural pieces that carry the weight of history. Each item anchors a room with presence — sourced from estates, workshops, and private collections.'
  },
  {
    id: '2',
    name: 'Decoration',
    label: 'Category II',
    image: 'images/decoration/499954146_122230372802035806_470547757576713118_n.jpg',
    description: 'Objects that transform a space into a narrative. Curated for their ability to hold a room\'s gaze without demanding it.'
  },
  {
    id: '3',
    name: 'Light Bodies',
    label: 'Category III',
    image: 'images/lightbodies/561383113_122251889606035806_6760256991749949996_n.jpg',
    description: 'Illumination as atmosphere and artifact. From hand-blown glass pendants to iron candelabras — light that tells a story after dark.'
  },
  {
    id: '4',
    name: 'Handmade',
    label: 'Category IV',
    image: 'images/handmade/623290719_122266444916035806_4288054482305376368_n.jpg',
    description: 'Every piece carries the visible mark of its maker. Studio objects shaped by hand, fired in tradition, and finished without apology.'
  },
  {
    id: '5',
    name: 'Watches',
    label: 'Category V',
    image: 'images/watches/577319293_122254686464035806_5763869080897610139_n.jpg',
    description: 'Precision instruments that measure lived time. Mechanical movements, pocket watches, and wall clocks sourced for their character.'
  },
  {
    id: '6',
    name: 'Messing',
    label: 'Category VI',
    image: 'images/messing/506727223_122233569464035806_695892035713615626_n.jpg',
    description: 'Brass and bronze aged to a warm, irreplaceable patina. Hardware, vessels, and decorative objects that reward a closer look.'
  },
  {
    id: '7',
    name: 'Porcelain',
    label: 'Category VII',
    image: 'images/porcelan and cheramic/488777445_122221785542035806_6731351556357048963_n.jpg',
    description: 'Delicate forms fired in craft and patience. Tableware, figurines, and vessels from European studios and family collections.'
  },
  {
    id: '8',
    name: 'Tekstil',
    label: 'Category VIII',
    image: 'images/tekstil/636655353_122269362380035806_5849781512464689529_n.jpg',
    description: 'Woven surfaces that soften a room and carry memory. Embroidered linens, heavy drapes, and handmade throws with provenance.'
  }
];

export const MOCK_NEW_ARRIVALS: ProductPageResponseModel = {
  content: [
    { id: 'p1', name: 'Carved Oak Writing Desk', description: 'Late Victorian', price: 1850, quantity: 1, thumbUrl: 'images/furniture/475830269_122211058868035806_128193211143364218_n.jpg', imgUrl: 'images/furniture/475830269_122211058868035806_128193211143364218_n.jpg' },
    { id: 'p2', name: 'Hand-blown Glass Pendant', description: 'Art Nouveau', price: 420, quantity: 2, thumbUrl: 'images/lightbodies/536281609_122244093062035806_3398174031275002361_n.jpg', imgUrl: 'images/lightbodies/536281609_122244093062035806_3398174031275002361_n.jpg' },
    { id: 'p3', name: 'Ceramic Relief Vase', description: 'Mid-century', price: 310, quantity: 3, thumbUrl: 'images/porcelan and cheramic/488777445_122221785542035806_6731351556357048963_n.jpg', imgUrl: 'images/porcelan and cheramic/488777445_122221785542035806_6731351556357048963_n.jpg' },
    { id: 'p4', name: 'Woven Silk Throw', description: 'Handcrafted', price: 195, quantity: 5, thumbUrl: 'images/tekstil/622797714_122266583144035806_1197360705522901704_n.jpg', imgUrl: 'images/tekstil/622797714_122266583144035806_1197360705522901704_n.jpg' },
  ],
  page: { size: 4, number: 0, totalElements: 4, totalPages: 1 }
};

export const MOCK_TOP_DEALS: ProductPageResponseModel = {
  content: [
    { id: 'p5', name: 'Brass Candelabra Set', description: 'Baroque Revival', price: 680, quantity: 2, thumbUrl: 'images/messing/499830545_122230236344035806_6287166722816564303_n.jpg', imgUrl: 'images/messing/499830545_122230236344035806_6287166722816564303_n.jpg' },
    { id: 'p6', name: 'Pocket Watch Collection', description: 'Swiss Movement', price: 1200, quantity: 1, thumbUrl: 'images/watches/518358321_122238887414035806_6423062347542651204_n.jpg', imgUrl: 'images/watches/518358321_122238887414035806_6423062347542651204_n.jpg' },
    { id: 'p7', name: 'Hand-thrown Stoneware Bowl', description: 'Studio Ceramic', price: 145, quantity: 8, thumbUrl: 'images/handmade/486559195_122220002978035806_1568614129348628616_n.jpg', imgUrl: 'images/handmade/486559195_122220002978035806_1568614129348628616_n.jpg' },
    { id: 'p8', name: 'Velvet Parlour Chair', description: 'Edwardian', price: 2100, quantity: 1, thumbUrl: 'images/furniture/496946477_122228937368035806_3196774076645337727_n.jpg', imgUrl: 'images/furniture/496946477_122228937368035806_3196774076645337727_n.jpg' },
  ],
  page: { size: 4, number: 0, totalElements: 4, totalPages: 1 }
};
