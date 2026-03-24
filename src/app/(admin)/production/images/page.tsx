"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import {
  Image as ImageIcon, Sparkles, Layers, Play, Check, AlertCircle,
  UtensilsCrossed, Wine, Building, Ship, Briefcase, Radio, Palette,
  Loader2, ClipboardCheck, Trash2, Link, CheckCircle2,
  ChevronDown, Copy, Clapperboard,
  Camera, MapPin, Users, CloudSun,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { IMAGE_VERTICALS } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { ImageVertical, ImageShotType } from "@/types";

/* ═══════════════════════════════════════════════════════
   IMAGE PIPELINE — 3-Layer Style System
   CAMERA_BASE + REALISM_GUARD + DIRECTION[shotType]

   Fork du Cadifor assets-pipeline.
   Co\u00FBt ~$0.02/image via Nano Banana Pro, vendu 50-750\u20AC
   ═══════════════════════════════════════════════════════ */

const VERTICAL_ICONS: Record<ImageVertical, React.ElementType> = {
  restaurant: UtensilsCrossed,
  rhum: Wine,
  hotel: Building,
  excursion: Ship,
  corporate: Briefcase,
  telecom: Radio,
  custom: Palette,
};

const STYLE_LAYERS = {
  camera_base: "Shot on RED DRAGON 6K sensor, Cooke S7/i prime lens. Native 4K output. Kodak Vision3 500T color science, ACES color pipeline.",
  realism_guard: "Photorealistic. Skin: visible pores, natural imperfections, subsurface scattering. Fabric: real weight, drape, weave texture. No plastic skin, no AI glow, no uncanny valley.",
  direction: {
    lifestyle: "Candid moment, warm ambient lighting, lifestyle editorial feel, genuine emotions",
    product: "Clean studio lighting, product hero shot, dramatic shadows, premium finish",
    testimonial: "Portrait, eye contact, confident expression, professional headshot quality",
    urban: "Street photography, vibrant Caribbean colors, architectural context, golden hour",
    event: "Dynamic composition, crowd energy, stage lighting, live atmosphere",
    hero: "Wide angle establishing shot, cinematic framing, dramatic sky, brand landmark",
    detail: "Macro close-up, texture focus, artisan craftsmanship, rich detail",
    food: "50mm f/2.0 macro, shallow depth of field, steam and texture visible. Natural window light, warm golden tones. Michelin-guide editorial.",
    spirit: "85mm f/1.8, bottle in focus, background bokeh showing terroir. Golden hour Caribbean light, warm amber tones. Monocle magazine editorial.",
    hospitality: "24mm f/4, wide interior showing space and light. Caribbean blue visible through windows. Cond\u00E9 Nast Traveler editorial.",
    marine: "16mm f/8, deep depth of field, turquoise Caribbean water. Golden hour or blue hour. National Geographic editorial.",
    portrait: "85mm f/1.4, shallow depth of field. Natural motivated light, Rembrandt pattern. Caribbean skin tones: warm, rich, real.",
    mobile: "Vertical 9:16. High saturation for small screen impact. Center composition. Instagram-native aesthetic.",
  } as Record<ImageShotType, string>,
};

/* ═══════════════════════════════════════════════════════
   PIPELINE FORK GUIDE — 5 Verticals + Phase System
   Source: PIPELINE_FORK_GUIDE.md (Cadifor fork)
   ═══════════════════════════════════════════════════════ */

const VERTICAL_PHASE_MAP: Record<string, { label: string; color: string; icon: React.ElementType; phases: string[] }> = {
  restaurant: {
    label: "Restaurant",
    color: "#00B4D8",
    icon: UtensilsCrossed,
    phases: ["Logo / branding", "Plats signature", "Salle / terrasse", "Service / ambiance", "Hero / cards web"],
  },
  rhum: {
    label: "Rhum / Distillerie",
    color: "#F59E0B",
    icon: Wine,
    phases: ["\u00C9tiquette / bouteille", "Bouteilles gamme", "Distillerie / champs", "D\u00E9gustation / visite", "E-commerce"],
  },
  hotel: {
    label: "H\u00F4tel",
    color: "#3B82F6",
    icon: Building,
    phases: ["Logo / charte", "Chambres / suites", "Piscine / plage", "Exp\u00E9rience client", "Booking page"],
  },
  excursion: {
    label: "Excursion",
    color: "#10B981",
    icon: Ship,
    phases: ["Logo / branding", "Bateaux / \u00E9quipement", "Spots (mer / for\u00EAt)", "Aventure client", "Booking page"],
  },
  corporate: {
    label: "Corporate",
    color: "#8B5CF6",
    icon: Briefcase,
    phases: ["Logo / charte", "Portraits dirigeants", "Locaux / bureaux", "Produit / service", "Hero / landing"],
  },
};

