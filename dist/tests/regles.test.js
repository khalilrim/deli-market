"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = require("node:test");
const Panier_1 = require("../metier/Panier");
const Stock_1 = require("../metier/Stock");
const aide_1 = require("./aide");
// On vérifie le fonctionnement du panier
(0, node_test_1.describe)("Panier (R1)", () => {
    (0, node_test_1.it)("un nouveau panier est vide, sous-total 0", () => {
        const panier = new Panier_1.Panier();
        strict_1.default.ok(panier.estVide());
        strict_1.default.equal(panier.sousTotal(), 0);
    });
    (0, node_test_1.it)("sous-total = somme des prix × quantités", () => {
        const panier = new Panier_1.Panier();
        panier.ajouter(aide_1.PAGNE, 2); // 30 000
        panier.ajouter(aide_1.SAVON, 3); // 6 000
        strict_1.default.equal(panier.sousTotal(), 36000);
    });
    (0, node_test_1.it)("ajouter deux fois le même produit cumule la quantité", () => {
        const panier = new Panier_1.Panier();
        panier.ajouter(aide_1.PAGNE, 2);
        panier.ajouter(aide_1.PAGNE, 3);
        strict_1.default.equal(panier.lignes()[0]?.quantite, 5);
    });
    // On vérifie les limites de quantité
    (0, node_test_1.it)("quantité 10 acceptée, 11 refusée", () => {
        strict_1.default.ok(new Panier_1.Panier().ajouter(aide_1.PAGNE, 10).ok);
        strict_1.default.ok(!new Panier_1.Panier().ajouter(aide_1.PAGNE, 11).ok);
    });
    (0, node_test_1.it)("le cumul ne peut pas dépasser 10 et le panier reste inchangé", () => {
        const panier = new Panier_1.Panier();
        panier.ajouter(aide_1.PAGNE, 6);
        const r = panier.ajouter(aide_1.PAGNE, 5);
        strict_1.default.ok(!r.ok);
        strict_1.default.equal(panier.lignes()[0]?.quantite, 6);
    });
    // On vérifie qu'on peut retirer un produit
    (0, node_test_1.it)("retirer supprime la ligne ; produit absent renvoie false", () => {
        const panier = new Panier_1.Panier();
        panier.ajouter(aide_1.PAGNE, 1);
        strict_1.default.equal(panier.retirer(aide_1.PAGNE.id), true);
        strict_1.default.equal(panier.retirer(aide_1.PAGNE.id), false);
        strict_1.default.ok(panier.estVide());
    });
    (0, node_test_1.it)("lignes() renvoie une copie : la modifier ne change pas le panier", () => {
        const panier = new Panier_1.Panier();
        panier.ajouter(aide_1.PAGNE, 1);
        panier.lignes().pop();
        strict_1.default.equal(panier.lignes().length, 1);
    });
});
// On vérifie le fonctionnement du stock
(0, node_test_1.describe)("Stock (R2)", () => {
    const creer = () => {
        const stock = new Stock_1.Stock();
        stock.ajouterProduit(aide_1.NAPPE); // 5 en stock
        return stock;
    };
    (0, node_test_1.it)("retirer la quantité exacte donne 0", () => {
        const stock = creer();
        strict_1.default.equal(stock.retirer(aide_1.NAPPE.id, 5), true);
        strict_1.default.equal(stock.disponible(aide_1.NAPPE.id), 0);
    });
    /** On vérifie qu'on ne peut pas retirer plus que le stock */
    (0, node_test_1.it)("retirer plus que le stock : false et rien ne change", () => {
        const stock = creer();
        strict_1.default.equal(stock.retirer(aide_1.NAPPE.id, 6), false);
        strict_1.default.equal(stock.disponible(aide_1.NAPPE.id), 5);
    });
    /** On remet les produits dans le stock */
    (0, node_test_1.it)("remettre augmente le stock", () => {
        const stock = creer();
        stock.retirer(aide_1.NAPPE.id, 2);
        stock.remettre(aide_1.NAPPE.id, 2);
        strict_1.default.equal(stock.disponible(aide_1.NAPPE.id), 5);
    });
    /** On vérifie le cas d'un produit inconnu */
    (0, node_test_1.it)("produit inconnu : disponible 0, retirer et remettre renvoient false", () => {
        const stock = creer();
        strict_1.default.equal(stock.disponible("ZZ"), 0);
        strict_1.default.equal(stock.retirer("ZZ", 1), false);
        strict_1.default.equal(stock.remettre("ZZ", 1), false);
        strict_1.default.equal(stock.trouver("ZZ"), undefined);
    });
});
