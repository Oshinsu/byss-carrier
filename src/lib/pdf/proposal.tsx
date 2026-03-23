import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  renderToBuffer,
} from "@react-pdf/renderer";

/* ═══════════════════════════════════════════════════════
   BYSS GROUP — Premium PDF Proposal Generator
   6-page structure: Cover, Market, Pain, Pricing, ROI, CGV
   Black & gold design system
   ═══════════════════════════════════════════════════════ */

// ── Font registration ─────────────────────────────────
Font.register({
  family: "ClashDisplay",
  fonts: [
    {
      src: "https://fonts.cdnfonts.com/s/85546/ClashDisplay-Regular.woff",
      fontWeight: "normal",
    },
    {
      src: "https://fonts.cdnfonts.com/s/85546/ClashDisplay-Semibold.woff",
      fontWeight: "semibold",
    },
    {
      src: "https://fonts.cdnfonts.com/s/85546/ClashDisplay-Bold.woff",
      fontWeight: "bold",
    },
  ],
});

// ── Color tokens ──────────────────────────────────────
const C = {
  bg: "#0A0A14",
  surface: "#111126",
  surface2: "#1A1A2E",
  gold: "#D4A843",
  goldLight: "#E8C96A",
  goldDark: "#B08C35",
  text: "#F5F5F7",
  textMuted: "#8B8BA3",
  border: "#2A2A3E",
  white: "#FFFFFF",
  green: "#4ADE80",
  greenDark: "#22C55E",
  amber: "#F59E0B",
  fire: "#EF4444",
  purple: "#A855F7",
  purpleDark: "#7C3AED",
};

const TOTAL_PAGES = 6;

