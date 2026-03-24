import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";

// ─────────────────────────────────────────────────────────
// Load .env.local
// ─────────────────────────────────────────────────────────
const envContent = readFileSync(".env.local", "utf8");
const env = {};
for (const line of envContent.split("\n")) {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) env[match[1].trim()] = match[2].trim();
}

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY
);

// ─────────────────────────────────────────────────────────
// BIBLE DE VENTE V2 — 35 NEW entries from Sorel conversations
// Sources: LE_COURANT_CARAIBE.md, PHI_ENGINE_PITCH.md,
//          PIPELINE_BYSS_GROUP.md, PROPOSITION_DIGICEL.md,
//          SOREL_SESSION5.md
// Categories: prospect_intel, vertical, objection, pitch,
//             case_study, pricing, sun_tzu, biomimetisme,
//             neuro_selling, phrase_accroche
// ─────────────────────────────────────────────────────────

const entries = [

  // ═══════════════════════════════════════════════════════
  // CATEGORY: sun_tzu — Strategie de guerre appliquee
  // Source: LE_COURANT_CARAIBE.md
  // ═══════════════════════════════════════════════════════

  {
    universe: "bible",
    category: "sun_tzu",
    title: "Sun Tzu #1 — L'ennemi est l'inertie, pas la concurrence",
    content: `"Connais ton ennemi et connais-toi toi-meme." En Martinique, l'ennemi n'est PAS les concurrents. Il n'y a aucun concurrent direct en video IA + agents IA + Google Ads. L'ennemi c'est l'INERTIE. Le "on a toujours fait comme ca." Le "je vais reflechir." Le "pas le bon moment."

APPLICATION : Ne combats pas l'inertie par des arguments. Combats-la par la DEMONSTRATION. Montre. Ne dis pas. La video MIZA ne vend pas BYSS GROUP — elle brise l'inertie en montrant ce qui est possible.`,
    tags: ["sun_tzu", "strategie", "inertie"],
  },

  {
    universe: "bible",
    category: "sun_tzu",
    title: "Sun Tzu #2 — Briser la resistance sans combattre",
    content: `"L'excellence supreme consiste a briser la resistance de l'ennemi sans combattre." La meilleure vente est celle ou tu n'as pas vendu. Quand le prospect regarde la video demo et dit "je veux la meme chose", tu n'as rien vendu. Le prospect s'est vendu tout seul.

C'est le Need-Payoff du SPIN : la question "si vous aviez ca, qu'est-ce que ca changerait ?" Le prospect dit la reponse a voix haute. Il s'engage.

APPLICATION : Le portfolio est l'arme #1. 5 videos. 1 iPhone. 0 argument de vente. Les yeux du prospect font le travail.`,
    tags: ["sun_tzu", "portfolio", "spin"],
  },

  {
    universe: "bible",
    category: "sun_tzu",
    title: "Sun Tzu #3 — L'eau adapte son cours au terrain",
    content: `Le Courant Caraibe entre par les passages etroits des Petites Antilles. L'eau ne force pas le passage. Elle trouve les ouvertures.

APPLICATION : Gary ne force pas l'entree chez GBH par la grande porte (Stephane Hayot, PDG). Il entre par le passage ouvert — Naomie Phanor (Clement, email direct) ou Charles Larcher (VP MEDEF). Victor Despointes n'est pas le PDG de Digicel — il est le passage entre Gary et Digicel. Le passage etait ouvert. Le courant est entre.

REGLE : Toujours le passage entre les iles, jamais l'assaut frontal contre le continent.`,
    tags: ["sun_tzu", "courant_caraibe", "passage"],
  },

  {
    universe: "bible",
    category: "sun_tzu",
    title: "Sun Tzu #4 — Apparaitre la ou on ne t'attend pas",
    content: `Le marche martiniquais n'attend PAS un prestataire IA local. Les entreprises pensent que l'IA c'est Paris, San Francisco. Pas Fort-de-France. BYSS GROUP apparait la ou personne ne l'attend. C'est le choc. C'est le "Dingue !!" de Victor.

APPLICATION : Ne jamais se presenter comme "agence digitale" (il y en a 50 en MQ). Se presenter comme "le premier studio d'IA de la Martinique." La categorie n'existe pas. La creer. Celui qui cree la categorie en est le roi.`,
    tags: ["sun_tzu", "positionnement", "categorie"],
  },

  {
    universe: "bible",
    category: "sun_tzu",
    title: "Sun Tzu #5 — Frapper le faible, eviter le fort",
    content: `Orange (budget 15M€ com, decision Paris, cycle 6 mois) est FORT. MIZA (chef independant, decision en 5 minutes, 0€ de bureaucratie) est FAIBLE au sens militaire = facile a conquerir.

SEQUENCE CORRECTE : MIZA > restos > excursions > distilleries > hotels > institutions > telecoms. Du plus accessible au plus fortifie. Chaque conquete renforce l'armee (portfolio, credibilite, temoignages) pour la prochaine.

EXCEPTION : Quand un passage est ouvert (Victor a dit "Dingue !!"), ne pas l'ignorer parce que le plan dit "commencer par les petits." Sun Tzu dit aussi : "L'opportunite s'offre rarement deux fois."`,
    tags: ["sun_tzu", "sequence", "priorites"],
  },

  {
    universe: "bible",
    category: "sun_tzu",
    title: "Sun Tzu #7 — La transparence EST la strategie",
    content: `Sun Tzu dit "l'art de la guerre est fonde sur la duperie." PAS en Martinique. Pas pour BYSS GROUP. La transparence EST la strategie. L'honnetete en MQ est une arme de destruction massive parce que PERSONNE ne l'utilise. Les agences parisiennes vendent du reve. Gary vend la verite. La verite en MQ, c'est du respect.

QUAND UN PROSPECT DEMANDE "Vous avez des references ?" : "Pas encore de clients en tant que BYSS GROUP. Voici mon experience personnelle (BeeCee, Wizzee, GoodCircle). Et voici une video faite pour vous GRATUITEMENT, en 48h." La preuve remplace la reference.`,
    tags: ["sun_tzu", "transparence", "honnetete"],
  },

  // ═══════════════════════════════════════════════════════
  // CATEGORY: biomimetisme — Mycelium & Courant Caraibe
  // Source: LE_COURANT_CARAIBE.md
  // ═══════════════════════════════════════════════════════

  {
    universe: "bible",
    category: "biomimetisme",
    title: "Mycelium #1 — L'exploration avant l'exploitation",
    content: `Le mycelium explore d'abord en envoyant des hyphes dans toutes les directions. La plupart ne trouvent rien. Celles qui trouvent un nutriment recoivent plus d'energie.

APPLICATION BYSS : Prospecter 35 prospects dans 10 secteurs, observer lesquels repondent, puis CONCENTRER l'energie sur les secteurs fertiles. Ne pas decider a l'avance que "les distilleries sont le meilleur marche." Laisser le terrain repondre.`,
    tags: ["biomimetisme", "mycelium", "exploration"],
  },

  {
    universe: "bible",
    category: "biomimetisme",
    title: "Mycelium #2 — La reciprocite, pas l'extraction",
    content: `Le mycelium ne prend pas aux plantes. Il ECHANGE. Du phosphore contre du glucose. Chaque partie donne ce qu'elle a et recoit ce dont elle a besoin.

APPLICATION BYSS : La video gratuite n'est PAS un loss leader marketing. C'est un ECHANGE. Gary donne son talent. Le restaurateur donne son histoire. La video appartient aux deux. C'est la reciprocite qui cree la confiance.

Le champignon porteur de spores = le premier client visible. La spore = le bouche-a-oreille. Le vent qui porte la spore = le MEDEF. Le sol fertile = la Martinique. L'enzyme = la video gratuite (le catalyseur qui decompose l'inertie).`,
    tags: ["biomimetisme", "mycelium", "reciprocite"],
  },

  {
    universe: "bible",
    category: "biomimetisme",
    title: "Courant Caraibe — Modele de croissance oceanographique",
    content: `Le Courant Caraibe entre par les passages etroits entre les iles. Dans les passages, le courant ACCELERE — la meme masse d'eau dans un espace plus petit va plus vite.

TRADUCTION : Quand BYSS GROUP se concentre sur 1 secteur (restos Ste-Luce, marina Trois-Ilets), la vitesse de prospection accelere. 4 restos en 1 jour. 7 excursions en 1 apres-midi. La concentration geographique est l'accelerateur. La dispersion est le ralentisseur.

TRAJECTOIRE : Filet d'eau (1 video MIZA) > traverse les passages (10 restos, 7 excursions) > absorbe d'autres courants (MEDEF ouvre les portes, CCI reference) > flux (40 clients, 500K€) > Gulf Stream (Senzaris, la Martinique digitale).`,
    tags: ["biomimetisme", "courant_caraibe", "concentration"],
  },

  // ═══════════════════════════════════════════════════════
  // CATEGORY: neuro_selling — Regles MQ specifiques
  // Source: LE_COURANT_CARAIBE.md
  // ═══════════════════════════════════════════════════════

  {
    universe: "bible",
    category: "neuro_selling",
    title: "Neuro-selling MQ — La relation PRECEDE la transaction",
    content: `Regle #3 du neuro-selling martiniquais : la pudeur du prix. En Martinique, la relation PRECEDE la transaction. Un Martiniquais sent quand on lui vend quelque chose.

SEQUENCE CORRECTE :
1. D'abord la relation (cafe, discussion, ecoute sincere)
2. Puis le diagnostic (SPIN mais en mode ECOUTE, pas en mode script)
3. Puis la proposition (3 options, presentees comme des possibilites, pas des packages)

La vente martiniquaise n'est pas un entonnoir. C'est un cercle. Si Gary arrive avec un SPIN Selling de killer, le prospect le sentira.`,
    tags: ["neuro_selling", "martinique", "relation"],
  },

  {
    universe: "bible",
    category: "neuro_selling",
    title: "Neuro-selling MQ — Le temps creole",
    content: `Regle #4 du neuro-selling martiniquais : le temps creole. Les calendriers de prospection calibres sur des cycles metropolitains ne marchent pas. Mois 1 : contact. Mois 2 : relance. Mois 3 : close = NON.

En Martinique, "la semaine prochaine" = 2-3 semaines. Le cycle de vente reel est 2x plus long. Si Gary force le rythme, il perd la confiance.

CORRECTION CRM : J+3 de relance > J+7. J+7 > J+14. J+14 > J+30. Le pipeline est plus lent mais plus solide. Patience = vertu commerciale #1.`,
    tags: ["neuro_selling", "martinique", "delais"],
  },

  {
    universe: "bible",
    category: "neuro_selling",
    title: "Neuro-selling MQ — La preuve sociale est emotionnelle",
    content: `Le prospect martiniquais ne se convainc pas avec un ROI x7. Il se convainc en VOYANT la video d'un voisin. La preuve sociale est emotionnelle, pas mathematique.

Le calculateur ROI est utile pour les prospects corporate (CMT, CCI) mais pas pour les restaurateurs et les excursions.

ARME #1 : Le portfolio (3-5 videos cas zero) est 10x plus important que le calculateur. Le calculateur reste sur le site pour le SEO et les prospects analytiques. Mais la vraie arme de persuasion c'est un iPhone avec 5 videos spectaculaires.`,
    tags: ["neuro_selling", "martinique", "emotion"],
  },

  {
    universe: "bible",
    category: "neuro_selling",
    title: "Architecture de choix — 3 nudges Thaler",
    content: `Les propositions 3 options (Essentiel / Croissance / Domination) SONT de l'architecture de choix (Thaler & Sunstein).

NUDGE 1 — LE DEFAUT : Pre-selectionner l'option Croissance comme "recommandee." Le status quo bias fait le reste.

NUDGE 2 — LA NORME SOCIALE : "La plupart des professionnels de votre secteur choisissent l'option Croissance." La PHRASE cree la norme sociale. Le prospect ne veut pas etre en dessous.

NUDGE 3 — LA FRICTION MANAGEE : Essentiel = "limitee" (pas de revisions, pas de multi-format). Domination = "complete mais engagement long." Croissance = "la plus fluide" — aucune friction, livraison rapide, revisions incluses. Facilite = choix par defaut.`,
    tags: ["neuro_selling", "nudge", "thaler"],
  },

  // ═══════════════════════════════════════════════════════
  // CATEGORY: phrase_accroche — Par vertical
  // Source: LE_COURANT_CARAIBE.md, PHI_ENGINE_PITCH.md
  // ═══════════════════════════════════════════════════════

  {
    universe: "bible",
    category: "phrase_accroche",
    title: "Phrases memorables — Restaurant",
    content: `MIZA : "Votre cuisine merite un film. Pas une brochure."

Tante Arlette : "Tout le monde connait Tante Arlette. Personne ne l'a filmee."

GENERIC RESTO : "Le touriste a 22h dans son hotel cherche sur Google. Il voit votre concurrent parce que votre concurrent a une video. Pas vous."`,
    tags: ["phrase_accroche", "restaurant"],
  },

  {
    universe: "bible",
    category: "phrase_accroche",
    title: "Phrases memorables — Rhum & Distilleries",
    content: `Depaz : "63 morts. 1 survivant. 1 chateau face au volcan. Et personne n'a encore filme cette histoire."

JM : "Le marche premium +8%/an. Diplomatico a un e-com. Pas JM."

La Favorite : "10 minutes de l'aeroport. Et les touristes ne le savent pas."

Saint-James : "Le Musee du Rhum merite une visite immersive. Pas une plaquette."

Neisson : "3.2 etoiles pour un rhum d'exception. La video montre le VRAI Neisson."`,
    tags: ["phrase_accroche", "rhum"],
  },

  {
    universe: "bible",
    category: "phrase_accroche",
    title: "Phrases memorables — Excursions & Plongee",
    content: `Kata Mambo : "Le touriste a 22h ne sait pas que vos dauphins existent. Donnez-leur un ecran."

Sun Loisirs : "Jeff et ses dauphins en video pro = la carte postale qui vend toute seule."

Le Mantou : "La mangrove en video IA = un poeme que personne ne peut copier."

Alpha Diving : "La video sous-marine IA. 0 concurrent en MQ. Vous seriez le premier."

Deep Turtle : "Deep Turtle + video tortues = le marketing se fait tout seul."

NICHE INEXPLOITEE : Video sous-marine IA = LIBRE en Martinique. Alpha Diving (PADI 5 etoiles, 1289 avis 4.9) serait le premier.`,
    tags: ["phrase_accroche", "excursion"],
  },

  {
    universe: "bible",
    category: "phrase_accroche",
    title: "Phrases memorables — Hotels & Tourisme",
    content: `Karibea : "Booking.com prend 15%. BYSS GROUP vous les rend."

Bakoua : "Le Bakoua a accueilli un sommet presidentiel Bush-Mitterrand 1991. Pas une seule video pro."

CMT : "Le Costa Rica a 50 videos drone sur YouTube. La Martinique en merite 500."`,
    tags: ["phrase_accroche", "hotel"],
  },

  {
    universe: "bible",
    category: "phrase_accroche",
    title: "Phrases memorables — Telecom & Grands comptes",
    content: `Digicel : "Vos concurrents fatiguent. Vos creatives aussi. On les reveille."

Wizzee : "Vos concurrents fatiguent. Vos creatives aussi. On les reveille."

Orange : "Le contenu local que votre agence parisienne ne peut PAS faire."

Free : "La liberte a un gout de Martinique. Mais votre pub a encore un gout de metropole."

GBH : "Un touriste loue chez Jumbo et ne sait pas que Clement est du meme groupe."

SARA : "SARA est un monopole. Le budget n'est pas le probleme. L'IA l'est-elle ?"

Lorraine : "Lorraine EST la Martinique. Mais les 18-35 ne le voient que dans le frigo."`,
    tags: ["phrase_accroche", "telecom"],
  },

  // ═══════════════════════════════════════════════════════
  // CATEGORY: prospect_intel — Intelligence sur prospects nommes
  // Sources: PIPELINE, PROPOSITION_DIGICEL, LE_COURANT_CARAIBE
  // ═══════════════════════════════════════════════════════

  {
    universe: "bible",
    category: "prospect_intel",
    title: "Victor Despointes — WITH-YOU / Digicel",
    content: `CONTACT : Victor Despointes, gerant WITH-YOU (agence, Le Lamentin)
ROLE : Intermediaire pour le brief Digicel (72 videos/an)
REACTION : A dit "Dingue !!" a la demo video IA
STATUT : Brief recu, RDV closing semaine du 23 mars 2026

INTELLIGENCE :
- Le passage etait ouvert (Sun Tzu #3). Victor est le passage entre Gary et Digicel.
- A vu MOOSTIK avant de briefer — MOOSTIK est le declencheur du brief
- Le contact est chaud — ne pas laisser refroidir

APPROCHE : WhatsApp direct. "Victor, j'ai quelque chose a te montrer."`,
    tags: ["prospect_intel", "digicel", "with_you"],
  },

  {
    universe: "bible",
    category: "prospect_intel",
    title: "Digicel — Brief 72 videos, post-Chapter 11",
    content: `PROSPECT : Digicel / DAFG
SECTEUR : Telecoms Antilles
CONTEXTE : Post-Chapter 11 (restructuration 2020-2024). Position #2 derriere Orange Caraibe en Martinique.

BRIEF : 72 videos/an, 2 marques (Digicel + Digicel Business), 4 canaux (reseaux, YouTube, POS, TV/Cinema).

OPTIONS PROPOSEES :
- Pack Annuel Standard : 72 videos, 625€ HT/video = 45 000€ HT/an (3 750€/mois)
- Pack Annuel Premium : 72 + 12 longues, 63 000€ HT/an (5 250€/mois)
- Pack Trimestre Test : 18 videos, 750€/video = 13 500€ HT (3 mois)

LIVRAISON : 2 lots de 3 videos/mois. 3 formats par video (9:16 + 16:9 + 1:1). 2 allers-retours par video.`,
    tags: ["prospect_intel", "digicel", "telecom"],
  },

  {
    universe: "bible",
    category: "prospect_intel",
    title: "GBH — Groupe Bernard Hayot, 3 entites",
    content: `PROSPECT : GBH (Groupe Bernard Hayot) — 6 milliards de CA
CONTACT CLE : Naomie Phanor (naomie.phanor@gbh.fr, 0696 81 76 05)
ENTITES : Clement (100K visiteurs/an, 0 e-com) + Jumbo + Europcar

PAIN POINTS :
- Communication en silo : Clement, Jumbo, Europcar ne communiquent pas ensemble
- Clement : 100K visiteurs/an mais 0 e-commerce
- Europcar + Jumbo : budget Ads 10-20K€/mois mais 0 video pre-roll
- CPA 15-25€ sans video

STRATEGIE D'ENTREE : Email Naomie + video demo Clement. Contrat cadre GBH = 3 entites d'un coup. Ne PAS aller voir Stephane Hayot (PDG) — entrer par le passage Naomie Phanor (Sun Tzu #3).`,
    tags: ["prospect_intel", "gbh", "conglomerat"],
  },

  {
    universe: "bible",
    category: "prospect_intel",
    title: "MEDEF MQ — Fabienne Joseph, canal multiplicateur",
    content: `CONTACT : Fabienne Joseph (fabienne.joseph@medef-martinique.fr, 0696 82 70 10)
ROLE : MEDEF = pas un client. C'est un CANAL. 640 entreprises. 1 evenement = 50-100 dirigeants.

CALCUL ROI : 500€ investis (video troc) > 200 contacts > 80K€ generes = ROI x160

APPROCHE : "Bonjour Fabienne, je suis Gary Bissol." (3 minutes). Offrir une video troc contre un creneau evenement.

POURQUOI C'EST CRITIQUE : Le MEDEF donne la LEGITIMITE. "Soumettre l'ennemi sans combattre, voila le sommet de l'art." — Sun Tzu. Les alliances sont plus precieuses que les gros clients.`,
    tags: ["prospect_intel", "medef", "reseau"],
  },

  {
    universe: "bible",
    category: "prospect_intel",
    title: "CCI MQ — Canal passif 5000+ entreprises",
    content: `CONTACT : Philippe Jock (contact@martinique.cci.fr)
ROLE : CCI = CANAL PASSIF. 5000+ entreprises. Referencement sans prospection.

CALCUL : 10 clients/an via CCI x 10K€ = 100K€ pour 0€ de prospection.

INTELLIGENCE : La CCI a un programme digitalisation TPE/PME mais AUCUN prestataire IA local reference. BYSS GROUP serait le premier. Le referencement CCI = prospects entrants sans effort.

APPROCHE : Email Pascal Fardin (Contact-Entreprises, pfardin@contact-entreprises.com, 0696 23 28 23) en parallele.`,
    tags: ["prospect_intel", "cci", "reseau"],
  },

  {
    universe: "bible",
    category: "prospect_intel",
    title: "CMT — 11 emails directs, avantage massif",
    content: `PROSPECT : Comite Martiniquais du Tourisme
CONTACT PRINCIPAL : Claude Bulot Piault (claude.piault@martiniquetourisme.com)
AVANTAGE : 11 emails nominatifs = avantage massif d'acces direct

CONTACTS :
- Claude Bulot Piault, Brival, Landy, Creny, Cherchel (5 emails simultanes)

PAIN : martinique.org pas immersif. Contenu institutionnel, pas experientiel. Perd la bataille visuelle Caraibes.

STRATEGIE : 5 emails simultanes. Effet de volume = au moins 1 repond.`,
    tags: ["prospect_intel", "cmt", "tourisme"],
  },

  {
    universe: "bible",
    category: "prospect_intel",
    title: "BIXA — Fort-de-France, pont institutionnel",
    content: `CONTACT : BIXA, Directrice des Affaires Culturelles de Fort-de-France
REACTION : A commente "Hate !" sous le teaser MOOSTIK (16 janvier 2026)
COMMANDES : Serie "An tan lontan" + Serie Cesaire Pixar
PROBABILITE : 80% — commande recue

INTELLIGENCE :
- Pont direct entre BYSS GROUP et l'appareil municipal de la capitale
- An tan lontan = Operation Eveil qui commence sans dire son nom
- Commande ferme pour les 2 series — a closer

STATUT : Commande. A chiffrer.`,
    tags: ["prospect_intel", "fdf", "institution"],
  },

  // ═══════════════════════════════════════════════════════
  // CATEGORY: objection — Nouvelles objections Sorel
  // Source: LE_COURANT_CARAIBE.md
  // ═══════════════════════════════════════════════════════

  {
    universe: "bible",
    category: "objection",
    title: "Objection : Vous avez des references ?",
    content: `REPONSE (transparence = strategie) :
"Pas encore de clients en tant que BYSS GROUP. Voici mon experience personnelle : BeeCee, Wizzee, GoodCircle — 31 campagnes Google Ads, multi-territoire (MQ, GP, GF, REU). CPM 0.59€ vs 5-15€ industrie.

Et voici une video faite pour vous GRATUITEMENT, en 48h, pour prouver ce que je sais faire."

La preuve remplace la reference. La video gratuite brise l'inertie. La transparence en MQ est une arme parce que PERSONNE ne l'utilise.`,
    tags: ["objection", "references", "transparence"],
  },

  {
    universe: "bible",
    category: "objection",
    title: "Objection : Je vais reflechir / pas le bon moment",
    content: `REPONSE (Sun Tzu — cout de l'inaction) :
Ne pas pousser. L'inertie est l'ennemi invisible. Le "je vais reflechir" est le bouclier #1 du prospect martiniquais.

TECHNIQUE : Ne pas argumenter. Deposer un asset. "Pas de souci. En attendant, je vous laisse cette video que j'ai preparee pour vous. Aucun engagement. Quand vous serez pret, on en reparle."

La video gratuite reste dans son esprit. Il la montre a son associe. L'associe dit "dingue." Le prospect rappelle.

DELAI CRM : Ne pas relancer a J+3 (cycle metro). Relancer a J+14 (temps creole).`,
    tags: ["objection", "inertie", "temps_creole"],
  },

  {
    universe: "bible",
    category: "objection",
    title: "Objection : L'IA ca fait peur / c'est pas pour nous",
    content: `REPONSE (demystification) :
"L'IA ne remplace personne dans votre equipe. Elle accelere ce que vous faites deja. Votre chef fait la cuisine — l'IA fait la video de sa cuisine. Votre equipe accueille les clients — le chatbot repond a 22h quand votre equipe dort."

TECHNIQUE : Ne JAMAIS commencer par la technique. Commencer par le resultat : "Imaginez que demain, un touriste a Paris tape 'restaurant Martinique' et votre video apparait en premier."

L'IA n'est pas le sujet. Le resultat est le sujet.`,
    tags: ["objection", "peur_ia", "demystification"],
  },

  // ═══════════════════════════════════════════════════════
  // CATEGORY: pricing — Scripts de presentation prix
  // Source: LE_COURANT_CARAIBE.md, PROPOSITION_DIGICEL.md
  // ═══════════════════════════════════════════════════════

  {
    universe: "bible",
    category: "pricing",
    title: "Script presentation 3 options — Comment presenter le prix",
    content: `SEQUENCE DE PRESENTATION :
1. Commencer par Domination (le plus cher) — ancrage haut
2. Puis Essentiel (le moins cher) — trop basique, le prospect sent le manque
3. Finir sur Croissance (recommandee) — le sweet spot se presente comme une evidence

PHRASES :
"L'option Domination, c'est le full package. Dashboard live, rapport mensuel, fine-tuning. C'est ce que prennent les grands comptes."
"L'option Essentiel, c'est l'entree de gamme. Ca marche, mais sans monitoring."
"Honnement ? La plupart choisissent Croissance. C'est le meilleur rapport qualite/investissement."

NUDGE THALER : Pre-selectionner Croissance. "Recommande" ecrit a cote. Le status quo bias fait le reste.`,
    tags: ["pricing", "script", "3_options"],
  },

  {
    universe: "bible",
    category: "pricing",
    title: "ROI par vertical — Calculer le retour devant le prospect",
    content: `HOTEL : "Booking prend 15-18% sur 2-4M€/an = 300-720K€/an de commissions. Notre option a 54K€ aide a recuperer 10% = 30-72K€ d'economie. ROI positif mois 1."

TELECOM : "Votre CPA est a combien ? 15€ ? Avec nos videos, le CPA descend a 5-8€. Sur 10 000 conversions/an = 70-100K€ d'economie. Le contrat se paie 3x."

RHUM : "Le marche premium +8%/an. 1 bouteille a 50€ vendue via e-com au Japon = marge 80%. 100 bouteilles/mois = 48K€/an de CA additionnel."

EXCURSION : "0 site booking = chaque reservation passe par telephone. 1 site + Google Ads = 30% de reservations en plus. Sur 500K€ de CA = 150K€ de croissance."

RESTAURANT : "1 video virale = 200 couverts supplementaires en 1 mois. A 35€ de ticket moyen = 7 000€. La video a coute 500€."`,
    tags: ["pricing", "roi", "vertical"],
  },

  // ═══════════════════════════════════════════════════════
  // CATEGORY: case_study — Artistes & credibilite culturelle
  // Source: PIPELINE_BYSS_GROUP.md
  // ═══════════════════════════════════════════════════════

  {
    universe: "bible",
    category: "case_study",
    title: "Case study — Evil P (adoube par Booba)",
    content: `ARTISTE : Evil P (Evil Pichon), rappeur trap martiniquais, 10+ ans de carriere
CONNEXION BOOBA : Choisi pour AD VITAM AETERNAM (2024)
COLLAB : Tiitof "Ki mannyere" — 2M vues YouTube
COLLECTIF : TMG (Thug Music Group) avec Mercenaire, Shin, Bruce Little

ROLE BYSS GROUP : Voix d'Evil Tik dans MOOSTIK + clip. Adoubement de la scene trap antillaise.

IMPACT COMMERCIAL : Quand un prospect demande "Vous travaillez avec qui ?", repondre "Evil P (AD VITAM AETERNAM de Booba), Krys (Olympia), Martinique 1ere." La credibilite est immediate.`,
    tags: ["case_study", "artiste", "evil_p"],
  },

  {
    universe: "bible",
    category: "case_study",
    title: "Case study — Krys (Olympia, Zenith, 218K FB)",
    content: `ARTISTE : Krys (Pedro Pirbakas), dancehall guadeloupeen
PALMARES : Premier artiste dancehall francophone a remplir l'Olympia (2006). Zenith de Paris 2007. 8 000 au Stade des Abymes.
LABEL : Step Out — producteur de Colonel Reyel (double disque de Platine, 250K albums)
FORMATION : ESC Montpellier, major de promotion. Stage chez Publicis. JT France 2.
AUDIENCE : 218 329 likes Facebook. 8 albums. "Meilleur Artiste Caribeen" Afroca Music Awards 2016.

ROLE BYSS GROUP : Le roi du dancehall antillais commande un clip. Validation au plus haut niveau. Proof point pour tout prospect grand public.`,
    tags: ["case_study", "artiste", "krys"],
  },

  // ═══════════════════════════════════════════════════════
  // CATEGORY: pitch — Stanford Design Thinking
  // Source: LE_COURANT_CARAIBE.md
  // ═══════════════════════════════════════════════════════

  {
    universe: "bible",
    category: "pitch",
    title: "Methode Stanford — Design Thinking applique a la vente BYSS",
    content: `5 etapes de Stanford (d.school) = sequence de vente BYSS GROUP :

1. EMPATHIZE : Manger au restaurant. Prendre le catamaran. Visiter la distillerie. VIVRE l'experience du client avant de proposer quoi que ce soit. Ajouter une section "EXPERIENCE TERRAIN" dans chaque dossier prospect.

2. DEFINE : Le probleme n'est pas "ils n'ont pas de video." Le probleme est "le touriste qui hesite entre eux et le concurrent choisit le concurrent parce qu'il a VU le concurrent en video."

3. IDEATE : Les 7 services sont predefinis mais le prospect a peut-etre besoin d'autre chose. Un plan de table interactif. Un drone sous-marin. Un filtre Instagram personnalise. L'ideation reste OUVERTE.

4. PROTOTYPE : La video gratuite EST le prototype. Aller plus loin : maquette site en 30min, brief Google Ads 1 page, chatbot 5 questions simulees. 4 prototypes en 30 minutes.

5. TEST : Feedback loop. Combien de vues ? Quels retours ? Le prospect recommande-t-il ? Si oui, design valide.`,
    tags: ["pitch", "stanford", "design_thinking"],
  },

  {
    universe: "bible",
    category: "pitch",
    title: "Le fondateur 10x — Harvard 2026 applique a BYSS",
    content: `Harvard 2026 : l'annee du fondateur 10x. Des fondateurs qui operent avec une velocite et une productivite dix fois superieures. Ils utilisent les outils IA non pas pour automatiser mais pour ACCELERER L'APPRENTISSAGE.

Gary EST le fondateur 10x. Un homme qui produit ce qu'une agence de 10 ferait.

APPLICATION : Le premier mois de BYSS GROUP n'est PAS un mois de vente. C'est un mois d'APPRENTISSAGE ACCELERE. Chaque RDV, chaque refus = un DATA POINT. L'agent capture : "le prospect a fronce les sourcils quand j'ai dit 42K€." "Le prospect a demande si la video pouvait inclure du creole." "Le prospect ne savait pas ce qu'etait un agent IA."

Apres 10 RDV, Gary saura EXACTEMENT ce que le marche veut. Pas ce que les fichiers disent. Ce que le TERRAIN dit.`,
    tags: ["pitch", "harvard", "fondateur_10x"],
  },

  // ═══════════════════════════════════════════════════════
  // CATEGORY: vertical — Location auto (nouveau)
  // Source: PIPELINE_BYSS_GROUP.md prospect list
  // ═══════════════════════════════════════════════════════

  {
    universe: "bible",
    category: "vertical",
    title: "Vertical Location auto — Europcar Jumbo, Sixt MCR",
    content: `CIBLES : Europcar Jumbo (via GBH, 15K€), Sixt MCR (10K€)

PAIN COMMUN :
- Guerre des prix entre loueurs
- Sites web generiques, pas de contenu local
- Le touriste choisit le moins cher car aucun loueur ne se differencie visuellement

STRATEGIE :
- Europcar via GBH (contrat cadre, 3 entites d'un coup)
- Sixt MCR : "Vos voitures roulent dans le plus beau paysage des Antilles. Mais votre site montre des photos generiques."

SERVICES : video_ia, google_ads
PANIER MOYEN : 12.5K€`,
    tags: ["vertical", "location_auto"],
  },

  // ═══════════════════════════════════════════════════════
  // CATEGORY: process — Fiche de poche & cas zero
  // Source: LE_COURANT_CARAIBE.md
  // ═══════════════════════════════════════════════════════

  {
    universe: "bible",
    category: "process",
    title: "Fiche de poche — Format 1 page A5 par prospect",
    content: `La Bible de vente est trop longue pour un RDV. Gary a besoin d'une FICHE DE POCHE par prospect.

FORMAT A5 RECTO :
- Nom de l'entreprise
- Nom du decideur
- Douleur en 1 ligne
- Prix (3 options en 1 ligne : "4.5K / 52K / 101K")
- Phrase d'accroche
- Phrase de closing

C'est tout. Le reste Gary le sait. 35 fiches de poche = 35 prospects = 1 pochette dans la voiture.`,
    tags: ["process", "fiche_poche", "terrain"],
  },

  {
    universe: "bible",
    category: "process",
    title: "Strategie cas zero — MIZA comme prototype",
    content: `MIZA = le client portfolio. 783 avis 4.8 etoiles. Entrepot transforme en gastro. Chef Christophe.

SEQUENCE :
1. Reserver une table chez MIZA
2. Manger (empathie Stanford)
3. Parler au chef
4. Produire la video comme cas zero (gratuit ou prix coutant)
5. Utiliser cette video pour closer les 65 autres restos de la base

LA VIDEO MIZA VEND LES 65 AUTRES RESTOS. C'est le champignon porteur de spores du mycelium. Le chef publie. Les restos voisins voient. Les spores volent. Le reseau s'etend.

CALCUL : 1 video gratuite > 10 clients restos > 75K€ de pipeline. ROI infini.`,
    tags: ["process", "cas_zero", "miza"],
  },

];

