// Full 2026 Season F1 setups for all 24 circuits
// Covers race, quali, and wet profiles with accurate telemetry parameters

import { tracks } from "./data.js";

export const trackProfiles = {
  "bahrain": {
    type: "Trazione & Frenata",
    downforce: "Medio-Alto",
    topSpeed: "335 km/h",
    tyreStress: "Alto (4/5)",
    aeroWings: { race: [30, 26], quali: [32, 28], wet: [38, 34] },
    diff: { race: [58, 50], quali: [54, 48], wet: [65, 55] },
    susp: { race: [28, 14, 14, 8, 33, 44], quali: [30, 15, 15, 9, 31, 42], wet: [22, 10, 9, 5, 40, 53] },
    camber: { race: [-2.9, -1.9], quali: [-3.1, -2.0], wet: [-2.5, -1.6] },
    toe: { race: [0.06, 0.16], quali: [0.05, 0.14], wet: [0.08, 0.18] },
    brakes: { race: [54.5, 100], quali: [54.0, 100], wet: [56.0, 98] },
    psi: { race: [23.5, 21.0], quali: [24.0, 21.4], wet: [22.0, 19.8] },
    notes: {
      race: "Trazione e stabilità in frenata al tornantino cieco di Curva 10. Ottimale per limitare il surriscaldamento posteriore.",
      quali: "Avantreno reattivo nei cambi di direzione delle curve 6-7 con massimo grip all'apice.",
      wet: "Altezza maggiorata per drenare sui cordoli e staccate dolci sul fondo scivoloso del deserto."
    }
  },
  "saudi-arabia": {
    type: "Alta Velocità & Muri",
    downforce: "Basso-Medio",
    topSpeed: "348 km/h",
    tyreStress: "Alto (4/5)",
    aeroWings: { race: [20, 16], quali: [18, 14], wet: [28, 24] },
    diff: { race: [62, 52], quali: [58, 50], wet: [68, 58] },
    susp: { race: [32, 16, 16, 9, 32, 42], quali: [34, 18, 17, 10, 30, 40], wet: [24, 11, 10, 6, 42, 54] },
    camber: { race: [-3.0, -1.8], quali: [-3.2, -1.9], wet: [-2.6, -1.5] },
    toe: { race: [0.05, 0.15], quali: [0.04, 0.13], wet: [0.07, 0.17] },
    brakes: { race: [54.0, 100], quali: [53.5, 100], wet: [55.5, 96] },
    psi: { race: [24.0, 21.5], quali: [24.5, 22.0], wet: [22.4, 20.2] },
    notes: {
      race: "Stabilità assoluta nei curvoni veloci ciechi a oltre 250 km/h a filo dei muri di Jeddah.",
      quali: "Carico minimo per volare sui 3 lunghi allunghi DRS preservando rotazione all'ultima curva.",
      wet: "Molle ammorbidite per assorbire le imperfezioni e trazione progressiva fuori da curva 13."
    }
  },
  "australia": {
    type: "Misto Veloce & Parchi",
    downforce: "Medio",
    topSpeed: "336 km/h",
    tyreStress: "Medio (3/5)",
    aeroWings: { race: [28, 24], quali: [30, 26], wet: [36, 32] },
    diff: { race: [60, 52], quali: [56, 48], wet: [66, 56] },
    susp: { race: [30, 15, 15, 8, 33, 44], quali: [32, 17, 16, 9, 31, 42], wet: [23, 11, 10, 5, 41, 53] },
    camber: { race: [-2.9, -1.8], quali: [-3.0, -1.9], wet: [-2.5, -1.6] },
    toe: { race: [0.05, 0.15], quali: [0.05, 0.14], wet: [0.07, 0.17] },
    brakes: { race: [54.5, 100], quali: [54.0, 100], wet: [56.0, 98] },
    psi: { race: [23.6, 21.2], quali: [24.1, 21.6], wet: [22.1, 19.9] },
    notes: {
      race: "Bilanciamento perfetto per la chicane veloce curve 9-10 di Albert Park senza perdere la coda.",
      quali: "Puntato sull'anteriore per aggredire il punto di corda alla prima curva.",
      wet: "Barre antirollio sciolte per evitare scompensi sulle linee bianche scivolose."
    }
  },
  "japan": {
    type: "Alto Carico & Esse",
    downforce: "Molto Alto",
    topSpeed: "328 km/h",
    tyreStress: "Estremo (5/5)",
    aeroWings: { race: [38, 34], quali: [40, 36], wet: [44, 40] },
    diff: { race: [60, 52], quali: [56, 48], wet: [66, 56] },
    susp: { race: [35, 17, 17, 9, 32, 43], quali: [37, 19, 19, 11, 30, 41], wet: [25, 11, 10, 5, 42, 55] },
    camber: { race: [-3.2, -2.0], quali: [-3.4, -2.1], wet: [-2.7, -1.7] },
    toe: { race: [0.06, 0.17], quali: [0.05, 0.15], wet: [0.08, 0.19] },
    brakes: { race: [54.5, 100], quali: [54.0, 100], wet: [56.5, 97] },
    psi: { race: [24.0, 21.6], quali: [24.5, 22.0], wet: [22.3, 20.2] },
    notes: {
      race: "Reattività istantanea nei cambi di direzione delle Esse del 1° settore preservando la spalla anteriore destra.",
      quali: "Aderenza millimetrica nelle Esses e stabilità assoluta al leggendario curvone 130R in pieno.",
      wet: "Controllo progressivo sul bagnato del curvone Spoon e dell'uscita chicane del Triangolo."
    }
  },
  "china": {
    type: "Gestione Gomme & Chiocciola",
    downforce: "Medio-Alto",
    topSpeed: "338 km/h",
    tyreStress: "Molto Alto (4/5)",
    aeroWings: { race: [29, 25], quali: [31, 27], wet: [37, 33] },
    diff: { race: [60, 52], quali: [56, 48], wet: [66, 56] },
    susp: { race: [31, 15, 15, 8, 33, 44], quali: [33, 17, 16, 9, 31, 42], wet: [23, 11, 10, 5, 41, 54] },
    camber: { race: [-3.1, -1.9], quali: [-3.3, -2.0], wet: [-2.6, -1.6] },
    toe: { race: [0.06, 0.16], quali: [0.05, 0.14], wet: [0.08, 0.18] },
    brakes: { race: [54.5, 100], quali: [54.0, 100], wet: [56.0, 98] },
    psi: { race: [23.8, 21.3], quali: [24.3, 21.7], wet: [22.2, 20.0] },
    notes: {
      race: "Protegge la gomma anteriore sinistra nel lunghissimo raggio della Curva 1-2 a chiocciola.",
      quali: "Carico aerodinamico ottimale per staccare fortissimo in fondo al dritto da 1.2 km.",
      wet: "Pressioni studiate per non surriscaldare la gomma nei continui appoggi laterali bagnati."
    }
  },
  "usa-miami": {
    type: "Cittadino Veloce & Autostrada",
    downforce: "Basso-Medio",
    topSpeed: "345 km/h",
    tyreStress: "Medio-Alto (3.5/5)",
    aeroWings: { race: [24, 20], quali: [26, 22], wet: [34, 30] },
    diff: { race: [58, 50], quali: [54, 48], wet: [65, 55] },
    susp: { race: [29, 14, 14, 8, 34, 45], quali: [31, 16, 15, 9, 32, 43], wet: [22, 10, 9, 5, 42, 55] },
    camber: { race: [-2.9, -1.8], quali: [-3.1, -1.9], wet: [-2.5, -1.5] },
    toe: { race: [0.05, 0.15], quali: [0.04, 0.13], wet: [0.07, 0.17] },
    brakes: { race: [54.5, 100], quali: [54.0, 100], wet: [56.0, 97] },
    psi: { race: [23.6, 21.1], quali: [24.1, 21.5], wet: [22.1, 19.9] },
    notes: {
      race: "Ottima rotazione nello stretto del settore dello stadio e grande trazione per il lungo allungo.",
      quali: "Puntato per aggredire i cordoli della chicane lenta sotto il viadotto.",
      wet: "Assetto alto per assorbire i sobbalzi dell'asfalto poco drenante attorno all'Hard Rock Stadium."
    }
  },
  "italy-imola": {
    type: "Cordoli Alti & Saliscendi",
    downforce: "Alto",
    topSpeed: "330 km/h",
    tyreStress: "Medio-Alto (4/5)",
    aeroWings: { race: [34, 30], quali: [36, 32], wet: [42, 38] },
    diff: { race: [56, 48], quali: [52, 46], wet: [64, 54] },
    susp: { race: [26, 13, 12, 7, 34, 46], quali: [28, 14, 13, 8, 32, 44], wet: [20, 9, 8, 4, 43, 56] },
    camber: { race: [-2.9, -1.8], quali: [-3.1, -1.9], wet: [-2.5, -1.6] },
    toe: { race: [0.06, 0.16], quali: [0.05, 0.14], wet: [0.08, 0.18] },
    brakes: { race: [54.5, 100], quali: [54.0, 100], wet: [56.0, 98] },
    psi: { race: [23.4, 20.9], quali: [23.9, 21.3], wet: [22.0, 19.7] },
    notes: {
      race: "Molle calibrate morbidamente per scalare i cordoli delle chicane del Tamburello e della Variante Alta.",
      quali: "Assetto rapido nei cambi di pendenza alla Piratella e staccata pulita alle Acque Minerali.",
      wet: "Barre ammorbidite per non innescare pendoli violenti sui cordoli viscido-umidi."
    }
  },
  "monaco": {
    type: "Massimo Carico & Precisione",
    downforce: "Massimo",
    topSpeed: "292 km/h",
    tyreStress: "Bassissimo (1/5)",
    aeroWings: { race: [48, 44], quali: [50, 46], wet: [50, 50] },
    diff: { race: [52, 46], quali: [50, 45], wet: [60, 52] },
    susp: { race: [24, 12, 10, 6, 34, 45], quali: [26, 13, 11, 6, 32, 43], wet: [18, 8, 7, 4, 42, 56] },
    camber: { race: [-2.7, -1.7], quali: [-2.9, -1.8], wet: [-2.4, -1.5] },
    toe: { race: [0.05, 0.14], quali: [0.04, 0.12], wet: [0.07, 0.16] },
    brakes: { race: [55.0, 100], quali: [54.5, 100], wet: [57.0, 96] },
    psi: { race: [22.0, 19.8], quali: [22.4, 20.1], wet: [21.0, 19.0] },
    notes: {
      race: "Raggio di sterzata ottimizzato per il tornante del Grand Hotel e trazione istantanea fuori dal Portier.",
      quali: "Avantreno affilatissimo per sfiorare i guardrail a Saint Devote, al Tabac e alle Piscine.",
      wet: "Massima morbidezza per trovare trazione su strisce pedonali e tombini bagnati del Principato."
    }
  },
  "spain": {
    type: "Aero Bilanciato & Curva 3",
    downforce: "Medio-Alto",
    topSpeed: "332 km/h",
    tyreStress: "Alto (4/5)",
    aeroWings: { race: [32, 28], quali: [34, 30], wet: [40, 36] },
    diff: { race: [60, 52], quali: [56, 48], wet: [66, 56] },
    susp: { race: [32, 16, 15, 8, 33, 44], quali: [34, 18, 16, 9, 31, 42], wet: [24, 11, 10, 5, 41, 54] },
    camber: { race: [-3.0, -1.9], quali: [-3.2, -2.0], wet: [-2.6, -1.6] },
    toe: { race: [0.06, 0.16], quali: [0.05, 0.14], wet: [0.08, 0.18] },
    brakes: { race: [54.5, 100], quali: [54.0, 100], wet: [56.0, 98] },
    psi: { race: [23.9, 21.4], quali: [24.4, 21.8], wet: [22.3, 20.1] },
    notes: {
      race: "Sostegno laterale per Curva 3 e le ultime due curve veloci ripristinate senza chicane finale.",
      quali: "Velocità costante al rettilineo principale con ingresso rapido alla Curva Seat.",
      wet: "Trazione progressiva per non perdere il posteriore in uscita dalla curva Campsa."
    }
  },
  "canada": {
    type: "Chicane & Frenate Brutali",
    downforce: "Basso-Medio",
    topSpeed: "342 km/h",
    tyreStress: "Basso-Medio (2.5/5)",
    aeroWings: { race: [22, 18], quali: [20, 16], wet: [30, 26] },
    diff: { race: [56, 48], quali: [52, 46], wet: [64, 54] },
    susp: { race: [26, 13, 12, 7, 34, 46], quali: [28, 14, 13, 8, 32, 44], wet: [20, 9, 8, 4, 43, 56] },
    camber: { race: [-2.8, -1.7], quali: [-3.0, -1.8], wet: [-2.4, -1.5] },
    toe: { race: [0.05, 0.15], quali: [0.04, 0.13], wet: [0.07, 0.17] },
    brakes: { race: [54.5, 100], quali: [54.0, 100], wet: [56.0, 98] },
    psi: { race: [23.2, 20.8], quali: [23.7, 21.2], wet: [21.8, 19.6] },
    notes: {
      race: "Sospensioni ultra-morbide per saltare sui cordoli alti dell'ultima chicane del Muro dei Campioni.",
      quali: "Efficienza DRS sull'allungo verso il tornante per puntare alla pole.",
      wet: "Frenata progressiva per non bloccare sulle pozzanghere in fondo al rettilineo del Casinò."
    }
  },
  "austria": {
    type: "Giro Sprint & Cordoli",
    downforce: "Medio",
    topSpeed: "338 km/h",
    tyreStress: "Medio (3/5)",
    aeroWings: { race: [26, 22], quali: [28, 24], wet: [34, 30] },
    diff: { race: [58, 50], quali: [54, 48], wet: [65, 55] },
    susp: { race: [28, 14, 14, 8, 33, 44], quali: [30, 15, 15, 9, 31, 42], wet: [22, 10, 9, 5, 41, 53] },
    camber: { race: [-2.9, -1.8], quali: [-3.1, -1.9], wet: [-2.5, -1.6] },
    toe: { race: [0.06, 0.16], quali: [0.05, 0.14], wet: [0.08, 0.18] },
    brakes: { race: [54.5, 100], quali: [54.0, 100], wet: [56.0, 98] },
    psi: { race: [23.5, 21.0], quali: [24.0, 21.4], wet: [22.0, 19.8] },
    notes: {
      race: "Sospensioni tarate per assorbire i cordoli a salsicciotto di Curva 1 e 9 senza rompere il fondo vettura.",
      quali: "Giro secco da 1 minuto e 3 secondi con trazione immediata fuori dal tornante in salita di Curva 3.",
      wet: "Evita il pattinamento in salita verso la Curva Niki Lauda."
    }
  },
  "united-kingdom": {
    type: "Curve Veloci & Carico Laterale",
    downforce: "Alto",
    topSpeed: "332 km/h",
    tyreStress: "Estremo (5/5)",
    aeroWings: { race: [36, 32], quali: [38, 34], wet: [42, 38] },
    diff: { race: [62, 54], quali: [58, 50], wet: [68, 58] },
    susp: { race: [34, 16, 16, 9, 32, 43], quali: [36, 18, 18, 10, 30, 41], wet: [26, 11, 11, 6, 42, 54] },
    camber: { race: [-3.1, -1.9], quali: [-3.3, -2.0], wet: [-2.6, -1.6] },
    toe: { race: [0.06, 0.16], quali: [0.05, 0.14], wet: [0.08, 0.18] },
    brakes: { race: [54.5, 100], quali: [54.0, 100], wet: [56.5, 97] },
    psi: { race: [24.2, 21.8], quali: [24.6, 22.2], wet: [22.5, 20.4] },
    notes: {
      race: "Sospensioni rigide che sostengono il carico laterale devastante nella celebre sequenza Maggotts-Becketts.",
      quali: "Piena sicurezza e precisione chirurgica per affrontare la Copse in pieno a oltre 290 km/h.",
      wet: "Previene l'aquaplaning sul lungo rettilineo dell'Hangar Straight verso la Stowe."
    }
  },
  "hungary": {
    type: "Tortuoso & Telaio Meccanico",
    downforce: "Molto Alto",
    topSpeed: "318 km/h",
    tyreStress: "Medio-Alto (3.5/5)",
    aeroWings: { race: [42, 38], quali: [44, 40], wet: [48, 44] },
    diff: { race: [54, 48], quali: [50, 46], wet: [62, 52] },
    susp: { race: [28, 14, 13, 7, 34, 45], quali: [30, 15, 14, 8, 32, 43], wet: [21, 10, 9, 5, 42, 55] },
    camber: { race: [-3.0, -1.8], quali: [-3.2, -1.9], wet: [-2.5, -1.5] },
    toe: { race: [0.06, 0.15], quali: [0.05, 0.13], wet: [0.08, 0.17] },
    brakes: { race: [54.5, 100], quali: [54.0, 100], wet: [56.0, 97] },
    psi: { race: [23.1, 20.6], quali: [23.6, 21.0], wet: [21.7, 19.5] },
    notes: {
      race: "Grip continuo da kartodromo gigante, zero pause tra una curva e l'altra all'Hungaroring.",
      quali: "Avantreno affilatissimo nella discesa di Curva 4 e nella chicane lenta 6-7.",
      wet: "Differenziale aperto per dare fluidità sui continui tornantini senza strappare la trazione."
    }
  },
  "belgium": {
    type: "Basso Drag & Eau Rouge",
    downforce: "Basso-Medio",
    topSpeed: "344 km/h",
    tyreStress: "Alto (4/5)",
    aeroWings: { race: [22, 18], quali: [20, 16], wet: [32, 28] },
    diff: { race: [60, 52], quali: [56, 50], wet: [66, 56] },
    susp: { race: [30, 15, 14, 8, 33, 44], quali: [32, 16, 15, 9, 31, 42], wet: [22, 10, 9, 5, 42, 55] },
    camber: { race: [-3.0, -1.8], quali: [-3.2, -1.9], wet: [-2.5, -1.6] },
    toe: { race: [0.05, 0.15], quali: [0.04, 0.13], wet: [0.07, 0.17] },
    brakes: { race: [54.5, 100], quali: [54.0, 100], wet: [56.5, 97] },
    psi: { race: [23.8, 21.2], quali: [24.2, 21.6], wet: [22.2, 20.0] },
    notes: {
      race: "Compromesso chirurgico tra la velocità di punta sul Kemmel e l'appoggio aero nel discesone di Pouhon.",
      quali: "Efficienza DRS spinta al massimo per polverizzare i tempi nel Settore 1 e Settore 3 a Spa.",
      wet: "Aderenza meccanica per scalare l'Eau Rouge-Raidillon senza pericolosi sbandamenti sul bagnato."
    }
  },
  "netherlands": {
    type: "Curve Sopraelevate & Banking",
    downforce: "Alto",
    topSpeed: "322 km/h",
    tyreStress: "Molto Alto (4.5/5)",
    aeroWings: { race: [40, 36], quali: [42, 38], wet: [46, 42] },
    diff: { race: [58, 50], quali: [54, 48], wet: [65, 55] },
    susp: { race: [32, 16, 15, 8, 33, 44], quali: [34, 17, 16, 9, 31, 42], wet: [23, 11, 10, 5, 42, 54] },
    camber: { race: [-3.1, -1.9], quali: [-3.3, -2.0], wet: [-2.6, -1.6] },
    toe: { race: [0.06, 0.16], quali: [0.05, 0.14], wet: [0.08, 0.18] },
    brakes: { race: [54.5, 100], quali: [54.0, 100], wet: [56.0, 98] },
    psi: { race: [24.0, 21.5], quali: [24.5, 22.0], wet: [22.4, 20.2] },
    notes: {
      race: "Assetto specifico per contrastare le forze G diagonali nelle paraboliche Hugenholtz e Luyendyk.",
      quali: "Massima precisione in ingresso alle chicane strette tra le dune sabbiose di Zandvoort.",
      wet: "Pressioni tarate per smaltire l'acqua che scivola verso l'interno delle sopraelevate."
    }
  },
  "italy-monza": {
    type: "Top Speed & Tempio della Velocità",
    downforce: "Bassissimo",
    topSpeed: "356 km/h",
    tyreStress: "Basso (2/5)",
    aeroWings: { race: [18, 14], quali: [16, 12], wet: [26, 22] },
    diff: { race: [58, 50], quali: [55, 48], wet: [65, 54] },
    susp: { race: [32, 14, 15, 8, 32, 42], quali: [34, 16, 16, 9, 30, 40], wet: [24, 10, 10, 5, 40, 52] },
    camber: { race: [-2.8, -1.7], quali: [-3.0, -1.8], wet: [-2.4, -1.5] },
    toe: { race: [0.05, 0.14], quali: [0.04, 0.12], wet: [0.07, 0.16] },
    brakes: { race: [54.5, 100], quali: [54.0, 100], wet: [56.0, 98] },
    psi: { race: [23.5, 21.0], quali: [24.0, 21.5], wet: [22.0, 19.8] },
    notes: {
      race: "Staccata della prima variante piantata a terra da 350 a 70 km/h, scivolamento ridotto nelle curve di Lesmo.",
      quali: "Minima resistenza all'avanzamento sui tre lunghi rettifili, rotazione immediata alla Variante Ascari.",
      wet: "Altezza aumentata per evitare aquaplaning in Parabolica e trazione dolce sui cordoli."
    }
  },
  "azerbaijan": {
    type: "Rettilineo 2.2km & Castello Stretto",
    downforce: "Basso",
    topSpeed: "350 km/h",
    tyreStress: "Basso-Medio (2.5/5)",
    aeroWings: { race: [20, 16], quali: [18, 14], wet: [28, 24] },
    diff: { race: [56, 48], quali: [52, 46], wet: [64, 54] },
    susp: { race: [28, 14, 13, 7, 34, 45], quali: [30, 15, 14, 8, 32, 43], wet: [21, 10, 9, 5, 42, 55] },
    camber: { race: [-2.9, -1.7], quali: [-3.1, -1.8], wet: [-2.5, -1.5] },
    toe: { race: [0.05, 0.15], quali: [0.04, 0.13], wet: [0.07, 0.17] },
    brakes: { race: [54.5, 100], quali: [54.0, 100], wet: [56.0, 97] },
    psi: { race: [23.4, 20.9], quali: [23.9, 21.3], wet: [21.9, 19.7] },
    notes: {
      race: "Assetto ibrido: velocissimo per difendersi sui 2.2 km del rettilineo di Baku, agile nella sezione del Castello.",
      quali: "Ala scarica per guadagnare fino a 8 decimi solo nella trazione dell'ultimo settore.",
      wet: "Frenata controllata per evitare il bloccaggio alla curva 1 e curva 3 ad angolo retto."
    }
  },
  "singapore": {
    type: "Cittadino Notturno & Cordoli",
    downforce: "Massimo",
    topSpeed: "305 km/h",
    tyreStress: "Alto (4/5)",
    aeroWings: { race: [46, 42], quali: [48, 44], wet: [50, 48] },
    diff: { race: [54, 46], quali: [50, 45], wet: [62, 52] },
    susp: { race: [26, 13, 11, 6, 34, 46], quali: [28, 14, 12, 7, 32, 44], wet: [19, 9, 8, 4, 43, 56] },
    camber: { race: [-2.8, -1.7], quali: [-3.0, -1.8], wet: [-2.4, -1.5] },
    toe: { race: [0.05, 0.15], quali: [0.04, 0.13], wet: [0.07, 0.17] },
    brakes: { race: [55.0, 100], quali: [54.5, 100], wet: [56.5, 96] },
    psi: { race: [22.6, 20.2], quali: [23.0, 20.6], wet: [21.4, 19.3] },
    notes: {
      race: "Grip meccanico e trazione istantanea fuori dalle 19 curve lente di Marina Bay sotto l'umidità tropicale.",
      quali: "Avantreno chirurgico per sfiorare i muri nella chicane del ponte e settore della baia.",
      wet: "Differenziale sbloccato per gestire l'asfalto viscido notturno e le strisce pedonali bagnate."
    }
  },
  "usa-cota": {
    type: "Esses Veloci & Dislivello Curva 1",
    downforce: "Alto",
    topSpeed: "334 km/h",
    tyreStress: "Molto Alto (4.5/5)",
    aeroWings: { race: [35, 31], quali: [37, 33], wet: [42, 38] },
    diff: { race: [60, 52], quali: [56, 48], wet: [66, 56] },
    susp: { race: [31, 15, 15, 8, 33, 44], quali: [33, 17, 16, 9, 31, 42], wet: [23, 11, 10, 5, 41, 54] },
    camber: { race: [-3.0, -1.9], quali: [-3.2, -2.0], wet: [-2.6, -1.6] },
    toe: { race: [0.06, 0.16], quali: [0.05, 0.14], wet: [0.08, 0.18] },
    brakes: { race: [54.5, 100], quali: [54.0, 100], wet: [56.0, 98] },
    psi: { race: [23.8, 21.3], quali: [24.3, 21.7], wet: [22.2, 20.0] },
    notes: {
      race: "Assorbe i dossi storici di Austin ed esalta la direzionalità nei rapidi cambi di direzione del 1° settore.",
      quali: "Staccata in salita alla Curva 1 cieca con massimo carico sull'anteriore.",
      wet: "Trazione bilanciata per non sovraccaricare il posteriore nei curvoni a triplo raggio del 3° settore."
    }
  },
  "mexico": {
    type: "Aria Rara 2200m & Stadio",
    downforce: "Massimo (Drag Ridotto)",
    topSpeed: "354 km/h",
    tyreStress: "Basso-Medio (2.5/5)",
    aeroWings: { race: [46, 42], quali: [48, 44], wet: [50, 46] },
    diff: { race: [58, 50], quali: [54, 48], wet: [65, 55] },
    susp: { race: [30, 15, 14, 8, 33, 44], quali: [32, 16, 15, 9, 31, 42], wet: [22, 10, 9, 5, 41, 53] },
    camber: { race: [-2.9, -1.8], quali: [-3.1, -1.9], wet: [-2.5, -1.6] },
    toe: { race: [0.05, 0.15], quali: [0.04, 0.13], wet: [0.07, 0.17] },
    brakes: { race: [54.5, 100], quali: [54.0, 100], wet: [56.0, 97] },
    psi: { race: [23.4, 20.9], quali: [23.9, 21.3], wet: [21.9, 19.7] },
    notes: {
      race: "Ali caricate al massimo ma velocità elevatissima grazie all'aria rarefatta dei 2.200 metri di altitudine.",
      quali: "Agilità estrema per la sezione lenta dello stadio Foro Sol e le curve ad S veloci.",
      wet: "Freni regolati per evitare il surriscaldamento con scarso flusso d'aria da raffreddamento."
    }
  },
  "brazil": {
    type: "Misto Fluido & Senna S",
    downforce: "Medio-Alto",
    topSpeed: "335 km/h",
    tyreStress: "Alto (4/5)",
    aeroWings: { race: [31, 27], quali: [33, 29], wet: [39, 35] },
    diff: { race: [58, 50], quali: [54, 48], wet: [65, 55] },
    susp: { race: [29, 14, 14, 8, 33, 44], quali: [31, 16, 15, 9, 31, 42], wet: [22, 10, 9, 5, 41, 53] },
    camber: { race: [-3.0, -1.8], quali: [-3.2, -1.9], wet: [-2.5, -1.6] },
    toe: { race: [0.06, 0.16], quali: [0.05, 0.14], wet: [0.08, 0.18] },
    brakes: { race: [54.5, 100], quali: [54.0, 100], wet: [56.0, 98] },
    psi: { race: [23.6, 21.1], quali: [24.1, 21.5], wet: [22.1, 19.9] },
    notes: {
      race: "Stabilità in discesa nella S di Senna e trazione progressiva nella risalita della Junçao verso il traguardo.",
      quali: "Bilanciamento perfetto per pennellare le curve interne del Lago e del Bico de Pato ad Interlagos.",
      wet: "Assetto iconico per le gare pazze sotto i temporali tipici di San Paolo."
    }
  },
  "usa-las-vegas": {
    type: "Bassissimo Carico & The Strip",
    downforce: "Bassissimo",
    topSpeed: "352 km/h",
    tyreStress: "Basso (2/5)",
    aeroWings: { race: [16, 12], quali: [14, 10], wet: [24, 20] },
    diff: { race: [58, 50], quali: [55, 48], wet: [65, 54] },
    susp: { race: [31, 14, 15, 8, 32, 42], quali: [33, 16, 16, 9, 30, 40], wet: [23, 10, 10, 5, 40, 52] },
    camber: { race: [-2.8, -1.7], quali: [-3.0, -1.8], wet: [-2.4, -1.5] },
    toe: { race: [0.05, 0.14], quali: [0.04, 0.12], wet: [0.07, 0.16] },
    brakes: { race: [54.5, 100], quali: [54.0, 100], wet: [56.0, 98] },
    psi: { race: [23.5, 21.0], quali: [24.0, 21.5], wet: [22.0, 19.8] },
    notes: {
      race: "Massima efficienza sui quasi 2 km della Strip illuminata di Las Vegas, frenata sicura per Curva 14.",
      quali: "Temperature gomme mantenute nella finestra ottimale nonostante il freddo pungente notturno del Nevada.",
      wet: "Staccate lunghe e sicure per non scivolare sui tombini dell'asfalto cittadino."
    }
  },
  "qatar": {
    type: "Grip Laterale Costante & Notturna",
    downforce: "Molto Alto",
    topSpeed: "330 km/h",
    tyreStress: "Estremo (5/5)",
    aeroWings: { race: [39, 35], quali: [41, 37], wet: [45, 41] },
    diff: { race: [62, 54], quali: [58, 50], wet: [68, 58] },
    susp: { race: [34, 16, 16, 9, 32, 43], quali: [36, 18, 17, 10, 30, 41], wet: [25, 11, 11, 5, 41, 54] },
    camber: { race: [-3.2, -2.0], quali: [-3.4, -2.1], wet: [-2.7, -1.7] },
    toe: { race: [0.06, 0.17], quali: [0.05, 0.15], wet: [0.08, 0.19] },
    brakes: { race: [54.5, 100], quali: [54.0, 100], wet: [56.5, 97] },
    psi: { race: [24.2, 21.7], quali: [24.7, 22.1], wet: [22.5, 20.3] },
    notes: {
      race: "Costruito per reggere le tremende forze G laterali continue di Lusail preservando la carcassa pneumatico.",
      quali: "Avantreno affilatissimo nei veloci curvoni 12-13-14 in successione.",
      wet: "Assetto stabile per non scomporre il posteriore sulle folate di vento del deserto."
    }
  },
  "abu-dhabi": {
    type: "Trazione Settore 3 & Finale Mondiale",
    downforce: "Medio-Alto",
    topSpeed: "336 km/h",
    tyreStress: "Medio (3/5)",
    aeroWings: { race: [30, 26], quali: [32, 28], wet: [38, 34] },
    diff: { race: [58, 50], quali: [54, 48], wet: [65, 55] },
    susp: { race: [30, 15, 14, 8, 33, 44], quali: [32, 16, 15, 9, 31, 42], wet: [22, 10, 9, 5, 41, 53] },
    camber: { race: [-2.9, -1.8], quali: [-3.1, -1.9], wet: [-2.5, -1.6] },
    toe: { race: [0.05, 0.15], quali: [0.04, 0.13], wet: [0.07, 0.17] },
    brakes: { race: [54.5, 100], quali: [54.0, 100], wet: [56.0, 98] },
    psi: { race: [23.6, 21.1], quali: [24.1, 21.5], wet: [22.1, 19.9] },
    notes: {
      race: "Bilanciamento perfetto tra i due lunghi rettilinei DRS e la precisione nel settore dell'hotel a Yas Marina.",
      quali: "Massima trazione fuori dalla chicane 5-6 e dalla curva inclinata 9 per il giro da titolo.",
      wet: "Trazione controllata sull'asfalto liscio e perfetto degli Emirati Arabi."
    }
  }
};

