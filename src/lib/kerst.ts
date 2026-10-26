// Kerst met Ode: de zondagsrecepten die ook op de kerstkaart staan.
// De volledige kaart (alle gerechten om uit te kiezen) staat in src/lib/kerstmenu.ts.
import { kerstmenu } from './kerstmenu';

export const kerstSlugs = kerstmenu.filter((g) => g.recept).map((g) => g.recept as string);
