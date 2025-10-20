const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// --- This is your C++ logic, translated to a JavaScript Class ---
class AstrologyLogic {
    constructor() {
        this.Padas = new Map();
        this.Naks = new Map();
        this.CHC = new Map();
        this.Sign = new Map();
        this.frequency = new Map();
        
        this.chcData = [5, 5, 5, 5, 5, 5, 5, 4, 4, 4, 4, 4, 4, 4, 3, 3, 3, 3, 3, 2, 2, 2, 2, 2, 1, 1, 5];
        this.arrData = [0, 4, 6, 6, 3, 0, 2, 1, 5];
        this.signData = [
            3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 6, 6, 6, 6, 6, 6, 6,
            6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 5, 5, 5, 5, 5, 5, 5, 5, 5, 4, 4, 4, 4, 4, 4, 4, 4, 4, 3, 3, 3, 3, 3, 3,
            3, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2,
            2, 2, 2, 2, 2
        ];
        this.nakshatras = [
            "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashirsha", "Ardra", "Punarvasu",
            "Pushya", "Ashlesha", "Magha", "Purva_Phalguni", "Uttara_Phalguni", "Hasta",
            "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha", "Mula", "Purva_Ashadha",
            "Uttara_Ashadha", "Shravana", "Dhanishta", "Shatabhisha", "Purva_Bhadrapada",
            "Uttara_Bhadrapada", "Revati"
        ];
        this.padaNumData = [3, 4, 5, 6, 6, 5, 4, 3, 2, 1, 1, 2];

        this.initializeData();
    }

    initializeData() {
        let p = 0;
        for (let j = 0; j < 27; j++) {
            const nak = this.nakshatras[j];
            if (p === 12) p = 0;
            const padasMap = new Map();
            for (let k = 0; k < 4; k++) {
                padasMap.set(k, this.padaNumData[p]);
                p++;
            }
            this.Padas.set(nak, padasMap);
        }

        p = 0;
        for (let j = 0; j < 27; j++) {
            const nak = this.nakshatras[j];
            const signMap = new Map();
            for (let k = 0; k < 4; k++) {
                signMap.set(k, this.signData[p]);
                p++;
            }
            this.Sign.set(nak, signMap);
        }

        p = 0;
        for (let j = 0; j < 27; j++) {
            const nak = this.nakshatras[j];
            if (p === 9) p = 0;
            this.Naks.set(nak, this.arrData[p]);
            p++;
        }

        p = 0;
        for (let j = 0; j < 27; j++) {
            const nak = this.nakshatras[j];
            this.CHC.set(nak, this.chcData[p]);
            p++;
        }
    }

    calculateFrequencies(nakshatra, pada) {
        this.frequency.set(1, 0); this.frequency.set(2, 0); this.frequency.set(3, 0);
        this.frequency.set(4, 0); this.frequency.set(5, 0); this.frequency.set(6, 0);
        
        const padaIndex = pada - 1; 
        
        if (!this.Padas.has(nakshatra)) {
            throw new Error(`Invalid Nakshatra: ${nakshatra}`);
        }

        const padaValue = this.Padas.get(nakshatra).get(padaIndex);
        const signValue = this.Sign.get(nakshatra).get(padaIndex);
        const naksValue = this.Naks.get(nakshatra);
        const chcValue = this.CHC.get(nakshatra);

        if (padaValue > 0) this.frequency.set(padaValue, this.frequency.get(padaValue) + 1);
        this.frequency.set(signValue, this.frequency.get(signValue) + 1);
        this.frequency.set(naksValue, this.frequency.get(naksValue) + 1);
        this.frequency.set(chcValue, this.frequency.get(chcValue) + 1);

        let total = 0;
        for (let i = 1; i <= 6; i++) {
            total += this.frequency.get(i);
        }

        const results = [];
        for (let i = 1; i <= 6; i++) {
            const percentage = total === 0 ? 0 : (this.frequency.get(i) / total) * 100.0;
            results.push({
                result: i,
                percentage: percentage.toFixed(2)
            });
        }
        return results;
    }
}
const astroEngine = new AstrologyLogic();
let historyDB = []; // History will reset on each serverless instance start

// This is still a mock function. For real data, sign up for an astrology API.
async function getNakshatraFromAPI(dob) {
    const nakshatras = [
            "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashirsha", "Ardra", "Punarvasu",
            "Pushya", "Ashlesha", "Magha", "Purva_Phalguni", "Uttara_Phalguni", "Hasta",
            "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha", "Mula", "Purva_Ashadha",
            "Uttara_Ashadha", "Shravana", "Dhanishta", "Shatabhisha", "Purva_Bhadrapada",
            "Uttara_Bhadrapada", "Revati"
        ];
    const randomNak = nakshatras[Math.floor(Math.random() * nakshatras.length)];
    const randomPada = Math.floor(Math.random() * 4) + 1; // 1, 2, 3, or 4
    return { nakshatra: randomNak, pada: randomPada };
}

app.post('/api/calculate', async (req, res) => {
    try {
        const { name, dob } = req.body;
        if (!name || !dob) return res.status(400).json({ error: 'Name and DOB are required.' });
        
        const astroData = await getNakshatraFromAPI(dob);
        const { nakshatra, pada } = astroData;
        
        const frequencyResults = astroEngine.calculateFrequencies(nakshatra, pada);
        
        const resultRecord = {
            id: historyDB.length + 1,
            name, dob, nakshatra, pada,
            results: frequencyResults,
            timestamp: new Date()
        };
        historyDB.push(resultRecord);
        
        res.json(resultRecord);
    } catch (error) {
        res.status(500).json({ error: 'An internal server error occurred.' });
    }
});

app.get('/api/history', (req, res) => {
    res.json(historyDB);
});

// Export the app for Vercel
module.exports = app;