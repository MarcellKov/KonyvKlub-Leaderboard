Az Alkalmazás Futtatása:

1. lépés: Dependencyk telepítése a következő paranccsal: npm ci

2. lépés: Alkalmazás futtatása: node index.js

3. Az alkalmazás http://localhost:5000/ címen fut.


Az Alkalmazás Felépítése:
    1 szerver: felszolgálja magát a weboldalt amivel a felhasználó interaktálhat, 
               a SocketIO socket szervere is egyben ami a kétoldalú kommunikáció feladatát látja el,
               és requesteket is teljesít (ír és olvas az adatbázisba) 
    
    1 Firebase Real Time Database a felhőben:
               Választásom azért erre az adatbázisra esett, mert kifejezetten az ilyen valós idejű adatátvitelre lett kifejlesztve, optimalizálva, jól skálázható
               Funkcionálisan programozható, könnyűsúlyú könyvtárral rendelkezik, a Google tech óriás fejleszti, és garantálja minőségét
