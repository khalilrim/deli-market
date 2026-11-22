"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DepotCommandesMemoire = void 0;
class DepotCommandesMemoire {
    commandes = [];
    /** On ajoute une nouvelle commande */
    ajouter(commande) {
        this.commandes.push(commande);
    }
    /** On récupère toutes les commandes */
    tout() {
        const liste = [];
        for (const commande of this.commandes) {
            liste.push(commande);
        }
        return liste;
    }
    /** On récupère les commandes d'un client */
    parClient(nomClient) {
        const resultat = [];
        for (const commande of this.commandes) {
            if (commande.client === nomClient) {
                resultat.push(commande);
            }
        }
        return resultat;
    }
    /** On cherche une commande avec son id */
    trouver(id) {
        for (const commande of this.commandes) {
            if (commande.id === id) {
                return commande;
            }
        }
        return undefined;
    }
    /** On modifie une commande déjà enregistrée */
    mettreAJour(commande) {
        for (let i = 0; i < this.commandes.length; i++) {
            const ancienneCommande = this.commandes[i];
            if (ancienneCommande !== undefined &&
                ancienneCommande.id === commande.id) {
                this.commandes.splice(i, 1, commande);
                return;
            }
        }
    }
}
exports.DepotCommandesMemoire = DepotCommandesMemoire;
