def flatten(l: list) -> list:
    final = []

    for element in l:
        if isinstance(element,list):
            for flattened in flatten(element):
                final.append(flattened)
        else:
            final.append(element)
    return final