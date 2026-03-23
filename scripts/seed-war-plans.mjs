import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";

// Load env
const envContent = readFileSync(".env.local", "utf8");
const env = {};
for (const line of envContent.split("\n")) {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) env[match[1].trim()] = match[2].trim();
}

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

// ─────────────────────────────────────────────────────────
// WAR PLANS, DEFENSE, GOVERNANCE — 18 lore entries
// Source: Operation Eveil — 03_operations, 05_defense, 06_gouvernance
// universe='bible'
// ─────────────────────────────────────────────────────────

const entries = [

  // ═══════════════════════════════════════════════════════
  // CATEGORY: war_plan — Orion
  // ═══════════════════════════════════════════════════════

  {
    universe: "bible",
    category: "war_plan",
    title: "Plan de guerre ORION — Vue generale",
    content: `De 0 EUR a la plus grande plateforme de marketing IA au monde. Classification SSS.

Le marketing digital mondial pese 680 milliards de dollars en 2025. 90 agents IA peuvent faire 24h/24 ce que des millions d'humains font manuellement, pour 99 EUR/mois. Orion ne vend pas un outil. Orion vend le remplacement d'une agence entiere.

USP : 90 marketeurs IA. Payez pour un.

Etat des forces : 90+ agents IA specialises, 24 integrations plateformes, CMO Unifie avec 37 outils et mode LangGraph, IA creative integree (Flux 2, Omni Human 1.5), Pricing valide (Free, 99, 249, 449, Enterprise), Architecture PWA mobile-first, 159 MB de TypeScript. Score : Architecture 9/10. Operationnel 5/10. Commercial 0/10.`,
    metadata: {
      classification: "SSS",
      author: "Kael",
      date: "2026-03-14",
      source: "PLAN_DE_GUERRE_ORION.md",
    },
  },

  {
    universe: "bible",
    category: "war_plan",
    title: "Plan de guerre ORION — 5 phases",
    content: `Phase 0 STABILISATION (J0-J14) : Orion tourne sans crash 72h. Audit, Sentry, health check, fix CORS. Critere : Gary connecte Google Ads et obtient un rapport CMO fonctionnel.

Phase 1 PREMIER SANG (J14-J30) : 1 client payant a 99 EUR/mois. Gary = premier client via Wizzee/GoodCircle. Premiere case study. Le pitch : J'ai construit un outil qui fait en 3 minutes ce que je fais en 3 heures.

Phase 2 LANDING PAGE (J14-J21, parallele) : Above the fold : Votre agence marketing coute 5 000 EUR/mois. Orion coute 99 EUR. 90 agents IA. 24 plateformes. 0 conge. HTML/CSS simple, Vercel, < 2s chargement.

Phase 3 ACQUISITION (J30-J90) : 50 clients, MRR 5 000+ EUR. 5 canaux : Meta Ads (500 EUR/mois, 20 conversions), LinkedIn (1 000 followers en 60j), Product Hunt (Top 5), Communautes, Affiliation (30% commission).

Phase 4 EXPANSION (J90-J180) : 200 clients, MRR 30 000 EUR. Meta Ads complet, dashboard, rapports PDF, API, premier dev freelance. Pont Martinique : 5 entreprises locales en essai 90 jours.

Phase 5 DOMINATION (J180-J365) : 1 000 clients, MRR 150 000 EUR, ARR 1.8M EUR. Levee seed 2-5M EUR. Moat : donnees (milliards de data points), 90 agents vs 5-10 concurrents, 24 integrations, marque Orion = CMO IA. Pivot Enterprise white-label 2 000-10 000 EUR/mois.`,
    metadata: {
      phases: 5,
      target_clients: 1000,
      target_arr: "1.8M EUR",
      timeline: "12 mois",
      source: "PLAN_DE_GUERRE_ORION.md",
    },
  },

  {
    universe: "bible",
    category: "war_plan",
    title: "Plan de guerre ORION — Calendrier et budget",
    content: `Calendrier :
Mars 2026 — Phase 0 : Stabilisation (Claude Code sprint)
Avril 2026 — Phase 1+2 : Premier client + Landing page
Mai-Juin — Phase 3 : Acquisition (50 clients, 5K MRR)
Juillet-Sept — Phase 4 : Expansion (200 clients, 30K MRR)
Oct-Dec — Phase 5 : Domination (1000 clients, 150K MRR)
2027 — L'Empire (international, Serie A)

Budget :
Phase 0-1 : ~270 EUR/mois (finance par Wizzee/GoodCircle)
Phase 2-3 : ~900 EUR/mois (Wizzee/GC + premiers clients)
Phase 4 : ~4 800 EUR/mois (Revenus Orion 30K MRR)
Phase 5 : ~15 000 EUR/mois (Revenus Orion 150K MRR)

Decision critique : Orion = P0 absolu pendant 6 mois. Pas P0 parmi d'autres P0. Le seul P0. Tous les autres temples en veille.`,
    metadata: {
      source: "PLAN_DE_GUERRE_ORION.md",
    },
  },

  // ═══════════════════════════════════════════════════════
  // CATEGORY: war_plan — MOOSTIK
  // ═══════════════════════════════════════════════════════

  {
    universe: "bible",
    category: "war_plan",
    title: "Plan de guerre MOOSTIK — Vue generale",
    content: `De 349K vues a bras culturel de la campagne. Classification SS.

MOOSTIK est la plus grosse arme culturelle de l'arsenal. 349 183 vues, 11 486 likes, 876 saves, 1 611 followers gagnes sur un seul teaser. Martinique 1ere veut diffuser. BIXA (Fort-de-France) partenaire.

MOOSTIK n'est pas un projet video. C'est un cheval de Troie. La serie qui entre dans les foyers martiniquais, y installe un imaginaire de souverainete culturelle, et prepare le terrain pour l'Operation Eveil — sans jamais dire son nom.

Voix confirmee : Evil P (Evil Pichon) — Evil Tik. S1E1 annonce 1er fevrier 2026.`,
    metadata: {
      classification: "SS",
      views: 349183,
      likes: 11486,
      author: "Kaiou",
      date: "2026-03-19",
      source: "PLAN_DE_GUERRE_MOOSTIK.md",
    },
  },

  {
    universe: "bible",
    category: "war_plan",
    title: "Plan de guerre MOOSTIK — 4 phases",
    content: `Phase 0 PREMIER EPISODE (J0-J14) : Sortir S1E1 (3-5 min). Integrer voix Evil P. Lancement Instagram (teaser 15s, episode complet, behind-the-scenes). Critere : 100K vues en 7 jours.

Phase 1 REGULARITE (J14-J90) : 6 episodes sortis. 1 episode toutes les 2 semaines = 26 episodes/an. Production : Gary + SOTAI (Rony, Stephane, Thomas). Outils : Kling, Seedance, NBP, Suno. Contact formel Martinique 1ere.

Phase 2 DIFFUSION BROADCAST (J90-J180) : MOOSTIK sur Martinique 1ere. Format 5 min, case horaire jeunesse ou access prime. Licence non exclusive. YouTube en parallele + TikTok + podcast audio (Spotify, Apple).

Phase 3 FRANCHISE (J180-J365) : MOOSTIK devient une marque. Merchandising (t-shirts, figurines, stickers), jeu mobile, partenariats (Digicel sponsor, Air Caraibes diffusion en vol), extension regionale (Guadeloupe, Guyane, Haiti), Festival MOOSTIK a Fort-de-France.

Modele economique an 1 : 30 000-80 000 EUR (droits M1ere 1-3K/ep, YouTube 500-2K/mois, sponsoring Digicel 5-15K/saison, merchandising 2-5K/mois, CTM 10-30K/saison).`,
    metadata: {
      phases: 4,
      revenue_year1: "30000-80000 EUR",
      source: "PLAN_DE_GUERRE_MOOSTIK.md",
    },
  },

  // ═══════════════════════════════════════════════════════
  // CATEGORY: war_plan — Random
  // ═══════════════════════════════════════════════════════

  {
    universe: "bible",
    category: "war_plan",
    title: "Plan de guerre RANDOM — Vue generale",
    content: `De 495 users a machine a briser les castes. Classification SS.

Random est le Dernier Bal en mode app. 5 inconnus. 1 bar. Pas de profil. Pas d'algorithme. Le hasard et la geographie. Le lendemain, le chat se ferme. Mais la rencontre a eu lieu.

En Martinique, Random est une arme politique qui ne dit pas son nom. Un beke, un noir du Robert, un metropolitain, un indien de Saint-Pierre, un fonctionnaire du Lamentin — groupes par le hasard un vendredi soir. L'anti-bulle. L'anti-caste.

Metriques : 495 sign-ups, 2 981 EUR budget Meta Ads, 1 487 037 impressions, 638 785 personnes uniques, CPC 0.12 EUR (4-16x sous la moyenne), cout/sign-up 1.69 EUR (3-9x sous benchmark).`,
    metadata: {
      classification: "SS",
      signups: 495,
      cpc: "0.12 EUR",
      author: "Kaiou",
      date: "2026-03-19",
      source: "PLAN_DE_GUERRE_RANDOM.md",
    },
  },

  {
    universe: "bible",
    category: "war_plan",
    title: "Plan de guerre RANDOM — 4 phases",
    content: `Phase 0 PREMIERE RENCONTRE (J0-J30) : 1 rencontre reelle. 5 personnes. 1 bar. 1 soir. Documente. Identifier un bar a Fort-de-France, selectionner 5 users manuellement, documenter (photos, temoignages, video 30s).

Phase 1 RYTHME (J30-J90) : 1 rencontre/semaine. 20 rencontres. 100 personnes touchees. 3-5 bars partenaires (FdF, Le Lamentin, Le Robert). Activation automatique : match mercredi, notif jeudi, rencontre vendredi. Passage RCI Pepites. Objectifs J90 : 2 000 sign-ups, 20 rencontres, 100 participants, 30% taux de retour.

Phase 2 MEDIATISATION (J90-J180) : Random devient phenomene martiniquais. Couverture M1ere. 10 temoignages video. Random Night (50 personnes, 10 groupes, 1 lieu). Extension communes (Le Francois, Trinite, Saint-Pierre, Sainte-Anne). Data documentee sur fractures sociales.

Phase 3 EXPORT (J180-J365) : Guadeloupe + Guyane. 10 000 users. Modele : 1 EUR/participant/rencontre = 20 000 EUR/mois + partenariats bars 500-1 000 EUR/mois + sponsoring 2 000-5 000 EUR/mois. Total potentiel : 22 500-26 000 EUR/mois.`,
    metadata: {
      phases: 4,
      target_users: 10000,
      source: "PLAN_DE_GUERRE_RANDOM.md",
    },
  },

  // ═══════════════════════════════════════════════════════
  // CATEGORY: proposal — Digicel
  // ═══════════════════════════════════════════════════════

  {
    universe: "bible",
    category: "proposal",
    title: "Proposition Digicel — 72 videos/an",
    content: `Production video IA — 72 videos/an, 2 marques (Digicel + Digicel Business). Contact : Victor Despointes (WITH-YOU).

Digicel = position #2 derriere Orange Caraibe en Martinique. Post-Chapter 11 (restructuration 2020-2024). Besoin de contenu video massif sur 4 canaux.

Option A Pack Annuel Standard : 72 videos/an (6/mois), 3 formats (9:16, 16:9, 1:1), 15-60s, 625 EUR HT/video, total 45 000 EUR HT/an, 3 750 EUR HT/mois.
Option B Pack Premium : 72 videos + 12 videos longues (1-3 min), direction artistique incluse, 63 000 EUR HT/an, 5 250 EUR HT/mois.
Option C Trimestre Test : 18 videos en 3 mois, 750 EUR HT/video, 13 500 EUR HT total.

Recommandation : Option C (test) puis basculement vers Option A. Delta 125 EUR x 72 = 9 000 EUR/an d'economie incite au contrat annuel.`,
    metadata: {
      client: "Digicel",
      intermediary: "Victor Despointes (WITH-YOU)",
      annual_value: "45000-63000 EUR HT",
      source: "PROPOSITION_DIGICEL.md",
    },
  },

  {
    universe: "bible",
    category: "proposal",
    title: "Proposition Digicel — Track record et avantages",
    content: `Track record BYSS GROUP :
- MOOSTIK : 349 183 vues, 11 486 likes, M1ere interessee
- Warcraft Cadifor (Google Ads) : 147 825 impressions, 11.30% interaction, CPM 0.59 EUR
- X-Man (clip video IA) : 5 655 likes
- Random (Meta Ads) : 495 sign-ups, CPC 0.12 EUR
- Wizzee : client actif, campagnes Google + Meta

Avantage competitif :
- Production IA : 3-5x plus rapide qu'une production classique
- Cout : 50-70% moins cher (pas de tournage, pas de comediens, pas de location)
- Reactivite : livraison 48-72h/video (vs 2-4 semaines)
- Scalabilite : 6 videos/mois aujourd'hui, 20/mois demain

Inclus : integration rushs, motion design, generation IA (Kling, Seedance, NBP), musique (Suno), declinaisons 3 formats, 2 allers-retours/video.`,
    metadata: {
      source: "PROPOSITION_DIGICEL.md",
    },
  },

  // ═══════════════════════════════════════════════════════
  // CATEGORY: defense — Attaques previsibles
  // ═══════════════════════════════════════════════════════

  {
    universe: "bible",
    category: "defense",
    title: "Attaques previsibles — 10 scenarios et ripostes",
    content: `1. Trop jeune → Leopold a 57 ans quand il est devenu depute. Gary aura 36 en 2028. Letchimy 73, Marie-Jeanne 85. Le vieillissement de la classe politique EST le probleme.
2. Pas d'experience politique → 14 000 heures de gestion dynastique. 997 pages de lore. L'experience traditionnelle a produit 40 homicides et +40% de vie chere.
3. Geek / jeux video → Le numerique est l'arme du XXIe siecle. Le geek comprend le monde qui vient.
4. Encore un Bissol → La dynastie est une force, pas un reproche.
5. Utilise l'IA → Oui, comme arme. Les autres ne savent meme pas ce qu'est l'IA.
6. Vit en metropole → 972 dans le sang, pas seulement dans le code postal. Le retour est un acte politique.
7. Pas d'argent / pas de reseau → Les campagnes modernes se gagnent avec des idees et du numerique. Budget public, chaque euro trace.
8. Independantiste deguise → Souverainete fonctionnelle ≠ independance juridique. On ne change pas le statut, on change le modele.
9. Les bekes vont le bloquer → GBH 5Md CA mais Martinique = 16%. On ne combat pas GBH, on le rend moins indispensable.
10. Attaques personnelles → Transparence. Repos ouverts. Textes signes.

Principes MODE_CADIFOR : Ne jamais se justifier. Repondre par une mesure. Humour. Donnees. Creole quand ca brule. Silence quand c'est sage.`,
    metadata: {
      scenarios: 10,
      source: "attaques_previsibles.md",
    },
  },

  {
    universe: "bible",
    category: "defense",
    title: "Defense mediatique — Scenarios et protocoles",
    content: `Scenarios mediatiques :
1. Interview hostile (M1ere, RCI) → 3 phrases-cles apprises par coeur. Regle : ne jamais se justifier. 3 simulations avant toute apparition TV.
2. Reportage a charge (France-Antilles, Bondamanjak) → Pas de reponse dans les 24h. Repondre par un acte (poster une video MOOSTIK). Silence souverain.
3. Fuite strategique → Compartimenter l'information. Signal uniquement. Accepter que ca arrivera.
4. Viralite negative → Toujours filmer en integralite. Publier la version complete. Communaute de soutien prete.

Matrice risque :
- Interview hostile : Probabilite CERTAINE, Impact MOYEN → Simulations d'entrainement
- Article a charge : Probabilite PROBABLE, Impact FAIBLE → Protocole silence + acte
- Fuite interne : Probabilite POSSIBLE, Impact MOYEN → Compartimentage
- Deepfake/manipulation : Probabilite FAIBLE, Impact FORT → Empreinte de reference`,
    metadata: {
      source: "attaques_mediatiques_coalitions.md",
    },
  },

  {
    universe: "bible",
    category: "defense",
    title: "Defense coalitions — Scenarios politiques",
    content: `Scenarios de coalition :
1. PPM + MIM s'allient → Probabilite faible (ils se detestent). Parade : positionnement ni gauche ni droite. Publier les bilans chiffres des DEUX camps. S'ils s'allient, c'est la preuve qu'on est la menace.
2. Candidat jeune/tech copie → Probabilite moyenne. Parade : execution = barriere. Orion 159 MB, Byss Emploi seul MCP, MOOSTIK 349K. 2 ans d'avance. Accueillir, pas combattre.
3. Conconne rejoint ou attaque → Si rejoint : bienvenue, mais pas de co-direction. Si attaque : ne jamais combattre frontalement. Respecter, esquiver, depasser.
4. Bekes financent un candidat contre nous → Probabilite elevee. Parade : transparence totale open data. GBH ne controle pas les urnes.
5. Etat central intervient → Probabilite faible. Discours limpide : on ne change pas le statut. Hub IA = interet national.

Principe directeur : la meilleure defense, c'est l'execution. Chaque video MOOSTIK, chaque client Orion, chaque rencontre Random, chaque ligne de code = un bouclier.`,
    metadata: {
      source: "attaques_mediatiques_coalitions.md",
    },
  },

  {
    universe: "bible",
    category: "defense",
    title: "Defense juridique — 5 risques et parades",
    content: `1. Financement de campagne (PRIORITE MAX) → Pare-feu total BYSS GROUP / Operation Eveil. Comptes de campagne separes, expert-comptable dedie. Chaque euro trace, publie en open data. Mandataire financier des la declaration. Un faux pas = elimination.

2. Responsabilite SAS → SAS = responsabilite limitee au capital. Assurance RC Pro a souscrire. CGV blindees. Pas de caution personnelle.

3. Propriete intellectuelle → Depot INPI MOOSTIK (urgent, la marque a de la valeur). Verification disponibilite Orion (nom courant). Depot code source APP. Git = preuve d'anteriorite.

4. Droit a l'image / IA → Jamais de generation IA de personnes reelles identifiables. Consentement ecrit (Evil P = contrat). Mention Contenu genere par IA sur chaque production.

5. RGPD → DPO designe (Gary initialement). Registre de traitements. Politique de confidentialite. Consentement explicite pour geolocalisation.`,
    metadata: {
      source: "attaques_juridiques_cyber.md",
    },
  },

  {
    universe: "bible",
    category: "defense",
    title: "Defense cyber — 5 risques et parades",
    content: `1. Doxxing → Adresse professionnelle ≠ personnelle. Reseaux sociaux personnels verrouilles. Aucune photo de famille sur comptes publics. Protocole OPSEC active.

2. Compromission de comptes (PRIORITE MAX) → 2FA sur TOUS les comptes (Yubikey recommande). Gestionnaire mots de passe (Bitwarden/1Password). Mots de passe uniques 20+ caracteres. Email de recuperation separe non public. GitHub : branch protection sur main, commits signes.

3. Deepfake contre Gary → Empreinte vocale/video de reference publiee et datee. Reponse immediate : C'est un deepfake, voici la preuve. Pre-positionnement mediatique. L'ironie : Gary maitrise l'IA mieux que ceux qui pourraient l'attaquer.

4. DDoS / defacement → Cloudflare (protection gratuite). Vercel (infra resiliente). Backups automatiques quotidiens. Pas de donnees critiques sur un seul serveur.

5. Fuite du repo operation-eveil → Repo GitHub PRIVE. 08_arcane gitignored + hook pre-commit. Pas de credentials dans le repo. Si fuite : la strategie est dans l'execution, pas dans le document.

Checklist securite : 2FA a verifier, gestionnaire MDP a verifier, repo prive OK, hook pre-commit installe, OPSEC documente, depot MOOSTIK INPI non fait, RC Pro non fait, pare-feu BYSS/Eveil documente.`,
    metadata: {
      source: "attaques_juridiques_cyber.md",
    },
  },

  // ═══════════════════════════════════════════════════════
  // CATEGORY: governance
  // ═══════════════════════════════════════════════════════

  {
    universe: "bible",
    category: "governance",
    title: "BYSS GROUP SAS — Structure juridique",
    content: `Forme juridique : Societe par Actions Simplifiee (SAS). Code NAF : 62.01Z — Programmation informatique. Date de fondation : 14 mars 2026. President : Gary Bissol.

Objet social : Intelligence artificielle, edition de logiciels, strategie marketing digital, production audiovisuelle numerique, conseil en systemes d'information et formation professionnelle en informatique.

Enregistrement via Legalstart — en verification juriste. Siege social et capital social a confirmer.`,
    metadata: {
      legal_form: "SAS",
      naf: "62.01Z",
      founded: "2026-03-14",
      president: "Gary Bissol",
      source: "structure_byss_group.md",
    },
  },

  {
    universe: "bible",
    category: "governance",
    title: "BYSS GROUP — Architecture des marques",
    content: `Architecture :
BYSS GROUP SAS (maison juridique)
├── ORION — Plateforme SaaS CMO IA, 90 agents, 24 plateformes. Abonnement 99-449 EUR/mois.
├── SOTAI — Collectif production video IA (Gary + Rony + Stephane + Thomas). Projets + packs annuels.
├── BYSS EMPLOI — Plateforme emploi AI-First, seul MCP France Travail. Freemium 0-299 EUR/mois.
├── RANDOM — App sociale. 5 inconnus, 1 bar. 1 EUR/utilisateur/session.
└── MOOSTIK — Serie animation IA. Droits de diffusion + sponsoring.

Organigramme mars 2026 : Gary Bissol = President / unique operateur (strategie, dev, production video, marketing digital, commercial, administration). Cercle operationnel non-salarie : Rony Gernidos, Stephane, Thomas (production SOTAI), Victor Despointes (intermediaire Digicel, WITH-YOU).

Organigramme cible Q3 2026 : Gary + 1 dev freelance (stabilisation Orion) + SOTAI (autonome) + expert-comptable externalise.`,
    metadata: {
      brands: ["Orion", "SOTAI", "Byss Emploi", "Random", "MOOSTIK"],
      source: "structure_byss_group.md",
    },
  },

  {
    universe: "bible",
    category: "governance",
    title: "BYSS GROUP — Propriete intellectuelle et regles",
    content: `Actifs PI :
- Code Orion (159 MB TypeScript) — BYSS GROUP SAS, non depose, depot APP recommande
- Code Byss Emploi — BYSS GROUP SAS, repo prive GitHub
- Senzaris (langage de programmation) — BYSS GROUP via Evren-Kairos, non depose
- MOOSTIK (marque + contenu) — Gary Bissol / BYSS GROUP, marque non deposee, INPI recommande
- Cadifor (lore, 997 pages) — Gary Bissol personne physique, droit d'auteur naturel
- Random (marque + concept) — BYSS GROUP SAS, non deposee

Actions prioritaires : Deposer MOOSTIK a l'INPI (urgent, 349K vues), deposer ORION INPI, depot code source APP, transfert PI de Gary vers BYSS GROUP.

Regles operationnelles : tout le code sur GitHub (Oshinsu), contrats au nom BYSS GROUP SAS, facturation 30 jours, 08_arcane classifie jamais sur GitHub public, Claude Code = outil dev principal.

SEPARATION ABSOLUE : BYSS GROUP = entreprise. Operation Eveil = projet politique personnel. Les deux ne facturent PAS ensemble. Les deux ne communiquent PAS ensemble. Pare-feu juridique et communicationnel indispensable.`,
    metadata: {
      source: "structure_byss_group.md",
    },
  },

  {
    universe: "bible",
    category: "governance",
    title: "BYSS GROUP — Prochaines etapes gouvernance",
    content: `Urgences :
1. Finaliser l'immatriculation (Legalstart → Kbis)
2. Ouvrir le compte bancaire professionnel

Priorite 1 :
3. Expert-comptable specialise startup/SaaS
4. Statuts definitifs

Priorite 2 :
5. Conditions d'entree au capital (si associes futurs)
6. Assurance RC Pro

Priorite 3 :
7. Pacte d'associes (si ouverture du capital pour la levee Phase 5 Orion)

15 temples sous un seul toit. Le toit a besoin de murs.`,
    metadata: {
      source: "structure_byss_group.md",
    },
  },
];


// ─────────────────────────────────────────────────────────
// UPSERT
// ─────────────────────────────────────────────────────────

async function main() {
  console.log(`\n⚔️  Seeding ${entries.length} war plan / defense / governance entries...\n`);

  let ok = 0;
  let fail = 0;

  for (const entry of entries) {
    const { metadata, ...clean } = entry;
    const row = { ...clean, tags: metadata ? Object.values(metadata).filter(v => typeof v === "string").slice(0, 3) : [], word_count: clean.content ? clean.content.split(/\s+/).length : 0, order_index: 0 };
    const { error } = await supabase.from("lore_entries").insert(row);

    if (error) {
      console.error(`  ✗ ${entry.title}: ${error.message}`);
      fail++;
    } else {
      console.log(`  ✓ [${entry.category}] ${entry.title}`);
      ok++;
    }
  }

  console.log(`\n━━━ Done: ${ok} inserted, ${fail} failed ━━━\n`);
}

main();
