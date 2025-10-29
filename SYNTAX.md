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


# Pętle
## C#
```cs
while (x > 5) {
    ...
}

for (int i = 0; i < 10; i++) {
    ...
}

foreach (User user in userList) {
    ...
}
```


```kotlin
while (x > 5) {
    ...
}

for (i in 0..10) {
    ...
}

for (user in userList) {
    ...
}
```

```ts
while (x > 5) {
    ...
}

for (let i = 0; i < 10; i++) {
    ...
}

for (let user of userList) {
    ...
}
```

# If / switch
## C#
```cs
if (user1.Equals(user2)) {
    ...
} else if (...) {
    ...
} else {
    ...
}

List<Animal> zoo = ...;

switch (animal) {
    // animal == burek
    case burek:
        ...
        break;
    
    // animal jest typu Cat 
    case is Cat:
        ...
        break;
    
    // animal jest w zoo
    case Animal x when zoo.Contains(x):
        ...
        break;
        
    // Inne przypadki
    default:
        ...
        break;
}
```

## Kotlin
```kotlin
if (user1 == user2) {
    ...
} else if (...) {
    ...
} else {
    ...
}


val zoo: List<Animal> = ...

when (animal) {
    // animal == burek
    burek -> ...
    
    // animal jest w zoo
    in zoo -> ...
    
    // animal jest typu Cat
    is Cat -> ...
    
    // inne przypadki
    else -> ...
}
```

## TypeScript
```ts
if (user1 === user2) { // potórjne ===
    ...
} else if (...) {
    ...
} else {
    ...
}

const zoo: Animal[] = ...;

switch (animal) {
    // animal === burek
    case burek:
        ...
        break;
        
    default:
        // animal jest w zoo
        if (zoo.includes(animal)) {
            ...
        // animal jest typu Cat
        else if (animal isInstanceOf Cat) {
            ...
        // inne przyapdki
        } else {
            ...
        }
        break;
}
```