const JW_PROMPTS_NAYOU: { title: string; prompt: string; tags: string[] }[] = [
  {
    title: "Kofi decoupe le brachiosaure",
    prompt: "Dawn over the killing field outside Mwamba. A brachiosaur lies on its side on cracked red laterite, thirty tons of grey-brown flesh steaming in the cold morning air. Ribs like the hull of a beached ship. Kofi walks the perimeter — small, round, tyrannosaur-leather apron. Thirty butchers follow. He touches the flank, reads the meat with his fingertips. Says one word: \"vite.\" The first cleaver goes into the abdomen. Steam erupts. In the background, Nana carries clay bowls from her kiln. She does not look at the brachiosaur.\n\nARRI Alexa 65, 40mm. Medium-wide. Pre-dawn blue shifting to orange. Kodak 500T. Palette: grey flesh, red earth, orange sunrise, dark skin, bronze blades. 4K, 21:9, photorealistic.",
    tags: ["brachiosaur", "butcher", "dawn", "Mwamba"],
  },
  {
    title: "Le Peseur aveugle",
    prompt: "A room the size of a closet. Walls of bleached coral, one shutter facing east. A balance made from pteranodon wing-bones, pans carved from nautilus shell. The Peseur — old, blind since birth, eyes like milk — holds amber the size of a plum. He rotates it, brings it to his nose. Two merchants stand opposite. The Peseur places the amber on the left pan. A calibrated stone on the right. The balance tips. He says a number. Final. He always touches twice — first the amber, then the stone inside.\n\nARRI Alexa Mini, 50mm. Close interior. Single source: east shutter. Kodak 250D. Palette: black stone, amber glow, milk-white eyes, dark hands, coral white. 4K, 16:9, photorealistic.",
    tags: ["amber", "blind", "balance", "Volonia"],
  },
  {
    title: "La descente au cenote",
    prompt: "Eighty meters of spiral stone staircase carved into a natural sinkhole two hundred meters across. Itzal, nine years old, descends. Above him, the circle of sky shrinks — dinner plate, coin, star. At the bottom: water. Blue so deep it reads as black at the edges and electric cobalt at the center. A shaft of light from above falls straight down like a solid column. Itzal kneels. His reflection is darker than him. He cups his hands. He drinks. A single drop falls from his chin — one frame of light before the stone drinks it.\n\nIMAX 65mm. Vertical composition. Natural light only. Kodak Ektachrome 100D. Palette: black volcanic stone, cobalt water, white light column, brown skin. 4K, 9:16 vertical / 21:9 for water reveal. Photorealistic.",
    tags: ["cenote", "descent", "water", "light"],
  },
  {
    title: "Dara au gue",
    prompt: "A river at dusk. A tyrannosaur in the shallows, nine tons, jaw trembling, dried blood on the left flank not its own. Dara stands beside it, fifty-four, right hand on the flank where the ribs meet the belly. She can feel the heartbeat — two hundred BPM, too fast. She does not speak. The river moves. Her hand stays. A proto-heron lands on the tyrannosaur's back picking parasites. Dara almost smiles. Almost.\n\nRED V-Raptor, 85mm. Medium shot. Dusk. Purple sky reflected in brown water. Kodak 500T. Palette: brown water, purple sky, dark green scales, dark skin, orange rim-light. 4K, 21:9, photorealistic.",
    tags: ["tyrannosaur", "healing", "dusk", "river"],
  },
  {
    title: "La nurserie a insectes de Mbaku",
    prompt: "Interior. Humid. Dark. Shelves of fern-rib with eggshell containers, each holding bioluminescent insects bred for brightness across thirty generations. The Mere des Lucioles — seventy-one, dreadlocks to the floor, seven dinosaur teeth per patient healed. Her hands glow — permanent luciferase residue under her skin. She holds a container to her ear. Listens. Nods. She claps once — two blue flashes illuminate the room. Every container pulses in response, a ripple of light like a wave. Then dark. 347 small ecosystems, each one alive.\n\nARRI Alexa 65, 25mm. Wide interior. No external light — bioluminescence only. Kodak 500T pushed two stops. Palette: black, blue-green glow, amber pulse, dark skin, bone-white eggshells. 4K, 21:9, photorealistic.",
    tags: ["bioluminescence", "insects", "nursery", "Mbaku"],
  },
  {
    title: "Le Frill a l'equinoxe",
    prompt: "Dawn. Tonalli plateau at 2,800m. The largest pyramid — eighty meters, 1,460 steps. At summit, the Frill of Bronze — twenty meters wide, angled east at 23.4 degrees. 150,000 people stand below in silence. The sun breaks the ridge, strikes the frill. The bronze ignites. The reflected beam descends, touches the stone marker. Dead center. The math is right. 150,000 breaths release — a low roar. Ixchel stumbles on the platform. Nobody sees.\n\nIMAX 65mm. Ultra-wide. Kodak Ektachrome 100D. Saturated. Palette: red volcanic stone, gold frill, brown skin, white dust-beam, blue sky. 4K, 21:9, photorealistic.",
    tags: ["pyramid", "equinox", "frill", "Tonalli"],
  },
  {
    title: "Le Pont de Drek",
    prompt: "Black. Total black. Two hands holding — dark skin against dark skin against total dark. Eighty meters of bridge in total dark. The rite: in the dark you cannot see face, clothes, caste — you feel a hand. The hand is enough or is not enough. His thumb moves across her knuckles. The only gesture when you cannot see. Distantly, a bone tap on a pillar. One tap. Nothing. All is well. She says his name. He says hers. In the dark, names are the only proof they exist.\n\nARRI Alexa 65, 35mm. Near-black. Infrared reveal — hands, bridge, two bodies. Kodak 500T pushed four stops. Maximum grain. Palette: black. Just black. And two hands. 4K, 16:9, photorealistic.",
    tags: ["love", "darkness", "bridge", "rite"],
  },
  {
    title: "Le sechoir a voiles de Koraleth",
    prompt: "Sunrise over Koraleth harbor. Bleached bone pillars — brachiosaur femurs vertical, twenty meters — with crossbeams holding dozens of prao sails drying. Each sail a different color: turquoise for amber guild, crimson for fishing fleet, saffron for temple ships, black for the Ratu's vessels. A laqueur walks the crossbeam barefoot, twenty meters up, painting the seventeenth coat. Below, three praos launch simultaneously. A skitter steals a fish head from a bucket.\n\nRED V-Raptor, 35mm. Wide. Dawn golden light through translucent sails. Kodak Ektachrome 100D. Saturated. Palette: turquoise, crimson, saffron, black sails, white bone, golden light, dark skin. 4K, 21:9, photorealistic.",
    tags: ["sails", "harbor", "colors", "Koraleth"],
  },
  {
    title: "Tano et Kri, la premiere nuit",
    prompt: "A pit. Three meters across. Two meters deep. Red earth walls scored with claw marks. Boy of nine against north wall, knees to chest. Young raptor against south wall — six months, brown-gold plumage, yellow glass-marble eyes. Between them: dried parasaurolophus meat, broken in two. They chew watching each other. In the raptor's brain: this one gives before it takes. The boy has just become the mother.\n\nARRI Alexa Mini, 32mm. Top-down through gap in boards. 1:1 square. Flat overcast light. Kodak 500T. Palette: red earth, brown-gold plumage, dark skin, grey light, dried meat. 4K, photorealistic.",
    tags: ["raptor", "bonding", "pit", "origin"],
  },
  {
    title: "Mbaku la nuit",
    prompt: "Aerial descending. Mangrove delta, 200m above. Black water, black canopy, black sky — then lights. Mbaku burns blue. 60,000 souls on three levels, bone-lanterns pulsing blue-green. Root-bridges between trunks. The Heart tree, eight hundred years old, Temple of the Dream in violet. Three Fantomes — albino pteranodons — glide through. A Guetteur taps. Below, the spinosaur moves. The dead in the root-tombs are under everyone's feet. The living walk on the dead and the dead hold the living up. This is not a metaphor. This is architecture.\n\nIMAX 65mm. Aerial descending. Night. Bioluminescent only. Kodak 500T pushed three stops. Heavy grain. Palette: black, blue-green, violet, white Fantomes, dark skin. 4K, 21:9, photorealistic.",
    tags: ["aerial", "bioluminescent", "city", "night"],
  },
  {
    title: "Grand-Mere Griffes tire a l'arc",
    prompt: "Open grassland. Parasaurolophus herd in middle distance. Dernier, old scarred raptor. On his back: Yara, sixty-seven, arthritis-twisted hands that resemble raptor claws. She holds a short recurve bow made from raptor-rib, drawn to her deformed right ear. She talks nonstop — about koumiss, young riders, weather. Dernier doesn't understand but a calm raptor is a steady raptor. She releases. Arrow crosses sixty meters. Clean kill behind the ear. \"Bon. Tu vois ? Le matin c'est mieux.\"\n\nRED V-Raptor, 135mm telephoto. Compression. Early morning, low horizontal light. Kodak 250D. Palette: golden grass, pale sky, brown raptor, dark weathered skin, bone-white bow. 4K, 21:9, photorealistic.",
    tags: ["archery", "raptor", "grassland", "hunt"],
  },
  {
    title: "Owe le premier Guetteur",
    prompt: "Lowest platform of Mbaku. Owe, nineteen, legs hanging, bare feet in black water. His sister Tchi fell three days ago. He holds a hollow pteranodon bone, taps the pillar. One tap. The water pushes sideways — the spinosaur's bow wave. He has felt it three times. The circuit is not random. It can be read. 1 tap: nothing. 2 taps: maybe. 3 taps: stay up. Around his ankle, a young mangrove root growing around his skin. The city holds him.\n\nARRI Alexa 65, 50mm. Low angle from water level. Blue-green lanterns above, black water below. Kodak 500T. Palette: black water, blue-green light, dark skin, white bone, grey platform wood. 4K, 16:9, photorealistic.",
    tags: ["guetteur", "spinosaur", "grief", "Mbaku"],
  },
  {
    title: "L'Aqueduc-Brachi au crepuscule",
    prompt: "Three thousand kilometers of aqueduct. At this point — twenty-two columns shaped like brachiosaur legs, fifteen meters high. Water channel on top carries snowmelt. Under the arches: repairmen's huts. Evening light turns limestone orange. The water becomes a ribbon of fire. A repairwoman sits in her doorway, legs dangling, eating millet cake. 2,000 parasaurolophus pass through the valley. Her son, four, imitates the call. Terrible at it. She does not correct him.\n\nIMAX 65mm. Ultra-wide. Golden hour. Kodak Ektachrome 100D. Palette: orange limestone, golden water-fire, green valley, brown-green herd, dark skin, thatch. 4K, 21:9, photorealistic.",
    tags: ["aqueduct", "brachiosaur", "golden-hour", "family"],
  },
  {
    title: "Le cimetiere-jardin",
    prompt: "A field of sixty Grenier-Oeufs — egg-shaped granaries, six meters high, filled with earth and planted. Flowers erupt from the tops, bees orbit everything. Each cylinder contains a body. A woman walks between the rows, pours water, speaks to each. At the twelfth — newer, bright red — she kneels. Her husband. Eight months. She places her palm flat against warm laterite. A bee lands on her hand, investigates, flies to a flower. Man feeds earth, earth feeds flower, flower feeds bee. The dead feed the living. This is not a metaphor. This is agriculture.\n\nARRI Alexa 65, 40mm. Medium-wide. Late afternoon. Kodak 250D. Palette: red-orange laterite, yellow and white flowers, deep red blooms, brown skin, bone-white sky. 4K, 21:9, photorealistic.",
    tags: ["cemetery", "garden", "grief", "cycle"],
  },
  {
    title: "Le Temple du Courant",
    prompt: "Central building of Volonia on bone-stilts over the harbor, shaped like a mosasaur. Interior columns are polished plesiosaur ribs, pale as milk. Floor: a shallow basin of salt water that never drains. Ratu Seri, sixty-one, barefoot in the basin, holds amber with a beetle frozen mid-wingbeat for forty million years. Gold light pours through the mosasaur-mouth window. Her feet are cold. They are always cold. Sixty-one years of cold feet. A skitter catches a crab. Crunch echoes. She almost laughs. Almost.\n\nRED V-Raptor, 25mm. Wide interior. Morning gold through mosasaur-mouth window. Kodak 500T. Palette: milk-white ribs, gold light, dark water, amber glow, dark skin. 4K, 21:9, photorealistic.",
    tags: ["temple", "amber", "mosasaur", "Volonia"],
  },
  {
    title: "Le marche flottant a l'aube",
    prompt: "Dawn at Volonia. Low tide. The Grand Ponton emerges — the size of a football field, underwater at high tide, marketplace for six hours. Fifty barges converge, awnings of prao-sail fabric. An amber merchant arranges pieces on black velvet in optimal morning light. Three barges away, a mosasaur-parasite fish slapped onto cutting board. A child runs across a bridge placed ten seconds ago. A plesiosaur surfaces in the harbor mouth — head four meters, one breath, sinks. Nobody reacts. Every morning.\n\nIMAX 65mm. Ultra-wide. Dawn golden light across wet surfaces. Kodak Ektachrome 100D. Palette: turquoise water, colored awnings, dark wood, white fish-flesh, gold light, dark skin. 4K, 21:9, photorealistic.",
    tags: ["market", "floating", "dawn", "trade"],
  },
  {
    title: "Le Seuil des tyrannosaures",
    prompt: "Two tyrannosaur skulls on brachiosaur-femur posts, five meters high, jaws open. Moss in one eye socket, copper-repaired jaw on the other. Twelve raptor-riders approach in single file, silhouetted against burning orange sunset. Lead rider reaches up, ties a strip of red-ochre raptor-hide to the left skull's teeth — among a hundred others, some fossilized. Each strip: we came. We fight. Behind the gate: fires, tents, chained tyrannosaurs, a Claqueur marking evening. Clac. Clac. Clac-clac-clac.\n\nRED V-Raptor, 50mm. Medium shot from inside camp. Sunset backlight through gate. Kodak 500T. Palette: yellowed bone, sunset gold, dark skin, amber raptor-plumage, red-ochre strips, green copper. 4K, 21:9, photorealistic.",
    tags: ["gate", "tyrannosaur-skulls", "riders", "sunset"],
  },
  {
    title: "La petite Mambo de Mbaku",
    prompt: "Pharmacie aerienne suspended in mangrove branches. Shelves of fern-rib hold three hundred eggshell containers. Lua, eleven, three dinosaur teeth in her hair. She holds eggshell 212 — root-fungus for joint pain. She smells the old man's infected wound, smells the fungus again. \"L'odeur de sa jambe ressemblait a l'odeur du champignon. Je me suis dit qu'ils devaient se connaitre.\" She applies it. Steady hands eleven-year-olds shouldn't have. Through the doorway: Mbaku glows blue-green. A Fantome glides past, stirring her hair. She doesn't turn.\n\nARRI Alexa Mini, 40mm. Interior. Amber lantern interior, blue-green exterior. Kodak 500T. Palette: amber interior, blue-green exterior, dark skin, white eggshell, red wound, green fungus. 4K, 16:9, photorealistic.",
    tags: ["healer", "pharmacie", "fungi", "Mbaku"],
  },
  {
    title: "Les pretresses de Quetz",
    prompt: "Quetz. 3,500 meters. Above the cloud sea. Five priestesses-astronomers on a perching platform — stone beams over white infinity. A quetzalcoatlus descends — ten-meter wingspan, crest catching first light like stained glass. Lands. Impact shakes the platform. They don't flinch. Wings fold — sound of sails striking. A priestess produces a dried fish. The beak takes it surgically. The quetzalcoatlus turns to watch the sun rise. The priestess writes a number on black stone. The sky writes the calendar. The priestesses copy.\n\nIMAX 65mm. Ultra-wide. Pre-dawn above clouds, pure gold. Kodak Ektachrome 100D. Palette: gold light, blue sky, white clouds, grey stone, dark skin, amber-red crest. 4K, 21:9, photorealistic.",
    tags: ["quetzalcoatlus", "clouds", "calendar", "astronomy"],
  },
  {
    title: "Le Comptoir de Songa",
    prompt: "The Comptoir de Songa. Half stone (red laterite), half root (living mangrove). Between: a Volonian bronze table. On the table: a newborn. Minutes old. The umbilical cord lies between ingots and a trade ledger — \"Lingot N4, prix: —\" never filled in because contractions started. Abla closed the sale at fifteen percent below market between contractions. A N'Goro healer from the root side, a Pangean midwife from the stone side. Three civilizations in one birth. Camera cranes up — the Comptoir shrinks. The cry follows up, thinning, never quite gone.\n\nARRI Alexa 65, 35mm. Medium interior. Mixed light: warm lantern stone-side, blue-green bio root-side. Kodak 500T. Palette: red laterite, green root, bronze table, dark skin, white cotton, blood. 4K, 16:9, photorealistic.",
    tags: ["birth", "trade", "three-civilizations", "bronze"],
  },
];

