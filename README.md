1. Nie pushujemy na branch `main`. Do każdego zadania robimy oddzielny branch, a potem otwieramy pull request.
2. Nie używamy niczego co ma w nazwie "force"
3. Nazwy commitów powinny opisywać co w nich jest
4. Kod i dokumentację staramy się pisać po angielsku, bo inaczej tworzą się dziwne spolszczenia i trudno cokolwiek znaleźć.

---
- [Ściąga ze składni](./SYNTAX.md)
---
- [Intellij Idea](https://www.jetbrains.com/idea/) - Ultimate jest za darmo dla studentów
- [VSCode](https://nodejs.org/en/download/)
- [NPM i Node.js](https://nodejs.org/en/download/) - Na Windowsie wybieramy prebuilt Windows Installer (.msi). Potrzebne do frontendu

---

## 📚 Dokumentacja

### Generowanie dokumentacji Dokka

Projekt używa [Dokka](https://kotlinlang.org/docs/dokka-introduction.html) do automatycznego generowania dokumentacji z komentarzy KDoc w kodzie.

**Jak wygenerować dokumentację:**

```bash
./gradlew dokkaDoc
```

Dokumentacja zostanie wygenerowana w formacie HTML i będzie dostępna w:
```
build/dokka/html/index.html
```

**Przykład dokumentacji funkcji:**

```kotlin
/**
 * Oblicza pole prostokąta na podstawie podanych wymiarów.
 * 
 * @param dlugosc Długość prostokąta w jednostkach (musi być większa od 0)
 * @param szerokosc Szerokość prostokąta w jednostkach (musi być większa od 0)
 * @return Pole prostokąta jako wartość Double
 * @throws IllegalArgumentException jeśli którykolwiek z wymiarów jest mniejszy lub równy 0
 */
fun obliczPoleProstokata(dlugosc: Double, szerokosc: Double): Double {
    require(dlugosc > 0) { "Długość musi być większa od 0" }
    require(szerokosc > 0) { "Szerokość musi być większa od 0" }
    return dlugosc * szerokosc
}
```

Więcej informacji o formacie KDoc: [Kotlin Docs - KDoc](https://kotlinlang.org/docs/kotlin-doc.html)