// ─────────────────────────────────────────────────────────
// SEED EXECUTION — INSERT ONLY (no delete)
// ─────────────────────────────────────────────────────────

async function seed() {
  console.log("=== BIBLE DE VENTE V2 — Seeding NEW entries ===\n");

  // Check current count
  const { count, error: countErr } = await supabase
    .from("lore_entries")
    .select("id", { count: "exact", head: true })
    .eq("universe", "bible");

  if (countErr) {
    console.error("Connection error:", countErr.message);
    process.exit(1);
  }

  const startIndex = count ?? 0;
  console.log(`Existing bible entries: ${startIndex}`);
  console.log(`New entries to add: ${entries.length}\n`);

  // Insert in batches of 10
  const batchSize = 10;
  let inserted = 0;

  for (let i = 0; i < entries.length; i += batchSize) {
    const batch = entries.slice(i, i + batchSize).map((e, idx) => {
      const { tags, ...rest } = e;
      return {
        ...rest,
        tags: tags || [],
        word_count: rest.content ? rest.content.split(/\s+/).length : 0,
        order_index: startIndex + i + idx,
      };
    });

    const { error } = await supabase.from("lore_entries").insert(batch);
    if (error) {
      console.log(`Batch ${Math.floor(i / batchSize) + 1} error: ${error.message}`);
    } else {
      inserted += batch.length;
      console.log(`  Batch ${Math.floor(i / batchSize) + 1}: ${batch.length} inserted`);
    }
  }

  // Summary
  console.log(`\n=== DONE: ${inserted}/${entries.length} new entries seeded ===`);
  console.log(`Total bible entries now: ${startIndex + inserted}\n`);

  const cats = {};
  entries.forEach((e) => {
    cats[e.category] = (cats[e.category] || 0) + 1;
  });
  console.log("New entries breakdown:");
  for (const [k, v] of Object.entries(cats).sort()) {
    console.log(`  ${k}: ${v}`);
  }
}

seed();
