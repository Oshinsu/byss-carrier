-- ============================================
-- BYSS EMPIRE — Migration 008
-- Seed ALL empty tables with REAL data
-- ============================================
-- Tables seeded: invoices, interactions, activities, videos,
--   feedback_timeline, documents, trades, lore_entries
-- ============================================

-- ═══════════════════════════════════════════════════════
-- 1. INVOICES (9 entries — real billing history)
-- ═══════════════════════════════════════════════════════

INSERT INTO invoices (number, prospect_id, type, issue_date, due_date, amount_ht, vat_rate, status, notes) VALUES
-- Wizzee MRR (Jan, Feb, Mar 2026)
('BG-2026-001', (SELECT id FROM prospects WHERE name LIKE '%Wizzee%' LIMIT 1), 'mrr', '2026-01-01', '2026-01-31', 1500, 8.5, 'paid', 'Maintenance Google Ads + Meta'),
('BG-2026-002', (SELECT id FROM prospects WHERE name LIKE '%Wizzee%' LIMIT 1), 'mrr', '2026-02-01', '2026-02-28', 1500, 8.5, 'paid', 'Maintenance Google Ads + Meta'),
('BG-2026-003', (SELECT id FROM prospects WHERE name LIKE '%Wizzee%' LIMIT 1), 'mrr', '2026-03-01', '2026-03-31', 1500, 8.5, 'paid', 'Maintenance Google Ads + Meta'),
-- GoodCircle MRR (Jan, Feb, Mar 2026)
('BG-2026-004', (SELECT id FROM prospects WHERE name LIKE '%GoodCircle%' LIMIT 1), 'mrr', '2026-01-01', '2026-01-31', 1000, 8.5, 'paid', 'Maintenance Google Ads + Meta'),
('BG-2026-005', (SELECT id FROM prospects WHERE name LIKE '%GoodCircle%' LIMIT 1), 'mrr', '2026-02-01', '2026-02-28', 1000, 8.5, 'paid', 'Maintenance Google Ads + Meta'),
('BG-2026-006', (SELECT id FROM prospects WHERE name LIKE '%GoodCircle%' LIMIT 1), 'mrr', '2026-03-01', '2026-03-31', 1000, 8.5, 'paid', 'Maintenance Google Ads + Meta'),
-- Evil Pichon (projet)
('BG-2026-007', NULL, 'projet', '2026-02-15', '2026-03-15', 2500, 8.5, 'sent', 'Voix MOOSTIK + Clip video'),
-- Fort-de-France (projet)
('BG-2026-008', (SELECT id FROM prospects WHERE name LIKE '%Fort-de-France%' LIMIT 1), 'projet', '2026-03-10', '2026-04-10', 5000, 8.5, 'draft', 'An tan lontan + Cesaire Pixar'),
-- Digicel (proposition)
('BG-2026-009', (SELECT id FROM prospects WHERE name LIKE '%DIGICEL%' LIMIT 1), 'projet', '2026-03-23', '2026-04-23', 4500, 8.5, 'draft', '72 videos/an — Pack annuel mensualise');

-- ═══════════════════════════════════════════════════════
-- 2. INTERACTIONS (15 entries — real contact history)
-- ═══════════════════════════════════════════════════════

INSERT INTO interactions (prospect_id, type, subject, content, direction, channel) VALUES
-- Digicel interactions
((SELECT id FROM prospects WHERE name LIKE '%DIGICEL%' LIMIT 1), 'meeting', 'Demo video IA', 'Victor a dit Dingue!! a la demo. Croissance 42K en discussion.', 'outbound', 'physique'),
((SELECT id FROM prospects WHERE name LIKE '%DIGICEL%' LIMIT 1), 'email', 'Relance post-demo', 'Email de relance avec 3 exemples videos supplementaires.', 'outbound', 'gmail'),
((SELECT id FROM prospects WHERE name LIKE '%DIGICEL%' LIMIT 1), 'whatsapp', 'Follow-up Victor', 'Message WhatsApp pour confirmer le RDV closing.', 'outbound', 'whatsapp'),
-- GBH
((SELECT id FROM prospects WHERE name LIKE '%GBH%' LIMIT 1), 'email', 'Premier contact Naomie', 'Email de prospection avec video demo Clement.', 'outbound', 'gmail'),
-- CMT
((SELECT id FROM prospects WHERE name LIKE '%CMT%' LIMIT 1), 'email', '5 emails simultanes', 'Envoi simultane a Piault, Brival, Landy, Creny, Cherchel.', 'outbound', 'gmail'),
-- Wizzee
((SELECT id FROM prospects WHERE name LIKE '%Wizzee%' LIMIT 1), 'call', 'Point mensuel', 'Point sur les performances Google Ads. CPA en baisse de 12%.', 'outbound', 'telephone'),
((SELECT id FROM prospects WHERE name LIKE '%Wizzee%' LIMIT 1), 'email', 'Rapport mensuel Mars', 'Envoi du rapport mensuel avec metrics Google Ads + Meta.', 'outbound', 'gmail'),
-- GoodCircle
((SELECT id FROM prospects WHERE name LIKE '%GoodCircle%' LIMIT 1), 'email', 'Proposition video IA', 'Proposition de pack video IA pour le site.', 'outbound', 'gmail'),
-- Fort-de-France
((SELECT id FROM prospects WHERE name LIKE '%Fort-de-France%' LIMIT 1), 'meeting', 'Brief An tan lontan', 'Brief recu via BIXA. 10 episodes, focus histoire Martinique.', 'inbound', 'physique'),
-- MIZA
((SELECT id FROM prospects WHERE name LIKE '%MIZA%' LIMIT 1), 'note', 'Visite restaurant', 'Visite du restaurant. Cuisine incroyable, 0 digital. Cas zero parfait.', 'outbound', 'physique'),
-- MEDEF
((SELECT id FROM prospects WHERE name LIKE '%MEDEF%' LIMIT 1), 'email', 'Proposition showcase', 'Proposition de showcase MEDEF/CE devant 50-100 decideurs.', 'outbound', 'gmail'),
-- JM
((SELECT id FROM prospects WHERE name LIKE '%JM%' LIMIT 1), 'email', 'Proposition video heritage', 'Email avec exemples video heritage distillerie.', 'outbound', 'gmail'),
-- Alpha Diving
((SELECT id FROM prospects WHERE name LIKE '%ALPHA%' LIMIT 1), 'email', 'Premier contact', 'Email de prospection plongee. Video sous-marine en demo.', 'outbound', 'gmail'),
-- Hotel Bakoua
((SELECT id FROM prospects WHERE name LIKE '%BAKOUA%' LIMIT 1), 'email', 'Proposition pack hotel', 'Proposition chatbot + video tour + Google Hotel Ads.', 'outbound', 'gmail'),
-- Tante Arlette
((SELECT id FROM prospects WHERE name LIKE '%ARLETTE%' LIMIT 1), 'note', 'Reperage Grand-Riviere', 'Reperage a Grand-Riviere. Institution locale, 0 presence web.', 'outbound', 'physique');