/* ═══════════════════════════════════════════════════════
   PROMPT QUALITY INDICATORS — Camera, Scene, Characters, Mood
   ═══════════════════════════════════════════════════════ */
interface PromptQuality {
  camera: { body: string; lens: string; format: string; film: string };
  scene: { faction: string; location: string; timeOfDay: string };
  characters: string[];
  mood: string[];
}

function extractPromptQuality(prompt: string): PromptQuality {
  // Camera extraction
  const cameraBodyMatch = prompt.match(/(?:ARRI Alexa (?:65|Mini)|RED (?:DRAGON 6K|V-Raptor)|IMAX 65mm)/i);
  const lensMatch = prompt.match(/(\d+mm(?:\s*f\/[\d.]+)?)/);
  const formatMatch = prompt.match(/(\d+:\d+)/g);
  const filmMatch = prompt.match(/Kodak\s+[\w\s]+\d+[A-Z]?/);

  // Scene context
  const factionPatterns = ["Mwamba", "Volonia", "Mbaku", "Tonalli", "Koraleth", "Quetz", "N'Goro", "Pangean"];
  const faction = factionPatterns.find((f) => prompt.includes(f)) || "";
  const timePatterns: Record<string, RegExp> = {
    Dawn: /\b(?:dawn|pre-dawn|sunrise|morning)\b/i,
    Dusk: /\b(?:dusk|sunset|evening|golden hour)\b/i,
    Night: /\b(?:night|dark|bioluminescen)/i,
    Day: /\b(?:overcast|daylight|noon|afternoon)\b/i,
  };
  let timeOfDay = "";
  for (const [label, re] of Object.entries(timePatterns)) {
    if (re.test(prompt)) { timeOfDay = label; break; }
  }

  // Characters
  const charPatterns = [
    "Kofi", "Nana", "Dara", "Itzal", "Yara", "Tano", "Kri", "Owe", "Tchi",
    "Lua", "Ixchel", "Abla", "Ratu Seri", "Le Peseur", "Dernier",
    "Mere des Lucioles", "Grand-Mere Griffes",
  ];
  const characters = charPatterns.filter((c) => prompt.includes(c));

  // Mood / atmosphere
  const moodPatterns: Record<string, RegExp> = {
    "Cinematic": /cinematic|IMAX|ultra-wide/i,
    "Intimate": /close|macro|interior|closet/i,
    "Epic": /wide|establishing|ultra-wide|thousand|aerial/i,
    "Dark": /dark|black|night|noir|near-black/i,
    "Warm": /warm|golden|amber|orange|sunrise/i,
    "Sacred": /temple|rite|ceremony|sacred|pyramid/i,
    "Violence": /kill|cleaver|blood|weapon|arrow/i,
    "Tenderness": /love|hand|touch|almost smiles|almost laughs/i,
    "Bioluminescent": /bioluminescen|glow|blue-green|lantern/i,
    "Grain": /grain|pushed.*stops/i,
  };
  const mood = Object.entries(moodPatterns)
    .filter(([, re]) => re.test(prompt))
    .map(([label]) => label);

  return {
    camera: {
      body: cameraBodyMatch?.[0] || "N/A",
      lens: lensMatch?.[1] || "N/A",
      format: formatMatch ? formatMatch[formatMatch.length - 1] : "N/A",
      film: filmMatch?.[0] || "N/A",
    },
    scene: { faction, location: faction, timeOfDay },
    characters,
    mood,
  };
}

