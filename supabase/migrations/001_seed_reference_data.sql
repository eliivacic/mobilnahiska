-- Reference/configuration data the app depends on to function at all
-- (pricing page, email settings, initial vodiči content). These are the
-- actual real values live in production as of 2026-09-27 — not placeholders.
-- Run after 000_baseline_schema.sql on a fresh database.

insert into public.plans (id, name, price_cents, billing_period, max_active_listings, description, is_active, features, is_featured, cta_label, duration_days, plan_group)
values
  ('zasebni-oglas', 'Zasebni oglas', 1900, 'one_time', 1, 'Za fizične osebe, ki želijo prodati mobilno ali modularno hiško.', true, ARRAY['1 oglas','objava za 30 dni','fotografije oglasa','kontaktni podatki','možnost podaljšanja','možnost dodatne TOP izpostavitve'], false, 'Oddaj oglas', 30, 'zasebni-oglas'),
  ('pro-start', 'PRO Start', 4900, 'monthly', 10, 'Za manjše profesionalne ponudnike in podjetja.', true, ARRAY['do 10 aktivnih oglasov','profil ponudnika','upravljanje oglasov','prejeta povpraševanja','osnovni pregled statistike'], true, null, null, 'pro-start'),
  ('pro', 'PRO', 9900, 'monthly', 50, 'Za aktivne prodajalce, proizvajalce in ponudnike z večjo ponudbo.', true, ARRAY['do 50 aktivnih oglasov','profesionalni profil ponudnika','upravljanje oglasov','prejeta povpraševanja','statistika ogledov','statistika zanimanja za oglase','možnost dodatnih promocij oglasov'], true, null, null, 'pro'),
  ('dealer', 'Dealer', 19900, 'monthly', null, 'Za večje prodajalce, proizvajalce in profesionalne ponudnike.', true, ARRAY['neomejeno število aktivnih oglasov','profesionalni profil podjetja','upravljanje celotne ponudbe','prejeta povpraševanja','naprednejša statistika','možnost dodatnih promocij','pripravljena možnost za prihodnji množični uvoz oglasov'], false, null, null, 'dealer'),
  ('free', 'Brezplačen', 0, 'monthly', 1, null, false, '{}', false, null, null, 'free')
on conflict (id) do nothing;

insert into public.promotion_addons (id, name, price_cents, duration_days, description, cta_label, is_active)
values
  ('top-listing', 'TOP oglas', 1900, 15, 'Oglas se za določeno obdobje uvrsti višje med rezultate iskanja.', 'Izpostavi oglas', true),
  ('homepage-feature', 'Izpostavitev na naslovnici', 4900, 15, 'Oglas pridobi dodatno vidnost v sekciji izpostavljenih oglasov na naslovni strani.', 'Izpostavi na naslovnici', true)
on conflict (id) do nothing;

insert into public.portal_settings (key, value)
values
  ('contact_email', 'info@mobilnahiska.si'),
  ('contact_phone', '+386 40 111 222'),
  ('seo_default_title', 'mobilnahiska.si: Mobilne in modularne hiške ter zazidljiva zemljišča'),
  ('seo_default_description', 'Slovenski marketplace za mobilne in modularne hiške ter zazidljiva zemljišča, z oglasi, ponudniki in vodiči na enem mestu.'),
  ('email_sender_name', 'mobilnahiska.si'),
  ('email_sender_address', 'obvestila@mobilnahiska.si'),
  ('email_reply_to', 'info@mobilnahiska.si'),
  ('email_notify_welcome', 'true'),
  ('email_notify_listing_status', 'true'),
  ('email_notify_inquiry', 'true'),
  ('email_notify_expiry', 'true'),
  ('email_notify_admin', 'true')
on conflict (key) do nothing;

