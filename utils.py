def flatten(l: list) -> list:
    final = []

    for element in l:
        if isinstance(element,list):
            for flattened in flatten(element):
                final.append(flattened)
        else:
            final.append(element)
    return final

def unique(l: list, identifier_key: str = None) -> list:
    final = []
    temp = []
    if not identifier_key:
        return final
    
    for value in l:
        if value.get(identifier_key,False) not in temp:
            final.append(value)
            temp.append(value.get(identifier_key,False))

    return final