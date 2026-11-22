"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DepotCommandesFactice = void 0;
class DepotCommandesFactice {
    contenu = [];
    /** On ajoute une commande pour les tests */
    ajouter(commande) {
        this.contenu.push(commande);
    }
    /** On récupère toutes les commandes */
    tout() {
        return this.contenu;
    }
    /** On cherche les commandes d'un client */
    parClient(nomClient) {
        return this.contenu.filter((c) => c.client === nomClient);
    }
    /** On cherche une commande avec son id */
    trouver(id) {
        return this.contenu.find((c) => c.id === id);
    }
    /** On modifie une commande */
    mettreAJour(commande) {
        const index = this.contenu.findIndex((c) => c.id === commande.id);
        if (index >= 0) {
            this.contenu[index] = commande;
        }
    }
}
exports.DepotCommandesFactice = DepotCommandesFactice;
