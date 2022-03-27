const objectConstructor = (name, value) => {
    return {
        envName: name,
        envValue: value
    }
}

const envelopeSlicer = (array, index, amountToSlice) => {
    array.splice(index, amountToSlice)
}

module.exports = { objectConstructor, envelopeSlicer }