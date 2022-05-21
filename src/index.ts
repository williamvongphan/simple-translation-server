import dotenv = require('dotenv');
dotenv.config();
import express = require('express');
import { Database } from "./database";
import axios from 'axios';
import bodyParser = require('body-parser');
import { uuid } from './uuid';

const app = express();
const port = 10750;
const authToken = process.env.NEURALSPACE_AUTH_TOKEN;
const apiBaseUrl = 'https://platform.neuralspace.ai/api/translation/v1/annotated/translate';

const database = new Database('./data/translations.json');
database.load();

app.use(bodyParser.json());

// POST /translate
app.post('/translate', (req, res) => {
    // Get the auth token from the request header.
    const authTokenHeader = req.header('authorization');
    if (authTokenHeader !== authToken) {
        res.status(401).send('Unauthorized');
        return;
    }
    const text = req.body.text;
    const sourceLanguage = req.body.sourceLanguage;
    const targetLanguage = req.body.targetLanguage;
    const translation = database.find((key, value) => {
        return value.text === text && value.sourceLanguage === sourceLanguage && value.targetLanguage === targetLanguage;
    });
    // If the translation is found in the database, return it.
    if (translation !== null) {
        console.log(`Found translation for ${text} from ${sourceLanguage} to ${targetLanguage} in the database.`);
        res.send(database.get(translation).response);
        return;
    }
    if (text === undefined || text === null || text === '') {
        res.status(400).send('Missing text');
        return;
    }
    if (sourceLanguage === undefined || sourceLanguage === null || sourceLanguage === '') {
        res.status(400).send('Missing source language');
        return;
    }
    if (targetLanguage === undefined || targetLanguage === null || targetLanguage === '') {
        res.status(400).send('Missing target language');
        return;
    }
    // If the translation is not found in the database, translate it.
    console.log(`POSTing Neuralspace API for ${text} from ${sourceLanguage} to ${targetLanguage}`);
    axios.post(apiBaseUrl, {
        text: text,
        sourceLanguage: sourceLanguage,
        targetLanguage: targetLanguage
    }, {
        headers: {
            'authorization': authToken,
            'Content-Type': 'application/json',
            'accept': 'application/json'
        }
    }).then(response => {
        const translation = response.data;
        let translationDataObj = {
            text: text,
            sourceLanguage: sourceLanguage,
            targetLanguage: targetLanguage,
            response: translation
        }
        database.set(uuid(), translationDataObj);
        database.save();
        res.send(translation);
    });
});

// Launch the server.
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