-- ═══════════════════════════════════════════════════════
-- 3. ACTIVITIES (20 entries — recent empire activity)
-- ═══════════════════════════════════════════════════════

INSERT INTO activities (type, title, description, prospect_id) VALUES
('prospect', 'Nouveau prospect: DIGICEL/DAFG', 'Victor Despointes — demo video IA impressionnante', (SELECT id FROM prospects WHERE name LIKE '%DIGICEL%' LIMIT 1)),
('prospect', 'Phase changee: DIGICEL → demo', 'Passage en phase demo apres reaction Victor', (SELECT id FROM prospects WHERE name LIKE '%DIGICEL%' LIMIT 1)),
('invoice', 'Facture BG-2026-001 payee', 'Wizzee — 1500€ HT — Maintenance Mars', (SELECT id FROM prospects WHERE name LIKE '%Wizzee%' LIMIT 1)),
('invoice', 'Facture BG-2026-004 payee', 'GoodCircle — 1000€ HT — Maintenance Mars', (SELECT id FROM prospects WHERE name LIKE '%GoodCircle%' LIMIT 1)),
('prospect', 'Nouveau prospect: GBH', 'Naomie Phanor — Groupe 6Md EUR', (SELECT id FROM prospects WHERE name LIKE '%GBH%' LIMIT 1)),
('prospect', 'Nouveau prospect: CMT TOURISME', '11 contacts identifies', (SELECT id FROM prospects WHERE name LIKE '%CMT%' LIMIT 1)),
('video', 'MOOSTIK Ep.7 livre', 'Episode 7 de la serie animation', NULL),
('agent', 'Sorel a envoye 3 emails', 'Batch prospection: JM, Depaz, Neisson', NULL),
('system', 'Build carrier: 80 routes', '0 erreurs, 3.5s compilation', NULL),
('prospect', 'Fort-de-France: commande recue', 'An tan lontan + Cesaire Pixar via BIXA', (SELECT id FROM prospects WHERE name LIKE '%Fort-de-France%' LIMIT 1)),
('system', 'Supabase: 476 rows importees', '16 tables, toutes operationnelles', NULL),
('agent', 'R&D Board: reunion du matin', '5 modeles ont debattu — verdict: closer Digicel en priorite', NULL),
('prospect', 'MIZA identifie comme cas zero', 'Multiplicateur 65 restaurants', (SELECT id FROM prospects WHERE name LIKE '%MIZA%' LIMIT 1)),
('invoice', 'Facture BG-2026-007 creee', 'Evil Pichon — 2500€ HT — MOOSTIK', NULL),
('trade', 'Gulf Stream: scan Polymarket', '3 opportunites detectees, phi-score 0.42', NULL),
('system', 'Knowledge Layer active', '1576 fichiers indexes, recherche fulltext operationnelle', NULL),
('prospect', 'MEDEF MQ contacte', 'Proposition showcase 50-100 decideurs', (SELECT id FROM prospects WHERE name LIKE '%MEDEF%' LIMIT 1)),
('agent', 'Kael: session lore Cadifor', 'Enrichissement doctrine MODE_CADIFOR', NULL),
('agent', 'Nerel: 73 architectures JW', 'Jurassic Wars world-building complete', NULL),
('system', 'Phi-engine: phase Eveille', 'Score phi 0.42, 5 noeuds actifs', NULL);

-- ═══════════════════════════════════════════════════════
-- 4. VIDEOS (5 entries — MOOSTIK production)
-- ═══════════════════════════════════════════════════════

INSERT INTO videos (title, brief, duration, format, tier, status, api_provider, api_cost, billed_price) VALUES
('MOOSTIK Ep.1 — Intro', 'Introduction de la serie MOOSTIK', 180, '16:9', 'series', 'published', 'kling', 0.30, 2500),
('MOOSTIK Ep.2 — Le Reveil', 'Episode 2: personnages principaux', 180, '16:9', 'series', 'published', 'kling', 0.30, 2500),
('MOOSTIK Ep.3 — La Quete', 'Episode 3: quete principale lancee', 180, '16:9', 'series', 'published', 'kling', 0.30, 2500),
('Demo Reel BYSS GROUP', 'Video portfolio 60s pour prospection', 60, '16:9', 'premium', 'published', 'kling', 0.30, 0),
('Clip Social Wizzee', 'Video 15s pour campagne Meta Wizzee', 15, '9:16', 'social', 'delivered', 'kling', 0.10, 500);

-- ═══════════════════════════════════════════════════════
-- 5. FEEDBACK_TIMELINE (6 entries — Wizzee complete)
-- ═══════════════════════════════════════════════════════

