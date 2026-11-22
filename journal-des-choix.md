Journal des choix : Deli Market

Choix 1 : Utiliser Resultat

Nous avons utilisé Resultat pour savoir si une opération a réussi ou non. En cas de problème, le programme donne la raison du refus.

Choix 2 : Utiliser parametres.ts

Nous avons mis les prix de livraison, les taux et les limites dans parametres.ts. Cela permet de changer ces valeurs facilement sans modifier les calculs.

Choix 3 : Séparer le panier et le stock

Le panier contient les produits choisis par le client. Le stock contient les quantités disponibles. Le stock diminue seulement quand une commande est validée.

Choix 4 : Vérifier la commande avant de modifier le stock

Nous vérifions d’abord les produits et les quantités. Si tout est correct, la commande est enregistrée et le stock diminue. Sinon, la commande est refusée.

Choix 5 : Ajouter deux méthodes au dépôt

Nous avons ajouté trouver et mettreAJour pour retrouver une commande et modifier ses informations, notamment son statut.

Choix 6 : Calculer la livraison après les réductions

Nous appliquons d’abord les réductions. Ensuite, nous vérifions si le montant atteint 60 000 FCFA pour avoir la livraison gratuite.

Choix 7 : Ne pas compter les commandes annulées

Une commande annulée ne compte pas dans le nombre de commandes du client. Elle ne permet donc pas d’obtenir la remise fidélité.

Choix 8 : Utiliser les tests de Node.js

Nous avons utilisé les tests de Node.js pour vérifier notre programme sans ajouter de bibliothèque de tests supplémentaire.

Choix 9 : Simplifier les calculs

Au début, les calculs étaient tous dans ServiceCommande.valider. Le code était long et difficile à modifier.

Nous avons donc séparé les calculs dans regles.ts. Chaque fonction s’occupe d’un calcul : remise, réduction, livraison ou frais de paiement.

ServiceCommande.valider utilise maintenant ces fonctions.

Nous avons vérifié les 16 tests avant et après cette modification. Ils fonctionnaient toujours. Nous avons ensuite ajouté d’autres tests pour arriver à 45 tests au total.