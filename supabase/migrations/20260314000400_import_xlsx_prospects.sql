-- BYSS GROUP — Import CRM Pipeline from xlsx
-- Generated from 05_crm_pipeline_byss_group.xlsx

INSERT INTO prospects (name, sector, phase, probability, estimated_basket, key_contact, next_action, notes)
VALUES ('DIGICEL / DAFG', 'Télécoms', 'prospect', 70, 0, 'Victor Despointes
corida@corida-pub.fr', 'Relancer Victor pour RDV formel', 'Deal en cours. ''Dingue!!'' BG-2026-001 envoyé.')
ON CONFLICT DO NOTHING;
INSERT INTO prospects (name, sector, phase, probability, estimated_basket, key_contact, next_action, notes)
VALUES ('GROUPE GBH', 'Conglomérat', 'prospect', 50, 0, 'naomie.phanor@gbh.fr
0696 81 76 05', 'Email Naomie Phanor + Service Com GBH', 'Préparer vidéo démo Clément avant d''envoyer.')
ON CONFLICT DO NOTHING;
INSERT INTO prospects (name, sector, phase, probability, estimated_basket, key_contact, next_action, notes)
VALUES ('CMT TOURISME', 'Institution', 'prospect', 55, 0, 'claude.piault@martiniquetourisme.com', 'Email Claude Bulot Piault + 4 autres', '11 emails nominatifs. Mentionner An Tan Lontan.')
ON CONFLICT DO NOTHING;
INSERT INTO prospects (name, sector, phase, probability, estimated_basket, key_contact, next_action, notes)
VALUES ('MEDEF MQ', 'Réseau', 'prospect', 60, 0, 'fabienne.joseph@medef-martinique.fr
0696 82 70 10', 'Email Fabienne Joseph + appel', 'Proposer créneau événement. Troc vidéo vs créneau.')
ON CONFLICT DO NOTHING;
INSERT INTO prospects (name, sector, phase, probability, estimated_basket, key_contact, next_action, notes)
VALUES ('CONTACT-ENTREPRISES', 'Réseau', 'prospect', 60, 0, 'pfardin@contact-entreprises.com
0696 23 28 23', 'Email Pascal Fardin + appel', 'Même approche que MEDEF.')
ON CONFLICT DO NOTHING;
INSERT INTO prospects (name, sector, phase, probability, estimated_basket, key_contact, next_action, notes)
VALUES ('CCI MQ', 'Institution', 'prospect', 45, 0, 'contact@martinique.cci.fr
0596 55 28 00', 'Email service entreprises', 'Intégrer programme digitalisation.')
ON CONFLICT DO NOTHING;
INSERT INTO prospects (name, sector, phase, probability, estimated_basket, key_contact, next_action, notes)
VALUES ('ORANGE AG', 'Télécoms', 'prospect', 30, 0, 'Samir Benzahra (LinkedIn)', 'Identifier resp. marketing LinkedIn', 'Chercher via MEDEF/CCI d''abord.')
ON CONFLICT DO NOTHING;
INSERT INTO prospects (name, sector, phase, probability, estimated_basket, key_contact, next_action, notes)
VALUES ('SFR CARAÏBE', 'Télécoms', 'prospect', 40, 0, 'Edgard Nemorin (LinkedIn)', 'LinkedIn Edgard Nemorin', 'Si Digicel signe → urgence.')
ON CONFLICT DO NOTHING;
INSERT INTO prospects (name, sector, phase, probability, estimated_basket, key_contact, next_action, notes)
VALUES ('FREE CARAÏBE', 'Télécoms', 'prospect', 35, 0, 'Non identifié', 'LinkedIn resp. mktg Free Caraïbe', 'Phase 2. Après Digicel.')
ON CONFLICT DO NOTHING;
INSERT INTO prospects (name, sector, phase, probability, estimated_basket, key_contact, next_action, notes)
VALUES ('DIST. J.M.', 'Rhum', 'prospect', 40, 0, '+596 596 78 92 55', 'Appeler Macouba + visiter', 'Groupe BBS = HSE+Dillon.')
ON CONFLICT DO NOTHING;
INSERT INTO prospects (name, sector, phase, probability, estimated_basket, key_contact, next_action, notes)
VALUES ('DIST. DEPAZ', 'Rhum', 'prospect', 35, 0, '05 96 78 13 14', 'Appeler admin + visiter château', 'Groupe La Martiniquaise.')
ON CONFLICT DO NOTHING;
INSERT INTO prospects (name, sector, phase, probability, estimated_basket, key_contact, next_action, notes)
VALUES ('CAMPARI ×2', 'Rhum', 'prospect', 30, 0, '+596 596 62 18 79
+596 596 62 51 78', 'Visiter La Mauny + 3 Rivières', '1 journée sud.')
ON CONFLICT DO NOTHING;
INSERT INTO prospects (name, sector, phase, probability, estimated_basket, key_contact, next_action, notes)
VALUES ('SAINT-JAMES', 'Rhum', 'prospect', 35, 0, '+596 596 69 30 02', 'Visiter Musée du Rhum', 'Groupe La Martiniquaise = Depaz + Dillon.')
ON CONFLICT DO NOTHING;
INSERT INTO prospects (name, sector, phase, probability, estimated_basket, key_contact, next_action, notes)
VALUES ('HSE → BBS', 'Rhum', 'prospect', 35, 0, '+596 596 57 49 32', 'Appeler + visiter Gros-Morne', 'Cheval de Troie → JM + Dillon.')
ON CONFLICT DO NOTHING;
INSERT INTO prospects (name, sector, phase, probability, estimated_basket, key_contact, next_action, notes)
VALUES ('NEISSON', 'Rhum', 'prospect', 35, 0, '+596 596 78 03 70', 'Appeler Le Carbet', '3.2★ = argument de vente.')
ON CONFLICT DO NOTHING;
INSERT INTO prospects (name, sector, phase, probability, estimated_basket, key_contact, next_action, notes)
VALUES ('LA FAVORITE', 'Rhum', 'prospect', 35, 0, '+596 596 50 47 32', 'Visiter (10 min aéroport)', 'Familial. Présence physique.')
ON CONFLICT DO NOTHING;
INSERT INTO prospects (name, sector, phase, probability, estimated_basket, key_contact, next_action, notes)
VALUES ('KARIBEA ×3', 'Hôtellerie', 'prospect', 45, 0, 'contact@karibeahotel.com', 'Email contact@karibeahotel.com', '5 emails. Patrice Fabre = MEDEF.')
ON CONFLICT DO NOTHING;
INSERT INTO prospects (name, sector, phase, probability, estimated_basket, key_contact, next_action, notes)
VALUES ('BAKOUA ★★★★', 'Hôtellerie', 'prospect', 45, 0, 'resa@hotel-bakoua.fr', 'Email resa@hotel-bakoua.fr', 'Yves Jacquet DG.')
ON CONFLICT DO NOTHING;
INSERT INTO prospects (name, sector, phase, probability, estimated_basket, key_contact, next_action, notes)
VALUES ('KATA MAMBO', 'Excursion', 'prospect', 50, 0, '+596 696 25 23 16', 'Appeler + marina Trois-Îlets', 'Zéro émission. Quick win.')
ON CONFLICT DO NOTHING;
INSERT INTO prospects (name, sector, phase, probability, estimated_basket, key_contact, next_action, notes)
VALUES ('SUN LOISIRS', 'Excursion', 'prospect', 50, 0, '+596 696 05 51 52', 'Appeler Jeff', 'Jeff = personnage.')
ON CONFLICT DO NOTHING;
INSERT INTO prospects (name, sector, phase, probability, estimated_basket, key_contact, next_action, notes)
VALUES ('LE MANTOU', 'Excursion', 'prospect', 50, 0, '+596 596 68 39 19', 'Appeler', 'Mangrove.')
ON CONFLICT DO NOTHING;
INSERT INTO prospects (name, sector, phase, probability, estimated_basket, key_contact, next_action, notes)
VALUES ('ALPHA DIVING', 'Plongée', 'prospect', 50, 0, 'contact@alphaplongee.com', 'Email direct', '1289 avis 4.9★. Email confirmé.')
ON CONFLICT DO NOTHING;
INSERT INTO prospects (name, sector, phase, probability, estimated_basket, key_contact, next_action, notes)
VALUES ('DEEP TURTLE', 'Plongée', 'prospect', 50, 0, 'info@deep-turtle.com', 'Email direct', 'Email confirmé. Tortues.')
ON CONFLICT DO NOTHING;
INSERT INTO prospects (name, sector, phase, probability, estimated_basket, key_contact, next_action, notes)
VALUES ('CALYPSO', 'Catamaran', 'prospect', 50, 0, 'martinique-calypso@gmail.com', 'Email direct', 'Email confirmé.')
ON CONFLICT DO NOTHING;
INSERT INTO prospects (name, sector, phase, probability, estimated_basket, key_contact, next_action, notes)
VALUES ('KOKOUMDO', 'Catamaran', 'prospect', 50, 0, 'resa.kokoumdo@gmail.com', 'Email direct', 'Email confirmé. Premium.')
ON CONFLICT DO NOTHING;
INSERT INTO prospects (name, sector, phase, probability, estimated_basket, key_contact, next_action, notes)
VALUES ('EUROPCAR+JUMBO', 'Location', 'prospect', 45, 0, 'europcar.mq@gbh.fr', 'Via contrat GBH', '7 emails GBH.')
ON CONFLICT DO NOTHING;
INSERT INTO prospects (name, sector, phase, probability, estimated_basket, key_contact, next_action, notes)
VALUES ('SIXT + MCR', 'Location', 'prospect', 40, 0, '+596 596 42 16 78', 'Appeler MCR d''abord', 'MCR 4.8★ underdog.')
ON CONFLICT DO NOTHING;
INSERT INTO prospects (name, sector, phase, probability, estimated_basket, key_contact, next_action, notes)
VALUES ('LORRAINE', 'Brasserie', 'prospect', 35, 0, '0596 50 21 21', 'LinkedIn resp. marketing', 'Identifier décideur via MEDEF.')
ON CONFLICT DO NOTHING;
INSERT INTO prospects (name, sector, phase, probability, estimated_basket, key_contact, next_action, notes)
VALUES ('SARA', 'Énergie', 'prospect', 30, 0, 'Information.COMRSE@sara-ag.fr', 'Email service com', 'Email confirmé. RSE.')
ON CONFLICT DO NOTHING;
INSERT INTO prospects (name, sector, phase, probability, estimated_basket, key_contact, next_action, notes)
VALUES ('BOULIKIBIO', 'Spa', 'prospect', 45, 0, '@boulikibio', 'DM Instagram', '16K followers. Ni email ni site.')
ON CONFLICT DO NOTHING;
INSERT INTO prospects (name, sector, phase, probability, estimated_basket, key_contact, next_action, notes)
VALUES ('MIZA', 'Restaurant', 'prospect', 45, 0, '+596 596 70 00 20', 'Réserver table + se présenter', 'Client PORTFOLIO.')
ON CONFLICT DO NOTHING;
INSERT INTO prospects (name, sector, phase, probability, estimated_basket, key_contact, next_action, notes)
VALUES ('TANTE ARLETTE', 'Restaurant', 'prospect', 40, 0, 'Visite physique', 'Se déplacer Grand''Rivière', 'Pas de contact digital. Patrimoine.')
ON CONFLICT DO NOTHING;
INSERT INTO prospects (name, sector, phase, probability, estimated_basket, key_contact, next_action, notes)
VALUES ('CLUB MED', 'Hôtellerie', 'prospect', 20, 0, 'LinkedIn', 'LinkedIn Chef de Village', 'PRIORITÉ BASSE.')
ON CONFLICT DO NOTHING;
INSERT INTO prospects (name, sector, phase, probability, estimated_basket, key_contact, next_action, notes)
VALUES ('PACK WEDDING', 'Mariage', 'prospect', 45, 0, '@bemycreation972', 'DM Instagram ×3 planners', 'Partenariat commission.')
ON CONFLICT DO NOTHING;
INSERT INTO prospects (name, sector, phase, probability, estimated_basket, key_contact, next_action, notes)
VALUES ('PACK RESTOS TOP10', 'Restaurants', 'prospect', 45, 0, 'Téléphones fichier', 'Zone Ste-Luce: 4 restos en 1 jour', '7 restos en 2 jours.')
ON CONFLICT DO NOTHING;