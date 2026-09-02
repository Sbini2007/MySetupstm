export const tracks = [
  { slug: "bahrain", flagCode: "bh", country: "Bahrain", circuit: "Bahrain International Circuit", type: "Rear traction" },
  { slug: "saudi-arabia", flagCode: "sa", country: "Saudi Arabia", circuit: "Jeddah Corniche Circuit", type: "High speed" },
  { slug: "australia", flagCode: "au", country: "Australia", circuit: "Albert Park Circuit", type: "Rotation" },
  { slug: "japan", flagCode: "jp", country: "Japan", circuit: "Suzuka Circuit", type: "Flow" },
  { slug: "china", flagCode: "cn", country: "China", circuit: "Shanghai International Circuit", type: "Tyre saving" },
  { slug: "usa-miami", flagCode: "us", country: "USA", circuit: "Miami International Autodrome", type: "Traction zones" },
  { slug: "italy-imola", flagCode: "it", country: "Italy", circuit: "Imola Circuit", type: "Kerbs" },
  { slug: "monaco", flagCode: "mc", country: "Monaco", circuit: "Circuit de Monaco", type: "Mechanical grip" },
  { slug: "spain", flagCode: "es", country: "Spain", circuit: "Barcelona-Catalunya Circuit", type: "Balanced aero" },
  { slug: "canada", flagCode: "ca", country: "Canada", circuit: "Circuit Gilles Villeneuve", type: "Braking" },
  { slug: "austria", flagCode: "at", country: "Austria", circuit: "Red Bull Ring", type: "Acceleration" },
  { slug: "united-kingdom", flagCode: "gb", country: "United Kingdom", circuit: "Silverstone Circuit", type: "Fast corners" },
  { slug: "hungary", flagCode: "hu", country: "Hungary", circuit: "Hungaroring", type: "Downforce" },
  { slug: "belgium", flagCode: "be", country: "Belgium", circuit: "Spa-Francorchamps", type: "Low drag" },
  { slug: "netherlands", flagCode: "nl", country: "Netherlands", circuit: "Zandvoort Circuit", type: "Banking" },
  { slug: "italy-monza", flagCode: "it", country: "Italy", circuit: "Monza Circuit", type: "Top speed" },
  { slug: "azerbaijan", flagCode: "az", country: "Azerbaijan", circuit: "Baku City Circuit", type: "Street speed" },
  { slug: "singapore", flagCode: "sg", country: "Singapore", circuit: "Marina Bay Street Circuit", type: "Stability" },
  { slug: "usa-cota", flagCode: "us", country: "USA", circuit: "Circuit of the Americas", type: "Sector mix" },
  { slug: "mexico", flagCode: "mx", country: "Mexico", circuit: "Autodromo Hermanos Rodriguez", type: "Thin air" },
  { slug: "brazil", flagCode: "br", country: "Brazil", circuit: "Interlagos Circuit", type: "Race pace" },
  { slug: "usa-las-vegas", flagCode: "us", country: "USA", circuit: "Las Vegas Strip Circuit", type: "Long straights" },
  { slug: "qatar", flagCode: "qa", country: "Qatar", circuit: "Lusail International Circuit", type: "Front wear" },
  { slug: "abu-dhabi", flagCode: "ae", country: "Abu Dhabi", circuit: "Yas Marina Circuit", type: "Exit traction" },
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

export const pricing = {
  title: "MYSETUPS PACK",
  price: "EUR 15",
  description: "Pagamento unico per sbloccare setup, guide, note premium e supporto Discord.",
};

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
