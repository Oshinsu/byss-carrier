"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Video, Clock, CheckCircle2, Circle, Loader2, ChevronDown, Copy, Check, Camera, Film } from "lucide-react";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/ui/page-header";

const LS_KEY = "cesaire-pixar-sequences-status";

const STATUS_CYCLE = ["pending", "in_progress", "done"] as const;
type Status = (typeof STATUS_CYCLE)[number];

interface Sequence {
  id: number;
  title: string;
  subtitle: string;
  duration: string;
  status: Status;
  desc: string;
  nbpPrompt: string;
  klingSequence: string;
}

const INITIAL_SEQUENCES: Sequence[] = [
  {
    id: 1,
    title: "La grand-mere qui lit (1919, Basse-Pointe)",
    subtitle: "Mamie Nini du Lorrain apprend a lire au petit Aime, 6 ans",
    duration: "0:15",
    status: "done",
    desc: "Style Pixar 3D. Un petit garcon de 6 ans aux yeux immenses sur les genoux de sa grand-mere. La magie de la lecture. Une luciole pres de son oreille.",
    nbpPrompt: `Pixar 3D animation style, warm and emotional.

A tiny Black boy, age 6, with large expressive brown eyes,
round face, close-cropped hair, wearing a simple white cotton shirt
too big for him, sleeves rolled up past his wrists,
sits on the lap of his grandmother on the porch of a wooden Creole house.

The grandmother (Mamie Nini) is an elderly Black woman
with deep wrinkles that tell stories, silver hair in a bun,
round spectacles on her nose, wearing a faded blue cotton dress.
She holds an open book with large letters visible on the yellowed pages.
Her finger points at a word. The boy's eyes are HUGE with wonder —
his mouth slightly open, discovering the magic of reading.

Around them: the wooden porch of a case creole painted in peeling pastel green,
a rocking chair (dodine) nearby, potted ferns,
and in the background, the sugarcane fields of Basse-Pointe
stretching to the distant silhouette of Montagne Pelee.
A single firefly glows near the boy's ear — the spark of knowledge.

Late afternoon golden light raking horizontally across the porch.
Warm amber tones. Subsurface scattering on the boy's ears (light passing through).
Pixar-quality rendering: soft skin shaders, cloth simulation on the dress,
individual hair strands on the grandmother, dust motes in the golden light.
Bokeh from the sugarcane field behind.

Composition: the two figures fill the center, the book is the brightest object,
the Pelee is a soft shadow in the upper-right background.
4K, 16:9, Pixar 3D animation, photorealistic rendering.`,
    klingSequence: `Shot 1 (0-5s): Close-up of an old woman's wrinkled hands holding an open book with large letters on yellowed pages. Her finger slowly traces a word across the page. Pixar 3D animation, warm golden light. Camera: macro on the hands and book, shallow depth of field. Audio: a gentle creole lullaby hummed softly, the page rustling.

Shot 2 (5-10s): Medium shot revealing the scene. The grandmother (Mamie Nini) with silver hair, round spectacles, faded blue dress. On her lap: tiny Aime, age 6, in a white shirt too big for him. His eyes are ENORMOUS with wonder, mouth open. He points at a letter. She smiles — the deepest, warmest smile. Camera: slow push-in toward both faces, the book between them. Audio: the boy whispers "Ma-man..." attempting the word. She laughs softly.

Shot 3 (10-15s): Wide shot of the porch of a pastel green case creole. The two figures are silhouetted against the golden sunset. Behind them: sugarcane fields stretching to the Montagne Pelee. A single firefly appears near the boy's head. Then another. Then many. The fireflies are the words he is learning — light emerging from darkness. Camera: slow pull-back revealing the scale of the landscape. Audio: the lullaby continues, firefly sounds (tiny chimes), tropical evening chorus.

Style: Pixar 3D animation, photorealistic rendering. Warm amber palette, soft skin shaders, cloth simulation. 4K, 16:9.`,
  },
  {
    id: 2,
    title: "Le boursier (1924, Fort-de-France)",
    subtitle: "Le jeune Aime entre au Lycee Schoelcher, cartable a la main",
    duration: "0:15",
    status: "done",
    desc: "Style Pixar. Un garcon de 11 ans en uniforme blanc, sandales trop grandes, cartable use contre la poitrine. Il leve le menton — pas effraye, PRET.",
    nbpPrompt: `Pixar 3D animation style, hopeful and luminous.

A 11-year-old Black boy in a crisp white school uniform and khaki shorts,
wearing leather sandals slightly too big, carrying a worn leather satchel
(cartable) clutched against his chest with both arms,
stands at the bottom of the grand stone staircase
of the Lycee Schoelcher in Fort-de-France.

The building towers above him — imposing colonial architecture,
tall shuttered windows, a clock tower, palm trees flanking the entrance.
The boy looks UP at the building with an expression
that mixes intimidation and determination.
His chin is slightly raised — not scared, READY.

Other students stream past him on the stairs —
some taller, some lighter-skinned, some in better clothes.
He is the smallest figure in the frame, but the most vivid —
his white shirt is the brightest element against the ochre stone.

Morning light, low sun from camera-left creating long shadows
on the staircase. The building catches warm light on its upper floors
while the lower entrance is still in cool shadow.
A single bright red flamboyant flower has fallen on the step near his foot.

Pixar quality: expressive character animation pose, detailed fabric folds,
weathered stone textures, tropical foliage with individual leaf rendering.
The satchel has visible scratches and a homemade repair stitch.

Wide shot, boy at the bottom-center, the building filling the upper two-thirds.
The composition makes him small but inevitable — the stairs LEAD to him.
4K, 16:9, Pixar 3D animation.`,
    klingSequence: `Shot 1 (0-5s): Low angle shot of the grand stone staircase of Lycee Schoelcher. The building is enormous, imposing — colonial columns, shuttered windows, a clock tower. Students stream up the stairs, all taller than our hero. Camera: crane up the building facade from ground to clock tower. Audio: school bell ringing, children's voices, footsteps on stone.

Shot 2 (5-10s): Medium shot of tiny Aime (11) at the bottom of the stairs. Crisp white uniform, khaki shorts, leather sandals too big. He clutches a worn leather satchel against his chest with both arms. He takes a deep breath. Squares his shoulders. Lifts his chin. Camera: eye-level, static, the crowd parting around him. Audio: all background noise softens. His heartbeat becomes audible. Thump. Thump.

Shot 3 (10-15s): Tracking shot following him as he climbs the first steps. Each step is huge for his small legs. He looks straight ahead, not down. A red flamboyant petal falls and lands on his shoulder. He doesn't notice. He reaches the top step and the door opens to brilliant light. Camera: tracking behind him, rising with him up the stairs. Audio: the heartbeat transitions into a hopeful orchestral swell. His foot crosses the threshold.

Style: Pixar 3D animation. Hopeful, luminous. Detailed stone textures, tropical foliage, cloth physics on uniform. 4K, 16:9.`,
  },
  {
    id: 3,
    title: "La rencontre (1931, Paris)",
    subtitle: "Aime rencontre Senghor dans les couloirs de Louis-le-Grand",
    duration: "0:15",
    status: "done",
    desc: "Style Pixar. Un couloir froid et gris. Deux jeunes hommes noirs se retrouvent. L'etreinte. Ils sont les seules couleurs chaudes dans un monde froid.",
    nbpPrompt: `Pixar 3D animation style, warm friendship, historical.

A narrow hallway in the Lycee Louis-le-Grand, Paris.
Stone floor, high vaulted ceiling, gas-style wall lamps.
Grey Parisian light filters through tall windows at the end of the corridor.

Two young Black men face each other in the hallway, mid-encounter.
AIME (18): shorter, thin, wearing an ill-fitting grey boarding school blouse
with a rope belt and an empty inkwell dangling from the cord
(a dandy detail of the era). Round face, large curious eyes, slight smile.

SENGHOR (25): taller, more mature, wearing the same grey blouse but with more ease.
Broader shoulders, calm warm expression, arms opening wide for an embrace.
He has already said "Eh bien, bizut, tu seras mon bizut."

The moment is the EMBRACE — Senghor's arms wrapping around the smaller Aime,
who looks surprised and delighted. Their school blouses contrast
against the cold grey stone of the Parisian corridor.
They are the only warm colors in a cold world.

Other French students pass in the background, blurred and grey,
not noticing the moment that will change French literature forever.

Cool blue-grey Parisian light from the windows.
Warm amber glow on the two figures (an emotional light that shouldn't exist
but feels right — the Pixar cheat of lighting the emotion, not the room).
Visible breath in the cold corridor air.

Pixar quality: expressive facial micro-expressions, fabric simulation,
stone textures, the empty inkwell swinging slightly from the embrace.
Medium shot, the two figures at center, the cold corridor receding behind them.
4K, 16:9, Pixar 3D animation.`,
    klingSequence: `Shot 1 (0-5s): A cold grey hallway in Lycee Louis-le-Grand, Paris. Stone floors, vaulted ceiling, gas-style lamps. Grey Parisian light. Young Aime (18), thin, in an ill-fitting grey boarding school blouse, walks nervously down the corridor. Empty inkwell dangling from his belt cord. Camera: tracking forward with him, the corridor receding. Audio: echoing footsteps on stone, distant French voices, cold silence.

Shot 2 (5-10s): From the opposite end of the corridor, a taller figure approaches. Senghor (25), same grey blouse but worn with more ease. Warm, open face. He spots Aime. His eyes light up. He calls out. Aime looks up. Camera: shot-reverse-shot, alternating between both faces, closing distance. Audio: Senghor's warm baritone voice. Aime's softer response. Footsteps quickening.

Shot 3 (10-15s): The embrace. Senghor opens his arms wide. He wraps them around the smaller Aime, who looks stunned, then smiles. The cold grey corridor seems to warm around them — a Pixar emotional light trick. The other French students pass in the background, blurred and grey, not noticing. Camera: slow orbital around the two figures, 180 degrees. Audio: warm orchestral swell. The corridor echo fades.

Style: Pixar 3D animation. Warm friendship against cold stone. Dual temperature lighting — cold corridor, warm figures. 4K, 16:9.`,
  },
  {
    id: 4,
    title: "La Negritude nait (1934, Paris)",
    subtitle: "L'Etudiant Noir — Cesaire ecrit le mot 'Negritude' pour la premiere fois",
    duration: "0:15",
    status: "in_progress",
    desc: "Style Pixar. Une chambre d'etudiant exigue. Une lampe de bureau. Le mot NEGRITUDE frais sur le papier, les lettres encore luisantes.",
    nbpPrompt: `Pixar 3D animation style, intimate and revolutionary.

A cramped student room at the Cite Universitaire, Paris, late at night.
A small wooden desk covered in papers, books, coffee cups, and an overflowing ashtray.
A single desk lamp casts a warm cone of light in the otherwise dark room.

AIME (21) sits hunched over a sheet of paper, fountain pen in hand.
He has just written a word. The camera is close enough to see
the word "NEGRITUDE" freshly written in dark ink on the paper,
the letters still glistening wet.

His expression: not triumph — REVELATION. Eyes wide, mouth parted.
He stares at the word he has just invented as if it stared back.
His left hand is frozen mid-air, as if he's afraid to disturb
what has just appeared on the page.

On the desk: stacked books (spines visible — Frobenius, Rimbaud, Marx),
an issue of "L'Etudiant Noir" journal folded open,
Senghor's spectacles left behind from an earlier visit.

The room is small and cold — visible breath, a thin blanket on the bed behind.
But the pool of lamplight around the word is WARM,
as if the word itself generates heat.

Single practical source: the desk lamp.
The warm light creates a Rembrandt triangle on Aime's face.
Everything outside the cone of light dissolves into soft darkness.
The ink on the paper catches the light like liquid gold.

Pixar quality: ultra-detailed desk clutter, visible ink viscosity,
paper grain, the fountain pen's metallic sheen.
Close-up to medium shot. The word and the face share the frame equally.
4K, 16:9, Pixar 3D animation.`,
    klingSequence: `Shot 1 (0-6s): Extreme close-up of a fountain pen nib touching white paper. Dark ink flows from the tip, forming letters. The room is dark. A single desk lamp casts a warm cone of light on the page. The word forms slowly: N... E... G... R... I... T... U... D... E. Camera: macro, the ink spreading into the paper fibers. Audio: the scratch of the pen, slow and deliberate. A clock ticking.

Shot 2 (6-11s): Medium shot pulling back. Young Aime (21) hunched over the desk. His expression shifts from concentration to REVELATION. His eyes widen. His hand freezes mid-air. He stares at the word he has just invented. Camera: slow pull-back revealing his face lit by the desk lamp. Audio: the pen stops. Silence. His breath catches. One sharp inhale.

Shot 3 (11-15s): Wide shot of the tiny student room. The desk lamp illuminates only Aime and the paper. Everything else is in shadow — the narrow bed, the stacked books. But from the paper, from the WORD, a soft golden light begins to radiate. The letters glow. The room brightens slightly. As if the word itself is a lamp. Camera: static wide, the golden light slowly expanding from the page. Audio: a single piano note blooms into a full orchestral chord. The word is alive.

Style: Pixar 3D animation. Chiaroscuro lighting. Single practical source plus magical word-glow. 4K, 16:9.`,
  },
  {
    id: 5,
    title: "Le Cahier (1936, Dalmatie)",
    subtitle: "Cesaire commence a ecrire le Cahier d'un retour au pays natal en Croatie",
    duration: "0:15",
    status: "in_progress",
    desc: "Style Pixar. Aime assis sur un mur de pierre au-dessus de l'Adriatique, yeux fermes. Au-dessus de sa tete, une vision translucide de la Martinique.",
    nbpPrompt: `Pixar 3D animation style, melancholic and beautiful.

A young Black man (AIME, 23) sits on a stone wall
overlooking the Adriatic Sea in Dalmatie, Croatia.
He wears a white shirt, sleeves rolled, collar open,
and holds a notebook on his knee, writing with a pencil.

The landscape is stunning: azure Mediterranean sea,
white limestone cliffs, red-roofed villages in the distance,
Mediterranean pines bending in the coastal wind.
But Aime does not look at the beauty around him.

His eyes are CLOSED. He is writing from MEMORY.
He sees Martinique — and above his head, like a Pixar thought-cloud
rendered in translucent watercolor style,
a vision appears: the sugarcane fields of Basse-Pointe,
the silhouette of Montagne Pelee, the wooden cases of rue Cases-Negres,
his grandmother's porch. The vision is warm (amber, green, tropical)
while the real landscape around him is cool (blue, white, Mediterranean).

Two worlds in one frame. The body in Europe. The soul in Martinique.

Late afternoon Mediterranean light: golden but cooler than Caribbean.
The thought-cloud above him glows with its own internal tropical warmth.
Wind moves his shirt, his notebook pages, the pine branches.

Pixar quality: dual lighting system (cool real / warm imagined),
translucent vision effect, fabric wind simulation,
limestone texture, individual pine needles, sea surface reflection.
Wide shot, Aime small against the vast sea, but his vision is VAST above him.
4K, 16:9, Pixar 3D animation.`,
    klingSequence: `Shot 1 (0-5s): Wide shot of Aime (23) sitting on a stone wall above the Adriatic Sea. White limestone cliffs, azure water, Mediterranean pines. He holds a notebook on his knee, pencil in hand. But his eyes are closed. Camera: slow aerial approach toward him from the sea. Audio: Mediterranean wind, waves on rocks, distant church bells.

Shot 2 (5-10s): Close-up of his closed eyes. Above his head, a translucent vision begins to form: the sugarcane fields of Basse-Pointe, Montagne Pelee in golden light, the wooden porch where Mamie Nini taught him to read. The vision is warm (amber, tropical green) against the cool blue Mediterranean. Camera: slow tilt up from his face to the vision forming above. Audio: the Mediterranean sounds crossfade into Caribbean: tree frogs, tanbou, a hummed lullaby.

Shot 3 (10-15s): Wide shot — both worlds in one frame. Aime on the stone wall (cool, blue, real). The vision of Martinique floating above him (warm, golden, remembered). His pencil begins to move on the notebook. He writes without opening his eyes. The first words of the Cahier d'un retour au pays natal. Camera: static wide, holding both worlds, letting the contrast speak. Audio: the two soundscapes merge — Mediterranean and Caribbean, Europe and home. His pencil on paper.

Style: Pixar 3D animation. Dual palette — cool real / warm imagined. Translucent watercolor effect for the vision. 4K, 16:9.`,
  },
  {
    id: 6,
    title: "Le professeur (1939, Fort-de-France)",
    subtitle: "Cesaire enseigne au Lycee Schoelcher — Glissant et Fanon parmi ses eleves",
    duration: "0:15",
    status: "pending",
    desc: "Style Pixar. Classe du Lycee Schoelcher. Cesaire en feu. Glissant prend des notes furieuses. Fanon fixe Cesaire — son esprit se refait en temps reel.",
    nbpPrompt: `Pixar 3D animation style, inspiring and powerful.

A classroom in the Lycee Schoelcher, Fort-de-France.
Wooden desks in rows, tall shuttered windows open to the tropical air,
a blackboard behind the teacher with chalk writing visible:
"Ma bouche sera la bouche des malheurs qui n'ont point de bouche."

AIME (26) stands at the front, no longer the small boy —
he is now a young professor in a white shirt, dark trousers,
round spectacles pushed up on his forehead.
He is MID-GESTURE: one arm raised, palm open,
delivering a passionate lecture. His body leans forward.
His expression: FIRE. Not anger — conviction.

In the front row: two students who will change the world.
A teenage EDOUARD GLISSANT, taking furious notes, pencil flying.
A teenage FRANTZ FANON, not writing — STARING at Cesaire
with an expression of someone whose mind is being remade in real time.

The other students react differently: some fascinated,
some confused, some leaning forward, one dozing in the back row.
The classroom is ALIVE with the tension of ideas being born.

Afternoon Caribbean light flooding through the open shutters,
casting stripe patterns on the wooden floor and across Aime's white shirt.
Dust motes and chalk dust dance in the light beams.
A trade wind moves the pages of an open book on a desk.

Pixar quality: multiple distinct character expressions,
classroom environment detail (carved desk graffiti, inkwells, worn books),
volumetric light shafts, fabric and hair movement from the wind.
Medium-wide shot from the back of the classroom,
students in the foreground (soft focus), Cesaire sharp at center.
4K, 16:9, Pixar 3D animation.`,
    klingSequence: `Shot 1 (0-5s): Wide shot of a classroom at Lycee Schoelcher. Rows of wooden desks, tall shuttered windows open to the tropics. On the blackboard: chalk writing visible but illegible from this distance. Camera: slow push through the classroom door into the room. Audio: the buzz of students settling, chair scraping, a fan turning.

Shot 2 (5-10s): Medium shot of Cesaire (26) at the front. White shirt, dark trousers, spectacles pushed up on his forehead. He begins to speak. One arm rises. His body leans forward. His expression: FIRE — not anger, conviction. In the front row: a teenage boy takes furious notes (Glissant). Next to him: another teen stares at Cesaire with his mind being remade (Fanon). Camera: dolly-in toward Cesaire's face, students blurring in foreground. Audio: his voice, rich and rhythmic, filling the room. A pencil scratching fast.

Shot 3 (10-15s): Close-up montage — three faces in succession. Glissant: writing, inspired, lips moving with the words. Fanon: not writing, STARING, jaw tight, eyes burning. Then back to Cesaire: who pauses, smiles slightly, and continues. The afternoon light shifts through the shutters across his face. Camera: quick cuts between the three faces, each held for 1.5 seconds. Audio: Cesaire's voice continues over the cuts. A trade wind rustles papers.

Style: Pixar 3D animation. Warm classroom tones. Volumetric light shafts through shutters. 4K, 16:9.`,
  },
  {
    id: 7,
    title: "Le maire a 32 ans (1945, Fort-de-France)",
    subtitle: "Cesaire elu maire — la foule le porte en triomphe",
    duration: "0:15",
    status: "pending",
    desc: "Style Pixar. Rue de Fort-de-France bondee. Aime porte sur les epaules. Larmes, lunettes de travers, main levee. La banderole 'CESAIRE MAIRE'.",
    nbpPrompt: `Pixar 3D animation style, joyful and triumphant.

A street in downtown Fort-de-France, 1945.
AIME (32) is lifted on the shoulders of two men in the crowd.
He wears a white short-sleeved shirt and dark trousers,
his spectacles slightly askew from the jostling.
His expression: overwhelmed joy, tears in his eyes,
one hand raised in a wave, the other clutching a folded paper
(the election results) against his chest.

Below him: a DENSE crowd of Black Martiniquais
filling the entire street — men in hats, women in madras headwraps,
children on shoulders, dock workers still in their work clothes.
Hands reaching up toward Aime. Mouths open in cheers.
Homemade banners reading "CESAIRE MAIRE" in hand-painted letters.

The crowd stretches back to the vanishing point of the street.
Fort-de-France's colonial buildings line both sides,
bunting and flags hanging from the balconies.
In the far background, the green mornes (hills) of Martinique.

Tropical afternoon light, everything golden and warm.
The crowd is a sea of rich brown skin tones under the Caribbean sun.
Confetti or torn paper falling through the air.
A single flamboyant tree in bloom adds vivid orange-red to the upper frame.

Pixar quality: crowd simulation with individual expressions visible
in the nearest figures, cloth physics on the banners,
confetti particle effects, subsurface scattering on skin.
Low-angle wide shot, Aime elevated above the crowd at the golden ratio point.
4K, 16:9, Pixar 3D animation.`,
    klingSequence: `Shot 1 (0-4s): Wide shot of a Fort-de-France street packed with people. Hundreds of Martiniquais: men in hats, women in madras, children on shoulders. Homemade banners waving. Hands in the air. Celebration. Camera: high crane descending into the crowd. Audio: crowd roaring, drums, a brass band in the distance.

Shot 2 (4-9s): Medium shot — Aime (32) is lifted on the shoulders of two men. White shirt, spectacles askew from the jostling. His expression: overwhelmed joy, tears in his eyes. One hand raised waving, the other clutching election results. Camera: tracking alongside at his elevated height, his face at center. Audio: the crowd chanting "CE-SAIRE! CE-SAIRE!" rhythmic and powerful.

Shot 3 (9-12s): Close-up of his face. Tears running down his cheeks. But smiling. His spectacles catch the sunlight. For one moment, he closes his eyes. Feeling it all. Camera: tight on his face, shallow depth of field, confetti falling around him. Audio: the chant continues but softens. His breathing. A single sob of joy.

Shot 4 (12-15s): Wide aerial pulling up from the crowd. The entire street revealed — a river of people stretching blocks. Fort-de-France's buildings line the sides. The green mornes behind. Confetti fills the air like golden snow. Camera: crane up to aerial, the crowd becoming a pattern, a nation. Audio: the chant swells to maximum. Brass fanfare. Then a clean cut to silence.

Style: Pixar 3D animation. Triumphant, warm. Crowd simulation with individual expressions. Confetti particles. 4K, 16:9.`,
  },
  {
    id: 8,
    title: "Le Discours (1950, Paris)",
    subtitle: "Cesaire ecrit le Discours sur le colonialisme — seul contre l'Empire",
    duration: "0:15",
    status: "pending",
    desc: "Style Pixar. Nuit profonde. Pluie sur la vitre. Aime ecrit avec RAGE. La lumiere de la lampe contre l'Empire.",
    nbpPrompt: `Pixar 3D animation style, dark and powerful.

AIME (37) sits at a heavy desk in a Parisian apartment.
It is deep night. Rain streaks the window behind him.
The city lights of Paris glow faintly through the wet glass.

He is writing furiously — not with elegance, with RAGE.
Papers are scattered, some crumpled and thrown on the floor.
His fountain pen moves fast. Ink stains on his fingers.
His spectacles reflect the lamplight. His jaw is set.
His eyes burn with a cold fire.

On the desk: newspaper clippings with images of colonial violence,
a copy of "L'Etudiant Noir" from 15 years ago (yellowed, worn),
an empty coffee cup, an ashtray overflowing with cigarette butts,
a framed photograph of his children in Martinique.

On the manuscript page closest to camera, visible words:
"Entre colonisateur et colonise, il n'y a de place
que pour la corvee, l'intimidation..."

The room is dark except for the desk lamp and the city glow.
The lamp creates harsh shadows — this is not the warm light of Prompt 1.
This is the cold light of a man at war with an empire, armed only with a pen.
The rain on the window creates moving shadow patterns on the wall
like prison bars — or like text running down the walls.

Pixar quality: rain droplet simulation on glass, realistic ink on fingers,
paper texture with visible handwriting, reflections in spectacle lenses,
volumetric light from the lamp cutting through cigarette smoke.
Medium close-up, slightly from above, looking down at the writing hand.
4K, 16:9, Pixar 3D animation.`,
    klingSequence: `Shot 1 (0-5s): Close-up of hands writing furiously on paper. Ink stains on the fingers. The pen moves fast — not elegance, RAGE. Crumpled papers are visible at the edge of the desk. Camera: tight on the hands, handheld, matching the urgency. Audio: pen scratching hard on paper, rain on the window, a chair creaking.

Shot 2 (5-10s): Medium shot of Aime (37) at his desk in a Parisian apartment. Deep night. Rain streaks the window behind him. His spectacles reflect the lamplight. His jaw is clenched. He reads a line back. Crosses it out. Writes it again, better. On the desk: newspaper clippings, a photo of his children in Martinique. Camera: slow orbit around him, the rain-shadow patterns moving on the wall. Audio: rain intensifying, his pen stopping and starting, a frustrated exhale.

Shot 3 (10-15s): Wide shot of the room from the window's perspective. We see him from outside, through the rain-streaked glass. A small figure at a desk in a dark Parisian apartment. The city lights glow behind us. He is alone. But the lamp on his desk is the brightest point in the frame. The man. The pen. The words. Against an empire. Camera: static, outside looking in, rain running down the glass between us and him. Audio: rain dominates. His pen is barely audible. Then silence. He lifts his head.

Style: Pixar 3D animation. Dark, intense. Rain simulation, glass refraction, Rembrandt lighting. 4K, 16:9.`,
  },
  {
    id: 9,
    title: "Le poete au crepuscule (1990s, Fort-de-France)",
    subtitle: "Le vieux Cesaire marche seul dans les rues de sa ville",
    duration: "0:15",
    status: "pending",
    desc: "Style Pixar. Un vieil homme marche lentement. Chemise blanche, lunettes epaisses. Sur un mur: 'MERCI PAPA CESAIRE' en bleu. Il ne regarde pas. Il sait.",
    nbpPrompt: `Pixar 3D animation style, tender and elegiac.

An elderly Black man (AIME, late 70s-80s) walks slowly
through a quiet street in Fort-de-France at dusk.
He is thin, stooped slightly, wearing his signature
white short-sleeved guayabera shirt, dark trousers,
round spectacles now thick-lensed.
He carries no briefcase, no papers. Just his hands behind his back.

The street is the one he has walked for 50 years as mayor.
Small shops are closing for the evening — metal shutters coming down.
A woman in a doorway nods at him with deep respect.
A child on a bicycle stops to stare.
A street cat follows him at a distance.

He walks past a wall where someone has written in graffiti:
"MERCI PAPA CESAIRE" in blue paint.
He doesn't look at it. He knows it's there. He knows all the walls.

The sky is a gradient from deep Caribbean blue to warm violet.
The first stars are appearing. The streetlamps are just flickering on,
casting warm orange pools on the sidewalk.
His shadow stretches long behind him on the concrete.

Pixar quality: elderly character rig with subtle stoop, age spots,
thin arms, thick spectacle lenses that distort his eyes slightly.
Street environment: tropical urban decay mixed with care —
potted plants on windowsills, painted shutters, worn cobblestones.
The graffiti text is perfectly readable.

Wide shot, Aime small in the frame, the street receding.
His white shirt is the brightest element in the gathering darkness.
4K, 16:9, Pixar 3D animation.`,
    klingSequence: `Shot 1 (0-5s): Wide shot of a quiet Fort-de-France street at dusk. Small shops closing — metal shutters coming down. An elderly man walks slowly, hands behind his back. White guayabera shirt, dark trousers, thick-lensed spectacles. Camera: static wide, he enters frame from the right, walking left. Audio: distant traffic, a shutter being pulled down, his slow footsteps.

Shot 2 (5-10s): Medium tracking shot alongside him. He passes a wall with graffiti: "MERCI PAPA CESAIRE" in blue paint. He doesn't look at it. He knows it's there. A woman in a doorway nods at him with deep respect. He nods back. A child on a bicycle stops and stares with wide eyes. Camera: lateral tracking at his pace, the street life framing him. Audio: his footsteps, the bicycle bell, the woman's whispered "Bonsoir, Monsieur le Maire."

Shot 3 (10-15s): Wide shot from behind as he walks away from us. His white shirt catches the last light. The streetlamps flicker on, casting warm orange pools on the concrete. His shadow stretches long behind him toward us. He turns a corner and is gone. The street continues without him. But changed. Camera: static, watching him shrink into the dusk until he disappears. Audio: his footsteps fading. Then only the evening — tree frogs, a distant radio, warm wind.

Style: Pixar 3D animation. Tender, elegiac. Dusk gradient sky, warm streetlamp pools. Elderly character rig. 4K, 16:9.`,
  },
  {
    id: 10,
    title: "L'heritage (2008 → eternite)",
    subtitle: "Les obseques — le stade de Dillon, la Martinique dit adieu",
    duration: "0:15",
    status: "pending",
    desc: "Style Pixar. Vue aerienne du stade de Dillon. Foule en blanc. Cercueil en bois. Au-dessus du stade, les esprits lumineux de toute sa vie montent vers les etoiles.",
    nbpPrompt: `Pixar 3D animation style, emotional and monumental.

An aerial view descending slowly toward the Stade de Dillon
in Fort-de-France, packed with thousands of people.
The entire field and stands are filled — a sea of people in white,
the traditional color of mourning in the Caribbean.

At the center of the field: a simple wooden coffin
draped in the Martiniquais flag (green, black, and red serpent)
and covered in tropical flowers — anthuriums, heliconias, bird of paradise.
A single microphone stands nearby.

At the podium: PIERRE ALIKER, 101 years old, Cesaire's first adjoint,
tiny and ancient, leaning on the podium, delivering the eulogy.
His mouth is open mid-word. The crowd is silent.

But the magic: ABOVE the stadium, rendered in the same translucent
watercolor style as the thought-cloud in Prompt 5,
the LIFE of Cesaire appears in the sky like an aurora.
Ghostly images dissolve into each other:
the little boy on his grandmother's lap reading,
the student in the grey blouse meeting Senghor,
the professor at the blackboard, the young mayor lifted by the crowd,
the writer at his desk in the rain —
all the previous 9 images as translucent spirits in the Caribbean sky,
rising from the stadium toward the stars.

The sky transitions from warm sunset orange at the horizon
to deep violet above, and the ghostly images glow
with the warm light of each era they represent.
The crowd looks up. Some cry. Some smile. All remember.

Pixar quality: massive crowd simulation (thousands of individual figures),
translucent overlay effect for the life-montage,
realistic stadium architecture, flower detail on the coffin,
the Martiniquais flag colors vivid against the white crowd.
Ultra-wide shot from above, slowly closing in.
The coffin is at the exact center — the phi point of the composition.
4K, 16:9, Pixar 3D animation.`,
    klingSequence: `Shot 1 (0-4s): Aerial wide shot descending toward the Stade de Dillon. The stadium is packed — tens of thousands of people dressed in white. A simple wooden coffin at center field, draped in flowers and the Martiniquais flag. Camera: slow descent from above, the stadium growing to fill the frame. Audio: silence. Complete silence. Then a single tanbou drum beat. A heartbeat.

Shot 2 (4-8s): Medium shot of Pierre Aliker (101 years old) at the podium. Tiny, ancient, leaning on the wood. His mouth opens. He speaks. Behind him, the crowd stretches to the edges of the frame. Camera: low angle looking up at Aliker, the sky behind him. Audio: his voice, thin but clear. The crowd holds its breath.

Shot 3 (8-12s): Wide shot of the sky above the stadium. From the coffin, translucent golden figures begin to rise. The life of Cesaire plays in the clouds: the boy reading with Mamie Nini, the student embracing Senghor, the professor at the blackboard, the young mayor lifted by the crowd, the writer in the rain. All the previous 9 images as luminous spirits ascending toward the stars. Camera: slow tilt up from the stadium into the sky, following the spirits. Audio: the tanbou heartbeat continues. Choir humming enters. Strings swell.

Shot 4 (12-15s): The spirits dissolve into the stars above Martinique. The stadium seen from space — a tiny point of light on a tiny island. But the stars above it are arranged in the shape of a pen. Camera: pulling back to the final wide — the island, the sea, the stars. Audio: full orchestra + choir + tanbou reaching maximum beauty. Then: a single steel pan note. Held. Fading. Eternity.

Style: Pixar 3D animation. Epic emotional finale. Massive crowd, translucent spirit overlay, star field. 4K, 16:9.`,
  },
];

