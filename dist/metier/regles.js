"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sommer = sommer;
exports.validerQuantite = validerQuantite;
exports.calculerRemiseFidelite = calculerRemiseFidelite;
exports.calculerReductionBienvenue = calculerReductionBienvenue;
exports.calculerFraisLivraison = calculerFraisLivraison;
exports.calculerFraisPaiement = calculerFraisPaiement;
exports.calculerMontants = calculerMontants;
exports.appliquerTransition = appliquerTransition;
const resultat_1 = require("../modele/resultat");
/** Additionne des valeurs dans un tableau */
function sommer(items, valeur) {
    let total = 0;
    for (const item of items) {
        total = total + valeur(item);
    }
    return total;
}
/** vérifier la quantité d'un produit */
function validerQuantite(quantite, p) {
    if (!Number.isInteger(quantite)) {
        return (0, resultat_1.refus)("quantite_invalide");
    }
    if (quantite < p.quantiteMin || quantite > p.quantiteMax) {
        return (0, resultat_1.refus)("quantite_hors_limites (" +
            p.quantiteMin + "-" + p.quantiteMax + ")");
    }
    return (0, resultat_1.succes)(quantite);
}
/** calculer la remise fidélité */
function calculerRemiseFidelite(sousTotal, commandesPassees, p) {
    if (commandesPassees >= p.commandesPourFidelite) {
        return Math.round(sousTotal * p.tauxRemiseFidelite);
    }
    return 0;
}
/** calculer la réduction de bienvenue */
function calculerReductionBienvenue(sousTotalApresRemise, commandesPassees, p) {
    if (commandesPassees === 0) {
        return Math.min(p.reductionBienvenue, sousTotalApresRemise);
    }
    return 0;
}
/** calculer les frais de livraison */
function calculerFraisLivraison(zone, sousTotalApresRemise, p) {
    if (sousTotalApresRemise >= p.seuilLivraisonGratuite) {
        return 0;
    }
    if (zone === "centre") {
        return p.fraisLivraison.centre;
    }
    if (zone === "peripherie") {
        return p.fraisLivraison.peripherie;
    }
    return p.fraisLivraison.interieur;
}
/** calculer les frais de paiement */
function calculerFraisPaiement(total, p) {
    const frais = Math.round(total * p.tauxFraisPaiement);
    if (frais < p.fraisPaiementMinimum) {
        return p.fraisPaiementMinimum;
    }
    return frais;
}
/** calculer tous les montants d'une commande */
function calculerMontants(sousTotal, commandesPassees, zone, p) {
    const remiseFidelite = calculerRemiseFidelite(sousTotal, commandesPassees, p);
    const apresFidelite = sousTotal - remiseFidelite;
    const reductionBienvenue = calculerReductionBienvenue(apresFidelite, commandesPassees, p);
    const sousTotalApresRemise = apresFidelite - reductionBienvenue;
    const fraisLivraison = calculerFraisLivraison(zone, sousTotalApresRemise, p);
    const total = sousTotalApresRemise + fraisLivraison;
    const fraisPaiement = calculerFraisPaiement(total, p);
    const aPayer = total + fraisPaiement;
    return {
        sousTotal,
        remiseFidelite,
        reductionBienvenue,
        sousTotalApresRemise,
        fraisLivraison,
        total,
        fraisPaiement,
        aPayer
    };
}
/** changer l'état d'une commande */
function appliquerTransition(actuel, transition) {
    const message = "transition_interdite (" +
        actuel.statut + " -> " + transition.vers + ")";
    if (transition.vers === "expediee") {
        if (actuel.statut === "en_preparation") {
            return (0, resultat_1.succes)({
                statut: "expediee",
                transporteur: transition.transporteur
            });
        }
        return (0, resultat_1.refus)(message);
    }
    if (transition.vers === "livree") {
        if (actuel.statut === "expediee") {
            return (0, resultat_1.succes)({
                statut: "livree",
                jour: transition.jour
            });
        }
        return (0, resultat_1.refus)(message);
    }
    if (transition.vers === "annulee") {
        if (actuel.statut === "en_preparation") {
            return (0, resultat_1.succes)({
                statut: "annulee",
                motif: transition.motif
            });
        }
        return (0, resultat_1.refus)(message);
    }
    return (0, resultat_1.refus)(message);
}
