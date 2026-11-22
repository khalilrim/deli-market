"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PARAMETRES_PAR_DEFAUT = void 0;
/** On met les prix des livraisons et le montant pour la livraison gratuite */
/** On définit aussi les réductions, les frais de paiement et les quantités */
exports.PARAMETRES_PAR_DEFAUT = {
    fraisLivraison: { centre: 1000, peripherie: 1500, interieur: 5000 },
    seuilLivraisonGratuite: 60000,
    tauxRemiseFidelite: 0.08,
    commandesPourFidelite: 2,
    tauxFraisPaiement: 0.01,
    fraisPaiementMinimum: 100,
    quantiteMin: 1,
    quantiteMax: 10,
    reductionBienvenue: 1000
};
