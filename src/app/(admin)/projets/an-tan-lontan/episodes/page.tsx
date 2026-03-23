"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Video, Calendar, CheckCircle2, Circle, Loader2, ChevronDown, Copy, Check, Camera, Film, Landmark, Search, ExternalLink, MapPin, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

const LS_KEY = "atl-episodes-status";

const STATUS_CYCLE = ["pending", "in_progress", "done"] as const;
type Status = (typeof STATUS_CYCLE)[number];

interface Episode {
  id: number;
  title: string;
  subtitle: string;
  year: string;
  status: Status;
  desc: string;
  nbpPrompt: string;
  klingSequence: string;
}

const INITIAL_EPISODES: Episode[] = [
  {
    id: 1,
    title: "L'arrivee (XVIe siecle)",
    subtitle: "Premier contact — Baie de Fort-Royal, 1635",
    year: "1635",
    status: "done",
    desc: "Un navire colonial francais ancre dans une baie tropicale a l'aube. Un Kalinago observe depuis la lisiere.",
    nbpPrompt: `A wooden French colonial ship anchored in a tropical bay at dawn,
seen from the shoreline through dense tropical vegetation.
The hull is weathered oak with visible barnacles and rope rigging.
A small rowboat carries four men in 17th-century French naval attire
toward a black volcanic sand beach.

In the foreground, partially hidden by giant fern leaves and mahogany trunks,
the silhouette of a Kalinago man watches from the treeline,
his body half-turned, one hand resting on a wooden bow.
His expression is unreadable — neither fear nor welcome. Observation.

Wide establishing shot, low angle from the beach level,
the ship framed between two coconut palms.
Golden hour, first light of morning.
Mist rising from the warm water surface.
Volumetric light rays cutting through the canopy.

Shot on RED V-Raptor, Cooke S7/i 32mm, T2.8.
Kodak Vision3 250D color science.
Color grade: desaturated greens with warm amber highlights on the water.
Atmospheric haze separating foreground jungle from midground beach from background ship.
Visible humidity in the air. Subtle lens condensation at the edges.
4K, 16:9, photorealistic.`,
    klingSequence: `Shot 1 (0-5s): Wide establishing shot from the jungle shoreline. A wooden French colonial ship at anchor in a tropical bay at dawn. Mist rises from the warm water. Volumetric light rays cut through the canopy. A small rowboat with four men in 17th-century naval attire rows toward the black volcanic sand beach. Camera: static locked, slight natural sway as if handheld from behind vegetation. Audio: ocean waves lapping, distant bird calls, oars splashing rhythmically.

Shot 2 (5-10s): Medium shot of a Kalinago man watching from the treeline. His silhouette is partially hidden by giant fern leaves. One hand rests on a wooden bow. His head turns slowly to follow the rowboat's progress. Camera: slow push-in toward his face through the leaves. Audio: insects buzzing, a branch cracking underfoot, his slow steady breathing.

Shot 3 (10-15s): Over-the-shoulder from behind the Kalinago. Through the gap in the vegetation, the rowboat reaches the shore. A French officer steps out into the shallow water, boots splashing. He looks up toward the treeline — directly toward us. The Kalinago does not move. Camera: static, locked on the Kalinago's shoulder, the French officer sharp in the background. Audio: boots in water, the rowboat scraping sand, then silence. Only wind.

Style: Photorealistic, cinematic. Shot on RED V-Raptor. Kodak Vision3 250D color science. Desaturated greens, warm amber water. Atmospheric haze, visible humidity. 4K, 2.39:1.`,
  },
  {
    id: 2,
    title: "L'habitation (XVIIe siecle)",
    subtitle: "Habitation sucriere — Les champs avant l'aube",
    year: "XVIIe",
    status: "done",
    desc: "Un vaste champ de canne a sucre sous un ciel indigo pre-aube. Une femme esclave marche pieds nus sur la terre rouge volcanique.",
    nbpPrompt: `A vast sugarcane field stretching to the horizon under a pre-dawn indigo sky.
In the midground, a stone sugar mill with a conical roof and a water wheel,
smoke rising from the chimney into the still air.

In the foreground, close to camera, the back of an enslaved African woman
walking barefoot on red volcanic earth toward the field.
She carries a machete in her right hand, blade down.
Her dress is rough undyed cotton, torn at the hem.
Her headwrap is indigo-dyed fabric, the only color on her body.
Her posture is upright — not broken, not defiant. Working.

The Great House is visible on the hill behind the mill,
white walls glowing faintly in the pre-dawn light,
shuttered windows, a colonial veranda with stone columns.

Wide shot, the woman occupying the lower-left third of the frame,
the mill at center, the Great House upper-right.
Golden spiral composition: eye travels from woman → mill → Great House → sky.

Pre-dawn light: deep indigo sky transitioning to pale gold at the horizon.
The mill chimney smoke catches the first horizontal rays.
Fireflies still visible in the cane field.

Shot on ARRI Alexa 65, Panavision Ultra Vista 40mm.
Kodak Vision3 500T pushed one stop for grain.
Color grade: deep teal shadows, warm amber horizon, skin tones preserved rich and dark.
Dew visible on the sugarcane leaves. Red earth staining the woman's feet.
4K, 16:9, photorealistic.`,
    klingSequence: `Shot 1 (0-5s): Wide shot of a vast sugarcane field under a pre-dawn indigo sky. A stone sugar mill with smoke rising from its chimney sits in the midground. The Great House glows faintly on the hill behind. Camera: slow crane up from ground level, revealing the scale of the plantation. Audio: distant roosters, the low rumble of the water wheel turning.

Shot 2 (5-10s): Close-up tracking shot of bare feet walking on red volcanic earth. An enslaved woman's feet, cracked and stained with laterite. The machete in her right hand swings gently with each step. The hem of her rough cotton dress drags in the dirt. Camera: low angle tracking lateral, moving with her pace. Audio: bare feet on earth, fabric rustling, the machete blade catching against cane stalks.

Shot 3 (10-15s): Wide shot from behind the woman as she enters the cane field. The rows of sugarcane tower above her, swallowing her into the green. The first ray of sunrise breaks over the horizon behind the Great House, painting the cane tips gold while she disappears into shadow. Camera: static, watching her walk away until the cane closes behind her. Audio: wind through the cane stalks — a rushing, whispering sound. Then the work song begins, distant, hummed by many voices.

Style: Photorealistic. ARRI Alexa 65. Kodak Vision3 500T pushed one stop. Deep teal shadows, warm amber horizon. Visible dew on cane leaves. 4K, 16:9.`,
  },
  {
    id: 3,
    title: "Saint-Pierre avant (XVIIIe-XIXe)",
    subtitle: "Le Petit Paris des Antilles — Rue Victor Hugo, Saint-Pierre, 1890",
    year: "1890",
    status: "done",
    desc: "Une rue pavee animee de Saint-Pierre. Batiments a balcons en fer forge. La Montagne Pelee sereine en arriere-plan.",
    nbpPrompt: `A bustling cobblestone street in Saint-Pierre, Martinique, late 19th century.
Two-story stone buildings with wrought-iron balconies line both sides,
decorated with hanging ferns and bougainvillea in deep magenta.

The street is alive: a mulatresse woman in a white Creole dress
and madras headwrap walks with a parasol,
a Black dockworker carries a barrel on his shoulder,
a French colonial officer in white uniform reads a newspaper at a cafe terrace,
two children chase each other between horse-drawn carriages.

At the end of the street, the spire of the cathedral is visible,
and beyond it, the perfect cone of Montagne Pelee under a clear sky.
The volcano looks peaceful. Serene. Sleeping.

Medium-wide shot from street level, slight low angle.
The cobblestones lead the eye toward Pelee in the background — a leading line toward doom.
Afternoon light: warm, golden, casting long shadows from the balconies across the street.

Shot on RED V-Raptor, Cooke Anamorphic /i 50mm, T2.3.
Anamorphic bokeh, horizontal lens flares from the afternoon sun.
Kodak Vision3 250D color science.
Color grade: warm sepia undertones, vivid bougainvillea magenta as the accent color,
the volcano slightly cooler in tone than the warm foreground — atmospheric perspective.
Visible heat shimmer rising from the cobblestones.
4K, 2.39:1 anamorphic, photorealistic.`,
    klingSequence: `Shot 1 (0-5s): Wide tracking shot down a cobblestone street in Saint-Pierre. Two-story stone buildings with wrought-iron balconies and bougainvillea. People fill the street: a woman with a parasol, a dockworker with a barrel, children chasing between horse-drawn carriages. Bustling, alive, prosperous. Camera: smooth steadicam tracking forward through the crowd at walking speed. Audio: horse hooves on cobblestone, distant piano music from a cafe, voices, laughter.

Shot 2 (5-10s): Medium shot of a mulatresse woman in a white Creole dress and madras headwrap. She pauses at a fruit stall, examines a mango, smiles at the vendor. The golden afternoon light catches the magenta bougainvillea behind her. Camera: gentle dolly-in toward her face. Audio: vendor calling prices in Creole, the rustle of her dress.

Shot 3 (10-15s): Wide shot pulling back to reveal the full street. At the end of the avenue, the cathedral spire. Beyond it: Montagne Pelee. The volcano sits perfectly framed between the buildings, serene, dormant. A thin wisp of cloud passes over its summit. Nothing else moves on the mountain. Camera: slow dolly back and slight crane up, the volcano growing larger in the frame. Audio: all street sounds gradually fade. Only wind. The mountain is silent.

Style: Photorealistic. Cooke Anamorphic. Kodak 250D. Warm sepia, vivid bougainvillea. Anamorphic lens flares. Heat shimmer. 4K, 2.39:1.`,
  },
  {
    id: 4,
    title: "La catastrophe (1902)",
    subtitle: "8h02 — Nuee ardente, Saint-Pierre, 8 mai 1902",
    year: "1902",
    status: "in_progress",
    desc: "La ville de Saint-Pierre vue depuis le port, secondes apres que le flux pyroclastique atteint le front de mer. 30 000 morts.",
    nbpPrompt: `The city of Saint-Pierre seen from the harbor, seconds after the pyroclastic flow
has reached the waterfront. A massive wall of superheated ash and gas,
glowing orange and dark grey, rolls through the city streets
like a biblical flood made of fire and stone.

In the foreground, a wooden fishing boat is capsizing in the harbor,
the water boiling around it, steam rising violently.
The mast snaps. Ropes whip through the air.

The buildings visible through the ash cloud are disintegrating —
roofs peeling off, walls crumbling inward, the cathedral spire
still standing for one more second, backlit by the orange glow
of 1,000-degree gas.

The sky above is black. Not night — ash.
The only light comes from the pyroclastic flow itself
and the fires it ignites.

Ultra-wide shot from the water, looking back at the city.
The composition mirrors Prompt 3 — same city, same angle, opposite world.
The leading line of the harbor now leads to annihilation instead of the sleeping volcano.

Shot on IMAX 65mm. Deep focus — everything sharp, nothing spared.
Color grade: monochrome amber and charcoal. No blue anywhere.
The only vivid color is the deep orange of the superheated gas.
Ash particles visible in the air like inverse snowfall.
The water surface reflects the orange sky.
4K, 21:9 ultra-wide, photorealistic.`,
    klingSequence: `Shot 1 (0-4s): Same wide angle as ATL-03 Shot 3 — the street with Pelee in the background. But the sky is dark. The mountain is no longer dormant. A massive pyroclastic cloud erupts from the summit, rolling downhill toward the city. Camera: static, locked — the same calm frame as before, now filled with horror. Audio: a deep seismic rumble building, distant screams, glass rattling.

Shot 2 (4-8s): Close-up of the same cobblestones from ATL-03. Ash falls like black snow. A parasol rolls across the ground, abandoned. The cobblestones begin to vibrate. Cracks appear in the stone walls. Camera: low angle, static, the ash accumulating on the lens surface. Audio: roaring wind, crumbling masonry, the shriek of superheated air.

Shot 3 (8-12s): Wide shot from the harbor looking back at the city. The wall of fire and ash engulfs the waterfront. Buildings disintegrate. The cathedral spire is still standing for one last moment, backlit by orange gas. Boats capsize in boiling water, steam erupting from the surface. Camera: handheld, shaking from the shockwave. Audio: a deafening roar, water boiling, wood splintering, then —

Shot 4 (12-15s): Sudden cut to black. Complete silence. Three seconds. Then: the sound of a single stone falling into water. Plop. Ripple. Nothing. Camera: black screen. Audio: silence, then the single stone. Then silence again.

Style: Cinematic disaster. IMAX 65mm. Monochrome amber and charcoal. No blue. Only orange fire and grey ash. 4K, 21:9.`,
  },
  {
    id: 5,
    title: "La reconstruction (debut XXe)",
    subtitle: "Fort-de-France devient capitale — Le marche aux epices, 1920",
    year: "1920",
    status: "in_progress",
    desc: "L'interieur d'un marche couvert a Fort-de-France. Des dizaines de marchandes derriere leurs etals d'epices.",
    nbpPrompt: `The interior of a covered market in Fort-de-France, early morning.
Wooden columns support a corrugated iron roof with gaps that let
shafts of morning sunlight cut diagonally through the humid air.

Dozens of market women (doudous) sit behind their stalls:
pyramids of turmeric, cinnamon sticks bundled with twine,
dried bay leaves in woven baskets, scotch bonnet peppers
in brilliant red and yellow, green plantains stacked like logs,
breadfruit, christophines, dasheen roots caked with dark earth.

The central figure: an older Black woman in a full madras dress
and elaborate tete calendee headwrap with four points
(meaning her heart is taken but she is open to offers).
She is mid-gesture, one hand presenting a vanilla pod to a customer,
the other resting on her hip. Her expression is commerce — sharp, warm, precise.

Medium shot, the woman at the phi grid intersection camera-right.
Foreground: blurred spice baskets. Background: the depth of the market hall,
other vendors fading into the volumetric light shafts.

Morning light: god rays cutting through the roof gaps,
illuminating dust and spice particles suspended in the humid air.
Each shaft of light is a different warmth depending on what it hits.

Shot on ARRI Alexa Mini, Zeiss Supreme Prime 47mm, T1.8.
Shallow depth of field — the spices in the foreground are soft color fields.
Kodak Vision3 500T color science.
Color grade: warm throughout, golden highlights, deep chocolate shadows.
Every spice color is accurate and vivid — turmeric yellow, pepper red, vanilla brown.
Visible moisture in the air. Sweat beading on the woman's collarbone.
4K, 16:9, photorealistic.`,
    klingSequence: `Shot 1 (0-5s): Interior of a covered market. Morning light shafts cut through the iron roof. Dozens of market women behind stalls of spices: turmeric, cinnamon, peppers. The air is thick with dust and spice particles floating in the light beams. Camera: slow dolly forward through the central aisle, passing stalls on both sides. Audio: voices haggling in Creole, baskets being set down, a child laughing.

Shot 2 (5-10s): Close-up of hands. An older woman's weathered hands arrange vanilla pods in a woven basket with precise care. Her fingers are stained with turmeric yellow. Gold bangles on her wrist. Camera: macro close-up, shallow depth of field, her hands fill the frame. Audio: the soft rustle of vanilla pods, her humming a creole melody.

Shot 3 (10-15s): Medium shot of the woman, now seen fully. She wears a madras tete calendee headwrap with four points. She holds up a vanilla pod toward a customer (toward camera), her expression sharp and warm — the commerce face of Martinique. She speaks directly: one word, a price, a smile. Camera: static, her gesture bridges the frame toward us. Audio: her voice, clear and confident. The market ambiance softens behind her.

Style: ARRI Alexa Mini. Zeiss 47mm T1.8. Kodak 500T. Warm golden, chocolate shadows, vivid spice colors. Visible moisture. 4K, 16:9.`,
  },
  {
    id: 6,
    title: "La case creole",
    subtitle: "Vie domestique — Case en bois du quartier Terres Sainville, 1950",
    year: "1950",
    status: "pending",
    desc: "L'interieur d'une case creole traditionnelle. Pas de personnage. La maison parle. L'absence est la presence la plus forte.",
    nbpPrompt: `The interior of a traditional Martiniquais wooden house (case creole).
Walls of painted wood planks in faded pastel blue.
A single window with wooden shutters thrown open,
flooding the room with afternoon light.

A cast-iron coal pot (canari) sits on a low charcoal stove,
steam rising from a court-bouillon of red snapper —
the fish visible through the bubbling tomato and pepper sauce.
Next to it: a wooden pilon (mortar) with a pestle,
garlic cloves and fresh thyme crushed inside.
A bottle of rhum vieux on the windowsill catches the light like amber.

On the wall: a framed black-and-white photograph of a couple in wedding clothes,
a crucifix, a small mirror, and a dried palm frond from Rameaux.
A rocking chair (dodine) with a crocheted doily on the armrest.

No person in the frame. The house speaks for its inhabitants.
The steam from the canari is the only movement.

Medium shot, slightly elevated, looking down at the stove area.
The window light rakes across the scene from camera-left.
The rocking chair is in soft focus in the background.

Single source: natural afternoon sunlight through the open shutters.
Hard shadows from the shutter slats creating stripe patterns on the wooden floor.
Dust motes dancing in the light beam.

Shot on RED Komodo, Cooke Speed Panchro 40mm vintage lens.
Slight softness from the vintage glass. Warm flare around the window.
Kodak Vision3 500T color science.
Color grade: warm and intimate. Faded pastel blue walls.
Rich amber on the rhum bottle. Deep red of the court-bouillon.
4K, 16:9, photorealistic.`,
    klingSequence: `Shot 1 (0-6s): Interior of a wooden case. No person. Only objects. Slow pan from a framed wedding photo on the wall, past a crucifix, past a dried palm frond, to a window with open shutters. Afternoon light pours in, casting stripe shadows on the wooden floor. Camera: slow horizontal pan, contemplative, respectful. Audio: a distant radio playing biguine music, barely audible. A clock ticking.

Shot 2 (6-11s): Close-up of a cast-iron canari on a charcoal stove. A court-bouillon of red snapper simmers — tomatoes, peppers, thyme. Steam rises in slow curls, catching the window light. Camera: macro shot, static, the steam is the only movement. Audio: gentle bubbling, the crackle of charcoal, the faint biguine continues.

Shot 3 (11-15s): Medium wide shot of the room from the doorway. The rocking chair (dodine) with a crocheted doily gently rocks — as if someone just stood up and left. Nobody is there. The light shifts slightly as a cloud passes outside. The room holds its breath. Camera: static from the doorway, the dodine at center, still rocking. Audio: the chair's gentle creak slowing, slowing, stopping. Silence. A single bird outside.

Style: RED Komodo. Vintage Cooke Speed Panchro 40mm. Warm flare, intimate. Kodak 500T. Faded pastel blue walls, amber rhum. 4K, 16:9.`,
  },
  {
    id: 7,
    title: "La route coloniale",
    subtitle: "La Trace — Route de la Montagne Pelee, 1935",
    year: "1935",
    status: "pending",
    desc: "Une route de terre rouge a travers la foret tropicale dense. Un Citroen Traction Avant noir. Le futur est invisible.",
    nbpPrompt: `A narrow dirt road cutting through dense tropical rainforest
on the flanks of Montagne Pelee.
The road is a single lane of red laterite earth,
still wet from a recent rain, with puddles reflecting the canopy.

A 1930s Citroen Traction Avant, black and mud-splattered,
is parked at the side of the road.
The driver, a Black man in a white shirt with rolled sleeves
and a straw hat, leans against the fender,
smoking a cigarette and looking up at the mountain.
His expression is contemplative. The road ahead disappears into the fog.

Giant tree ferns arch over the road forming a natural cathedral.
Epiphytes hang from every branch. The air is visibly humid.
In the far distance, through a gap in the canopy,
the summit of Pelee is wrapped in cloud.

Wide shot, the car small in the frame, the forest enormous.
The road creates a vanishing point into the fog — the future is invisible.

Overcast light filtered through multiple layers of canopy.
The light is green-tinted from passing through leaves.
No direct sunlight — everything is diffused, soft, humid.
The car's chrome bumper is the only specular highlight in the frame.

Shot on ARRI Alexa 65, Leitz Thalia 35mm.
Deep focus — sharp from the puddle in the foreground to the fog in the background.
Fuji Eterna 500T color science — cooler, more Japanese in feel.
Color grade: deep emerald greens, cool blue-grey fog,
the red laterite road as the warm accent cutting through the cold palette.
Rain droplets still falling from leaves.
4K, 2.39:1, photorealistic.`,
    klingSequence: `Shot 1 (0-5s): Wide shot of a narrow dirt road cutting through dense tropical rainforest. Red laterite earth, still wet from rain, puddles reflecting the green canopy. A 1930s black Citroen Traction Avant is parked at the roadside. Fog rolls slowly between the giant tree ferns. Camera: static establishing, the fog providing all the movement. Audio: dripping water, distant thunder, insects, bird calls echoing.

Shot 2 (5-10s): Medium shot of the driver leaning against the car fender. Black man, white shirt with rolled sleeves, straw hat, smoking a cigarette. He exhales smoke that blends with the fog. He looks up toward the mountain. Camera: slow dolly-in, the man growing in the frame. Audio: his exhale, the cigarette paper crackling, a rivulet of water nearby.

Shot 3 (10-15s): His POV — looking down the road as it disappears into the fog. The road narrows, the tree ferns arch overhead forming a cathedral. The fog thickens. The future is invisible. Camera: static POV, the fog slowly advancing toward us. Audio: all sound fades except wind and the slow drip of water from leaves. Then nothing.

Style: ARRI Alexa 65. Leitz Thalia 35mm. Fuji Eterna 500T. Deep emerald greens, cool blue-grey fog, warm red road accent. 4K, 2.39:1.`,
  },
  {
    id: 8,
    title: "Aime Cesaire",
    subtitle: "Le Cahier — Cesaire a son bureau, Fort-de-France, 1947",
    year: "1947",
    status: "pending",
    desc: "Un homme noir a son bureau couvert de livres, manuscrit sous la plume. Le stylo est mi-course — fige dans l'acte de creation.",
    nbpPrompt: `A Black man in his mid-thirties sits at a heavy wooden desk
in a small, book-filled study. He wears a white short-sleeved shirt,
round spectacles, and has a high forehead with close-cropped hair.
His left hand holds a fountain pen. His right hand rests on a manuscript page
covered in dense handwriting with multiple crossings-out and annotations.

The desk is covered: stacks of books in French (Rimbaud, Lautreamont, Marx),
an open copy of Tropiques magazine, a ceramic cup of coffee,
an ashtray with a half-smoked cigarette trailing a thin line of smoke.

Behind him: a window looking out onto a Fort-de-France street.
Through the window, blurred: a colonial-era building facade,
a woman walking with a basket on her head, a mango tree.

Close-up to medium shot, slightly below eye level — we look UP at him.
His eyes are focused on the manuscript. He is not aware of the camera.
The pen is mid-stroke — frozen in the act of creation.

Key light: warm afternoon sun from the window behind-right,
creating a rim light on his shoulders and the smoke trail.
Fill: ambient bounce from the white manuscript pages illuminating his face from below.
The books cast complex shadows on the wall.

Shot on RED V-Raptor, Cooke S4/i 75mm, T2.0.
Shallow depth of field — the books behind him dissolve into colored rectangles.
Kodak Vision3 250D color science.
Color grade: warm and studious. Amber light, ivory paper, dark wood.
The cigarette smoke catches the backlight in a thin luminous ribbon.
Skin tones rich and warm, spectacle lenses reflecting the manuscript page.
4K, 16:9, photorealistic.`,
    klingSequence: `Shot 1 (0-5s): Close-up of a fountain pen writing on manuscript paper. Dense handwriting with crossings-out and annotations. The pen moves with urgency — not elegant, DRIVEN. Ink glistens wet on the paper. Camera: extreme close-up, slight handheld, tracking the pen's movement. Audio: the scratch of nib on paper, the ticking of a clock, a cigarette burning in an ashtray.

Shot 2 (5-10s): Medium shot pulling back to reveal the man. A Black man in his mid-thirties, white shirt, round spectacles. Surrounded by stacks of books, an ashtray with a smoking cigarette, a ceramic coffee cup. Behind him: a window onto a Fort-de-France street. His left hand holds the pen. His right rests on the page. Camera: slow dolly back from the desk, widening the frame. Audio: the pen stops. He lifts his head. He reads what he wrote. A breath.

Shot 3 (10-15s): Close-up of his face in profile. The afternoon light from the window creates a rim on his spectacles. He stares at the manuscript page — not writing, SEEING. A thin line of cigarette smoke rises between him and the window. Through the blurred window: a woman walks past with a basket on her head. Camera: static, locked on his profile. The world moves outside. He is still. Audio: the distant street — a mango seller calling, children playing. He doesn't hear them.

Style: RED V-Raptor. Cooke S4/i 75mm T2.0. Kodak 250D. Warm, studious amber. Cigarette smoke catching backlight. 4K, 16:9.`,
  },
  {
    id: 9,
    title: "Le Carnaval",
    subtitle: "Vide — Mardi Gras dans les rues de Fort-de-France, 1975",
    year: "1975",
    status: "pending",
    desc: "Une foule dense remplit une rue etroite. Diablesses, tambouyers, confettis. Maximum couleur, maximum energie.",
    nbpPrompt: `A dense crowd fills a narrow street in downtown Fort-de-France
during Mardi Gras Carnival. Hundreds of people in full costume:
diablesses in red and black with horns and tridents,
men in traditional negropolitain drag with exaggerated padding and wigs,
children on shoulders, bare-chested drummers glistening with sweat.

The central figure: a young woman in a full Carnival queen costume —
towering feathered headdress in gold, green, and red,
jeweled bodice, face painted with geometric patterns in white and gold.
She is mid-dance, weight on her back foot, hips turned,
arms raised above her head, mouth open in a shout of joy.

Behind her: a wall of drummers with traditional Martiniquais tanbou
(tambour bele), their hands blurred with the speed of the beat.
Confetti and powder fill the air like a second atmosphere.

Medium shot, the queen at center, the crowd pressing in from all sides.
Motion blur on the peripheral figures — she is sharp, they are movement.
Dutch angle at 5 degrees — the energy tips the frame.

Harsh midday Caribbean sun directly overhead — no shadows on faces,
but deep shadows under the headdress feathers.
The powder in the air diffuses the sunlight into a golden haze.
Skin glistening with sweat and body glitter.

Shot on 16mm Kodak Ektachrome 100D — pushed, grainy, vivid.
Handheld camera — slight motion, not stabilized. Raw. Present.
Color grade: oversaturated, blown highlights, crushed blacks.
The red of the diablesses is the reddest red. The gold feathers burn.
Confetti is frozen mid-air. Sweat droplets on the drummer's forearm.
4K, 16:9, photorealistic with deliberate 16mm film texture.`,
    klingSequence: `Shot 1 (0-4s): Wide shot explosion — hundreds of people in Carnival costume filling a narrow Fort-de-France street. Diablesses, drummers, drag queens. Confetti and powder fill the air. Maximum color, maximum energy. Camera: high angle crane looking down into the crowd, descending fast. Audio: tanbou drums at full volume, brass section, crowd roaring.

Shot 2 (4-8s): Medium shot of a Carnival queen mid-dance. Gold, green, red feathered headdress towering above her. Face painted with white and gold geometric patterns. She is mid-turn, hips rotated, arms above her head, mouth open in joy. Camera: tracking lateral at her speed, keeping her centered while the world blurs. Audio: drums crescendo, she shouts "EYYY!" cutting through the noise.

Shot 3 (8-12s): Close-up of a drummer's hands on a tanbou bele. His hands are blurred with speed. Sweat flies off his forearms. His face is pure concentration — eyes closed, head tilted back. Camera: handheld, tight, the vibration of the drum visible on his skin. Audio: isolated tanbou rhythm, close-mic, raw and powerful.

Shot 4 (12-15s): Wide shot pulling up and away from the crowd. The entire street revealed from above — a river of color and movement. Powder in the air creates a golden haze over everything. The buildings on either side are just walls containing the human flood. Camera: crane up to aerial view. Audio: all sounds merge into one roar, then slowly fade as we rise above.

Style: 16mm Kodak Ektachrome 100D pushed. Handheld, raw. Oversaturated, blown highlights, crushed blacks. Motion blur. 4K, 16:9.`,
  },
  {
    id: 10,
    title: "Aujourd'hui",
    subtitle: "L'heritage — Anse Dufour au crepuscule, 2026",
    year: "2026",
    status: "pending",
    desc: "Une petite anse de peche au coucher du soleil. Trois yoles peintes. L'ancien et le nouveau. Ensemble.",
    nbpPrompt: `A small fishing cove (anse) at sunset in southern Martinique.
Three traditional wooden fishing boats (yoles) painted in vivid primary colors
— one blue, one red, one yellow — are pulled up on white sand.

An elderly Black fisherman sits on the hull of the blue yole,
mending a fishing net with practiced hands.
He wears faded shorts, no shirt, a straw hat pushed back on his head.
His body is lean and weathered — decades of sun and salt.
His hands work automatically. His eyes look out at the horizon.

Behind him, the Caribbean Sea at golden hour:
the water transitions from turquoise near shore to deep indigo at the horizon.
A single white cloud catches the last pink light.
On the hillside above the cove: a modern concrete house with satellite dish
sits next to a traditional wooden case with a corrugated tin roof.
The old and the new. The inheritance and the future. Together.

Wide shot, the fisherman small but central.
The three boats create a color rhythm across the lower third.
The sea fills the upper two-thirds.
Phi grid: the fisherman at the lower-right intersection.

Golden hour, final minutes: the sun has just set behind camera.
The sky is a gradient from warm peach to deep violet.
The water is a mirror of the sky.
The fisherman's skin catches the warm ambient light — no harsh shadows.

Shot on ARRI Alexa Mini, Zeiss Supreme Prime 29mm, T2.0.
Medium depth of field — boats sharp, hillside slightly soft, horizon sharp.
Kodak Vision3 250D color science.
Color grade: the full Caribbean palette. Turquoise water, pink sky,
vivid boat colors, warm dark skin, white sand turning gold.
No desaturation. No filter. The island as it is.
A single pelican frozen mid-dive in the far background.
4K, 16:9, photorealistic.`,
    klingSequence: `Shot 1 (0-5s): Wide sunset shot of a small fishing cove. Three painted yoles (blue, red, yellow) on white sand. The Caribbean Sea transitions from turquoise to indigo at the horizon. A single pelican dives in the far background. Camera: static locked, the sunset light changing slowly. Audio: gentle waves on sand, wind, a distant boat engine.

Shot 2 (5-10s): Medium shot of an elderly fisherman sitting on the blue yole hull. Lean, weathered, no shirt, straw hat pushed back. His hands mend a fishing net with automatic, practiced movements. He does not look at his hands. He looks at the horizon. Camera: slow dolly-in, his face growing in the frame. Audio: the net's fiber rubbing, his steady breathing, the waves closer now.

Shot 3 (10-15s): Wide final shot. The camera pulls back slowly. The fisherman small on the beach. The three boats. The sea. On the hillside above: a modern house with satellite dish beside a traditional wooden case with tin roof. Old and new. Together. The last pink light touches the cloud. The sky turns violet. Camera: slow dolly back, the frame expanding until the whole cove is visible. Audio: waves only. The biguine from ATL-06's radio returns — faint, ghostly, carried by wind. Then silence.

Style: ARRI Alexa Mini. Zeiss 29mm T2.0. Kodak 250D. Full Caribbean palette. No desaturation. The island as it is. 4K, 16:9.`,
  },
];

