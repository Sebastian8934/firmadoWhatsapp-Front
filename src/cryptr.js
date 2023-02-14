const Cryptr = require('cryptr');
const config = require('./config/config.json')

const cryptr = new Cryptr(config.cryptr) 
function encrypt(string) { return cryptr.encrypt(string) }
function decrypt(string) { return cryptr.decrypt(string) }
module.exports = {
    encrypt,
    decrypt
}
