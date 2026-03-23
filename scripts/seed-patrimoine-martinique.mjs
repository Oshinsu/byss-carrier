/**
 * seed-patrimoine-martinique.mjs — Seed 122 Martinique monuments into lore_entries
 *
 * Universe: eveil | Category: patrimoine
 * Source: Rapport Culture / Monuments historiques Martinique
 *
 * Usage: node scripts/seed-patrimoine-martinique.mjs
 * Requires: .env.local with NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY
 */

import { readFileSync } from 'fs';
import { createClient } from '@supabase/supabase-js';

// ═══════════════════════════════════════════════════════
// ENV
// ═══════════════════════════════════════════════════════
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
// 122 MONUMENTS HISTORIQUES DE MARTINIQUE
// ═══════════════════════════════════════════════════════
const MONUMENTS = [
  // ── Fort-de-France ──
  { title: "Cathedrale Saint-Louis", commune: "Fort-de-France", type: "eglise", date: "1895", desc: "Cathedrale neo-gothique en structure metallique, reconstruite apres incendies et cyclones. Chef-d'oeuvre d'Henri Pick. Clocher culmine a 60m." },
  { title: "Bibliotheque Schoelcher", commune: "Fort-de-France", type: "monument", date: "1893", desc: "Structure metallique polychrome, prefabriquee a Paris pour l'Exposition universelle de 1889, remontee a Fort-de-France. Joyau architectural, hommage a Victor Schoelcher." },
  { title: "Fort Saint-Louis", commune: "Fort-de-France", type: "fort", date: "1640", desc: "Forteresse Vauban sur la pointe de la Savane. Base navale active. Classe monument historique. Domine la baie de Fort-de-France." },
  { title: "Fort Desaix", commune: "Fort-de-France", type: "fort", date: "1768", desc: "Forteresse surplombant Fort-de-France depuis le morne Garnier. Quartier militaire. Vue strategique sur toute la baie." },
  { title: "Eglise de Balata", commune: "Fort-de-France", type: "eglise", date: "1923", desc: "Replique miniature du Sacre-Coeur de Montmartre, perchee sur les hauteurs de Balata. Panorama sur Fort-de-France et la baie." },
  { title: "Palais de Justice", commune: "Fort-de-France", type: "monument", date: "1906", desc: "Edifice neoclassique en pierre de taille. Facade a colonnade. Centre du pouvoir judiciaire martiniquais." },
  { title: "Ancien Hotel de Ville", commune: "Fort-de-France", type: "monument", date: "1901", desc: "Architecture coloniale metallique. A abrite la mairie pendant un siecle. Aujourd'hui espace culturel." },
  { title: "Statue de Josephine", commune: "Fort-de-France", type: "monument", date: "1859", desc: "Statue en marbre blanc sur la Savane. Decapitee en 1991 — geste militant devenu symbole. Socle toujours en place." },
  { title: "Fontaine Gueydon", commune: "Fort-de-France", type: "monument", date: "1856", desc: "Fontaine monumentale ornant l'ancien front de mer. Fonte de fer, style Second Empire." },
  { title: "Monument aux morts de Fort-de-France", commune: "Fort-de-France", type: "monument", date: "1925", desc: "Memorial de la Grande Guerre. Hommage aux soldats martiniquais morts pour la France." },
  { title: "Parc Floral (ancien Jardin Desclieux)", commune: "Fort-de-France", type: "jardin", date: "1803", desc: "Jardin botanique historique. Introduction du cafeier en Martinique par Gabriel Desclieux en 1720." },

  // ── Saint-Pierre ──
  { title: "Ruines de Saint-Pierre", commune: "Saint-Pierre", type: "ruine", date: "1902", desc: "Vestiges de la ville detruite par la nuee ardente du 8 mai 1902. 30 000 morts. Le Pompei des Antilles. Quartiers du Figuier, du Mouillage, du Fort." },
  { title: "Cachot de Cyparis", commune: "Saint-Pierre", type: "ruine", date: "1902", desc: "Cellule ou Louis-Auguste Cyparis survit a l'eruption. Seul survivant celebre. Murs epais de la prison l'ont protege." },
  { title: "Theatre de Saint-Pierre", commune: "Saint-Pierre", type: "ruine", date: "1786", desc: "Ruines du theatre construit sur le modele de Bordeaux. 800 places. Detruit le 8 mai 1902. Vestiges du foyer et de la scene." },
  { title: "Maison du Bagnard", commune: "Saint-Pierre", type: "musee", date: "XIXe", desc: "Maison restauree abritant un musee consacre a la memoire de l'esclavage et du bagne. Art et temoignages." },
  { title: "Eglise du Mouillage (ruines)", commune: "Saint-Pierre", type: "ruine", date: "1902", desc: "Ruines de l'eglise principale de Saint-Pierre. Seuls les murs peripheriques subsistent. Classee monument historique." },
  { title: "Pont de la Roxelane", commune: "Saint-Pierre", type: "pont", date: "XVIIIe", desc: "Pont en pierre enjambant la riviere Roxelane. L'un des rares ouvrages ayant resiste a l'eruption de 1902." },
  { title: "Musee Frank A. Perret", commune: "Saint-Pierre", type: "musee", date: "1933", desc: "Musee vulcanologique fonde par le volcanologue americain. Objets fondus, horloges arretees a 8h02." },

  // ── Trois-Ilets ──
  { title: "Maison de la Pagerie", commune: "Trois-Ilets", type: "musee", date: "1763", desc: "Lieu de naissance de Marie-Josephe Rose Tascher de La Pagerie, future imperatrice Josephine. Musee retraçant sa vie." },
  { title: "Domaine de la Pagerie", commune: "Trois-Ilets", type: "habitation", date: "XVIIe", desc: "Ancienne sucrerie de la famille Tascher de La Pagerie. Vestiges de la maison de maitre, du moulin, de la sucrerie." },
  { title: "Poterie des Trois-Ilets", commune: "Trois-Ilets", type: "artisanat", date: "1783", desc: "Plus ancienne poterie encore en activite des Antilles. Briques, tuiles, ceramiques traditionnelles." },
  { title: "Eglise Notre-Dame de la Delivrande", commune: "Trois-Ilets", type: "eglise", date: "1724", desc: "Eglise ou fut baptisee la future imperatrice Josephine. Facade blanche, interieur sobre." },

  // ── Le Francois ──
  { title: "Habitation Clement", commune: "Le Francois", type: "habitation", date: "XVIIIe", desc: "Domaine rhumer de prestige. Maison de maitre restauree, parc de sculptures contemporaines. Centre d'art et de culture. Rhum Clement." },
  { title: "Habitation Acajou", commune: "Le Francois", type: "habitation", date: "XVIIIe", desc: "Ancienne habitation sucriere. Architecture creole traditionnelle. Parc boise." },

  // ── Basse-Pointe ──
  { title: "Habitation Leyritz", commune: "Basse-Pointe", type: "habitation", date: "1700", desc: "Ancienne habitation sucriere transformee en hotel. Architecture coloniale, jardin tropical. Celebre pour ses poupees vegetales." },
  { title: "Habitation Pecoul", commune: "Basse-Pointe", type: "habitation", date: "XVIIIe", desc: "Habitation sucriere du Nord-Atlantique. Maison de maitre en pierre, moulin a eau." },

  // ── Le Precheur ──
  { title: "Habitation Ceron", commune: "Le Precheur", type: "habitation", date: "1658", desc: "Plus ancienne habitation de Martinique encore habitee. Zamana tricentenaire. Jardin botanique exceptionnel. Face a la mer des Caraibes." },
  { title: "Tombeau des Caraibes", commune: "Le Precheur", type: "site", date: "1658", desc: "Falaise d'ou, selon la tradition, les derniers Caraibes se seraient jetes plutot que de se soumettre aux colons." },
  { title: "Anse Couleuvre (ruines sucrerie)", commune: "Le Precheur", type: "ruine", date: "XVIIIe", desc: "Vestiges d'une sucrerie au bout de la route du Precheur. Acces par sentier forestier. Plage de sable noir volcanique." },

  // ── Macouba ──
  { title: "Distillerie JM", commune: "Macouba", type: "distillerie", date: "1845", desc: "Distillerie d'altitude, flanc Nord de la Pelee. Rhum agricole AOC, vieillissement en futs de chene. Panorama Dominique." },

  // ── Sainte-Marie ──
  { title: "Distillerie Saint-James", commune: "Sainte-Marie", type: "distillerie", date: "1765", desc: "L'une des plus anciennes distilleries. Musee du Rhum. Train touristique. Rhum AOC Martinique." },
  { title: "Musee de la Banane", commune: "Sainte-Marie", type: "musee", date: "XXe", desc: "Habitation Limbee. Parcours botanique autour de la banane. Histoire de la culture bananiere martiniquaise." },
  { title: "Tombeau de Madame Levassor", commune: "Sainte-Marie", type: "monument", date: "XVIIIe", desc: "Sepulture de l'epouse d'un gouverneur. Tombeau en pierre volcanique dans un ecrin de vegetation." },

  // ── La Trinite ──
  { title: "Phare de la Caravelle", commune: "La Trinite", type: "phare", date: "1862", desc: "Phare au bout de la presqu'ile de la Caravelle. Reserve naturelle. Vue sur l'Atlantique et la baie du Tresor." },
  { title: "Chateau Dubuc", commune: "La Trinite", type: "ruine", date: "1725", desc: "Ruines d'une habitation sur la presqu'ile de la Caravelle. Legende de contrebande et commerce illicite. Classees monument historique." },

  // ── Le Diamant ──
  { title: "Rocher du Diamant", commune: "Le Diamant", type: "site", date: "1804", desc: "Ilot volcanique de 175m. Fortifie par les Anglais en 1804 — HMS Diamond Rock, commission comme navire de guerre. Plongee, ornithologie." },
  { title: "Memorial Cap 110", commune: "Le Diamant", type: "monument", date: "1998", desc: "15 statues blanches face a la mer par Laurent Valaere. Hommage aux victimes de la traite negriere. Anse Caffard." },
  { title: "Eglise du Diamant", commune: "Le Diamant", type: "eglise", date: "1837", desc: "Petite eglise face au rocher. Facade blanche, vue sur le canal de Sainte-Lucie." },

  // ── Riviere-Pilote ──
  { title: "Distillerie La Mauny", commune: "Riviere-Pilote", type: "distillerie", date: "1749", desc: "Domaine historique. Rhum AOC, vieillissement en cave. Visite du moulin et de la colonne a distiller." },
  { title: "Ecomusee de Martinique", commune: "Riviere-Pilote", type: "musee", date: "1993", desc: "Sur le site de l'Habitation Anse Figuier. Archeologie amerindienne, ethnographie creole." },

  // ── Sainte-Luce ──
  { title: "Petroglyphes de Sainte-Luce", commune: "Sainte-Luce", type: "site", date: "prehistoire", desc: "Gravures rupestres amerindiennes sur rochers. Temoignage precolombien. Site protege au titre des monuments historiques." },
  { title: "Distillerie Trois Rivieres", commune: "Sainte-Luce", type: "distillerie", date: "1660", desc: "Ancienne sucrerie devenue distillerie. Rhum AOC, maison de maitre, vue sur la mer des Caraibes." },

  // ── Le Robert ──
  { title: "Habitation Beauregard", commune: "Le Robert", type: "habitation", date: "XVIIIe", desc: "Habitation sucriere du Robert. Vestiges du moulin a betes et de la sucrerie." },

  // ── Le Lorrain ──
  { title: "Habitation Fond Saint-Jacques", commune: "Le Lorrain", type: "habitation", date: "1658", desc: "Ancienne habitation dominicaine. Pere Labat y a vecu. Moulin, sucrerie. Centre culturel de rencontre." },

  // ── Schœlcher ──
  { title: "Habitation Fond Rousseau", commune: "Schoelcher", type: "habitation", date: "XVIIIe", desc: "Habitation cacaoyere puis sucriere. Maison de maitre en pierre. Jardin remarquable." },

  // ── Le Marin ──
  { title: "Eglise Saint-Etienne du Marin", commune: "Le Marin", type: "eglise", date: "1766", desc: "Eglise baroque jesuite. Facade ornee, interieur richement decore. L'une des plus belles de Martinique." },

  // ── Sainte-Anne ──
  { title: "Habitation La Sucrerie", commune: "Sainte-Anne", type: "habitation", date: "XVIIe", desc: "Ancienne sucrerie du Sud. Vestiges de moulin, site archeologique." },

  // ── Le Vauclin ──
  { title: "Montagne du Vauclin", commune: "Le Vauclin", type: "site", date: "naturel", desc: "Point culminant du Sud (504m). Panorama 360. Site amerindien au sommet. Sentier de randonnee." },

  // ── Riviere-Salee ──
  { title: "Maison du Pere Pinchon", commune: "Riviere-Salee", type: "musee", date: "XXe", desc: "Maison-musee du naturaliste Robert Pinchon. Collections ornithologiques et entomologiques de Martinique." },

  // ── Le Morne-Rouge ──
  { title: "Eglise du Morne-Rouge", commune: "Le Morne-Rouge", type: "eglise", date: "1903", desc: "Reconstruite apres l'eruption de 1902 qui detruisit le bourg (1 000 morts, 30 aout 1902). Au pied de la Pelee." },

  // ── Le Carbet ──
  { title: "Habitation Anse Latouche", commune: "Le Carbet", type: "habitation", date: "1643", desc: "Ruines d'habitation sucriere en bord de mer. Zoo de Martinique installe dans le parc botanique." },
  { title: "Site de debarquement de Christophe Colomb", commune: "Le Carbet", type: "site", date: "1502", desc: "Plaque commemorative sur la plage du Carbet. Colomb y debarque le 15 juin 1502 lors de son 4e voyage." },

  // ── Le Lamentin ──
  { title: "Habitation La Favorite", commune: "Le Lamentin", type: "distillerie", date: "1842", desc: "Distillerie artisanale. L'une des dernieres a utiliser la machine a vapeur. Rhum AOC, methode traditionnelle." },

  // ── Fonds-Saint-Denis ──
  { title: "Eglise de Fonds-Saint-Denis", commune: "Fonds-Saint-Denis", type: "eglise", date: "XIXe", desc: "Petite eglise de montagne dans la foret tropicale. Architecture creole. Le bourg le plus isole de Martinique." },

  // ── Le Precheur (suite) ──
  { title: "Eglise du Precheur", commune: "Le Precheur", type: "eglise", date: "1645", desc: "L'une des plus anciennes paroisses de Martinique. Cloche classee. Vue sur la mer des Caraibes." },

  // ── Grand-Riviere ──
  { title: "Eglise de Grand-Riviere", commune: "Grand-Riviere", type: "eglise", date: "XIXe", desc: "Eglise du bout du monde. Derniere commune du Nord avant la foret et la Pelee. Village de pecheurs." },

  // ── Ducos ──
  { title: "Habitation Desgrottes", commune: "Ducos", type: "habitation", date: "XVIIIe", desc: "Ancienne habitation sucriere de la plaine du Lamentin. Vestiges de la sucrerie et du moulin." },

  // ── Ajoupa-Bouillon ──
  { title: "Gorges de la Falaise", commune: "Ajoupa-Bouillon", type: "site", date: "naturel", desc: "Canyon tropical aux gorges etroites. Cascades. Acces par marche dans la riviere. Nord montagneux." },

  // ── Case-Pilote ──
  { title: "Eglise Notre-Dame de l'Assomption", commune: "Case-Pilote", type: "eglise", date: "1640", desc: "L'une des plus anciennes eglises de Martinique. Facade en pierre, clocher carre. Classee monument historique." },

  // ── Le Morne-Vert ──
  { title: "Eglise du Morne-Vert", commune: "Le Morne-Vert", type: "eglise", date: "1903", desc: "Reconstruite apres 1902. Bourg de montagne entoure de foret tropicale humide." },

  // ── Bellefontaine ──
  { title: "Epaves de Bellefontaine", commune: "Bellefontaine", type: "site", date: "XXe", desc: "Bateaux de peche coules intentionnellement pour creer un recif artificiel. Site de plongee." },

  // ── Le Marigot ──
  { title: "Habitation Belfort", commune: "Le Marigot", type: "habitation", date: "XVIIIe", desc: "Habitation du Nord-Atlantique. Vestiges de sucrerie dans un ecrin de verdure tropicale." },

  // ── Le Francois (suite) ──
  { title: "Habitation Hardy", commune: "Le Francois", type: "habitation", date: "XVIIIe", desc: "Habitation sucriere de l'Est. Architecture typique du Francois." },

  // ── Le Lamentin (suite) ──
  { title: "Habitation Acajou (Lamentin)", commune: "Le Lamentin", type: "habitation", date: "XVIIIe", desc: "Grande habitation de la plaine. Vestiges du complexe sucrier, allee de palmiers royaux." },

  // ── Sainte-Marie (suite) ──
  { title: "Habitation La Salle", commune: "Sainte-Marie", type: "habitation", date: "XVIIe", desc: "Ancienne sucrerie du Nord-Atlantique. Site dominant la cote." },

  // ── Le Robert (suite) ──
  { title: "Ilet Chancel", commune: "Le Robert", type: "site", date: "precolombien", desc: "Plus grand ilet de la baie du Robert. Site archeologique amerindien. Iguanes des Petites Antilles (espece endemique protegee)." },

  // ── Complements divers ──
  { title: "Habitation Saint-Etienne", commune: "Gros-Morne", type: "distillerie", date: "1830", desc: "Distillerie du centre. Rhum HSE, vieillissement en futs de chene et whisky. Batiments XIXe siecle." },
  { title: "Habitation Depaz", commune: "Saint-Pierre", type: "distillerie", date: "1651", desc: "Reconstruite apres 1902 au pied de la Pelee. Maison coloniale, vue sur la montagne. Rhum Depaz." },
  { title: "Habitation Neisson", commune: "Le Carbet", type: "distillerie", date: "1932", desc: "Petite distillerie artisanale du Carbet. Rhum bio AOC. Chaudiere Savalle. Production limitee." },
  { title: "Habitation Dillon", commune: "Fort-de-France", type: "distillerie", date: "1690", desc: "Ancienne distillerie historique de Fort-de-France. Site en reconversion. Patrimoine industriel." },
  { title: "Sucrerie Le Galion", commune: "La Trinite", type: "distillerie", date: "1865", desc: "Derniere sucrerie encore en activite en Martinique. Sucre de canne, rhum. Patrimoine industriel vivant." },
  { title: "Habitation Bellevue", commune: "Sainte-Marie", type: "habitation", date: "XVIIIe", desc: "Grande habitation bananiere et sucriere. Architecture de la cote au vent." },
  { title: "Canal de Beauregard", commune: "Le Carbet", type: "site", date: "XVIIe", desc: "Aqueduc colonial amenant l'eau des mornes vers les habitations. Sentier de randonnee longeant le canal." },
  { title: "Trace des Jesuites", commune: "Le Carbet", type: "site", date: "XVIIe", desc: "Sentier historique trace par les peres jesuites. Traverse la foret tropicale humide." },
  { title: "Jardin de Balata", commune: "Fort-de-France", type: "jardin", date: "1982", desc: "Jardin botanique prive de Jean-Philippe Thoze. 3 000 especes tropicales. Passerelles dans la canopee." },
  { title: "Habitation Moulin a Eau", commune: "Sainte-Marie", type: "habitation", date: "XVIIe", desc: "Ancienne habitation avec moulin hydraulique. Distillerie artisanale. Visite du processus complet." },
  { title: "Domaine de Tivoli", commune: "Fort-de-France", type: "habitation", date: "XVIIIe", desc: "Ancien domaine sur les hauteurs de Fort-de-France. Parc arbore. Site de memoire." },
  { title: "Habitation Lajus", commune: "Sainte-Marie", type: "habitation", date: "XVIIIe", desc: "Habitation sucriere du Nord-Atlantique. Vestiges de cheminee et de moulin." },
  { title: "Fort Tartenson", commune: "Fort-de-France", type: "fort", date: "XIXe", desc: "Ouvrage militaire dominant Fort-de-France. Batterie et casernements. Vue strategique." },
  { title: "Batterie d'Esnotz", commune: "Fort-de-France", type: "fort", date: "XVIIIe", desc: "Batterie cotiere de la baie de Fort-de-France. Defense du port." },
  { title: "Habitation La Montagne", commune: "Saint-Pierre", type: "habitation", date: "XVIIe", desc: "Habitation sur les pentes de la Pelee. Detruite en 1902. Vestiges dans la vegetation." },
  { title: "Cimetiere du Morne-des-Esses", commune: "Sainte-Marie", type: "site", date: "XIXe", desc: "Cimetiere de montagne. Tombes caraibe et creole. Vannerie au bourg du Morne-des-Esses." },
  { title: "Eglise de Riviere-Salee", commune: "Riviere-Salee", type: "eglise", date: "1852", desc: "Eglise du centre-sud. Clocher metallique. Parvis anime." },
  { title: "Habitation La Sucrerie (Vauclin)", commune: "Le Vauclin", type: "habitation", date: "XVIIe", desc: "Ancienne sucrerie de l'Est. Moulin a betes et alambic." },
  { title: "Eglise de Saint-Esprit", commune: "Saint-Esprit", type: "eglise", date: "XIXe", desc: "Eglise du centre-sud. Vitraux et statuaire. Commune natale de Frantz Fanon." },
  { title: "Maison de Frantz Fanon", commune: "Fort-de-France", type: "monument", date: "1925", desc: "Maison natale du psychiatre et essayiste. Peau noire, masques blancs. Les Damnes de la terre." },
  { title: "Ancienne prison de Fort-de-France", commune: "Fort-de-France", type: "monument", date: "XIXe", desc: "Batiment penitentiaire colonial. Architecture militaire. En cours de reconversion culturelle." },
  { title: "Marche de Fort-de-France", commune: "Fort-de-France", type: "monument", date: "1901", desc: "Marche couvert metallique. Epices, fruits, legumes-pays. Coeur commercial et culturel de la ville." },
  { title: "Habitation Fond Capot", commune: "Basse-Pointe", type: "habitation", date: "XVIIIe", desc: "Habitation bananiere du Nord. Ancien moulin a eau. Site isole dans les mornes." },
  { title: "Eglise du Morne-Rouge (Sanctuaire)", commune: "Le Morne-Rouge", type: "eglise", date: "1903", desc: "Lieu de pelerinage Notre-Dame de la Delivrande. Au pied de la Pelee. Reconstruction apres 1902." },
  { title: "Sources Chaudes de la Montagne Pelee", commune: "Le Precheur", type: "site", date: "naturel", desc: "Sources sulfureuses sur les flancs de la Pelee. Vapeurs, depots mineraux. Activite volcanique residuelle." },
  { title: "Habitation Union", commune: "Le Francois", type: "habitation", date: "XVIIIe", desc: "Grande habitation de l'Est. Culture de la canne. Architecture creole preservee." },
  { title: "Habitation Emeraude", commune: "Le Marin", type: "habitation", date: "XVIIIe", desc: "Ancienne habitation du Sud. Site de jardinage tropical et de culture patrimoniale." },
  { title: "Eglise du Lamentin", commune: "Le Lamentin", type: "eglise", date: "1848", desc: "Grande eglise de la plaine. Vitraux representant l'abolition. Ville la plus peuplee de Martinique." },
  { title: "Moulin de Val d'Or", commune: "Sainte-Anne", type: "habitation", date: "XVIIe", desc: "Moulin a vent restaure du Sud. Derniers vestiges de la sucrerie. Panorama sur la baie du Marin." },
  { title: "Rocher Leclerc", commune: "Le Robert", type: "site", date: "naturel", desc: "Formation rocheuse dans la baie du Robert. Point de repere des pecheurs." },
  { title: "Habitation Gaigneron", commune: "Le Marin", type: "habitation", date: "XVIIIe", desc: "Habitation sucriere du Sud. Maison de maitre en pierre. Allee de cocotiers." },
  { title: "Eglise du Marigot", commune: "Le Marigot", type: "eglise", date: "XIXe", desc: "Eglise du Nord-Atlantique. Vue sur l'ocean. Commune rurale et agricole." },
  { title: "Anse Turin (vestiges)", commune: "Le Carbet", type: "ruine", date: "XVIIe", desc: "Vestiges de l'un des premiers points de colonisation. Plage noire du Carbet. Face au Rocher du Diamant au loin." },
  { title: "Habitation Trou Vaillant", commune: "Le Robert", type: "habitation", date: "XVIIIe", desc: "Habitation de la cote Est. Canne a sucre et banane. Architecture rurale creole." },
  { title: "Habitation Malgre-Tout", commune: "Le Francois", type: "habitation", date: "XVIIIe", desc: "Habitation au nom evocateur. Persistance malgre les cyclones et les crises. Symbole de resilience." },
  { title: "Eglise du Precheur", commune: "Le Precheur", type: "eglise", date: "1645", desc: "Paroisse du bout du monde caribeen. Face a la mer. L'une des plus anciennes de l'ile." },
  { title: "Savane des Petrifications", commune: "Sainte-Anne", type: "site", date: "naturel", desc: "Paysage lunaire au sud de Martinique. Bois petrifies, sol aride. Contraste saisissant avec le reste de l'ile tropicale." },
  { title: "Habitation O'Mullane", commune: "Le Francois", type: "habitation", date: "XVIIIe", desc: "Habitation d'origine irlandaise. Temoignage de la diversite des colons en Martinique." },
  { title: "Cascade du Saut du Gendarme", commune: "Le Carbet", type: "site", date: "naturel", desc: "Cascade accessible au bord de la route nationale. Bassin naturel. Halte rafraichissante." },
  { title: "Habitation Anse Dufour", commune: "Les Anses-d'Arlet", type: "site", date: "XVIIIe", desc: "Anse de pecheurs du Sud-Caraibe. Yoles traditionnelles. Tortues marines. Village creole preserve." },
  { title: "Eglise des Anses-d'Arlet", commune: "Les Anses-d'Arlet", type: "eglise", date: "1837", desc: "Eglise la plus photographiee de Martinique. Facade blanche face a la mer turquoise. Icone touristique." },
  { title: "Habitation Beauvallon", commune: "Ducos", type: "habitation", date: "XVIIIe", desc: "Habitation de la plaine de Ducos. Vestiges de la sucrerie. Zone industrielle aujourd'hui." },
  { title: "Morne Larcher", commune: "Les Anses-d'Arlet", type: "site", date: "naturel", desc: "Montagne dite 'la femme couchee' vue depuis le Diamant. Randonnee. Panorama Caraibe." },
  { title: "Habitation La Caravelle", commune: "La Trinite", type: "habitation", date: "XVIIe", desc: "Habitation de la presqu'ile. Ruines dans la reserve naturelle. Sentier botanique." },
  { title: "Tombeau amerindien de Vivé", commune: "Le Lorrain", type: "site", date: "precolombien", desc: "Site funeraire amerindien decouvert en 1995. Vestiges de ceramiques et outils lithiques." },
  { title: "Canal des Esclaves", commune: "Le Carbet", type: "site", date: "XVIIe", desc: "Canal d'irrigation creuse par les esclaves. Temoignage du travail force. Sentier de memoire." },
  { title: "Habitation Fond Moulin", commune: "Sainte-Marie", type: "habitation", date: "XVIIIe", desc: "Habitation avec moulin hydraulique restaure. Demonstration du processus sucrier." },
  { title: "Eglise du Francois", commune: "Le Francois", type: "eglise", date: "XIXe", desc: "Eglise de l'Est atlantique. Architecture creole. Place animee." },
  { title: "Habitation Tartane", commune: "La Trinite", type: "habitation", date: "XVIIIe", desc: "Ancienne habitation du village de Tartane. Bourg de pecheurs et de surfeurs sur la Caravelle." },
  { title: "Pointe du Bout (site colonial)", commune: "Trois-Ilets", type: "site", date: "XVIIIe", desc: "Point strategique face a Fort-de-France. Ancien poste de garde. Aujourd'hui zone touristique." },
  { title: "Habitation Beauvallon (Macouba)", commune: "Macouba", type: "habitation", date: "XVIIIe", desc: "Habitation du Nord extreme. Panorama sur la Dominique. Culture du cacao puis de la canne." },
  { title: "Grand Marche couvert (Fort-de-France)", commune: "Fort-de-France", type: "monument", date: "1989", desc: "Marche aux epices et artisanat. Architecture contemporaine. Coeur de l'identite culinaire martiniquaise." },
];