const MOOD_COLORS: Record<string, string> = {
  Cinematic: "#00B4D8",
  Intimate: "#8B5CF6",
  Epic: "#F59E0B",
  Dark: "#6B7280",
  Warm: "#F97316",
  Sacred: "#A855F7",
  Violence: "#EF4444",
  Tenderness: "#EC4899",
  Bioluminescent: "#06B6D4",
  Grain: "#78716C",
};

const WITH_STYLE_CODE = `function withByssStyle(prompt, shotType = 'food', aspectRatio = '16:9') {
  return \`\${BYSS_CONTEXT}\\n\\n\${prompt}\\n\\n\${CAMERA_BASE}\\n\${DIRECTION[shotType]}\\n\${REALISM_GUARD}\\nAspect ratio: \${aspectRatio}.\`;
}`;

type JobStatus = "prompt_copied" | "generating" | "generated" | "approved" | "rejected";

interface PipelineJob {
  id: string;
  vertical: ImageVertical;
  shotType: ImageShotType;
  prompt: string;
  status: JobStatus;
  resultUrl: string;
  createdAt: string;
}

const STORAGE_KEY = "byss-image-jobs";

const STATUS_CONFIG: Record<JobStatus, { label: string; bg: string; color: string }> = {
  prompt_copied: { label: "Prompt copi\u00E9", bg: "#F59E0B15", color: "#F59E0B" },
  generating: { label: "En cours", bg: "#00D4FF15", color: "#00D4FF" },
  generated: { label: "G\u00E9n\u00E9r\u00E9", bg: "#8B5CF615", color: "#8B5CF6" },
  approved: { label: "Approuv\u00E9", bg: "#10B98115", color: "#10B981" },
  rejected: { label: "Rejet\u00E9", bg: "#EF444415", color: "#EF4444" },
};