insert into public.articles (slug, title, cover_image_url, excerpt, content, category, author, status, published_at)
values
(
  'kako-izbrati-primerno-zemljisce',
  'Kako izbrati primerno zemljišče?',
  'https://images.unsplash.com/photo-1659720879283-7bb2c29370cf?w=1400&h=900&fit=crop&auto=format&q=75',
  'Lega, komunalni priključki, namembnost in dostop do parcele: na kaj vse morate biti pozorni, preden podpišete pogodbo.',
  ARRAY[
    'Preden se odločite za nakup zazidljivega zemljišča, preverite njegovo namembnost v občinskem prostorskem načrtu. Zemljišče mora biti vodeno kot stavbno zemljišče, sicer gradnja ni mogoča brez dodatnih postopkov.',
    'Pomembna je tudi dostopnost do komunalne infrastrukture: vodovoda, elektrike, kanalizacije in dostopne ceste. Priključitev na omrežje lahko predstavlja precejšen dodaten strošek, če infrastruktura ni že speljana do parcele.',
    'Preverite tudi lego in orientacijo parcele glede na sonce, naklon terena in morebitne omejitve, kot so poplavna območja ali varovalni pasovi. Vsi ti dejavniki vplivajo na to, kakšno hišo lahko na zemljišču postavite in kolikšni bodo stroški priprave terena.',
    'Na koncu si vzemite čas za pregled zemljiškoknjižnega stanja parcele: lastništvo, morebitne služnosti ali bremena. Priporočljivo je, da si pred nakupom pomagate z geodetom ali nepremičninskim pravnikom.'
  ],
  'Zemljišča', 'mobilnahiska.si', 'published', '2026-08-20T08:00:00Z'
),
(
  'kaj-preveriti-pred-nakupom-mobilne-hiske',
  'Kaj preveriti pred nakupom mobilne hiške?',
  'https://images.unsplash.com/photo-1570290870545-277c2f5ad465?w=1400&h=900&fit=crop&auto=format&q=75',
  'Izolacija, materiali, garancija in pogoji dostave: pregled ključnih stvari, preden se odločite za konkretnega proizvajalca.',
  ARRAY[
    'Mobilne hiške se med seboj precej razlikujejo po kakovosti izdelave, uporabljenih materialih in stopnji izolacije. Preverite, za kakšne temperaturne razmere je hiška zasnovana. Je primerna za celoletno bivanje ali le za sezonsko uporabo?',
    'Pozanimajte se o garanciji proizvajalca, referencah in možnosti ogleda že postavljene hiške. Pri rabljenih hiškah je smiselno preveriti stanje strehe, oken in inštalacij, saj so to najpogostejši viri kasnejših stroškov.',
    'Vprašajte tudi po pogojih dostave in postavitve. Ali proizvajalec poskrbi za transport in priklop na parceli, ali je to strošek, ki ga nosite sami? Razlike v teh storitvah lahko pomembno vplivajo na skupno ceno projekta.'
  ],
  'Mobilne hiške', 'mobilnahiska.si', 'published', '2026-08-05T08:00:00Z'
),
(
  'od-parcele-do-postavitve-prvi-koraki',
  'Od parcele do postavitve: prvi koraki',
  'https://images.unsplash.com/photo-1746881428319-516620738e63?w=1400&h=900&fit=crop&auto=format&q=75',
  'Kratek pregled postopka: od izbire zemljišča in dovoljenj do priprave terena in dneva postavitve hiške.',
  ARRAY[
    'Pot od izbire zemljišča do vseljene hiške običajno poteka v nekaj jasnih korakih: izbira in nakup zemljišča, ureditev dokumentacije, priprava terena in temeljev, ter na koncu dostava in postavitev hiške.',
    'Za mobilne in modularne hiške so postopki pridobivanja dovoljenj pogosto enostavnejši kot pri klasični gradnji, vendar se pravila razlikujejo med občinami, zato je smiselno pravila preveriti pri lokalni upravni enoti še pred nakupom zemljišča.',
    'Priprava terena vključuje izravnavo, temeljno ploščo ali točkovne temelje ter priklop na elektriko, vodo in kanalizacijo. Dobro pripravljen teren pomembno skrajša čas od dostave hiške do vselitve.',
    'Ko je teren pripravljen, postavitev mobilne ali modularne hiške praviloma traja od enega do nekaj dni, odvisno od tipa hiške in zahtevnosti priklopov.'
  ],
  'Vodnik', 'mobilnahiska.si', 'published', '2026-07-18T08:00:00Z'
),
(
  'koliko-stane-postavitev-mobilne-hiske',
  'Koliko stane postavitev mobilne hiške?',
  'https://images.unsplash.com/photo-1704211825599-9e2ec712f561?w=1400&h=900&fit=crop&auto=format&q=75',
  'Cena hiške je le del zgodbe. Pregled dodatnih stroškov: priprava terena, priklopi, transport in dovoljenja.',
  ARRAY[
    'Poleg cene same hiške je treba pri načrtovanju proračuna upoštevati še vrsto dodatnih stroškov, ki jih kupci pogosto spregledajo. Ti lahko skupaj predstavljajo od 15 do 30 % vrednosti hiške.',
    'Priprava terena vključuje izravnavo zemljišča, temeljno ploščo ali točkovne temelje ter odvodnjavanje. Strošek je odvisen od naklona in nosilnosti tal na konkretni parceli.',
    'Priklopi na elektriko, vodo in kanalizacijo se zaračunajo ločeno, cena pa je odvisna od oddaljenosti parcele od obstoječega komunalnega omrežja.',
    'Transport hiške do lokacije je običajno zaračunan po kilometru in je dražji za oddaljene ali težje dostopne parcele. Nekateri proizvajalci ta strošek vključijo v končno ceno, drugi ga zaračunajo posebej.',
    'Nazadnje velja preveriti tudi, ali občina za postavitev mobilne hiške zahteva soglasja ali priglasitev del, saj se pravila med občinami razlikujejo.'
  ],
  'Mobilne hiške', 'mobilnahiska.si', 'published', '2026-09-02T08:00:00Z'
)
on conflict (slug) do nothing;
