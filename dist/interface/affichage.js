"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formaterMontant = formaterMontant;
exports.decrireStatut = decrireStatut;
exports.formaterCommande = formaterCommande;
/** On affiche les montants en FCFA */
function formaterMontant(montant) {
    const nombre = String(montant);
    const resultat = nombre.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return resultat + " FCFA";
}
/** On affiche l'état actuel de la commande */
function decrireStatut(statut) {
    if (statut.statut === "en_preparation") {
        return "en préparation";
    }
    if (statut.statut === "expediee") {
        return "expédiée par " + statut.transporteur;
    }
    if (statut.statut === "livree") {
        return "livrée le " + statut.jour;
    }
    if (statut.statut === "annulee") {
        return "annulée (" + statut.motif + ")";
    }
    return "";
}
/** On affiche les informations d'une commande */
function formaterCommande(c) {
    const lignes = [];
    lignes.push(c.id + " | " + c.client + " | " + c.jour +
        " | " + decrireStatut(c.statut));
    for (const ligne of c.lignes) {
        lignes.push("  " + ligne.quantite + " x " + ligne.nom +
            " (" + formaterMontant(ligne.prixUnitaire) + ")");
    }
    lignes.push("  livraison " + c.livraison.zone +
        " : " + formaterMontant(c.livraison.frais));
    lignes.push("  total " + formaterMontant(c.total) +
        " + frais " + c.operateur +
        " " + formaterMontant(c.fraisPaiement));
    lignes.push("  à payer : " + formaterMontant(c.aPayer));
    return lignes.join("\n");
}