// ── Styles ────────────────────────────────────────────
const s = StyleSheet.create({
  // Global
  page: {
    backgroundColor: C.bg,
    padding: 0,
    fontFamily: "Helvetica",
    color: C.text,
    fontSize: 10,
  },
  contentPage: {
    backgroundColor: C.bg,
    padding: 50,
    fontFamily: "Helvetica",
    color: C.text,
    fontSize: 10,
  },

  // Cover
  coverContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 60,
  },
  coverLogoArea: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: C.surface2,
    borderWidth: 3,
    borderColor: C.gold,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 50,
  },
  coverLogoText: {
    fontSize: 36,
    fontWeight: "bold",
    color: C.gold,
    letterSpacing: 6,
  },
  coverBrand: {
    fontSize: 12,
    color: C.textMuted,
    letterSpacing: 8,
    textTransform: "uppercase",
    marginBottom: 30,
  },
  coverSubtitle: {
    fontSize: 14,
    color: C.gold,
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: 4,
    marginBottom: 40,
  },
  coverLine: {
    width: 80,
    height: 2,
    backgroundColor: C.gold,
    marginBottom: 40,
  },
  coverClient: {
    fontSize: 24,
    fontWeight: "bold",
    color: C.text,
    textAlign: "center",
    marginBottom: 10,
  },
  coverDate: {
    fontSize: 11,
    color: C.textMuted,
    textAlign: "center",
  },
  coverConfidential: {
    fontSize: 8,
    color: C.textMuted,
    textAlign: "center",
    marginTop: 60,
    letterSpacing: 3,
    textTransform: "uppercase",
  },

  // Header & Footer
  pageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  pageHeaderTitle: {
    fontSize: 8,
    color: C.gold,
    textTransform: "uppercase",
    letterSpacing: 3,
  },
  pageHeaderLogo: {
    fontSize: 8,
    color: C.textMuted,
    letterSpacing: 2,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 50,
    right: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerText: {
    fontSize: 7,
    color: C.textMuted,
  },
  footerPage: {
    fontSize: 7,
    color: C.gold,
  },

  // Typography
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: C.text,
    marginBottom: 20,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: C.gold,
    marginBottom: 12,
  },
  body: {
    fontSize: 10,
    color: C.textMuted,
    lineHeight: 1.6,
    marginBottom: 12,
  },
  bodyBold: {
    fontSize: 10,
    color: C.text,
    lineHeight: 1.6,
    fontWeight: "bold",
    marginBottom: 12,
  },

  // Pain box
  painBox: {
    backgroundColor: C.surface,
    borderWidth: 2,
    borderColor: C.gold,
    borderRadius: 10,
    padding: 30,
    marginVertical: 25,
  },
  painText: {
    fontSize: 18,
    fontWeight: "bold",
    color: C.gold,
    textAlign: "center",
    lineHeight: 1.5,
  },

  // Opportunity points
  opportunityRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 14,
    paddingLeft: 4,
  },
  opportunityNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: C.gold,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  opportunityNumberText: {
    fontSize: 12,
    fontWeight: "bold",
    color: C.bg,
  },
  opportunityText: {
    flex: 1,
    fontSize: 10,
    color: C.text,
    lineHeight: 1.5,
    paddingTop: 4,
  },

  // Options table
  optionsRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
  },
  optionCol: {
    flex: 1,
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 10,
    padding: 18,
  },
  optionColGold: {
    flex: 1,
    backgroundColor: C.surface,
    borderWidth: 2,
    borderColor: C.gold,
    borderRadius: 10,
    padding: 18,
  },
  optionColPurple: {
    flex: 1,
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.purple,
    borderRadius: 10,
    padding: 18,
  },
  optionEmoji: {
    fontSize: 20,
    textAlign: "center",
    marginBottom: 6,
  },
  optionName: {
    fontSize: 13,
    fontWeight: "bold",
    color: C.text,
    textAlign: "center",
    marginBottom: 6,
  },
  optionNameGold: {
    fontSize: 13,
    fontWeight: "bold",
    color: C.gold,
    textAlign: "center",
    marginBottom: 6,
  },
  optionNamePurple: {
    fontSize: 13,
    fontWeight: "bold",
    color: C.purple,
    textAlign: "center",
    marginBottom: 6,
  },
  optionPrice: {
    fontSize: 22,
    fontWeight: "bold",
    color: C.text,
    textAlign: "center",
    marginBottom: 3,
  },
  optionPriceGold: {
    fontSize: 22,
    fontWeight: "bold",
    color: C.gold,
    textAlign: "center",
    marginBottom: 3,
  },
  optionUnit: {
    fontSize: 8,
    color: C.textMuted,
    textAlign: "center",
    marginBottom: 14,
  },
  optionService: {
    fontSize: 8,
    color: C.textMuted,
    marginBottom: 6,
    paddingLeft: 8,
  },
  optionServiceDot: {
    fontSize: 8,
    color: C.gold,
  },
  optionRoi: {
    fontSize: 10,
    fontWeight: "bold",
    color: C.green,
    textAlign: "center",
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: C.border,
  },
  recommendedBadge: {
    backgroundColor: C.gold,
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 14,
    marginTop: 10,
    alignSelf: "center",
  },
  recommendedText: {
    fontSize: 7,
    fontWeight: "bold",
    color: C.bg,
    textTransform: "uppercase",
    letterSpacing: 2,
  },

  // ROI bars
  roiContainer: {
    marginTop: 25,
    marginBottom: 20,
  },
  roiBarRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },
  roiBarLabel: {
    width: 100,
    fontSize: 9,
    color: C.textMuted,
    textAlign: "right",
    paddingRight: 12,
  },
  roiBarTrack: {
    flex: 1,
    height: 32,
    backgroundColor: C.surface,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: C.border,
    overflow: "hidden",
    position: "relative",
  },
  roiBarValue: {
    fontSize: 9,
    fontWeight: "bold",
    position: "absolute",
    right: 8,
    top: 9,
  },

  // ROI metrics row
  roiMetricsRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
  },
  roiMetricCard: {
    flex: 1,
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
  },
  roiMetricLabel: {
    fontSize: 8,
    color: C.textMuted,
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  roiMetricValue: {
    fontSize: 24,
    fontWeight: "bold",
  },
  roiMetricNote: {
    fontSize: 7,
    color: C.textMuted,
    marginTop: 4,
    textAlign: "center",
  },

  // CGV
  cgvSection: {
    marginBottom: 20,
  },
  cgvRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  cgvLabel: {
    fontSize: 9,
    color: C.textMuted,
    width: 140,
  },
  cgvValue: {
    fontSize: 9,
    color: C.text,
    flex: 1,
  },
  cgvDivider: {
    height: 1,
    backgroundColor: C.border,
    marginVertical: 15,
  },
});

