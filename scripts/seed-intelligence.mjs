/**
 * seed-intelligence.mjs — Seed intel_entities from Operation Eveil cartography
 *
 * Usage: node scripts/seed-intelligence.mjs
 * Requires: NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY (or ANON_KEY)
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

// Load env from .env.local
const envContent = readFileSync('.env.local', 'utf8');
const env = {};
for (const line of envContent.split('\n')) {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) env[match[1].trim()] = match[2].trim();
}

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// ═══════════════════════════════════════════════════════
// DOMAIN: POLITIQUE — from cartographie_politique/partis.md
// ═══════════════════════════════════════════════════════

const politique = [
  {
    name: 'Serge Letchimy',
    type: 'personnalite',
    description: 'Président du Conseil Exécutif de la CTM. 73 ans, PPM, ancien maire de Fort-de-France, ancien député, ancien président Région 2010-2015. Leader de la coalition Alians Matinik (26 sièges sur 51).',
    influence_score: 9,
    relationships: ['PPM', 'Alians Matinik', 'CTM', 'Lucien Saliber'],
    tags: ['majorite', 'ctm', 'ppm', 'fort-de-france'],
    notes: 'Vieillissant (73 ans). Bilan mitigé : 40 homicides en 2025, vie chere non resolue, cyberattaque CTM. Vœux 2026 admettent tensions.',
  },
  {
    name: 'Alfred Marie-Jeanne',
    type: 'personnalite',
    description: 'Leader du MIM et du groupe Gran Sanble Pou Matinik (14 sieges). 85 ans, independantiste souverainiste. Bastion dans le Sud, Riviere-Pilote.',
    influence_score: 8,
    relationships: ['MIM', 'Gran Sanblé Pou Matinik'],
    tags: ['opposition', 'ctm', 'independantiste', 'sud'],
    notes: '85 ans, succession pas claire. Charisme historique mais vieillissant.',
  },
  {
    name: 'Catherine Conconne',
    type: 'personnalite',
    description: 'Leader du groupe La Martinique Ensemble (6 sieges). Senatrice, ancienne PPM dissidente. Franc-parler, visibilite nationale.',
    influence_score: 7,
    relationships: ['La Martinique Ensemble', 'Sénat'],
    tags: ['opposition', 'ctm', 'senatrice', 'centre-gauche'],
    notes: 'Franc-parler = atout. Ancienne PPM.',
  },
  {
    name: 'Yan Monplaisir',
    type: 'personnalite',
    description: 'Leader de Peyi-A, mouvement de droite autonomiste. 5 sieges a l\'Assemblee de Martinique.',
    influence_score: 5,
    relationships: ['Péyi-A'],
    tags: ['opposition', 'ctm', 'droite-autonomiste'],
    notes: 'Nouveau mouvement, renouvellement.',
  },
  {
    name: 'Lucien Saliber',
    type: 'personnalite',
    description: 'President de l\'Assemblee de Martinique. Alians Matinik, ex-maire du Morne-Vert.',
    influence_score: 6,
    relationships: ['Alians Matinik', 'Serge Letchimy', 'CTM'],
    tags: ['majorite', 'ctm', 'assemblee'],
  },
  {
    name: 'David Zobda',
    type: 'personnalite',
    description: 'Maire du Lamentin, president de Batir le Pays Martinique. 66 ans. A DEMISSIONNE du Conseil Executif CTM — fracture interne de la coalition.',
    influence_score: 6,
    relationships: ['Bâtir le Pays Martinique', 'Alians Matinik', 'CTM'],
    tags: ['majorite', 'demissionnaire', 'lamentin'],
    notes: 'Demission du CE = signal de fracture dans la coalition Letchimy.',
  },
  {
    name: 'Arnaud René-Corail',
    type: 'personnalite',
    description: 'Conseiller executif CTM, delegue aux Finances. 71 ans, maire des Trois-Ilets depuis 1989, cadre bancaire retraite.',
    influence_score: 5,
    relationships: ['CTM', 'Alians Matinik'],
    tags: ['majorite', 'ctm', 'finances', 'trois-ilets'],
    notes: 'Maire depuis 1989 — longevite extreme.',
  },
  {
    name: 'Nicaise Monrose',
    type: 'personnalite',
    description: 'Conseiller executif CTM. 63 ans, maire de Sainte-Luce, DG Chambre d\'agriculture.',
    influence_score: 5,
    relationships: ['CTM', 'Alians Matinik', 'Chambre d\'agriculture'],
    tags: ['majorite', 'ctm', 'agriculture', 'sainte-luce'],
  },
  {
    name: 'Marie-Thérèse Casimirius',
    type: 'personnalite',
    description: 'Conseillere executive CTM. 71 ans, maire de Basse-Pointe, 1ere VP CAP Nord.',
    influence_score: 5,
    relationships: ['CTM', 'Alians Matinik', 'CAP Nord'],
    tags: ['majorite', 'ctm', 'nord', 'basse-pointe'],
  },
  {
    name: 'Audrey Thaly-Bardol',
    type: 'personnalite',
    description: 'Conseillere executive CTM, deleguee Solidarites/Jeunesse/Sante/Demographie. 47 ans, conseillere municipale Gros Morne.',
    influence_score: 4,
    relationships: ['CTM', 'Alians Matinik'],
    tags: ['majorite', 'ctm', 'jeunesse', 'sante'],
  },
  {
    name: 'Josette Manin',
    type: 'personnalite',
    description: 'Presidente de la Commission Sports et Vie Associative de l\'Assemblee de Martinique.',
    influence_score: 4,
    relationships: ['CTM', 'Assemblée de Martinique'],
    tags: ['ctm', 'commission', 'sport'],
  },
  {
    name: 'PPM',
    type: 'parti',
    description: 'Parti Progressiste Martiniquais. Centre-gauche, autonomiste modere. Heritier d\'Aime Cesaire. Reseau profond mais vieillissant. Leader: Serge Letchimy.',
    influence_score: 9,
    relationships: ['Serge Letchimy', 'Alians Matinik', 'CTM'],
    tags: ['majorite', 'centre-gauche', 'autonomiste', 'cesaire'],
    notes: 'Machine electorale eprouvee. Reseau de maires. Budget CTM ~1,5 Md€. Mais epuise.',
  },
  {
    name: 'MIM',
    type: 'parti',
    description: 'Mouvement Independantiste Martiniquais. Souverainiste. Leader: Alfred Marie-Jeanne. Bastion Sud (Riviere-Pilote). 14 sieges (Gran Sanble).',
    influence_score: 7,
    relationships: ['Alfred Marie-Jeanne', 'Gran Sanblé Pou Matinik'],
    tags: ['opposition', 'independantiste', 'sud'],
    notes: 'Marie-Jeanne 85 ans. Succession floue.',
  },
  {
    name: 'Alians Matinik',
    type: 'coalition',
    description: 'Coalition majoritaire a l\'Assemblee de Martinique. 26 sieges sur 51. Regroupe PPM, Batir le Pays Martinique, RDM et allies.',
    influence_score: 9,
    relationships: ['PPM', 'Bâtir le Pays Martinique', 'RDM', 'Serge Letchimy'],
    tags: ['majorite', 'ctm', 'coalition'],
  },
  {
    name: 'La Martinique Ensemble',
    type: 'parti',
    description: 'Parti d\'opposition centre-gauche dissident du PPM. 6 sieges. Leader: Catherine Conconne, senatrice.',
    influence_score: 5,
    relationships: ['Catherine Conconne'],
    tags: ['opposition', 'centre-gauche'],
  },
  {
    name: 'Péyi-A',
    type: 'parti',
    description: 'Mouvement de droite autonomiste. 5 sieges a l\'Assemblee. Leader: Yan Monplaisir.',
    influence_score: 4,
    relationships: ['Yan Monplaisir'],
    tags: ['opposition', 'droite-autonomiste'],
  },
  {
    name: 'Bâtir le Pays Martinique',
    type: 'parti',
    description: 'Composante de la coalition Alians Matinik. Centre-gauche. Leader: David Zobda. Fracturee par la demission de Zobda du CE.',
    influence_score: 4,
    relationships: ['David Zobda', 'Alians Matinik'],
    tags: ['majorite', 'centre-gauche', 'fracture'],
  },
];

// ═══════════════════════════════════════════════════════
// DOMAIN: ECONOMIQUE — from cartographie_economique/bekes.md
// ═══════════════════════════════════════════════════════

const economique = [
  {
    name: 'Groupe Bernard Hayot (GBH)',
    type: 'entreprise',
    description: 'Conglomerat beke. Fonde 1960. CA 5+ Md€. 18 000 salaries. Grande distribution (Carrefour, 48% CA), automobile (42%), rhum/agro/BTP (10%). Siege: Le Lamentin. ~30% part de marche distribution Martinique.',
    influence_score: 10,
    relationships: ['Stéphane Hayot', 'Carrefour', 'Clément', 'Groupe de Reynal'],
    tags: ['beke', 'distribution', 'automobile', 'monopole', 'lamentin'],
    notes: 'Enquete PNF aout 2025: escroquerie en bande organisee, abus de position dominante. Enquete HATVP 2025. Comptes publies pour 1ere fois fev 2025. Marge brute exploitation >10% vs ~5% Carrefour France.',
  },
  {
    name: 'Stéphane Hayot',
    type: 'personnalite',
    description: 'DG du Groupe Bernard Hayot (GBH). Fils de Bernard Hayot. Dirige le premier conglomerat des DOM.',
    influence_score: 9,
    relationships: ['Groupe Bernard Hayot (GBH)'],
    tags: ['beke', 'dirigeant', 'gbh'],
  },
  {
    name: 'Groupe de Reynal',
    type: 'entreprise',
    description: 'Groupe familial beke. Secteurs: banane, rhum, agriculture. Famille historique de Martinique.',
    influence_score: 6,
    relationships: ['Groupe Bernard Hayot (GBH)'],
    tags: ['beke', 'agriculture', 'banane', 'rhum'],
  },
  {
    name: 'Groupe Despointes',
    type: 'entreprise',
    description: 'Groupe familial beke (Huyghes-Despointes). Agriculture, commerce. Controverse historique sur declarations raciales.',
    influence_score: 5,
    relationships: [],
    tags: ['beke', 'agriculture', 'commerce'],
  },
  {
    name: 'Groupe Lancry',
    type: 'entreprise',
    description: 'Groupe familial beke. Secteur distribution. Concurrent de GBH.',
    influence_score: 5,
    relationships: ['Groupe Bernard Hayot (GBH)'],
    tags: ['beke', 'distribution'],
  },
  {
    name: 'SAFO',
    type: 'entreprise',
    description: 'Entreprise d\'import-export. Circuit d\'approvisionnement des Antilles.',
    influence_score: 4,
    relationships: [],
    tags: ['import-export', 'approvisionnement'],
  },
  {
    name: 'Groupe Aubéry',
    type: 'entreprise',
    description: 'Groupe familial. Media (proprietaire potentiel France-Antilles avant Niel), automobile.',
    influence_score: 5,
    relationships: ['France-Antilles'],
    tags: ['beke', 'media', 'automobile'],
  },
  {
    name: 'SOCOMORE',
    type: 'entreprise',
    description: 'Entreprise de materiaux de construction. Secteur BTP Martinique.',
    influence_score: 3,
    relationships: [],
    tags: ['btp', 'construction'],
  },
];

// ═══════════════════════════════════════════════════════
// DOMAIN: MEDIA — from cartographie_media/medias.md
// ═══════════════════════════════════════════════════════

const media = [
  {
    name: 'Martinique 1ère',
    type: 'media',
    description: 'Television + radio + web. Groupe France Televisions (service public). Couverture toute l\'ile + streaming. Orientation prudente/institutionnelle. Passage oblige pour toute legitimite mediatique.',
    influence_score: 9,
    relationships: ['France Télévisions'],
    tags: ['tv', 'radio', 'web', 'service-public', 'incontournable'],
    notes: 'Veut diffuser MOOSTIK. Premier contact etabli avec BYSS GROUP.',
  },
  {
    name: 'RCI',
    type: 'media',
    description: 'Radio Caraibes International. Radio generaliste privee locale. ~100 000 auditeurs. Mainstream, influence politique majeure. Le media radio le plus puissant de Martinique.',
    influence_score: 9,
    relationships: [],
    tags: ['radio', 'generaliste', 'populaire', 'influence-politique'],
    notes: 'Random (BYSS GROUP) inscrit au programme Pepites RCI. Controler le recit sur RCI = controler la Martinique.',
  },
  {
    name: 'France-Antilles',
    type: 'media',
    description: 'Quotidien + web. Propriete de Xavier Niel depuis 2020. Centre-droit, etablissement. Couverture factuelle. La presse ecrite de reference.',
    influence_score: 7,
    relationships: ['Xavier Niel'],
    tags: ['presse-ecrite', 'web', 'quotidien'],
    notes: 'Pas hostile mais pas alliee. Ligne editoriale factuelle.',
  },
  {
    name: 'ATV Martinique',
    type: 'media',
    description: 'Television privee locale. Independant, populaire. Canal alternatif a Martinique 1ere.',
    influence_score: 5,
    relationships: [],
    tags: ['tv', 'prive', 'local', 'independant'],
  },
  {
    name: 'KMT (Kanal Martinique Télévision)',
    type: 'media',
    description: 'Television locale. A verifier: propriete et orientation editoriale.',
    influence_score: 3,
    relationships: [],
    tags: ['tv', 'local'],
  },
  {
    name: 'Zouk TV',
    type: 'media',
    description: 'Television privee. Orientation culturelle et musicale.',
    influence_score: 3,
    relationships: [],
    tags: ['tv', 'culture', 'musique'],
  },
  {
    name: 'NRJ Antilles',
    type: 'media',
    description: 'Radio musicale. Audience jeunes 15-35 ans. Divertissement.',
    influence_score: 4,
    relationships: [],
    tags: ['radio', 'musique', 'jeunes'],
  },
  {
    name: 'Radio Apal',
    type: 'media',
    description: 'Radio associative. Audience localisee, communautaire.',
    influence_score: 2,
    relationships: [],
    tags: ['radio', 'associative', 'communautaire'],
  },
  {
    name: 'Radio Banlieue Relax',
    type: 'media',
    description: 'Radio urbaine. Public jeune et urbain.',
    influence_score: 2,
    relationships: [],
    tags: ['radio', 'urbaine', 'jeunes'],
  },
  {
    name: 'Bondamanjak',
    type: 'media',
    description: 'Blog/media en ligne independant. Ton contestataire, anti-systeme. Commentaires actifs, populaire.',
    influence_score: 5,
    relationships: [],
    tags: ['web', 'independant', 'contestataire', 'anti-systeme'],
    notes: 'Peut etre allie ou ennemi. Imprevisible. A surveiller, jamais ignorer, jamais attaquer.',
  },
  {
    name: 'Madinin\'Art',
    type: 'media',
    description: 'Media associatif en ligne. Culturel et politique. Orientation intellectuelle, cesairienne.',
    influence_score: 3,
    relationships: ['SERMAC'],
    tags: ['web', 'culture', 'intellectuel', 'cesaire'],
  },
  {
    name: 'Xavier Niel',
    type: 'personnalite',
    description: 'Proprietaire de France-Antilles depuis 2020. Milliardaire francais (Free, Station F). Controle la presse ecrite de reference en Martinique.',
    influence_score: 6,
    relationships: ['France-Antilles'],
    tags: ['proprietaire', 'media', 'metropole'],
  },
];

// ═══════════════════════════════════════════════════════
// DOMAIN: INSTITUTIONNELLE — from cartographie_institutionnelle/institutions.md
// ═══════════════════════════════════════════════════════

const institutionnelle = [
  {
    name: 'Collectivité Territoriale de Martinique (CTM)',
    type: 'institution',
    description: 'Collectivite unique fusionnant Departement + Region (loi 2011). 51 conseillers, 9 membres CE, ~4 000 agents. Competences: dev economique, formation pro, amenagement, environnement, culture, social, education, ports/aeroport. Budget estime ~1,5 Md€.',
    influence_score: 10,
    relationships: ['Serge Letchimy', 'Assemblée de Martinique'],
    tags: ['collectivite', 'cible-principale', 'ctm-2028'],
    notes: 'LA CIBLE. Elections territoriales decembre 2028.',
  },
  {
    name: 'Préfecture de Martinique',
    type: 'institution',
    description: 'Representation de l\'Etat en Martinique. Securite, ordre public. Interlocuteur obligatoire pour tout projet territorial.',
    influence_score: 8,
    relationships: ['État français'],
    tags: ['etat', 'securite', 'prefet'],
    notes: 'Prefet a identifier.',
  },
  {
    name: 'CCI Martinique',
    type: 'institution',
    description: 'Chambre de Commerce et d\'Industrie de Martinique. Represente 40 000 entreprises. Interlocuteur PME.',
    influence_score: 6,
    relationships: [],
    tags: ['economie', 'entreprises', 'pme'],
  },
  {
    name: 'IEDOM',
    type: 'institution',
    description: 'Institut d\'Emission des Departements d\'Outre-Mer. Banque de France locale. Rapports economiques, conjoncture. Source de donnees critique.',
    influence_score: 5,
    relationships: ['Banque de France'],
    tags: ['economie', 'donnees', 'conjoncture'],
  },
  {
    name: 'INSEE Antilles-Guyane',
    type: 'institution',
    description: 'Institut National de la Statistique. Demographie, emploi, PIB, prix. Source de donnees pour l\'intelligence.',
    influence_score: 5,
    relationships: [],
    tags: ['statistiques', 'donnees', 'demographie'],
  },
  {
    name: 'ARS Martinique',
    type: 'institution',
    description: 'Agence Regionale de Sante. Sante publique, hopitaux. Crise sanitaire = levier politique.',
    influence_score: 6,
    relationships: ['État français'],
    tags: ['etat', 'sante', 'hopitaux'],
  },
  {
    name: 'DEAL Martinique',
    type: 'institution',
    description: 'Direction de l\'Environnement, de l\'Amenagement et du Logement. Urbanisme, risques naturels, eau. Bloque ou debloque les projets.',
    influence_score: 5,
    relationships: ['État français'],
    tags: ['etat', 'urbanisme', 'environnement'],
  },
  {
    name: 'Rectorat de Martinique',
    type: 'institution',
    description: 'Education nationale en Martinique. 50 000 eleves = 50 000 familles.',
    influence_score: 5,
    relationships: ['État français'],
    tags: ['etat', 'education'],
  },
  {
    name: 'DEETS Martinique',
    type: 'institution',
    description: 'Direction de l\'Economie, de l\'Emploi, du Travail et des Solidarites (ex-Direccte). Emploi, travail, entreprises. Lien Byss Emploi / France Travail.',
    influence_score: 5,
    relationships: ['État français', 'France Travail Martinique'],
    tags: ['etat', 'emploi', 'travail'],
  },
  {
    name: 'Tribunal Judiciaire de Fort-de-France',
    type: 'institution',
    description: 'Justice a Fort-de-France. Dossiers GBH, marches publics.',
    influence_score: 6,
    relationships: ['État français'],
    tags: ['justice', 'etat'],
    notes: 'Enquete PNF sur GBH passe par la.',
  },
  {
    name: 'BPI France Martinique',
    type: 'institution',
    description: 'Banque Publique d\'Investissement. Financement startup, innovation. Eligibilite JEI, CIR.',
    influence_score: 5,
    relationships: [],
    tags: ['financement', 'innovation', 'startup'],
    notes: 'Eligibilite BYSS GROUP a verifier.',
  },
  {
    name: 'France Travail Martinique',
    type: 'institution',
    description: 'Service public de l\'emploi. Demandeurs, offres, formations. Byss Emploi = wrapper de leur API.',
    influence_score: 5,
    relationships: ['DEETS Martinique'],
    tags: ['emploi', 'formation'],
  },
  {
    name: 'ADEME Martinique',
    type: 'institution',
    description: 'Agence de l\'Environnement et de la Maitrise de l\'Energie. Transition ecologique, subventions.',
    influence_score: 4,
    relationships: [],
    tags: ['environnement', 'energie', 'subventions'],
  },
  {
    name: 'CAP Nord',
    type: 'intercommunalite',
    description: 'Communaute d\'Agglomeration du Pays Nord. 18 communes, ~120 000 habitants. Gere: eau, dechets, transports, dev economique local.',
    influence_score: 6,
    relationships: ['Marie-Thérèse Casimirius'],
    tags: ['epci', 'nord', 'intercommunalite'],
  },
  {
    name: 'CACEM',
    type: 'intercommunalite',
    description: 'Communaute d\'Agglomeration du Centre de la Martinique. 4 communes dont Fort-de-France, ~160 000 habitants.',
    influence_score: 7,
    relationships: [],
    tags: ['epci', 'centre', 'fort-de-france', 'intercommunalite'],
  },
  {
    name: 'Espace Sud',
    type: 'intercommunalite',
    description: 'Communaute d\'Agglomeration de l\'Espace Sud. 12 communes, ~110 000 habitants.',
    influence_score: 6,
    relationships: ['Alfred Marie-Jeanne'],
    tags: ['epci', 'sud', 'intercommunalite'],
  },
];

// ═══════════════════════════════════════════════════════
// DOMAIN: SOCIALE — from cartographie_sociale/societe_civile.md
// ═══════════════════════════════════════════════════════

const sociale = [
  {
    name: 'CGTM',
    type: 'syndicat',
    description: 'CGT Martinique. Premier syndicat, tous secteurs. Gauche, combatif. Pouvoir de mobilisation sociale majeur. Greve generale 2009 (38 jours).',
    influence_score: 8,
    relationships: ['CDMT'],
    tags: ['syndicat', 'gauche', 'mobilisation', 'greve'],
  },
  {
    name: 'CDMT',
    type: 'syndicat',
    description: 'Confederation Democratique Martiniquaise du Travail. Tous secteurs. Centre-gauche, historique, negociateur.',
    influence_score: 7,
    relationships: ['CGTM'],
    tags: ['syndicat', 'centre-gauche', 'negociation'],
  },
  {
    name: 'CSTM',
    type: 'syndicat',
    description: 'Centrale Syndicale des Travailleurs Martiniquais.',
    influence_score: 5,
    relationships: [],
    tags: ['syndicat'],
  },
  {
    name: 'FO Martinique',
    type: 'syndicat',
    description: 'Force Ouvriere Martinique. Fonction publique. Centre.',
    influence_score: 4,
    relationships: [],
    tags: ['syndicat', 'fonction-publique'],
  },
  {
    name: 'CFDT Martinique',
    type: 'syndicat',
    description: 'CFDT Martinique. Prive/public. Reformiste. Plus faible localement.',
    influence_score: 3,
    relationships: [],
    tags: ['syndicat', 'reformiste'],
  },
  {
    name: 'SERMAC',
    type: 'association',
    description: 'Service Municipal d\'Action Culturelle. Fonde par Aime Cesaire. Culture, theatre, arts. Heritage Cesaire = capital symbolique considerable.',
    influence_score: 7,
    relationships: ['Madinin\'Art'],
    tags: ['culture', 'cesaire', 'theatre', 'patrimoine'],
  },
  {
    name: 'Diocèse de Fort-de-France',
    type: 'institution-religieuse',
    description: 'Eglise catholique de Martinique. Historiquement dominante, declin relatif. Poids social encore significatif.',
    influence_score: 6,
    relationships: [],
    tags: ['religion', 'catholicisme', 'historique'],
  },
  {
    name: 'Églises Adventistes de Martinique',
    type: 'institution-religieuse',
    description: 'Eglises adventistes (7eme jour). Croissance forte, discipline communautaire. Organisation solide, entraide, reseau. Allies structurels potentiels.',
    influence_score: 6,
    relationships: [],
    tags: ['religion', 'adventisme', 'croissance', 'communaute'],
    notes: 'Allies potentiels sur themes famille, valeurs, communaute.',
  },
  {
    name: 'Églises Évangéliques de Martinique',
    type: 'institution-religieuse',
    description: 'Assemblees evangeliques multiples. Croissance rapide, reseaux actifs.',
    influence_score: 5,
    relationships: [],
    tags: ['religion', 'evangelisme', 'croissance'],
  },
  {
    name: 'Club Franciscain',
    type: 'club-sportif',
    description: 'Club de football historique de Martinique. Le football est le sport roi — chaque commune a son club. Maillage communal majeur.',
    influence_score: 4,
    relationships: ['Golden Lion', 'RC Rivière-Pilote'],
    tags: ['sport', 'football', 'franciscain'],
  },
  {
    name: 'Golden Lion',
    type: 'club-sportif',
    description: 'Club de football majeur de Martinique.',
    influence_score: 4,
    relationships: ['Club Franciscain'],
    tags: ['sport', 'football'],
  },
  {
    name: 'RC Rivière-Pilote',
    type: 'club-sportif',
    description: 'Club de football de Riviere-Pilote (bastion Marie-Jeanne, Sud).',
    influence_score: 3,
    relationships: ['Club Franciscain', 'Alfred Marie-Jeanne'],
    tags: ['sport', 'football', 'sud', 'riviere-pilote'],
  },
  {
    name: 'Diaspora Martiniquaise IDF',
    type: 'communaute',
    description: 'Communaute martiniquaise de Paris / Ile-de-France. ~150 000 personnes. Associations multiples, evenements. La plus grosse diaspora.',
    influence_score: 6,
    relationships: [],
    tags: ['diaspora', 'paris', 'idf', 'vote'],
    notes: 'La diaspora vote, influence, finance. Avantage structurel pour qui s\'y adresse.',
  },
  {
    name: 'GEREC-F',
    type: 'association',
    description: 'Groupe d\'Etudes et de Recherches en Espace Creolophone. Creolistes, patrimoine linguistique creole.',
    influence_score: 3,
    relationships: [],
    tags: ['culture', 'creole', 'langue', 'recherche'],
  },
];

// ═══════════════════════════════════════════════════════
// SEED FUNCTION
// ═══════════════════════════════════════════════════════

function buildEntities(domain, entities) {
  return entities.map((e) => ({
    domain,
    name: e.name,
    type: e.type,
    description: e.description || null,
    influence_score: e.influence_score ?? 0,
    contacts: JSON.stringify([]),
    relationships: JSON.stringify(e.relationships || []),
    notes: e.notes || null,
    tags: e.tags || [],
  }));
}

async function seed() {
  const allEntities = [
    ...buildEntities('politique', politique),
    ...buildEntities('economique', economique),
    ...buildEntities('media', media),
    ...buildEntities('institutionnelle', institutionnelle),
    ...buildEntities('sociale', sociale),
  ];

  console.log(`\n[seed-intelligence] ${allEntities.length} entities to upsert across 5 domains\n`);

  // Stats per domain
  const stats = {};
  for (const e of allEntities) {
    stats[e.domain] = (stats[e.domain] || 0) + 1;
  }
  console.log('Breakdown:');
  for (const [domain, count] of Object.entries(stats)) {
    console.log(`  ${domain}: ${count}`);
  }
  console.log('');

  // Clear existing seeded data first (idempotent re-runs)
  console.log('Clearing existing intel_entities...');
  const { error: deleteError } = await supabase
    .from('intel_entities')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000'); // delete all rows

  if (deleteError) {
    console.error('WARNING: could not clear table:', deleteError.message);
    console.log('Proceeding with insert (may create duplicates on re-run)\n');
  } else {
    console.log('Table cleared.\n');
  }

  // Insert in batches of 20
  const batchSize = 20;
  let inserted = 0;
  let errors = 0;

  for (let i = 0; i < allEntities.length; i += batchSize) {
    const batch = allEntities.slice(i, i + batchSize);

    const { data, error } = await supabase
      .from('intel_entities')
      .insert(batch);

    if (error) {
      console.error(`[batch ${Math.floor(i / batchSize) + 1}] ERROR:`, error.message);
      errors += batch.length;
    } else {
      inserted += batch.length;
      console.log(`[batch ${Math.floor(i / batchSize) + 1}] ✓ ${batch.length} entities inserted`);
    }
  }

  console.log(`\n[seed-intelligence] DONE — ${inserted} inserted, ${errors} errors\n`);
}

seed().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});
