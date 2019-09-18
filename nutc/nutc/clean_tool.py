import re


def clean_tag(target: str) -> str:
    pattern = re.compile(r'</?\w+[^>]*>')
    return re.sub(pattern, '', target)

