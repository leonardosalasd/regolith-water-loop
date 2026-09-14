import type { Locale } from "./i18n";

export type Reference = {
  key: string;
  citation: string;
  href: string;
  link: string;
  use: Record<Locale, string>;
};

export type ReferenceGroup = {
  title: Record<Locale, string>;
  items: Reference[];
};

const doi = (id: string) => ({ href: `https://doi.org/${id}`, link: `doi:${id}` });

export const references: ReferenceGroup[] = [
  {
    title: { en: "Mars environment", es: "Entorno marciano" },
    items: [
      {
        key: "Hecht 2009",
        citation:
          "Hecht, M. H. et al. Detection of perchlorate and the soluble chemistry of martian soil at the Phoenix lander site. Science 325 (5936), 64–67.",
        ...doi("10.1126/science.1172466"),
        use: {
          en: "0.4–0.6 % perchlorate by mass; ice table about 5 cm deep; pH 7.7",
          es: "0.4–0.6 % de perclorato en masa; hielo a unos 5 cm; pH 7.7",
        },
      },
      {
        key: "Glavin 2013",
        citation:
          "Glavin, D. P. et al. Evidence for perchlorates and the origin of chlorinated hydrocarbons detected by SAM at the Rocknest aeolian deposit in Gale Crater. J. Geophys. Res. Planets 118 (10), 1955–1973.",
        ...doi("10.1002/jgre.20144"),
        use: {
          en: "Perchlorate at Gale Crater, far from the Phoenix site",
          es: "Perclorato en el cráter Gale, lejos del sitio de Phoenix",
        },
      },
      {
        key: "Davila 2013",
        citation:
          "Davila, A. F., Willson, D., Coates, J. D., McKay, C. P. Perchlorate on Mars: a chemical hazard and a resource for humans. Int. J. Astrobiology 12 (4), 321–325.",
        ...doi("10.1017/S1473550413000189"),
        use: {
          en: "0.5–1 % perchlorate; hazard to crew; proposes biochemical removal that also yields oxygen",
          es: "0.5–1 % de perclorato; riesgo para la tripulación; propone quitarlo por vía bioquímica y recuperar oxígeno",
        },
      },
      {
        key: "Morgan 2021",
        citation:
          "Morgan, G. A. et al. Availability of subsurface water-ice resources in the northern mid-latitudes of Mars. Nature Astronomy 5, 230–236.",
        ...doi("10.1038/s41550-020-01290-z"),
        use: {
          en: "Shallow ice as the habitat water source",
          es: "Hielo somero como fuente de agua del hábitat",
        },
      },
      {
        key: "Cannon 2019",
        citation:
          "Cannon, K. M. et al. Mars global simulant MGS-1: a Rocknest-based open standard for basaltic martian regolith simulants. Icarus 317, 470–478.",
        ...doi("10.1016/j.icarus.2018.08.019"),
        use: {
          en: "Martian regolith is basaltic, hence basaltic scoria on the bench",
          es: "El regolito marciano es basáltico; por eso escoria basáltica en banco",
        },
      },
      {
        key: "Haberle 2000",
        citation:
          "Haberle, R. M., DeVincenzi, D. L. On the stability of liquid water on present day Mars. Mars Global Surveyor Workshop, Boulder.",
        href: "https://ntrs.nasa.gov/citations/20010084314",
        link: "NTRS 20010084314",
        use: {
          en: "Surface pressure and temperature do not allow stable liquid water",
          es: "La presión y temperatura de superficie no permiten agua líquida estable",
        },
      },
      {
        key: "NASA Glenn",
        citation: "NASA Glenn Research Center. Mars. Beginner's Guide to Aeronautics.",
        href: "https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/mars/",
        link: "grc.nasa.gov",
        use: { en: "Surface gravity 3.7 m/s², 0.37 g", es: "Gravedad de superficie 3.7 m/s², 0.37 g" },
      },
      {
        key: "NASA Science",
        citation: "NASA Science. Mars: Facts.",
        href: "https://science.nasa.gov/mars/facts/",
        link: "science.nasa.gov",
        use: {
          en: "Surface temperature from about 20 °C down to about −153 °C",
          es: "Temperatura de superficie de unos 20 °C hasta unos −153 °C",
        },
      },
    ],
  },
  {
    title: { en: "Microbiology", es: "Microbiología" },
    items: [
      {
        key: "Coates 2004",
        citation:
          "Coates, J. D., Achenbach, L. A. Microbial perchlorate reduction: rocket-fuelled metabolism. Nature Reviews Microbiology 2 (7), 569–580.",
        ...doi("10.1038/nrmicro926"),
        use: {
          en: "Pathway through perchlorate reductase and chlorite dismutase",
          es: "Ruta por perclorato reductasa y clorito dismutasa",
        },
      },
      {
        key: "Ettwig 2012",
        citation:
          "Ettwig, K. F. et al. Bacterial oxygen production in the dark. Frontiers in Microbiology 3, 273.",
        ...doi("10.3389/fmicb.2012.00273"),
        use: {
          en: "Chlorite-derived oxygen is respired by the same cells",
          es: "El oxígeno del clorito lo respiran las mismas células",
        },
      },
      {
        key: "Mehta-Kolte 2017",
        citation:
          "Mehta-Kolte, M. G. et al. Mechanism of H₂S oxidation by the dissimilatory perchlorate-reducing microorganism Azospira suillum PS. mBio 8 (1), e02023-16.",
        ...doi("10.1128/mBio.02023-16"),
        use: {
          en: "Strain PS grown at 37 °C on lactate with perchlorate; lactate and acetate as donors",
          es: "La cepa PS crece a 37 °C con lactato y perclorato; lactato y acetato como donadores",
        },
      },
      {
        key: "Salinero 2009",
        citation:
          "Salinero, K. et al. Metabolic analysis of the soil microbe Dechloromonas aromatica str. RCB. BMC Genomics 10, 351.",
        ...doi("10.1186/1471-2164-10-351"),
        use: {
          en: "Strain RCB is a soil microbe that reduces perchlorate",
          es: "La cepa RCB es un microbio del suelo que reduce perclorato",
        },
      },
    ],
  },
  {
    title: { en: "Materials and processes", es: "Materiales y procesos" },
    items: [
      {
        key: "Ahmad 2014",
        citation:
          "Ahmad, M. et al. Biochar as a sorbent for contaminant management in soil and water: a review. Chemosphere 99, 19–33.",
        ...doi("10.1016/j.chemosphere.2013.10.071"),
        use: {
          en: "Biochar as an adsorbent in water treatment",
          es: "Biochar como adsorbente en tratamiento de agua",
        },
      },
      {
        key: "Raposo 2009",
        citation:
          "Raposo, F., De La Rubia, M. A., Borja, R. Methylene blue number as useful indicator to evaluate the adsorptive capacity of granular activated carbon in batch mode. J. Hazardous Materials 165 (1–3), 291–299.",
        ...doi("10.1016/j.jhazmat.2008.09.106"),
        use: {
          en: "Methylene blue as an indicator of carbon adsorption",
          es: "Azul de metileno como indicador de adsorción del carbón",
        },
      },
      {
        key: "Penn State",
        citation: "Penn State College of Earth and Mineral Sciences. EGEE 439, 4.1 Biomass Pyrolysis.",
        href: "https://courses.ems.psu.edu/egee439/node/537",
        link: "courses.ems.psu.edu",
        use: {
          en: "Slow pyrolysis near 500 °C: about 25 % char, 35 % liquid, 40 % gas",
          es: "Pirólisis lenta cerca de 500 °C: ~25 % carbón, 35 % líquido, 40 % gas",
        },
      },
      {
        key: "Emergency WASH",
        citation: "German Toilet Organization. Emergency WASH, T.9 Slow Sand Filtration.",
        href: "https://www.emergency-wash.org/water/en/technologies/technology/slow-sand-filtration",
        link: "emergency-wash.org",
        use: { en: "Slow sand filtration rate 0.1–0.4 m/h", es: "Filtración lenta en arena a 0.1–0.4 m/h" },
      },
    ],
  },
  {
    title: { en: "Standards and mission data", es: "Normas y datos de misión" },
    items: [
      {
        key: "BVAD",
        citation:
          "Ewert, M. K., Chen, T. T., Powell, C. D. (eds.) Life Support Baseline Values and Assumptions Document. NASA/TP-2015-218570/REV2, February 2022.",
        href: "https://ntrs.nasa.gov/citations/20210024855",
        link: "NTRS 20210024855",
        use: {
          en: "Oxygen 0.895 kg/CM-d (Table 3-31); hygiene wastewater 5.53 and 10.17 kg/CM-d (Table 4-21); trash 1.39 kg/CM-d (Tables 4-28, 4-29)",
          es: "Oxígeno 0.895 kg/tripulante-día (Tabla 3-31); agua gris de higiene 5.53 y 10.17 (Tabla 4-21); basura 1.39 (Tablas 4-28, 4-29)",
        },
      },
      {
        key: "NASA-STD-3001",
        citation:
          "NASA. NASA Spaceflight Human-System Standard, Volume 2: Human Factors, Habitability, and Environmental Health. Rev. E, May 2025.",
        href: "https://ntrs.nasa.gov/citations/20250004555",
        link: "NTRS 20250004555",
        use: {
          en: "Requirements V2 6004, 6026, 6046, 6050, 6051, 6052, 6053, 6153",
          es: "Requisitos V2 6004, 6026, 6046, 6050, 6051, 6052, 6053, 6153",
        },
      },
      {
        key: "NASA dust",
        citation: "Lowe, K. Establishing Crew Exposure Limits of Martian Dust. NASA, 21 July 2026.",
        href: "https://www.nasa.gov/general/establishing-crew-exposure-limits-of-martian-dust/",
        link: "nasa.gov",
        use: {
          en: "Martian dust below 10 µm: 0.1 mg/m³, 24-hour average, exposures up to 30 days",
          es: "Polvo marciano menor a 10 µm: 0.1 mg/m³, promedio de 24 h, exposiciones de hasta 30 días",
        },
      },
      {
        key: "COSPAR",
        citation:
          "COSPAR Panel on Planetary Protection. COSPAR Policy on Planetary Protection. Space Research Today, January 2026.",
        href: "https://cosparhq.cnes.fr/cospar-policy-on-planetary-protection/",
        link: "cosparhq.cnes.fr",
        use: {
          en: "Planetary protection framework for terrestrial organisms",
          es: "Marco de protección planetaria para organismos terrestres",
        },
      },
    ],
  },
];
