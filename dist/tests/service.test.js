"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = require("node:test");
const Panier_1 = require("../metier/Panier");
const aide_1 = require("./aide");
/** On crée un produit pour tester les prix */
const produitA = (prix) => ({
    id: "PX",
    nom: "Produit test",
    prix,
    stock: 10
});
/** On vérifie les montants des commandes */
(0, node_test_1.describe)("ServiceCommande : montants (R1, R3, R4, R5, R9)", () => {
    (0, node_test_1.it)("45 000 en périphérie, client avec 1 commande : livraison 1 500, total 46 500, frais 465", () => {
        const { service } = (0, aide_1.creerBanc)();
        const r = service.valider(aide_1.DEBUTANT, (0, aide_1.panierDe)(produitA(45000), 1), "peripherie", "Orange Money", "2026-11-21");
        strict_1.default.ok(r.ok);
        strict_1.default.equal(r.valeur.livraison.frais, 1500);
        strict_1.default.equal(r.valeur.total, 46500);
        strict_1.default.equal(r.valeur.fraisPaiement, 465);
        strict_1.default.equal(r.valeur.aPayer, 46965);
    });
    (0, node_test_1.it)("R9 : client sans commande, 45 000 : bienvenue 1 000, total 45 500, frais 455", () => {
        const { service } = (0, aide_1.creerBanc)();
        const r = service.valider(aide_1.NOUVEAU, (0, aide_1.panierDe)(produitA(45000), 1), "peripherie", "MTN MoMo", "2026-11-21");
        strict_1.default.ok(r.ok);
        strict_1.default.equal(r.valeur.total, 45500);
        strict_1.default.equal(r.valeur.aPayer, 45955);
    });
    /** On vérifie quand la livraison est gratuite */
    (0, node_test_1.it)("livraison gratuite à 60 000 pile (seuil inclus)", () => {
        const { service } = (0, aide_1.creerBanc)();
        const r = service.valider(aide_1.DEBUTANT, (0, aide_1.panierDe)(produitA(60000), 1), "peripherie", "Moov Money", "2026-11-21");
        strict_1.default.ok(r.ok);
        strict_1.default.equal(r.valeur.livraison.frais, 0);
        strict_1.default.equal(r.valeur.total, 60000);
        strict_1.default.equal(r.valeur.fraisPaiement, 600);
    });
    (0, node_test_1.it)("livraison facturée à 59 999", () => {
        const { service } = (0, aide_1.creerBanc)();
        const r = service.valider(aide_1.DEBUTANT, (0, aide_1.panierDe)(produitA(59999), 1), "peripherie", "Orange Money", "2026-11-21");
        strict_1.default.ok(r.ok);
        strict_1.default.equal(r.valeur.livraison.frais, 1500);
        strict_1.default.equal(r.valeur.total, 61499);
        strict_1.default.equal(r.valeur.fraisPaiement, 615);
    });
    /** On vérifie la réduction fidélité */
    (0, node_test_1.it)("R3 : client fidèle, 64 000 : remise 5 120 -> 58 880, donc livraison facturée", () => {
        const { service } = (0, aide_1.creerBanc)();
        const r = service.valider(aide_1.FIDELE, (0, aide_1.panierDe)(produitA(64000), 1), "peripherie", "Orange Money", "2026-11-21");
        strict_1.default.ok(r.ok);
        strict_1.default.equal(r.valeur.livraison.frais, 1500);
        strict_1.default.equal(r.valeur.total, 60380);
        strict_1.default.equal(r.valeur.fraisPaiement, 604);
    });
    (0, node_test_1.it)("R3 : client fidèle, 70 000 : remise 5 600 -> 64 400, livraison gratuite", () => {
        const { service } = (0, aide_1.creerBanc)();
        const r = service.valider(aide_1.FIDELE, (0, aide_1.panierDe)(produitA(70000), 1), "peripherie", "Orange Money", "2026-11-21");
        strict_1.default.ok(r.ok);
        strict_1.default.equal(r.valeur.total, 64400);
        strict_1.default.equal(r.valeur.livraison.frais, 0);
    });
    /** On vérifie les frais de paiement */
    (0, node_test_1.it)("R5 : frais de paiement minimum 100 pour un petit total", () => {
        const { service } = (0, aide_1.creerBanc)();
        const r = service.valider(aide_1.DEBUTANT, (0, aide_1.panierDe)(produitA(5000), 1), "centre", "Orange Money", "2026-11-21");
        strict_1.default.ok(r.ok);
        strict_1.default.equal(r.valeur.total, 6000);
        strict_1.default.equal(r.valeur.fraisPaiement, 100);
        strict_1.default.equal(r.valeur.aPayer, 6100);
    });
    (0, node_test_1.it)("R4 : livraison à l'intérieur du pays facturée 5 000", () => {
        const { service } = (0, aide_1.creerBanc)();
        const r = service.valider(aide_1.DEBUTANT, (0, aide_1.panierDe)(produitA(10000), 1), "interieur", "Orange Money", "2026-11-21");
        strict_1.default.ok(r.ok);
        strict_1.default.equal(r.valeur.livraison.frais, 5000);
    });
});
/** On vérifie les commandes et le stock */
(0, node_test_1.describe)("ServiceCommande : validation et stock (R2)", () => {
    (0, node_test_1.it)("la validation diminue le stock et enregistre la commande", () => {
        const { service, stock, depot } = (0, aide_1.creerBanc)();
        const r = service.valider(aide_1.DEBUTANT, (0, aide_1.panierDe)(aide_1.PAGNE, 3), "centre", "Orange Money", "2026-11-21");
        strict_1.default.ok(r.ok);
        strict_1.default.equal(stock.disponible(aide_1.PAGNE.id), 17);
        strict_1.default.equal(depot.tout().length, 1);
    });
    (0, node_test_1.it)("l'ajout au panier ne touche pas au stock", () => {
        const { stock } = (0, aide_1.creerBanc)();
        const panier = new Panier_1.Panier();
        panier.ajouter(aide_1.PAGNE, 3);
        strict_1.default.equal(stock.disponible(aide_1.PAGNE.id), 20);
    });
    /** On refuse si le stock est insuffisant */
    (0, node_test_1.it)("quantité supérieure au stock : refus, stock et dépôt intacts", () => {
        const { service, stock, depot } = (0, aide_1.creerBanc)();
        const r = service.valider(aide_1.DEBUTANT, (0, aide_1.panierDe)(aide_1.NAPPE, 6), "centre", "Orange Money", "2026-11-21");
        strict_1.default.ok(!r.ok);
        strict_1.default.equal(r.motif, "stock_insuffisant (Nappe en pagne)");
        strict_1.default.equal(stock.disponible(aide_1.NAPPE.id), 5);
        strict_1.default.equal(depot.tout().length, 0);
    });
    (0, node_test_1.it)("panier vide : refusé", () => {
        const { service } = (0, aide_1.creerBanc)();
        const r = service.valider(aide_1.DEBUTANT, new Panier_1.Panier(), "centre", "Orange Money", "2026-11-21");
        strict_1.default.ok(!r.ok);
        strict_1.default.equal(r.motif, "panier_vide");
    });
});
/** On vérifie les statuts des commandes */
(0, node_test_1.describe)("ServiceCommande : statuts (R6)", () => {
    (0, node_test_1.it)("en préparation -> expédiée -> livrée", () => {
        const { service } = (0, aide_1.creerBanc)();
        const c = service.valider(aide_1.DEBUTANT, (0, aide_1.panierDe)(aide_1.PAGNE, 1), "centre", "Orange Money", "2026-11-21");
        strict_1.default.ok(c.ok);
        const e = service.changerStatut(c.valeur.id, {
            vers: "expediee",
            transporteur: "Express Abidjan"
        });
        strict_1.default.ok(e.ok);
        const l = service.changerStatut(c.valeur.id, {
            vers: "livree",
            jour: "2026-11-23"
        });
        strict_1.default.ok(l.ok);
        strict_1.default.deepEqual(l.valeur.statut, {
            statut: "livree",
            jour: "2026-11-23"
        });
    });
    /** On vérifie qu'une annulation remet le stock */
    (0, node_test_1.it)("annulation depuis en préparation : acceptée, stock remis", () => {
        const { service, stock } = (0, aide_1.creerBanc)();
        const c = service.valider(aide_1.DEBUTANT, (0, aide_1.panierDe)(aide_1.PAGNE, 4), "centre", "Orange Money", "2026-11-21");
        strict_1.default.ok(c.ok);
        strict_1.default.equal(stock.disponible(aide_1.PAGNE.id), 16);
        const a = service.changerStatut(c.valeur.id, {
            vers: "annulee",
            motif: "client absent"
        });
        strict_1.default.ok(a.ok);
        strict_1.default.equal(stock.disponible(aide_1.PAGNE.id), 20);
    });
    /** On refuse l'annulation après la livraison */
    (0, node_test_1.it)("annulation depuis livrée : refusée, statut et stock inchangés", () => {
        const { service, stock, depot } = (0, aide_1.creerBanc)();
        const c = service.valider(aide_1.DEBUTANT, (0, aide_1.panierDe)(aide_1.PAGNE, 2), "centre", "Orange Money", "2026-11-21");
        strict_1.default.ok(c.ok);
        service.changerStatut(c.valeur.id, {
            vers: "expediee",
            transporteur: "T1"
        });
        service.changerStatut(c.valeur.id, {
            vers: "livree",
            jour: "2026-11-22"
        });
        const a = service.changerStatut(c.valeur.id, {
            vers: "annulee",
            motif: "test"
        });
        strict_1.default.ok(!a.ok);
        strict_1.default.equal(stock.disponible(aide_1.PAGNE.id), 18);
        strict_1.default.equal(depot.trouver(c.valeur.id)?.statut.statut, "livree");
    });
    (0, node_test_1.it)("livrer sans expédier est refusé ; commande inconnue est refusée", () => {
        const { service } = (0, aide_1.creerBanc)();
        const c = service.valider(aide_1.DEBUTANT, (0, aide_1.panierDe)(aide_1.PAGNE, 1), "centre", "Orange Money", "2026-11-21");
        strict_1.default.ok(c.ok);
        strict_1.default.ok(!service.changerStatut(c.valeur.id, {
            vers: "livree",
            jour: "2026-11-22"
        }).ok);
        strict_1.default.ok(!service.changerStatut("CMD-999", {
            vers: "annulee",
            motif: "test"
        }).ok);
    });
});
