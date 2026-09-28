**DYNAMISK WEB**

# MyMovies

Du skal fremstille web-applikationen MyMovies. Data skal hentes fra "The Movie Database".

### **Mål**
Målet med opgaven er at vise hvad du har lært i skoleperioden om:
- at hente data fra en ekstern kilde med fetch-api'et
- udskrive data fra det hentede objekt som html
- listevisning og detaljevisning ved brug af url-parametre(query-strings)

Det forventes, at den afleverede opgave fremstår som et "færdigt produkt".


### **Materialer**
Der udleveres en figma fil til opgaven, som dit produkt skal ligne.

### **Opgaven**

#### **Listevisning**
I listevisning fetches der som minimum fra to forskellie endpoints, som dermed resulterer i to forskellige visninger. En med horisontalt scroll og en som "bare" fortsætter ned ad siden. 

##### Forslag til endpoints i listevisningen:
- [Now playing](https://developer.themoviedb.org/reference/movie-now-playing-list)
- [Popular](https://developer.themoviedb.org/reference/movie-popular-list)


#### **Detaljevisning**
Når en bruger klikker på en film i listevisningen, ledes brugeren videre til en side med detaljer om den enkelte film. 

##### Forslag til endpoint i detaljevisningen:

Detaljerne om en enkelt film kan hentes på [details-endpointet](https://developer.themoviedb.org/reference/movie-details).  
Bemærk at `{movie-id}` til sidst i url'en skal udskiftes med id'et på den film du ønsker at vise detaljer om.

### **Aflevering**: 
Du skal aflevere et link til dit GitHub repository på MitRTS.  

### **Deadline**: 
Du kan se hvornår opgaven skal afleveres på MitRTS.  

### **Feedback**: 
Du får en karakter på 7-trins-skalaen for dit projekt. Målet for projektet er som tidligere nævnt at vise hvad du har lært i **Dynamisk web**, og derfor er karakteren også et udtryk for dit standpunkt i forhold til læringsmålene for skoleperioden.

### **Ekstraopgaver**


Hvis du bliver hurgigt færdig, kan du

- implementere infinite scroll på det lodrette scroll (popular)
-  implementere darkmode. Switch-knappen i øverste højre hjørne skal skifte imellem dark-mode og light-mode. Applikationen skal huske det foretrukne farvevalg (fx i localStorage), så brugeren præsenteres for samme oplevelse næste gang applikationen bruges.
- tilføje ekstra views eller features. Gå på opdagelse i api'et og prøv at se om du kan finde nogle interessante data at præsentere.Tilføj fx. en mulighed for at afspille traileren til en film (hvis den findes i databasen).

---

### **The Movie Database - introduktion**

For at bruge data fra The Movie Database skal du have et accesstoken som skal sendes med alle requests til databasen. Det skal du gøre med en authorization header, så det ved du godt hvordan fungerer.
En forespørgsel (fetch) til databasen kunne fx. se sådan ud:

```js
fetch("https://api.themoviedb.org/3/trending/movie/week", {
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer //indsæt din token her...'
  }
// Det henter alle film som trender i denne uge.
```

Du får en accesstoken ved at registrere en bruger. Det er gratis, men du skal oplyse en del ting for at få nøglen. Hvis du ikke er vild med at oplyse din egen adresse kan du jo oplyse en fiktiv adresse i nærheden af hvor du bor, eller i nærheden af skolen. Brug dog din skole email, da du skal verificere din bruger for at få nøglen.

Du kan læse mere om oprettelse, og oprette dig som bruger her:
```
https://developers.themoviedb.org/3/getting-started/authentication
```

Når du skal bruge billeder, sender dataobjektet kun navnet på billedet. Læs mere om, hvilken sti du skal bruge for at få fat på billedet her: 

```
https://developers.themoviedb.org/3/getting-started/images
```


