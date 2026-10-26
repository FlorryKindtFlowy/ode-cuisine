// Kerst met Ode: de kaart waaruit bezoekers zelf hun kerstmenu kiezen op /kerst/.
//
// Zo werkt het:
// - Elk gerecht kan aangeklikt worden en komt dan op het menukaartje (ook zonder recept of foto).
// - `zichtbaar: true` zet de link naar het recept op de kerstpagina. Staat het op false,
//   dan bestaat de receptpagina wel (via /kerst/keuken/), maar klanten zien er geen link naar
//   en Google indexeert ze niet.
// - `recept` verwijst naar een zondagsrecept in src/content/recepten. Dan linkt de kaart naar
//   dat recept, maar pas als het live staat (zijn zondag is gepasseerd) en zichtbaar true is.
// - `foto` is een pad in /public, bv. "/fotos/kerst/guacamole-krokantje.webp". Zonder foto neemt
//   de kaart automatisch de foto van het gekoppelde zondagsrecept.
// - `concept: true` = familierecept dat Florry nog moet nakijken of vervangen.

export type Gang = 'hapjes' | 'voorgerechten' | 'hoofdgerechten' | 'desserts' | 'bij de koffie';

export interface KerstGerecht {
  slug: string;
  titel: string;
  slash: string;
  gang: Gang;
  zichtbaar: boolean;
  recept?: string;
  foto?: string;
  fotoAlt?: string;
  concept?: boolean;
  familie?: string;
  verhaal?: string;
  porties?: number;
  voorbereiding?: number;
  bereiding?: number;
  ingredienten?: string[];
  stappen?: string[];
  tips?: string[];
  opVoorhand?: string;
}

export const gangen: { gang: Gang; label: string; uitleg: string }[] = [
  { gang: 'hapjes', label: 'hapjes', uitleg: 'Bij de bubbels. Reken op vier tot zes hapjes per persoon.' },
  { gang: 'voorgerechten', label: 'voorgerechten', uitleg: 'Eén of twee, afhankelijk van hoe lang de avond mag duren.' },
  { gang: 'hoofdgerechten', label: 'hoofdgerechten', uitleg: 'Kies er één, of zet er twee op tafel om te delen.' },
  { gang: 'desserts', label: 'desserts', uitleg: 'Iets zoets om de avond af te ronden.' },
  { gang: 'bij de koffie', label: 'bij de koffie', uitleg: 'Een versnapering, als niemand nog van tafel wil.' },
];

