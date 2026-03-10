# Personne 3 — Paiements, Recouvrement & Statistiques (Business Logic)

Tâches à réaliser :

1. Enregistrer les paiements manuels
   - Créer le modèle Payment
   - Implémenter les routes /payments (CRUD)
   - Valider les données avec Joi

2. Suivre les actions de recouvrement
   - Créer le modèle CollectionAction
   - Implémenter les routes /collections (CRUD)
   - Valider les données avec Joi

3. Créer des statistiques simples
   - Implémenter les routes /stats
   - Générer des statistiques sur les paiements, factures, recouvrements

4. Écrire des tests unitaires avec Jest
   - Tester les endpoints /payments, /collections, /stats
   - Tester la logique métier

5. Créer la documentation Swagger
   - Documenter les endpoints /payments, /collections, /stats

6. Respecter l’organisation Git recommandée
   - Travailler sur la branche feature/payments-collections-stats
   - Faire des Pull Requests vers develop

7. Structure du projet
   - src/controllers
   - src/models
   - src/routes
   - src/middleware
   - src/services
   - src/validations
   - src/config
   - src/tests
   - swagger/
   - app.js, server.js