const STATUS_CONFIG: Record<Status, { icon: typeof CheckCircle2; color: string; label: string }> = {
  done: { icon: CheckCircle2, color: "text-emerald-400", label: "Termine" },
  in_progress: { icon: Loader2, color: "text-amber-400", label: "En cours" },
  pending: { icon: Circle, color: "text-[var(--color-text-muted)]", label: "A faire" },
};

export default function CesaireSequencesPage() {
  const [sequences, setSequences] = useState(INITIAL_SEQUENCES);
  const [hydrated, setHydrated] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(LS_KEY);
      if (saved) {
        const map: Record<number, Status> = JSON.parse(saved);
        setSequences((prev) => prev.map((s) => ({ ...s, status: map[s.id] ?? s.status })));
      }
    } catch { /* ignore */ }
    setHydrated(true);
  }, []);

  function cycleStatus(id: number) {
    setSequences((prev) => {
      const updated = prev.map((s) => {
        if (s.id !== id) return s;
        const idx = STATUS_CYCLE.indexOf(s.status);
        return { ...s, status: STATUS_CYCLE[(idx + 1) % STATUS_CYCLE.length] };
      });
      const map: Record<number, Status> = {};
      updated.forEach((s) => { map[s.id] = s.status; });
      localStorage.setItem(LS_KEY, JSON.stringify(map));
      return updated;
    });
  }

  function handleCopy(text: string, id: string) {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  const done = sequences.filter((s) => s.status === "done").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-gold-glow)]">
          <Video className="h-5 w-5 text-[var(--color-gold)]" />
        </div>
        <div>
          <PageHeader title="Sequences" />
          <p className="text-[10px] tracking-[0.15em] text-[var(--color-gold-muted)]">
            Cesaire Pixar — 10 sequences Pixar 3D, la vie d&apos;Aime Cesaire
          </p>
        </div>
        <span className="ml-auto font-mono text-xs text-[var(--color-text-muted)]">{done}/10 terminees</span>
      </div>

      {/* Progress */}
      <div className="h-2 overflow-hidden rounded-full bg-[var(--color-surface-raised)]">
        <motion.div
          className="h-full rounded-full bg-[var(--color-gold)]"
          initial={{ width: 0 }}
          animate={{ width: `${(done / 10) * 100}%` }}
          transition={{ duration: 0.6 }}
        />
      </div>

      {/* Sequences list */}
      <div className="overflow-hidden rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)]">
        {sequences.map((seq, i) => {
          const cfg = STATUS_CONFIG[seq.status] ?? STATUS_CONFIG.pending;
          const Icon = cfg.icon;
          const isExpanded = expandedId === seq.id;
          return (
            <div key={seq.id}>
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-start gap-4 border-b border-[var(--color-border-subtle)] px-4 py-3 last:border-b-0 transition-colors hover:bg-[var(--color-surface-raised)]/30"
              >
                <span className="mt-0.5 font-mono text-sm font-bold text-[var(--color-gold)]">
                  {String(seq.id).padStart(2, "0")}
                </span>
                <button
                  onClick={() => cycleStatus(seq.id)}
                  className="group/btn mt-0.5 rounded-md p-0.5 transition-colors hover:bg-[var(--color-surface-raised)]"
                  title={`Statut: ${cfg.label} — Cliquer pour changer`}
                >
                  <Icon className={`h-4 w-4 ${cfg.color} ${seq.status === "in_progress" ? "animate-spin" : ""} group-hover/btn:scale-110 transition-transform`} />
                </button>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-[var(--color-text)]">{seq.title}</h3>
                  <p className="mt-0.5 text-[10px] italic text-[var(--color-gold-muted)]">{seq.subtitle}</p>
                  <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">{seq.desc}</p>
                </div>
                {hydrated && (
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${cfg.color} bg-[var(--color-surface-raised)]`}>
                    {cfg.label}
                  </span>
                )}
                <div className="flex items-center gap-2">
                  <Clock className="h-3 w-3 text-[var(--color-text-muted)]" />
                  <span className="font-mono text-xs text-[var(--color-text-muted)]">{seq.duration}</span>
                </div>
                <button
                  onClick={() => setExpandedId(isExpanded ? null : seq.id)}
                  className="mt-0.5 rounded-md p-1 text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface-raised)] hover:text-[var(--color-gold)]"
                  title="Voir les prompts"
                >
                  <ChevronDown className={cn("h-4 w-4 transition-transform", isExpanded && "rotate-180")} />
                </button>
              </motion.div>

              {/* Expandable prompt section */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden border-b border-[var(--color-border-subtle)] bg-[var(--color-bg)]"
                  >
                    <div className="space-y-4 px-6 py-4">
                      {/* NBP Prompt */}
                      <div>
                        <div className="mb-2 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Camera className="h-3.5 w-3.5 text-[var(--color-gold)]" />
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-gold)]">
                              Prompt Nano Banana Pro (Keyframe Pixar)
                            </span>
                          </div>
                          <button
                            onClick={() => handleCopy(seq.nbpPrompt, `nbp-${seq.id}`)}
                            className={cn(
                              "flex items-center gap-1 rounded-lg px-2.5 py-1 text-[10px] transition-all",
                              copiedId === `nbp-${seq.id}`
                                ? "bg-emerald-500/20 text-emerald-400"
                                : "bg-[var(--color-surface-raised)] text-[var(--color-text-muted)] hover:text-[var(--color-gold)]"
                            )}
                          >
                            {copiedId === `nbp-${seq.id}` ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                            {copiedId === `nbp-${seq.id}` ? "Copie !" : "Copier"}
                          </button>
                        </div>
                        <pre className="overflow-x-auto rounded-lg bg-[var(--color-surface)] p-4 font-[family-name:var(--font-mono)] text-[11px] leading-relaxed text-[var(--color-text-muted)] whitespace-pre-wrap">
                          {seq.nbpPrompt}
                        </pre>
                      </div>

                      {/* Kling Sequence */}
                      <div>
                        <div className="mb-2 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Film className="h-3.5 w-3.5 text-cyan-400" />
                            <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                              Sequence Kling 3.0 (15s Multi-Shot)
                            </span>
                          </div>
                          <button
                            onClick={() => handleCopy(seq.klingSequence, `kling-${seq.id}`)}
                            className={cn(
                              "flex items-center gap-1 rounded-lg px-2.5 py-1 text-[10px] transition-all",
                              copiedId === `kling-${seq.id}`
                                ? "bg-emerald-500/20 text-emerald-400"
                                : "bg-[var(--color-surface-raised)] text-[var(--color-text-muted)] hover:text-cyan-400"
                            )}
                          >
                            {copiedId === `kling-${seq.id}` ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                            {copiedId === `kling-${seq.id}` ? "Copie !" : "Copier"}
                          </button>
                        </div>
                        <pre className="overflow-x-auto rounded-lg bg-[var(--color-surface)] p-4 font-[family-name:var(--font-mono)] text-[11px] leading-relaxed text-[var(--color-text-muted)] whitespace-pre-wrap">
                          {seq.klingSequence}
                        </pre>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