// ── Props ─────────────────────────────────────────────

export interface ProposalOption {
  price: string;
  services: string[];
}

export interface ProposalProps {
  clientName: string;
  sector: string;
  pain: string;
  memorablePhrase: string;
  options: {
    essentiel: ProposalOption;
    croissance: ProposalOption;
    domination: ProposalOption;
  };
  roi: {
    essentiel: number;
    croissance: number;
    domination: number;
  };
  ca?: number;
}

// ── Sector intelligence snippets ──────────────────────
const SECTOR_INTEL: Record<string, { stat: string; trend: string; competitors: string }> = {
  Agroalimentaire: {
    stat: "Le marche agroalimentaire caribeen represente 4,2 milliards EUR avec une croissance de 6,8% par an.",
    trend: "L'IA generative transforme la supply chain alimentaire : optimisation des stocks, prevision de la demande, et tracabilite automatisee.",
    competitors: "Les acteurs traditionnels tardent a adopter l'IA, creant une fenetre d'opportunite de 18 a 24 mois pour les pionniers."
  },
  Tech: {
    stat: "L'ecosysteme tech antillais croit de 23% annuellement, porte par la transformation numerique des PME.",
    trend: "Les entreprises tech qui integrent l'IA dans leurs produits multiplient leur valorisation par 2,5 en moyenne.",
    competitors: "La concurrence locale reste faible en IA generative — moins de 3 acteurs serieux sur le territoire."
  },
  Restauration: {
    stat: "La restauration en Martinique genere 380M EUR/an. 72% des etablissements n'ont aucune presence digitale optimisee.",
    trend: "L'IA revolutionne le secteur : menu dynamique, gestion des commandes, marketing automatise, chatbots de reservation.",
    competitors: "Aucun acteur local ne propose de solution IA integree pour la restauration — le marche est vierge."
  },
  Immobilier: {
    stat: "Le marche immobilier martiniquais est evalue a 1,8 milliard EUR avec 2 400 transactions annuelles.",
    trend: "L'IA permet la generation automatique de visites virtuelles, l'estimation predictive et le marketing cible.",
    competitors: "Les agences traditionnelles sous-investissent massivement en digital — gap technologique majeur."
  },
  Commerce: {
    stat: "Le commerce de detail en Martinique pese 2,1 milliards EUR. L'e-commerce represente seulement 8% — contre 15% en metropole.",
    trend: "La combinaison IA + e-commerce permet de tripler le taux de conversion et de reduire les couts marketing de 40%.",
    competitors: "Le commerce local digital est domine par des solutions generiques mal adaptees au marche antillais."
  },
};

function getSectorIntel(sector: string) {
  return SECTOR_INTEL[sector] ?? {
    stat: `Le secteur ${sector} connait une transformation profonde portee par l'intelligence artificielle, avec des gains de productivite de 25 a 45% pour les early adopters.`,
    trend: `Les entreprises du secteur ${sector} qui adoptent l'IA generative constatent en moyenne 35% de gains de productivite sur leurs processus metier dans les 6 premiers mois.`,
    competitors: `Le paysage concurrentiel caribeen en ${sector} revele des opportunites significatives. Les acteurs qui integrent l'IA prennent un avantage competitif durable.`,
  };
}

// ── Opportunity points generator ──────────────────────
function getOpportunities(sector: string, pain: string) {
  return [
    `Automatisation intelligente des processus metier ${sector.toLowerCase()} — reduire de 40% le temps passe sur les taches repetitives grace aux agents IA configures sur mesure.`,
    `Presence digitale augmentee par l'IA — contenu genere, marketing automatise, et chatbot 24/7 pour capturer chaque opportunite commerciale.`,
    `Tableau de bord decisionnaire IA — exploiter vos donnees en temps reel pour prendre des decisions eclairees et anticiper les tendances du marche.`,
  ];
}