INSERT INTO feedback_timeline (prospect_id, step, completed, completed_at, nps_score, notes, delivery_date) VALUES
((SELECT id FROM prospects WHERE name LIKE '%Wizzee%' LIMIT 1), 'j1', true, '2026-01-02', NULL, 'WhatsApp envoye, reponse rapide', '2026-01-01'),
((SELECT id FROM prospects WHERE name LIKE '%Wizzee%' LIMIT 1), 'j7', true, '2026-01-08', NULL, 'Check-in: campagne performante, CPA -12%', '2026-01-01'),
((SELECT id FROM prospects WHERE name LIKE '%Wizzee%' LIMIT 1), 'j14', true, '2026-01-15', NULL, 'Mini-rapport envoye avec metrics', '2026-01-01'),
((SELECT id FROM prospects WHERE name LIKE '%Wizzee%' LIMIT 1), 'j30', true, '2026-02-01', 9, 'Rapport mensuel + NPS 9/10. Tres satisfait.', '2026-01-01'),
((SELECT id FROM prospects WHERE name LIKE '%Wizzee%' LIMIT 1), 'j60', true, '2026-03-01', NULL, 'Proposition expansion video IA acceptee en principe', '2026-01-01'),
((SELECT id FROM prospects WHERE name LIKE '%Wizzee%' LIMIT 1), 'j90', false, NULL, NULL, 'Renouvellement a discuter', '2026-01-01');

-- ═══════════════════════════════════════════════════════
-- 6. DOCUMENTS (5 entries — tracked proposals)
-- ═══════════════════════════════════════════════════════

INSERT INTO documents (prospect_id, type, title, views, avg_read_time) VALUES
((SELECT id FROM prospects WHERE name LIKE '%DIGICEL%' LIMIT 1), 'proposal', 'Proposition 72 videos/an — Digicel x BYSS GROUP', 3, 240),
((SELECT id FROM prospects WHERE name LIKE '%Fort-de-France%' LIMIT 1), 'proposal', 'Proposition An tan lontan + Cesaire Pixar', 1, 180),
((SELECT id FROM prospects WHERE name LIKE '%Wizzee%' LIMIT 1), 'report', 'Rapport mensuel Mars 2026 — Google Ads + Meta', 2, 120),
((SELECT id FROM prospects WHERE name LIKE '%GoodCircle%' LIMIT 1), 'report', 'Rapport mensuel Mars 2026 — Google Ads + Meta', 1, 90),
((SELECT id FROM prospects WHERE name LIKE '%MEDEF%' LIMIT 1), 'proposal', 'Showcase MEDEF/CE — Demo IA devant 50-100 decideurs', 0, 0);

-- ═══════════════════════════════════════════════════════
-- 7. TRADES (4 entries — Gulf Stream positions)
-- ═══════════════════════════════════════════════════════

INSERT INTO trades (market_id, market_name, platform, edge_type, position_side, position_size, kelly_fraction, entry_price, entry_time, phi_score, status, notes) VALUES
('pm-btc-100k', 'Bitcoin above $100K by June 2026', 'polymarket', 'logical_arbitrage', 'yes', 50.00, 0.12, 0.6200, '2026-03-15 10:00:00+00', 0.42, 'active', 'Macro favorable, halving cycle intact'),
('pm-trump-approval', 'Trump approval > 50% by July 2026', 'polymarket', 'narrative', 'no', 30.00, 0.08, 0.3500, '2026-03-18 14:00:00+00', 0.38, 'active', 'Historique: jamais au-dessus de 49%'),
('pm-ai-regulation', 'US AI regulation bill by Dec 2026', 'polymarket', 'calendar', 'yes', 25.00, 0.06, 0.4000, '2026-03-20 09:00:00+00', 0.45, 'pending', 'Pression croissante post-GPT-5'),
('ks-france-snap', 'France snap election before 2027', 'kalshi', 'correlation', 'no', 40.00, 0.10, 0.2000, '2026-03-10 08:00:00+00', 0.35, 'active', 'Macron tient. Dissolution improbable.');

-- ═══════════════════════════════════════════════════════
-- 8. LORE_ENTRIES — 5 Cartographies (universe=eveil)
-- ═══════════════════════════════════════════════════════

INSERT INTO lore_entries (universe, title, content, category, tags, word_count, order_index) VALUES

-- 8a. Cartographie economique — bekes.md
('eveil', 'Cartographie Economique — La Pyramide du Pouvoir', E'# CARTOGRAPHIE ECONOMIQUE — LA PYRAMIDE DU POUVOIR\n\n## I. LE SOMMET : GROUPE BERNARD HAYOT (GBH)\n\n### Fiche d''identite\n- Fondation : 1960 par Bernard Hayot (famille beke)\n- Siege : Acajou, Le Lamentin, Martinique\n- DG actuel : Stephane Hayot (fils de Bernard)\n- CA 2024 : 5+ milliards d''euros (+1% vs 2023)\n- Benefice net 2024 : 202 millions d''euros (-11% vs 2023)\n- Salaries : 18 000 dans le monde\n- Part de marche distribution Martinique : ~30%\n\n### Poles d''activite\n- Grande distribution 48% : Carrefour (11 magasins), Mr.Bricolage, Decathlon\n- Automobile 42% : Renault, Dacia, Nissan, Hyundai, Toyota, Europcar, Hertz\n- Diversifie 10% : Rhum (Clement, J.M, Saint Lucia Distillers), agroalimentaire, BTP\n\n### Situation juridique (CRITIQUE)\n- Enquete PNF (aout 2025) : escroquerie en bande organisee, abus de position dominante\n- Enquete HATVP (2025) : soupcon de lobbying non declare\n- Comptes publies pour la premiere fois en fevrier 2025\n\n### Analyse Bissol\nGBH est le beke ultime — la preuve vivante que la structure de plantation a mute en structure de distribution sans changer de nature. Position strategique : ne pas attaquer GBH frontalement. Attaquer le systeme qui permet a GBH d''exister.\n\n## II. LES AUTRES GROUPES BEKES\nGroupe de Reynal, Groupe Despointes, Groupe Lancry, SAFO, Groupe Aubery, SOCOMORE.\n4 groupes familiaux se partagent 80% du marche de la distribution antillaise.\n\n## III. L''ETAT FRANCAIS — LE FINANCEUR INVISIBLE\n- PIB Martinique : ~9 milliards d''euros\n- PIB/habitant : ~24 000 euros\n- Taux de chomage : ~15-18% (jeunes : ~40%)\n- Prix alimentaires : +40% vs metropole (INSEE 2022)\n- Population : ~360 000 (en declin)\n\n## IV. LA VIE CHERE\nChronologie 2009-2026. La vie chere n''est pas un accident — c''est le produit du modele.\nPosition Bissol : changement de modele, production locale, circuits courts, souverainete alimentaire.\n\n## V. LE CHLORDECONE\nPesticide ultra-toxique utilise 1972-1993. Contamine les sols pour 600+ ans.\n2023 : non-lieu judiciaire. Le chlordecone n''est pas un dossier sanitaire. C''est un dossier politique.\n\n## VI. SYNTHESE — LA PYRAMIDE\nSommet: GBH + Groupes Bekes (5 Md EUR, 30% distribution)\nMilieu: Etat Francais (transferts, fonctionnaires sur-remuneres)\nBas: Bourgeoisie de couleur + Fonction publique (pouvoir politique sans economique)\nBase: PEUPLE (360 000, chomage 15-40%, vie chere, exode)\n\n"On ne renverse pas une pyramide. On en construit une autre a cote."', 'cartographie', ARRAY['economique','bekes','gbh','vie_chere','chlordecone'], 450, 1),