// Generates the flat setup object expected by SetupDisplay for all F1 26 variations
export function generateFlatSetup(slug) {
  const prof = trackProfiles[slug] || trackProfiles["italy-monza"];
  const out = {
    updatedAt: new Date().toISOString(),
    latest_variation: "Assetto Gara F1 26",
    driving_notes: prof.notes?.race || "Assetto F1 26 configurato e validato."
  };

  const tabs = ["quali", "race", "parc_ferme"];
  for (const tab of tabs) {
    const p = `${tab}_`;
    let wings = prof.aeroWings[tab] || (tab === "quali" ? prof.aeroWings.quali : prof.aeroWings.race);
    let diff = prof.diff[tab] || (tab === "quali" ? prof.diff.quali : prof.diff.race);
    let susp = prof.susp[tab] || (tab === "quali" ? prof.susp.quali : prof.susp.race);
    let camber = prof.camber[tab] || (tab === "quali" ? prof.camber.quali : prof.camber.race);
    let toe = prof.toe[tab] || (tab === "quali" ? prof.toe.quali : prof.toe.race);
    let brakes = prof.brakes[tab] || (tab === "quali" ? prof.brakes.quali : prof.brakes.race);
    let psi = prof.psi[tab] || (tab === "quali" ? prof.psi.quali : prof.psi.race);

    if (tab === "parc_ferme") {
      // FIA Parc Ferme compromise: midway between Quali rotation and Race tyre durability
      wings = [
        Math.round((prof.aeroWings.race[0] + (prof.aeroWings.quali ? prof.aeroWings.quali[0] : prof.aeroWings.race[0])) / 2),
        Math.round((prof.aeroWings.race[1] + (prof.aeroWings.quali ? prof.aeroWings.quali[1] : prof.aeroWings.race[1])) / 2),
      ];
      diff = [Math.min(prof.diff.race[0] - 1, 62), Math.max(prof.diff.race[1], 49)];
      susp = [
        Math.round((prof.susp.race[0] + (prof.susp.quali ? prof.susp.quali[0] : prof.susp.race[0])) / 2),
        prof.susp.race[1],
        prof.susp.race[2],
        prof.susp.race[3],
        prof.susp.race[4],
        prof.susp.race[5],
      ];
      camber = prof.camber.race;
      toe = prof.toe.race;
      brakes = [54.5, 100];
      psi = [Number((prof.psi.race[0] + 0.2).toFixed(1)), Number((prof.psi.race[1] + 0.1).toFixed(1))];
    }

    out[`${p}front_wing`] = wings[0];
    out[`${p}rear_wing`] = wings[1];
    out[`${p}diff_on`] = diff[0];
    out[`${p}diff_off`] = diff[1];
    out[`${p}engine_braking`] = 60;
    out[`${p}front_camber`] = camber[0];
    out[`${p}rear_camber`] = camber[1];
    out[`${p}front_toe`] = toe[0];
    out[`${p}rear_toe`] = toe[1];
    out[`${p}front_suspension`] = susp[0];
    out[`${p}rear_suspension`] = susp[1];
    out[`${p}front_antiroll`] = susp[2];
    out[`${p}rear_antiroll`] = susp[3];
    out[`${p}front_ride_height`] = susp[4];
    out[`${p}rear_ride_height`] = susp[5];
    out[`${p}brake_bias`] = brakes[0];
    out[`${p}brake_pressure`] = brakes[1];
    out[`${p}front_left_psi`] = psi[0];
    out[`${p}front_right_psi`] = psi[0];
    out[`${p}rear_left_psi`] = psi[1];
    out[`${p}rear_right_psi`] = psi[1];
    out[`${p}front_tyre_pressure`] = psi[0];
    out[`${p}rear_tyre_pressure`] = psi[1];
  }

  return out;
}

// Map for quick client-side lookup for all 24 tracks
export function getAllDefaultSetups() {
  const map = {};
  for (const t of tracks) {
    map[t.slug] = generateFlatSetup(t.slug);
  }
  return map;
}