// ── Bar component (simple View-based bar) ──────────────
function RoiBar({ label, currentValue, projectedValue, barColor, maxValue }: {
  label: string;
  currentValue: number;
  projectedValue: number;
  barColor: string;
  maxValue: number;
}) {
  const currentWidth = Math.min((currentValue / maxValue) * 100, 100);
  const projectedWidth = Math.min((projectedValue / maxValue) * 100, 100);

  return (
    <View>
      {/* Label */}
      <Text style={{ fontSize: 9, color: C.textMuted, marginBottom: 6 }}>{label}</Text>

      {/* Current state bar */}
      <View style={s.roiBarRow}>
        <Text style={s.roiBarLabel}>Etat actuel</Text>
        <View style={s.roiBarTrack}>
          <View
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: `${currentWidth}%`,
              backgroundColor: C.border,
              borderRadius: 5,
            }}
          />
          <Text style={[s.roiBarValue, { color: C.textMuted }]}>
            {currentValue.toLocaleString("fr-FR")} EUR
          </Text>
        </View>
      </View>

      {/* Projected bar */}
      <View style={s.roiBarRow}>
        <Text style={s.roiBarLabel}>Avec BYSS</Text>
        <View style={s.roiBarTrack}>
          <View
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: `${projectedWidth}%`,
              backgroundColor: barColor,
              borderRadius: 5,
            }}
          />
          <Text style={[s.roiBarValue, { color: C.text }]}>
            {projectedValue.toLocaleString("fr-FR")} EUR
          </Text>
        </View>
      </View>
    </View>
  );
}

// ── PDF Component ─────────────────────────────────────

