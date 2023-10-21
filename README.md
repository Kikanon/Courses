# Navodila za izdelavo testnega projekta

- ustvari nov Nestjs projekt z naslednjimi lastnostmi:
  - za podatkovno bazo uporabi Postgres
  - za ORM uporabi TypeORM
- ustvari api za aplikacijo za učenje (podobno kot https://app.thesmartestway.com/ ali https://www.brainscape.com/)

  - aplikacija naj ima seznam vprašanj in odgovorov
  - vsako vprašanje lahko oceniš 1-5 (večkrat)
  - če vprašanje oceniš z 5 je vprašanje opravljeno
  - stanje je mogoče tudi resetirati, kadar so opravljena vsa vprašanja, vendar želimo imeti zgodovino ocenenjenih vprašanj za analitiko, zato ne zbriši ocen

- dostopni morajo bit naslednji routi:
  - seznam vprašanj in odgovorov
  - ocenjevanje vprašanja
    - shrani vsako oceno (ne prepiši prejšnje ocene)
  - seznam ocen vprašanj
    - če uporabnik večkrat oceni isto vprašanje se upošteva samo zadnja ocena
    - če je stanje resetirano se upoštevajo ocene od resetiranega stanja naprej
  - resetiranje stanja
  - procent opravljenih vprašanj
  - dodajanje novega vprašanja in odgovora
- api se mora držati REST principov
- frontend ni potreben

## Če še ti ostane kaj časa

- (plus) za avtentikacijo uporabi JWT žeton (samo access token)
- (plus) pripravi tudi Swagger dokumentacijo in Swagger UI
- (plus) vsi route-i se morajo začeti z prefixom `/api`
- (plus) api more biti tudi verzioniran (v1)
- (plus) projekt tudi zbuildaj v Docker image in pripravi docker-compose.yml datoteko, ki pripravi celotno okolje (postgres, nestjs) za zagon projekta
- (plus) dodaj tudi rate limiting
- (plus) za rate limiting lahko uporabiš tudi Redis (dodaj v docker-compose.yml)

## Plan

- struktura:
  - course(array vprasanj, title)
  - solving(user, course, datum pricetka)
  - vprasanje(text vprasanje, text odgovor)
  - ocena(povezava uporabnik, povezava vprasanje, vrednost 1-5, datum ocene)
  - uporabnik(id,ime,geslo...)
- routes:

courseController:

/- /course?id=

- /getStats?courseId=
  /- /reset?courseId= (datum pricetka nastavi na currentDate)
  /- /addQuestion?courseId=

gradeController:

/- /grade?questionId=
/- /getGrade?questionId (latest)
