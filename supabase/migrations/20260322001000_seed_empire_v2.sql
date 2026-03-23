-- ═══════════════════════════════════════════════════════
-- BYSS EMPIRE v2 — Seed Data
-- Contacts directory + Bible de vente + Style presets
-- ═══════════════════════════════════════════════════════

-- ══════════════════════════════
-- CONTACTS DIRECTORY (top 20 key contacts)
-- ══════════════════════════════

INSERT INTO contacts_directory (name, organization, title, department, email, phone, sector, region, influence_score, tags, source) VALUES
('Pierre Canton-Bacara', 'Digicel', 'Directeur General', 'Direction', NULL, NULL, 'Telecom', 'Martinique', 9, '{"telecom","dg","decision-maker"}', 'SOSO.txt'),
('Astrid Dollin', 'Digicel', 'Responsable Marketing Business', 'Marketing', NULL, NULL, 'Telecom', 'Martinique', 8, '{"telecom","marketing","business"}', 'SOSO.txt'),
('Claire Saussay', 'Digicel', 'Cheffe des Ventes Martinique Business', 'Commercial', NULL, NULL, 'Telecom', 'Martinique', 7, '{"telecom","commercial","ventes"}', 'SOSO.txt'),
('Samir Benzahra', 'Orange Antilles-Guyane', 'Directeur', 'Direction', NULL, NULL, 'Telecom', 'Martinique', 9, '{"telecom","dg","orange"}', 'SOSO.txt'),
('Frederic Jarjat', 'Orange Antilles-Guyane', 'Directeur Transformation', 'Transformation', NULL, NULL, 'Telecom', 'Martinique', 7, '{"telecom","transformation","digital"}', 'SOSO.txt'),
('Frederic Hayot', 'SFR Caraibe', 'PDG', 'Direction', NULL, NULL, 'Telecom', 'Martinique', 9, '{"telecom","pdg","altice","beke"}', 'SOSO.txt'),
('Fabienne Joseph', 'Alpha Diving', 'Gerante', 'Direction', NULL, NULL, 'Tourisme', 'Martinique', 6, '{"excursion","plongee","tourisme"}', 'Pipeline'),
('Chef Tatiana', 'MIZA Restaurant', 'Chef proprietaire', 'Direction', NULL, NULL, 'Restauration', 'Fort-de-France', 6, '{"restaurant","gastronomie","chef"}', 'Pipeline'),
('Direction', 'Habitation Clement', 'Direction Marketing', 'Marketing', NULL, NULL, 'Distillerie', 'Francois', 8, '{"rhum","patrimoine","tourisme","luxe"}', 'Pipeline'),
('Direction', 'HSE (Habitation Saint-Etienne)', 'Direction Commerciale', 'Commercial', NULL, NULL, 'Distillerie', 'Gros-Morne', 7, '{"rhum","export","premium"}', 'Pipeline'),
('Direction', 'Hotel Bakoua', 'Directeur General', 'Direction', NULL, NULL, 'Hotellerie', 'Pointe du Bout', 8, '{"hotel","luxe","tourisme","seminaire"}', 'Pipeline'),
('Direction', 'Hotel La Suite Villa', 'Directeur', 'Direction', NULL, NULL, 'Hotellerie', 'Trois-Ilets', 7, '{"hotel","boutique","premium"}', 'Pipeline'),
('Direction', 'Cap Est Lagoon Resort', 'Direction', 'Direction', NULL, NULL, 'Hotellerie', 'Francois', 8, '{"hotel","resort","luxe","spa"}', 'Pipeline'),
('Wizzee', 'Wizzee', 'Direction Marketing', 'Marketing', NULL, NULL, 'Commerce', 'Martinique', 6, '{"ecommerce","ads","client-actif"}', 'Pipeline'),
('GoodCircle', 'GoodCircle', 'Direction', 'Direction', NULL, NULL, 'Commerce', 'Martinique', 5, '{"ads","maintenance","client-actif"}', 'Pipeline'),
('Evil P', 'Artiste', 'Artiste', NULL, NULL, NULL, 'Media', 'Martinique', 5, '{"musique","clip","voice"}', 'Pipeline'),
('Krys', 'Artiste', 'Artiste Dancehall', NULL, NULL, NULL, 'Media', 'Martinique', 6, '{"musique","dancehall","clip"}', 'Pipeline'),
('Marginal', 'Artiste', 'Artiste Shatta/Rap', NULL, NULL, NULL, 'Media', 'Martinique', 5, '{"musique","shatta","rap","clip"}', 'Pipeline'),
('CCI Martinique', 'CCI', 'Direction', NULL, NULL, NULL, 'Institutionnel', 'Fort-de-France', 8, '{"cci","5000-entreprises","reseau"}', 'SOSO.txt'),
('MEDEF Martinique', 'MEDEF', 'Bureau', NULL, NULL, NULL, 'Institutionnel', 'Fort-de-France', 7, '{"medef","640-entreprises","patronat"}', 'SOSO.txt')
ON CONFLICT DO NOTHING;

