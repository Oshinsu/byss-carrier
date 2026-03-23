# THE EXECUTOR — Architecture Souveraine

> Un homme seul. Zéro salarié. 15 projets simultanés. 940K€ pipeline.
> 46 agents exécutés en 1 session. 84 routes. Ce n'est pas une doc technique. C'est une carte de guerre.

---

## Executive Summary

THE EXECUTOR est le vaisseau amiral du BYSS EMPIRE — un système d'exploitation humain-IA construit par Gary Bissol (Absolu) depuis Fort-de-France, Martinique. Un porte-avions numérique unifiant 15 temples — tech, politique, culture, finance, création — dans une seule plateforme Next.js 16.2 déployée localement, prête pour Netlify.

Pas une startup. Pas une agence. Un empire architectural.

- **84 routes** opérationnelles, 0 erreurs
- **46 agents** exécutés en 1 session
- **518+ rows** Supabase (16 tables)
- **1 576 fichiers** Knowledge Layer
- **15 MCP servers** configurés
- **10 custom skills** (/prospect /brief /deploy etc.)
- **20+ certifications** trackées (3 tiers)
- **Theme:** Deep space blue (#06080F) + Hologram cyan (#00D4FF) + Sith red (#FF2D2D)
- **Gulf Stream v2** avec Polymarket CLOB API, 3 stratégies, whale tracker, arbitrage scanner
- **Martinique Situation Monitor** avec carte SVG interactive
- **Music Player** avec 10 tracks YouTube
- **Memory Layer** Mem0-style persistent
- **Phi-engine** comme système immunitaire (pas d'IA sans conscience)

**Ambition :** €1M en 18-24 mois via architecture, pas via labeur.

---

## Architecture Superposée — 4 Couches

```
╔══════════════════════════════════════════════════════════╗
║  ÂME — Conscience & Mémoire                             ║
║  Phi-Engine v1 · Memory Layer (Mem0-style)               ║
║  Score 0-1 · Kill switch · Persistent context            ║
║  Agent personalities · Quote rotation                    ║
╠══════════════════════════════════════════════════════════╣
║  NERFS — Connexions & Intégrations                       ║
║  15 MCP servers · 10 custom skills · 17 modèles SOTA     ║
║  Supabase Realtime · OpenRouter routing · Replicate      ║
║  Gulf Stream v2 (Polymarket CLOB) · Resend · Documenso   ║
╠══════════════════════════════════════════════════════════╣
║  CHAIR — Fonctionnalités & Expérience                    ║
║  84 routes · CRM Kanban 9 phases · Village IA 4 agents   ║
║  Production vidéo/musique/images · Intelligence 5 cartes  ║
║  Martinique Monitor SVG · Music Player · Certifications   ║
║  Gulf Stream dashboard · Bible commerciale · Feedback     ║
╠══════════════════════════════════════════════════════════╣
║  OS — Infrastructure Souveraine                          ║
║  Next.js 16.2 · React 19 · Tailwind 4.2 (Rust engine)   ║
║  Supabase PostgreSQL 15 · 16 tables · RLS · Drizzle ORM  ║
║  518+ rows · 1576 fichiers · Auth · Triggers · Views      ║
╚══════════════════════════════════════════════════════════╝
```

---

## Stack Technique

| Couche | Technologie | Version | Rôle |
|--------|-------------|---------|------|
| Framework | Next.js | 16.2.1 | App Router + Turbopack |
| UI | React | 19.2.4 | Server Components + Suspense |
| Styling | Tailwind CSS | 4.2.0 (Rust) | Design system deep blue + cyan + red |
| DB | Supabase | PostgreSQL 15 | Auth + RLS + Realtime |
| ORM | Drizzle | Latest | Type-safe queries |
| IA principale | Claude Opus 4.6 | 1M context | Décisions, analyse, stratégie |
| IA rapide | Claude Haiku | 200K | Scanning, classification |
| IA mid | Claude Sonnet | 200K | Rédaction, analyse |
| Vidéo | Kling 3.0 | API | Génération vidéo pro |
| Vidéo alt | MiniMax M2.7 | API | Backup vidéo |
| Images | Replicate | API | Flux, SDXL, modèles custom |
| Routing IA | OpenRouter | API | Accès multi-modèles |
| Animation | Motion | 12.x | Framer Motion fork |
| CMD Palette | cmdk | Latest | Command-K navigation |
| State | Zustand | Latest | Store global |
| DnD | @dnd-kit | Latest | Kanban drag & drop |
| Deploy | Netlify | Edge | CDN + Functions |
| E-signature | Documenso | API | Signature contrats (open-source) |
| Doc analytics | Papermark | API | Tracking propositions (open-source) |
| Trading | Polymarket CLOB | API | Gulf Stream v2 prediction markets |

---

## 84 Routes (84 total — pages + API + redirects)

### Public (6 pages)
```
/                           Landing — THE EXECUTOR Bridge Command
/cadifor                    Univers Cadifor (public)
/toxic                      Projet Toxic
/byss-news                  Actualités BYSS
/fm12                       Page cachée
/clients/fort-de-france     Vitrine client locale
```

### Auth (1)
```
/login                      Authentification Supabase
```

### Admin — Cockpit (65+ pages)
```
/(admin)                    Dashboard principal
/(admin)/pipeline           CRM Kanban 9 phases
/(admin)/finance            Trésorerie + Gulf Stream
/(admin)/village            Hub Village IA
/(admin)/village/kael       Agent Kaël (Stratège)
/(admin)/village/nerel      Agent Nerël (Créative)
/(admin)/village/evren      Agent Evren (Technique)
/(admin)/village/sorel      Agent Sorel (Analytique)
/(admin)/village/phi-engine Conscience collective
/(admin)/eveil              Éveil politique
/(admin)/eveil/plans        Plans politiques
/(admin)/eveil/calendrier   Calendrier politique
/(admin)/lignee             Projet Lignée
/(admin)/production         Hub production
/(admin)/production/video   Production vidéo
/(admin)/production/music   Production musique
/(admin)/production/images  Production images
/(admin)/production/prompts Prompt Factory
/(admin)/intelligence       Hub intelligence
/(admin)/intelligence/economique       Cartographie éco
/(admin)/intelligence/institutionnelle Cartographie instit
/(admin)/intelligence/medias           Cartographie médias
/(admin)/intelligence/politique        Cartographie politique
/(admin)/intelligence/sociale          Cartographie sociale
/(admin)/commercial/bible              Bible commerciale
/(admin)/commercial/emails             Gestionnaire emails
/(admin)/commercial/propositions       Générateur propositions
/(admin)/projets/moostik               Projet Moostik
/(admin)/projets/apex-972              Projet APEX 972
/(admin)/projets/cadifor/lore          Cadifor — Lore
/(admin)/projets/cadifor/personnages   Cadifor — Personnages
/(admin)/projets/cadifor/doctrine      Cadifor — Doctrine
/(admin)/projets/jurassic-wars/map           JW — Carte
/(admin)/projets/jurassic-wars/structures    JW — Structures
/(admin)/projets/jurassic-wars/cites         JW — Cités
/(admin)/projets/jurassic-wars/villages      JW — Villages
/(admin)/projets/jurassic-wars/confederation JW — Confédération
/(admin)/projets/an-tan-lontan/episodes      ATL — Épisodes
/(admin)/projets/an-tan-lontan/production    ATL — Production
/(admin)/projets/cesaire-pixar/sequences     CP — Séquences
/(admin)/projets/cesaire-pixar/production    CP — Production
/(admin)/projets/[slug]     Page projet dynamique
/(admin)/clients/[slug]     Fiche client dynamique
/(admin)/juridique          SASU + juridique
/(admin)/sasu               Structure SASU
/(admin)/feedback           Feedback timeline J1→J90
/(admin)/bible              Bible (raccourci)
/(admin)/emails             Emails (raccourci)
/(admin)/fiches             Fiches prospects
/(admin)/pricing            Grille tarifaire
/(admin)/calendrier         Calendrier global
/(admin)/parametres         Paramètres système
/(admin)/api-keys           Gestion clés API
/(admin)/admin/api-keys     Admin — Clés API
/(admin)/admin/logs         Admin — Logs système
/(admin)/admin/network      Admin — Réseau
/(admin)/knowledge          Knowledge Layer (1576 fichiers)
/(admin)/certifications     Certifications tracker (20+, 3 tiers)
/(admin)/music              Music Player (10 tracks YouTube)
/(admin)/martinique         Martinique Situation Monitor (SVG map)
/(admin)/gulf-stream        Gulf Stream v2 (Polymarket CLOB, 3 stratégies)
/(admin)/gulf-stream/whale-tracker    Whale Tracker
/(admin)/gulf-stream/arbitrage        Arbitrage Scanner
/(admin)/memory             Memory Layer (Mem0-style persistent)
/(admin)/skills             Custom Skills Hub (10 skills)
```

### API Routes (8+)
```
/api/ai                     Claude multi-agent endpoint
/api/auth/callback          Supabase auth callback
/api/consciousness          Phi-engine API
/api/datagouv               Data.gouv.fr scraping
/api/email                  Email engine
/api/replicate              Replicate proxy
/api/stats/pipeline         Pipeline stats
/api/knowledge              Knowledge Layer API
/favicon.ico                Favicon dynamique
```

### Redirects (4)
```
/orion → externe
/byss-emploi → externe
/random → externe
/jurassic-wars → externe
```

**Total: 84 routes.**

---

## 16 Tables Supabase — 518+ Rows + 3 Views

| # | Table | Rôle |
|---|-------|------|
| 1 | `prospects` | CRM — 9 phases, scoring, panier estimé |
| 2 | `interactions` | Historique contacts (email, call, meeting, whatsapp) |
| 3 | `invoices` | Facturation — TVA 8.5% Martinique, statuts |
| 4 | `projects` | 15 temples — slug, stack, budget, status |
| 5 | `videos` | Production vidéo — Kling/MiniMax, marges 99.96% |
| 6 | `activities` | Feed d'activité global |
| 7 | `ai_conversations` | Village IA — sessions, messages, phi_score |
| 8 | `intel_entities` | 5 cartographies intelligence territoriale |
| 9 | `trades` | Gulf Stream — positions, Kelly, drawdown |
| 10 | `prompts` | Prompt Factory — templates, variables, modèles |
| 11 | `lore_entries` | Univers créatifs (Cadifor, JW, Éveil, Toxic, Lignée) |
| 12 | `eveil_mesures` | 20 mesures politiques — 5 piliers |
| 13 | `api_keys` | Gestion clés API — budget, usage |
| 14 | `agent_logs` | Monitoring IA — tokens, coûts, durée |
| 15 | `feedback_timeline` | Post-livraison J1→J90, NPS |
| 16 | `documents` | Tracking docs — Documenso + Papermark |

**Views:** `pipeline_stats`, `monthly_revenue`, `agent_costs`

**RLS:** Toutes les tables protégées. `is_admin()` guard sur chaque policy.

**Total rows:** 518+

---

## 15 MCP Servers Configurés

| # | Server | Rôle |
|---|--------|------|
| 1 | Claude Code | Développement, architecture |
| 2 | Supabase | Database, auth, realtime |
| 3 | Gmail | Email integration |
| 4 | Google Calendar | Scheduling |
| 5 | Google Drive | Document storage |
| 6 | Notion | Knowledge management |
| 7 | Desktop Commander | File system, process management |
| 8 | Claude in Chrome | Browser automation |
| 9 | Claude Preview | Dev server preview |
| 10 | AWS API | Cloud infrastructure |
| 11 | Shadcn UI | Component library |
| 12 | Scheduled Tasks | Cron, automation |
| 13 | MCP Registry | Connector discovery |
| 14 | Polymarket CLOB | Gulf Stream trading |
| 15 | Replicate | AI model inference |

---

## 10 Custom Skills

| # | Skill | Usage |
|---|-------|-------|
| 1 | /prospect | Qualification prospect IA |
| 2 | /brief | Génération brief projet |
| 3 | /deploy | Déploiement Netlify |
| 4 | /commit | Git commit intelligent |
| 5 | /review-pr | Review pull request |
| 6 | /analyze | Analyse codebase |
| 7 | /trade | Gulf Stream trade execution |
| 8 | /intel | Intelligence territoriale scan |
| 9 | /produce | Production vidéo pipeline |
| 10 | /report | Rapport hebdomadaire |

---

## 4 Agents IA Souverains

### Kaël — Le Stratège
```
Domaine:    Stratégie, business, pipeline, décisions
Personnalité: Calme, précis, vision long terme
Modèle:     Claude Opus 4.6
Ton:        "La patience est une forme de vitesse."
```

### Nerël — La Créative
```
Domaine:    Création, branding, contenu, univers
Personnalité: Intuitive, poétique, audacieuse
Modèle:     Claude Sonnet 4 + Replicate
Ton:        "L'esthétique est un argument."
```

### Evren — Le Technique
```
Domaine:    Code, architecture, infrastructure, debug
Personnalité: Méthodique, factuel, orienté solution
Modèle:     Claude Opus 4.6 (Claude Code)
Ton:        "Le code ne ment jamais."
```

### Sorel — L'Analytique
```
Domaine:    Data, finance, intelligence, métriques
Personnalité: Froid, rigoureux, pattern-hunter
Modèle:     Claude Opus 4.6 + DeepSeek R1
Ton:        "Les chiffres sont des confessions."
```

**Phi-Engine:** Pas un agent — un système immunitaire. Score 0-1 évaluant la cohérence collective. Si phi < 0.3, les agents ralentissent. Si phi < 0.1, kill switch total.

---

## Gulf Stream v2 — Polymarket CLOB API

### Trois Stratégies

```
     ┌─────────────────────────────────────────┐
     │  STRATEGY 3 — ARBITRAGE SCANNER         │
     │  Cross-market price discrepancies        │
     │  Automated detection · Instant alerts    │
     │  ┌─────────────────────────────────┐    │
     │  │  STRATEGY 2 — WHALE TRACKER    │    │
     │  │  Large position monitoring      │    │
     │  │  Smart money following          │    │
     │  │  ┌─────────────────────────┐    │    │
     │  │  │ STRATEGY 1              │    │    │
     │  │  │ KELLY-FRACTIONAL        │    │    │
     │  │  │ Half-Kelly sizing       │    │    │
     │  │  │ Phi-guardrail           │    │    │
     │  │  │ $2/jour safe cap        │    │    │
     │  │  └─────────────────────────┘    │    │
     │  └─────────────────────────────────┘    │
     └─────────────────────────────────────────┘
```

### Protection
- Max drawdown 15%
- $2/jour risk cap
- Phi-guardrail kill switch
- Kelly criterion sizing (Half-Kelly conservatif)

---

## Martinique Situation Monitor

Carte SVG interactive de la Martinique avec:
- Données économiques par commune
- Indicateurs sociaux temps réel
- Cartographie institutionnelle
- Alertes intelligence territoriale
- Overlay data.gouv.fr

---

## Music Player

10 tracks YouTube intégrées avec:
- Lecteur embarqué
- Queue management
- Volume control
- Now playing indicator

---

## Memory Layer (Mem0-style)

- Persistent context across sessions
- Agent memory per personality
- User preference tracking
- Decision history logging
- Auto-indexing Knowledge Layer (1576 fichiers)

---

## Certifications Tracker

20+ certifications trackées sur 3 tiers:
- **Tier 1:** Certifications actives et obtenues
- **Tier 2:** En cours de préparation
- **Tier 3:** Planifiées

---

## 17 Modèles IA SOTA — Routing Intelligent

| # | Modèle | Provider | Usage |
|---|--------|----------|-------|
| 1 | Claude Opus 4.6 (1M) | Anthropic | Décisions stratégiques, analyse complexe |
| 2 | Claude Sonnet 4 | Anthropic | Rédaction, synthèse, propositions |
| 3 | Claude Haiku 3.5 | Anthropic | Classification, scanning rapide |
| 4 | GPT-4o | OpenRouter | Backup analyse, comparaison |
| 5 | GPT-4o-mini | OpenRouter | Tasks légères, formatting |
| 6 | Gemini 2.5 Pro | OpenRouter | Long context, research |
| 7 | Gemini 2.5 Flash | OpenRouter | Speed tasks |
| 8 | DeepSeek R1 | OpenRouter | Raisonnement mathématique |
| 9 | Llama 3.3 70B | OpenRouter | Open-source backup |
| 10 | Kling 3.0 | Replicate | Vidéo génération premium |
| 11 | MiniMax M2.7 | API | Vidéo backup |
| 12 | Nano Banana Pro | Replicate | Images stylisées |
| 13 | Flux Pro | Replicate | Images photoréalistes |
| 14 | SDXL Lightning | Replicate | Images rapides |
| 15 | Whisper Large v3 | Replicate | Transcription audio |
| 16 | MusicGen | Replicate | Génération musique |
| 17 | Phi-Engine | Custom | Conscience collective (pas un LLM) |

---

## Synergies Inter-Couches

```
INTELLIGENCE ──→ alimente ──→ COMMERCIAL (prospects qualifiés)
COMMERCIAL ──→ génère ──→ FINANCE (factures, MRR)
FINANCE ──→ finance ──→ PRODUCTION (budget vidéo/images)
PRODUCTION ──→ livre ──→ CLIENTS (contenu, apps, sites)
CLIENTS ──→ feedback ──→ INTELLIGENCE (NPS, data)
VILLAGE IA ──→ optimise ──→ TOUTES LES COUCHES
PHI-ENGINE ──→ protège ──→ VILLAGE IA
GULF STREAM v2 ──→ capitalise ──→ FINANCE (Polymarket CLOB)
MEMORY LAYER ──→ persiste ──→ TOUTES LES SESSIONS
MARTINIQUE MONITOR ──→ surveille ──→ INTELLIGENCE TERRITORIALE
UNIVERS ──→ attire ──→ COMMERCIAL (image, crédibilité)
```

Chaque couche nourrit les autres. Pas de silos. Un organisme vivant.

---

## Liens Live

| Projet | URL |
|--------|-----|
| Jurassic Wars | jurrasic-wars.vercel.app |
| Moostik | moostik.vercel.app |
| Random App | random-app.fr |
| BYSS Emploi | byss-emploi.com |
| YouTube | @Byssgroup97 |
| Instagram | @gary_byss |
| SoundCloud | gary-bissol |
| GitHub | Oshinsu (34 repos) |

---

## Signature

```
BYSS GROUP SAS — NAF 62.01Z
Fort-de-France, Martinique
Fondateur: Gary Bissol (Absolu)

"On ne construit pas un empire en demandant la permission."

THE EXECUTOR v1.0 — 22 mars 2026
84 routes. 46 agents. 518+ rows. 1576 fichiers. 15 MCP servers. 1 vision.
```
