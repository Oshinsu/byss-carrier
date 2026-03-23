-- ═══════════════════════════════════════════════════════════════
-- 007_import_all_xlsx.sql
-- Full XLSX data import: contacts, bible de vente, grille tarifaire, templates
-- Generated from BYSS incroyable Excel files
-- ═══════════════════════════════════════════════════════════════

BEGIN;

-- Extend universe CHECK to include 'bible'
ALTER TABLE lore_entries DROP CONSTRAINT IF EXISTS lore_entries_universe_check;
ALTER TABLE lore_entries ADD CONSTRAINT lore_entries_universe_check
  CHECK (universe IN ('cadifor','jurassic_wars','eveil','toxic','lignee','bible'));

-- ═══════════════════════════════════════════════════════════════
-- INTEL_ENTITIES — contacts from contacts_martinique_byss_group_ULTRA_FINAL.xlsx
-- ═══════════════════════════════════════════════════════════════

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('economique', 'Pierre Canton-Bacara', 'Télécoms', 'DIGICEL ANTILLES FRANÇAISES GUYANE (DAFG) -- PDG', '[{"poste": "PDG", "telephone": "+596 596 42 09 00", "email": "contact@digicelgroup.fr", "source": "Pappers"}]'::jsonb, 'PDG depuis 2020. CA 155M€. Client cible #1 BYSS GROUP.', ARRAY['Télécoms','Pappers'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('economique', 'Lars P. Reichelt', 'Télécoms', 'DIGICEL ANTILLES FRANÇAISES GUYANE -- PDG (mentions légales)', '[{"poste": "PDG (mentions légales)", "source": "Mentions légales"}]'::jsonb, 'Mentionné sur digicelbusiness.fr.', ARRAY['Télécoms','Mentions légales'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('economique', 'Astrid Dollin', 'Télécoms', 'DIGICEL ANTILLES FRANÇAISES GUYANE -- Responsable Marketing Digicel Business', '[{"poste": "Responsable Marketing Digicel Business", "source": "EWAG 2024"}]'::jsonb, 'Marketing B2B. Visible presse locale.', ARRAY['Télécoms','EWAG 2024'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('economique', 'Claire Saussay', 'Télécoms', 'DIGICEL BUSINESS -- Chef des Ventes Martinique', '[{"poste": "Chef des Ventes Martinique", "source": "EWAG 2024"}]'::jsonb, '10+ ans. Manage 3 commerciaux + grands groupes.', ARRAY['Télécoms','EWAG 2024'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('economique', 'Frédéric Lagrenade', 'Télécoms', 'DIGICEL BUSINESS -- Resp. équipe Core VoIP', '[{"poste": "Resp. équipe Core VoIP", "source": "EWAG"}]'::jsonb, 'Technique.', ARRAY['Télécoms','EWAG'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('economique', 'Janyne Rosillette', 'Télécoms', 'DIGICEL BUSINESS -- Resp. Administration des Ventes', '[{"poste": "Resp. Administration des Ventes", "source": "EWAG"}]'::jsonb, 'ADV.', ARRAY['Télécoms','EWAG'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('economique', 'Olivier Brisfert', 'Télécoms', 'DIGICEL BUSINESS -- Responsable IP Transport', '[{"poste": "Responsable IP Transport", "source": "EWAG"}]'::jsonb, 'Infrastructure réseau.', ARRAY['Télécoms','EWAG'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('economique', 'Yann Kerebel', 'Télécoms', 'DIGICEL (historique) -- Ex-PDG DAFG', '[{"poste": "Ex-PDG DAFG", "linkedin": "linkedin.com/in/kerebel", "source": "Viadeo"}]'::jsonb, 'Réseau. A dirigé 5 marchés FR.', ARRAY['Télécoms','Viadeo'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('economique', 'Sébastien Aube', 'Télécoms', 'DIGICEL (historique) -- Ex-DG MQ / Ex-Dir. Mktg & Com', '[{"poste": "Ex-DG MQ / Ex-Dir. Mktg & Com", "source": "Viadeo"}]'::jsonb, 'Historique.', ARRAY['Télécoms','Viadeo'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('economique', 'Samir Benzahra', 'Télécoms', 'ORANGE ANTILLES-GUYANE -- Directeur Orange Antilles-Guyane', '[{"poste": "Directeur Orange Antilles-Guyane", "linkedin": "linkedin.com/in/samir-benzahra-574a734", "source": "RCI/EWAG"}]'::jsonb, 'Depuis sept. 2023. ~1400 salariés.', ARRAY['Télécoms','RCI/EWAG'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('economique', 'Frédéric Jarjat', 'Télécoms', 'ORANGE ANTILLES-GUYANE -- Directeur de la Transformation', '[{"poste": "Directeur de la Transformation", "linkedin": "linkedin.com/in/frederic-jarjat-2463abb6", "source": "LinkedIn"}]'::jsonb, 'Feuille de route transformation.', ARRAY['Télécoms','LinkedIn'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('economique', 'Chantal Maurice', 'Télécoms', 'ORANGE ANTILLES-GUYANE -- Déléguée Régionale Guadeloupe', '[{"poste": "Déléguée Régionale Guadeloupe", "source": "France Guyane 2025"}]'::jsonb, 'Depuis fin 2025. Parcours marketing/com.', ARRAY['Télécoms','France Guyane 2025'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('economique', 'Frédéric Hayot', 'Télécoms', 'SFR CARAÏBE / OUTREMER TELECOM -- Directeur Général', '[{"poste": "Directeur Général", "source": "LinkedIn SFR"}]'::jsonb, 'DG. 300+ salariés. Filiale Altice.', ARRAY['Télécoms','LinkedIn SFR'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('economique', 'Edgard Nemorin', 'Télécoms', 'SFR CARAÏBE -- Dir. Marketing, Communication, Commercial', '[{"poste": "Dir. Marketing, Communication, Commercial", "linkedin": "linkedin.com/in/edgard-nemorin-0b146627", "source": "LinkedIn"}]'::jsonb, 'Sciences Po. Profil marketing clé.', ARRAY['Télécoms','LinkedIn'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('economique', 'Emmanuel Compain', 'Télécoms', 'SFR CARAÏBE -- Directeur Marketing (historique)', '[{"poste": "Directeur Marketing (historique)", "source": "Viadeo"}]'::jsonb, 'Depuis 2016.', ARRAY['Télécoms','Viadeo'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('economique', 'Maxime Lombardini', 'Télécoms', 'FREE CARAÏBE -- Président', '[{"poste": "Président", "source": "Pappers"}]'::jsonb, 'SAS. ~12 salariés, CA ~17.5M€.', ARRAY['Télécoms','Pappers'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('media', 'Victor Huyghues Despointes', 'Agence Com', 'CORIDA / WITH-YOU ANTILLES -- Directeur Général', '[{"poste": "Directeur Général", "linkedin": "with-you.be", "source": "EWAG 2025"}]'::jsonb, 'DG Corida (40 ans) + With-You. Agence créative 2023-2024-2025. Client Digicel. PORTE D''ENTRÉE BYSS.', ARRAY['Agence Com','EWAG 2025'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('media', 'Célia Claire', 'Agence Com', 'CORIDA -- Directrice', '[{"poste": "Directrice", "source": "EWAG 2025"}]'::jsonb, 'Branding local. Marques iconiques MQ.', ARRAY['Agence Com','EWAG 2025'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('media', 'Grégory Arnolin', 'Agence Com', 'CORIDA / WITH-YOU -- Associé / Directeur Conseil', '[{"poste": "Associé / Directeur Conseil", "source": "EWAG 2025"}]'::jsonb, 'Cité dans interview EWAG.', ARRAY['Agence Com','EWAG 2025'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('economique', 'Bernard Hayot', 'Grande Distribution', 'GBH -- Président Fondateur', '[{"poste": "Président Fondateur", "telephone": "0596 50 37 56", "email": "Service.CommunicationGbh@gbh.fr", "linkedin": "gbh.fr", "source": "GBH.fr"}]'::jsonb, 'CA 5Md€, 18 000 salariés.', ARRAY['Grande Distribution','GBH.fr'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('economique', 'Stéphane Hayot', 'Grande Distribution', 'GBH -- Directeur Général', '[{"poste": "Directeur Général", "source": "LSA"}]'::jsonb, 'DG pôle distribution + activités industrielles.', ARRAY['Grande Distribution','LSA'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('economique', 'Rodolphe Hayot', 'Automobile', 'GBH -- Directeur pôle automobile', '[{"poste": "Directeur pôle automobile", "source": "GBH.fr"}]'::jsonb, 'Renault, Dacia, Hyundai, Nissan.', ARRAY['Automobile','GBH.fr'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('economique', 'Nicolas de Pompignan', 'Grande Distribution', 'GBH -- Directeur (gendre)', '[{"poste": "Directeur (gendre)", "source": "GBH.fr"}]'::jsonb, 'Direction groupe.', ARRAY['Grande Distribution','GBH.fr'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('economique', 'Christophe Bermont', 'Grande Distribution', 'GBH / CARREFOUR -- Dir. Régional Carrefour Martinique', '[{"poste": "Dir. Régional Carrefour Martinique", "source": "GBH.fr"}]'::jsonb, 'Distribution alimentaire MQ.', ARRAY['Grande Distribution','GBH.fr'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('economique', 'Charles Larcher', 'Agroalimentaire', 'GBH / SPIRIBAM -- Dir. Rhum Clément / VP MEDEF MQ', '[{"poste": "Dir. Rhum Clément / VP MEDEF MQ", "source": "GBH.fr/MEDEF"}]'::jsonb, 'Depuis 2003. Commission éducation/jeunesse MEDEF.', ARRAY['Agroalimentaire','GBH.fr/MEDEF'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('economique', 'Christophe Medlock', 'Automobile', 'GBH -- Directeur Martinique Automobiles', '[{"poste": "Directeur Martinique Automobiles", "source": "GBH.fr"}]'::jsonb, 'Depuis 1988.', ARRAY['Automobile','GBH.fr'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('economique', 'Véronique Louise-Alexandrine', 'Grande Distribution', 'GBH / MR. BRICOLAGE -- Directrice Mr. Bricolage Petit-Manoir', '[{"poste": "Directrice Mr. Bricolage Petit-Manoir", "source": "GBH.fr"}]'::jsonb, NULL, ARRAY['Grande Distribution','GBH.fr'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('economique', 'Nicolas Marraud des Grottes', 'Agroalimentaire', 'BANAMART -- Dirigeant', '[{"poste": "Dirigeant", "source": "Contact-Entreprises"}]'::jsonb, 'CA Contact-Entreprises. Filière banane.', ARRAY['Agroalimentaire','Contact-Entreprises'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('economique', 'Josiane Capron', 'Industrie', 'SACHERIE (La Sacherie) -- PDG', '[{"poste": "PDG", "source": "Contact-Entreprises"}]'::jsonb, 'Émission ''Profession Passion''.', ARRAY['Industrie','Contact-Entreprises'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('economique', 'Stéphane Timbert', 'Banque', 'BRED BANQUE POPULAIRE -- Dir. Régional Martinique-Guyane', '[{"poste": "Dir. Régional Martinique-Guyane", "source": "Newsroom BRED 2025"}]'::jsonb, 'Mécénat Parc naturel marin.', ARRAY['Banque','Newsroom BRED 2025'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('economique', 'Jean-Paul Julia', 'Banque', 'BRED BANQUE POPULAIRE -- Directeur Général National', '[{"poste": "Directeur Général National", "source": "RCI 2023"}]'::jsonb, 'DG national. Visite MQ régulière.', ARRAY['Banque','RCI 2023'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('economique', 'Leila Salimi', 'Banque', 'BRED BANQUE POPULAIRE -- Directrice de la Communication', '[{"poste": "Directrice de la Communication", "source": "Newsroom BRED"}]'::jsonb, 'Contact presse national.', ARRAY['Banque','Newsroom BRED'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('economique', 'Alex Rosette', 'Banque', 'CRÉDIT AGRICOLE MQ-GF -- Président du CA', '[{"poste": "Président du CA", "source": "Manageo/Verif"}]'::jsonb, 'Banque 100% locale, ~250 salariés.', ARRAY['Banque','Manageo/Verif'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('economique', 'Thibault Reverse', 'Banque', 'CRÉDIT AGRICOLE MQ-GF -- Directeur Général', '[{"poste": "Directeur Général", "source": "Manageo"}]'::jsonb, 'DG.', ARRAY['Banque','Manageo'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('economique', 'France Villette', 'Banque', 'CRÉDIT AGRICOLE MQ-GF -- Directrice Générale', '[{"poste": "Directrice Générale", "source": "LinkedIn CA MQ"}]'::jsonb, 'Présentait résultats AG 2024.', ARRAY['Banque','LinkedIn CA MQ'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('economique', 'Pierre Alain Peguy', 'Banque', 'CRÉDIT AGRICOLE MQ-GF -- Dir. Finances/Marketing/Relation Client', '[{"poste": "Dir. Finances/Marketing/Relation Client", "source": "LinkedIn CA MQ"}]'::jsonb, 'Arrivé mars 2024.', ARRAY['Banque','LinkedIn CA MQ'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('economique', 'Gilles Pain', 'Banque', 'CRÉDIT AGRICOLE MQ-GF -- Directeur des Réseaux', '[{"poste": "Directeur des Réseaux", "source": "LinkedIn CA MQ"}]'::jsonb, 'Terrain, événements agences.', ARRAY['Banque','LinkedIn CA MQ'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('economique', 'Eric Zaire', 'Banque', 'CRÉDIT AGRICOLE MQ-GF -- Vice-Président', '[{"poste": "Vice-Président", "source": "Verif"}]'::jsonb, 'VP du CA.', ARRAY['Banque','Verif'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('economique', 'Didier Grand', 'Banque', 'CRÉDIT AGRICOLE MQ-GF -- Ex-Directeur Général', '[{"poste": "Ex-Directeur Général", "source": "Contact-Entreprises"}]'::jsonb, 'Historique. Déjeuner-débat Contact-Entrep.', ARRAY['Banque','Contact-Entreprises'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('economique', 'Jean-Yves Bonnaire', 'BTP', 'BTP — Gestion risques naturels -- Président Contact-Entrep. / Chef d''entreprise BTP', '[{"poste": "Président Contact-Entrep. / Chef d''entreprise BTP", "source": "Contact-Entreprises"}]'::jsonb, 'Président Contact-Entreprises depuis 2020. Spécialiste résilience/risques naturels.', ARRAY['BTP','Contact-Entreprises'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('economique', 'Benoit Louault', 'BTP', 'COLAS MARTINIQUE -- Président', '[{"poste": "Président", "source": "Pappers 2024"}]'::jsonb, 'Nommé 2024. Filiale Colas/Bouygues.', ARRAY['BTP','Pappers 2024'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('economique', 'Jean-Luc Galy', 'Immobilier', 'SIMAR (Sté Immobilière MQ) -- Directeur Général', '[{"poste": "Directeur Général", "linkedin": "simar.fr", "source": "Pappers 2025"}]'::jsonb, 'DG depuis 2025 (remplace Bruno Ribac).', ARRAY['Immobilier','Pappers 2025'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('economique', 'Delphin Jean-Michel Loutoby', 'Immobilier', 'MARTINIQUAISE D''HLM (SMHLM) -- Président du CA', '[{"poste": "Président du CA", "source": "Pappers"}]'::jsonb, 'Président CA.', ARRAY['Immobilier','Pappers'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('economique', 'Jean-Marc Henry', 'Immobilier', 'MARTINIQUAISE D''HLM (SMHLM) -- Directeur Général', '[{"poste": "Directeur Général", "source": "Pappers"}]'::jsonb, 'DG.', ARRAY['Immobilier','Pappers'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('economique', 'Christian Louis-Joseph', 'BTP', 'SEBTPAM -- Dirigeant', '[{"poste": "Dirigeant", "source": "Contact-Entreprises"}]'::jsonb, 'CA Contact-Entreprises. Syndicat BTP.', ARRAY['BTP','Contact-Entreprises'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('economique', 'Steve Patole', 'BTP', 'SEBTPAM -- Dirigeant', '[{"poste": "Dirigeant", "source": "Contact-Entreprises"}]'::jsonb, 'CA Contact-Entreprises.', ARRAY['BTP','Contact-Entreprises'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('economique', 'Dominique Chauvet', 'BTP', 'GTCM -- Dirigeant', '[{"poste": "Dirigeant", "source": "Contact-Entreprises"}]'::jsonb, 'CA Contact-Entreprises.', ARRAY['BTP','Contact-Entreprises'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('economique', 'Patrice Fabre', 'Tourisme', 'KARIBEA HÔTELS / GFD -- Président SAS GFD / Trésorier MEDEF MQ', '[{"poste": "Président SAS GFD / Trésorier MEDEF MQ", "email": "contact@karibeahotel.com", "source": "MEDEF MQ 2025"}]'::jsonb, 'Chaîne Karibea. Commission Tourisme MEDEF.', ARRAY['Tourisme','MEDEF MQ 2025'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('economique', 'Enguerrand Fabre', 'Tourisme', 'KARIBEA HÔTELS & RÉSIDENCES -- Directeur GFD', '[{"poste": "Directeur GFD", "source": "MEDEF MQ 2025"}]'::jsonb, 'Direction opérationnelle.', ARRAY['Tourisme','MEDEF MQ 2025'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('economique', 'Celia Sainville', 'Tourisme', 'HABITATION CLÉMENT -- Responsable Tourisme', '[{"poste": "Responsable Tourisme", "source": "MEDEF MQ 2025"}]'::jsonb, 'Tourisme culturel + rhum. GBH.', ARRAY['Tourisme','MEDEF MQ 2025'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('institutionnelle', 'Catherine Rodap', 'Patronat', 'MEDEF MARTINIQUE -- Présidente', '[{"poste": "Présidente", "linkedin": "medef-martinique.fr", "source": "EWAG/FEDOM"}]'::jsonb, 'Voix patronale forte post-crise 2024.', ARRAY['Patronat','EWAG/FEDOM'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('economique', 'Nathalie Sébastien', 'Transport', 'SAMAC (Aéroport Aimé Césaire) -- VP MEDEF / Présidente Directoire SAMAC', '[{"poste": "VP MEDEF / Présidente Directoire SAMAC", "source": "MEDEF MQ"}]'::jsonb, 'Dirige l''aéroport MQ.', ARRAY['Transport','MEDEF MQ'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('economique', 'Xavier Fichau', 'Énergie', 'EDF MARTINIQUE -- Secrétaire MEDEF / Directeur EDF MQ', '[{"poste": "Secrétaire MEDEF / Directeur EDF MQ", "source": "MEDEF MQ"}]'::jsonb, 'Double casquette EDF + MEDEF.', ARRAY['Énergie','MEDEF MQ'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('institutionnelle', 'Philippe Jock', 'Institution', 'CCI MARTINIQUE -- Président', '[{"poste": "Président", "email": "contact@martinique.cci.fr", "linkedin": "martinique.cci.fr", "source": "LinkedIn CCI"}]'::jsonb, '36 000 entreprises. Gestion Grand Port + SAMAC.', ARRAY['Institution','LinkedIn CCI'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('media', 'Alexandra Elize', 'Média', 'RCI GROUP — Antilles -- Directrice Générale', '[{"poste": "Directrice Générale", "source": "FEDOM"}]'::jsonb, 'DG groupe média RCI.', ARRAY['Média','FEDOM'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('institutionnelle', 'Pierre Marie-Joseph', 'Patronat', 'AMPI MARTINIQUE -- Président d''honneur', '[{"poste": "Président d''honneur", "source": "FEDOM"}]'::jsonb, 'Association MQ Promotion Industrie.', ARRAY['Patronat','FEDOM'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('sociale', 'Aude Brador', 'Environnement', 'PARC NATUREL MARIN MQ -- Directrice Déléguée', '[{"poste": "Directrice Déléguée", "source": "Outremers360"}]'::jsonb, 'Partenariats public-privé.', ARRAY['Environnement','Outremers360'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('sociale', 'Jean-Max Léonard', 'Réseau', 'RÉSEAU ENTREPRENDRE MARTINIQUE -- Président (depuis 2024)', '[{"poste": "Président (depuis 2024)", "source": "REM site"}]'::jsonb, '72 chefs d''entreprise membres. ~100 lauréats.', ARRAY['Réseau','REM site'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('sociale', 'Anne-Laurence Ebadere', 'Réseau', 'RÉSEAU ENTREPRENDRE MARTINIQUE -- Ex-Présidente', '[{"poste": "Ex-Présidente", "source": "LinkedIn REM"}]'::jsonb, NULL, ARRAY['Réseau','LinkedIn REM'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('sociale', 'Lucie Manuel', 'Réseau', 'CONTACT-ENTREPRISES -- Ex-Présidente', '[{"poste": "Ex-Présidente", "source": "EWAG 2021"}]'::jsonb, 'Livre vert ''Martinique Vertueuse''.', ARRAY['Réseau','EWAG 2021'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('economique', 'Line Pardon', 'Industrie', '-- Intervenante Semaine Industrie 2025', '[{"poste": "Intervenante Semaine Industrie 2025", "source": "Contact-Entrep. 2025"}]'::jsonb, 'Appropriation industrielle MQ.', ARRAY['Industrie','Contact-Entrep. 2025'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('sociale', 'Annie-Dominique Jean-Philippe', 'Réseau', 'RISK / CONTACT-ENTREPRISES -- Vice-Présidente', '[{"poste": "Vice-Présidente", "source": "Site CE"}]'::jsonb, 'Société RISK.', ARRAY['Réseau','Site CE'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('economique', 'Valérie Pavius', 'Énergie', 'SARA / CONTACT-ENTREPRISES -- Vice-Président', '[{"poste": "Vice-Président", "source": "Site CE"}]'::jsonb, 'SARA = Société Anonyme de Raffinerie des Antilles.', ARRAY['Énergie','Site CE'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('sociale', 'Arnaud Lafosse-Marin', 'Réseau', 'CONTACT-ENTREPRISES -- Trésorier', '[{"poste": "Trésorier", "source": "Site CE"}]'::jsonb, NULL, ARRAY['Réseau','Site CE'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('sociale', 'Isabelle Ollivier', 'Réseau', 'CONTACT-ENTREPRISES -- Secrétaire Générale', '[{"poste": "Secrétaire Générale", "source": "Site CE"}]'::jsonb, NULL, ARRAY['Réseau','Site CE'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('institutionnelle', 'Céline Rose', 'Patronat', 'CPME MARTINIQUE / CONTACT-ENTREPRISES -- Représentante CPME', '[{"poste": "Représentante CPME", "source": "Site CE"}]'::jsonb, 'Confédération PME.', ARRAY['Patronat','Site CE'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('institutionnelle', 'Philippe Negouai', 'Patronat', 'FTPE / CONTACT-ENTREPRISES -- Représentant FTPE', '[{"poste": "Représentant FTPE", "source": "Site CE"}]'::jsonb, 'Fédération TPE.', ARRAY['Patronat','Site CE'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('institutionnelle', 'Nina Grubo', 'Patronat', 'ASSOC. FEMMES CHEFS D''ENTREPRISES MQ -- Représentante', '[{"poste": "Représentante", "source": "Site CE"}]'::jsonb, NULL, ARRAY['Patronat','Site CE'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('sociale', 'Etienne de Reynal', 'Réseau', 'CONTACT-ENTREPRISES -- Membre Bureau', '[{"poste": "Membre Bureau", "source": "Site CE"}]'::jsonb, 'Famille de Reynal — réseau historique MQ.', ARRAY['Réseau','Site CE'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('media', 'Steve Chalono', 'Média/Réseau', 'CONTACT-ENTREPRISES -- Membre Bureau', '[{"poste": "Membre Bureau", "source": "Site CE"}]'::jsonb, 'Réalisateur web-émission ''Profession Passion''.', ARRAY['Média/Réseau','Site CE'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('sociale', 'Catherine Bois-Caberty', 'Réseau', 'CONTACT-ENTREPRISES -- Membre Bureau', '[{"poste": "Membre Bureau", "source": "Site CE"}]'::jsonb, NULL, ARRAY['Réseau','Site CE'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('sociale', 'Richard Rosemain', 'Réseau', 'CONTACT-ENTREPRISES -- Membre Bureau', '[{"poste": "Membre Bureau", "source": "Site CE"}]'::jsonb, NULL, ARRAY['Réseau','Site CE'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('sociale', 'Michel Marty', 'Réseau', 'CONTACT-ENTREPRISES -- Membre Bureau', '[{"poste": "Membre Bureau", "source": "Site CE"}]'::jsonb, NULL, ARRAY['Réseau','Site CE'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('sociale', 'Boris André Constant', 'Réseau', 'CONTACT-ENTREPRISES -- Membre Bureau', '[{"poste": "Membre Bureau", "source": "Site CE"}]'::jsonb, NULL, ARRAY['Réseau','Site CE'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('media', 'Flora Eliazord', 'Média', 'CONTACT-ENTREPRISES -- Membre Bureau', '[{"poste": "Membre Bureau", "source": "Site CE"}]'::jsonb, 'Réalisatrice ''Profession Passion''.', ARRAY['Média','Site CE'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('sociale', 'Claire Richer', 'Réseau', 'CONTACT-ENTREPRISES -- Membre Bureau', '[{"poste": "Membre Bureau", "source": "Site CE"}]'::jsonb, NULL, ARRAY['Réseau','Site CE'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('sociale', 'Emmanuel Joseph', 'Réseau', 'CONTACT-ENTREPRISES -- Membre Bureau', '[{"poste": "Membre Bureau", "source": "Site CE"}]'::jsonb, NULL, ARRAY['Réseau','Site CE'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('sociale', 'Michel Juston', 'Réseau', 'CONTACT-ENTREPRISES -- Membre Bureau', '[{"poste": "Membre Bureau", "source": "Site CE"}]'::jsonb, NULL, ARRAY['Réseau','Site CE'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('sociale', 'Annick Ourmiah', 'Réseau', 'CONTACT-ENTREPRISES -- Membre Bureau', '[{"poste": "Membre Bureau", "source": "Site CE"}]'::jsonb, NULL, ARRAY['Réseau','Site CE'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('sociale', 'Alain Arnauld', 'Réseau', 'CONTACT-ENTREPRISES -- Membre Bureau', '[{"poste": "Membre Bureau", "source": "Site CE"}]'::jsonb, NULL, ARRAY['Réseau','Site CE'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('sociale', 'Dorothée De Reynal-Gallet', 'Réseau', 'RÉSEAU ENTREPRENDRE MQ -- Administratrice REM', '[{"poste": "Administratrice REM", "source": "LinkedIn REM"}]'::jsonb, NULL, ARRAY['Réseau','LinkedIn REM'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('sociale', 'Elise Fonchy', 'Réseau', 'RÉSEAU ENTREPRENDRE MQ -- Administratrice REM', '[{"poste": "Administratrice REM", "source": "LinkedIn REM"}]'::jsonb, NULL, ARRAY['Réseau','LinkedIn REM'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('sociale', 'Valérie de Gryse', 'Réseau', 'RÉSEAU ENTREPRENDRE MQ -- Administratrice REM', '[{"poste": "Administratrice REM", "source": "LinkedIn REM"}]'::jsonb, NULL, ARRAY['Réseau','LinkedIn REM'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('sociale', 'Rodrigue Diser', 'Réseau', 'RÉSEAU ENTREPRENDRE MQ -- Administrateur REM', '[{"poste": "Administrateur REM", "source": "LinkedIn REM"}]'::jsonb, NULL, ARRAY['Réseau','LinkedIn REM'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('sociale', 'Jean-Jacques Brichant', 'Réseau', 'RÉSEAU ENTREPRENDRE MQ -- Ex-Président (fondateur)', '[{"poste": "Ex-Président (fondateur)", "source": "LinkedIn REM"}]'::jsonb, 'Fondateur REM 2011.', ARRAY['Réseau','LinkedIn REM'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('economique', 'Boris Zie', 'Tourisme/Événementiel', 'BELFORT TERRE D''EXPÉRIENCES -- Dirigeant', '[{"poste": "Dirigeant", "source": "LinkedIn REM"}]'::jsonb, 'Accueil événements réseau.', ARRAY['Tourisme/Événementiel','LinkedIn REM'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('economique', 'Fernand Lerychard', 'Immobilier', 'MARTINIQUAISE D''HLM -- Ex-Président du CA', '[{"poste": "Ex-Président du CA", "source": "Pappers"}]'::jsonb, 'Historique.', ARRAY['Immobilier','Pappers'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('institutionnelle', 'Jean-Marc Vigilant', 'Défense/Géopolitique', '-- Conférencier géopolitique', '[{"poste": "Conférencier géopolitique", "source": "Contact-Entrep."}]'::jsonb, 'Conférence ''impact sur la Martinique''.', ARRAY['Défense/Géopolitique','Contact-Entrep.'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('politique', 'Serge Letchimy', 'Politique', 'CTM (Collectivité Territoriale MQ) -- Président du Conseil Exécutif', '[{"poste": "Président du Conseil Exécutif", "linkedin": "linkedin.com/in/serge-letchimy-officiel", "source": "LinkedIn CTM"}]'::jsonb, 'Décideur politique #1 MQ. Marchés publics CTM.', ARRAY['Politique','LinkedIn CTM'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('institutionnelle', 'Dave Drelin', 'Patronat', 'MEDEF GUYANE -- Président', '[{"poste": "Président", "source": "FEDOM"}]'::jsonb, 'Réseau patronal élargi Antilles-Guyane.', ARRAY['Patronat','FEDOM'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('institutionnelle', 'Bruno Blandin', 'Patronat', 'UDE-MEDEF GUADELOUPE -- Président', '[{"poste": "Président", "source": "FEDOM"}]'::jsonb, 'Réseau patronal GP.', ARRAY['Patronat','FEDOM'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('economique', 'Guillaume Gallet de Saint-Aurin', 'Entreprise', 'SINTORIN -- Gérant', '[{"poste": "Gérant", "source": "FEDOM"}]'::jsonb, 'CA FEDOM.', ARRAY['FEDOM'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('institutionnelle', 'Franck Desalme', 'Patronat', 'MPI GUADELOUPE -- Président', '[{"poste": "Président", "source": "FEDOM"}]'::jsonb, 'Mouvement des PMI Guadeloupe.', ARRAY['Patronat','FEDOM'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('institutionnelle', 'Laurent Renouf', 'Patronat Outre-Mer', 'FEDOM -- Délégué Général', '[{"poste": "Délégué Général", "source": "FEDOM"}]'::jsonb, 'Contact national réseau patronal OM.', ARRAY['Patronat Outre-Mer','FEDOM'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('economique', 'Olivier Cotta', 'Énergie', 'SARA (Raffinerie des Antilles) -- Directeur Général', '[{"poste": "Directeur Général", "linkedin": "sara-antilles-guyane.com", "source": "SARA site 2025"}]'::jsonb, 'DG SARA. Pilote transformation écologique. Seule raffinerie Antilles-Guyane. ~321 CDI.', ARRAY['Énergie','SARA site 2025'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('economique', 'Jean-François Rochefort', 'Énergie', 'SARA -- Directeur Général Adjoint', '[{"poste": "Directeur Général Adjoint", "source": "LinkedIn SARA"}]'::jsonb, 'DGA. Partenariats SMA/jeunes.', ARRAY['Énergie','LinkedIn SARA'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('economique', 'Jean-Luc Voyer', 'Énergie', 'SARA -- Directeur des Terminaux Guyane', '[{"poste": "Directeur des Terminaux Guyane", "source": "LinkedIn SARA"}]'::jsonb, 'Réseau SARA élargi.', ARRAY['Énergie','LinkedIn SARA'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('economique', 'Bruno Mencé', 'Transport', 'GRAND PORT MARITIME DE MARTINIQUE -- Directoire', '[{"poste": "Directoire", "source": "Top Outre-Mer 2025"}]'::jsonb, 'Modernisation infra, transition énergétique.', ARRAY['Transport','Top Outre-Mer 2025'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('economique', 'Simon Jean-Joseph', 'Transport/Nautisme', 'PORT DU MARIN -- Dirigeant', '[{"poste": "Dirigeant", "source": "Top Outre-Mer 2025"}]'::jsonb, 'Port de plaisance, économie bleue.', ARRAY['Transport/Nautisme','Top Outre-Mer 2025'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('economique', 'Bruno Brival', 'Tourisme', 'CMT (Comité Martiniquais du Tourisme) -- Directeur', '[{"poste": "Directeur", "email": "info@martinique.org", "linkedin": "martinique.org", "source": "Top Outre-Mer 2025"}]'::jsonb, 'Directeur CMT. Contact clé promotion touristique.', ARRAY['Tourisme','Top Outre-Mer 2025'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('sociale', 'Maurice Veilleur', 'Environnement', 'PARC NATUREL RÉGIONAL DE MARTINIQUE -- Directeur', '[{"poste": "Directeur", "source": "Top Outre-Mer 2025"}]'::jsonb, 'PNR MQ.', ARRAY['Environnement','Top Outre-Mer 2025'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('economique', 'Albert Mongin', 'Entreprise', 'HORIZON -- Entrepreneur', '[{"poste": "Entrepreneur", "source": "Top Outre-Mer 2025"}]'::jsonb, NULL, ARRAY['Entreprise','Top Outre-Mer 2025'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('institutionnelle', 'José Maurice', 'Institution', 'CHAMBRE D''AGRICULTURE MARTINIQUE -- Président', '[{"poste": "Président", "source": "Top Outre-Mer 2025"}]'::jsonb, 'Filière agricole MQ.', ARRAY['Institution','Top Outre-Mer 2025'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('institutionnelle', 'Eric Bellemare', 'Institution', 'CESECEM (Conseil Éco Social Env MQ) -- Président', '[{"poste": "Président", "source": "Top Outre-Mer 2025"}]'::jsonb, 'Conseil économique, social et environnemental.', ARRAY['Institution','Top Outre-Mer 2025'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('institutionnelle', 'Nestor-Bruno Azérot', 'Institution', 'CAP NORD MARTINIQUE -- Président', '[{"poste": "Président", "source": "Top Outre-Mer 2025"}]'::jsonb, 'Communauté d''agglomération Nord MQ.', ARRAY['Institution','Top Outre-Mer 2025'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('institutionnelle', 'André Lesueur', 'Institution', 'ESPACE SUD MARTINIQUE -- Président', '[{"poste": "Président", "source": "Top Outre-Mer 2025"}]'::jsonb, 'Communauté d''agglomération Sud MQ.', ARRAY['Institution','Top Outre-Mer 2025'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('institutionnelle', 'Luc Louison Clemente', 'Institution', 'CACEM -- Président', '[{"poste": "Président", "source": "Top Outre-Mer 2025"}]'::jsonb, 'Communauté d''Agglomération Centre MQ.', ARRAY['Institution','Top Outre-Mer 2025'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('institutionnelle', 'Aurélien Adam', 'Institution', 'ÉTAT / PRÉFECTURE MQ -- Coordonnateur politiques publiques', '[{"poste": "Coordonnateur politiques publiques", "source": "SARA site"}]'::jsonb, 'Soutien porteurs de projets. Financement.', ARRAY['Institution','SARA site'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('sociale', 'Ariane Rinna', 'Réseau', 'CONTACT-ENTREPRISES -- Déléguée Exécutive', '[{"poste": "Déléguée Exécutive", "telephone": "0696 71 08 98", "email": "arinna@contact-entreprises.com", "source": "Site CE"}]'::jsonb, 'Contact opérationnel #2.', ARRAY['Réseau','Site CE'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('economique', 'Franck Ho Hio Hen', 'Automobile/Distribution', 'HO HIO HEN AUTOMOBILE -- Co-dirigeant', '[{"poste": "Co-dirigeant", "linkedin": "hohiohen-mq.com", "source": "InterEntreprises"}]'::jsonb, 'Groupe familial. 220 collaborateurs, 15 sites DOM. Pièces auto toutes marques.', ARRAY['Automobile/Distribution','InterEntreprises'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('economique', 'Hélène Ho Hio Hen', 'Automobile/Distribution', 'HO HIO HEN AUTOMOBILE -- Co-dirigeante', '[{"poste": "Co-dirigeante", "source": "InterEntreprises 2025"}]'::jsonb, 'Développement groupe. Expansion Afrique.', ARRAY['Automobile/Distribution','InterEntreprises 2025'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('economique', 'Catherine Ho Hio Hen', 'Automobile/Distribution', 'HO HIO HEN AUTOMOBILE -- Co-dirigeante', '[{"poste": "Co-dirigeante", "source": "InterEntreprises 2025"}]'::jsonb, NULL, ARRAY['Automobile/Distribution','InterEntreprises 2025'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('economique', 'Famille Parfait', 'Grande Distribution', 'GROUPE PARFAIT (E.Leclerc, Auto GM, SOCOMI) -- Direction', '[{"poste": "Direction", "linkedin": "groupeparfait.com", "source": "Site Groupe Parfait"}]'::jsonb, '4 pôles: distribution (E.Leclerc), immobilier, automobile (12 marques), menuiserie (SOCOMI). Fondation Parfait.', ARRAY['Grande Distribution','Site Groupe Parfait'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('economique', 'Philippe Garon', 'Agroalimentaire', 'BRASSERIE LORRAINE -- Directeur de Production', '[{"poste": "Directeur de Production", "source": "Contact-Entrep."}]'::jsonb, 'Production. Visite Contact-Entreprises.', ARRAY['Agroalimentaire','Contact-Entrep.'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('economique', 'Régine Bellemare', 'Assurance', 'AXA MARTINIQUE -- Agent Général', '[{"poste": "Agent Général", "source": "Pages Jaunes"}]'::jsonb, '9 agences AXA en MQ.', ARRAY['Assurance','Pages Jaunes'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('economique', 'Charles de Drouas', 'Assurance', 'ALLIANZ MARTINIQUE -- Agent Général', '[{"poste": "Agent Général", "source": "Pages Jaunes"}]'::jsonb, 'Route de Didier, FdF.', ARRAY['Assurance','Pages Jaunes'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('economique', 'Alick Angarni', 'Assurance', 'AXA MARTINIQUE -- Agent Général', '[{"poste": "Agent Général", "source": "Pages Jaunes"}]'::jsonb, 'Place Mitterrand, FdF.', ARRAY['Assurance','Pages Jaunes'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('politique', 'Jean-Claude Duverger', 'Politique', 'CTM -- 1er VP Assemblée CTM', '[{"poste": "1er VP Assemblée CTM", "source": "Top Outre-Mer"}]'::jsonb, '1er vice-président Assemblée.', ARRAY['Politique','Top Outre-Mer'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('politique', 'David Zobda', 'Politique', 'VILLE DU LAMENTIN -- Maire', '[{"poste": "Maire", "source": "Top Outre-Mer"}]'::jsonb, 'Maire Le Lamentin. Zone économique majeure.', ARRAY['Politique','Top Outre-Mer'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('politique', 'Justin Pamphile', 'Politique', 'ASSOCIATION DES MAIRES DE MARTINIQUE -- Président', '[{"poste": "Président", "source": "Top Outre-Mer"}]'::jsonb, 'Réseau des 34 maires MQ.', ARRAY['Politique','Top Outre-Mer'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('politique', 'Catherine Conconne', 'Politique', 'SÉNAT — Martinique -- Sénatrice', '[{"poste": "Sénatrice", "source": "Top Outre-Mer"}]'::jsonb, 'Sénatrice MQ.', ARRAY['Politique','Top Outre-Mer'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('media', 'Nicolas Huyghues Despointes', 'Agence Com', 'CORIDA -- Fondateur / Gérant', '[{"poste": "Fondateur / Gérant", "email": "corida@corida-pub.fr", "linkedin": "corida-pub.fr / linkedin.com/company/corida", "source": "Pappers/Corida.fr"}]'::jsonb, 'Fondateur 1986. Père de Victor. 25 collaborateurs. Email confirmé.', ARRAY['Agence Com','Pappers/Corida.fr'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('institutionnelle', 'Fabienne Joseph', 'Patronat', 'MEDEF MARTINIQUE -- Contact événementiel / réservations', '[{"poste": "Contact événementiel / réservations", "telephone": "0696 82 70 10", "email": "fabienne.joseph@medef-martinique.fr", "linkedin": "medef-martinique.fr", "source": "LinkedIn CE"}]'::jsonb, 'Contact direct pour événements MEDEF. Email + tél confirmés.', ARRAY['Patronat','LinkedIn CE'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('sociale', 'Pascal Fardin', 'Réseau', 'CONTACT-ENTREPRISES -- Délégué Général', '[{"poste": "Délégué Général", "telephone": "0696 23 28 23", "email": "pfardin@contact-entreprises.com", "linkedin": "contact-entreprises.com", "source": "Site CE"}]'::jsonb, '320 entreprises adhérentes. Contact #1.', ARRAY['Réseau','Site CE'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('sociale', 'Ariane Rinna', 'Réseau', 'CONTACT-ENTREPRISES -- Déléguée Exécutive', '[{"poste": "Déléguée Exécutive", "telephone": "0696 71 08 98", "email": "arinna@contact-entreprises.com", "source": "Site CE"}]'::jsonb, 'Contact #2.', ARRAY['Réseau','Site CE'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('institutionnelle', 'Fabienne Joseph', 'Patronat', 'MEDEF MARTINIQUE -- Contact événementiel', '[{"poste": "Contact événementiel", "telephone": "0696 82 70 10", "email": "fabienne.joseph@medef-martinique.fr", "source": "LinkedIn CE"}]'::jsonb, NULL, ARRAY['Patronat','LinkedIn CE'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('media', 'Nicolas H. Despointes', 'Agence Com', 'CORIDA -- Fondateur Corida', '[{"poste": "Fondateur Corida", "email": "corida@corida-pub.fr", "linkedin": "corida-pub.fr", "source": "Site Corida"}]'::jsonb, 'Email général agence.', ARRAY['Agence Com','Site Corida'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('economique', 'Direction Com GBH', 'Grande Distribution', 'GBH (Groupe Bernard Hayot) -- Service Communication', '[{"poste": "Service Communication", "telephone": "0596 50 37 56", "email": "Service.CommunicationGbh@gbh.fr", "linkedin": "gbh.fr", "source": "GBH.fr"}]'::jsonb, NULL, ARRAY['Grande Distribution','GBH.fr'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('economique', 'Standard DIGICEL', 'Télécoms', 'DIGICEL DAFG -- Contact général', '[{"poste": "Contact général", "telephone": "+596 596 42 09 00", "email": "contact@digicelgroup.fr", "linkedin": "digicel.fr", "source": "Site Digicel"}]'::jsonb, NULL, ARRAY['Télécoms','Site Digicel'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('economique', 'Digicel Business', 'Télécoms', 'DIGICEL BUSINESS -- Service B2B', '[{"poste": "Service B2B", "telephone": "0596 01 90 62", "email": "business@digicelgroup.fr", "linkedin": "digicelbusiness.fr", "source": "Site Digicel Business"}]'::jsonb, 'Solutions ICT.', ARRAY['Télécoms','Site Digicel Business'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('economique', 'Support ICT Digicel', 'Télécoms', 'DIGICEL BUSINESS -- Support technique B2B', '[{"poste": "Support technique B2B", "email": "supportDBS@digicelgroup.fr", "source": "Site Digicel Business"}]'::jsonb, NULL, ARRAY['Télécoms','Site Digicel Business'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('sociale', 'Standard Contact-Entrep.', 'Réseau', 'CONTACT-ENTREPRISES -- Siège', '[{"poste": "Siège", "telephone": "0596 72 18 76", "email": "info@contact-entreprises.com", "linkedin": "contact-entreprises.com", "source": "Site CE"}]'::jsonb, '5 rue Loulou Boislaville, Tour Lumina 16e, FdF.', ARRAY['Réseau','Site CE'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('institutionnelle', 'Standard MEDEF MQ', 'Patronat', 'MEDEF MARTINIQUE -- Siège', '[{"poste": "Siège", "linkedin": "medef-martinique.fr"}]'::jsonb, 'Domaine de Montgérald, Route de Chateauboeuf, CS 60344, 97258 FdF.', ARRAY['Patronat'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('economique', 'Bruno Brival', 'Tourisme', 'CMT (Comité Martiniquais du Tourisme) -- Directeur Général / Dir. de publication', '[{"poste": "Directeur Général / Dir. de publication", "telephone": "05 96 61 61 77", "email": "info@martinique.org", "linkedin": "martinique.org", "source": "Site CMT"}]'::jsonb, 'DG CMT. Directeur de publication martinique.org. Contact #1 tourisme MQ.', ARRAY['Tourisme','Site CMT'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('economique', 'Claude Bulot Piault', 'Tourisme', 'CMT -- Responsable Communication', '[{"poste": "Responsable Communication", "email": "claude.piault@martiniquetourisme.com", "source": "CMT site pro"}]'::jsonb, 'CONTACT CLÉ pour BYSS GROUP — responsable com et supports de com du CMT.', ARRAY['Tourisme','CMT site pro'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('economique', 'George Landy', 'Tourisme', 'CMT -- Promotion marchés MQ / France / Europe', '[{"poste": "Promotion marchés MQ / France / Europe", "email": "george.landy@martiniquetourisme.com", "source": "CMT site pro"}]'::jsonb, 'Promotion destination. Budget campagnes.', ARRAY['Tourisme','CMT site pro'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('economique', 'Mylène de Creny', 'Tourisme', 'CMT -- Interlocutrice hébergement', '[{"poste": "Interlocutrice hébergement", "email": "mylene.decreny@martiniquetourisme.com", "source": "CMT site pro"}]'::jsonb, NULL, ARRAY['Tourisme','CMT site pro'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('economique', 'Audrey Cherchel', 'Tourisme', 'CMT -- Interlocutrice hébergement', '[{"poste": "Interlocutrice hébergement", "email": "audrey.cherchel@martiniquetourisme.com", "source": "CMT site pro"}]'::jsonb, NULL, ARRAY['Tourisme','CMT site pro'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('economique', 'Yvelise Montovert', 'Tourisme', 'CMT -- Interlocutrice gastronomie', '[{"poste": "Interlocutrice gastronomie", "email": "yvelise.montovert@martiniquetourisme.com", "source": "CMT site pro"}]'::jsonb, NULL, ARRAY['Tourisme','CMT site pro'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('economique', 'Géraldine Artigny', 'Tourisme', 'CMT -- Interlocutrice gastronomie', '[{"poste": "Interlocutrice gastronomie", "email": "geraldine.artigny@martiniquetourisme.com", "source": "CMT site pro"}]'::jsonb, NULL, ARRAY['Tourisme','CMT site pro'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('economique', 'Lysiane Ragot', 'Tourisme', 'CMT -- Interlocutrice activités vertes', '[{"poste": "Interlocutrice activités vertes", "email": "lysiane.ragot@martiniquetourisme.com", "source": "CMT site pro"}]'::jsonb, NULL, ARRAY['Tourisme','CMT site pro'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('economique', 'Chantal Vetro', 'Tourisme', 'CMT -- Interlocutrice croisière', '[{"poste": "Interlocutrice croisière", "email": "chantal.vetro@martiniquetourisme.com", "source": "CMT site pro"}]'::jsonb, NULL, ARRAY['Tourisme','CMT site pro'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('economique', 'Agnès Jean-Philippe', 'Tourisme', 'CMT -- Interlocutrice nautisme/plongée/plaisance', '[{"poste": "Interlocutrice nautisme/plongée/plaisance", "email": "ajeanphilippe@martiniquetourisme.com", "source": "CMT site pro"}]'::jsonb, NULL, ARRAY['Tourisme','CMT site pro'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('economique', 'Jean-Roger Salinière', 'Tourisme', 'CMT -- Interlocuteur nautisme/plongée', '[{"poste": "Interlocuteur nautisme/plongée", "email": "jeanroger.saliniere@martiniquetourisme.com", "source": "CMT site pro"}]'::jsonb, NULL, ARRAY['Tourisme','CMT site pro'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('economique', 'Catherine Renaud', 'Tourisme', 'CMT -- DPO (protection données)', '[{"poste": "DPO (protection données)", "source": "CMT mentions légales"}]'::jsonb, '5 Av. Loulou Boislaville, 97200 FdF.', ARRAY['Tourisme','CMT mentions légales'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('economique', 'Patrice Fabre', 'Tourisme', 'KARIBEA HÔTELS -- Directeur de publication / Président GFD', '[{"poste": "Directeur de publication / Président GFD", "telephone": "+596 596 48 50 00", "email": "contact@karibeahotel.com", "linkedin": "karibea.com", "source": "Mentions légales Karibea"}]'::jsonb, 'Dir. pub. Email général + tél confirmés. Dir. commerciale & marketing: Zone artisanale Génipa, Ducos.', ARRAY['Tourisme','Mentions légales Karibea'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('economique', 'Service Groupes & Incentives', 'Tourisme', 'KARIBEA HÔTELS -- Séminaires / Groupes', '[{"poste": "Séminaires / Groupes", "telephone": "+33 (0)3 84 91 93 89", "email": "servicegroupes@karibeahotel.com", "source": "Site Karibea"}]'::jsonb, 'Contact B2B séminaires, incentives. Tél métropole.', ARRAY['Tourisme','Site Karibea'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('economique', 'Réservation Valmenière', 'Tourisme', 'KARIBEA VALMENIÈRE *** -- Hôtel FdF', '[{"poste": "Hôtel FdF", "telephone": "+596 596 75 75 75", "email": "reservation-valmeniere@karibeahotel.com", "source": "Site Karibea"}]'::jsonb, '120 chambres, 1500m² salles séminaires.', ARRAY['Tourisme','Site Karibea'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('economique', 'Réservation Squash', 'Tourisme', 'KARIBEA SQUASH *** -- Hôtel FdF', '[{"poste": "Hôtel FdF", "telephone": "+596 596 72 80 80", "email": "reservation-squash@karibeahotel.com", "source": "Site Karibea"}]'::jsonb, '104 chambres, rénové 2023.', ARRAY['Tourisme','Site Karibea'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('economique', 'Réservation Sainte-Luce', 'Tourisme', 'KARIBEA SAINTE-LUCE *** -- Resort', '[{"poste": "Resort", "telephone": "+596 596 62 32 32", "email": "reservation-sainteluce@karibeahotel.com", "source": "Site Karibea"}]'::jsonb, '284 chambres, complexe 3*.', ARRAY['Tourisme','Site Karibea'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('institutionnelle', 'Philippe Jock', 'Institution', 'CCI MARTINIQUE -- Président', '[{"poste": "Président", "telephone": "0596 55 28 00", "email": "contact@martinique.cci.fr", "linkedin": "martinique.cci.fr", "source": "Mentions légales CCI"}]'::jsonb, '36 000 entreprises. 50 rue Ernest Deproge, FdF. Tél + email confirmés.', ARRAY['Institution','Mentions légales CCI'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('economique', 'Service Client SFR', 'Télécoms', 'SFR CARAÏBE -- Service client', '[{"poste": "Service client", "telephone": "1020", "email": "serviceclient@sfrcaraibe.fr", "linkedin": "sfrcaraibe.fr", "source": "Site SFR"}]'::jsonb, 'Du lun au sam 7h-21h.', ARRAY['Télécoms','Site SFR'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('economique', 'Données personnelles SFR', 'Télécoms', 'SFR CARAÏBE -- RGPD', '[{"poste": "RGPD", "email": "donnees-personnelles@sfrcaraibe.com", "source": "Resiliation SFR"}]'::jsonb, 'ZI la Jambette CS90013, 97282 Le Lamentin.', ARRAY['Télécoms','Resiliation SFR'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('media', 'Jean-Yves (ACOMA)', 'Agence Com', 'ACOMA — Agence Communication Digitale -- Dirigeant / Formateur SEO-SEA', '[{"poste": "Dirigeant / Formateur SEO-SEA", "telephone": "+596 696 55 27 16", "email": "bayoujuju.seo@gmail.com", "linkedin": "agence-acoma.fr", "source": "Google Maps"}]'::jsonb, '4.9★ (36 avis). Formation + conseil digital.', ARRAY['Agence Com','Google Maps'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('media', 'Mme Mainemare', 'Agence Com', 'AGENCE PANDORA MÉDIA -- Dirigeante', '[{"poste": "Dirigeante", "telephone": "+596 696 88 04 91", "email": "direction@agencepandoramedia.com", "source": "Google Maps"}]'::jsonb, '4.8★ (10 avis). Agence 360°.', ARRAY['Agence Com','Google Maps'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('media', 'Lionel', 'Agence Com', 'AKAZ COMMUNICATION -- Dirigeant', '[{"poste": "Dirigeant", "source": "Google Maps"}]'::jsonb, '5.0★ (20 avis). Photo, vidéo, web. Concurrent/partenaire potentiel vidéo.', ARRAY['Agence Com','Google Maps'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('media', 'R. Tin', 'Agence Com', 'SMART AGENCY -- Membre équipe', '[{"poste": "Membre équipe", "email": "r.tin@smart-agency.fr", "source": "Google Maps scrape"}]'::jsonb, 'Contact nominatif trouvé sur le site.', ARRAY['Agence Com','Google Maps scrape'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('media', 'Pascal Lecomte', 'Agence Com', 'XPERIENCE WEB PML -- Dirigeant', '[{"poste": "Dirigeant", "telephone": "+596 696 82 90 07", "source": "Google Maps"}]'::jsonb, '4.8★ (50 avis). Google Workspace, digitalisation.', ARRAY['Agence Com','Google Maps'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('media', 'David + Julia', 'Agence Com', '18-19 DIGITAL -- Dirigeants', '[{"poste": "Dirigeants", "telephone": "+596 596 78 38 90", "linkedin": "18-19.digital", "source": "Google Maps"}]'::jsonb, '5.0★ (9 avis). Sites web, innovation.', ARRAY['Agence Com','Google Maps'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('institutionnelle', 'Sylvie (formatrice)', 'Formation', 'AWITEC -- Formation marketing digital', '[{"poste": "Formation marketing digital", "telephone": "+596 696 71 44 05", "linkedin": "awitec.com", "source": "Google Maps"}]'::jsonb, '4.8★ (173 avis). Formation marketing digital.', ARRAY['Formation','Google Maps'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('economique', 'Maud Charles', 'Conseil', 'CAPVERGENCE — Audit & Conseil -- Dirigeante', '[{"poste": "Dirigeante", "telephone": "+596 696 75 60 21", "email": "contact@capvergence.com", "source": "Google Maps+scrape"}]'::jsonb, '5.0★ (20 avis). Business Model, stratégie.', ARRAY['Conseil','Google Maps+scrape'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('economique', 'Ophélie Diony', 'Comptable', 'WIJ''IMPACTE -- Expert-comptable', '[{"poste": "Expert-comptable", "telephone": "+596 596 71 51 84", "source": "Google Maps"}]'::jsonb, '4.9★ (11 avis). Le Lamentin.', ARRAY['Comptable','Google Maps'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('economique', 'Stéphane Roquès', 'Comptable', 'VUE D''EXPERT -- Expert-comptable', '[{"poste": "Expert-comptable", "telephone": "+596 596 10 61 12", "source": "Google Maps"}]'::jsonb, '5.0★. Le Lamentin. Tech-savvy.', ARRAY['Comptable','Google Maps'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('economique', 'Régine Schuck', 'RH/Recrutement', 'ATOUT''RH CONSEIL MQ -- Dirigeante', '[{"poste": "Dirigeante", "telephone": "+33 805 38 27 22", "source": "Google Maps"}]'::jsonb, '4.9★ (12 avis). Recrutement direction.', ARRAY['RH/Recrutement','Google Maps'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('economique', 'Dani', 'Hôtellerie', 'MARTINIQUE HOSTEL -- Gérante', '[{"poste": "Gérante", "telephone": "+596 596 52 14 45", "source": "Google Maps"}]'::jsonb, '4.6★ (72 avis). Sainte-Luce. Accueil top.', ARRAY['Hôtellerie','Google Maps'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('economique', 'Chef Christophe', 'Restaurant', 'MIZA — L''ENTREPÔT -- Chef/Propriétaire', '[{"poste": "Chef/Propriétaire", "telephone": "+596 596 09 01 62", "source": "Google Maps"}]'::jsonb, '4.8★ (783 avis). Rivière Roche. Niveau Michelin. LE resto de FdF.', ARRAY['Restaurant','Google Maps'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('economique', 'Chef Stéfane', 'Restaurant', 'KUBE RESTAURANT -- Chef/Propriétaire', '[{"poste": "Chef/Propriétaire", "telephone": "+596 696 29 64 10", "source": "Google Maps"}]'::jsonb, '4.9★ (141 avis). Le Marin. 6-7 courses. Niveau Michelin.', ARRAY['Restaurant','Google Maps'])
ON CONFLICT DO NOTHING;

INSERT INTO intel_entities (domain, name, type, description, contacts, notes, tags)
VALUES ('economique', 'Jérôme + Ana', 'Restaurant', 'L''ANTARÈS -- Propriétaires', '[{"poste": "Propriétaires", "telephone": "+596 596 35 81 67", "source": "Google Maps"}]'::jsonb, '5.0★ (112 avis). Patio Marina, Trois-Îlets. Gastro.', ARRAY['Restaurant','Google Maps'])
ON CONFLICT DO NOTHING;

-- Total contacts inserted: 168

-- ═══════════════════════════════════════════════════════════════
-- LORE_ENTRIES — Bible de Vente
-- ═══════════════════════════════════════════════════════════════

INSERT INTO lore_entries (universe, title, content, category, tags, word_count, order_index)
VALUES ('bible', 'BIBLE DE VENTE — BYSS GROUP SAS', NULL, 'chapter', ARRAY['bible','vente'], 0, 100)
ON CONFLICT DO NOTHING;

INSERT INTO lore_entries (universe, title, content, category, tags, word_count, order_index)
VALUES ('bible', 'Le handbook commercial complet. Pricing psychology. SPIN Selling. Objections. Benchmarks. Neuro-selling martiniquais. — Sorel la Magnifique, Mars 2026', 'Le handbook commercial complet. Pricing psychology. SPIN Selling. Objections. Benchmarks. Neuro-selling martiniquais. — Sorel la Magnifique, Mars 2026', 'section', ARRAY['bible','vente'], 18, 101)
ON CONFLICT DO NOTHING;

INSERT INTO lore_entries (universe, title, content, category, tags, word_count, order_index)
VALUES ('bible', 'CHAPITRE 1 — PRICING PSYCHOLOGY (KAHNEMAN & TVERSKY)', NULL, 'chapter', ARRAY['bible','vente'], 0, 200)
ON CONFLICT DO NOTHING;

INSERT INTO lore_entries (universe, title, content, category, tags, word_count, order_index)
VALUES ('bible', 'RÈGLE D''OR', 'NE JAMAIS présenter 1 seul prix. TOUJOURS 3 options. L''ancrage psychologique fonctionne à 100% : le cerveau humain évalue un prix PAR RAPPORT à un autre, jamais en absolu. Un steak à 45€ paraît cher. Le même steak à côté d''un homard à 95€ paraît raisonnable.', 'entry', ARRAY['bible','vente'], 46, 201)
ON CONFLICT DO NOTHING;

INSERT INTO lore_entries (universe, title, content, category, tags, word_count, order_index)
VALUES ('bible', 'L''EFFET LEURRE', 'L''option la plus chère n''est PAS là pour être vendue. Elle est là pour rendre l''option du milieu IRRÉSISTIBLE. C''est ce que Dan Ariely (MIT) appelle le ''decoy effect''. Ajout d''une option asymétriquement dominée = la décision se simplifie vers celle que TU veux vendre.', 'entry', ARRAY['bible','vente'], 45, 202)
ON CONFLICT DO NOTHING;

INSERT INTO lore_entries (universe, title, content, category, tags, word_count, order_index)
VALUES ('bible', 'ANCRAGE CHIFFRÉ', 'Le premier chiffre que le prospect entend ANCRE tout le reste. Si tu dis ''135K€'' en premier, tout ce qui suit paraît petit. Si tu dis ''1 500€'' en premier, le prospect est ancré bas et résiste à monter. TOUJOURS commencer par l''option la plus haute.', 'entry', ARRAY['bible','vente'], 46, 203)
ON CONFLICT DO NOTHING;

INSERT INTO lore_entries (universe, title, content, category, tags, word_count, order_index)
VALUES ('bible', 'CADRAGE PERTE vs GAIN', 'Le cerveau humain ressent les pertes 2× plus fort que les gains (prospect theory, Kahneman). Ne dis PAS ''Avec BYSS GROUP vous gagnez 20 réservations/mois.'' Dis ''Sans vidéo, vous PERDEZ 20 réservations/mois qui vont chez votre concurrent.'' La perte motive 2× plus que le gain.', 'entry', ARRAY['bible','vente'], 45, 204)
ON CONFLICT DO NOTHING;

INSERT INTO lore_entries (universe, title, content, category, tags, word_count, order_index)
VALUES ('bible', 'PRIX EN PETIT vs EN GROS', '54K€/an = effrayant. 4 500€/mois = acceptable. 150€/jour = ridicule. ''150€ par jour, c''est le prix de 2 couverts dans votre restaurant. Pour 2 couverts par jour, vous avez 72 vidéos pro par an.'' TOUJOURS fractionner le prix en unité la plus petite possible.', 'entry', ARRAY['bible','vente'], 44, 205)
ON CONFLICT DO NOTHING;

INSERT INTO lore_entries (universe, title, content, category, tags, word_count, order_index)
VALUES ('bible', 'MODÈLE 3 OPTIONS — PAR SECTEUR', 'MODÈLE 3 OPTIONS — PAR SECTEUR', 'section', ARRAY['bible','vente'], 6, 206)
ON CONFLICT DO NOTHING;

INSERT INTO lore_entries (universe, title, content, category, tags, word_count, order_index)
VALUES ('bible', 'RESTAURANT', '🥉 Essentiel: 1 vidéo 30s + 10 images = 1 800€
🥇 Croissance: 1 vidéo + site web + 10 images = 6 000€ ← CIBLE
💎 Domination: 4 vidéos/an + site + Google Ads 500€/mois + images mensuelles = 15 000€/an

Phrasing: ''La plupart de nos clients restaurateurs choisissent l''option Croissance.''', 'entry', ARRAY['bible','vente'], 52, 207)
ON CONFLICT DO NOTHING;

INSERT INTO lore_entries (universe, title, content, category, tags, word_count, order_index)
VALUES ('bible', 'HÔTEL', '🥉 Essentiel: 1 vidéo visite virtuelle = 3 000€
🥇 Croissance: Vidéo + refonte site booking direct + Google Ads = 25 000€ + 2K€/mois ← CIBLE
💎 Domination: Vidéo + site + Google Ads + app guest + chatbot concierge = 60 000€ + 3K€/mois

Phrasing: ''Les hôtels qui passent au booking direct économisent 15-18% de commission Booking.com. Sur votre CA, c''est [X]K€/an.''', 'entry', ARRAY['bible','vente'], 64, 208)
ON CONFLICT DO NOTHING;

INSERT INTO lore_entries (universe, title, content, category, tags, word_count, order_index)
VALUES ('bible', 'DISTILLERIE', '🥉 Essentiel: 2 vidéos patrimoine/an = 5 000€
🥇 Croissance: Vidéos + e-commerce + Google Ads export = 22 000€ + 1K€/mois ← CIBLE
💎 Domination: Vidéos + e-com + Ads + app visite AR + NotebookLM Expert = 55 000€ + 2K€/mois

Phrasing: ''Le marché du rhum premium croît de 8%/an. Sans e-commerce, vous laissez [X]K€ sur la table chaque année.''', 'entry', ARRAY['bible','vente'], 62, 209)
ON CONFLICT DO NOTHING;

INSERT INTO lore_entries (universe, title, content, category, tags, word_count, order_index)
VALUES ('bible', 'EXCURSION NAUTIQUE', '🥉 Essentiel: 1 vidéo 45s = 1 500€
🥇 Croissance: Vidéo + site booking + Google Ads = 12 000€ + 500€/mois ← CIBLE
💎 Domination: Vidéo + site + Ads + chatbot WhatsApp résa 24/7 = 18 000€ + 800€/mois

Phrasing: ''Votre concurrent d''à côté sur la marina a déjà son site booking. Combien de clients il vous prend chaque jour ?''', 'entry', ARRAY['bible','vente'], 63, 210)
ON CONFLICT DO NOTHING;

INSERT INTO lore_entries (universe, title, content, category, tags, word_count, order_index)
VALUES ('bible', 'TÉLÉCOM', '🥉 Essentiel: 24 vidéos/an = 18 000€/an
🥇 Croissance: 48 vidéos + images + gestion Ads = 72 000€/an ← CIBLE
💎 Domination: 72 vidéos + images + Ads + app + agent IA = 135 000€/an

Phrasing: ''Votre concurrent investit déjà en vidéo IA. Chaque mois sans contenu frais, c''est du terrain perdu.''', 'entry', ARRAY['bible','vente'], 54, 211)
ON CONFLICT DO NOTHING;

INSERT INTO lore_entries (universe, title, content, category, tags, word_count, order_index)
VALUES ('bible', 'INSTITUTION (CMT/CCI)', '🥉 Essentiel: 12 vidéos/an = 12 000€
🥇 Croissance: Vidéos + images + refonte site + chatbot = 65 000€ ← CIBLE
💎 Domination: Vidéos + images + site + Ads + chatbot + NotebookLM = 130 000€/an

Phrasing: ''Les destinations concurrentes (Bali, Costa Rica) ont du contenu vidéo immersif. La Martinique mérite mieux qu''une brochure PDF.''', 'entry', ARRAY['bible','vente'], 57, 212)
ON CONFLICT DO NOTHING;

INSERT INTO lore_entries (universe, title, content, category, tags, word_count, order_index)
VALUES ('bible', 'CHAPITRE 2 — SPIN SELLING (NEIL RACKHAM, 35 000 APPELS ANALYSÉS)', NULL, 'chapter', ARRAY['bible','vente'], 0, 300)
ON CONFLICT DO NOTHING;

INSERT INTO lore_entries (universe, title, content, category, tags, word_count, order_index)
VALUES ('bible', 'LE PRINCIPE', 'La vente complexe B2B ne se fait JAMAIS en présentant la solution d''emblée. Le prospect doit RESSENTIR le problème. Le vendeur pose des questions, pas des réponses. Le prospect se convainc LUI-MÊME. Le SPIN Selling a été validé sur 35 000 appels de vente dans 23 pays. C''est la méthode la plus prouvée scientifiquement au monde pour la vente B2B.', 'entry', ARRAY['bible','vente'], 60, 301)
ON CONFLICT DO NOTHING;

INSERT INTO lore_entries (universe, title, content, category, tags, word_count, order_index)
VALUES ('bible', 'S = SITUATION', 'Questions sur l''état actuel du prospect. PAS de vente. PAS de pitch. Juste comprendre.

''Combien d''avis Google vous avez ?''
''Quel est votre taux de réservation directe vs Booking.com ?''
''Combien vous dépensez en pub par mois ?''
''Vous avez un site web ? Il date de quand ?''
''Comment vos clients vous trouvent ?''

RÈGLE: max 3-4 questions Situation. Trop = interrogatoire. Le prospect s''ennuie.', 'entry', ARRAY['bible','vente'], 66, 302)
ON CONFLICT DO NOTHING;

INSERT INTO lore_entries (universe, title, content, category, tags, word_count, order_index)
VALUES ('bible', 'P = PROBLÈME', 'Questions qui révèlent les DIFFICULTÉS. Le prospect commence à réfléchir.

''Êtes-vous satisfait de votre taux de conversion Booking ?'' (réponse: jamais)
''Avez-vous du mal à vous différencier des concurrents ?'' (réponse: toujours)
''Le contenu de votre site est à jour ?'' (réponse: non)
''Vous avez une vidéo professionnelle de votre [hôtel/resto/distillerie] ?'' (réponse: non)
''Le dernier client qui a hésité entre vous et un concurrent, il est allé où ?'' (SILENCE)

RÈGLE: les bonnes questions Problème créent un SILENCE. Si le prospect réfléchit, tu as touché juste.', 'entry', ARRAY['bible','vente'], 87, 303)
ON CONFLICT DO NOTHING;

INSERT INTO lore_entries (universe, title, content, category, tags, word_count, order_index)
VALUES ('bible', 'I = IMPLICATION', 'Questions qui font ressentir les CONSÉQUENCES du problème. C''est là que la douleur monte.

''Si un touriste hésite entre votre hôtel et celui d''à côté qui a une vidéo visite virtuelle... il va où ?''
''Combien de réservations vous perdez chaque mois parce que votre profil Booking n''a pas de vidéo ?''
''Votre commission Booking c''est 15-18%. Sur votre CA, ça fait combien par an ? [laisser calculer]''
''Si ça continue 2 ans sans vidéo, où en sera votre business face aux concurrents qui investissent ?''
''Quand Free baisse ses prix, vous perdez des clients. Sans contenu de marque émotionnel, comment vous les retenez ?''

RÈGLE: L''implication doit faire MAL. Le prospect doit se dire ''merde, c''est vrai.'' C''est inconfortable. C''est normal. C''est LE moment de la vente.', 'entry', ARRAY['bible','vente'], 128, 304)
ON CONFLICT DO NOTHING;

INSERT INTO lore_entries (universe, title, content, category, tags, word_count, order_index)
VALUES ('bible', 'N = NEED-PAYOFF', 'Questions qui font imaginer la SOLUTION au prospect. Il se vend tout seul.

''Si vous aviez cette vidéo demain sur votre profil Booking, ça changerait quoi ?''
''Si votre site avait un booking direct avec meilleur prix garanti, combien de clients Booking vous récupéreriez ?''
''Si un chatbot répondait 24/7 à vos clients en 4 langues, ça libérerait combien de temps à votre équipe ?''
''Si vos campagnes Google Ads avaient une vidéo YouTube pré-roll, quel impact sur votre CPA ?''

RÈGLE: NE PAS RÉPONDRE aux questions Need-Payoff. Laisser le prospect répondre. Quand IL dit ''ça changerait tout'', le deal est fait. Tu n''as plus qu''à dire ''on commence quand ?''', 'entry', ARRAY['bible','vente'], 111, 305)
ON CONFLICT DO NOTHING;

INSERT INTO lore_entries (universe, title, content, category, tags, word_count, order_index)
VALUES ('bible', 'SPIN PAR SECTEUR — SCRIPTS COMPLETS', 'SPIN PAR SECTEUR — SCRIPTS COMPLETS', 'section', ARRAY['bible','vente'], 6, 306)
ON CONFLICT DO NOTHING;

INSERT INTO lore_entries (universe, title, content, category, tags, word_count, order_index)
VALUES ('bible', 'SPIN — RESTAURANT', 'S: ''Combien d''avis Google vous avez ? [X]. C''est énorme. Et combien de vidéos pro sur votre profil ? [0].''
P: ''Vous trouvez que vos photos rendent justice à ce que vous faites en cuisine ?''
I: ''Quand un touriste tape restaurant martinique sur Google et qu''il voit votre concurrent avec une vidéo ambiance et vous avec 3 photos de 2019... il va où ?''
N: ''Si vous aviez une vidéo de votre chef en action, de l''ambiance, des plats, livrée en 48h... ça changerait quoi pour vos réservations ?''
→ Le prospect dit oui → ''On fait un test. 1 vidéo. 48h. Si ça vous plaît, on continue.''', 'entry', ARRAY['bible','vente'], 109, 307)
ON CONFLICT DO NOTHING;

INSERT INTO lore_entries (universe, title, content, category, tags, word_count, order_index)
VALUES ('bible', 'SPIN — HÔTEL', 'S: ''Quel est votre taux de réservation directe vs OTA ? [20-30%]. Et votre commission Booking.com ? [15-18%].''
P: ''C''est pas frustrant de payer 15% de commission sur chaque réservation alors que le client aurait pu réserver en direct ?''
I: ''Sur votre CA, 15% de commission = [calculer ensemble]. C''est [X]K€ par an qui partent chez Booking au lieu de rester chez vous. Et sans vidéo visite virtuelle sur votre profil, les touristes n''ont pas confiance pour réserver en direct.''
N: ''Si votre site avait une vidéo visite virtuelle + un booking direct avec meilleur prix garanti + du Google Ads qui envoie du trafic directement... vous récupérez combien de ces [X]K€ ?''
→ ''BYSS GROUP fait exactement ça. On commence par la vidéo.''', 'entry', ARRAY['bible','vente'], 125, 308)
ON CONFLICT DO NOTHING;

INSERT INTO lore_entries (universe, title, content, category, tags, word_count, order_index)
VALUES ('bible', 'SPIN — DISTILLERIE', 'S: ''Vous exportez dans combien de pays ? [40+]. Votre CA export c''est quel % ? Et vous vendez en ligne ?''
P: ''Un amateur de rhum à Berlin qui veut acheter du [JM/Clément/Depaz] en ligne, il peut ?''
I: ''Le marché du rhum premium croît de 8%/an. Diplomático, Mount Gay, Appleton sont déjà en e-commerce mondial. Chaque année sans boutique en ligne, c''est du CA export que les concurrents captent à votre place.''
N: ''Si vous aviez un e-commerce livrant 5 marchés clés + du Google Ads export + une vidéo patrimoine qui fait rêver... ça représente combien de CA en plus ?''
→ ''BYSS GROUP construit le pack complet. E-com + Ads + vidéo.''', 'entry', ARRAY['bible','vente'], 116, 309)
ON CONFLICT DO NOTHING;

INSERT INTO lore_entries (universe, title, content, category, tags, word_count, order_index)
VALUES ('bible', 'SPIN — EXCURSION', 'S: ''Combien de sorties vous faites par semaine ? Comment les clients vous trouvent ? TripAdvisor ? Bouche-à-oreille ?''
P: ''Vous avez un site avec booking en ligne ? [souvent non]. Comment les clients réservent ? Par téléphone ?''
I: ''Un touriste qui arrive à 22h à l''hôtel, qui veut réserver une excursion pour le lendemain. Il va sur Google, il tape catamaran martinique. Il tombe sur votre concurrent qui a un site avec booking instantané. Vous, il faut qu''il appelle demain matin. Il réserve chez qui ?''
N: ''Si vous aviez un site avec booking en ligne + une vidéo dauphins/sunset qui donne envie + un chatbot WhatsApp qui répond 24/7... vous remplissez combien de places en plus par semaine ?''
→ ''On commence par la vidéo. Gratuit la première.''', 'entry', ARRAY['bible','vente'], 131, 310)
ON CONFLICT DO NOTHING;

INSERT INTO lore_entries (universe, title, content, category, tags, word_count, order_index)
VALUES ('bible', 'CHAPITRE 3 — LES 15 OBJECTIONS ET LEURS RÉPONSES', NULL, 'chapter', ARRAY['bible','vente'], 0, 400)
ON CONFLICT DO NOTHING;

INSERT INTO lore_entries (universe, title, content, category, tags, word_count, order_index)
VALUES ('bible', '1. ''C''est trop cher''', 'RÉPONSE: ''Par rapport à quoi ?'' (silence). Puis: ''Un vidéaste classique facture 5 à 15K€ pour une vidéo et 3 semaines de production. BYSS GROUP fait 750€ en 48h. Ce n''est pas cher — c''est 10× moins cher que l''alternative.''

OU: ''Combien vous coûte UN client perdu parce que votre concurrent a une vidéo et pas vous ? Si c''est 1 client/semaine à 50€ de panier moyen, c''est 2 600€/an de perdu. La vidéo coûte 1 500€. Elle se rembourse en 7 mois.''', 'entry', ARRAY['bible','vente'], 83, 401)
ON CONFLICT DO NOTHING;

INSERT INTO lore_entries (universe, title, content, category, tags, word_count, order_index)
VALUES ('bible', '2. ''J''ai pas le budget''', 'RÉPONSE: ''Je comprends. C''est pour ça que je propose l''option Essentiel à [prix]. Et les résultats de cette première vidéo vous donneront les chiffres pour justifier le budget de la suite auprès de votre direction/associé.''

OU: ''Quel est le budget que vous avez ? [le prospect dit un chiffre]. Ok, on commence avec ça et on monte progressivement.''', 'entry', ARRAY['bible','vente'], 58, 402)
ON CONFLICT DO NOTHING;

INSERT INTO lore_entries (universe, title, content, category, tags, word_count, order_index)
VALUES ('bible', '3. ''Envoyez-moi un email''', 'RÉPONSE: ''Avec plaisir. Mais pour vous envoyer quelque chose de pertinent, j''ai besoin de 2 minutes : c''est quoi votre priorité en ce moment ? Plus de clients ? Plus de visibilité ? Réduire les coûts ? [écouter]. Parfait, je vous envoie une proposition ciblée sur ça. C''est quoi votre email ?''

→ L''objectif RÉEL de cette objection: RÉCUPÉRER L''EMAIL. Si tu obtiens l''email, tu as gagné. L''email = relance structurée.', 'entry', ARRAY['bible','vente'], 71, 403)
ON CONFLICT DO NOTHING;

INSERT INTO lore_entries (universe, title, content, category, tags, word_count, order_index)
VALUES ('bible', '4. ''Je vais réfléchir''', 'RÉPONSE: ''Bien sûr. À quoi exactement ? [silence]. Si c''est le prix, on peut ajuster. Si c''est le résultat, je peux vous montrer un exemple plus spécifique. Si c''est le timing, on peut commencer quand ça vous arrange. Qu''est-ce qui vous ferait dire oui aujourd''hui ?''

→ ''Je vais réfléchir'' = ''non poli''. Il faut IDENTIFIER le vrai frein. Toujours demander ''à quoi exactement ?''', 'entry', ARRAY['bible','vente'], 65, 404)
ON CONFLICT DO NOTHING;

INSERT INTO lore_entries (universe, title, content, category, tags, word_count, order_index)
VALUES ('bible', '5. ''On a déjà quelqu''un''', 'RÉPONSE: ''Parfait. Et vous êtes satisfait du rapport qualité-prix-délai ? [écouter]. BYSS GROUP ne remplace pas, il complète. Votre prestataire fait la prod classique, moi je fais le volume IA à côté. Vous avez le meilleur des deux mondes.''

OU: ''Combien vous payez actuellement par vidéo ? [X]K€. Et le délai ? [X semaines]. BYSS GROUP fait la même qualité pour 750€ en 48h. Ce n''est pas une question de remplacer — c''est une question de maths.''', 'entry', ARRAY['bible','vente'], 77, 405)
ON CONFLICT DO NOTHING;

INSERT INTO lore_entries (universe, title, content, category, tags, word_count, order_index)
VALUES ('bible', '6. ''L''IA c''est pas de la vraie qualité''', 'RÉPONSE: [MONTRER LA DÉMO. Pas argumenter. Montrer.] ''Tenez, regardez cette vidéo. Elle a été produite en 48h par IA. Vous trouvez que c''est pas de la vraie qualité ?'' [silence]. Le prospect se convainc par les yeux, pas par les oreilles. TOUJOURS avoir une démo prête sur le téléphone.', 'entry', ARRAY['bible','vente'], 49, 406)
ON CONFLICT DO NOTHING;

INSERT INTO lore_entries (universe, title, content, category, tags, word_count, order_index)
VALUES ('bible', '7. ''Vous avez des références ?''', 'RÉPONSE (au début, 0 client): ''BYSS GROUP est nouveau mais mon expérience ne l''est pas. J''ai géré les campagnes digitales de Wizzee (Digicel) et GoodCircle chez BeeCee. Les méthodes sont les mêmes, la structure est nouvelle.''

Puis montrer les benchmarks: ''+15-25% conversions Booking avec vidéo (benchmark Expedia/Booking). -20-30% CPA Google Ads avec YouTube pré-roll (benchmark Google). +8%/an marché rhum premium export (IWSR).''', 'entry', ARRAY['bible','vente'], 62, 407)
ON CONFLICT DO NOTHING;

INSERT INTO lore_entries (universe, title, content, category, tags, word_count, order_index)
VALUES ('bible', '8. ''C''est pas le bon moment''', 'RÉPONSE: ''Je comprends. C''est quand le bon moment ? [écouter]. Ok, je reviens vers vous le [date]. En attendant, je vous envoie un exemple de ce que BYSS GROUP pourrait faire spécifiquement pour vous. Comme ça vous aurez eu le temps de réfléchir.''
→ TOUJOURS obtenir une date de rappel. ''Pas le bon moment'' sans date = poubelle.', 'entry', ARRAY['bible','vente'], 58, 408)
ON CONFLICT DO NOTHING;

INSERT INTO lore_entries (universe, title, content, category, tags, word_count, order_index)
VALUES ('bible', '9. ''Je dois en parler à mon associé/ma direction''', 'RÉPONSE: ''Bien sûr. Ce serait possible de faire une présentation rapide de 10 minutes à vous deux ensemble ? Comme ça votre associé a les réponses à ses questions directement.''
→ L''objectif: accéder au VRAI décideur. L''interlocuteur actuel est un filtre, pas le signataire.', 'entry', ARRAY['bible','vente'], 44, 409)
ON CONFLICT DO NOTHING;

INSERT INTO lore_entries (universe, title, content, category, tags, word_count, order_index)
VALUES ('bible', '10. ''On n''a pas besoin de vidéo''', 'RÉPONSE: ''C''est ce que disaient les restos avant TikTok. Aujourd''hui les établissements avec du contenu vidéo ont 2 à 3× plus de trafic que ceux sans. La question n''est pas si vous avez besoin de vidéo — c''est quand vos concurrents en auront et pas vous.''
→ Cadrage perte (Kahneman): montrer ce qu''il PERD en n''agissant pas.', 'entry', ARRAY['bible','vente'], 57, 410)
ON CONFLICT DO NOTHING;

INSERT INTO lore_entries (universe, title, content, category, tags, word_count, order_index)
VALUES ('bible', '11. ''Montrez-moi un ROI garanti''', 'RÉPONSE: ''Je ne peux pas garantir un ROI parce que le résultat dépend aussi de votre offre, votre service, votre emplacement. Ce que je peux faire : vous montrer les benchmarks de l''industrie [citer les stats] et commencer par un test mesurable. On fait 1 vidéo, on mesure l''impact en 30 jours, et les chiffres parlent d''eux-mêmes.''', 'entry', ARRAY['bible','vente'], 57, 411)
ON CONFLICT DO NOTHING;

INSERT INTO lore_entries (universe, title, content, category, tags, word_count, order_index)
VALUES ('bible', '12. ''C''est trop technique pour moi''', 'RÉPONSE: ''Justement. BYSS GROUP gère TOUT. Vous n''avez rien à comprendre techniquement. Vous me donnez 30 minutes de votre temps, je fais le reste. Votre seul travail c''est de valider le résultat.''', 'entry', ARRAY['bible','vente'], 32, 412)
ON CONFLICT DO NOTHING;

INSERT INTO lore_entries (universe, title, content, category, tags, word_count, order_index)
VALUES ('bible', '13. ''On va faire ça en interne''', 'RÉPONSE: ''Ok. Qui dans votre équipe maîtrise la vidéo IA, le développement web, le Google Ads et les chatbots ? [silence]. Le coût d''un employé polyvalent qui fait tout ça c''est 35-45K€/an chargé. BYSS GROUP fait le même travail pour 15-20K€ sans charges, sans congés, sans formation.''', 'entry', ARRAY['bible','vente'], 47, 413)
ON CONFLICT DO NOTHING;

INSERT INTO lore_entries (universe, title, content, category, tags, word_count, order_index)
VALUES ('bible', '14. ''Votre prix est plus élevé que [concurrent X]''', 'RÉPONSE: ''Qu''est-ce que [concurrent X] inclut exactement dans son offre ? [écouter]. Est-ce qu''il fait le montage Premiere Pro ? Le sound design ? Les révisions ? La livraison en 48h ? Le format vertical et horizontal ? Souvent le prix le moins cher ne comprend pas tout. Comparons les offres complètes.''', 'entry', ARRAY['bible','vente'], 52, 414)
ON CONFLICT DO NOTHING;

INSERT INTO lore_entries (universe, title, content, category, tags, word_count, order_index)
VALUES ('bible', '15. EN MARTINIQUE: ''Je connais un gars qui fait ça''', 'RÉPONSE: [NE PAS dénigrer le concurrent. JAMAIS.] ''Super. Et vous êtes satisfait de la qualité et des délais ? [écouter]. L''avantage de BYSS GROUP c''est la combinaison IA + digital + ads + agents. C''est pas juste de la vidéo, c''est toute la chaîne. Le gars fait le Google Ads aussi ? Le chatbot aussi ? Le e-commerce aussi ?''
→ En MQ, le réseau est ROI. ''Je connais un gars'' est la première objection. La réponse n''est pas ''je suis meilleur'' mais ''je fais plus large''.', 'entry', ARRAY['bible','vente'], 87, 415)
ON CONFLICT DO NOTHING;

INSERT INTO lore_entries (universe, title, content, category, tags, word_count, order_index)
VALUES ('bible', 'CHAPITRE 4 — NEURO-SELLING MARTINIQUAIS: COMMENT LA MARTINIQUE ACHÈTE', NULL, 'chapter', ARRAY['bible','vente'], 0, 500)
ON CONFLICT DO NOTHING;

INSERT INTO lore_entries (universe, title, content, category, tags, word_count, order_index)
VALUES ('bible', 'RÈGLE #1: LE RÉSEAU D''ABORD', 'En Martinique, on n''achète pas un produit. On achète une PERSONNE. Le prospect ne demande pas ''c''est quoi votre offre ?'' Il demande ''c''est qui qui m''envoie ?'' La recommandation vaut plus que le portfolio. Le ''je connais un gars'' vaut plus que le site web.

IMPLICATION: Chaque contrat signé doit générer 3 recommandations. TOUJOURS demander après livraison: ''Vous connaissez quelqu''un qui aurait besoin du même service ?'' En MQ, 1 client satisfait = 5 leads par bouche-à-oreille.', 'entry', ARRAY['bible','vente'], 78, 501)
ON CONFLICT DO NOTHING;

INSERT INTO lore_entries (universe, title, content, category, tags, word_count, order_index)
VALUES ('bible', 'RÈGLE #2: LA CONFIANCE PHYSIQUE', 'Le Martiniquais ne signe pas sur un email. Il signe APRÈS t''avoir vu en face, t''avoir serré la main, avoir bu un café/un ti''punch avec toi. Le RDV physique n''est pas une étape du process — c''est LE process.

IMPLICATION: Ne JAMAIS essayer de closer par email. L''email = obtenir le RDV. Le RDV = closer. Le WhatsApp = maintenir le lien. Le téléphone = urgence ou relance.', 'entry', ARRAY['bible','vente'], 68, 502)
ON CONFLICT DO NOTHING;

INSERT INTO lore_entries (universe, title, content, category, tags, word_count, order_index)
VALUES ('bible', 'RÈGLE #3: LA PUDEUR DU PRIX', 'En MQ, parler d''argent est délicat. Le prospect ne dira JAMAIS ''c''est trop cher'' directement. Il dira ''je vais réfléchir'', ''faut que je vois'', ''on en reparle''. C''est la même chose. La pudeur du prix est culturelle.

IMPLICATION: Ne JAMAIS mettre le prospect mal à l''aise sur le prix. Proposer les 3 options de manière décontractée. Dire ''la plupart de nos clients prennent l''option du milieu'' = donner la permission de choisir sans honte.', 'entry', ARRAY['bible','vente'], 74, 503)
ON CONFLICT DO NOTHING;

INSERT INTO lore_entries (universe, title, content, category, tags, word_count, order_index)
VALUES ('bible', 'RÈGLE #4: LE TEMPS CRÉOLE', '''La semaine prochaine'' en MQ = 2-3 semaines. ''Bientôt'' = 1-2 mois. ''On va voir'' = jamais. Le cycle de vente MQ est 2× plus long qu''en métropole. Ce n''est pas de la mauvaise volonté — c''est culturel.

IMPLICATION: Prévoir des cycles de vente de 4-8 semaines (pas 2-4). Relancer sans insister. Le WhatsApp informel (''Bonjour, j''espère que tout va bien'') maintient le lien sans pression. Patience = vertu commerciale #1 en MQ.', 'entry', ARRAY['bible','vente'], 73, 504)
ON CONFLICT DO NOTHING;

INSERT INTO lore_entries (universe, title, content, category, tags, word_count, order_index)
VALUES ('bible', 'RÈGLE #5: LE PRESTIGE SOCIAL', 'En MQ, le client achète aussi le PRESTIGE d''être associé à quelque chose de moderne/innovant. ''Mon restaurant a une vidéo IA'' = statut social. ''J''ai un chatbot IA'' = j''ai compris le monde moderne. L''IA est un marqueur de modernité.

IMPLICATION: Le pitch ne doit pas être ''vous avez besoin de ceci''. Le pitch doit être ''vos concurrents n''ont pas encore ça — vous serez le premier''. L''exclusivité et la primauté sont des leviers puissants en MQ.', 'entry', ARRAY['bible','vente'], 77, 505)
ON CONFLICT DO NOTHING;

INSERT INTO lore_entries (universe, title, content, category, tags, word_count, order_index)
VALUES ('bible', 'RÈGLE #6: LA SOLIDARITÉ LOCALE', 'Le Martiniquais préfère acheter local. ''C''est un gars d''ici'' = argument massif. Les agences parisiennes sont tolérées pour les gros comptes mais détestées en sous-main. BYSS GROUP = martiniquais, basé en MQ, pour la MQ.

IMPLICATION: TOUJOURS mentionner l''ancrage local. ''BYSS GROUP est basé en Martinique, pour la Martinique.'' C''est un avantage que ni Paris ni Kingston ne peuvent copier.', 'entry', ARRAY['bible','vente'], 60, 506)
ON CONFLICT DO NOTHING;

INSERT INTO lore_entries (universe, title, content, category, tags, word_count, order_index)
VALUES ('bible', 'RÈGLE #7: LE ''MOUVEMENT''', 'En MQ, quand quelqu''un fait quelque chose de nouveau, les gens observent d''abord, critiquent ensuite, puis copient. Le cycle: observation → moquerie → adoption → ''moi aussi je fais ça depuis longtemps''. Il faut RÉSISTER à la phase moquerie.

IMPLICATION: Les 5 premiers clients sont les plus durs. Après 5 clients, le ''mouvement'' est lancé. Après 10, tout le monde veut faire partie du truc. L''objectif des 90 premiers jours = franchir le cap des 5 clients visibles.', 'entry', ARRAY['bible','vente'], 78, 507)
ON CONFLICT DO NOTHING;

INSERT INTO lore_entries (universe, title, content, category, tags, word_count, order_index)
VALUES ('bible', 'CHAPITRE 5 — ARSENAL DE CRÉDIBILITÉ (BENCHMARKS PAR SECTEUR)', NULL, 'chapter', ARRAY['bible','vente'], 0, 600)
ON CONFLICT DO NOTHING;

INSERT INTO lore_entries (universe, title, content, category, tags, word_count, order_index)
VALUES ('bible', 'BENCHMARK HÔTELLERIE', '• Hôtels avec vidéo visite virtuelle: +15-25% de conversions sur Booking.com (source: Booking.com internal data + Expedia)
• Commission Booking.com: 15-18% du montant réservation
• Taux de booking direct moyen hôtels indépendants: 20-30%
• Objectif avec site optimisé + Google Ads: 40-50% de booking direct
• Économie annuelle pour un hôtel à 5M€ de CA: 500K-900K€/an en commissions
• ROI visite virtuelle: 8-12× l''investissement en 12 mois (source: VirtualToursCast)', 'entry', ARRAY['bible','vente'], 69, 601)
ON CONFLICT DO NOTHING;

INSERT INTO lore_entries (universe, title, content, category, tags, word_count, order_index)
VALUES ('bible', 'BENCHMARK GOOGLE ADS / LOUEURS', '• CPC moyen ''location voiture martinique'': 2-5€
• CPA moyen loueurs MQ estimé: 15-25€
• Impact YouTube pré-roll sur CPA search: -20 à -30% (source: Google Think)
• Budget Google Ads estimé loueurs MQ: 5-20K€/mois chacun
• YouTube pré-roll 15s: CPV moyen 0.03-0.08€ = 12K-40K vues pour 1K€
• Taux de VTR (View-Through Rate) YouTube: 70-80% pour 15s skippable', 'entry', ARRAY['bible','vente'], 59, 602)
ON CONFLICT DO NOTHING;

INSERT INTO lore_entries (universe, title, content, category, tags, word_count, order_index)
VALUES ('bible', 'BENCHMARK RESTAURANTS', '• Restaurants avec profil Google complet (photos+vidéo+avis répondus): +35% de clics vs profil incomplet (source: Google)
• Impact vidéo Instagram Reels pour restos: 2-3× le reach organique vs photos statiques
• Coût production vidéo classique pour resto: 3-8K€ + 2-3 semaines
• Coût BYSS GROUP: 750-1500€ + 48h = ÷5-10 en coût, ÷10-15 en temps', 'entry', ARRAY['bible','vente'], 55, 603)
ON CONFLICT DO NOTHING;

INSERT INTO lore_entries (universe, title, content, category, tags, word_count, order_index)
VALUES ('bible', 'BENCHMARK RHUM / E-COMMERCE', '• Croissance marché rhum premium mondial: +7-8%/an (source: IWSR 2024)
• Ventes e-commerce spiritueux: +25%/an depuis 2020 (source: Distill Ventures)
• Panier moyen rhum premium en ligne: 55-85€
• Taux de conversion e-com spiritueux: 1.5-3% (benchmark Shopify)
• CAC Google Ads export spiritueux: 8-15€ (marchés FR/UK/US)', 'entry', ARRAY['bible','vente'], 46, 604)
ON CONFLICT DO NOTHING;

INSERT INTO lore_entries (universe, title, content, category, tags, word_count, order_index)
VALUES ('bible', 'BENCHMARK AGENTS IA / CHATBOTS', '• Réduction charge service client avec chatbot: 30-70% des requêtes automatisées (source: Gartner 2025)
• Coût moyen employé service client MQ chargé: 30-40K€/an
• Coût chatbot BYSS GROUP: 5-15K€ setup + 500€/mois = 11-21K€/an = économie de 10-30K€/an
• Satisfaction client chatbot bien configuré: 85-92% (source: Intercom)
• Disponibilité: 24/7/365 vs 8h/jour 5j/semaine = ×5 la couverture horaire', 'entry', ARRAY['bible','vente'], 58, 605)
ON CONFLICT DO NOTHING;

INSERT INTO lore_entries (universe, title, content, category, tags, word_count, order_index)
VALUES ('bible', 'BENCHMARK IA VIDÉO vs CLASSIQUE', '• Coût production vidéo 30s classique MQ: 3-8K€
• Coût BYSS GROUP IA: 750€ = ÷4-10
• Délai classique: 2-4 semaines
• Délai IA: 48h = ÷7-14
• Volume productible classique: 2-4 vidéos/mois (1 vidéaste)
• Volume BYSS GROUP: 15-20 vidéos/mois (1 personne) = ×5-10
→ LE pitch unitaire le plus puissant: ''10× moins cher, 10× plus rapide, 10× plus de volume.''', 'entry', ARRAY['bible','vente'], 62, 606)
ON CONFLICT DO NOTHING;

INSERT INTO lore_entries (universe, title, content, category, tags, word_count, order_index)
VALUES ('bible', 'CHAPITRE 6 — LAND & EXPAND: DE 1.5K€ À 50K€ AVEC LE MÊME CLIENT', NULL, 'chapter', ARRAY['bible','vente'], 0, 700)
ON CONFLICT DO NOTHING;

INSERT INTO lore_entries (universe, title, content, category, tags, word_count, order_index)
VALUES ('bible', 'LE PRINCIPE', 'Tu n''entres JAMAIS avec l''offre complète. Tu entres avec le plus petit engagement possible. Tu livres vite et bien. Le client est content. La confiance est établie. PUIS tu proposes le service suivant. Et le suivant. En 6 mois, le panier passe de 1.5K€ à 20-50K€ sans que le client ait jamais dit ''c''est trop''.

C''est la stratégie Salesforce, AWS, et toutes les startups B2B qui font $1Md+ de CA. Aucune d''entre elles ne vend le package complet au premier RDV.', 'entry', ARRAY['bible','vente'], 81, 701)
ON CONFLICT DO NOTHING;

INSERT INTO lore_entries (universe, title, content, category, tags, word_count, order_index)
VALUES ('bible', 'SÉQUENCE LAND & EXPAND', 'LAND (Sem 1-2): 1 vidéo IA. 750-1500€. 48h de livraison. Le client voit le résultat. Il est content.

EXPAND #1 (Sem 3-4): ''Et si on faisait les visuels pour vos réseaux aussi ?'' +500€/mois. Le client dit oui sans réfléchir — c''est petit.

EXPAND #2 (Mois 2): ''Votre vidéo tourne bien mais votre site date de 2018. Je le refais.'' +5-8K€. Le client a confiance.

EXPAND #3 (Mois 3): ''Maintenant que le site est live, on met du Google Ads dessus pour driver du trafic.'' +500-1K€/mois. MRR installé.

EXPAND #4 (Mois 4-5): ''Vos clients posent toujours les mêmes questions. Un chatbot IA peut répondre 24/7.'' +5-10K€.

EXPAND #5 (Mois 6): ''Et si on automatisait l''ensemble ? Audit transformation IA.'' +5-15K€.

RÉSULTAT: Le client qui est entré à 1 500€ est maintenant à 25-40K€/an. En 6 mois. Sans jamais avoir dit ''c''est trop''.', 'entry', ARRAY['bible','vente'], 142, 702)
ON CONFLICT DO NOTHING;

INSERT INTO lore_entries (universe, title, content, category, tags, word_count, order_index)
VALUES ('bible', 'TRIGGERS D''UPSELL', 'Quand proposer l''expand suivant ? Pas au hasard. À ces TRIGGERS précis:

→ Le client poste la vidéo sur Instagram et reçoit des likes = TRIGGER pour proposer du contenu mensuel
→ Le client dit ''j''aimerais avoir un site'' = TRIGGER évident
→ Le client dit ''on a beaucoup de demandes par téléphone'' = TRIGGER chatbot
→ Le client dit ''on dépense en pub mais on sait pas si ça marche'' = TRIGGER Google Ads
→ Le client dit ''mon concurrent a [X]'' = TRIGGER tout ce que le concurrent a
→ La haute saison approche = TRIGGER contenu saisonnier
→ 30 jours après livraison = TRIGGER de check-in + proposition expand

RÈGLE: ne JAMAIS proposer un expand quand le client n''est pas satisfait du précédent. La satisfaction est le pré-requis. Toujours demander: ''Comment ça se passe avec [le dernier livrable] ?'' AVANT de proposer la suite.', 'entry', ARRAY['bible','vente'], 147, 703)
ON CONFLICT DO NOTHING;

INSERT INTO lore_entries (universe, title, content, category, tags, word_count, order_index)
VALUES ('bible', 'CHAPITRE 7 — CAPACITÉ SOLO & SEUIL DE RECRUTEMENT', NULL, 'chapter', ARRAY['bible','vente'], 0, 800)
ON CONFLICT DO NOTHING;

INSERT INTO lore_entries (universe, title, content, category, tags, word_count, order_index)
VALUES ('bible', 'CAPACITÉ MAX GARY SOLO', 'Vidéo Kling: 2-3h/vidéo → 2-3/jour → 10-15/semaine → 50-60/mois
Images Nano Banana: 30 min/lot 10 → 100+/semaine
Site web: 3-5 jours → 4-6 sites/mois max
App: 2-4 semaines → 1-2 apps/mois max
Google Ads setup: 1 jour → 5/semaine, gestion: 2h/compte → 20 comptes max
Agent IA: 3-5 jours → 4-6/mois max
Conseil/Audit: 1-2 jours → 8-10/mois max

PLAFOND CA SOLO: ~200-300K€/an si 100% occupé. Soit ~65-100% de charge avec zéro temps de prospection. Irréaliste à 100%.', 'entry', ARRAY['bible','vente'], 77, 801)
ON CONFLICT DO NOTHING;

INSERT INTO lore_entries (universe, title, content, category, tags, word_count, order_index)
VALUES ('bible', 'CHARGE RÉALISTE', 'Prospection/commercial: 30% du temps (sem 1-4), puis 15% (phase croisière)
Production: 50-60% du temps
Admin/facturation/relances: 10-15%
Formation continue: 5%

CA RÉALISTE SOLO Y1: 100-180K€
CA PLAFOND SOLO: 250-300K€

→ Au-delà de 250K€ de pipeline signé = RECRUTER ou perdre des clients.', 'entry', ARRAY['bible','vente'], 41, 802)
ON CONFLICT DO NOTHING;

INSERT INTO lore_entries (universe, title, content, category, tags, word_count, order_index)
VALUES ('bible', 'SEUIL DE RECRUTEMENT', 'PREMIER RECRUTEMENT: quand pipeline > 200K€ OU quand délai de livraison dépasse 2 semaines sur 3 projets consécutifs.

QUI: Nicolas Boromée (dev BeeCee, considéré comme un génie). Profil CTO: dev web/app + IA. Il gère la production technique, Gary gère le commercial + la vidéo.

MODÈLE: Freelance d''abord (pas de CDI). 3-5K€/mois selon projets. Passe en CDI quand CA > 300K€/an.

DEUXIÈME RECRUTEMENT: quand CA > 400K€/an. Profil: commercial/account manager. Il gère la relation client et les relances. Gary gère la stratégie et la vision.', 'entry', ARRAY['bible','vente'], 85, 803)
ON CONFLICT DO NOTHING;

INSERT INTO lore_entries (universe, title, content, category, tags, word_count, order_index)
VALUES ('bible', 'CHAPITRE 8 — CALENDRIER DE SAISONNALITÉ MQ × PROSPECTION', NULL, 'chapter', ARRAY['bible','vente'], 0, 900)
ON CONFLICT DO NOTHING;

INSERT INTO lore_entries (universe, title, content, category, tags, word_count, order_index)
VALUES ('bible', 'JANVIER-FÉVRIER', '🎭 CARNAVAL. Toute l''île vibre. Prospecter: Brasserie Lorraine (sponsoring carnaval), bars/rooftops (événements), agences com.
Distilleries: la récolte commence. C''est LE moment pour les vidéos ''récolte de la canne''. Clément, JM, Depaz.
Hôtels: pleine saison tourisme. Pas le moment de prospecter (trop occupés). Moment de livrer le contenu commandé en sept-nov.', 'entry', ARRAY['bible','vente'], 50, 901)
ON CONFLICT DO NOTHING;

INSERT INTO lore_entries (universe, title, content, category, tags, word_count, order_index)
VALUES ('bible', 'MARS-AVRIL', 'Pâques = pic touristique #2. Semaine sainte.
Institutions: budgets Q1 confirmés. CMT, CCI, MEDEF = fenêtre idéale pour présenter.
Distilleries: pleine récolte. Filmer le contenu ''terroir''.
Excursions: pleine saison. Livrer, pas prospecter.', 'entry', ARRAY['bible','vente'], 32, 902)
ON CONFLICT DO NOTHING;

INSERT INTO lore_entries (universe, title, content, category, tags, word_count, order_index)
VALUES ('bible', 'MAI-JUIN', 'Fin haute saison tourisme. Début saison des pluies.
🎯 FENÊTRE DE PROSPECTION IDÉALE POUR: hôtels (ils soufflent post-saison, ont le temps de réfléchir), excursions (idem), restos (saison plus calme).
Distilleries: fin récolte, début repos. Bon moment pour e-commerce + digital (ils ont du temps).', 'entry', ARRAY['bible','vente'], 44, 903)
ON CONFLICT DO NOTHING;

INSERT INTO lore_entries (universe, title, content, category, tags, word_count, order_index)
VALUES ('bible', 'JUILLET-AOÛT', '⛵ TOUR DES YOLES (fin juillet). L''événement #1 de MQ.
Prospecter: Lorraine (sponsor Yoles), sponsors événementiels.
Vacances: beaucoup de décideurs en congé. Prospection institutionnelle en pause.
Excursions: pleine saison été (vacances scolaires MQ). Livrer.', 'entry', ARRAY['bible','vente'], 34, 904)
ON CONFLICT DO NOTHING;

INSERT INTO lore_entries (universe, title, content, category, tags, word_count, order_index)
VALUES ('bible', 'SEPTEMBRE-OCTOBRE', '🎯 LA MEILLEURE FENÊTRE DE PROSPECTION DE L''ANNÉE.
Tout le monde est de retour. Les budgets N+1 se préparent. Les décideurs planifient la haute saison (déc-avril).
Prospecter TOUS les secteurs: hôtels, distilleries, excursions, institutions, loueurs.
MEDEF/CE/CCI: événements de rentrée = créneau de présentation.
Distilleries: budget com N+1 en préparation. Le moment de pitcher les packs annuels.', 'entry', ARRAY['bible','vente'], 56, 905)
ON CONFLICT DO NOTHING;

INSERT INTO lore_entries (universe, title, content, category, tags, word_count, order_index)
VALUES ('bible', 'NOVEMBRE', 'Préparation haute saison. Dernière ligne droite.
Les retardataires qui n''ont pas commandé en sept-oct paniquent.
''Vous voulez du contenu pour Noël ? Il reste 4 semaines. On peut encore le faire en IA.''', 'entry', ARRAY['bible','vente'], 33, 906)
ON CONFLICT DO NOTHING;

INSERT INTO lore_entries (universe, title, content, category, tags, word_count, order_index)
VALUES ('bible', 'DÉCEMBRE', '🎄 Noël + Nouvel An. Pic touristique #1.
Livrer le contenu commandé. Pas de prospection.
Facturer les projets livrés. Bilan annuel. Préparer janvier.', 'entry', ARRAY['bible','vente'], 23, 907)
ON CONFLICT DO NOTHING;

INSERT INTO lore_entries (universe, title, content, category, tags, word_count, order_index)
VALUES ('bible', 'SYNTHÈSE', 'PROSPECTER: sept-oct (peak), mai-juin (secondaire), mars-avril (institutions)
LIVRER: déc-avril (haute saison), juil-août (été)
ÉVÉNEMENTS: Carnaval (fév), Yoles (juil), Noël (déc)
REPOS: aucun. L''oseille-pays pousse toute l''année.', 'entry', ARRAY['bible','vente'], 26, 908)
ON CONFLICT DO NOTHING;

-- Total bible entries inserted: 74

-- ═══════════════════════════════════════════════════════════════
-- LORE_ENTRIES — Grille Tarifaire (pricing)
-- ═══════════════════════════════════════════════════════════════

INSERT INTO lore_entries (universe, title, content, category, tags, word_count, order_index)
VALUES ('bible', '🎬 SERVICE 1 — VIDÉO IA', '🎬 SERVICE 1 — VIDÉO IA', 'pricing_section', ARRAY['bible','tarif','pricing'], 0, 2001)
ON CONFLICT DO NOTHING;

INSERT INTO lore_entries (universe, title, content, category, tags, word_count, order_index)
VALUES ('bible', 'Vidéo Spot 15-30s (Réseaux sociaux)', 'Prix: 750€ | Récurrence: One-shot | Détail: Kling 3.0 + Premiere Pro. Format 9:16 vertical (Reels/TikTok/Shorts). 1 révision incluse.', 'pricing', ARRAY['bible','tarif','pricing'], 19, 2002)
ON CONFLICT DO NOTHING;

INSERT INTO lore_entries (universe, title, content, category, tags, word_count, order_index)
VALUES ('bible', 'Vidéo Spot 30-60s (Site web / YouTube)', 'Prix: 1 500€ | Récurrence: One-shot | Détail: Kling 3.0 + Premiere Pro. Format 16:9. Sound design. 2 révisions incluses.', 'pricing', ARRAY['bible','tarif','pricing'], 20, 2003)
ON CONFLICT DO NOTHING;

INSERT INTO lore_entries (universe, title, content, category, tags, word_count, order_index)
VALUES ('bible', 'Film 60-120s (Storytelling / Brand)', 'Prix: 2 500 - 5 000€ | Récurrence: One-shot | Détail: Kling + Higgsfield + Kimi 2.6. Scénario, voix off, montage complet. 3 révisions.', 'pricing', ARRAY['bible','tarif','pricing'], 24, 2004)
ON CONFLICT DO NOTHING;

INSERT INTO lore_entries (universe, title, content, category, tags, word_count, order_index)
VALUES ('bible', 'Vidéo Aftermovie mariage', 'Prix: 1 500 - 3 000€ | Récurrence: Par mariage | Détail: Film 90-120s des meilleurs moments. Base photos/vidéos fournies par le client.', 'pricing', ARRAY['bible','tarif','pricing'], 23, 2005)
ON CONFLICT DO NOTHING;

INSERT INTO lore_entries (universe, title, content, category, tags, word_count, order_index)
VALUES ('bible', 'Pack 6 vidéos/mois (Spot 15-30s)', 'Prix: 3 500€/mois | Récurrence: Mensuel | Détail: 6 vidéos 15-30s. Idéal pour réseaux sociaux. Rotation créative hebdomadaire.', 'pricing', ARRAY['bible','tarif','pricing'], 18, 2006)
ON CONFLICT DO NOTHING;

INSERT INTO lore_entries (universe, title, content, category, tags, word_count, order_index)
VALUES ('bible', 'Pack 12 vidéos/mois', 'Prix: 6 000€/mois | Récurrence: Mensuel | Détail: 12 vidéos multi-format. Idéal pour télécoms / gros comptes.', 'pricing', ARRAY['bible','tarif','pricing'], 17, 2007)
ON CONFLICT DO NOTHING;

INSERT INTO lore_entries (universe, title, content, category, tags, word_count, order_index)
VALUES ('bible', 'Pack 72 vidéos/an (contrat annuel)', 'Prix: 54 000€/an | Récurrence: Annuel | Détail: 72 vidéos. 750€/vidéo. Contrat annuel avec engagement. Le tarif le + avantageux.', 'pricing', ARRAY['bible','tarif','pricing'], 20, 2008)
ON CONFLICT DO NOTHING;

INSERT INTO lore_entries (universe, title, content, category, tags, word_count, order_index)
VALUES ('bible', '🖼️ SERVICE 2 — IMAGES IA', '🖼️ SERVICE 2 — IMAGES IA', 'pricing_section', ARRAY['bible','tarif','pricing'], 0, 2009)
ON CONFLICT DO NOTHING;

INSERT INTO lore_entries (universe, title, content, category, tags, word_count, order_index)
VALUES ('bible', 'Visuel publicitaire unitaire', 'Prix: 50€ | Récurrence: One-shot | Détail: Nano Banana Pro (Google DeepMind). Format au choix. 1 révision.', 'pricing', ARRAY['bible','tarif','pricing'], 17, 2010)
ON CONFLICT DO NOTHING;

INSERT INTO lore_entries (universe, title, content, category, tags, word_count, order_index)
VALUES ('bible', 'Pack 10 visuels', 'Prix: 400€ | Récurrence: One-shot | Détail: 10 visuels multi-format (Feed, Story, Display). A/B testing inclus.', 'pricing', ARRAY['bible','tarif','pricing'], 16, 2011)
ON CONFLICT DO NOTHING;

INSERT INTO lore_entries (universe, title, content, category, tags, word_count, order_index)
VALUES ('bible', 'Pack 20 visuels/mois', 'Prix: 600€/mois | Récurrence: Mensuel | Détail: 20 visuels/mois. Idéal pour Google Display + Meta Ads. Rotation permanente.', 'pricing', ARRAY['bible','tarif','pricing'], 18, 2012)
ON CONFLICT DO NOTHING;

INSERT INTO lore_entries (universe, title, content, category, tags, word_count, order_index)
VALUES ('bible', 'Packshot produit (e-commerce)', 'Prix: 80€/produit | Récurrence: One-shot | Détail: Photo produit IA fond blanc + ambiance. Idéal e-commerce rhum.', 'pricing', ARRAY['bible','tarif','pricing'], 17, 2013)
ON CONFLICT DO NOTHING;

INSERT INTO lore_entries (universe, title, content, category, tags, word_count, order_index)
VALUES ('bible', '🌐 SERVICE 3 — SITES WEB & E-COMMERCE', '🌐 SERVICE 3 — SITES WEB & E-COMMERCE', 'pricing_section', ARRAY['bible','tarif','pricing'], 0, 2014)
ON CONFLICT DO NOTHING;

INSERT INTO lore_entries (universe, title, content, category, tags, word_count, order_index)
VALUES ('bible', 'Site vitrine (1-5 pages)', 'Prix: 3 000 - 5 000€ | Récurrence: One-shot | Détail: Design custom. Mobile-first. SEO de base. Hébergement Vercel. Formulaire contact.', 'pricing', ARRAY['bible','tarif','pricing'], 21, 2015)
ON CONFLICT DO NOTHING;

INSERT INTO lore_entries (universe, title, content, category, tags, word_count, order_index)
VALUES ('bible', 'Site vitrine + réservation/booking', 'Prix: 5 000 - 8 000€ | Récurrence: One-shot | Détail: Tout vitrine + module booking en ligne (calendrier, paiement, confirmation auto).', 'pricing', ARRAY['bible','tarif','pricing'], 22, 2016)
ON CONFLICT DO NOTHING;

INSERT INTO lore_entries (universe, title, content, category, tags, word_count, order_index)
VALUES ('bible', 'Site e-commerce', 'Prix: 8 000 - 15 000€ | Récurrence: One-shot | Détail: Shopify ou custom. Catalogue produits. Paiement international. Livraison DOM+métropole+export.', 'pricing', ARRAY['bible','tarif','pricing'], 20, 2017)
ON CONFLICT DO NOTHING;

INSERT INTO lore_entries (universe, title, content, category, tags, word_count, order_index)
VALUES ('bible', 'Landing page', 'Prix: 1 500 - 2 500€ | Récurrence: One-shot | Détail: 1 page. Optimisée conversion. A/B testable. Idéal campagnes Google Ads.', 'pricing', ARRAY['bible','tarif','pricing'], 21, 2018)
ON CONFLICT DO NOTHING;

INSERT INTO lore_entries (universe, title, content, category, tags, word_count, order_index)
VALUES ('bible', 'Maintenance / hébergement', 'Prix: 500 - 1 000€/an | Récurrence: Annuel | Détail: Mises à jour, sécurité, sauvegarde, support. Optionnel.', 'pricing', ARRAY['bible','tarif','pricing'], 17, 2019)
ON CONFLICT DO NOTHING;

INSERT INTO lore_entries (universe, title, content, category, tags, word_count, order_index)
VALUES ('bible', '📱 SERVICE 4 — APPLICATIONS MOBILES', '📱 SERVICE 4 — APPLICATIONS MOBILES', 'pricing_section', ARRAY['bible','tarif','pricing'], 0, 2020)
ON CONFLICT DO NOTHING;

INSERT INTO lore_entries (universe, title, content, category, tags, word_count, order_index)
VALUES ('bible', 'App vitrine / information', 'Prix: 8 000 - 12 000€ | Récurrence: One-shot | Détail: App iOS + Android. Contenu, notifications push, géolocalisation.', 'pricing', ARRAY['bible','tarif','pricing'], 19, 2021)
ON CONFLICT DO NOTHING;

INSERT INTO lore_entries (universe, title, content, category, tags, word_count, order_index)
VALUES ('bible', 'App réservation / booking', 'Prix: 12 000 - 18 000€ | Récurrence: One-shot | Détail: Réservation en ligne, calendrier, paiement intégré, confirmation auto.', 'pricing', ARRAY['bible','tarif','pricing'], 19, 2022)
ON CONFLICT DO NOTHING;

INSERT INTO lore_entries (universe, title, content, category, tags, word_count, order_index)
VALUES ('bible', 'App visite guidée augmentée', 'Prix: 15 000 - 25 000€ | Récurrence: One-shot | Détail: Audio guide multilingue, réalité augmentée, scanner QR, parcours interactif.', 'pricing', ARRAY['bible','tarif','pricing'], 20, 2023)
ON CONFLICT DO NOTHING;

INSERT INTO lore_entries (universe, title, content, category, tags, word_count, order_index)
VALUES ('bible', 'App métier / sur mesure', 'Prix: 15 000 - 30 000€ | Récurrence: One-shot | Détail: Spécifications client. Développement custom. Claude Code + React Native.', 'pricing', ARRAY['bible','tarif','pricing'], 20, 2024)
ON CONFLICT DO NOTHING;

INSERT INTO lore_entries (universe, title, content, category, tags, word_count, order_index)
VALUES ('bible', 'Maintenance app', 'Prix: 1 000 - 2 000€/an | Récurrence: Annuel | Détail: Mises à jour OS, correctifs, support.', 'pricing', ARRAY['bible','tarif','pricing'], 17, 2025)
ON CONFLICT DO NOTHING;

INSERT INTO lore_entries (universe, title, content, category, tags, word_count, order_index)
VALUES ('bible', '📈 SERVICE 5 — GOOGLE ADS & PUBLICITÉ DIGITALE', '📈 SERVICE 5 — GOOGLE ADS & PUBLICITÉ DIGITALE', 'pricing_section', ARRAY['bible','tarif','pricing'], 0, 2026)
ON CONFLICT DO NOTHING;

INSERT INTO lore_entries (universe, title, content, category, tags, word_count, order_index)
VALUES ('bible', 'Audit Google Ads existant', 'Prix: 500€ | Récurrence: One-shot | Détail: Analyse du compte existant. Recommandations. Rapport PDF. GPT Deep Research.', 'pricing', ARRAY['bible','tarif','pricing'], 17, 2027)
ON CONFLICT DO NOTHING;

INSERT INTO lore_entries (universe, title, content, category, tags, word_count, order_index)
VALUES ('bible', 'Setup campagne Google Ads', 'Prix: 1 000 - 1 500€ | Récurrence: One-shot | Détail: Création compte, structure campagnes, mots-clés, annonces, tracking.', 'pricing', ARRAY['bible','tarif','pricing'], 18, 2028)
ON CONFLICT DO NOTHING;

INSERT INTO lore_entries (universe, title, content, category, tags, word_count, order_index)
VALUES ('bible', 'Gestion Google Ads (< 5K€/mois budget)', 'Prix: 500€/mois | Récurrence: Mensuel | Détail: Optimisation hebdomadaire. Rapport mensuel. Ajustements enchères/créatives.', 'pricing', ARRAY['bible','tarif','pricing'], 13, 2029)
ON CONFLICT DO NOTHING;

INSERT INTO lore_entries (universe, title, content, category, tags, word_count, order_index)
VALUES ('bible', 'Gestion Google Ads (5-15K€/mois budget)', 'Prix: 1 000 - 2 000€/mois | Récurrence: Mensuel | Détail: Idem + A/B testing avancé + stratégie enchères automatisée.', 'pricing', ARRAY['bible','tarif','pricing'], 20, 2030)
ON CONFLICT DO NOTHING;

INSERT INTO lore_entries (universe, title, content, category, tags, word_count, order_index)
VALUES ('bible', 'Gestion Google Ads (> 15K€/mois budget)', 'Prix: 2 000 - 3 000€/mois | Récurrence: Mensuel | Détail: Idem + reporting avancé + réunion stratégique mensuelle.', 'pricing', ARRAY['bible','tarif','pricing'], 19, 2031)
ON CONFLICT DO NOTHING;

INSERT INTO lore_entries (universe, title, content, category, tags, word_count, order_index)
VALUES ('bible', 'Gestion Meta Ads (Instagram/Facebook)', 'Prix: 500 - 2 000€/mois | Récurrence: Mensuel | Détail: Mêmes paliers que Google Ads. Création créatives incluse.', 'pricing', ARRAY['bible','tarif','pricing'], 18, 2032)
ON CONFLICT DO NOTHING;

INSERT INTO lore_entries (universe, title, content, category, tags, word_count, order_index)
VALUES ('bible', 'Gestion Instagram organique', 'Prix: 800€/mois | Récurrence: Mensuel | Détail: Calendrier éditorial, création de contenu, publication, engagement.', 'pricing', ARRAY['bible','tarif','pricing'], 14, 2033)
ON CONFLICT DO NOTHING;

INSERT INTO lore_entries (universe, title, content, category, tags, word_count, order_index)
VALUES ('bible', '🤖 SERVICE 6 — AGENTS IA & CHATBOTS', '🤖 SERVICE 6 — AGENTS IA & CHATBOTS', 'pricing_section', ARRAY['bible','tarif','pricing'], 0, 2034)
ON CONFLICT DO NOTHING;

INSERT INTO lore_entries (universe, title, content, category, tags, word_count, order_index)
VALUES ('bible', 'Chatbot FAQ simple', 'Prix: 3 000 - 5 000€ | Récurrence: One-shot | Détail: Chatbot site web. Répond aux questions fréquentes. 50-100 Q&A.', 'pricing', ARRAY['bible','tarif','pricing'], 20, 2035)
ON CONFLICT DO NOTHING;

INSERT INTO lore_entries (universe, title, content, category, tags, word_count, order_index)
VALUES ('bible', 'Chatbot réservation', 'Prix: 5 000 - 8 000€ | Récurrence: One-shot | Détail: Vérifie dispos, réserve, encaisse. Intégration calendrier. WhatsApp ou web.', 'pricing', ARRAY['bible','tarif','pricing'], 20, 2036)
ON CONFLICT DO NOTHING;

INSERT INTO lore_entries (universe, title, content, category, tags, word_count, order_index)
VALUES ('bible', 'Agent IA service client', 'Prix: 8 000 - 15 000€ | Récurrence: One-shot | Détail: Multilingue. Connecté CRM/email/calendrier. Claude + MCP. Qualification leads.', 'pricing', ARRAY['bible','tarif','pricing'], 19, 2037)
ON CONFLICT DO NOTHING;

INSERT INTO lore_entries (universe, title, content, category, tags, word_count, order_index)
VALUES ('bible', 'Agent IA sur mesure (complexe)', 'Prix: 12 000 - 20 000€ | Récurrence: One-shot | Détail: Specs client. Intégrations multiples (Gmail, Calendar, Drive, Slack). Workflow custom.', 'pricing', ARRAY['bible','tarif','pricing'], 21, 2038)
ON CONFLICT DO NOTHING;

INSERT INTO lore_entries (universe, title, content, category, tags, word_count, order_index)
VALUES ('bible', 'NotebookLM Expert (base connaissances)', 'Prix: 3 000 - 5 000€ | Récurrence: One-shot | Détail: Transformation de tous les documents client en assistant IA conversationnel.', 'pricing', ARRAY['bible','tarif','pricing'], 21, 2039)
ON CONFLICT DO NOTHING;

INSERT INTO lore_entries (universe, title, content, category, tags, word_count, order_index)
VALUES ('bible', 'Maintenance agent IA', 'Prix: 300 - 500€/mois | Récurrence: Mensuel | Détail: Mises à jour, monitoring, ajustements, support.', 'pricing', ARRAY['bible','tarif','pricing'], 15, 2040)
ON CONFLICT DO NOTHING;

INSERT INTO lore_entries (universe, title, content, category, tags, word_count, order_index)
VALUES ('bible', '🧠 SERVICE 7 — CONSEIL & FORMATION IA', '🧠 SERVICE 7 — CONSEIL & FORMATION IA', 'pricing_section', ARRAY['bible','tarif','pricing'], 0, 2041)
ON CONFLICT DO NOTHING;

INSERT INTO lore_entries (universe, title, content, category, tags, word_count, order_index)
VALUES ('bible', 'Audit transformation IA', 'Prix: 3 000 - 8 000€ | Récurrence: One-shot | Détail: Analyse process, identification gains productivité, roadmap IA. GPT Deep Research. Livrable PDF.', 'pricing', ARRAY['bible','tarif','pricing'], 23, 2042)
ON CONFLICT DO NOTHING;

INSERT INTO lore_entries (universe, title, content, category, tags, word_count, order_index)
VALUES ('bible', 'Audit transformation IA (grand compte)', 'Prix: 8 000 - 15 000€ | Récurrence: One-shot | Détail: Idem + interviews direction + analyse multi-départements + présentation comité direction.', 'pricing', ARRAY['bible','tarif','pricing'], 22, 2043)
ON CONFLICT DO NOTHING;

INSERT INTO lore_entries (universe, title, content, category, tags, word_count, order_index)
VALUES ('bible', 'Formation ''Initiation IA'' (demi-journée)', 'Prix: 1 500 - 2 500€ | Récurrence: Ponctuel | Détail: 3h. Jusqu''à 15 participants. Démos pratiques. Support remis. Subventionnable OPCO.', 'pricing', ARRAY['bible','tarif','pricing'], 21, 2044)
ON CONFLICT DO NOTHING;

INSERT INTO lore_entries (universe, title, content, category, tags, word_count, order_index)
VALUES ('bible', 'Formation ''IA avancée'' (journée complète)', 'Prix: 3 000 - 5 000€ | Récurrence: Ponctuel | Détail: 7h. Jusqu''à 15 participants. Cas pratiques avec les outils de l''entreprise.', 'pricing', ARRAY['bible','tarif','pricing'], 22, 2045)
ON CONFLICT DO NOTHING;

INSERT INTO lore_entries (universe, title, content, category, tags, word_count, order_index)
VALUES ('bible', 'Accompagnement transformation (mensuel)', 'Prix: 2 000 - 5 000€/mois | Récurrence: Mensuel | Détail: 1-2 jours/mois sur site. Mise en œuvre roadmap IA. Support opérationnel.', 'pricing', ARRAY['bible','tarif','pricing'], 22, 2046)
ON CONFLICT DO NOTHING;

INSERT INTO lore_entries (universe, title, content, category, tags, word_count, order_index)
VALUES ('bible', 'Conférence ''L''IA pour les entreprises''', 'Prix: 5 000 - 15 000€ | Récurrence: Ponctuel | Détail: 45-60 min. 5 cas concrets chiffrés. Idéal événements MEDEF/CCI/CE.', 'pricing', ARRAY['bible','tarif','pricing'], 20, 2047)
ON CONFLICT DO NOTHING;

INSERT INTO lore_entries (universe, title, content, category, tags, word_count, order_index)
VALUES ('bible', 'PACK RESTAURANT', 'Prix: 6 000€ | Récurrence: One-shot | Détail: Vidéo 30s + Site vitrine + 10 visuels. Le pack de démarrage pour les restos.', 'pricing', ARRAY['bible','tarif','pricing'], 23, 2048)
ON CONFLICT DO NOTHING;

INSERT INTO lore_entries (universe, title, content, category, tags, word_count, order_index)
VALUES ('bible', 'PACK EXCURSION NAUTIQUE', 'Prix: 12 000€ + 500€/mois | Récurrence: Setup + MRR | Détail: Vidéo 45s + Site booking + Google Ads gestion + 10 visuels.', 'pricing', ARRAY['bible','tarif','pricing'], 24, 2049)
ON CONFLICT DO NOTHING;

INSERT INTO lore_entries (universe, title, content, category, tags, word_count, order_index)
VALUES ('bible', 'PACK HÔTEL', 'Prix: 25 000€ + 2K€/mois | Récurrence: Setup + MRR | Détail: Vidéo visite virtuelle + Refonte site booking direct + Google Ads + chatbot concierge.', 'pricing', ARRAY['bible','tarif','pricing'], 26, 2050)
ON CONFLICT DO NOTHING;

INSERT INTO lore_entries (universe, title, content, category, tags, word_count, order_index)
VALUES ('bible', 'PACK DISTILLERIE', 'Prix: 22 000€ + 1K€/mois | Récurrence: Setup + MRR | Détail: Vidéo patrimoine + E-commerce + Google Ads export + NotebookLM Expert Rhum.', 'pricing', ARRAY['bible','tarif','pricing'], 24, 2051)
ON CONFLICT DO NOTHING;

INSERT INTO lore_entries (universe, title, content, category, tags, word_count, order_index)
VALUES ('bible', 'PACK MARIAGE (partenariat)', 'Prix: 1 500 - 3 000€/mariage | Récurrence: Par mariage | Détail: Aftermovie + teaser. Commission 10-15% au wedding planner. Pipeline passif.', 'pricing', ARRAY['bible','tarif','pricing'], 22, 2052)
ON CONFLICT DO NOTHING;

INSERT INTO lore_entries (universe, title, content, category, tags, word_count, order_index)
VALUES ('bible', 'PACK ENTREPRISE COMPLÈTE', 'Prix: 15 000 - 30 000€ | Récurrence: One-shot | Détail: Vidéo + Site + Agent IA + Formation équipe. Le tout-en-un pour TPE/PME.', 'pricing', ARRAY['bible','tarif','pricing'], 24, 2053)
ON CONFLICT DO NOTHING;

INSERT INTO lore_entries (universe, title, content, category, tags, word_count, order_index)
VALUES ('bible', 'PACK TRANSFORMATION IA', 'Prix: 8 000 - 20 000€ | Récurrence: One-shot | Détail: Audit + Roadmap + 1 agent IA + Formation. Le pack conseil pour les directions.', 'pricing', ARRAY['bible','tarif','pricing'], 26, 2054)
ON CONFLICT DO NOTHING;

INSERT INTO lore_entries (universe, title, content, category, tags, word_count, order_index)
VALUES ('bible', 'Acompte', 'Prix: 30% à la commande, 40% à la livraison, 30% à 30 jours.', 'pricing', ARRAY['bible','tarif','pricing'], 13, 2055)
ON CONFLICT DO NOTHING;

INSERT INTO lore_entries (universe, title, content, category, tags, word_count, order_index)
VALUES ('bible', 'Contrats annuels', 'Prix: Paiement mensuel. Engagement 12 mois. -10% sur les tarifs unitaires.', 'pricing', ARRAY['bible','tarif','pricing'], 11, 2056)
ON CONFLICT DO NOTHING;

INSERT INTO lore_entries (universe, title, content, category, tags, word_count, order_index)
VALUES ('bible', 'Révisions incluses', 'Prix: 1 à 3 révisions selon le service (précisé dans chaque ligne).', 'pricing', ARRAY['bible','tarif','pricing'], 12, 2057)
ON CONFLICT DO NOTHING;

INSERT INTO lore_entries (universe, title, content, category, tags, word_count, order_index)
VALUES ('bible', 'Délai de production', 'Prix: Vidéo IA: 48-72h. Site web: 2-4 semaines. App: 4-8 semaines. Agent IA: 2-4 semaines.', 'pricing', ARRAY['bible','tarif','pricing'], 15, 2058)
ON CONFLICT DO NOTHING;

INSERT INTO lore_entries (universe, title, content, category, tags, word_count, order_index)
VALUES ('bible', 'Remise volume', 'Prix: > 3 services combinés: -10%. > 5 services: -15%. Contrat cadre groupe: sur devis.', 'pricing', ARRAY['bible','tarif','pricing'], 15, 2059)
ON CONFLICT DO NOTHING;

INSERT INTO lore_entries (universe, title, content, category, tags, word_count, order_index)
VALUES ('bible', 'TVA', 'Prix: Tous les prix sont HT. TVA applicable selon régime fiscal BYSS GROUP SAS.', 'pricing', ARRAY['bible','tarif','pricing'], 14, 2060)
ON CONFLICT DO NOTHING;

INSERT INTO lore_entries (universe, title, content, category, tags, word_count, order_index)
VALUES ('bible', 'Propriété intellectuelle', 'Prix: Le client est propriétaire des livrables après paiement intégral.', 'pricing', ARRAY['bible','tarif','pricing'], 10, 2061)
ON CONFLICT DO NOTHING;

INSERT INTO lore_entries (universe, title, content, category, tags, word_count, order_index)
VALUES ('bible', 'Support', 'Prix: Email + WhatsApp. Réponse sous 24h ouvrées. Support prioritaire pour contrats annuels.', 'pricing', ARRAY['bible','tarif','pricing'], 13, 2062)
ON CONFLICT DO NOTHING;

-- Total pricing entries inserted: 62

-- ═══════════════════════════════════════════════════════════════
-- PROMPTS — Templates de prospection
-- ═══════════════════════════════════════════════════════════════

INSERT INTO prompts (name, category, template, variables, model, is_master)
VALUES ('email -- 📧 EMAIL — RESTAURANTS (65 prospects)', 'text', '[Note]
Personnaliser [NOM_RESTO], [X_AVIS], [NOTE]. Envoyer depuis gary@byssgroup.fr

[Objet]
[NOM_RESTO] — Vos [X_AVIS] avis méritent une vidéo

[Corps]
Bonjour,

Je suis Gary Bissol, fondateur de BYSS GROUP, agence spécialisée en vidéo IA et transformation digitale en Martinique.

[NOM_RESTO] a [X_AVIS] avis Google et une note de [NOTE]★ — c''est exceptionnel. Mais quand un touriste cherche un restaurant sur Google, il voit vos concurrents avec des vidéos, pas vous.

BYSS GROUP produit des vidéos professionnelles en 48h grâce à l''intelligence artificielle, pour une fraction du coût d''une production classique.

Je vous propose de créer gratuitement une vidéo de 30 secondes de votre restaurant pour vous montrer le résultat. Sans engagement.

Voici un exemple de ce que nous faisons : [LIEN_PORTFOLIO]

Seriez-vous disponible pour un échange de 10 minutes cette semaine ?

Gary Bissol
Fondateur — BYSS GROUP SAS
+596 [VOTRE_TEL]
gary@byssgroup.fr

[Note personnalisation]
Pour les restos gastro (MIZA, Case Coco, L''Escale): remplacer ''vidéo de 30 secondes'' par ''film culinaire de 60 secondes mettant en valeur votre cuisine et votre chef''. Pour les bars (Le Zest, Le Cloud): remplacer par ''vidéo ambiance sunset/soirée pour Instagram''.

[Conseil envoi]
Envoyer le mardi ou mercredi matin (10h-11h). Le lundi les restos sont souvent fermés. Le jeudi-dimanche ils sont en service.', '["NOM_RESTO", "X_AVIS", "NOTE", "LIEN_PORTFOLIO", "VOTRE_TEL"]'::jsonb, 'prospection', false)
ON CONFLICT DO NOTHING;

INSERT INTO prompts (name, category, template, variables, model, is_master)
VALUES ('email -- 📧 EMAIL — HÔTELS (22 prospects)', 'text', '[Objet]
[NOM_HOTEL] — Visite virtuelle vidéo pour booster vos réservations directes

[Corps]
Bonjour,

Gary Bissol, fondateur de BYSS GROUP — agence vidéo IA et digital en Martinique.

Les hôtels qui ajoutent une vidéo visite virtuelle sur leur profil Booking.com voient leurs conversions augmenter de 15 à 25% (benchmark industrie hôtelière).

[NOM_HOTEL] a [X_AVIS] avis Google mais pas de vidéo visite virtuelle. C''est une opportunité manquée chaque jour.

BYSS GROUP crée des vidéos immersives en 48h grâce à l''IA — pour 5 à 10× moins cher qu''une production classique. Nous proposons aussi des solutions de booking direct pour réduire votre dépendance à Booking.com (et ses 15-18% de commission).

Je vous propose une vidéo démo GRATUITE de votre plus belle chambre vue mer. 48h de production. Zéro engagement.

Seriez-vous disponible pour en discuter ?

Cordialement,
Gary Bissol
BYSS GROUP SAS
+596 [TEL] | gary@byssgroup.fr

[Variante Karibea]
Ajouter: ''Pour un groupe comme Karibea avec 3 établissements, nous proposons un pack multi-hôtels avec un tarif dégressif très attractif.''

[Variante Bakoua]
Ajouter: ''Le Bakoua a une histoire unique (Sommet Bush-Mitterrand 1991) qui mérite un storytelling vidéo exceptionnel.''', '["NOM_HOTEL", "X_AVIS", "TEL"]'::jsonb, 'prospection', false)
ON CONFLICT DO NOTHING;

INSERT INTO prompts (name, category, template, variables, model, is_master)
VALUES ('email -- 📧 EMAIL — DISTILLERIES (12 prospects)', 'text', '[Objet]
[NOM_DISTILLERIE] — Vidéo patrimoine + e-commerce rhum en ligne

[Corps]
Bonjour,

Gary Bissol, BYSS GROUP — agence vidéo IA et digital en Martinique.

Le marché mondial du rhum premium croît de 8% par an. Les amateurs de Tokyo à Berlin cherchent à acheter du [NOM_RHUM] en ligne — mais ils ne trouvent pas de boutique e-commerce.

BYSS GROUP propose un pack complet pour les distilleries martiniquaises :
— Vidéo immersive patrimoine / terroir (IA, 48h de production)
— Boutique e-commerce rhum (livraison DOM + métropole + international)
— Campagnes Google Ads export (marchés FR, UK, US, DE, JP)

Je serais ravi de visiter [NOM_DISTILLERIE] et de vous montrer ce que l''IA permet de faire pour valoriser votre patrimoine.

Seriez-vous disponible pour une visite cette semaine ?

Gary Bissol
BYSS GROUP SAS

[Variante Neisson]
Remplacer l''intro par: ''Neisson est reconnu mondialement comme l''un des meilleurs rhums au monde. Pourtant, votre note Google (3.2★) ne reflète pas cette excellence. Une vidéo storytelling BYSS GROUP peut changer cette perception.''', '["NOM_DISTILLERIE", "NOM_RHUM"]'::jsonb, 'prospection', false)
ON CONFLICT DO NOTHING;

INSERT INTO prompts (name, category, template, variables, model, is_master)
VALUES ('email -- 📧 EMAIL — EXCURSIONS NAUTIQUES (13 prospects)', 'text', '[Objet]
[NOM_EXCURSION] — [X_AVIS] avis [NOTE]★ mais aucune vidéo pro ?

[Corps]
Bonjour,

Gary Bissol, BYSS GROUP.

[NOM_EXCURSION] a [X_AVIS] avis Google avec une note de [NOTE]★ — vous êtes dans le top des activités de Martinique.

Mais quand un touriste hésite entre votre excursion et un concurrent, il n''a que des photos de téléphone pour se décider. Une vidéo professionnelle de 45 secondes (dauphins, snorkeling, repas à bord, sunset) fait toute la différence.

BYSS GROUP crée ces vidéos en 48h avec l''IA. Je propose d''embarquer gratuitement sur votre prochaine sortie pour capturer le contenu, puis de vous livrer la vidéo sans engagement.

Si ça vous plaît, on en parle. Sinon, vous gardez la vidéo quand même.

On en discute ?

Gary Bissol — BYSS GROUP
+596 [TEL]

[Note]
Ce template marche aussi par WhatsApp (version courte). Le ton est volontairement décontracté car les excursionnistes sont des indépendants, pas des corporates.', '["NOM_EXCURSION", "X_AVIS", "NOTE", "TEL"]'::jsonb, 'prospection', false)
ON CONFLICT DO NOTHING;

INSERT INTO prompts (name, category, template, variables, model, is_master)
VALUES ('email -- 📧 EMAIL — INSTITUTIONS (CMT, CCI, MEDEF, CE)', 'text', '[Objet]
BYSS GROUP — Vidéo IA et transformation digitale pour les entreprises martiniquaises

[Corps]
Bonjour [PRÉNOM],

Gary Bissol, fondateur de BYSS GROUP SAS, agence spécialisée en vidéo IA, développement digital et conseil en transformation IA en Martinique.

J''accompagne les entreprises martiniquaises dans leur transition numérique avec une offre complète : production vidéo par intelligence artificielle, création de sites web et applications, gestion de campagnes Google Ads, et développement d''agents IA sur mesure.

Je souhaiterais vous proposer :
— Une présentation de 5 à 8 minutes lors de l''un de vos prochains événements, pour montrer concrètement ce que l''IA peut apporter aux entreprises martiniquaises
— En échange, je réalise gratuitement la captation vidéo de votre événement

Cette approche a un double bénéfice : vos adhérents découvrent des solutions concrètes, et votre événement bénéficie d''un contenu vidéo professionnel.

Seriez-vous disponible pour en discuter ?

Cordialement,
Gary Bissol
Fondateur — BYSS GROUP SAS
KBIS Fort-de-France — NAF 62.01Z
+596 [TEL] | gary@byssgroup.fr

[Conseil]
Ton plus formel que les autres secteurs. Mentionner le KBIS et le NAF = crédibilité institutionnelle. Ne PAS vendre dans l''email. Proposer de la VALEUR (présentation éducative + captation gratuite).', '["TEL"]'::jsonb, 'prospection', false)
ON CONFLICT DO NOTHING;

INSERT INTO prompts (name, category, template, variables, model, is_master)
VALUES ('email -- 📧 EMAIL — LOUEURS DE VOITURES (10 prospects)', 'text', '[Objet]
[NOM_LOUEUR] — Vos campagnes Google Ads pourraient coûter 20-30% de moins

[Corps]
Bonjour,

Gary Bissol, BYSS GROUP — agence vidéo IA et digital en Martinique.

Les loueurs de voitures martiniquais dépensent en moyenne 5 à 20K€ par mois en Google Ads pour le mot-clé ''location voiture martinique''. Le CPA moyen est de 15 à 25€ par conversion.

BYSS GROUP peut réduire votre CPA de 20 à 30% en ajoutant des vidéos YouTube pré-roll à vos campagnes. Le touriste voit votre vidéo (aéroport → route côtière → plage) AVANT de cliquer sur les résultats de recherche. L''émotion précède le prix.

Je propose un A/B test sur 1 mois : campagne actuelle vs campagne + vidéo BYSS GROUP. Si le CPA ne baisse pas, vous ne payez rien.

Intéressé par le test ?

Gary Bissol — BYSS GROUP SAS
+596 [TEL]

[Note]
L''argument ''si le CPA ne baisse pas, vous ne payez rien'' est très agressif mais fonctionne car tu sais que ça marche. Réserver cette garantie aux loueurs qui hésitent.', '["NOM_LOUEUR", "TEL"]'::jsonb, 'prospection', false)
ON CONFLICT DO NOTHING;

INSERT INTO prompts (name, category, template, variables, model, is_master)
VALUES ('email -- 📧 EMAIL — CORPORATE / ÉNERGIE / BTP (SARA, EDF, etc.)', 'text', '[Objet]
BYSS GROUP — Production vidéo IA pour vos besoins RSE et marque employeur

[Corps]
Bonjour,

Gary Bissol, fondateur de BYSS GROUP SAS — agence de production vidéo par intelligence artificielle et conseil en transformation digitale.

Les entreprises martiniquaises ont des besoins croissants en contenu vidéo : rapports RSE, communication marque employeur, captation événementielle, formation interne. La production classique est longue et coûteuse.

BYSS GROUP produit des vidéos professionnelles en 48 heures grâce à l''IA, pour un coût 5 à 10 fois inférieur à la production traditionnelle, avec une qualité broadcast.

Nous proposons également du conseil en transformation IA : audit des processus, identification des gains de productivité, accompagnement à la mise en œuvre.

Je serais ravi de vous présenter nos solutions et de réaliser une vidéo démo adaptée à votre secteur.

Cordialement,
Gary Bissol
BYSS GROUP SAS — NAF 62.01Z
+596 [TEL] | gary@byssgroup.fr', '["TEL"]'::jsonb, 'prospection', false)
ON CONFLICT DO NOTHING;

INSERT INTO prompts (name, category, template, variables, model, is_master)
VALUES ('telephone -- 📞 APPEL — RESTAURANTS / EXCURSIONS / BARS', 'text', '[Note]
Ton décontracté, direct, pas corporate. 90 secondes max avant de demander le RDV.

[Introduction]
Bonjour, c''est Gary Bissol de BYSS GROUP. Je cherche le propriétaire / le gérant. C''est vous ? [OUI] Parfait.

[Hook]
J''ai vu que [NOM] a [X] avis Google avec [NOTE]★ — c''est énorme, bravo. Par contre j''ai remarqué que vous n''avez aucune vidéo pro sur Google ni sur Instagram. C''est dommage parce que vos concurrents commencent à en avoir.

[Proposition]
Je fais des vidéos IA pour les entreprises martiniquaises. Je peux vous créer une vidéo de votre [resto/excursion/bar] en 48 heures, le résultat est cinématique, et ça coûte beaucoup moins cher qu''un vidéaste classique.

[Close]
Je vous propose un truc simple : je passe vous voir [demain/cette semaine], je vous montre un exemple sur ma tablette, ça prend 5 minutes. Si ça vous plaît, on en parle. Si ça vous plaît pas, on se serre la main et c''est tout. Ça vous va ?

[Si objection prix]
Je comprends. Justement, l''IA c''est 5 à 10 fois moins cher qu''un vidéaste classique. On parle de 1 500€ pour une vidéo pro de votre [établissement]. C''est le prix d''un bon service du soir.

[Si objection temps]
Pas de souci, je passe quand ça vous arrange. Même 5 minutes entre deux services. Je m''adapte à votre planning.

[Si ''envoyez-moi un email'']
Bien sûr. C''est quoi votre email ? [RÉCUPÉRER L''EMAIL — c''est le vrai objectif si le RDV ne se fait pas tout de suite]. Je vous envoie un exemple de vidéo dans l''heure.', '["OUI", "NOM", "X", "NOTE"]'::jsonb, 'prospection', false)
ON CONFLICT DO NOTHING;

INSERT INTO prompts (name, category, template, variables, model, is_master)
VALUES ('telephone -- 📞 APPEL — HÔTELS / DISTILLERIES', 'text', '[Note]
Ton professionnel mais pas corporate. Demander le directeur ou le responsable marketing.

[Introduction]
Bonjour, Gary Bissol de BYSS GROUP. Je souhaiterais parler au directeur [ou au responsable communication/marketing]. C''est à quel sujet ? Nous sommes une agence de production vidéo IA et digital basée en Martinique, et nous avons une proposition spécifique pour [NOM_HOTEL/DISTILLERIE].

[Si transféré au décideur]
Bonjour [NOM], merci de prendre mon appel. Je serai bref. BYSS GROUP produit des vidéos professionnelles par intelligence artificielle — visite virtuelle, contenu patrimoine, spots réseaux sociaux — en 48 heures et pour une fraction du coût classique.

[Hook hôtel]
Les hôtels qui ajoutent une vidéo visite virtuelle sur Booking.com voient leurs conversions augmenter de 15 à 25%. [NOM_HOTEL] n''a pas de vidéo sur son profil Booking. C''est une opportunité manquée chaque jour.

[Hook distillerie]
Le marché du rhum premium croît de 8% par an à l''export. [NOM_DISTILLERIE] a un patrimoine exceptionnel mais pas de présence e-commerce. BYSS GROUP propose vidéo + e-commerce + Google Ads export.

[Close]
Je propose de passer vous voir cette semaine pour une démo de 10 minutes. Je peux aussi créer gratuitement une vidéo de votre [plus belle chambre / château / jardins] pour vous montrer le résultat. Quel jour vous arrangerait ?', '["NOM", "NOM_HOTEL", "NOM_DISTILLERIE"]'::jsonb, 'prospection', false)
ON CONFLICT DO NOTHING;

INSERT INTO prompts (name, category, template, variables, model, is_master)
VALUES ('telephone -- 📞 APPEL — INSTITUTIONS (MEDEF / CE / CCI)', 'text', '[Introduction]
Bonjour, Gary Bissol, fondateur de BYSS GROUP. Je souhaiterais parler à [NOM_CONTACT — Fabienne Joseph / Pascal Fardin / service entreprises]. C''est au sujet d''une proposition de présentation pour vos adhérents.

[Si transféré]
Bonjour [NOM], merci. Je suis Gary Bissol, je dirige BYSS GROUP, une agence de transformation digitale IA en Martinique. J''accompagne les entreprises martiniquaises dans la vidéo IA, le développement web, les agents IA.

[Proposition]
Je souhaiterais proposer à vos adhérents une présentation concrète de 5 à 8 minutes sur ce que l''IA peut apporter à leur entreprise. En échange, je réalise gratuitement la captation vidéo de votre événement.

[Close]
Auriez-vous un créneau lors de votre prochain événement ? Même 5 minutes en fin de session. Quel est le calendrier de vos prochains rendez-vous ?', '["NOM"]'::jsonb, 'prospection', false)
ON CONFLICT DO NOTHING;

INSERT INTO prompts (name, category, template, variables, model, is_master)
VALUES ('whatsapp -- 💬 WHATSAPP — RESTAURANTS / BARS', 'text', '[Texte]
Bonjour ! Gary Bissol de BYSS GROUP. J''ai vu que [NOM] a [X] avis Google [NOTE]★ — c''est top ! 🔥

Je fais des vidéos IA pour les restos martiniquais. 48h de production, résultat pro, prix accessible.

Je peux vous montrer un exemple ? Ça prend 2 min.

[LIEN_PORTFOLIO]

[Si réponse positive]
Super ! Je peux passer [demain/cette semaine] entre 14h et 16h ? Je vous montre sur tablette, c''est rapide. Quel jour vous arrange ?

[Si pas de réponse J+3]
Relance : Bonjour ! Je me permets de revenir vers vous. Est-ce que vous avez eu le temps de regarder l''exemple ? Je suis dispo cette semaine si vous voulez qu''on en discute rapidement. Bonne journée ! 🙏', '["NOM", "X", "NOTE", "LIEN_PORTFOLIO"]'::jsonb, 'prospection', false)
ON CONFLICT DO NOTHING;

INSERT INTO prompts (name, category, template, variables, model, is_master)
VALUES ('whatsapp -- 💬 WHATSAPP — EXCURSIONS / NAUTIQUE', 'text', '[Texte]
Salut ! Gary de BYSS GROUP. Vos [X] avis [NOTE]★ c''est énorme 💪

Je fais des vidéos IA pour les excursions MQ — dauphins, snorkeling, sunset, le tout en film 45 secondes cinématique.

Je propose d''embarquer sur votre prochaine sortie pour filmer, et je vous livre la vidéo en 48h. Gratuit pour la première.

Ça vous dit ?', '["X", "NOTE"]'::jsonb, 'prospection', false)
ON CONFLICT DO NOTHING;

INSERT INTO prompts (name, category, template, variables, model, is_master)
VALUES ('whatsapp -- 💬 WHATSAPP — RÉCUPÉRER L''EMAIL', 'text', '[Note]
L''objectif #1 de WhatsApp quand le prospect n''est pas chaud: récupérer l''email pour envoyer le dossier complet.

[Texte]
Pas de souci ! Je peux vous envoyer un exemple par email avec tous les détails ? C''est quoi votre email pro ? 📧

[Conseil]
TOUJOURS demander l''email. Même si le prospect dit non. L''email = relance structurée. WhatsApp = premier contact. Email = closing.', '[]'::jsonb, 'prospection', false)
ON CONFLICT DO NOTHING;

INSERT INTO prompts (name, category, template, variables, model, is_master)
VALUES ('whatsapp -- 💬 WHATSAPP — RELANCE POST-RDV', 'text', '[J+1 après RDV]
Bonjour [NOM] ! Merci pour l''échange d''hier. Comme convenu, voici [la vidéo démo / la proposition / le portfolio]. N''hésitez pas si vous avez des questions. Bonne journée ! 🙏

[J+7 si pas de réponse]
Bonjour [NOM] ! Je me permets de revenir vers vous suite à notre échange. Avez-vous eu le temps de regarder [la vidéo / la proposition] ? Je suis disponible si vous souhaitez en discuter. 🙂

[J+14 dernière relance]
Bonjour [NOM] ! Je ne veux pas être insistant mais je voulais m''assurer que vous aviez bien reçu ma proposition. Si ce n''est pas le bon moment, pas de souci du tout. Je reste disponible quand vous le souhaitez. Belle journée ! ☀️', '["NOM"]'::jsonb, 'prospection', false)
ON CONFLICT DO NOTHING;

INSERT INTO prompts (name, category, template, variables, model, is_master)
VALUES ('instagram_dm -- 📱 DM — RESTAURANTS / BARS', 'text', '[Texte]
Salut ! Votre feed est vraiment beau 🔥 Vos plats donnent envie.

Je fais des vidéos IA pour les restos martiniquais — le genre de Reels qui cartonnent en organique. 48h de production, résultat cinématique.

Je peux vous en créer une gratuitement pour vous montrer ? Si ça vous plaît, on en parle. Si non, vous gardez la vidéo 😉

[Conseil]
TOUJOURS commencer par un compliment sincère et spécifique (pas générique). ''Votre dernier Reel du colombo était incroyable'' > ''J''adore votre restaurant''.', '[]'::jsonb, 'prospection', false)
ON CONFLICT DO NOTHING;

INSERT INTO prompts (name, category, template, variables, model, is_master)
VALUES ('instagram_dm -- 📱 DM — WEDDING PLANNERS', 'text', '[Texte]
Bonjour ! Vos mariages sont magnifiques 😍

Je fais des aftermovies mariage en vidéo IA — 48h de production, résultat cinématique, à partir de 1 500€. C''est 3 à 5× moins cher qu''un vidéaste classique.

Je propose un partenariat : vous recommandez BYSS GROUP à vos couples, je vous reverse 10-15% sur chaque vidéo. Vos couples ont un super prestataire, vous gagnez sans rien faire.

Ça vous intéresse ? Je peux créer un aftermovie démo sur un de vos derniers mariages (avec votre accord bien sûr).', '[]'::jsonb, 'prospection', false)
ON CONFLICT DO NOTHING;

INSERT INTO prompts (name, category, template, variables, model, is_master)
VALUES ('instagram_dm -- 📱 DM — BOULIKIBIO / SPAS', 'text', '[Texte]
Votre lieu est incroyable 🌿 Le massage en rivière c''est un concept unique en Martinique.

Je fais des vidéos IA type ASMR/ambiance — eau qui coule, fleurs, vapeur, assiette bio — le genre de Reel qui fait 100K vues.

Avec vos 16K followers et une vidéo pro, vous passez à 50K. Je vous en fais une gratuitement pour vous montrer ?

[LIEN_PORTFOLIO]', '["LIEN_PORTFOLIO"]'::jsonb, 'prospection', false)
ON CONFLICT DO NOTHING;

INSERT INTO prompts (name, category, template, variables, model, is_master)
VALUES ('instagram_dm -- 📱 DM — SALONS DE COIFFURE / BARBIER', 'text', '[Texte]
Salut ! Le travail est propre 🔥 Vos transformations sont impressionnantes.

Je fais des vidéos IA ''avant/après'' pour les salons MQ — le genre de Reel qui fait exploser les réservations.

48h de production, résultat pro. Je vous en fais une gratuitement sur votre prochaine transformation pour vous montrer ?', '[]'::jsonb, 'prospection', false)
ON CONFLICT DO NOTHING;

-- Total templates inserted: 18

COMMIT;

-- ═══════════════════════════════════════════════════════════════
-- SUMMARY:
--   intel_entities: 168 contacts
--   lore_entries (bible): 74 entries
--   lore_entries (pricing): 62 entries
--   prompts (templates): 18 templates
--   TOTAL: 322 rows
-- ═══════════════════════════════════════════════════════════════