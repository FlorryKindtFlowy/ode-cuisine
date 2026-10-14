import { defineCollection, z } from 'astro:content';

const recepten = defineCollection({
  type: 'content',
  schema: z.object({
    titel: z.string(),
    slash: z.string(),
    beschrijving: z.string(),
    categorie: z.enum(['om te delen', 'voorgerechten', 'hoofdgerechten', 'desserts']),
    familie: z.string().optional(),
    porties: z.number(),
    voorbereiding: z.number(),
    bereiding: z.number(),
    ingredienten: z.array(z.string()),
    verhaal: z.string(),
    faq: z.array(z.object({ vraag: z.string(), antwoord: z.string() })).default([]),
    foto: z.string().optional(),
    concept: z.boolean().default(false),
    datum: z.date(),
  }),
});

export const collections = { recepten };
