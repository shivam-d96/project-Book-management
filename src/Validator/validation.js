
const isValid = function (x) {
    if (typeof x === 'undefined' || x === null) return false
    if( typeof x != "string")  return false
    if (typeof x === 'string' && x.trim().length === 0) return false
    return true
}

const isValidBody = function (y) {
    return Object.keys(y).length > 0
}

const isValidEmail = function (y) {
   
    let emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    if (emailRegex.test(y) ) return true
}

const isValidMobile = function (y) {   
   let mobileRegex = /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[0-9]\d{9}$/
   if (mobileRegex.test(y)) return true
}

const isValidPassword = (value) =>{
    if (typeof value === "undefined" || value === null) return false
    const re = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,15}$/
    return re.test(value)
}

const isValidArray = (value) => {
    if (Array.isArray(value)) {
        for (let i = 0; i < value.length; i++) {
            if (value[i].trim().length === 0 || typeof (value[i]) !== "string") { return false }
        }
        return true
    } else { return false }
}
let isValidTitle = function (title) {
    return ["Mr", "Mrs", "Miss"].indexOf(title)!==-1
}
module.exports.isValidBody = isValidBody
module.exports.isValid = isValid
module.exports.isValidEmail = isValidEmail
module.exports.isValidMobile = isValidMobile
module.exports.isValidArray = isValidArray
module.exports.isValidTitle = isValidTitle
module.exports.isValidPassword = isValidPassword