export const kerstmenu: KerstGerecht[] = [
  // ---------- HAPJES ----------
  {
    slug: 'oesters-met-gember', titel: 'ode oestertjes met gember', slash: 'oester / gember / sjalot', gang: 'hapjes',
    zichtbaar: true, recept: 'oesters-met-gember',
  },
  {
    slug: 'guacamole-krokantje', titel: 'guacamole op een krokantje', slash: 'avocado / limoen / koriander', gang: 'hapjes',
    zichtbaar: true, recept: 'guacamole', foto: '/fotos/kerst/guacamole-krokantje.webp',
    fotoAlt: 'Krokantjes met grof gestampte guacamole, rode peper en koriander op een donkergroene schaal, met een kom guacamole en limoenen erachter',
  },
  {
    slug: 'hespenrolletjes-van-mama', titel: 'hespenrolletjes van mama', slash: 'beenham / asperge / mayonaise', gang: 'hapjes',
    zichtbaar: false, concept: true, familie: 'van mama',
    verhaal: "Mama maakt de beste hespenrolletjes. Op elk familiefeest stond er een schotel van, en die was altijd als eerste leeg.",
    porties: 6, voorbereiding: 20, bereiding: 0,
    ingredienten: ["12 sneden beenham, niet te dun gesneden", "12 witte asperges uit een bokaal of vers gekookt", "4 eetlepels mayonaise", "1 theelepel mosterd", "1 eetlepel fijngesneden bieslook", "peper"],
    stappen: [
      "Laat de asperges goed uitlekken en dep ze droog met keukenpapier. Snij ze op de lengte van een snede hesp.",
      "Meng de mayonaise met de mosterd en de helft van de bieslook.",
      "Leg een snede hesp open, smeer er een dun laagje mayonaise op en leg een asperge aan de korte kant.",
      "Rol strak op en leg de rolletjes met de naad naar onder op een schotel.",
      "Snij ze eventueel in twee voor kleine hapjes. Werk af met een toefje mayonaise, de rest van de bieslook en wat versgemalen peper.",
    ],
    tips: ["Rol de hesp op het laatste moment, dan blijft ze mooi roze en droogt ze niet uit."],
    opVoorhand: "Tot 4 uur op voorhand, afgedekt in de koelkast.",
  },
  {
    slug: 'pate-van-opa', titel: 'paté van opa op toast', slash: 'varken / cognac / uienconfituur', gang: 'hapjes',
    zichtbaar: false, concept: true, familie: 'van opa',
    verhaal: "Opa was beenhouwer in hart en nieren. Zijn paté stond op elke feesttafel, met een goed stuk brood en niets anders erbij.",
    porties: 10, voorbereiding: 30, bereiding: 90,
    ingredienten: ["500 g varkensgehakt (half mager, half doorregen)", "250 g kippenlevers, schoongemaakt", "150 g gerookt spek in blokjes", "1 ui, fijngesnipperd", "1 teentje look", "1 ei", "4 cl cognac", "1 theelepel gedroogde tijm", "1 laurierblad", "12 g zout en versgemalen peper", "voor erbij: toastjes, uienconfituur en augurken"],
    stappen: [
      "Verwarm de oven voor op 160 °C. Stoof de ui en de look zacht in een klontje boter en laat afkoelen.",
      "Mix de kippenlevers fijn. Meng ze met het gehakt, het spek, de ui, het ei, de cognac, de tijm, zout en peper.",
      "Bak een klein balletje van het mengsel en proef. Kruid bij als het moet.",
      "Schep het mengsel in een terrine of cakevorm, druk aan en leg het laurierblad erop. Dek af met aluminiumfolie.",
      "Zet de vorm in een ovenschaal met heet water en gaar 90 minuten, tot de kerntemperatuur 70 °C is.",
      "Laat afkoelen, leg er een gewicht op en zet minstens een nacht in de koelkast.",
      "Snij in plakjes, leg op toastjes en werk af met een lepeltje uienconfituur en een schijfje augurk.",
    ],
    tips: ["Een paté smaakt pas echt na twee dagen rust. Maak hem dus ruim op voorhand."],
    opVoorhand: "Twee tot drie dagen op voorhand, dan is hij op zijn best.",
  },
  {
    slug: 'garnaalkroketje-a-la-frank', titel: 'garnaalkroketje à la frank', slash: 'noordzeegarnaal / peterselie / citroen', gang: 'hapjes',
    zichtbaar: false, concept: true,
    porties: 8, voorbereiding: 60, bereiding: 15,
    ingredienten: ["300 g gepelde grijze Noordzeegarnalen", "80 g boter", "100 g bloem", "4 dl volle melk", "1 dl visfumet of garnalenbouillon", "2 eidooiers", "1 eetlepel fijngehakte peterselie", "sap van ½ citroen", "nootmuskaat, peper en zout", "om te paneren: bloem, 2 eieren, fijn paneermeel", "frituurolie, gefrituurde peterselie en partjes citroen"],
    stappen: [
      "Smelt de boter, roer de bloem erdoor en laat 2 minuten garen. Voeg al roerend de warme melk en de fumet toe tot een dikke saus.",
      "Neem van het vuur, roer de eidooiers, de peterselie en het citroensap erdoor. Kruid met nootmuskaat, peper en weinig zout.",
      "Spatel de garnalen erdoor. Strijk uit in een ingevette schaal, dek af met folie op het oppervlak en laat minstens 6 uur opstijven in de koelkast.",
      "Snij of rol er kleine kroketjes van van ongeveer 25 g. Haal ze door bloem, losgeklopt ei en paneermeel, en dan nog een keer door ei en paneermeel.",
      "Frituur op 180 °C in 2 tot 3 minuten goudbruin. Laat uitlekken op keukenpapier.",
      "Serveer meteen met gefrituurde peterselie en een partje citroen.",
    ],
    tips: ["Dubbel paneren voorkomt dat de kroketjes openbarsten in de frituur."],
    opVoorhand: "Gepaneerd tot een maand in de diepvriezer. Frituur ze bevroren, een minuut langer.",
  },
  {
    slug: 'mini-vol-au-vent', titel: 'mini vol au vent', slash: 'kip / champignon / room', gang: 'hapjes',
    zichtbaar: false,
    porties: 8, voorbereiding: 30, bereiding: 45,
    ingredienten: ["24 mini bladerdeeggebakjes (bouchées)", "1 kippenfilet", "5 dl kippenbouillon", "150 g kleine champignons", "40 g boter", "40 g bloem", "1 dl room", "1 eidooier", "sap van ½ citroen", "nootmuskaat, peper en zout", "fijngehakte peterselie"],
    stappen: [
      "Pocheer de kippenfilet 15 minuten zacht in de bouillon. Laat afkoelen in het vocht en snij in kleine blokjes.",
      "Snij de champignons in vieren en bak ze kort in een klontje boter.",
      "Smelt de boter, roer de bloem erdoor en voeg al roerend 4 dl van de warme bouillon toe. Laat 5 minuten zacht koken.",
      "Roer de room en de eidooier erdoor, kruid met citroensap, nootmuskaat, peper en zout. Voeg kip en champignons toe.",
      "Warm de bladerdeeggebakjes 5 minuten op in een oven van 180 °C.",
      "Vul ze met het warme ragout en werk af met peterselie.",
    ],
    tips: ["Vul de bouchées pas vlak voor het serveren, anders wordt het bladerdeeg zacht."],
    opVoorhand: "Het ragout de dag ervoor. Zachtjes opwarmen en eventueel een scheutje bouillon toevoegen.",
  },
  {
    slug: 'scampi-diabolique-prikker', titel: 'scampi diabolique op een prikker', slash: 'scampi / rode peper / cognac', gang: 'hapjes',
    zichtbaar: true, recept: 'scampi-diabolique',
  },
  {
    slug: 'steak-tartaar-brioche', titel: 'steak tartaar op brioche', slash: 'rund / kappertjes / eidooier', gang: 'hapjes',
    zichtbaar: false,
    porties: 6, voorbereiding: 25, bereiding: 5,
    ingredienten: ["250 g zeer verse rundsfilet of runderstaart", "1 sjalot, heel fijn gesnipperd", "1 eetlepel kleine kappertjes", "2 augurken, fijngehakt", "1 theelepel mosterd", "1 eetlepel mayonaise", "een paar druppels Worcestershiresaus en tabasco", "1 eetlepel fijngehakte peterselie", "6 kwarteleitjes", "6 sneden brioche", "peper en zout"],
    stappen: [
      "Zet het vlees 20 minuten in de diepvriezer, dan snijdt het makkelijker. Snij het met een scherp mes in heel kleine blokjes.",
      "Meng sjalot, kappertjes, augurk, mosterd, mayonaise, Worcestershire, tabasco en peterselie. Roer het vlees erdoor en kruid met peper en zout.",
      "Steek rondjes uit de brioche en rooster ze goudbruin in een droge pan.",
      "Leg een lepel tartaar op elk rondje en maak een kuiltje in het midden.",
      "Breek de kwarteleitjes, leg in elk kuiltje een dooier en werk af met versgemalen peper.",
    ],
    tips: ["Snij het vlees met de hand en nooit in de hakmolen: zo blijft de textuur mooi."],
    opVoorhand: "De brioche rondjes 's ochtends. Het vlees pas op het laatste moment aanmaken.",
  },
  {
    slug: 'foie-gras-peperkoek', titel: 'foie gras op peperkoek', slash: 'foie gras / peperkoek / vijg', gang: 'hapjes',
    zichtbaar: false,
    porties: 8, voorbereiding: 15, bereiding: 5,
    ingredienten: ["200 g foie gras (terrine of bloc)", "6 sneden peperkoek", "4 eetlepels vijgenconfituur", "2 verse vijgen", "grof zeezout (fleur de sel)", "versgemalen peper"],
    stappen: [
      "Zet de foie gras koud tot vlak voor het snijden.",
      "Steek kleine vierkantjes of rondjes uit de peperkoek en rooster ze kort in een droge pan of onder de grill.",
      "Snij de foie gras met een mes dat je telkens in heet water dompelt in plakjes van een halve centimeter.",
      "Leg een plakje op elk stukje peperkoek met een lepeltje vijgenconfituur.",
      "Werk af met een partje verse vijg, een paar korreltjes fleur de sel en wat peper.",
    ],
    tips: ["Een warm mes geeft strakke plakjes zonder dat de foie gras breekt."],
    opVoorhand: "De peperkoek kan 's ochtends. Leg de foie gras er pas op vlak voor je gasten komen.",
  },
  {
    slug: 'gougeres-comte', titel: 'gougères met comté', slash: 'soezendeeg / comté / nootmuskaat', gang: 'hapjes',
    zichtbaar: false,
    porties: 8, voorbereiding: 20, bereiding: 25,
    ingredienten: ["1,25 dl water", "1,25 dl melk", "100 g boter", "1 theelepel zout", "150 g bloem", "4 eieren", "120 g geraspte comté, plus extra om te bestrooien", "een snuifje nootmuskaat en peper"],
    stappen: [
      "Verwarm de oven voor op 200 °C en bekleed twee bakplaten met bakpapier.",
      "Breng water, melk, boter en zout aan de kook. Voeg in één keer de bloem toe en roer tot het deeg loskomt van de pan. Laat nog 1 minuut drogen op het vuur.",
      "Doe het deeg in een kom en laat 5 minuten afkoelen. Klop de eieren er een voor een door tot een glanzend deeg.",
      "Roer de comté, nootmuskaat en peper erdoor.",
      "Spuit of schep kleine bolletjes op de bakplaat, bestrooi met extra kaas.",
      "Bak 20 tot 25 minuten goudbruin. Open de oven de eerste 15 minuten niet.",
    ],
    tips: ["Prik na het bakken een klein gaatje in elke gougère, dan blijven ze krokant."],
    opVoorhand: "Gebakken tot een maand in de diepvriezer. 5 minuten opwarmen op 180 °C.",
  },
  {
    slug: 'witloofbootje-blauwe-kaas', titel: 'witloofbootje met blauwe kaas', slash: 'witloof / roquefort / peer', gang: 'hapjes',
    zichtbaar: false,
    porties: 6, voorbereiding: 15, bereiding: 0,
    ingredienten: ["2 stronken witloof", "100 g roquefort of andere blauwe kaas", "50 g verse kaas (mascarpone of ricotta)", "1 rijpe peer", "30 g walnoten", "1 theelepel honing", "een paar takjes bieslook"],
    stappen: [
      "Haal de mooiste blaadjes los van het witloof. Spoel en dep droog.",
      "Prak de blauwe kaas met de verse kaas tot een smeuïg mengsel.",
      "Rooster de walnoten kort in een droge pan en hak ze grof.",
      "Snij de peer in kleine blokjes.",
      "Schep een lepeltje kaas in elk blaadje, leg er peer en walnoot op en werk af met een draadje honing en bieslook.",
    ],
    tips: ["Besprenkel de peer met wat citroensap als je ze een tijdje op voorhand snijdt."],
    opVoorhand: "Het kaasmengsel de dag ervoor. Vullen op het laatste moment.",
  },
  {
    slug: 'mini-kaaskroketje', titel: 'mini kaaskroketje', slash: 'oude brugge / peterselie / citroen', gang: 'hapjes',
    zichtbaar: false,
    porties: 8, voorbereiding: 45, bereiding: 15,
    ingredienten: ["100 g boter", "120 g bloem", "5 dl volle melk", "2 eidooiers", "200 g geraspte belegen kaas (Oude Brugge of Passendale)", "50 g geraspte parmezaan", "nootmuskaat, peper en weinig zout", "om te paneren: bloem, 2 eieren, fijn paneermeel", "frituurolie, peterselie en partjes citroen"],
    stappen: [
      "Smelt de boter, roer de bloem erdoor en laat 2 minuten garen. Voeg al roerend de warme melk toe tot een heel dikke saus.",
      "Neem van het vuur en roer de eidooiers en de kaas erdoor tot alles gesmolten is. Kruid.",
      "Strijk uit in een ingevette schaal, dek af met folie op het oppervlak en laat minstens 6 uur opstijven.",
      "Snij in kleine blokjes, paneer dubbel in bloem, ei en paneermeel.",
      "Frituur op 180 °C in 2 minuten goudbruin en serveer met gefrituurde peterselie en citroen.",
    ],
    opVoorhand: "Gepaneerd tot een maand in de diepvriezer.",
  },
  {
    slug: 'bitterbal-konijn-pruimen', titel: 'bitterbal van konijn met pruimen', slash: 'konijn / pruim / bruin bier', gang: 'hapjes',
    zichtbaar: false,
    porties: 10, voorbereiding: 45, bereiding: 15,
    ingredienten: ["400 g gestoofd konijn met pruimen, van het bot gehaald (restje van het hoofdgerecht of apart gestoofd)", "2 dl stoofsaus", "40 g boter", "50 g bloem", "4 gedroogde pruimen, fijngehakt", "1 eetlepel fijngehakte peterselie", "om te paneren: bloem, 2 eieren, fijn paneermeel", "frituurolie en grove mosterd"],
    stappen: [
      "Pluk het konijnenvlees fijn.",
      "Smelt de boter, roer de bloem erdoor en voeg al roerend de warme stoofsaus toe tot een dikke ragout.",
      "Roer het vlees, de pruimen en de peterselie erdoor. Laat afkoelen en zet minstens 4 uur koud.",
      "Rol balletjes van 20 g, paneer ze dubbel.",
      "Frituur op 180 °C in 3 minuten goudbruin. Serveer met grove mosterd.",
    ],
    tips: ["Zo krijgt een restje konijn met pruimen een tweede leven als hapje."],
    opVoorhand: "Gepaneerd tot een maand in de diepvriezer.",
  },
  {
    slug: 'dadels-in-spek', titel: 'dadels in spek', slash: 'dadel / spek / amandel', gang: 'hapjes',
    zichtbaar: false,
    porties: 6, voorbereiding: 15, bereiding: 12,
    ingredienten: ["18 medjool dadels", "18 geblancheerde amandelen", "9 sneden ontbijtspek, in de lengte gehalveerd", "cocktailprikkers"],
    stappen: [
      "Verwarm de oven voor op 200 °C.",
      "Snij de dadels in de lengte in, haal de pit eruit en steek er een amandel in.",
      "Wikkel elke dadel in een half sneetje spek en zet vast met een prikker.",
      "Leg op een bakplaat met bakpapier en bak 10 tot 12 minuten tot het spek krokant is.",
      "Laat een paar minuten afkoelen voor je serveert: de dadels worden binnenin heel heet.",
    ],
    opVoorhand: "Gewikkeld tot een dag op voorhand in de koelkast. Bakken vlak voor het serveren.",
  },
  {
    slug: 'gevulde-champignon', titel: 'gevulde champignon', slash: 'champignon / lookboter / broodkruim', gang: 'hapjes',
    zichtbaar: false,
    porties: 6, voorbereiding: 15, bereiding: 15,
    ingredienten: ["18 middelgrote champignons", "80 g zachte boter", "2 teentjes look, geperst", "2 eetlepels fijngehakte peterselie", "30 g fijn paneermeel of panko", "20 g geraspte parmezaan", "peper en zout"],
    stappen: [
      "Verwarm de oven voor op 200 °C.",
      "Draai de steeltjes uit de champignons en hak ze fijn.",
      "Meng de boter met look, peterselie, de fijngehakte steeltjes, peper en zout.",
      "Vul de champignons met de lookboter en bestrooi met paneermeel en parmezaan.",
      "Bak 12 tot 15 minuten tot ze goudbruin zijn en de boter borrelt.",
    ],
    opVoorhand: "Gevuld tot een dag op voorhand in de koelkast.",
  },
  {
    slug: 'bladerdeegstengels', titel: 'bladerdeegstengels', slash: 'bladerdeeg / parmezaan / tijm', gang: 'hapjes',
    zichtbaar: false,
    porties: 8, voorbereiding: 15, bereiding: 15,
    ingredienten: ["1 rol roomboterbladerdeeg", "1 ei", "60 g fijngeraspte parmezaan", "1 theelepel verse tijmblaadjes", "grof zeezout en peper"],
    stappen: [
      "Verwarm de oven voor op 200 °C.",
      "Rol het bladerdeeg uit en bestrijk met losgeklopt ei.",
      "Bestrooi de helft met parmezaan, tijm en peper. Vouw dicht en rol licht aan.",
      "Snij in reepjes van een centimeter en draai elke reep een paar keer rond.",
      "Leg op een bakplaat, bestrijk opnieuw met ei, bestrooi met zout en bak 12 tot 15 minuten goudbruin.",
    ],
    opVoorhand: "Tot twee dagen op voorhand, in een goed gesloten doos.",
  },
  {
    slug: 'carpaccio-rolletje', titel: 'carpaccio rolletje', slash: 'rund / truffel / rucola', gang: 'hapjes',
    zichtbaar: false,
    porties: 6, voorbereiding: 20, bereiding: 0,
    ingredienten: ["12 flinterdunne plakjes rundercarpaccio", "1 handje rucola", "30 g parmezaan, in schilfers", "2 eetlepels truffelmayonaise", "een paar druppels truffelolie", "peper en fleur de sel"],
    stappen: [
      "Leg de plakjes carpaccio naast elkaar op een plank.",
      "Smeer er een dun laagje truffelmayonaise op.",
      "Leg aan één kant een paar blaadjes rucola en een schilfer parmezaan.",
      "Rol strak op en zet eventueel vast met een prikker.",
      "Werk af met een druppel truffelolie, fleur de sel en peper.",
    ],
    opVoorhand: "Tot 2 uur op voorhand, afgedekt in de koelkast.",
  },
  {
    slug: 'mosseltje-a-la-hedwin', titel: 'mosseltje à la hedwin in de schelp', slash: 'mossel / curry / bieslook', gang: 'hapjes',
    zichtbaar: false, concept: true, familie: 'van papa hedwin',
    verhaal: "Papaatje zijn mosseltjes met curry, maar dan koud en in één hapje. Zo kan je ze rondgeven bij de bubbels.",
    porties: 8, voorbereiding: 30, bereiding: 10,
    ingredienten: ["1 kg mosselen", "1 sjalot", "1 dl droge witte wijn", "4 eetlepels mayonaise", "1 theelepel milde currypoeder", "1 eetlepel fijngesneden bieslook", "1 eetlepel fijne brunoise van rode paprika"],
    stappen: [
      "Spoel de mosselen en gooi open exemplaren weg.",
      "Fruit de sjalot kort, blus met de wijn, voeg de mosselen toe en kook ze met het deksel op de pan tot ze open zijn.",
      "Laat afkoelen. Haal de mosselen uit de schelp en hou de mooiste halve schelpen bij.",
      "Meng de mayonaise met de curry en een lepel van het kookvocht.",
      "Leg in elke schelp een mossel, een toefje currymayonaise, wat paprika en bieslook.",
    ],
    opVoorhand: "De mosselen de dag ervoor koken. Vullen een uur op voorhand.",
  },
  {
    slug: 'pompoensoepje', titel: 'pompoensoepje in een glaasje', slash: 'pompoen / gember / room', gang: 'hapjes',
    zichtbaar: false,
    porties: 12, voorbereiding: 15, bereiding: 30,
    ingredienten: ["1 kg pompoen (butternut of potimarron)", "1 ui", "2 cm verse gember", "1 l groentebouillon", "1 dl room, plus extra om af te werken", "1 klontje boter", "peper en zout", "pompoenpitten om af te werken"],
    stappen: [
      "Schil de pompoen indien nodig, verwijder de pitten en snij in blokjes.",
      "Stoof de ui en de geraspte gember in de boter tot ze zacht zijn.",
      "Voeg de pompoen en de bouillon toe en laat 20 minuten koken tot de pompoen helemaal zacht is.",
      "Mix fijn, roer de room erdoor en kruid met peper en zout.",
      "Schenk in kleine glaasjes en werk af met een draadje room en geroosterde pompoenpitten.",
    ],
    opVoorhand: "Tot drie dagen op voorhand in de koelkast, of in de diepvriezer.",
  },
  {
    slug: 'coquille-spek-lepel', titel: 'coquille met spek op een lepel', slash: 'coquille / spek / appel', gang: 'hapjes',
    zichtbaar: false,
    porties: 6, voorbereiding: 15, bereiding: 10,
    ingredienten: ["12 kleine coquilles (zonder koraal)", "4 sneden gerookt spek", "1 zure appel (Granny Smith)", "1 klontje boter", "1 eetlepel olijfolie", "een paar druppels balsamicoreductie", "fleur de sel en peper"],
    stappen: [
      "Bak het spek krokant in een droge pan, laat uitlekken en breek in stukjes.",
      "Snij de appel in kleine blokjes of luciferstokjes.",
      "Dep de coquilles goed droog. Bak ze in olie en boter op hoog vuur, 1 minuut per kant.",
      "Leg op elke lepel wat appel, een coquille en een stukje spek.",
      "Werk af met een druppel balsamico, fleur de sel en peper.",
    ],
    tips: ["Droge coquilles en een gloeiend hete pan: zo krijg je een goudbruin korstje."],
    opVoorhand: "Spek en appel op voorhand. De coquilles pas vlak voor het serveren bakken.",
  },

  // ---------- VOORGERECHTEN ----------
  {
    slug: 'coquilles-met-foie-gras', titel: 'coquilles met foie gras', slash: 'coquille / foie gras / porto', gang: 'voorgerechten',
    zichtbaar: false,
    porties: 4, voorbereiding: 20, bereiding: 15,
    ingredienten: ["8 grote coquilles", "4 plakjes rauwe foie gras van 40 g", "2 dl rode porto", "1 dl kalfsfond", "30 g koude boter", "1 eetlepel olijfolie", "veldsla of jonge scheuten", "fleur de sel en peper"],
    stappen: [
      "Laat de porto met de kalfsfond inkoken tot een stroperige saus. Monteer op het laatste moment met de koude boter.",
      "Dep de coquilles droog en bak ze in olie op hoog vuur, 1 tot 1,5 minuut per kant.",
      "Bak de foie gras in een gloeiend hete droge pan 30 seconden per kant. Laat uitlekken op keukenpapier.",
      "Leg op elk bord twee coquilles met een plakje foie gras erbovenop.",
      "Lepel de portosaus eromheen, werk af met wat groen, fleur de sel en peper.",
    ],
    opVoorhand: "De portosaus de dag ervoor. Coquilles en foie gras bak je à la minute.",
  },
  {
    slug: 'mosseltjes-a-la-hedwin', titel: 'mosseltjes à la hedwin', slash: 'mossel / curry / room', gang: 'voorgerechten',
    zichtbaar: false, recept: 'mosseltjes-a-la-hedwin',
  },
  {
    slug: 'carpaccio-met-truffel', titel: 'carpaccio met truffel', slash: 'rund / truffel / parmezaan', gang: 'voorgerechten',
    zichtbaar: false,
    porties: 4, voorbereiding: 20, bereiding: 0,
    ingredienten: ["320 g runderfilet, heel vers", "50 g parmezaan, in schilfers", "1 handje rucola", "2 eetlepels pijnboompitten, geroosterd", "1 kleine zwarte truffel of 1 eetlepel truffeltapenade", "olijfolie extra vierge", "een paar druppels truffelolie", "fleur de sel en peper"],
    stappen: [
      "Rol de runderfilet strak in vershoudfolie en zet 1 uur in de diepvriezer.",
      "Snij met een heel scherp mes flinterdunne plakjes. Leg ze tussen twee vellen bakpapier en klop ze nog dunner.",
      "Schik de plakjes op koude borden.",
      "Besprenkel met olijfolie en een paar druppels truffelolie.",
      "Werk af met rucola, parmezaan, pijnboompitten, geschaafde truffel, fleur de sel en peper.",
    ],
    opVoorhand: "De borden met vlees tot 2 uur op voorhand, afgedekt in de koelkast. Afwerken op het laatste moment.",
  },
  {
    slug: 'gerookte-eendenborst', titel: 'gerookte eendenborst', slash: 'eend / appel / witloof', gang: 'voorgerechten',
    zichtbaar: false,
    porties: 4, voorbereiding: 20, bereiding: 0,
    ingredienten: ["200 g gerookte eendenborst, in dunne plakjes", "2 stronken witloof", "1 zure appel", "30 g walnoten", "1 eetlepel honing", "1 eetlepel grove mosterd", "1 eetlepel ciderazijn", "3 eetlepels walnotenolie of olijfolie", "peper en zout"],
    stappen: [
      "Klop honing, mosterd, azijn en olie tot een vinaigrette. Kruid.",
      "Snij het witloof in reepjes en de appel in dunne staafjes.",
      "Rooster de walnoten kort in een droge pan.",
      "Meng witloof en appel met de helft van de vinaigrette.",
      "Schik de salade op de borden, leg de eendenborst ertussen en werk af met walnoten en de rest van de vinaigrette.",
    ],
    opVoorhand: "De vinaigrette dagen op voorhand. De salade pas vlak voor het serveren mengen.",
  },
  {
    slug: 'paddenstoelen-op-brioche', titel: 'paddenstoelen op brioche', slash: 'paddenstoel / brioche / eidooier', gang: 'voorgerechten',
    zichtbaar: false,
    porties: 4, voorbereiding: 15, bereiding: 15,
    ingredienten: ["400 g gemengde paddenstoelen (oesterzwam, shiitake, kastanjechampignon)", "1 sjalot", "1 teentje look", "40 g boter", "1 dl room", "4 dikke sneden brioche", "4 verse eidooiers", "1 eetlepel fijngehakte peterselie", "peper en zout"],
    stappen: [
      "Maak de paddenstoelen schoon met een borsteltje en scheur of snij ze in stukken.",
      "Bak ze in porties in hete boter tot ze goudbruin zijn. Voeg sjalot en look toe en bak nog 1 minuut.",
      "Blus met de room, laat kort inkoken en kruid met peper en zout.",
      "Rooster de brioche goudbruin in een pan met een klontje boter.",
      "Schep de paddenstoelen op de brioche, leg er een eidooier op en werk af met peterselie en peper.",
    ],
    opVoorhand: "De paddenstoelen schoonmaken en snijden de dag ervoor.",
  },

  // ---------- HOOFDGERECHTEN ----------
  {
    slug: 'vol-au-vent-met-kalfszwezerik', titel: 'vol au vent met kalfszwezerik', slash: 'kalfszwezerik / champignon / room', gang: 'hoofdgerechten',
    zichtbaar: false, recept: 'vol-au-vent-met-kalfszwezerik',
  },
  {
    slug: 'konijn-met-pruimen', titel: 'konijn met pruimen', slash: 'konijn / pruim / donker bier', gang: 'hoofdgerechten',
    zichtbaar: true, recept: 'konijn-met-pruimen',
  },
  {
    slug: 'hertenstoverij-peperkoek', titel: 'hertenstoverij met peperkoek', slash: 'hert / bruin bier / peperkoek', gang: 'hoofdgerechten',
    zichtbaar: false,
    porties: 6, voorbereiding: 30, bereiding: 180,
    ingredienten: ["1,2 kg hertenstoofvlees (schouder of bil), in blokken", "2 grote uien", "2 eetlepels bloem", "75 cl donker abdijbier", "4 sneden peperkoek", "2 eetlepels mosterd", "2 laurierbladeren", "4 takjes tijm", "4 jeneverbessen, gekneusd", "1 eetlepel bruine suiker", "1 eetlepel azijn", "boter, peper en zout"],
    stappen: [
      "Dep het vlees droog, kruid met peper en zout en bak het in porties bruin in boter. Haal uit de pot.",
      "Stoof de uien in dezelfde pot zacht en goudbruin. Strooi de bloem erover en roer kort.",
      "Doe het vlees terug, blus met het bier en schraap de aanbaksels los. Voeg laurier, tijm en jeneverbessen toe.",
      "Besmeer de peperkoek met mosterd en leg hem bovenop. Laat met het deksel op de pot 2,5 tot 3 uur heel zacht stoven.",
      "Roer de peperkoek door de saus. Kruid af met suiker, azijn, peper en zout.",
      "Serveer met kroketten, frietjes of een gratin en een appelcompote.",
    ],
    tips: ["Wild is mager. Laat het echt zacht stoven en nooit hard koken, dan blijft het mals."],
    opVoorhand: "Twee dagen op voorhand. Een stoverij wordt alleen maar beter.",
  },
  {
    slug: 'lamskroontje-kruidenkorst', titel: 'lamskroontje met kruidenkorst', slash: 'lam / kruidenkorst / seizoengroenten', gang: 'hoofdgerechten',
    zichtbaar: false,
    porties: 4, voorbereiding: 30, bereiding: 25,
    ingredienten: ["2 lamskroontjes van elk 6 tot 8 ribben", "60 g paneermeel", "1 bosje peterselie", "4 takjes tijm", "2 takjes rozemarijn", "2 teentjes look", "60 g zachte boter", "2 eetlepels mosterd", "olijfolie, peper en zout", "voor erbij: geroosterde wortel, pastinaak en krielaardappelen"],
    stappen: [
      "Haal het lam een uur op voorhand uit de koelkast. Verwarm de oven voor op 200 °C.",
      "Mix paneermeel, kruiden, look en boter tot een groene kruim.",
      "Kruid het lam en schroei het rondom dicht in een hete pan met olie.",
      "Bestrijk de vetkant met mosterd en druk de kruidenkorst erop.",
      "Gaar 15 tot 18 minuten in de oven voor rosé (kerntemperatuur 55 °C).",
      "Laat 10 minuten rusten onder folie en snij tussen de ribben. Serveer met de geroosterde groenten.",
    ],
    tips: ["Laat het vlees altijd rusten: zo blijft het sap in het vlees en niet op je plank."],
    opVoorhand: "De kruidenkorst en de groenten de dag ervoor voorbereiden.",
  },
  {
    slug: 'varkenswangetjes', titel: 'varkenswangetjes', slash: 'varken / rode wijn / wortel', gang: 'hoofdgerechten',
    zichtbaar: false,
    porties: 4, voorbereiding: 25, bereiding: 180,
    ingredienten: ["12 varkenswangetjes (ongeveer 1 kg)", "1 ui", "2 wortels", "2 stengels selder", "2 teentjes look", "1 eetlepel tomatenpuree", "5 dl rode wijn", "3 dl kalfsfond", "2 laurierbladeren", "4 takjes tijm", "boter, peper en zout", "voor erbij: glanzende worteltjes en puree"],
    stappen: [
      "Verwarm de oven voor op 150 °C. Kruid de wangetjes en bak ze bruin in boter. Haal uit de pot.",
      "Bak ui, wortel en selder in blokjes 5 minuten. Voeg look en tomatenpuree toe en bak nog even mee.",
      "Blus met de wijn, laat de helft inkoken en voeg de fond, laurier en tijm toe.",
      "Leg de wangetjes terug, dek af en stoof 2,5 tot 3 uur in de oven tot ze uit elkaar vallen.",
      "Zeef de saus en laat inkoken tot ze glanst. Kruid.",
      "Serveer met puree en glanzende worteltjes.",
    ],
    opVoorhand: "De dag ervoor stoven en zachtjes opwarmen in de saus.",
  },

  // ---------- DESSERTS ----------
  {
    slug: 'tiramisu-van-oma', titel: 'tiramisu van oma', slash: 'mascarpone / espresso / stoute vingertjes', gang: 'desserts',
    zichtbaar: false, recept: 'tiramisu-van-oma',
  },
  {
    slug: 'citroentaart', titel: 'citroentaart met meringue', slash: 'citroen / boter / meringue', gang: 'desserts',
    zichtbaar: true, recept: 'citroentaart',
  },
  {
    slug: 'crepe-suzette', titel: 'crêpe suzette', slash: 'sinaasappel / grand marnier / boter', gang: 'desserts',
    zichtbaar: false,
    porties: 4, voorbereiding: 20, bereiding: 20,
    ingredienten: ["voor de crêpes: 125 g bloem, 2 eieren, 3 dl melk, 25 g gesmolten boter, snuifje zout", "voor de saus: 80 g boter, 80 g suiker, rasp en sap van 2 sinaasappels, sap van ½ citroen, 4 cl Grand Marnier"],
    stappen: [
      "Klop bloem, eieren, melk, gesmolten boter en zout tot een glad beslag. Laat 30 minuten rusten.",
      "Bak dunne crêpes in een hete pan met een klein beetje boter. Vouw ze in vieren.",
      "Smelt suiker in een brede pan tot lichte karamel. Voeg de boter, de rasp en het sap toe en laat inkoken tot een glanzende saus.",
      "Leg de gevouwen crêpes in de saus en schep ze om.",
      "Schenk de Grand Marnier erover en flambeer voorzichtig aan tafel. Serveer meteen.",
    ],
    tips: ["Flamberen doe je met de dampkap uit en op veilige afstand. Het is een mooi moment aan tafel."],
    opVoorhand: "De crêpes de dag ervoor bakken. De saus maak je op het laatste moment.",
  },
  {
    slug: 'sabayon-champagne', titel: 'sabayon met champagne', slash: 'eidooier / champagne / rood fruit', gang: 'desserts',
    zichtbaar: false,
    porties: 4, voorbereiding: 10, bereiding: 10,
    ingredienten: ["4 eidooiers", "60 g suiker", "1,5 dl champagne of cava", "250 g rood fruit (frambozen, aardbeien, bessen)"],
    stappen: [
      "Verdeel het rood fruit over coupeglazen of diepe borden.",
      "Klop eidooiers en suiker in een metalen kom luchtig en licht van kleur.",
      "Zet de kom op een pan met zacht kokend water en voeg de champagne toe.",
      "Klop 6 tot 8 minuten tot de sabayon luchtig en dik is en lintjes vormt.",
      "Schep meteen over het fruit en brand eventueel kort af met een brander.",
    ],
    tips: ["Laat het water niet koken en de kom het water niet raken, anders gaan de eieren schiften."],
    opVoorhand: "Het fruit klaarzetten mag. De sabayon maak je vlak voor het serveren.",
  },
  {
    slug: 'kerststronk', titel: 'kerststronk', slash: 'chocolade / hazelnoot / mokka', gang: 'desserts',
    zichtbaar: false,
    porties: 8, voorbereiding: 60, bereiding: 12,
    ingredienten: ["voor het biscuit: 4 eieren, 100 g suiker, 70 g bloem, 20 g cacao", "voor de vulling: 2,5 dl room, 2 eetlepels poedersuiker, 2 eetlepels hazelnootpasta, 1 shot espresso", "voor de ganache: 200 g pure chocolade, 2 dl room, 20 g boter", "geroosterde hazelnoten en poedersuiker om af te werken"],
    stappen: [
      "Verwarm de oven voor op 200 °C. Klop eieren en suiker 8 minuten tot een dik, licht schuim. Spatel de gezeefde bloem en cacao erdoor.",
      "Strijk uit op een bakplaat met bakpapier en bak 8 tot 10 minuten. Rol warm op in een vochtige keukenhanddoek en laat afkoelen.",
      "Klop de room met poedersuiker, hazelnootpasta en espresso stijf.",
      "Rol het biscuit open, besmeer met de room en rol weer strak op. Zet een uur koud.",
      "Breng de room aan de kook, giet over de chocolade, roer glad en voeg de boter toe. Laat opstijven tot smeerbaar.",
      "Bestrijk de stronk met ganache, trek met een vork een schorspatroon en werk af met hazelnoten en een sneeuwtje poedersuiker.",
    ],
    opVoorhand: "De dag ervoor maken en koel bewaren.",
  },

  // ---------- BIJ DE KOFFIE ----------
  {
    slug: 'wafeltjes-van-oma', titel: 'wafeltjes van oma', slash: 'boter / suiker / vanille', gang: 'bij de koffie',
    zichtbaar: false, concept: true, familie: 'van oma',
    verhaal: "Oma was mijn beste vriendin, en niemand bakte betere wafels. Bij de koffie stond er altijd een doos met haar wafeltjes op tafel.",
    porties: 30, voorbereiding: 20, bereiding: 30,
    ingredienten: ["250 g zachte boter", "250 g suiker", "2 zakjes vanillesuiker", "4 eieren", "500 g bloem", "snuifje zout", "1 eetlepel melk indien nodig"],
    stappen: [
      "Klop de boter met de suiker en vanillesuiker romig.",
      "Voeg de eieren een voor een toe.",
      "Meng de bloem en het zout erdoor tot een stevig deeg. Laat een uur rusten in de koelkast.",
      "Rol balletjes ter grootte van een walnoot.",
      "Bak ze in een heet ingevet galettenijzer 1 tot 2 minuten goudbruin.",
      "Laat afkoelen op een rooster, zo worden ze krokant.",
    ],
    opVoorhand: "Tot twee weken in een goed gesloten koekjesdoos.",
  },
  {
    slug: 'chocoladetruffels', titel: 'chocoladetruffels', slash: 'pure chocolade / room / cacao', gang: 'bij de koffie',
    zichtbaar: false,
    porties: 30, voorbereiding: 30, bereiding: 5,
    ingredienten: ["200 g pure chocolade (70%)", "1,5 dl room", "25 g boter", "1 eetlepel cognac of rum (optioneel)", "cacaopoeder om te rollen"],
    stappen: [
      "Hak de chocolade fijn.",
      "Breng de room aan de kook en giet over de chocolade. Laat 2 minuten staan en roer glad.",
      "Roer de boter en eventueel de cognac erdoor.",
      "Laat minstens 3 uur opstijven in de koelkast.",
      "Steek er met een lepeltje bolletjes uit, rol ze snel tussen je handen en daarna door de cacao.",
    ],
    opVoorhand: "Tot een week in de koelkast. Haal ze een kwartier voor de koffie eruit.",
  },
  {
    slug: 'speculaasjes', titel: 'speculaasjes', slash: 'bruine suiker / kaneel / boter', gang: 'bij de koffie',
    zichtbaar: false,
    porties: 30, voorbereiding: 20, bereiding: 15,
    ingredienten: ["250 g bloem", "175 g donkere basterdsuiker", "150 g koude boter", "2 theelepels kaneel", "1 theelepel speculaaskruiden", "½ theelepel bakpoeder", "snuifje zout", "2 eetlepels melk"],
    stappen: [
      "Meng bloem, suiker, kruiden, bakpoeder en zout.",
      "Wrijf de koude boter erdoor tot kruim en kneed met de melk tot een deeg.",
      "Wikkel in folie en laat een nacht rusten in de koelkast, dan trekken de kruiden in.",
      "Verwarm de oven voor op 170 °C. Rol het deeg 3 mm dik uit en steek vormpjes uit.",
      "Bak 12 tot 15 minuten tot de randjes kleuren. Laat afkoelen op een rooster.",
    ],
    opVoorhand: "Tot drie weken in een goed gesloten doos.",
  },
];
