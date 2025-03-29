# Webbteknik 6 - Gemensam To-Do Lista
I denna rapport presenteras lösningsförslaget för uppgiften som har tagits fram under kursens gång. I rapporten kommer en utvärdering mot kravspecifikationen göras samt en beskrivning av applikationens struktur och hur customElements har använts för att skapa en dynamisk single page application med custom routing. Vilka externa bibliotek som har använts i projektet kommer även pressenteras.   

## Beskrivning av applikation
Projektet som har skapats är en gemensam to-do lista där användare kan logga in via google, skapa en to-do lista, lägga till uppgifter och bjuda in andra användare. 

Varje uppgift är värd ett poäng mellan 100 - 500 som sätts vid skapandet av en uppgift. När en användare sedan utför en uppgift sparas poängen och användarens totalapoäng uppdateras i en highscore-lista.

## Kravspecifikation
- Användare måste logga in för att kunna använda appen. ✅

- En användare ska kunna skapa en gemensam todo-lista. ✅

- En användare ska kunna bjuda in andra användare till sin todo-lista genom att dela en länk. ✅

- En viss användare kan endast läggas till i samma todo-lista en gång. ✅

- En användare ska inte kunna uppdatera data som tillhör någon annan användare. ✅

- Det ska finnas ett grafiskt gränssnitt där användare kan:

  - Se vilka uppgifter som är klara/inte klara. ✅

  - Se vem som gjort vad. ✅

- Alla deltagare i en todo-lista ska kunna: 
  - lägga till nya uppgifter. ✅

  - Markera uppgifter som avklarade. ✅

- Uppgifter i listan ska innehålla:
  
  - En titel (obligatorisk). ✅
  
  - Ett antal poäng (obligatoriskt). ✅
  
  - En beskrivning (valfri). ✅

- Avklarade uppgifter ska inte försvinna utan bara markeras som avklarade. ✅

- Vem som klarade en uppgift ska sparas. ✅

- Den användare som markerar en uppgift som klar får det antal poäng som uppgiften är värd. ✅

- I anslutning till varje todo-lista ska det tydligt visas hur många poäng varje deltagare har. ✅

- **Egna Krav**

  - En unik bild som identifierar och är kopplad till varje lista. ✅

  - Anävdare ska visuellt kunna överskåda hur mycket av ett projekt som blivit avklarat. ✅

## Utvärdering av kravspecifikationen 
Samtliga krav i kravspecifikationen uppfylls. Användaren kan logga in via Google för att skapa och se data kopplat till sitt konto. Funktionaliteten för att skapa ett todo-projekt är implementerad, och andra användare kan bjudas in via en länk för att delta i ett gemensamt projekt.

Alla deltagare i ett projekt kan lägga till uppgifter i listan, med möjlighet att ange en titel, en valfri beskrivning samt ett poängvärde för uppgiften. När en uppgift markeras som avklarad får användaren de poäng som är kopplade till uppgiften. Den aktuella poängställningen visas tydligt i en highscore-lista.

Det framgår tydligt vem som har avklarat en uppgift, och endast den användaren kan bocka av samma uppgift igen. Detta säkerställer att poängen inte kan manipuleras av andra deltagare.

Utöver de specificerade kraven har två extra funktioner lagts till för att förbättra användarupplevelsen:

En slumpgenererad SVG-bild kopplas till varje projekt för att gör applikatione mer visuellt tilltalande och skapa visuell igenkänning.

En progressbar visar hur stor andel av listan som är avklarad, vilket ger en tydlig översikt av projektets status.
Dessa tillägg stärker både användbarheten och den visuella feedbacken i applikationen.

## Använda kodbibliotek

## Källor