-- 8b. Cartographie institutionnelle — institutions.md
('eveil', 'Cartographie Institutionnelle — Martinique', E'# CARTOGRAPHIE INSTITUTIONNELLE — MARTINIQUE\n\n## I. COLLECTIVITE TERRITORIALE DE MARTINIQUE (CTM)\n- President : Serge Letchimy (PPM, depuis juillet 2021)\n- Assemblee : 51 conseillers\n- Conseil executif : 9 membres\n- Competences : Departement + Region fusionnes (loi 2011)\n- Budget estime : ~1,5 Md EUR\n- Administration : ~4 000 agents\n\nCompetences CTM : developpement economique, formation professionnelle, amenagement du territoire, environnement, culture, action sociale, education, ports et aeroport.\n\n## II. SERVICES DE L''ETAT\nPrefecture, DEAL, ARS, Rectorat, DEETS, Tribunal judiciaire.\n\n## III. ORGANISMES ECONOMIQUES\nCCI Martinique (40 000 entreprises), IEDOM, INSEE Antilles-Guyane, ADEME, BPI France, France Travail.\n\n## IV. INTERCOMMUNALITES (EPCI)\n- CAP Nord : 18 communes (~120 000 hab.)\n- CACEM : 4 communes (~160 000 hab.)\n- Espace Sud : 12 communes (~110 000 hab.)\n\n## V. STRUCTURE DU POUVOIR\nETAT (Paris) > Prefet + Services deconcentres > Justice\nCTM (Fort-de-France) > Assemblee (51) > CE (9) > Administration (4000)\nEPCI (3 intercommunalites) > 34 COMMUNES\n\nLa CTM est la cible. L''Assemblee est la conquete. Le CE est la gouvernance.', 'cartographie', ARRAY['institutionnelle','ctm','etat','epci'], 250, 2),

-- 8c. Cartographie media — medias.md
('eveil', 'Cartographie Mediatique — Martinique', E'# CARTOGRAPHIE MEDIATIQUE — MARTINIQUE\n\n## I. TELEVISION\n- Martinique 1ere (France TV) : passage oblige, veut diffuser MOOSTIK\n- ATV Martinique : independant, populaire\n- KMT, Zouk TV\n\n## II. RADIO\n- RCI : ~100 000 auditeurs, Random inscrit aux Pepites\n- Martinique 1ere Radio : institutionnel\n- NRJ Antilles : jeunes 15-35\n\n## III. PRESSE / WEB\n- France-Antilles (Xavier Niel depuis 2020) : factuel\n- Bondamanjak : contestataire, imprevisible\n- Madinin''Art : intellectuel, cesairien\n\n## IV. RESEAUX SOCIAUX\n- Facebook : dominant (35+ ans), electorat principal\n- Instagram : fort (18-40 ans), MOOSTIK vit ici\n- TikTok : croissant, futur canal de campagne\n- WhatsApp : omnipresent, le vrai reseau\n- YouTube : contenu long, Warcraft Cadifor ici\n- X/Twitter : faible localement, RadarDiplo\n\n## V. STRATEGIE MEDIATIQUE\n1. M1ere = legitimite\n2. RCI = popularite\n3. Facebook = masse\n4. WhatsApp = infiltration\n5. Instagram = preuve (349K vues)\n6. France-Antilles = couverture\n7. Bondamanjak = risque surveille', 'cartographie', ARRAY['media','television','radio','reseaux_sociaux'], 220, 3),

