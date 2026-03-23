-- ═══════════════════════════════════════════════════════
-- BYSS GROUP — Seed Data
-- Real prospects + 15 projects + initial prompts
-- ═══════════════════════════════════════════════════════

-- 15 Projects (temples)
INSERT INTO projects (name, slug, description, status, external_url, icon, color, order_index, is_public, is_visible, github_repo, tech_stack) VALUES
('Orion', 'orion', 'SaaS CMO Unifie — 90 agents, 24 plateformes', 'dev', NULL, 'globe', '#D4AF37', 1, true, true, 'Oshinsu/Orion-Global-Marketing', '{next.js,react,supabase,claude}'),
('Byss Emploi', 'byss-emploi', 'Le seul MCP France Travail certifie', 'dev', NULL, 'users', '#3B82F6', 2, true, true, 'Oshinsu/mcp-france-travail', '{next.js,mcp,france-travail}'),
('Random', 'random', '5 inconnus, 1 bar, 1 euro. App sociale.', 'pause', NULL, 'sparkles', '#8B5CF6', 3, true, true, 'Oshinsu/random-rendezvous-now', '{expo,react-native,supabase}'),
('MOOSTIK', 'moostik', 'Animation virale — 349K vues, zero budget', 'active', 'https://moostik.fr', 'clapperboard', '#10B981', 4, true, true, NULL, '{kling,suno,premiere}'),
('APEX 972', 'apex-972', 'Pipeline leads Zenith Eco — PIP4 en production', 'dev', NULL, 'zap', '#F59E0B', 5, false, true, NULL, '{n8n,airtable,360dialog,claude}'),
('Cadifor', 'cadifor', 'Doctrine. 997 pages. Systeme cognitif.', 'active', NULL, 'scroll-text', '#D4AF37', 6, true, true, NULL, '{markdown,lore}'),
('Jurassic Wars', 'jurassic-wars', 'Univers gaming — 73 structures, 31 cites, 5 civilisations', 'dev', NULL, 'gamepad-2', '#EF4444', 7, true, true, 'byss-games/jw-villages', '{godot,unreal-engine-5,blender}'),
('Toxic', 'toxic', 'Rap creole. Le feu sacre. 18 tracks.', 'active', NULL, 'music', '#E94560', 8, true, true, NULL, '{suno,audio}'),
('Byss News', 'byss-news', 'Veille geopolitique — RadarDiplo — 1392 signaux', 'active', NULL, 'newspaper', '#6366F1', 9, true, true, NULL, '{perplexity,claude}'),
('FM12', 'fm12', 'La duree comme arme. 8000 heures.', 'active', NULL, 'timer', '#1A1A1A', 10, true, false, NULL, '{football-manager}'),
('An tan lontan', 'an-tan-lontan', 'Docuserie histoire Martinique — 10 episodes', 'dev', NULL, 'camera', '#92400E', 11, true, true, NULL, '{kling,nano-banana-pro,suno}'),
('Cesaire Pixar', 'cesaire-pixar', 'Animation Cesaire — heritage vivant — 10 sequences', 'dev', NULL, 'palette', '#7C3AED', 12, true, true, NULL, '{kling,nano-banana-pro,suno}'),
('Operation Eveil', 'eveil', 'Mouvement politique — 20 mesures, 33 mois, CTM 2028', 'active', NULL, 'flame', '#DC2626', 13, false, true, NULL, '{politique,strategie}'),
('Lignee', 'lignee', 'Capital genealogique Bissol. ADN comme actif.', 'active', NULL, 'git-branch', '#D4AF37', 14, false, true, NULL, '{genealogie}'),
('SOTAI', 'sotai', 'Collectif production video IA Martinique', 'active', NULL, 'video', '#0EA5E9', 15, true, true, NULL, '{kling,replicate,claude}');

