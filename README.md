# Scrabble Game

Aplikacja webowa do zarządzania laboratoriami z funkcjonalnością gry w Scrabble.

## Live Demo

**[https://laboratory-app-14998.vercel.app/](https://laboratory-app-14998.vercel.app/)**

## O projekcie

Aplikacja stworzona w ramach projektu uczelnianego, łącząca system zarządzania użytkownikami z interaktywną grą Scrabble. Użytkownicy mogą rejestrować się, zarządzać profilem oraz tworzyć i rozgrywać gry Scrabble z polskim zestawem liter (100 płytek, bez jokerów).

## Funkcjonalności

- **Autoryzacja użytkowników** - rejestracja, logowanie z weryfikacją email
- **Zarządzanie profilem** - edycja danych, zapis adresu w bazie danych
- **Gra Scrabble** - plansza 15x15, polski zestaw liter, system punktacji
- **Zarządzanie grami** - tworzenie gier dla 2-4 graczy, zapisywanie stanu gry
- **Responsywny design** - biblioteka Merakiui, dostosowanie do urządzeń mobilnych

## Technologie

- **Next.js 16** - React framework z App Router
- **React 19** - biblioteka UI
- **Firebase** - Authentication + Firestore Database
- **Tailwind CSS 4** - stylowanie
- **Playwright** - testy E2E
- **Vercel** - hosting i deployment

## 📦 Instalacja lokalna

```bash
# Klonowanie repozytorium
git clone https://github.com/Usadowiony/Projekt-Fameworki.git
cd frontend-laboratory-app

# Instalacja zależności
npm install

# Konfiguracja zmiennych środowiskowych
# Utwórz plik .env i dodaj klucze Firebase:
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...

# Uruchomienie serwera deweloperskiego
npm run dev