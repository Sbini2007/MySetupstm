export const tracks = [
  { slug: "bahrain", flagCode: "bh", country: "Bahrain", circuit: "Bahrain International Circuit", type: "Trazione e Frenata" },
  { slug: "saudi-arabia", flagCode: "sa", country: "Arabia Saudita", circuit: "Jeddah Corniche Circuit", type: "Alta Velocità" },
  { slug: "australia", flagCode: "au", country: "Australia", circuit: "Albert Park Circuit", type: "Misto Veloce" },
  { slug: "japan", flagCode: "jp", country: "Giappone", circuit: "Suzuka Circuit", type: "Alto Carico" },
  { slug: "china", flagCode: "cn", country: "Cina", circuit: "Shanghai International Circuit", type: "Gestione Gomme" },
  { slug: "usa-miami", flagCode: "us", country: "Stati Uniti", circuit: "Miami International Autodrome", type: "Cittadino Veloce" },
  { slug: "italy-imola", flagCode: "it", country: "Italia", circuit: "Autodromo Enzo e Dino Ferrari", type: "Cordoli & Trazione" },
  { slug: "monaco", flagCode: "mc", country: "Monaco", circuit: "Circuit de Monaco", type: "Massimo Carico" },
  { slug: "spain", flagCode: "es", country: "Spagna", circuit: "Circuit de Barcelona-Catalunya", type: "Aero Bilanciato" },
  { slug: "canada", flagCode: "ca", country: "Canada", circuit: "Circuit Gilles Villeneuve", type: "Chicane & Frenata" },
  { slug: "austria", flagCode: "at", country: "Austria", circuit: "Red Bull Ring", type: "Giro Corto & Trazione" },
  { slug: "united-kingdom", flagCode: "gb", country: "Regno Unito", circuit: "Silverstone Circuit", type: "Curve Veloci" },
  { slug: "hungary", flagCode: "hu", country: "Ungheria", circuit: "Hungaroring", type: "Tortuoso & Guidato" },
  { slug: "belgium", flagCode: "be", country: "Belgio", circuit: "Circuit de Spa-Francorchamps", type: "Basso Drag" },
  { slug: "netherlands", flagCode: "nl", country: "Paesi Bassi", circuit: "Circuit Zandvoort", type: "Curve Sopraelevate" },
  { slug: "italy-monza", flagCode: "it", country: "Italia", circuit: "Autodromo Nazionale Monza", type: "Top Speed (Basso Carico)" },
  { slug: "azerbaijan", flagCode: "az", country: "Azerbaigian", circuit: "Baku City Circuit", type: "Rettilineo 2.2km & Castello" },
  { slug: "singapore", flagCode: "sg", country: "Singapore", circuit: "Marina Bay Street Circuit", type: "Cittadino Notturno" },
  { slug: "usa-cota", flagCode: "us", country: "Stati Uniti", circuit: "Circuit of the Americas", type: "Esses & Dislivelli" },
  { slug: "mexico", flagCode: "mx", country: "Messico", circuit: "Autodromo Hermanos Rodriguez", type: "Aria Rara & Rettilineo" },
  { slug: "brazil", flagCode: "br", country: "Brasile", circuit: "Autodromo de Interlagos", type: "Misto Fluido" },
  { slug: "usa-las-vegas", flagCode: "us", country: "Stati Uniti", circuit: "Las Vegas Strip Circuit", type: "Bassissimo Carico" },
  { slug: "qatar", flagCode: "qa", country: "Qatar", circuit: "Lusail International Circuit", type: "Grip Laterale Costante" },
  { slug: "abu-dhabi", flagCode: "ae", country: "Emirati Arabi", circuit: "Yas Marina Circuit", type: "Trazione Settore 3" },
];

export const features = [
  "Setup gara e qualifica",
  "Note tecniche per circuito",
  "Supporto premium su Discord",
  "Bilanciamento per pad e volante",
  "Focus usura gomme",
  "Aggiornamenti dopo patch",
];

export const reviews = [
  "Sia i setup da gara che quelli da qualifica sono molto validi: mantengono stabilità e velocità di punta senza sacrificare la guidabilità.",
  "Setup di Cina ottimo in gara: 100% grip, bassissima usura gomme, macchina molto stabile e pulita. Per me è perfetto.",
  "Ho provato il setup in Spagna, una bomba: equilibrio ottimo tra stabilità, entrata e velocità di uscita curva.",
  "In Monaco la vettura è molto più precisa e rassicurante, specialmente in qualifica quando spingi forte sui cordoli.",
];

export const guides = [
  { title: "Bilanciamento aero", description: "Trova la finestra giusta tra punta, stabilita e carico nelle curve veloci." },
  { title: "Pressioni gomme", description: "Regola le pressioni per grip iniziale, temperatura e durata dello stint." },
  { title: "Sospensioni", description: "Costruisci una vettura prevedibile in ingresso, centro curva e trazione." },
  { title: "Differenziale", description: "Ottimizza rotazione e uscita curva tra qualifica e gara." },
  { title: "Assetto gara", description: "Trasforma il giro secco in passo costante e meno consumo gomme." },
  { title: "Gestione degrado", description: "Leggi i segnali delle gomme e correggi lo stile di guida." },
];

export const setups = {
  bahrain: {
    frontWing: "+4",
    rearWing: "+6",
    differential: "75%",
    suspension: "Soft rear, medium front",
    tyrePressure: "21.8 / 19.3",
    transmission: "4.18",
    brakeBias: "54.5%",
    notes: "Stable medium-downforce setup with strong front grip on entry.",
  },
  monaco: {
    frontWing: "+8",
    rearWing: "+11",
    differential: "65%",
    suspension: "Soft all around",
    tyrePressure: "19.5 / 18.6",
    transmission: "3.45",
    brakeBias: "58.0%",
    notes: "Low speed control and maximum mechanical grip for clean laps.",
  },
  china: {
    frontWing: "+5",
    rearWing: "+9",
    differential: "72%",
    suspension: "Medium",
    tyrePressure: "20.0 / 18.8",
    transmission: "4.00",
    brakeBias: "55.0%",
    notes: "Balanced setup for high-speed corners and rear stability.",
  },
  netherlands: {
    frontWing: "+6",
    rearWing: "+10",
    differential: "70%",
    suspension: "Medium rear, soft front",
    tyrePressure: "20.3 / 18.9",
    transmission: "4.10",
    brakeBias: "55.5%",
    notes: "Strong rotation and consistent tyre life around fast flowing corners.",
  },
};

export const trackHighlights = [
  "Bahrain International Circuit",
  "Jeddah Corniche Circuit",
  "Suzuka Circuit",
  "Circuit de Monaco",
  "Spa-Francorchamps",
  "Yas Marina Circuit",
];
