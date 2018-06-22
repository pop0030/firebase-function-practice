import admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import express from 'express';

admin.initializeApp(functions.config().firebase);

const db = admin.firestore();

const app = express();

app.get('/', (req, res) => {
    res.send('root');
});

app.post('/product', async (req, res) => {
    const { body } = req;
    if (body) {
        try {
            const doc = await db.collection('products').add({ ...body });
            const docSnapshot = await doc.get();
            const data = docSnapshot.data();
            res.status(200).send(data);
        } catch(e) {
            console.error(e);
            res.status(500).send(e);
        }
    }
});

app.get('/product/all', async (req, res) => {
    try {
        const querySnapshot = await db.collection('products').get();
        const data = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        res.status(200).send(data);
    } catch(e) {
        console.error(e);
        res.status(500).send(e);
    }
});

const api = functions.https.onRequest(app);

export { api };
