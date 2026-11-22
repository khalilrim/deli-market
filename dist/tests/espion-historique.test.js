"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = require("node:test");
const affichage_1 = require("../interface/affichage");
const Panier_1 = require("../metier/Panier");
const aide_1 = require("./aide");
/** On vérifie les messages du programme */
(0, node_test_1.describe)("Notificateur espion", () => {
    (0, node_test_1.it)("une commande validée envoie une notification", () => {
        const { service, notificateur } = (0, aide_1.creerBanc)();
        service.valider(aide_1.DEBUTANT, (0, aide_1.panierDe)(aide_1.PAGNE, 1), "centre", "Orange Money", "2026-11-21");
        strict_1.default.equal(notificateur.messages.length, 1);
        strict_1.default.match(notificateur.messages[0] ?? "", /CMD-001 validée/);
    });
    (0, node_test_1.it)("un refus est notifié avec son motif", () => {
        const { service, notificateur } = (0, aide_1.creerBanc)();
        service.valider(aide_1.DEBUTANT, new Panier_1.Panier(), "centre", "Orange Money", "2026-11-21");
        strict_1.default.deepEqual(notificateur.messages, ["Refus : panier_vide"]);
    });
});
/** On vérifie les réductions des clients */
(0, node_test_1.describe)("Historique du client (R3, R9)", () => {
    (0, node_test_1.it)("la bienvenue ne s'applique qu'à la première commande", () => {
        const { service } = (0, aide_1.creerBanc)();
        const premiere = service.valider(aide_1.NOUVEAU, (0, aide_1.panierDe)(aide_1.PAGNE, 1), "centre", "Orange Money", "2026-11-21");
        const seconde = service.valider(aide_1.NOUVEAU, (0, aide_1.panierDe)(aide_1.PAGNE, 1), "centre", "Orange Money", "2026-11-22");
        strict_1.default.ok(premiere.ok && seconde.ok);
        strict_1.default.equal(premiere.valeur.total, 15000 - 1000 + 1000);
        strict_1.default.equal(seconde.valeur.total, 15000 + 1000);
    });
    (0, node_test_1.it)("les commandes enregistrées comptent pour la remise fidélité", () => {
        const { service } = (0, aide_1.creerBanc)();
        service.valider(aide_1.DEBUTANT, (0, aide_1.panierDe)(aide_1.SAVON, 1), "centre", "Orange Money", "2026-11-21"); // 1 + 1 = 2
        const r = service.valider(aide_1.DEBUTANT, (0, aide_1.panierDe)(aide_1.PAGNE, 2), "centre", "Orange Money", "2026-11-22");
        strict_1.default.ok(r.ok);
        /** On vérifie le total après la remise et la livraison*/
        strict_1.default.equal(r.valeur.total, 28600);
    });
    (0, node_test_1.it)("une commande annulée ne compte pas", () => {
        const { service } = (0, aide_1.creerBanc)();
        const c = service.valider(aide_1.NOUVEAU, (0, aide_1.panierDe)(aide_1.SAVON, 1), "centre", "Orange Money", "2026-11-21");
        strict_1.default.ok(c.ok);
        service.changerStatut(c.valeur.id, { vers: "annulee", motif: "test" });
        const r = service.valider(aide_1.NOUVEAU, (0, aide_1.panierDe)(aide_1.PAGNE, 1), "centre", "Orange Money", "2026-11-22");
        strict_1.default.ok(r.ok);
        strict_1.default.equal(r.valeur.total, 15000 - 1000 + 1000);
    });
});
/** On vérifie comment les montants et les statuts s'affichent */
(0, node_test_1.describe)("Affichage", () => {
    (0, node_test_1.it)("formaterMontant sépare les milliers", () => {
        strict_1.default.equal((0, affichage_1.formaterMontant)(500), "500 FCFA");
        strict_1.default.equal((0, affichage_1.formaterMontant)(47470), "47 470 FCFA");
        strict_1.default.equal((0, affichage_1.formaterMontant)(1000000), "1 000 000 FCFA");
    });
    (0, node_test_1.it)("decrireStatut traite les quatre variantes", () => {
        strict_1.default.equal((0, affichage_1.decrireStatut)({ statut: "en_preparation" }), "en préparation");
        strict_1.default.equal((0, affichage_1.decrireStatut)({ statut: "expediee", transporteur: "T1" }), "expédiée par T1");
        strict_1.default.equal((0, affichage_1.decrireStatut)({ statut: "livree", jour: "2026-11-22" }), "livrée le 2026-11-22");
        strict_1.default.equal((0, affichage_1.decrireStatut)({ statut: "annulee", motif: "client" }), "annulée (client)");
    });
});
