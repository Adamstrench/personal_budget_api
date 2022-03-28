const envName = document.querySelector('.envName');
const envValue = document.querySelector('.envValue');
const getAll = document.querySelector('.getAll');
const newEnv = document.querySelector('.newEnv');
const editEnv = document.querySelector('.editEnv');
const delEnv = document.querySelector('.delEnv');
const fromName = document.querySelector('.transferName');
const fromAmount = document.querySelector('.transferFromAmount');
const toName = document.querySelector('.recName');
const transferButton = document.querySelector('.transferButton');




const url = 'http://82.11.109.184:8000/envelopes';

const addElement = (elementData) => {
    const newDiv = document.createElement("div")
    const newContent = document.createTextNode(elementData);

    newDiv.appendChild(newContent);
    const br = document.createElement("br")
    const currentDiv = document.getElementById('.envForm')
    document.body.insertBefore(newDiv, currentDiv);
    document.body.insertBefore(br, newDiv);
}

const logAllResults = async () => {
    try {
        const response = await fetch(url);
        if (response.ok) {
            const jsonResponse = await response.json();
            console.log(jsonResponse);
            jsonResponse.forEach((element) => {
                addElement(`${element["envelopeName"]} = ${element["envelopeValue"]}`);
            })
        }
    }
    catch (error) {
        console.log(error);
    }
}

const createNewEnv = async () => {
    //const data = {envelopeName: nameInput, envelopeValue: valueInput};
    const options = {method: "PUT"};
    const endpoint = `${url}?name=${envName.value}&value=${envValue.value}`
    try {
        const response = await fetch(endpoint, options);
        const jsonResponse = await response.json();
        if (response.ok) {
            console.log('Request successful.');
            addElement(`Envelope created.`);
        }
        else {
            addElement(`Bad request`);
        }
    }
    catch (error) {
        console.log(error);
    }
}

const transferRequest = async () => {
    const options = {method: "PUT"};
    const endpoint = `${url}/${fromName.value}?name=${toName.value}&value=${fromAmount.value}`;
    try {
        const response = await fetch(endpoint, options);
        if (response.ok) {
            const jsonResponse = await response.json();
            console.log(jsonResponse);
        }
        else{
            addElement(`Bad request - Envelope not found`);
        }
    }
    catch (error) {
        addElement(`Bad request - Envelope not found`);
        console.log(error);
    }
}

const updateEnv = () => {
    const endpoint = `http://82.11.109.184:8000/update/`
}

transferButton.addEventListener('click', transferRequest);
getAll.addEventListener('click', logAllResults);
newEnv.addEventListener('click', createNewEnv)

const endpoint = `http://192.168.0.52:8000/envelopes?name=${envName}&value=${envValue}`