-- ══════════════════════════════
-- BIBLE DE VENTE (11 chapitres — summary seeds)
-- ══════════════════════════════

INSERT INTO bible_chapters (number, title, content, category, word_count) VALUES
(1, 'Psychologie de la Decision', 'Kahneman: Systeme 1 (rapide, emotionnel) vs Systeme 2 (lent, rationnel). Le prospect decide avec Systeme 1, justifie avec Systeme 2. Ariely: l ancrage est tout — la premiere reference de prix posee determine tout le reste. Cialdini: 6 leviers (reciprocite, engagement, preuve sociale, autorite, sympathie, rarete). En Martinique: le bouche-a-oreille EST la preuve sociale. Un nom connu vaut plus que 10 case studies.', 'psychologie', 80),
(2, 'Methode SPIN Selling', 'Situation: contexte actuel du prospect. Probleme: douleurs identifiees. Implication: cout de l inaction. Need-Payoff: valeur de la solution. Ne jamais pitcher avant d avoir traverse les 4 etapes. En Martinique: la phase Situation est CRITIQUE — le prospect teste si tu connais son ile, son marche, sa realite. Si tu parles comme un parisien, c est fini.', 'spin', 65),
(3, 'Les 15 Objections et Reponses', 'Objection 1: "C est trop cher" → "Par rapport a quoi?" (ancrage). Objection 2: "Je dois reflechir" → "Bien sur. Qu est-ce qui vous ferait hesiter?" (implication). Objection 3: "On a deja un prestataire" → "Parfait. Qu est-ce qui manque?" (need-payoff). Objection MQ specifique: "Mon neveu fait ca" → "Super. Montrez-moi ce qu il a fait. On completera." (respect + valeur ajoutee).', 'objections', 75),
(4, 'Neuro-Selling MQ', '7 regles neuro-selling adaptees Martinique. 1: Le premier cafe decide tout (pas le deck). 2: Nommer le quartier du prospect (preuve de connaissance locale). 3: Citer un concurrent qui a pris le virage IA (peur de rater). 4: Montrer le ROI sur tablette, pas en PDF (immediat > differe). 5: Silence apres le prix (laisser le Systeme 2 travailler). 6: "Tu" pas "vous" apres le premier cafe. 7: La phrase memorable — chaque RDV doit laisser UNE phrase qu on repete.', 'neuro', 95),
(5, 'Sun Tzu Applique', 'L art de la guerre commerciale. 1: Connaitre le terrain (ile = 35 communes, tout se sait). 2: Ne jamais attaquer de front (pas de comparaison directe avec Paris). 3: La victoire sans combat (le prospect vient a toi via ROI Calculator). 4: L eau epouse le terrain (adapter le pitch au secteur). 5: Concentration des forces (marina d abord, puis etendre en geo-concentrique).', 'suntzu', 70),
(6, 'Biomimetisme Commercial', 'La nature comme modele de vente. Le courbaril: racines profondes avant de monter (reseau avant CA). Le manguier: un fruit attire, le bouche-a-oreille fait le reste (ROI Calculator comme fruit). Le recif corallien: symbiose — le poisson-clown protege l anemone et inversement (client = ambassadeur). L oseille-pays: humble, partout, essentielle — comme Sorel.', 'biomimetique', 60),
(7, 'Timing & Saisonnalite MQ', 'Haute saison (Nov-Avril): tourisme, hotels ont du budget, decisions rapides. Basse saison (Mai-Oct): introspection, budgets serres, moment pour planter les graines. Carnaval (Fev): TOUT s arrete. Ne pas prospecter. Rentrée (Sept): budgets annuels votes, moment ideal pour propositions N+1. Cyclone (Juin-Nov): digital = resilience — argument de vente pour cloud/IA.', 'timing', 60),
(8, 'Phrases Memorables', '"99.96% de marge. C est pas un produit, c est de l intelligence." — pour video IA. "Votre concurrent a commence il y a 6 mois." — FOMO contextualise. "Le site WordPress a 40% de qualite. Je ne dis pas ca pour vendre." — honnetete comme arme. "Combien vous coutent les 15% de commission OTA par an?" — pour hotels. "Un agent IA travaille 24/7. Il ne prend pas de conges en aout." — pour telecoms.', 'memorable', 75),
(9, 'Secteur Hotellerie MQ', 'Pain point #1: commissions OTA (Booking 15-25%). Pain point #2: pas de booking direct. Pain point #3: photos datees. Solution BYSS: video IA (visite virtuelle) + site direct (SEO + Google Ads) + chatbot multilingue (4 langues) + Google My Business optimise. ROI: si 10% des reservations passent en direct, le ROI est positif en 3 mois. Argument massue: "Vous donnez 150K€/an a Booking. On vous fait economiser ca pour 25K€."', 'sectoriel', 85),
(10, 'Secteur Restauration MQ', 'Pain point #1: visibilite Google (la plupart n ont meme pas de fiche GMB complete). Pain point #2: pas de reservation en ligne (WhatsApp = chaos). Pain point #3: photos amateur. Solution BYSS: pack images IA (10 photos cinematiques) + site optimise + WhatsApp Business + Google Ads local + gestion Instagram. Prix: 6-15K€. ROI: un service de plus par soir = rentabilise en 1 mois.', 'sectoriel', 75),
(11, 'Land & Expand', 'Strategie d expansion interne. Land: entrer avec un petit projet (1 video, 1 audit). Expand: une fois la confiance etablie, proposer le pack complet. Regle du 3-5-10: 3K€ premier contact, 5K€ deuxieme projet, 10K€+ une fois fidele. Le client ne sait pas ce qu il veut — il sait ce qui lui fait mal. Commencer par la douleur, pas par le catalogue.', 'land_expand', 65)
ON CONFLICT DO NOTHING;