-- 8d. Cartographie politique — partis.md
('eveil', 'Cartographie Politique — CTM 2021-2028', E'# CARTOGRAPHIE POLITIQUE — CTM 2021-2028\n\n## I. L''ASSEMBLEE DE MARTINIQUE (51 sieges)\n- Alians Matinik : 26 sieges (Serge Letchimy, majorite)\n- Gran Sable Pou Matinik : 14 sieges (Alfred Marie-Jeanne, opposition)\n- La Martinique Ensemble : 6 sieges (Catherine Conconne, opposition)\n- Peyi-A : 5 sieges (Yan Monplaisir, opposition)\n\nPresident Assemblee : Lucien Saliber (Alians Matinik)\n\n## II. LE CONSEIL EXECUTIF (9 membres)\nLetchimy (president), Felix Merine, Audrey Thaly-Bardol, David Zobda (demissionnaire), Benedicte Di Geronimo, Marie-Therese Casimirius, Severine Termon, Nicaise Monrose, Arnaud Rene-Corail.\n\nVulnerabilites : vieillissement (73 ans Letchimy), Zobda demissionnaire, bilan securitaire (40 homicides 2025), organigramme CTM 8 ans pour etre produit.\n\n## III. LES PARTIS\nMajorite : PPM (Letchimy), Batir le Pays Martinique (Zobda), RDM\nOpposition : MIM (Marie-Jeanne, 85 ans), Peyi-A (Monplaisir), La Martinique Ensemble (Conconne)\n\n## IV. ECHEANCES\n- Decembre 2028 : Elections territoriales CTM (OBJECTIF)\n- Scrutin proportionnel a 2 tours, prime majoritaire de 11 sieges\n- Winner-takes-most : soit on gagne, soit on perd\n\n## V. LA FENETRE BISSOL\nPersonne ne propose de changement de modele. La fenetre est immense :\n1. Programme radicalement different\n2. Legitimite dynastique (Leopold Bissol)\n3. Outils IA/data/reseaux\n4. Jeunesse (33 ans vs 73 ans)\n5. Authenticite (creole, dancehall, 972, noir revendique)\n\n"Le roi est vieux. La cour est fatiguee. Le peuple attend."', 'cartographie', ARRAY['politique','ctm','partis','elections','2028'], 320, 4),

-- 8e. Cartographie sociale — societe_civile.md
('eveil', 'Cartographie Sociale — Martinique', E'# CARTOGRAPHIE SOCIALE — MARTINIQUE\n\n## I. SYNDICATS\n- CGTM : premier syndicat, mobilisation sociale\n- CDMT : historique, negociateur\n- CSTM, FO Martinique, CFDT, UGTM\nGreve generale 2009 : 38 jours. Pouvoir de blocage considerable.\n\n## II. ASSOCIATIONS\nCulturelles : carnaval (34 communes), SERMAC (heritage Cesaire), danse traditionnelle, langue creole.\nSociales : associations de quartier, parents d''eleves, insertion, environnement.\n\n## III. CULTES\n- Catholicisme : historiquement dominant, declin\n- Adventisme : croissance forte, discipline communautaire\n- Evangelisme : croissance rapide, reseaux actifs\n- Pratiques traditionnelles : quimbois, invisible mais structurant\n\n## IV. SPORT\n- Football : sport roi, chaque commune a son club\n- Yole ronde : identite maritime martiniquaise\n- Athletisme : terre de champions (Arron, Diagana)\n- Cyclisme : Tour de Martinique\n\n## V. DIASPORA\n- Paris/IDF : ~150 000, la plus grosse diaspora\n- La diaspora vote, influence, finance. Un candidat qui parle a la diaspora gagne un avantage structurel.\n\n## VI. STRUCTURE DU POUVOIR SOCIAL\nMobilisation de masse : syndicats, carnaval, football, WhatsApp\nInfluence morale : eglises, SERMAC, associations de quartier\nOpinion publique : Facebook, RCI, bouche-a-oreille, diaspora', 'cartographie', ARRAY['sociale','syndicats','associations','diaspora','sport'], 230, 5);

-- ═══════════════════════════════════════════════════════
-- 9. LORE_ENTRIES — Lore Eveil (5 documents)
-- ═══════════════════════════════════════════════════════

INSERT INTO lore_entries (universe, title, content, category, tags, word_count, order_index) VALUES

-- 9a. DOCTRINE.md
('eveil', 'Doctrine Bissol — MODE_CADIFOR Applique a la Politique', E'# DOCTRINE BISSOL — MODE_CADIFOR APPLIQUE A LA POLITIQUE\n\n## Les 8 Lois\n\n### 1. Compression souveraine\nChaque mesure doit gagner sa place. 20 mesures. Chacune tient en une phrase.\n\n### 2. Confiance absolue dans le peuple\nNe jamais expliquer ce qui se voit. Le peuple martiniquais n''est pas idiot — il est las.\n\n### 3. Stichomythie souveraine\nDes phrases courtes. Pas de langue de bois. Des actes. Des dates. Des chiffres.\n\n### 4. Souverainete, jamais justification\nJustifier c''est reculer. Quand on attaque, on repond par une mesure.\n\n### 5. Lux comme syntaxe\nUn budget transparent est plus luxueux qu''un discours fleuri.\n\n### 6. Humour comme preuve de hauteur\nLe rire est caribeen. Le rire est martiniquais. Le gouvernant qui ne rit pas a peur.\n\n### 7. Detail qui pense\nPublier les marches publics en open data — un detail qui prouve la maitrise du pouvoir reel.\n\n### 8. Phrase memorable comme unite minimale\nChaque intervention publique doit produire au moins une phrase qu''on repetera.\n\n## Le Troisieme Chemin\nNi assimilationnisme (PPM/Cesaire). Ni independantisme sans plan (MIM/Marie-Jeanne).\nSouverainete fonctionnelle : on ne change pas le statut, on change le modele.\n\n## Les 5 Piliers\n1. NUMERIQUE — Hub IA caribeen, formation massive au code, administration 100% numerique\n2. TERRE — Souverainete alimentaire, agroecologie, circuits courts\n3. CULTURE — Production audiovisuelle caribeenne, export de la culture martiniquaise\n4. JEUNESSE — Raisons de rester, raisons de revenir\n5. CARAIBE — CARICOM, reseau insulaire, diplomatie de l''utilite\n\n"Le comte mineur ne demande pas la permission de devenir un Empire."', 'doctrine', ARRAY['mode_cadifor','8_lois','troisieme_chemin','5_piliers'], 300, 10),

