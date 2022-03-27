const express = require('express');
const { send } = require('express/lib/response');
const { objectConstructor, envelopeSlicer } = require('./helperFunctions.js');

const app = express();
const PORT = process.env.PORT || 8000;

const updateRouter = express.Router();

const envelopes = [{
    envelopeName: "Rent",
    envelopeValue: 950
},
{
    envelopeName: "Food",
    envelopeValue: 1050
}];

app.use(express.static('public'));

app.use('/update', updateRouter);

app.get('/envelopes', (req, res, next) => { //returns all envelopes with values
    process.stdout.write(' GET Request received.');
    res.status(200).send(envelopes);
})

app.get('/envelopes/:envName', (req, res, next) => {
    const envName = req.params.envName;
    process.stdout.write(' GET Requested received.')
    let requestedEnv
    envelopes.forEach((name, index) => {
        if (name["envelopeName"] === envName) {
            requestedEnv = envelopes[index];
        }
    })
    if (requestedEnv) {
        res.status(200).send(requestedEnv);
    }
    else {
        res.status(404).send();
    }
})

app.post('/envelopes', (req, res, next) => {
    const selectedName = req.query.name;
    const newValue = req.query.value;
    process.stdout.write(' POST Request received.')
    let selectedEnvelope;
    envelopes.forEach((name, index) => {
        if (selectedName === name["envelopeName"]) {
            selectedEnvelope = envelopes[index];
            selectedEnvelope["envelopeValue"] = newValue;
        }
    })
    if (selectedEnvelope) {
        res.status(200).send('Envelope updated.');
    }
    else {
        res.status(400).send('Envelope not found.');
    }
})

app.delete('/envelopes/:envName', (req, res, next) => {
    const selectedName = req.params.envName;
    process.stdout.write(' DELETE Request received.')
    let selectedEnvelope;
    envelopes.forEach((name, index) => {
        if (name["envelopeName"] === selectedName) {
            envelopeSlicer(envelopes, index, 1);
            selectedEnvelope = name["envelopeName"];
        }
    });
    if (selectedEnvelope) {
        process.stdout.write(' Successful request - Envelope deleted')
        res.status(204).send();
    }
    else {
        res.status(404).send('Envelope not found.');
    }
})

app.put('/envelopes', (req, res, next) => {
    let envName = req.query.name;
    let envValue = req.query.value;
    console.log(`${envName} + ${envValue}`);
    process.stdout.write(' PUT Request received.')
    let newEnv = {envelopeName: envName, envelopeValue: envValue};
    if (!envName || !envValue) {
        res.status(400).send();
    }
    else {
        envelopes.push(newEnv);
        process.stdout.write(' Successful request - Envelope created');
        res.status(201).send('Envelope created.');
    }
})

app.put('/envelopes/:envName', (req, res, next) => {
    let toName = req.query.name;
    let fromName = req.params.envName;
    let transferValue = req.query.value;
    let actualValue = parseInt(transferValue);
    let fromFound;
    let toFound;
    console.log(`${toName} + ${fromName} + ${transferValue}`);
    if (toName && fromName && transferValue) {
        envelopes.forEach((name) => {
            if (name["envelopeName"] === fromName) {
                name["envelopeValue"] = name["envelopeValue"] - actualValue;
                fromFound = true;
            }
        })
        envelopes.forEach((name) => {
            if (name["envelopeName"] === toName) {
                name["envelopeValue"] = name["envelopeValue"] + actualValue;
                toFound = true;
            }
        })
    }
    if (fromFound && toFound) {
        console.log('Put request successful');
        res.status(200).send('Updated.');
    }
    else {
        console.log('Put request unsuccessful');
        res.status(400).send('Not found');
    }
})

updateRouter.put('/:envName', (req, res, next) => {
    const envToUpdate = req.params.envName;
    const newName = req.query.name;
    const newValue = req.query.value;
    console.log(`Update request - EnvToUpdate: ${envToUpdate} - NewName: ${newName} - NewValue: ${newValue}`);
    if (envToUpdate && newName && newValue) {
        envelopes.forEach(name => {
            if (name["envelopeName"] === envToUpdate) {
                name["envelopeName"] = newName;
                name["envelopeValue"] = newValue;
                console.log(`Name and value updated.`);
                return res.status(201).send(name);
            }
        })
    }
    else if (envToUpdate && newName) {
        envelopes.forEach(name => {
            if (name["envelopeName"] === envToUpdate) {
                name["envelopeName"] = newName;
                console.log(`Name updated`);
                return res.status(201).send(name);
            }
        })
    }
    else if (envToUpdate && newValue) {
        envelopes.forEach(name => {
            if (name["envelopeName"] === envToUpdate) {
                name["envelopeValue"] = newValue;
                console.log(`Value updated`);
                return res.status(201).send(name);
            }
        })
    }
})

app.listen(PORT, () => {
    console.log(`Server listening at port: ${PORT}`);
})
