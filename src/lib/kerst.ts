// Kerst met Ode: het kerstmenu op /kerst/.
// Elk gerecht verwijst naar een recept in src/content/recepten (slug = bestandsnaam).
// Zolang een recept nog niet live staat, toont /kerst/ "verschijnt zondag ..." zonder link.
// De site bouwt elke zondag opnieuw, dus de pagina vult zich vanzelf aan.

export const kerstGangen = [
  { gang: 'bij de bubbels', slugs: ['oesters-met-gember', 'guacamole'] },
  { gang: 'voorgerecht', slugs: ['gravad-lax'] },
  { gang: 'hoofdgerecht', slugs: ['konijn-met-pruimen', 'broccolini'] },
  { gang: 'dessert', slugs: ['citroentaart'] },
];

// Andere recepten die ook passen op een feestmenu (als alternatief of extra gang).
export const kerstExtra = ['scampi-diabolique', 'ceviche-met-limoen'];

export const kerstSlugs = [...kerstGangen.flatMap((g) => g.slugs), ...kerstExtra];
