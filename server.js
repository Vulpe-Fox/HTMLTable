const express = require('express');
const app = express();
const sql = require('mssql');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config()

app.use(express.json());
app.use(cors());

const config = {
    user: process.env.user,
    password: process.env.password,
    server: process.env.server,
    database: process.env.database,
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
};

// Insert parsed data into SQL Server
app.post('/upload', async (req, res) => {
    const data = req.body;

    try {
        await sql.connect(config);

        for (const record of data) {
            const request = new sql.Request();

            request.input('Name', sql.NVarChar, record['colspan name']);
            request.input('Date', sql.DateTime, new Date(record['date']));
            request.input('AdBreaks', sql.Int, record['Ad Breaks (Minutes)']);
            request.input('AdTime', sql.Int, record['Ad Time (Seconds) Per Hour']);
            request.input('MinutesStreamed', sql.Int, record['Minutes Streamed']);
            request.input('SubRevenue', sql.Decimal(18,2), record['Sub Revenue']);
            request.input('GiftedSubsRevenue', sql.Decimal(18,2), record['Gifted Subs Revenue']);
            request.input('MultiMonthGiftedSubsRevenue', sql.Decimal(18,2), record['MultiMonth Gifted Subs Revenue']);
            request.input('BitsRevenue', sql.Decimal(18,2), record['Bits Revenue']);
            request.input('AdRevenue', sql.Decimal(18,2), record['Ad Revenue']);
            request.input('PrimeRevenue', sql.Decimal(18,2), record['Prime Revenue']);
            request.input('GameSalesRevenue', sql.Decimal(18,2), record['Game Sales Revenue']);
            request.input('ExtensionsRevenue', sql.Decimal(18,2), record['Extensions Revenue']);
            request.input('BountiesRevenue', sql.Decimal(18,2), record['Bounties Revenue']);
            request.input('OtherBitsInteractionsRevenue', sql.Decimal(18,2), record['Other Bits Interactions Revenue']);
            request.input('HypeChat', sql.Decimal(18,2), record['Hype Chat']);
            request.input('PrimeSubs', sql.Decimal(18,2), record['Prime Subs']);
            request.input('TotalPaidSubs', sql.Decimal(18,2), record['Total Paid Subs']);
            request.input('Tier1Subs', sql.Decimal(18,2), record['Tier 1 subs']);
            request.input('Tier2Subs', sql.Decimal(18,2), record['Tier 2 subs']);
            request.input('Tier3Subs', sql.Decimal(18,2), record['Tier 3 subs']);
            request.input('TotalGiftedSubs', sql.Decimal(18,2), record['Total Gifted Subs']);
            request.input('GiftedTier1Subs', sql.Decimal(18,2), record['Gifted Tier 1 subs']);
            request.input('GiftedTier2Subs', sql.Decimal(18,2), record['Gifted Tier 2 subs']);
            request.input('GiftedTier3Subs', sql.Decimal(18,2), record['Gifted Tier 3 subs']);
            request.input('TotalMultiMonthGiftedSubs', sql.Decimal(18,2), record['Total Multi-Month Gifted subs']);
            request.input('MultiMonthGiftedTier1Subs', sql.Decimal(18,2), record['Multi-Month Gifted Tier 1 subs']);
            request.input('MultiMonthGiftedTier2Subs', sql.Decimal(18,2), record['Multi-Month Gifted Tier 2 subs']);
            request.input('MultiMonthGiftedTier3Subs', sql.Decimal(18,2), record['Multi-Month Gifted Tier 3 subs']);

            await request.query(`
                INSERT INTO StreamerStats (
                    Name, Date, AdBreaks, AdTime, MinutesStreamed,
                    SubRevenue, PrimeRevenue, GameSalesRevenue, 
                    ExtensionsRevenue, BountiesRevenue, OtherBitsInteractionsRevenue, 
                    HypeChat, PrimeSubs, TotalPaidSubs, Tier1Subs, Tier2Subs,
                    Tier3Subs, TotalGiftedSubs, GiftedTier1Subs, GiftedTier1Subs,
                    GiftedTier2Subs, GiftedTier3Subs, TotalMultiMonthGiftedSubs,
                    MultiMonthGiftedTier1Subs, MultiMonthGiftedTier2Subs,
                    MultiMonthGiftedTier3Subs
                )
                VALUES (
                    @Name, @Date, @AdBreaks, @AdTime, @MinutesStreamed,
                    @SubRevenue, @PrimeRevenue, @GameSalesRevenue, 
                    @ExtensionsRevenue, @BountiesRevenue, @OtherBitsInteractionsRevenue, 
                    @HypeChat, @PrimeSubs, @TotalPaidSubs, @Tier1Subs, @Tier2Subs,
                    @Tier3Subs, @TotalGiftedSubs, @GiftedTier1Subs, @GiftedTier1Subs,
                    @GiftedTier2Subs, @GiftedTier3Subs, @TotalMultiMonthGiftedSubs,
                    @MultiMonthGiftedTier1Subs, @MultiMonthGiftedTier2Subs,
                    @MultiMonthGiftedTier3Subs
                )
            `);
        }

        res.json({ message: 'Data inserted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Database insertion error');
    }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