function loadJobs(): PipelineJob[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveJobs(jobs: PipelineJob[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs));
}

export default function ImagesPage() {
  const { toast } = useToast();
  const [selectedVertical, setSelectedVertical] = useState<ImageVertical>("restaurant");
  const [selectedShot, setSelectedShot] = useState<ImageShotType>("hero");
  const [customSubject, setCustomSubject] = useState("");
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [jobs, setJobs] = useState<PipelineJob[]>([]);
  const [launchLoading, setLaunchLoading] = useState(false);
  const [launchSuccess, setLaunchSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [jwOpen, setJwOpen] = useState(false);
  const [copiedJwIdx, setCopiedJwIdx] = useState<number | null>(null);
  const [kpiTotal, setKpiTotal] = useState<number | null>(null);
  const [kpiApproved, setKpiApproved] = useState<number | null>(null);

  // Load jobs from localStorage on mount + fetch KPIs from Supabase
  useEffect(() => {
    setJobs(loadJobs());
    setMounted(true);
    // Fetch image_jobs KPIs from Supabase
    const supabase = createClient();
    supabase.from("image_jobs").select("id, status", { count: "exact" }).then(({ count, data, error }) => {
      if (error) return;
      setKpiTotal(count ?? data?.length ?? 0);
      setKpiApproved(data?.filter((d: { status: string }) => d.status === "approved").length ?? 0);
    });
  }, []);

  // Persist jobs whenever they change (after initial mount)
  const updateJobs = useCallback((updater: PipelineJob[] | ((prev: PipelineJob[]) => PipelineJob[])) => {
    setJobs((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      saveJobs(next);
      return next;
    });
  }, []);

  const verticalConfig = IMAGE_VERTICALS[selectedVertical];

  const generatePrompt = () => {
    const camera = STYLE_LAYERS.camera_base;
    const realism = STYLE_LAYERS.realism_guard;
    const direction = STYLE_LAYERS.direction[selectedShot] || "";
    const subject = customSubject || `${selectedVertical} ${selectedShot}`;

    const fullPrompt = `${subject}. ${direction}. ${camera}. ${realism}.`;
    setGeneratedPrompt(fullPrompt);
  };

  const handleLaunchGeneration = async () => {
    if (!generatedPrompt || launchLoading) return;
    setLaunchLoading(true);

    // Add job to queue immediately with generating status
    const jobId = `img_${Date.now()}`;
    const job: PipelineJob = {
      id: jobId,
      vertical: selectedVertical,
      shotType: selectedShot,
      prompt: generatedPrompt,
      status: "generating",
      resultUrl: "",
      createdAt: new Date().toISOString(),
    };
    updateJobs((prev) => [job, ...prev]);

    try {
      // Call Replicate API to generate image
      const res = await fetch("/api/replicate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "generate-image",
          model: "flux-2-pro",
          prompt: generatedPrompt,
          width: 1024,
          height: 1024,
          numOutputs: 1,
        }),
      });

      const prediction = await res.json();

      if (prediction.error) {
        updateJobStatus(jobId, "rejected");
        toast("Erreur generation: " + (prediction.error || "Replicate error"), "error");
        setLaunchLoading(false);
        return;
      }

      // Poll for result
      const predictionId = prediction.id;
      if (predictionId) {
        const pollInterval = setInterval(async () => {
          try {
            const statusRes = await fetch("/api/replicate", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ action: "status", predictionId }),
            });
            const statusData = await statusRes.json();

            if (statusData.status === "succeeded") {
              clearInterval(pollInterval);
              const outputUrl = Array.isArray(statusData.output)
                ? statusData.output[0]
                : statusData.output;
              if (outputUrl) updateJobUrl(jobId, outputUrl);
              updateJobStatus(jobId, "generated");
              toast("Image generee avec succes", "success");
              setLaunchLoading(false);
            } else if (statusData.status === "failed" || statusData.status === "canceled") {
              clearInterval(pollInterval);
              updateJobStatus(jobId, "rejected");
              toast("Generation echouee", "error");
              setLaunchLoading(false);
            }
          } catch (pollErr) {
            clearInterval(pollInterval);
            updateJobStatus(jobId, "rejected");
            toast("Erreur polling: " + (pollErr instanceof Error ? pollErr.message : "Erreur reseau"), "error");
            setLaunchLoading(false);
          }
        }, 3000);

        // Safety timeout: stop polling after 5 minutes
        setTimeout(() => {
          clearInterval(pollInterval);
          setLaunchLoading(false);
        }, 300_000);
      } else {
        // No prediction ID — immediate result or error
        updateJobStatus(jobId, "rejected");
        setLaunchLoading(false);
      }

      setLaunchSuccess(true);
      toast("Generation lancee via Replicate", "success");
      setTimeout(() => setLaunchSuccess(false), 2500);
    } catch (err) {
      updateJobStatus(jobId, "rejected");
      toast("Erreur lancement: " + (err instanceof Error ? err.message : "Erreur reseau"), "error");
      setLaunchLoading(false);
    }
  };

  const updateJobStatus = (id: string, status: JobStatus) => {
    updateJobs((prev) => prev.map((j) => (j.id === id ? { ...j, status } : j)));
  };

  const updateJobUrl = (id: string, resultUrl: string) => {
    updateJobs((prev) => prev.map((j) => (j.id === id ? { ...j, resultUrl } : j)));
  };

  const deleteJob = (id: string) => {
    if (!window.confirm("Supprimer ce job ?")) return;
    updateJobs((prev) => prev.filter((j) => j.id !== id));
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-clash-display)] text-3xl font-bold text-[var(--color-text)]">
            Image <span className="text-[var(--color-gold)]">Pipeline</span>
          </h1>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">
            3 couches style — ~$0.02/image via Nano Banana Pro — Marge 99%+
          </p>
        </div>
        <div className="flex items-center gap-3">
          {kpiTotal !== null && (
            <div className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-3 py-1.5">
              <span className="text-[10px] font-bold text-emerald-400">{kpiApproved}/{kpiTotal} approuvees (Supabase)</span>
            </div>
          )}
          {mounted && jobs.length > 0 && (
            <div className="flex items-center gap-2 rounded-full border border-[var(--color-gold-muted)] bg-[var(--color-gold-glow)] px-4 py-1.5">
              <ImageIcon className="h-3.5 w-3.5 text-[var(--color-gold)]" />
              <span className="text-xs font-bold text-[var(--color-gold)]">{jobs.length} job{jobs.length > 1 ? "s" : ""}</span>
            </div>
          )}
        </div>
      </div>

      {/* Style System Explainer */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "CAMERA_BASE", desc: "Sony A7IV, 50mm f/1.4, naturel", color: "#3B82F6" },
          { label: "REALISM_GUARD", desc: "Photor\u00E9aliste, pas d'art\u00E9facts IA", color: "#10B981" },
          { label: "DIRECTION", desc: "Style par type de plan", color: "#00B4D8" },
        ].map((layer) => (
          <div
            key={layer.label}
            className="rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-3"
          >
            <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: layer.color }}>
              {layer.label}
            </span>
            <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">{layer.desc}</p>
          </div>
        ))}
      </div>

      {/* Vertical Selection */}
      <div>
        <h2 className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
          <Layers className="mr-1.5 inline h-3 w-3" />
          Vertical
        </h2>
        <div className="flex flex-wrap gap-2">
          {(Object.entries(IMAGE_VERTICALS) as [ImageVertical, typeof IMAGE_VERTICALS[ImageVertical]][]).map(([key, config]) => {
            const Icon = VERTICAL_ICONS[key];
            const isSelected = selectedVertical === key;
            return (
              <button
                key={key}
                onClick={() => { setSelectedVertical(key); setSelectedShot(config.shots[0] as ImageShotType); }}
                className={cn(
                  "flex items-center gap-2 rounded-lg border px-4 py-2 text-xs font-medium transition-all",
                  isSelected
                    ? "border-[var(--color-gold)] bg-[var(--color-gold-glow)] text-[var(--color-gold)]"
                    : "border-[var(--color-border-subtle)] text-[var(--color-text-muted)] hover:border-[var(--color-gold-muted)]"
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {config.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Shot Type Selection */}
      <div>
        <h2 className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
          <ImageIcon className="mr-1.5 inline h-3 w-3" />
          Type de plan
        </h2>
        <div className="flex flex-wrap gap-2">
          {verticalConfig.shots.map((shot) => {
            const isSelected = selectedShot === shot;
            return (
              <button
                key={shot}
                onClick={() => setSelectedShot(shot as ImageShotType)}
                className={cn(
                  "rounded-lg border px-3 py-1.5 text-xs font-medium capitalize transition-all",
                  isSelected
                    ? "border-[var(--color-cyan)] bg-[#00D4FF15] text-[var(--color-cyan)]"
                    : "border-[var(--color-border-subtle)] text-[var(--color-text-muted)] hover:border-[var(--color-cyan)]/50"
                )}
              >
                {shot}
              </button>
            );
          })}
        </div>
      </div>

      {/* Subject Input + Generate */}
      <div className="flex gap-3">
        <input
          type="text"
          value={customSubject}
          onChange={(e) => setCustomSubject(e.target.value)}
          placeholder={`Sujet (ex: "cuisine ouverte du Chef Tatiana, mosaique bleue, flamme wok")`}
          className="flex-1 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-gold)] focus:outline-none"
        />
        <button
          onClick={generatePrompt}
          className="flex items-center gap-2 rounded-xl bg-[var(--color-gold)] px-6 py-3 text-sm font-bold text-black transition-all hover:shadow-lg hover:shadow-[var(--color-gold-glow)]"
        >
          <Sparkles className="h-4 w-4" />
          Generer Prompt
        </button>
      </div>

      {/* Generated Prompt */}
      {generatedPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-[var(--color-gold-muted)] bg-[var(--color-surface)] p-5"
        >
          <div className="mb-2 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[var(--color-gold)]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-gold)]">
              Prompt 3 couches
            </span>
          </div>
          <p className="font-mono text-xs leading-relaxed text-[var(--color-text-muted)]">
            {generatedPrompt}
          </p>
          <div className="mt-3 flex gap-2">
            <button
              onClick={() => { navigator.clipboard.writeText(generatedPrompt); toast("Prompt copie", "success"); }}
              className="rounded-lg border border-[var(--color-border-subtle)] px-3 py-1.5 text-[10px] font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
            >
              Copier
            </button>
            <button
              onClick={handleLaunchGeneration}
              disabled={launchLoading}
              className={cn(
                "rounded-lg px-3 py-1.5 text-[10px] font-medium transition-all",
                launchSuccess
                  ? "bg-[oklch(0.72_0.19_155/0.15)] text-[var(--color-green)]"
                  : "bg-[#00D4FF15] text-[var(--color-cyan)] hover:bg-[#00D4FF25]",
                launchLoading && "cursor-not-allowed opacity-60"
              )}
            >
              {launchLoading && !launchSuccess ? (
                <Loader2 className="mr-1 inline h-3 w-3 animate-spin" />
              ) : launchSuccess ? (
                <ClipboardCheck className="mr-1 inline h-3 w-3" />
              ) : (
                <Play className="mr-1 inline h-3 w-3" />
              )}
              {launchLoading && !launchSuccess ? "Generation en cours..." : launchSuccess ? "Generation lancee" : "Lancer generation"}
            </button>
          </div>
        </motion.div>
      )}

      {/* Job Queue / History */}
      {mounted && jobs.length > 0 && (
        <div>
          <h2 className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
            Historique ({jobs.length} job{jobs.length > 1 ? "s" : ""})
          </h2>
          <div className="space-y-3">
            {jobs.map((job) => {
              const statusCfg = STATUS_CONFIG[job.status];
              return (
                <div
                  key={job.id}
                  className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-4"
                >
                  {/* Top row: meta + status + delete */}
                  <div className="flex items-center gap-3">
                    {job.status === "prompt_copied" && <AlertCircle className="h-4 w-4 shrink-0 text-amber-400" />}
                    {job.status === "generating" && <Sparkles className="h-4 w-4 shrink-0 animate-spin text-[var(--color-cyan)]" />}
                    {job.status === "generated" && <CheckCircle2 className="h-4 w-4 shrink-0 text-purple-400" />}
                    {job.status === "approved" && <Check className="h-4 w-4 shrink-0 text-emerald-400" />}
                    {job.status === "rejected" && <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />}

                    <span className="flex-1 truncate font-mono text-xs text-[var(--color-text-muted)]">
                      {job.vertical}/{job.shotType}
                    </span>

                    <span className="text-[9px] text-[var(--color-text-muted)]">
                      {new Date(job.createdAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                    </span>

                    <span
                      className="rounded-full px-2 py-0.5 text-[9px] font-bold uppercase"
                      style={{ backgroundColor: statusCfg.bg, color: statusCfg.color }}
                    >
                      {statusCfg.label}
                    </span>
                  </div>

                  {/* Prompt excerpt */}
                  <p className="mt-2 line-clamp-2 font-mono text-[10px] leading-relaxed text-[var(--color-text-muted)]">
                    {job.prompt}
                  </p>

                  {/* URL input */}
                  <div className="mt-3 flex items-center gap-2">
                    <Link className="h-3 w-3 shrink-0 text-[var(--color-text-muted)]" />
                    <input
                      type="url"
                      value={job.resultUrl}
                      onChange={(e) => updateJobUrl(job.id, e.target.value)}
                      placeholder="Coller l'URL r\u00E9sultat (Replicate / Midjourney)..."
                      className="flex-1 rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-bg)] px-3 py-1.5 text-[10px] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)]/50 focus:border-[var(--color-gold)] focus:outline-none"
                    />
                  </div>

                  {/* Action buttons */}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {job.status === "prompt_copied" && (
                      <button
                        onClick={() => updateJobStatus(job.id, "generated")}
                        className="flex items-center gap-1 rounded-lg bg-[#8B5CF615] px-3 py-1 text-[10px] font-medium text-purple-400 transition-all hover:bg-[#8B5CF625]"
                      >
                        <CheckCircle2 className="h-3 w-3" />
                        Marquer comme g\u00E9n\u00E9r\u00E9
                      </button>
                    )}
                    {(job.status === "prompt_copied" || job.status === "generated") && (
                      <button
                        onClick={() => updateJobStatus(job.id, "approved")}
                        className="flex items-center gap-1 rounded-lg bg-[#10B98115] px-3 py-1 text-[10px] font-medium text-emerald-400 transition-all hover:bg-[#10B98125]"
                      >
                        <Check className="h-3 w-3" />
                        Marquer comme approuv\u00E9
                      </button>
                    )}
                    <button
                      onClick={() => deleteJob(job.id)}
                      className="flex items-center gap-1 rounded-lg bg-[#EF444410] px-3 py-1 text-[10px] font-medium text-red-400 transition-all hover:bg-[#EF444420]"
                    >
                      <Trash2 className="h-3 w-3" />
                      Supprimer
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════
          PIPELINE FORK GUIDE — withStyle() + 5 Verticals
          ══════════════════════════════════════════════════════════ */}

      {/* withStyle() system */}
      <div className="rounded-xl border border-[var(--color-gold-muted)] bg-[var(--color-surface)] p-6">
        <div className="mb-3 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-[var(--color-gold)]" />
          <h2 className="text-sm font-bold text-[var(--color-gold)]">
            withByssStyle() &mdash; Style System 3 couches
          </h2>
        </div>
        <p className="mb-3 text-xs text-[var(--color-text-muted)]">
          Fork du Cadifor assets-pipeline. 3 couches &times; N templates &times; M sujets = contenu visuellement coherent mais varie a l&apos;infini. Cout par client : ~$5-10 d&apos;API pour 20-30 images cinematiques. Prix facture : 750-3000&euro;.
        </p>
        <pre className="overflow-x-auto rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-bg)] p-4 font-mono text-[10px] leading-relaxed text-[var(--color-text-muted)]">
          {WITH_STYLE_CODE}
        </pre>
        <div className="mt-3 grid grid-cols-3 gap-2">
          <div className="rounded-lg bg-[#3B82F610] p-2 text-center">
            <p className="text-[9px] font-bold text-[#3B82F6]">CAMERA_BASE</p>
            <p className="text-[8px] text-[var(--color-text-muted)]">RED DRAGON 6K, Cooke S7/i, ACES pipeline</p>
          </div>
          <div className="rounded-lg bg-[#10B98110] p-2 text-center">
            <p className="text-[9px] font-bold text-[#10B981]">REALISM_GUARD</p>
            <p className="text-[8px] text-[var(--color-text-muted)]">Pores visibles, pas de glow IA, pas d&apos;uncanny valley</p>
          </div>
          <div className="rounded-lg bg-[#00B4D810] p-2 text-center">
            <p className="text-[9px] font-bold text-[#00B4D8]">DIRECTION[shotType]</p>
            <p className="text-[8px] text-[var(--color-text-muted)]">food, spirit, hospitality, marine, portrait, mobile</p>
          </div>
        </div>
      </div>

      {/* 5 Verticals with phase system */}
      <div>
        <h2 className="mb-4 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
          <Layers className="mr-1.5 inline h-3 w-3" />
          5 Verticales &mdash; Phases de generation
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Object.entries(VERTICAL_PHASE_MAP).map(([key, v]) => {
            const Icon = v.icon;
            return (
              <div
                key={key}
                className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-4"
              >
                <div className="mb-3 flex items-center gap-2">
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-lg"
                    style={{ backgroundColor: `${v.color}15`, color: v.color }}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-bold" style={{ color: v.color }}>
                    {v.label}
                  </span>
                </div>
                <div className="space-y-1.5">
                  {v.phases.map((phase, i) => (
                    <div key={i} className="flex items-center gap-2 rounded-md bg-[var(--color-bg)] px-2.5 py-1.5">
                      <span
                        className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[8px] font-bold"
                        style={{ backgroundColor: `${v.color}20`, color: v.color }}
                      >
                        {i}
                      </span>
                      <span className="text-[10px] text-[var(--color-text-muted)]">{phase}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Deployment note */}
      <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-5">
        <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-gold)]">
          Deploiement immediat
        </p>
        <p className="mt-2 text-xs leading-relaxed text-[var(--color-text-muted)]">
          1. Fork assets-pipeline/ &rarr; byss-image-pipeline/ &nbsp;&bull;&nbsp; 2. Adapter prompts.ts : 5 verticales &nbsp;&bull;&nbsp; 3. Generer le pack MIZA (10 images) &nbsp;&bull;&nbsp; 4. Arriver au RDV avec les images sur tablette &mdash; pas un pitch, une preuve.
        </p>
        <div className="mt-3 grid grid-cols-3 gap-3">
          <div className="rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-bg)] p-2 text-center">
            <p className="font-mono text-sm font-bold text-[var(--color-gold)]">~$1-2</p>
            <p className="text-[8px] text-[var(--color-text-muted)]">Cout total 10 images</p>
          </div>
          <div className="rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-bg)] p-2 text-center">
            <p className="font-mono text-sm font-bold text-[var(--color-gold)]">~30 min</p>
            <p className="text-[8px] text-[var(--color-text-muted)]">Temps generation</p>
          </div>
          <div className="rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-bg)] p-2 text-center">
            <p className="font-mono text-sm font-bold text-[var(--color-gold)]">99%+</p>
            <p className="text-[8px] text-[var(--color-text-muted)]">Marge nette</p>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          PROMPTS JW SOTA — 20 Image Prompts par Nayou
          ══════════════════════════════════════════════════════════ */}
      <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)]">
        <button
          onClick={() => setJwOpen(!jwOpen)}
          className="flex w-full items-center justify-between p-5"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#8B5CF615]">
              <Clapperboard className="h-4 w-4 text-purple-400" />
            </div>
            <div className="text-left">
              <h2 className="text-sm font-bold text-[var(--color-text)]">
                Prompts JW <span className="text-purple-400">SOTA</span> par Nayou
              </h2>
              <p className="text-[10px] text-[var(--color-text-muted)]">
                20 prompts image cin&eacute;matiques &mdash; M&eacute;thode Kael &mdash; Jurassic Wars
              </p>
            </div>
          </div>
          <ChevronDown
            className={cn(
              "h-4 w-4 text-[var(--color-text-muted)] transition-transform",
              jwOpen && "rotate-180"
            )}
          />
        </button>

        {jwOpen && (
          <div className="space-y-3 border-t border-[var(--color-border-subtle)] p-5">
            {JW_PROMPTS_NAYOU.map((prompt, idx) => {
              const quality = extractPromptQuality(prompt.prompt);
              return (
                <div
                  key={idx}
                  className="rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-bg)] p-4"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className="flex h-5 w-5 items-center justify-center rounded-full bg-[#8B5CF620] text-[9px] font-bold text-purple-400"
                      >
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <span className="text-xs font-bold text-[var(--color-text)]">
                        {prompt.title}
                      </span>
                    </div>
                    <button
                      onClick={async () => {
                        await navigator.clipboard.writeText(prompt.prompt);
                        setCopiedJwIdx(idx);
                        toast("Prompt JW copie", "success");
                        setTimeout(() => setCopiedJwIdx(null), 2000);
                      }}
                      className={cn(
                        "flex items-center gap-1 rounded-lg px-2.5 py-1 text-[10px] font-medium transition-all",
                        copiedJwIdx === idx
                          ? "bg-[oklch(0.72_0.19_155/0.15)] text-[var(--color-green)]"
                          : "bg-[#8B5CF610] text-purple-400 hover:bg-[#8B5CF620]"
                      )}
                    >
                      {copiedJwIdx === idx ? (
                        <><ClipboardCheck className="h-3 w-3" /> Copie</>
                      ) : (
                        <><Copy className="h-3 w-3" /> Copier</>
                      )}
                    </button>
                  </div>

                  {/* ── Quality Indicators ── */}
                  <div className="mb-3 grid grid-cols-4 gap-2">
                    {/* Camera Specs */}
                    <div className="rounded-md border border-cyan-500/15 bg-cyan-500/5 p-2">
                      <div className="mb-1 flex items-center gap-1">
                        <Camera className="h-2.5 w-2.5 text-cyan-400" />
                        <span className="text-[8px] font-bold uppercase tracking-wider text-cyan-400">Camera</span>
                      </div>
                      <p className="text-[9px] font-medium text-[var(--color-text)]">{quality.camera.body}</p>
                      <p className="text-[8px] text-[var(--color-text-muted)]">{quality.camera.lens} &bull; {quality.camera.film}</p>
                      <p className="font-[family-name:var(--font-mono)] text-[8px] text-cyan-400">{quality.camera.format}</p>
                    </div>

                    {/* Scene Context */}
                    <div className="rounded-md border border-amber-500/15 bg-amber-500/5 p-2">
                      <div className="mb-1 flex items-center gap-1">
                        <MapPin className="h-2.5 w-2.5 text-amber-400" />
                        <span className="text-[8px] font-bold uppercase tracking-wider text-amber-400">Scene</span>
                      </div>
                      <p className="text-[9px] font-medium text-[var(--color-text)]">{quality.scene.faction || "Generic"}</p>
                      <p className="text-[8px] text-[var(--color-text-muted)]">{quality.scene.timeOfDay || "Unspecified"}</p>
                    </div>

                    {/* Characters */}
                    <div className="rounded-md border border-purple-500/15 bg-purple-500/5 p-2">
                      <div className="mb-1 flex items-center gap-1">
                        <Users className="h-2.5 w-2.5 text-purple-400" />
                        <span className="text-[8px] font-bold uppercase tracking-wider text-purple-400">Characters</span>
                      </div>
                      {quality.characters.length > 0 ? (
                        <div className="flex flex-wrap gap-0.5">
                          {quality.characters.map((c) => (
                            <span key={c} className="rounded bg-purple-500/10 px-1 py-0.5 text-[8px] font-medium text-purple-300">{c}</span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-[8px] text-[var(--color-text-muted)]">Unnamed/environmental</p>
                      )}
                    </div>

                    {/* Mood / Atmosphere */}
                    <div className="rounded-md border border-emerald-500/15 bg-emerald-500/5 p-2">
                      <div className="mb-1 flex items-center gap-1">
                        <CloudSun className="h-2.5 w-2.5 text-emerald-400" />
                        <span className="text-[8px] font-bold uppercase tracking-wider text-emerald-400">Mood</span>
                      </div>
                      <div className="flex flex-wrap gap-0.5">
                        {quality.mood.slice(0, 4).map((m) => (
                          <span
                            key={m}
                            className="rounded px-1 py-0.5 text-[7px] font-bold"
                            style={{ backgroundColor: `${MOOD_COLORS[m] || "#6B7280"}15`, color: MOOD_COLORS[m] || "#6B7280" }}
                          >
                            {m}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <p className="font-mono text-[10px] leading-relaxed text-[var(--color-text-muted)]">
                    {prompt.prompt}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {prompt.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-[#8B5CF610] px-2 py-0.5 text-[8px] font-medium text-purple-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
