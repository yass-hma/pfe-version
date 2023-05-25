# Guide d'utilisation des objets Point et Slider dans l'Application JSXGraph
## Table des matières
### Introduction
* Création d'un objet Point
* Création d'un objet Slider

### Introduction
Ce guide explique comment utiliser les objets Point et Slider dans l'application de création d'objets graphiques JSXGraph à travers une interface utilisateur.

### Création d'un Objet Point
Pour créer un Point, vous pouvez utiliser :

* Des coordonnées flottantes simples
Si aucun objet Slider n'est présent, entrez simplement les coordonnées pour le Point. Par exemple, si vous voulez créer un point à la position (1.0, 2.0), vous entrerez 1.0 pour la valeur X et 2.0 pour la valeur Y dans les champs correspondants dans l'interface utilisateur.

* En fonction d'autres objets Point ou Slider
Vous pouvez également créer un Point basé sur d'autres objets Point ou Slider. Pour ce faire, vous devez choisir les objets à partir desquels vous souhaitez créer ce Point et entrer une expression correspondante. Par exemple, si vous voulez créer un Point basé sur Point-s-p1, Point2-d-p2 et Slider1-f-s1, vous pouvez entrer l'expression p1.x * p2.y + s1 dans le champ d'expression.

### Création d'un Objet Slider

* Pour créer un Slider, vous devez fournir :

- Les coordonnées de départ et de fin du Slider : Ces coordonnées sont définies par deux points. Vous devez entrer ces points dans les champs correspondants dans l'interface utilisateur.

- Les valeurs minimale et maximale du Slider : Vous devez entrer ces valeurs dans les champs min et max de l'interface utilisateur.

- Le snapWidth du Slider : C'est la quantité par laquelle la valeur du Slider changera lorsque vous déplacerez le Slider. Vous devez entrer cette valeur dans le champ pas-value.

- Le nom et le postlabel du Slider : Vous pouvez entrer ces informations dans les champs correspondants dans l'interface utilisateur.