"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Panier = void 0;
const resultat_1 = require("../modele/resultat");
const parametres_1 = require("./parametres");
const regles_1 = require("./regles");
class Panier {
    parametres;
    lignesPanier = [];
    constructor(parametres = parametres_1.PARAMETRES_PAR_DEFAUT) {
        this.parametres = parametres;
    }
    /** On ajoute un produit au panier */
    ajouter(produit, quantite) {
        const verification = (0, regles_1.validerQuantite)(quantite, this.parametres);
        if (!verification.ok) {
            return (0, resultat_1.refus)(verification.motif);
        }
        for (const ligne of this.lignesPanier) {
            if (ligne.produitId === produit.id) {
                const nouvelleQuantite = ligne.quantite + quantite;
                const resultat = (0, regles_1.validerQuantite)(nouvelleQuantite, this.parametres);
                if (!resultat.ok) {
                    return (0, resultat_1.refus)(resultat.motif + " pour " + produit.nom);
                }
                const position = this.lignesPanier.indexOf(ligne);
                this.lignesPanier.splice(position, 1, {
                    produitId: produit.id,
                    nom: produit.nom,
                    prixUnitaire: produit.prix,
                    quantite: nouvelleQuantite
                });
                return (0, resultat_1.succes)(null);
            }
        }
        this.lignesPanier.push({
            produitId: produit.id,
            nom: produit.nom,
            prixUnitaire: produit.prix,
            quantite: quantite
        });
        return (0, resultat_1.succes)(null);
    }
    /** On retire un produit du panier */
    retirer(produitId) {
        for (const ligne of this.lignesPanier) {
            if (ligne.produitId === produitId) {
                const position = this.lignesPanier.indexOf(ligne);
                this.lignesPanier.splice(position, 1);
                return true;
            }
        }
        return false;
    }
    /** On récupère les produits du panier */
    lignes() {
        const copie = [];
        for (const ligne of this.lignesPanier) {
            copie.push({ ...ligne });
        }
        return copie;
    }
    /** On vérifie si le panier est vide */
    estVide() {
        return this.lignesPanier.length === 0;
    }
    /** On calcule le prix total des produits */
    sousTotal() {
        let total = 0;
        for (const ligne of this.lignesPanier) {
            total = total + ligne.prixUnitaire * ligne.quantite;
        }
        return total;
    }
}
exports.Panier = Panier;