export function ProposalPDF({
  clientName,
  sector,
  pain,
  memorablePhrase,
  options,
  roi,
  ca,
}: ProposalProps) {
  const today = new Date().toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const intel = getSectorIntel(sector);
  const opportunities = getOpportunities(sector, pain);

  // Estimate CA for ROI bars
  const baseCA = ca ?? 500000;
  const roiEssentiel = Math.round(baseCA * (1 + roi.essentiel / 100));
  const roiCroissance = Math.round(baseCA * (1 + roi.croissance / 100));
  const roiDomination = Math.round(baseCA * (1 + roi.domination / 100));
  const maxBar = roiDomination * 1.1;

  return (
    <Document>
      {/* ═══════════════════════════════════════════════
          PAGE 1 — COVER
          ═══════════════════════════════════════════════ */}
      <Page size="A4" style={s.page}>
        <View style={s.coverContainer}>
          {/* Logo */}
          <View style={s.coverLogoArea}>
            <Text style={s.coverLogoText}>B</Text>
          </View>

          <Text style={s.coverBrand}>BYSS GROUP</Text>
          <Text style={s.coverSubtitle}>Proposition Commerciale</Text>
          <View style={s.coverLine} />
          <Text style={s.coverClient}>{clientName}</Text>
          <Text style={s.coverDate}>{today}</Text>
          <Text style={s.coverConfidential}>Document confidentiel</Text>
        </View>

        <View style={s.footer}>
          <Text style={s.footerText}>BYSS GROUP SAS — Premier Studio IA de la Martinique</Text>
          <Text style={s.footerPage}>1 / {TOTAL_PAGES}</Text>
        </View>
      </Page>

      {/* ═══════════════════════════════════════════════
          PAGE 2 — MARKET ANALYSIS
          ═══════════════════════════════════════════════ */}
      <Page size="A4" style={s.contentPage}>
        <View style={s.pageHeader}>
          <Text style={s.pageHeaderTitle}>Analyse du Marche</Text>
          <Text style={s.pageHeaderLogo}>BYSS GROUP</Text>
        </View>

        <Text style={s.sectionTitle}>Contexte Sectoriel : {sector}</Text>

        <Text style={s.bodyBold}>Chiffres cles du marche</Text>
        <Text style={s.body}>{intel.stat}</Text>

        <Text style={s.sectionSubtitle}>Tendances &amp; Opportunites IA</Text>
        <Text style={s.body}>{intel.trend}</Text>

        <Text style={s.sectionSubtitle}>Paysage Concurrentiel</Text>
        <Text style={s.body}>{intel.competitors}</Text>

        {memorablePhrase && (
          <View style={{ marginTop: 20, paddingHorizontal: 20 }}>
            <Text
              style={{
                fontSize: 12,
                color: C.gold,
                fontStyle: "italic",
                textAlign: "center",
                lineHeight: 1.6,
              }}
            >
              {"\u00AB"} {memorablePhrase} {"\u00BB"}
            </Text>
          </View>
        )}

        <View style={s.footer}>
          <Text style={s.footerText}>Confidentiel — {clientName}</Text>
          <Text style={s.footerPage}>2 / {TOTAL_PAGES}</Text>
        </View>
      </Page>

      {/* ═══════════════════════════════════════════════
          PAGE 3 — PAIN DIAGNOSIS
          ═══════════════════════════════════════════════ */}
      <Page size="A4" style={s.contentPage}>
        <View style={s.pageHeader}>
          <Text style={s.pageHeaderTitle}>Diagnostic</Text>
          <Text style={s.pageHeaderLogo}>BYSS GROUP</Text>
        </View>

        <Text style={s.sectionTitle}>Votre Defi Principal</Text>

        {/* Large pain statement */}
        <View style={s.painBox}>
          <Text style={s.painText}>{pain}</Text>
        </View>

        <Text style={s.sectionSubtitle}>3 Leviers d&apos;Acceleration Identifies</Text>

        {/* Numbered opportunity points */}
        {opportunities.map((opp, i) => (
          <View key={i} style={s.opportunityRow}>
            <View style={s.opportunityNumber}>
              <Text style={s.opportunityNumberText}>{i + 1}</Text>
            </View>
            <Text style={s.opportunityText}>{opp}</Text>
          </View>
        ))}

        <Text
          style={{
            fontSize: 10,
            color: C.gold,
            fontWeight: "bold",
            marginTop: 20,
            textAlign: "center",
          }}
        >
          Chaque levier est deployable en moins de 4 semaines.
        </Text>

        <View style={s.footer}>
          <Text style={s.footerText}>Confidentiel — {clientName}</Text>
          <Text style={s.footerPage}>3 / {TOTAL_PAGES}</Text>
        </View>
      </Page>

      {/* ═══════════════════════════════════════════════
          PAGE 4 — PRICING TABLE (3 columns)
          ═══════════════════════════════════════════════ */}
      <Page size="A4" style={s.contentPage}>
        <View style={s.pageHeader}>
          <Text style={s.pageHeaderTitle}>Nos Solutions</Text>
          <Text style={s.pageHeaderLogo}>BYSS GROUP</Text>
        </View>

        <Text style={s.sectionTitle}>Choisissez votre trajectoire</Text>
        <Text style={s.body}>
          Trois formules calibrees pour repondre a vos enjeux. Chaque option est deployable sous 2 a 4 semaines.
        </Text>

        <View style={s.optionsRow}>
          {/* Essentiel */}
          <View style={s.optionCol}>
            <Text style={s.optionEmoji}>{"\uD83E\uDD49"}</Text>
            <Text style={s.optionName}>Essentiel</Text>
            <Text style={s.optionPrice}>{options.essentiel.price}</Text>
            <Text style={s.optionUnit}>EUR HT / mois</Text>
            {options.essentiel.services.map((svc, i) => (
              <Text key={i} style={s.optionService}>
                <Text style={s.optionServiceDot}>{"\u2022"} </Text>
                {svc}
              </Text>
            ))}
            <Text style={s.optionRoi}>ROI estime : +{roi.essentiel}%</Text>
          </View>

          {/* Croissance — GOLD highlight + Recommande */}
          <View style={s.optionColGold}>
            <Text style={s.optionEmoji}>{"\uD83E\uDD47"}</Text>
            <Text style={s.optionNameGold}>Croissance</Text>
            <Text style={s.optionPriceGold}>{options.croissance.price}</Text>
            <Text style={s.optionUnit}>EUR HT / mois</Text>
            {options.croissance.services.map((svc, i) => (
              <Text key={i} style={s.optionService}>
                <Text style={s.optionServiceDot}>{"\u2022"} </Text>
                {svc}
              </Text>
            ))}
            <Text style={[s.optionRoi, { color: C.gold }]}>ROI estime : +{roi.croissance}%</Text>
            <View style={s.recommendedBadge}>
              <Text style={s.recommendedText}>Recommande</Text>
            </View>
          </View>

          {/* Domination — Premium purple */}
          <View style={s.optionColPurple}>
            <Text style={s.optionEmoji}>{"\uD83D\uDC8E"}</Text>
            <Text style={s.optionNamePurple}>Domination</Text>
            <Text style={s.optionPrice}>{options.domination.price}</Text>
            <Text style={s.optionUnit}>EUR HT / mois</Text>
            {options.domination.services.map((svc, i) => (
              <Text key={i} style={s.optionService}>
                <Text style={s.optionServiceDot}>{"\u2022"} </Text>
                {svc}
              </Text>
            ))}
            <Text style={[s.optionRoi, { color: C.purple }]}>ROI estime : +{roi.domination}%</Text>
          </View>
        </View>

        <View style={s.footer}>
          <Text style={s.footerText}>Confidentiel — {clientName}</Text>
          <Text style={s.footerPage}>4 / {TOTAL_PAGES}</Text>
        </View>
      </Page>

      {/* ═══════════════════════════════════════════════
          PAGE 5 — ROI PROJECTION (Bar Chart)
          ═══════════════════════════════════════════════ */}
      <Page size="A4" style={s.contentPage}>
        <View style={s.pageHeader}>
          <Text style={s.pageHeaderTitle}>Retour sur Investissement</Text>
          <Text style={s.pageHeaderLogo}>BYSS GROUP</Text>
        </View>

        <Text style={s.sectionTitle}>Projections ROI a 12 mois</Text>
        <Text style={s.body}>
          Estimations basees sur les benchmarks sectoriels {sector} et les
          resultats observes chez nos clients. Base de calcul : CA annuel estime de {baseCA.toLocaleString("fr-FR")} EUR.
        </Text>

        {/* Bar chart: Current vs BYSS for each tier */}
        <View style={s.roiContainer}>
          {/* Essentiel bars */}
          <RoiBar
            label="Essentiel"
            currentValue={baseCA}
            projectedValue={roiEssentiel}
            barColor={C.amber}
            maxValue={maxBar}
          />

          {/* Croissance bars */}
          <RoiBar
            label="Croissance"
            currentValue={baseCA}
            projectedValue={roiCroissance}
            barColor={C.gold}
            maxValue={maxBar}
          />

          {/* Domination bars */}
          <RoiBar
            label="Domination"
            currentValue={baseCA}
            projectedValue={roiDomination}
            barColor={C.green}
            maxValue={maxBar}
          />
        </View>

        {/* Metric cards */}
        <View style={s.roiMetricsRow}>
          <View style={s.roiMetricCard}>
            <Text style={s.roiMetricLabel}>Productivite</Text>
            <Text style={[s.roiMetricValue, { color: C.amber }]}>+35%</Text>
            <Text style={s.roiMetricNote}>Gains moyens constates</Text>
          </View>
          <View style={s.roiMetricCard}>
            <Text style={s.roiMetricLabel}>Couts Ops</Text>
            <Text style={[s.roiMetricValue, { color: C.gold }]}>-25%</Text>
            <Text style={s.roiMetricNote}>Reduction par l&apos;IA</Text>
          </View>
          <View style={s.roiMetricCard}>
            <Text style={s.roiMetricLabel}>Conversion</Text>
            <Text style={[s.roiMetricValue, { color: C.green }]}>x2.5</Text>
            <Text style={s.roiMetricNote}>Taux moyen booste</Text>
          </View>
        </View>

        <View style={s.footer}>
          <Text style={s.footerText}>Confidentiel — {clientName}</Text>
          <Text style={s.footerPage}>5 / {TOTAL_PAGES}</Text>
        </View>
      </Page>

      {/* ═══════════════════════════════════════════════
          PAGE 6 — CGV
          ═══════════════════════════════════════════════ */}
      <Page size="A4" style={s.contentPage}>
        <View style={s.pageHeader}>
          <Text style={s.pageHeaderTitle}>Conditions Generales</Text>
          <Text style={s.pageHeaderLogo}>BYSS GROUP</Text>
        </View>

        <Text style={s.sectionTitle}>Conditions de Vente</Text>

        {/* Payment terms */}
        <View style={s.cgvSection}>
          <Text style={s.sectionSubtitle}>Modalites de Paiement</Text>
          <View style={s.cgvRow}>
            <Text style={s.cgvLabel}>Echeancier projet</Text>
            <Text style={s.cgvValue}>30% a la commande / 40% a mi-parcours / 30% a la livraison</Text>
          </View>
          <View style={s.cgvRow}>
            <Text style={s.cgvLabel}>Option paiement</Text>
            <Text style={s.cgvValue}>100% a 30 jours (remise de 5% applicable)</Text>
          </View>
          <View style={s.cgvRow}>
            <Text style={s.cgvLabel}>Delai de paiement</Text>
            <Text style={s.cgvValue}>30 jours fin de mois</Text>
          </View>
          <View style={s.cgvRow}>
            <Text style={s.cgvLabel}>Moyens acceptes</Text>
            <Text style={s.cgvValue}>Virement bancaire, cheque, carte (via Stripe)</Text>
          </View>
        </View>

        <View style={s.cgvDivider} />

        {/* Tax info */}
        <View style={s.cgvSection}>
          <Text style={s.sectionSubtitle}>Fiscalite</Text>
          <View style={s.cgvRow}>
            <Text style={s.cgvLabel}>TVA applicable</Text>
            <Text style={s.cgvValue}>8,5% (taux Martinique — art. 296 CGI)</Text>
          </View>
          <View style={s.cgvRow}>
            <Text style={s.cgvLabel}>Tous les prix</Text>
            <Text style={s.cgvValue}>Exprimes en euros hors taxes (EUR HT)</Text>
          </View>
        </View>

        <View style={s.cgvDivider} />

        {/* Company info */}
        <View style={s.cgvSection}>
          <Text style={s.sectionSubtitle}>Informations Legales</Text>
          <View style={s.cgvRow}>
            <Text style={s.cgvLabel}>Raison sociale</Text>
            <Text style={s.cgvValue}>BYSS GROUP SAS</Text>
          </View>
          <View style={s.cgvRow}>
            <Text style={s.cgvLabel}>Siege social</Text>
            <Text style={s.cgvValue}>Fort-de-France, Martinique (972)</Text>
          </View>
          <View style={s.cgvRow}>
            <Text style={s.cgvLabel}>Activite</Text>
            <Text style={s.cgvValue}>Premier Studio IA de la Martinique</Text>
          </View>
          <View style={s.cgvRow}>
            <Text style={s.cgvLabel}>Dirigeant</Text>
            <Text style={s.cgvValue}>Gary Bissol, Fondateur &amp; CEO</Text>
          </View>
          <View style={s.cgvRow}>
            <Text style={s.cgvLabel}>Contact</Text>
            <Text style={s.cgvValue}>contact@byss-group.com</Text>
          </View>
        </View>

        <View style={s.cgvDivider} />

        <Text style={s.body}>
          La presente proposition est valable 30 jours a compter de sa date
          d&apos;emission. Passe ce delai, BYSS GROUP se reserve le droit de
          reviser les conditions tarifaires.
        </Text>
        <Text style={s.body}>
          En cas de litige, les parties s&apos;engagent a rechercher une
          solution amiable. A defaut, le tribunal de commerce de Fort-de-France
          sera seul competent.
        </Text>

        <View style={s.footer}>
          <Text style={s.footerText}>BYSS GROUP SAS — {today}</Text>
          <Text style={s.footerPage}>6 / {TOTAL_PAGES}</Text>
        </View>
      </Page>
    </Document>
  );
}

// ── Server-side render to buffer ──────────────────────

export async function renderProposalPDF(props: ProposalProps): Promise<Buffer> {
  return renderToBuffer(<ProposalPDF {...props} />);
}
