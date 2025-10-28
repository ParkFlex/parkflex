# Zmienne / stałe / obiekty
## C#
```cs
const int age = 5;
string name = "Imię";
const Person person = new Person(name, age);
```

## Kotlin
```kotlin
val age: Int = 5
var name = "Imię"
val person = Person(name, age)
```

- `val` - value - stała
- `var` - variable - zmienna
- typ piszemy po dwukropku, ale można go pominąć.

## TypeScript
```ts
const age: number = 5;
let name = "Imię";
const person = new Person(name, age);
```

- `const` - constant - stała
- `let` - zmienna
- typ piszemy po dwukropku, staramy się nie pomijać.
- średniki na końcu wyrażenia opcjonalne, ale staramy się pisać.

# Funkcje
## C#
```cs
string getName(Person p) {
    return p.name;
}
```

## Kotlin
```kotlin
fun getName(p: Person): String {
    return p.name
}
```
- Typ funkcji jest na końcu po dwukropku. Jeśli go nie ma, to funkcja nic nie zwraca.

## TypeScript
```ts
function getName(p: Person): string {
    return p.name;
}
```
- Typ funkcji jest na końcu po dwukropku, nie jest obowiązkowy, ale staramy się go pisać.

# Klasy
## C#
```cs
public class Person {
    public const string name;
    private string pesel;
    public int age;

    // konstruktor
    public Person(string name, string pesel, int age) {
        this.name = name;
        this.pesel = pesel;
        this.age = age;
    }
    
    void greet() {
        Console.WriteLine($"Hello, ${this.name}!");
    }
}
```

## Kotlin
```kotlin
data class Person(val name: String, private var pesel: String, var age: Int) {
    fun greet() {
        println("Hello, ${this.name}!")
    }
}
```
- W nawiasie podajemy pola. Konstruktor jest generowany automatycznie.
- Słówko `data` na początku tworzy nam automatycznie funkcje `.equals()`, `.hashCode()` itp.

## TypeScript
```ts
class Person {
    readonly name: string;
    private pesel: string;
    age: number;

    // konstruktor
    constructor(name: string, pesel: string, age: number) {
        this.name = name;
        this.pesel = pesel;
        this.age = age;
    }
    
    // Dla metod w klasach nie piszemy słówka `function`
    greet(): void {
        console.log(`Hello, ${this.name}!`)
    }
}
```
- Typy i średniki nie są obowiązkowe, ale staramy się je pisać.