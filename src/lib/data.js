export const tracks = [
  { slug: "australia", flagCode: "au", country: "Australia", circuit: "Melbourne", type: "Misto Veloce" },
  { slug: "china", flagCode: "cn", country: "Cina", circuit: "Shanghai", type: "Gestione Gomme" },
  { slug: "japan", flagCode: "jp", country: "Giappone", circuit: "Suzuka", type: "Alto Carico" },
  { slug: "bahrain", flagCode: "bh", country: "Bahrain", circuit: "Sakhir", type: "Trazione e Frenata" },
  { slug: "saudi-arabia", flagCode: "sa", country: "Arabia Saudita", circuit: "Jedda", type: "Alta Velocità" },
  { slug: "usa-miami", flagCode: "us", country: "Stati Uniti", circuit: "Miami", type: "Cittadino Veloce" },
  { slug: "canada", flagCode: "ca", country: "Canada", circuit: "Montréal", type: "Chicane & Frenata" },
  { slug: "monaco", flagCode: "mc", country: "Monaco", circuit: "Monte Carlo", type: "Massimo Carico" },
  { slug: "spain", flagCode: "es", country: "Spagna", circuit: "Barcellona", type: "Aero Bilanciato" },
  { slug: "austria", flagCode: "at", country: "Austria", circuit: "Spielberg", type: "Giro Corto & Trazione" },
  { slug: "united-kingdom", flagCode: "gb", country: "Regno Unito", circuit: "Silverstone", type: "Curve Veloci" },
  { slug: "belgium", flagCode: "be", country: "Belgio", circuit: "Spa-Francorchamps", type: "Basso Drag" },
  { slug: "hungary", flagCode: "hu", country: "Ungheria", circuit: "Budapest", type: "Tortuoso & Guidato" },
  { slug: "netherlands", flagCode: "nl", country: "Paesi Bassi", circuit: "Zandvoort", type: "Curve Sopraelevate" },
  { slug: "italy-monza", flagCode: "it", country: "Italia", circuit: "Monza", type: "Top Speed (Basso Carico)" },
  { slug: "spain-madrid", flagCode: "es", country: "Spagna", circuit: "Madrid", type: "Cittadino & Alta Velocità" },
  { slug: "azerbaijan", flagCode: "az", country: "Azerbaigian", circuit: "Baku", type: "Rettilineo 2.2km & Castello" },
  { slug: "singapore", flagCode: "sg", country: "Singapore", circuit: "Marina Bay", type: "Cittadino Notturno" },
  { slug: "usa-cota", flagCode: "us", country: "Stati Uniti", circuit: "Austin", type: "Esses & Dislivelli" },
  { slug: "mexico", flagCode: "mx", country: "Messico", circuit: "Città del Messico", type: "Aria Rara & Rettilineo" },
  { slug: "brazil", flagCode: "br", country: "Brasile", circuit: "Interlagos", type: "Misto Fluido" },
  { slug: "usa-las-vegas", flagCode: "us", country: "Stati Uniti", circuit: "Las Vegas", type: "Bassissimo Carico" },
  { slug: "qatar", flagCode: "qa", country: "Qatar", circuit: "Losail", type: "Grip Laterale Costante" },
  { slug: "abu-dhabi", flagCode: "ae", country: "Emirati Arabi Uniti", circuit: "Yas Marina", type: "Trazione Settore 3" },
  { slug: "italy-imola", flagCode: "it", country: "Italia", circuit: "Imola", type: "Cordoli & Trazione" },
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