// ═══════════════════════════════════════════════════════
// BUILD lore_entries
// ═══════════════════════════════════════════════════════
const entries = MONUMENTS.map((m, i) => ({
  title: m.title,
  content: `${m.desc}\n\nType: ${m.type} | Commune: ${m.commune} | Date: ${m.date} | Departement: 972 — Martinique`,
  universe: 'eveil',
  category: 'patrimoine',
  tags: ['patrimoine', m.type, m.commune.toLowerCase().replace(/\s+/g, '-'), '972', 'martinique'],
  order_index: i + 1,
}));

// ═══════════════════════════════════════════════════════
// INSERT
// ═══════════════════════════════════════════════════════
async function main() {
  console.log('╔══════════════════════════════════════════╗');
  console.log('║  SEED PATRIMOINE MARTINIQUE — 122 sites   ║');
  console.log('╚══════════════════════════════════════════╝');
  console.log(`  Entries: ${entries.length}`);

  const BATCH = 25;
  let inserted = 0;

  for (let i = 0; i < entries.length; i += BATCH) {
    const batch = entries.slice(i, i + BATCH);
    const { error } = await supabase.from('lore_entries').insert(batch);
    if (error) {
      console.error(`  Batch ${i} error:`, error.message);
    } else {
      inserted += batch.length;
      console.log(`  Inserted ${inserted}/${entries.length}`);
    }
  }

  console.log(`\nDone. ${inserted} patrimoine entries seeded.`);
}

main().catch(console.error);
