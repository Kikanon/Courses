# Courses API
- podatkovna baza Postgres
- api za učenje (podobno kot https://app.thesmartestway.com/ ali https://www.brainscape.com/)

- aplikacija vsebuje vprašanja, ki so združena v sklope(course)
- vsako vprašanje je možno oceniti z 1-5 (5 pomeni da je vprašanje opravljeno)
- ko so vsa vprašanjaa v sklopu opravljena ga je možno resertirati

## Dostopne poti

### Zmeraj dostopni
  - [POST]`/api/auth/signup` Registracija novega uporabnika
  - [POST]`/api/auth/login` Prijava z e-naslovom ter geslom

### Za lažje testiranje
  - [GET]`/api/users` Seznam vseh uporabnikov
  - [GET]`/api/users/{id}` Podrobni podatki o enem uporabniku
  - [POST]`/api/auth/signout` Odjava
  - [GET]`/api/auth` Vrne podatke o trenutno prijavljenem uporabniku
### Kreiranje podatkov
  - [POST]`/api/course` Ustvari novi sklop
  - [POST]`/api/course/{id}` Doda novo vprašanje v sklop
  - [GET]`/api/course` Vrne seznam vseh sklopov
  - [GET]`/api/course/{id}` Vrne podatke o sklopu, vključno z vsemi vprašanji
### Uporaba podatkov
  - [POST]`/api/course/startCourse` Uporabniku dodelimo sklop(uporabnik ga začne reševati)
  - [POST]`/api/course/resetCourse` Ponastavimo odgovore na vprašanja
  - [GET]`/api/course/getStats/{id}` Prodibimo statistiko končanih vprašanj
  - [POST]`/api/grade` Podamo oceno vprašanja 1-5
  - [GET]`/api/grade` Pridobimo zadnjo veljavno oceno vprašanja

## Dodatne funkcionalnosti

- JWT avtentikacija
- Swagger dokumentacija in Swagger UI
- Routi se začnejo z `/api`
- `docker-compose.yml` z katerim je možno pognati aplikacijo

## Uporaba
- Za zagon docker slike se najprej uporabi ukaz `docker-compose build` in nato za zagon  `docker-compose up`.
- Za zagon v razvijalskem načinu je potrebno dodati datoteko `.env.development` ter namestiti knjižnice z `npm i`. Aplikacija se nato zažene z `npm run start:dev`.

