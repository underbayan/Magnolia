export default (obj, newObj) => {
    for (let t in newObj) {
        if (newObj[t] !== undefined) {
            obj[t] = newObj[t]
        }
    }
}