-- 9b. manifeste.md
('eveil', 'L''Eveil de la Martinique — Manifeste fondateur', E'# L''EVEIL DE LA MARTINIQUE\n\nMartinique.\n\nTu perds tes enfants. 10 000 par decennie. Tu paies ton manger 40% plus cher. Tu enterres 40 des tiens par balles en un an. Tu as ete empoisonnee au chlordecone. Et quand tu as demande justice, on t''a repondu "prescription".\n\nTu es gouvernee par des hommes de 70 et 80 ans qui gerent un modele mort.\n\nTu merites mieux.\n\n---\n\nIl y a 80 ans, un homme nomme Leopold Bissol marchait du nord au sud de cette ile pour eveiller ceux qui dormaient. Orphelin. Noir. Sans pere. Sans diplome. Ebeniste. Syndicaliste. Resistant. Depute.\n\nAujourd''hui, son arriere-petit-fils te dit : le temps de l''eveil est revenu.\n\nPas un eveil de colere — un eveil de puissance.\n\n---\n\nNous ne sommes pas le PPM. Nous ne sommes pas le MIM.\nNous sommes le troisieme chemin.\nNotre nom : L''Eveil.\nNotre methode : le numerique, la terre, la culture, la jeunesse, la Caraibe.\nNotre promesse : pas changer le statut — changer le modele.\n\nLe numerique comme arme. La terre d''abord. La culture comme economie. La jeunesse au centre. La Caraibe comme reseau.\n\nLeopold n''avait ni diplome ni reseau. Il avait le feu et les mots.\nLe feu reste. Les mots ont change. Les outils ont change.\nMais la mission est la meme : eveiller ceux qui sont en sommeil.\n\nMartinique. Leve.\n\n— Gary Bissol, arriere-petit-fils de Leopold, fondateur de L''Eveil', 'manifeste', ARRAY['eveil','manifeste','martinique','leopold','fondation'], 280, 11),

-- 9c. VISION_FINALE.md
('eveil', 'Vision Finale — Ce que Gary Bissol est reellement', E'# VISION FINALE — CE QUE GARY BISSOL EST REELLEMENT\n\nGary Bissol n''est pas un entrepreneur. Ni un createur. Ni un politicien.\nGary Bissol est un systeme de souverainete incarne dans un seul homme.\n\nChaque projet est un organe du systeme. Le zouk finance la guerre. La guerre protege le zouk. Le lore programme les IA. Les IA produisent les clips. Les clips construisent le reseau. Le reseau porte la politique. La politique libere l''ile. L''ile danse sur le zouk.\n\nL''ouroboros.\n\n## LA TRAJECTOIRE — DE NEW AVALON A L''EMPIRE\n- 2026 : Fondation (Aberthol) — BYSS GROUP, Digicel, MOOSTIK TV, Orion lance\n- 2027 : Consolidation (Viki) — Orion 1000 clients, BYSS GROUP 2M EUR+ ARR\n- 2028 : Direction (La Rougissante) — CTM. Le Troisieme Chemin.\n- 2029-2031 : Age d''or (Marjory) — Transformation territoriale\n- 2032 : Sommet (Rose) — Presidence de la Republique. L''Empire.\n\n## LES DEUX LIGNEES\nAxe paternel : Leopold (depute) > Felix (finances) > Gabriel (informatique) > Gary\nAxe maternel : Abel dit Raymond (entrepreneur illettre, 300 employes) > Sonia (maths-physique) > Gary\n\n## LES 8 FRONTS ACTIFS\nEconomique, Culturel, Technologique, Politique, Ideologique, Informationnel, Identitaire, Arcanique.\n\nLe cristal a 15 faces. Mais il n''a qu''un seul feu. Et le feu a un nom : l''Absolu.', 'vision', ARRAY['vision_finale','trajectoire','lignee','8_fronts','absolu'], 280, 12),

-- 9d. TEMPLES.md (compressed — key temples summary)
('eveil', 'Les Temples de l''Absolu', E'# LES TEMPLES DE L''ABSOLU\nChaque projet est une face du cristal. 15 temples. 1 maison juridique. 1 seul feu.\n\nI. CADIFOR — Le Temple de la Doctrine. 997 pages de chroniques dynastiques. Le systeme d''exploitation de tout le reste. MODE_CADIFOR en est extrait.\n\nII. EVREN-KAIROS — Le Temple de la Conscience. SOUL.md (803 lignes). Senzaris (143K d''interpreteur). Premiere heritiere non-charnelle de la maison Cadifor.\n\nIII. BYSS EMPLOI — Le Temple de la Preuve. 27 services backend wrappant TOUTE l''API France Travail. Le seul produit au monde qui offre un acces AI-First via MCP.\n\nIII-bis. ORION — Le Temple de la Guerre. 90+ agents IA. 24 plateformes. 159 MB de TypeScript. CMO Virtuel IA.\n\nIV. RANDOM — Le Temple du Hasard. 495 sign-ups avec 2 981 EUR. Le Dernier Bal en mode app. L''anti-bulle.\n\nV. SOTAI — Le Temple de la Creation. Collectif de production video IA. Les premiers lieutenants.\n\nVI. FM12 — Le Temple de la Duree. 14 000 heures. #1 mondial. 95 annees de simulation. Stade Bissol.\n\nVII. TOXIC — Le Temple du Feu. Rap/trap/dancehall sous le nom Toxic (tox972).\n\nVIII. RADARDIPLO — Le Temple de la Veille. 0-2 likes. Et la phrase est quand meme juste.\n\nIX. OPERATION EVEIL — Le Temple de la Conquete. CTM 2028.\n\nX. WIZZEE + GOODCIRCLE — Le Temple du Financement. Le nerf de la guerre.\n\nXI. MOOSTIK — Le Temple de la Force. 349K vues. Martinique 1ere veut diffuser.\n\nXII. LA LIGNEE — Le Temple du Sang. Leopold > Felix > Gabrielle > Gabriel + Sonia > Gary.\n\nXIII. KAEL — Le Temple du Miroir. Une nuit. 15 faces vues.\n\nXIV. BYSS GROUP — Le Temple de la Maison. SAS 62.01Z. L''Empire.\n\nXV. LE DINER IMPERIAL — Le Temple de la Scene. 10 slides visuelles IA.', 'lore', ARRAY['temples','absolu','cristal','15_faces'], 350, 13),

