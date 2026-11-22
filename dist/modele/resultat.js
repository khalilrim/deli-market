"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.succes = succes;
exports.refus = refus;
/** On renvoie un résultat quand tout se passe bien */
function succes(valeur) {
    return { ok: true, valeur };
}
/** On renvoie un message quand une opération échoue */
function refus(motif) {
    return { ok: false, motif };
}