const STATUS_CONFIG: Record<Status, { icon: typeof CheckCircle2; color: string; label: string }> = {
  done: { icon: CheckCircle2, color: "text-emerald-400", label: "Termine" },
  in_progress: { icon: Loader2, color: "text-amber-400", label: "En cours" },
  pending: { icon: Circle, color: "text-[var(--color-text-muted)]", label: "A faire" },
};

/* ═══════════════════════════════════════════════════════
   PATRIMOINE TYPES
   ═══════════════════════════════════════════════════════ */
interface PatrimoineEntry {
  id: string;
  title: string;
  content: string;
  tags: string[];
}

const PATRIMOINE_TYPE_COLORS: Record<string, string> = {
  eglise: "#8B5CF6",
  distillerie: "#F59E0B",
  habitation: "#10B981",
  fort: "#EF4444",
  ruine: "#6B7280",
  monument: "#3B82F6",
  musee: "#EC4899",
  site: "#06B6D4",
  phare: "#F97316",
  jardin: "#22C55E",
  pont: "#78716C",
  artisanat: "#D97706",
};

/* ═══════════════════════════════════════════════════════
   PATRIMOINE SECTION COMPONENT
   ═══════════════════════════════════════════════════════ */
function PatrimoineSection() {
  const [open, setOpen] = useState(false);
  const [entries, setEntries] = useState<PatrimoineEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  useEffect(() => {
    if (!open || entries.length > 0) return;
    setLoading(true);
    const supabase = createClient();
    supabase
      .from("lore_entries")
      .select("id, title, content, tags")
      .eq("universe", "eveil")
      .eq("category", "patrimoine")
      .order("sort_order", { ascending: true })
      .then(({ data }) => {
        setEntries((data || []) as PatrimoineEntry[]);
        setLoading(false);
      });
  }, [open, entries.length]);

  const filtered = useMemo(() => {
    if (!search) return entries;
    const q = search.toLowerCase();
    return entries.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.content.toLowerCase().includes(q) ||
        e.tags?.some((t) => t.toLowerCase().includes(q))
    );
  }, [entries, search]);

  const extractType = (e: PatrimoineEntry) => {
    const match = e.content.match(/Type:\s*(\w+)/);
    return match?.[1] || "site";
  };

  const extractCommune = (e: PatrimoineEntry) => {
    const match = e.content.match(/Commune:\s*([^|]+)/);
    return match?.[1]?.trim() || "";
  };

  const extractDesc = (e: PatrimoineEntry) => {
    return e.content.split("\n")[0] || "";
  };

  return (
    <div className="overflow-hidden rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)]">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-[var(--color-surface-raised)]/30"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-gold-glow)]">
          <Landmark className="h-4 w-4 text-[var(--color-gold)]" />
        </div>
        <div className="flex-1">
          <h2 className="font-[family-name:var(--font-clash-display)] text-sm font-bold text-[var(--color-text)]">
            Patrimoine
          </h2>
          <p className="text-[10px] text-[var(--color-text-muted)]">
            Monuments historiques de Martinique
          </p>
        </div>
        <span className="rounded-full bg-[var(--color-gold-glow)] px-2.5 py-0.5 text-[10px] font-bold text-[var(--color-gold)]">
          {entries.length > 0 ? entries.length : "122"} sites proteges
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-[var(--color-text-muted)] transition-transform",
            open && "rotate-180"
          )}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden border-t border-[var(--color-border-subtle)]"
          >
            <div className="space-y-4 p-4">
              {/* Search + Link */}
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--color-text-muted)]" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Rechercher un monument, une commune, un type..."
                    className="w-full rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-bg)] py-2 pl-9 pr-4 text-xs text-[var(--color-text)] placeholder-[var(--color-text-muted)] outline-none transition-colors focus:border-[var(--color-gold-muted)]"
                  />
                  {search && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-[var(--color-gold-glow)] px-2 py-0.5 text-[9px] font-medium text-[var(--color-gold)]">
                      {filtered.length}
                    </span>
                  )}
                </div>
                <a
                  href="https://data.culture.gouv.fr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 rounded-lg border border-[var(--color-border-subtle)] px-3 py-2 text-[10px] text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-gold-muted)] hover:text-[var(--color-gold)]"
                >
                  <ExternalLink className="h-3 w-3" />
                  data.culture.gouv.fr
                </a>
              </div>

              {/* Grid */}
              {loading ? (
                <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="rounded-xl border border-[var(--color-border-subtle)] p-3">
                      <div className="h-4 w-32 rounded bg-[#1A1A2E] animate-pulse" />
                      <div className="mt-2 h-3 w-20 rounded bg-[#1A1A2E] animate-pulse" />
                      <div className="mt-2 h-3 w-full rounded bg-[#1A1A2E] animate-pulse" />
                    </div>
                  ))}
                </div>
              ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <Landmark className="mb-2 h-6 w-6 text-[var(--color-text-muted)]" />
                  <p className="text-xs text-[var(--color-text-muted)]">
                    {entries.length === 0
                      ? "Executer scripts/seed-patrimoine-martinique.mjs"
                      : "Aucun monument pour cette recherche"}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
                  {filtered.map((entry) => {
                    const type = extractType(entry);
                    const commune = extractCommune(entry);
                    const desc = extractDesc(entry);
                    const color = PATRIMOINE_TYPE_COLORS[type] || "#6B7280";
                    const isExpanded = expandedCard === entry.id;
                    return (
                      <motion.button
                        key={entry.id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        onClick={() => setExpandedCard(isExpanded ? null : entry.id)}
                        className={cn(
                          "rounded-xl border p-3 text-left transition-all",
                          isExpanded
                            ? "border-[var(--color-gold)] shadow-[var(--shadow-gold)]"
                            : "border-[var(--color-border-subtle)] hover:border-[var(--color-gold-muted)]"
                        )}
                      >
                        <div className="flex items-start gap-2">
                          <div
                            className="mt-0.5 h-2 w-2 shrink-0 rounded-full"
                            style={{ backgroundColor: color }}
                          />
                          <div className="min-w-0 flex-1">
                            <h4 className="truncate text-xs font-semibold text-[var(--color-text)]">
                              {entry.title}
                            </h4>
                            <div className="mt-1 flex items-center gap-2">
                              <span
                                className="rounded-full px-1.5 py-0.5 text-[9px] font-medium"
                                style={{ backgroundColor: `${color}15`, color }}
                              >
                                {type}
                              </span>
                              {commune && (
                                <span className="flex items-center gap-0.5 text-[9px] text-[var(--color-text-muted)]">
                                  <MapPin className="h-2.5 w-2.5" />
                                  {commune}
                                </span>
                              )}
                            </div>
                            {isExpanded && (
                              <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="mt-2 text-[10px] leading-relaxed text-[var(--color-text-muted)]"
                              >
                                {desc}
                              </motion.p>
                            )}
                          </div>
                          <ChevronRight
                            className={cn(
                              "mt-0.5 h-3 w-3 shrink-0 text-[var(--color-text-muted)] transition-transform",
                              isExpanded && "rotate-90"
                            )}
                          />
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ATLEpisodesPage() {
  const [episodes, setEpisodes] = useState(INITIAL_EPISODES);
  const [hydrated, setHydrated] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(LS_KEY);
      if (saved) {
        const map: Record<number, Status> = JSON.parse(saved);
        setEpisodes((prev) => prev.map((e) => ({ ...e, status: map[e.id] ?? e.status })));
      }
    } catch { /* ignore */ }
    setHydrated(true);
  }, []);

  function cycleStatus(id: number) {
    setEpisodes((prev) => {
      const updated = prev.map((e) => {
        if (e.id !== id) return e;
        const idx = STATUS_CYCLE.indexOf(e.status);
        return { ...e, status: STATUS_CYCLE[(idx + 1) % STATUS_CYCLE.length] };
      });
      const map: Record<number, Status> = {};
      updated.forEach((e) => { map[e.id] = e.status; });
      localStorage.setItem(LS_KEY, JSON.stringify(map));
      return updated;
    });
  }

  function handleCopy(text: string, id: string) {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  const done = episodes.filter((e) => e.status === "done").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-gold-glow)]">
          <Video className="h-5 w-5 text-[var(--color-gold)]" />
        </div>
        <div>
          <h1 className="font-[family-name:var(--font-clash-display)] text-lg font-bold text-[var(--color-text)]">
            Episodes
          </h1>
          <p className="text-[10px] tracking-[0.15em] text-[var(--color-gold-muted)]">
            An tan lontan — 10 keyframes Nano Banana Pro, 1635-2026
          </p>
        </div>
        <span className="ml-auto font-mono text-xs text-[var(--color-text-muted)]">{done}/10</span>
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

      {/* Timeline */}
      <div className="overflow-hidden rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)]">
        {episodes.map((ep, i) => {
          const cfg = STATUS_CONFIG[ep.status] ?? STATUS_CONFIG.pending;
          const Icon = cfg.icon;
          const isExpanded = expandedId === ep.id;
          return (
            <div key={ep.id}>
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-start gap-4 border-b border-[var(--color-border-subtle)] px-4 py-3 last:border-b-0 transition-colors hover:bg-[var(--color-surface-raised)]/30"
              >
                {/* Clickable status icon */}
                <button
                  onClick={() => cycleStatus(ep.id)}
                  className="group/btn mt-0.5 rounded-md p-0.5 transition-colors hover:bg-[var(--color-surface-raised)]"
                  title={`Statut: ${cfg.label} — Cliquer pour changer`}
                >
                  <Icon className={`h-4 w-4 ${cfg.color} ${ep.status === "in_progress" ? "animate-spin" : ""} group-hover/btn:scale-110 transition-transform`} />
                </button>
                <div className="flex items-center gap-2">
                  <Calendar className="h-3 w-3 text-[var(--color-gold)]" />
                  <span className="font-mono text-xs font-bold text-[var(--color-gold)]">{ep.year}</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-[var(--color-text)]">{ep.title}</h3>
                  <p className="mt-0.5 text-[10px] italic text-[var(--color-gold-muted)]">{ep.subtitle}</p>
                  <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">{ep.desc}</p>
                </div>
                {hydrated && (
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${cfg.color} bg-[var(--color-surface-raised)]`}>
                    {cfg.label}
                  </span>
                )}
                {/* Expand prompt button */}
                <button
                  onClick={() => setExpandedId(isExpanded ? null : ep.id)}
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
                              Prompt Nano Banana Pro (Keyframe)
                            </span>
                          </div>
                          <button
                            onClick={() => handleCopy(ep.nbpPrompt, `nbp-${ep.id}`)}
                            className={cn(
                              "flex items-center gap-1 rounded-lg px-2.5 py-1 text-[10px] transition-all",
                              copiedId === `nbp-${ep.id}`
                                ? "bg-emerald-500/20 text-emerald-400"
                                : "bg-[var(--color-surface-raised)] text-[var(--color-text-muted)] hover:text-[var(--color-gold)]"
                            )}
                          >
                            {copiedId === `nbp-${ep.id}` ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                            {copiedId === `nbp-${ep.id}` ? "Copie !" : "Copier"}
                          </button>
                        </div>
                        <pre className="overflow-x-auto rounded-lg bg-[var(--color-surface)] p-4 font-[family-name:var(--font-mono)] text-[11px] leading-relaxed text-[var(--color-text-muted)] whitespace-pre-wrap">
                          {ep.nbpPrompt}
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
                            onClick={() => handleCopy(ep.klingSequence, `kling-${ep.id}`)}
                            className={cn(
                              "flex items-center gap-1 rounded-lg px-2.5 py-1 text-[10px] transition-all",
                              copiedId === `kling-${ep.id}`
                                ? "bg-emerald-500/20 text-emerald-400"
                                : "bg-[var(--color-surface-raised)] text-[var(--color-text-muted)] hover:text-cyan-400"
                            )}
                          >
                            {copiedId === `kling-${ep.id}` ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                            {copiedId === `kling-${ep.id}` ? "Copie !" : "Copier"}
                          </button>
                        </div>
                        <pre className="overflow-x-auto rounded-lg bg-[var(--color-surface)] p-4 font-[family-name:var(--font-mono)] text-[11px] leading-relaxed text-[var(--color-text-muted)] whitespace-pre-wrap">
                          {ep.klingSequence}
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

      {/* ── Patrimoine ── */}
      <PatrimoineSection />
    </div>
  );
}