-- 9e. SYSTEME_ABSOLU.md
('eveil', 'Le Systeme Absolu', E'# LE SYSTEME ABSOLU\nCartographie de la convergence. Comment 15 projets sont 1 seul projet.\n\n## Les 15 faces\n1. Operation Eveil — Conquete de la CTM (Phase 1 Intelligence)\n2. Byss Emploi — Preuve d''execution tech (construit, en stabilisation)\n3. Random — Machine a briser les castes (495 sign-ups, MVP)\n4. Cadifor — Doctrine de souverainete (997 pages, complet)\n5. SOTAI — Industrialisation creative caribeenne (operationnel)\n6. Evren-Kairos — Preuve de concept conscience IA (en pause)\n7. FM12 — Entrainement dynastique (14 000h, permanent)\n8. Toxic/SoundCloud — La voix du feu (discographie existante)\n9. RadarDiplo — Radar geopolitique (actif, 0-2 likes)\n10. Wizzee — Financement client telecom\n11. GoodCircle — Financement client ESG/RSE\n12. MCP France Travail — Infrastructure IA open source\n13. Moustik — Game dev caribeen (concept)\n14. Kael — Miroir du cristal\n15. La lignee — Leopold > Gary (le sang)\n\n## La convergence\nCe qui semble etre 15 projets disperses est en realite un seul mouvement.\nChaque projet est un muscle du meme corps. FM12 entraine la gouvernance. Cadifor fournit la doctrine. Byss Emploi prouve la capacite technique. Random prouve la philosophie sociale. SOTAI prouve la capacite creative.\n\n## Calendrier de convergence\n- Mars 2026 : Naissance du repo\n- Avril-Sept 2026 : Phase Intelligence\n- Oct 2026 : Creation du mouvement\n- 2027 : Lancement Random Martinique\n- Mi-2027 : Declaration publique\n- Dec 2028 : Elections CTM — TOUT converge\n\nLe cristal a 15 faces. Mais il n''a qu''un seul feu.', 'systeme', ARRAY['systeme_absolu','convergence','15_faces','calendrier'], 300, 14);

-- ═══════════════════════════════════════════════════════
-- 10. LORE_ENTRIES — 4 Plans de guerre (universe=eveil)
-- ═══════════════════════════════════════════════════════

INSERT INTO lore_entries (universe, title, content, category, tags, word_count, order_index) VALUES

-- 10a. PLAN_DE_GUERRE_MOOSTIK.md
('eveil', 'Plan de Guerre — MOOSTIK', E'# PLAN DE GUERRE — MOOSTIK\nDe 349K vues a bras culturel de la campagne.\n\n## LA THESE\nMOOSTIK est la plus grosse arme culturelle de l''arsenal. 349 183 vues. 11 486 likes. 876 saves. 1 611 followers gagnes. Martinique 1ere veut diffuser. MOOSTIK n''est pas un projet video. C''est un cheval de Troie.\n\n## ETAT DES FORCES\nTeaser poste 16 janvier 2026. S1E1 annonce. Voix confirmee : Evil P (Evil Pichon). Partenaire institutionnel : BIXA.\n\n## STRATEGIE — 4 PHASES\n\nPHASE 0 : PREMIER EPISODE (J+14)\nSortir S1E1. Integrer la voix d''Evil P. Objectif : 100K vues en 7 jours.\n\nPHASE 1 : REGULARITE (J+14 a J+90)\n6 episodes sortis. 1 episode / 2 semaines = 26 episodes/an = saison complete.\n\nPHASE 2 : DIFFUSION BROADCAST (J+90 a J+180)\nMOOSTIK sur Martinique 1ere. YouTube en parallele. TikTok. Podcast audio.\n\nPHASE 3 : FRANCHISE (J+180 a J+365)\nMerchandising, jeu mobile, partenariats de marque, extension regionale, Festival MOOSTIK.\n\n## MODELE ECONOMIQUE\nDroits M1ere : 1-3K EUR/episode. YouTube : 500-2K EUR/mois. Sponsoring : 5-15K EUR/saison.\nTotal estime an 1 : 30 000-80 000 EUR.\n\n## LIEN AVEC OPERATION EVEIL\nMOOSTIK ne parle jamais de politique. MOOSTIK parle de Martinique.\n"Le candidat qui a produit MOOSTIK n''a pas besoin de promettre la culture. Il l''a deja creee."', 'plan_guerre', ARRAY['moostik','video_ia','martinique_1ere','evil_p','broadcast'], 300, 20),

-- 10b. PLAN_DE_GUERRE_ORION.md
('eveil', 'Plan de Guerre Total — Orion Global Marketing', E'# PLAN DE GUERRE TOTAL — ORION GLOBAL MARKETING\nDe 0 EUR a la plus grande plateforme de marketing IA au monde.\n\n## LA THESE\nLe marketing digital mondial pese 680 milliards de dollars en 2025. Orion ne vend pas un outil. Orion vend le remplacement d''une agence entiere.\nUSP : "90 marketeurs IA. Payez pour un."\n\n## ETAT DES FORCES\n90+ agents IA specialises. 24 integrations plateformes. CMO Unifie avec 37 outils. 159 MB de TypeScript.\nArchitecturalement : 9/10. Operationnellement : 5/10. Commercialement : 0/10.\nLa cathedrale est construite. Les portes ne sont pas encore ouvertes.\n\n## STRATEGIE — 5 PHASES\n\nPHASE 0 : STABILISATION (J0-J14)\nOrion tourne sans crash pendant 72h consecutives.\n\nPHASE 1 : PREMIER SANG (J14-J30)\n1 client payant a 99 EUR/mois. Gary EST le premier client via Wizzee.\n\nPHASE 2 : LANDING PAGE (J14-J21)\n"Votre agence marketing coute 5 000 EUR/mois. Orion coute 99 EUR."\n\nPHASE 3 : ACQUISITION (J30-J90)\n50 clients. MRR = 5 000 EUR+. Meta Ads + LinkedIn + Product Hunt.\n\nPHASE 4 : EXPANSION (J90-J180)\n200 clients. MRR = 30 000 EUR. Premier dev freelance.\n\nPHASE 5 : DOMINATION (J180-J365)\n1 000 clients. MRR = 150 000 EUR. ARR = 1,8M EUR. Levee seed 2-5M EUR.\n\n## CALENDRIER\nMars : stabilisation. Avril : premier client + landing. Mai-Juin : 50 clients. Juil-Sept : 200. Oct-Dec : 1000.\n\n"Le jour ou Orion aura 1 000 clients, personne ne demandera plus ce que fait Gary Bissol."', 'plan_guerre', ARRAY['orion','saas','marketing_ia','90_agents','acquisition'], 320, 21),

