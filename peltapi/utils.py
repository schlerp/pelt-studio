import random


def to_pascal(string: str) -> str:
    return "".join(word.capitalize() for word in string.split("_"))


def to_camel(string: str) -> str:
    if len(string) >= 1:
        pascal_string = to_pascal(string)
        return pascal_string[0].lower() + pascal_string[1:]
    return string.lower()


def safeid(n: int = 10, alphabet: str = "abcdefghijklmnopqrstuvwxyz") -> str:
    return "".join(random.choices([c for c in alphabet], k=n))
