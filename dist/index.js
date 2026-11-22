"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DepotCommandesMemoire_1 = require("./donnees/DepotCommandesMemoire");
const affichage_1 = require("./interface/affichage");
const NotificateurConsole_1 = require("./interface/NotificateurConsole");
const Panier_1 = require("./metier/Panier");
const ServiceCommande_1 = require("./metier/ServiceCommande");
const Stock_1 = require("./metier/Stock");
/** Les produits de la boutique */
const PAGNE = {
    id: "P1", nom: "Pagne wax 6 yards", prix: 15000, stock: 20
};
const NAPPE = {
    id: "P2", nom: "Nappe en pagne", prix: 12000, stock: 5
};
const COUSSIN = {
    id: "P3", nom: "Coussin en pagne", prix: 6500, stock: 12
};
const RAPHIA = {
    id: "P4", nom: "Panier en raphia", prix: 8000, stock: 3
};
/** On ajoute les produits au stock */
const stock = new Stock_1.Stock();
for (const produit of [PAGNE, NAPPE, COUSSIN, RAPHIA]) {
    stock.ajouterProduit(produit);
}
const service = new ServiceCommande_1.ServiceCommande(new DepotCommandesMemoire_1.DepotCommandesMemoire(), stock, new NotificateurConsole_1.NotificateurConsole());
/** On affiche les titres */
function titre(texte) {
    console.log(`\n=== ${texte} ===`);
}
/** On affiche le stock */
function afficherStock() {
    const etat = [PAGNE, NAPPE, COUSSIN, RAPHIA].map((p) => `${p.nom} : ${stock.disponible(p.id)}`);
    console.log(`   Stock -> ${etat.join(" | ")}`);
}
/** Les clients de la boutique */
const awa = { nom: "Awa", commandesPassees: 0 };
const yao = { nom: "Yao", commandesPassees: 0 };
const koffi = { nom: "Koffi", commandesPassees: 3 };
console.log("Deli Market : démonstration");
afficherStock();
/** Awa passe une commande */
titre("1. Awa (première commande) : panier à plusieurs produits");
const panierAwa = new Panier_1.Panier();
panierAwa.ajouter(PAGNE, 2);
panierAwa.ajouter(NAPPE, 1);
panierAwa.ajouter(COUSSIN, 2);
console.log(`   Sous-total du panier : ${(0, affichage_1.formaterMontant)(panierAwa.sousTotal())} (stock encore intact)`);
afficherStock();
const commandeAwa = service.valider(awa, panierAwa, "peripherie", "Orange Money", "2026-11-21");
if (commandeAwa.ok) {
    console.log((0, affichage_1.formaterCommande)(commandeAwa.valeur));
}
afficherStock();
/** Yao commande plus que le stock disponible */
titre("2. Yao : commande refusée (stock insuffisant)");
const panierYao = new Panier_1.Panier();
panierYao.ajouter(RAPHIA, 5);
const refusee = service.valider(yao, panierYao, "centre", "MTN MoMo", "2026-11-21");
if (!refusee.ok) {
    console.log(`   Refusée : ${refusee.motif}`);
}
afficherStock();
/** On vérifie la quantité maximale */
titre("3. Yao : quantité hors limites dans le panier");
const trop = new Panier_1.Panier().ajouter(PAGNE, 11);
if (!trop.ok) {
    console.log(`   Refusé : ${trop.motif}`);
}
/** Koffi a une réduction */
titre("4. Koffi (client fidèle) : remise de 8 %");
const panierKoffi = new Panier_1.Panier();
panierKoffi.ajouter(PAGNE, 5);
const commandeKoffi = service.valider(koffi, panierKoffi, "interieur", "Moov Money", "2026-11-21");
if (commandeKoffi.ok) {
    console.log((0, affichage_1.formaterCommande)(commandeKoffi.valeur));
}
/** On expédie et livre la commande */
titre("5. Awa : expédition puis livraison");
if (commandeAwa.ok) {
    const expediee = service.changerStatut(commandeAwa.valeur.id, { vers: "expediee", transporteur: "Express Lagune" });
    if (expediee.ok) {
        console.log(`   ${expediee.valeur.id} -> expédiée`);
    }
    const livree = service.changerStatut(commandeAwa.valeur.id, { vers: "livree", jour: "2026-11-23" });
    if (livree.ok) {
        console.log(`   ${livree.valeur.id} -> livrée`);
    }
}
/** On annule une commande */
titre("6. Annulation permise (Koffi, en préparation) : le stock est remis");
afficherStock();
if (commandeKoffi.ok) {
    const annulee = service.changerStatut(commandeKoffi.valeur.id, { vers: "annulee", motif: "client injoignable" });
    if (annulee.ok) {
        console.log(`   ${annulee.valeur.id} -> annulée`);
    }
}
afficherStock();
/** On refuse l'annulation d'une commande livrée */
titre("7. Annulation refusée (commande d'Awa déjà livrée)");
if (commandeAwa.ok) {
    const refus = service.changerStatut(commandeAwa.valeur.id, { vers: "annulee", motif: "regret" });
    if (!refus.ok) {
        console.log(`   Refusée : ${refus.motif}`);
    }
}
afficherStock();
