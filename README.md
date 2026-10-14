# Ode Cuisine website

Statische site in Astro. Recepten zijn Markdown-bestanden in `src/content/recepten/`.

## Lokaal draaien
npm install
npm run dev     # http://localhost:4321

## Nieuw recept
Kopieer een bestand in `src/content/recepten/`, pas de gegevens bovenaan aan en schrijf de stappen als genummerde lijst.
Zet `concept: false` zodra het echte familierecept erin staat.

## Elke zondag een recept
- Zet de `datum` van een recept op de zondag waarop het live mag (bv. `datum: 2026-10-25`).
- Recepten met een datum in de toekomst blijven onzichtbaar. Je kan dus weken vooruit werken.
- Elke zondagochtend bouwt GitHub de site opnieuw (`.github/workflows/deploy.yml`) en verschijnt het recept van die dag.

## Online (GitHub Pages)
- Elke push naar `main` zet de site automatisch live.
- Domein: `www.odecuisine.be` (bestand `public/CNAME`), DNS bij Vimexx.