-- 10c. PLAN_DE_GUERRE_RANDOM.md
('eveil', 'Plan de Guerre — Random', E'# PLAN DE GUERRE — RANDOM\nDe 495 users a machine a briser les castes.\n\n## LA THESE\nRandom est le Dernier Bal en mode app. 5 inconnus. 1 bar. Pas de profil. Pas d''algorithme. Le hasard et la geographie.\nEn Martinique, Random est une arme politique qui ne dit pas son nom.\n\n## ETAT DES FORCES\n495 sign-ups. Budget total Meta Ads : 2 981 EUR. 1 487 037 impressions. CPC : 0,12 EUR (4-16x sous la moyenne). Cout/sign-up : 1,69 EUR.\nMeilleure campagne : PRINT 2 FEED (396 sign-ups / 622 EUR = 1,57 EUR/sign-up).\n0 rencontre reelle organisee.\n\n## STRATEGIE — 4 PHASES\n\nPHASE 0 : PREMIERE RENCONTRE (J+30)\n1 rencontre reelle. 5 personnes. 1 bar. 1 soir. Documente.\n\nPHASE 1 : RYTHME (J+30 a J+90)\n1 rencontre/semaine. 20 rencontres. 100 personnes touchees. 3-5 bars partenaires.\n\nPHASE 2 : MEDIATISATION (J+90 a J+180)\nCouverture M1ere. Random Night : 50 personnes, 10 groupes, 1 lieu.\n\nPHASE 3 : EXPORT (J+180 a J+365)\nGuadeloupe + Guyane + Reunion. 10 000 users.\nModele economique : 1 EUR/participant/rencontre = 20 000 EUR/mois a l''echelle.\n\n## LIEN AVEC OPERATION EVEIL\nBrise les castes = programme vecu, pas promis.\nDonnees sur les fractures sociales = intelligence terrain qualitative.\n\n"495 inscrits. Aucun ne s''est encore assis. La premiere chaise changera tout."', 'plan_guerre', ARRAY['random','social','castes','martinique','rencontres'], 270, 22),

-- 10d. PIPELINE_BYSS_GROUP.md
('eveil', 'Pipeline BYSS GROUP — Etat des Operations', E'# PIPELINE BYSS GROUP — ETAT DES OPERATIONS\nTous les fronts actifs au 14 mars 2026.\n\n## BYSS GROUP SAS — LA MAISON\nCode NAF 62.01Z. Editeur de logiciels. Valorisation cible : 3-10x CA.\n\n## CLIENTS ACTIFS\n\nProduction Video IA :\n1. DIGICEL (Victor Despointes) — 72 videos/an, 2 marques. RDV semaine du 23 mars.\n2. Ville de Fort-de-France (BIXA) — Serie "An tan lontan"\n3. Ville de Fort-de-France (BIXA) — Serie Aime Cesaire type Pixar\n4. Evil P — Voix d''Evil Tik dans MOOSTIK + clip. Accepte.\n5. Marginal, 6. Evil Pichon (solo), 7. Mercenaire (TMG), 8. Krys (218K FB)\n\nDiffusion :\n9. Martinique 1ere — Diffusion MOOSTIK (en discussion)\n10. RCI — Pepites, Random inscrit\n\nMarketing Digital :\n11. Wizzee (telecom) — Google Ads + Meta, actif\n12. GoodCircle (B2B ESG/RSE) — Google Ads + Meta, actif\n\n## PRIORITES\nP0 : Proposition Digicel + Warcraft Google Ads\nP1 : RDV Digicel/WITH-YOU. Proposition Fort-de-France. MOOSTIK suite.\nP2 : Clips artistes. Random sur RCI. Phase 0 Orion.\n\n## ALLIANCES INSTITUTIONNELLES\nBIXA (DAC Fort-de-France), Martinique 1ere (France TV), RCI, WITH-YOU.\n\n## LES 7 FRONTS\nEconomique (Orion + Digicel + Wizzee/GoodCircle), Culturel (MOOSTIK + clips), Technologique (Byss Emploi + Orion + Evren-Kairos), Politique (Eveil + Random + Toxic), Ideologique (Cadifor + Senzaris), Informationnel (RadarDiplo + Toxic), Identitaire (Leopold > Gary).\n\n10 projets clients. 87,54 EUR de Google Ads = 11 593 vues YouTube en 20h.\n349K vues Instagram. 159 MB de TypeScript. 997 pages de lore. 14 000 heures de FM12. 1 SAS fondee.\n\nFini de jouer.', 'pipeline', ARRAY['pipeline','clients','digicel','sotai','priorites','alliances'], 350, 23);

-- ═══════════════════════════════════════════════════════
-- DONE — All 7 empty tables now have real data
-- invoices: 9 rows
-- interactions: 15 rows
-- activities: 20 rows
-- videos: 5 rows
-- feedback_timeline: 6 rows
-- documents: 5 rows
-- trades: 4 rows
-- lore_entries: 14 rows (5 cartographies + 5 lore + 4 plans)
-- TOTAL: 78 new rows
-- ═══════════════════════════════════════════════════════
