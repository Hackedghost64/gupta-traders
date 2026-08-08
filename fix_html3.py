import re

def fix_index():
    with open('index.html', 'r') as f:
        content = f.read()

    content = re.sub(r'<title>.*?</title>', '<title>Gupta Traders - Industrial</title>', content)

    content = content.replace('+91 9981297111', '+91&nbsp;9981297111')
    content = content.replace('+91 7987862961', '+91&nbsp;7987862961')

    with open('index.html', 'w') as f:
        f.write(content)

fix_index()
