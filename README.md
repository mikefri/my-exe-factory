# 🚀 Web2Exe Cloud Factory

**Web2Exe Cloud Factory** est une solution automatisée permettant de transformer n'importe quel site web (archive ZIP contenant HTML/CSS/JS) en une application Windows native (.EXE) via **GitHub Actions**.

---

## ✨ Points Forts

* **Interface Glassmorphism** : Design moderne "Deep Space" avec effets de flou et de lueur.
* **Indicateur de Vie** : Animation pulsée et spinner pour confirmer que la page n'est pas figée.
* **Chronomètre en Temps Réel** : Suivi précis de la durée de compilation.
* **Zéro Installation** : Tout se passe dans le cloud. Pas besoin de Node.js ou d'Electron sur votre PC.

---

## 🛠️ Le Processus en 9 Étapes

L'usine suit un flux de travail rigoureux pour garantir un binaire fonctionnel :

1.  **Transmission Cloud** : Envoi sécurisé de votre ZIP vers le serveur temporaire.
2.  **Initialisation GitHub** : Réveil des serveurs de build via API.
3.  **Extraction intelligente** : Décompression des sources avec correction d'encodage.
4.  **Injection des Assets** : Configuration du nom et de l'icône de l'application.
5.  **Préparation Environnement** : Setup de Node.js v18.
6.  **Résolution Dépendances** : Installation propre des modules `npm`.
7.  **Compilation du Binaire** : Génération du `.exe` via Electron-Builder.
8.  **Vérification Intégrité** : Scan du fichier pour s'assurer qu'il est prêt.
9.  **Génération Release** : Création du lien de téléchargement final.

---

## 🚀 Guide d'Utilisation Rapide

### 1. Préparation du ZIP
Votre archive doit contenir au minimum un fichier `index.html` à la racine.
```text
votre-projet.zip
├── index.html
├── style.css
└── script.js