-- ══════════════════════════════
-- STYLE PRESETS (Image Pipeline)
-- ══════════════════════════════

INSERT INTO style_presets (name, camera_base, realism_guard, direction_config, palette, vertical) VALUES
('Restaurant Tropical', 'Shot on Sony A7IV, 50mm f/1.4, natural lighting, shallow depth of field', 'Photorealistic, no AI artifacts, no text overlays, natural skin tones, magazine editorial quality', '{"hero": "Wide angle establishing shot, warm ambient tropical lighting, lush vegetation background", "product": "Clean plating shot, overhead angle, garnish detail, steam visible", "detail": "Macro texture, spice close-up, knife on cutting board, wood grain", "lifestyle": "Candid dining moment, laughter, Caribbean sunset through window", "event": "Table setting for group, candle light, cocktail preparation"}', '{"primary": "#D4AF37", "secondary": "#2D5016", "accent": "#FF6B35"}', 'restaurant'),
('Distillerie Premium', 'Shot on Hasselblad X2D, 90mm, studio-quality, rich color science', 'Photorealistic, luxury editorial, warm amber tones, no digital artifacts', '{"hero": "Distillery exterior golden hour, copper stills visible, heritage architecture", "product": "Bottle hero shot, amber liquid, refracted light, dark background", "detail": "Oak barrel texture, condensation on glass, sugarcane close-up", "lifestyle": "Tasting moment, expert nose, sunset terrace", "event": "Rum tasting group, branded glassware, expert-led session"}', '{"primary": "#8B4513", "secondary": "#D4AF37", "accent": "#1A0A00"}', 'rhum'),
('Hotel Luxe Caraibe', 'Shot on Canon R5, 24-70mm f/2.8, natural tropical light, wide dynamic range', 'Photorealistic, travel magazine quality, turquoise water accurate, no oversaturation', '{"hero": "Infinity pool overlooking Caribbean sea, palm trees, blue sky", "product": "Suite interior, king bed, ocean view, fresh flowers", "detail": "Spa amenity close-up, tropical flower arrangement, pool towel art", "lifestyle": "Couple on beach, champagne at sunset, hammock reading", "event": "Wedding setup, poolside dinner, conference room with view"}', '{"primary": "#00B4D8", "secondary": "#FFFFFF", "accent": "#D4AF37"}', 'hotel')
ON CONFLICT DO NOTHING;
