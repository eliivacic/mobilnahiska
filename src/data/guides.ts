import { GUIDE_IMAGES } from "@/data/images";

export interface Guide {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  date: string;
  image: string;
  content: string[];
}

export const guides: Guide[] = [
  {
    slug: "kako-izbrati-primerno-zemljisce",
    title: "Kako izbrati primerno zemljišče?",
    category: "Zemljišča",
    excerpt:
      "Lega, komunalni priključki, namembnost in dostop do parcele: na kaj vse morate biti pozorni, preden podpišete pogodbo.",
    date: "2026-08-20",
    image: GUIDE_IMAGES[0],
    content: [
      "Preden se odločite za nakup zazidljivega zemljišča, preverite njegovo namembnost v občinskem prostorskem načrtu. Zemljišče mora biti vodeno kot stavbno zemljišče, sicer gradnja ni mogoča brez dodatnih postopkov.",
      "Pomembna je tudi dostopnost do komunalne infrastrukture: vodovoda, elektrike, kanalizacije in dostopne ceste. Priključitev na omrežje lahko predstavlja precejšen dodaten strošek, če infrastruktura ni že speljana do parcele.",
      "Preverite tudi lego in orientacijo parcele glede na sonce, naklon terena in morebitne omejitve, kot so poplavna območja ali varovalni pasovi. Vsi ti dejavniki vplivajo na to, kakšno hišo lahko na zemljišču postavite in kolikšni bodo stroški priprave terena.",
      "Na koncu si vzemite čas za pregled zemljiškoknjižnega stanja parcele: lastništvo, morebitne služnosti ali bremena. Priporočljivo je, da si pred nakupom pomagate z geodetom ali nepremičninskim pravnikom.",
    ],
  },
  {
    slug: "kaj-preveriti-pred-nakupom-mobilne-hiske",
    title: "Kaj preveriti pred nakupom mobilne hiške?",
    category: "Mobilne hiške",
    excerpt:
      "Izolacija, materiali, garancija in pogoji dostave: pregled ključnih stvari, preden se odločite za konkretnega proizvajalca.",
    date: "2026-08-05",
    image: GUIDE_IMAGES[1],
    content: [
      "Mobilne hiške se med seboj precej razlikujejo po kakovosti izdelave, uporabljenih materialih in stopnji izolacije. Preverite, za kakšne temperaturne razmere je hiška zasnovana. Je primerna za celoletno bivanje ali le za sezonsko uporabo?",
      "Pozanimajte se o garanciji proizvajalca, referencah in možnosti ogleda že postavljene hiške. Pri rabljenih hiškah je smiselno preveriti stanje strehe, oken in inštalacij, saj so to najpogostejši viri kasnejših stroškov.",
      "Vprašajte tudi po pogojih dostave in postavitve. Ali proizvajalec poskrbi za transport in priklop na parceli, ali je to strošek, ki ga nosite sami? Razlike v teh storitvah lahko pomembno vplivajo na skupno ceno projekta.",
    ],
  },
  {
    slug: "od-parcele-do-postavitve-prvi-koraki",
    title: "Od parcele do postavitve: prvi koraki",
    category: "Vodnik",
    excerpt:
      "Kratek pregled postopka: od izbire zemljišča in dovoljenj do priprave terena in dneva postavitve hiške.",
    date: "2026-07-18",
    image: GUIDE_IMAGES[2],
    content: [
      "Pot od izbire zemljišča do vseljene hiške običajno poteka v nekaj jasnih korakih: izbira in nakup zemljišča, ureditev dokumentacije, priprava terena in temeljev, ter na koncu dostava in postavitev hiške.",
      "Za mobilne in modularne hiške so postopki pridobivanja dovoljenj pogosto enostavnejši kot pri klasični gradnji, vendar se pravila razlikujejo med občinami, zato je smiselno pravila preveriti pri lokalni upravni enoti še pred nakupom zemljišča.",
      "Priprava terena vključuje izravnavo, temeljno ploščo ali točkovne temelje ter priklop na elektriko, vodo in kanalizacijo. Dobro pripravljen teren pomembno skrajša čas od dostave hiške do vselitve.",
      "Ko je teren pripravljen, postavitev mobilne ali modularne hiške praviloma traja od enega do nekaj dni, odvisno od tipa hiške in zahtevnosti priklopov.",
    ],
  },
  {
    slug: "koliko-stane-postavitev-mobilne-hiske",
    title: "Koliko stane postavitev mobilne hiške?",
    category: "Mobilne hiške",
    excerpt:
      "Cena hiške je le del zgodbe. Pregled dodatnih stroškov: priprava terena, priklopi, transport in dovoljenja.",
    date: "2026-09-02",
    image: GUIDE_IMAGES[3],
    content: [
      "Poleg cene same hiške je treba pri načrtovanju proračuna upoštevati še vrsto dodatnih stroškov, ki jih kupci pogosto spregledajo. Ti lahko skupaj predstavljajo od 15 do 30 % vrednosti hiške.",
      "Priprava terena vključuje izravnavo zemljišča, temeljno ploščo ali točkovne temelje ter odvodnjavanje. Strošek je odvisen od naklona in nosilnosti tal na konkretni parceli.",
      "Priklopi na elektriko, vodo in kanalizacijo se zaračunajo ločeno, cena pa je odvisna od oddaljenosti parcele od obstoječega komunalnega omrežja.",
      "Transport hiške do lokacije je običajno zaračunan po kilometru in je dražji za oddaljene ali težje dostopne parcele. Nekateri proizvajalci ta strošek vključijo v končno ceno, drugi ga zaračunajo posebej.",
      "Nazadnje velja preveriti tudi, ali občina za postavitev mobilne hiške zahteva soglasja ali priglasitev del, saj se pravila med občinami razlikujejo.",
    ],
  },
];

export function getGuideBySlug(slug: string): Guide | undefined {
  return guides.find((guide) => guide.slug === slug);
}

export function getLatestGuides(count = 3): Guide[] {
  return [...guides]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, count);
}
