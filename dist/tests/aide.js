"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FIDELE = exports.DEBUTANT = exports.NOUVEAU = exports.PRODUIT_TEST_ID = exports.SAVON = exports.NAPPE = exports.PAGNE = void 0;
exports.creerBanc = creerBanc;
exports.panierDe = panierDe;
const DepotCommandesFactice_1 = require("../doublures/DepotCommandesFactice");
const NotificateurEspion_1 = require("../doublures/NotificateurEspion");
const Panier_1 = require("../metier/Panier");
const ServiceCommande_1 = require("../metier/ServiceCommande");
const Stock_1 = require("../metier/Stock");
exports.PAGNE = { id: "P1", nom: "Pagne wax", prix: 15000, stock: 20 };
exports.NAPPE = { id: "P2", nom: "Nappe en pagne", prix: 12000, stock: 5 };
exports.SAVON = { id: "P3", nom: "Savon noir", prix: 2000, stock: 50 };
/** les produits utilisées pour les tests */
exports.PRODUIT_TEST_ID = "PX";
exports.NOUVEAU = { nom: "Nouveau", commandesPassees: 0 };
exports.DEBUTANT = { nom: "Debutant", commandesPassees: 1 };
exports.FIDELE = { nom: "Fidele", commandesPassees: 2 };
/** on prépare les éléments nécessaires pour les tests */
function creerBanc() {
    const depot = new DepotCommandesFactice_1.DepotCommandesFactice();
    const notificateur = new NotificateurEspion_1.NotificateurEspion();
    const stock = new Stock_1.Stock();
    for (const p of [exports.PAGNE, exports.NAPPE, exports.SAVON])
        stock.ajouterProduit(p);
    stock.ajouterProduit({ id: exports.PRODUIT_TEST_ID, nom: "Produit test", prix: 0, stock: 10 });
    const service = new ServiceCommande_1.ServiceCommande(depot, stock, notificateur);
    return { depot, notificateur, stock, service };
}
/** on crée un panier avec un produit et une quantité */
function panierDe(produit, quantite) {
    const panier = new Panier_1.Panier();
    panier.ajouter(produit, quantite);
    return panier;
}