-- Key prospects (from seed-data-v2.json)
INSERT INTO prospects (name, sector, phase, score, probability, estimated_basket, key_contact, email, phone, next_action, services, mrr, notes, memorable_phrase, pain_points) VALUES
('DIGICEL / DAFG', 'Telecoms', 'demo', 5, 70, 42000, 'Victor Despointes', 'corida@corida-pub.fr', '', 'Relancer Victor — closer Croissance', '{video_ia,images_ia,google_ads}', 0, 'Victor a dit Dingue!! a la demo video IA. Via WITH-YOU.', 'Vos concurrents fatiguent. Vos creatives aussi. On les reveille.', 'CPA Wizzee monte — fatigue creative. Free et Orange grignotent.'),
('GBH (Clement+Jumbo+Europcar)', 'Conglomerat', 'prospect', 5, 50, 52000, 'Naomie Phanor', 'naomie.phanor@gbh.fr', '0696 81 76 05', 'Email Naomie + video demo Clement', '{video_ia,ecommerce,google_ads}', 0, 'Groupe 6Md EUR. Clement 100K visiteurs. Europcar+Jumbo Ads sans video.', 'Un touriste loue chez Jumbo et ne sait pas que Clement est du meme groupe.', 'Com en silo. Clement 0 e-com. Europcar CPA non optimise.'),
('CMT TOURISME', 'Institution', 'prospect', 5, 55, 48000, 'Claude Bulot Piault', 'claude.piault@martiniquetourisme.com', '05 96 61 61 77', '5 emails simultanes', '{video_ia,images_ia,site_web,google_ads,chatbot}', 0, '11 emails nominatifs = avantage massif. martinique.org pas immersif.', 'Le Costa Rica a 50 videos drone sur YouTube. La Martinique en merite 500.', 'MQ perd la bataille visuelle Caraibes. Contenu institutionnel, pas experientiel.'),
('Wizzee', 'Telecoms', 'signe', 4, 100, 18000, 'Stephane Eloy', '', '', 'Maintenir MRR + upsell video IA', '{google_ads,meta_ads}', 1500, 'Client actif depuis 2023 via BeeCee. Google Ads + Meta multi-canal.', 'Chaque euro place revient triple.', 'CPA en hausse, besoin de creatives fraiches.'),
('GoodCircle', 'ESG/RSE', 'signe', 3, 100, 12000, '', '', '', 'Maintenir MRR + proposer video', '{google_ads,meta_ads}', 1000, 'Client actif. B2B ESG/RSE positionnement.', 'La RSE sans preuve, cest du greenwashing.', 'Visibilite B2B limitee.'),
('Fort-de-France (BIXA)', 'Institution', 'proposition', 5, 80, 25000, 'Via BIXA', '', '', 'Livrer An tan lontan + Cesaire Pixar', '{video_ia,images_ia}', 0, 'Commande recue via BIXA. An tan lontan + Cesaire Pixar.', 'Fort-de-France merite un recit digne de son histoire.', 'Patrimoine culturel non mis en valeur numeriquement.'),
('ORANGE AG', 'Telecoms', 'prospect', 5, 35, 55000, '', '', '', 'Identifier le bon contact Ads/Digital', '{video_ia,google_ads}', 0, 'Budget ads massif mais acces difficile.', 'Orange depense plus que Digicel en ads. On peut faire mieux pour moins.', 'Ads non optimises IA. Creatives standard.'),
('SFR CARAIBE', 'Telecoms', 'prospect', 4, 30, 35000, '', '', '', 'Trouver decision maker Ads', '{video_ia,google_ads}', 0, 'Troisieme operateur. Moins de budget mais plus agile.', '', 'Perception marque faible vs Orange et Digicel.'),
('DISTILLERIE JM', 'Rhum', 'prospect', 5, 45, 28000, '', '', '', 'Proposer pack video immersif', '{video_ia,images_ia,site_web}', 0, 'Marque premium. Potentiel video immersif enorme.', 'Le rhum JM na pas besoin de publicite. Il a besoin dune legende.', 'E-commerce sous-exploite. Storytelling absent.'),
('MEDEF MQ', 'Institution', 'contacte', 4, 40, 15000, '', '', '', 'Showcase MEDEF/CE (50-100 execs)', '{video_ia,agents_ia}', 0, 'Showcase possible devant 50-100 decideurs.', 'Le MEDEF ne fait pas de pub. Il fait du pouvoir.', 'Evenements non digitalises.');

-- 20 Mesures Eveil
INSERT INTO eveil_mesures (number, title, pillar, status, progress) VALUES
(1, 'Fibre optique 100% territoire', 'numerique', 'planifie', 0),
(2, 'Campus numerique (formation IA/dev)', 'numerique', 'planifie', 0),
(3, 'Zone franche numerique Fort-de-France', 'numerique', 'planifie', 0),
(4, 'Souverainete alimentaire 50%', 'terre', 'planifie', 0),
(5, 'Cooperative agricole IA (prix justes)', 'terre', 'planifie', 0),
(6, 'Depollution chlordecone (biotech)', 'terre', 'planifie', 0),
(7, 'Fonds culture creole 5M EUR/an', 'culture', 'planifie', 0),
(8, 'Studio production IA public', 'culture', 'planifie', 0),
(9, 'Archive numerique patrimoine', 'culture', 'planifie', 0),
(10, 'Service civique numerique 16-25 ans', 'jeunesse', 'planifie', 0),
(11, 'Bourse entrepreneuriat jeune 18-30', 'jeunesse', 'planifie', 0),
(12, 'Mentorat IA pour lyceens', 'jeunesse', 'planifie', 0),
(13, 'Accord cadre Guadeloupe-Guyane', 'caraibe', 'planifie', 0),
(14, 'Hub logistique caribeen', 'caraibe', 'planifie', 0),
(15, 'Passeport numerique caribeen', 'caraibe', 'planifie', 0),
(16, 'Energie renouvelable 80%', 'terre', 'planifie', 0),
(17, 'Transport maritime electrique', 'caraibe', 'planifie', 0),
(18, 'Plateforme e-sante territoriale', 'numerique', 'planifie', 0),
(19, 'Incubateur IA caribeen', 'numerique', 'planifie', 0),
(20, 'Constitution numerique martiniquaise', 'numerique', 'en_cours', 5);
