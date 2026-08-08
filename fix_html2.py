import re

def fix_index():
    with open('index.html', 'r') as f:
        lines = f.readlines()

    for i, line in enumerate(lines):
        if 'Gupta Traders | Industrial Machinery' in line:
            lines[i] = '<title>Gupta Traders - Industrial Machinery</title>\n'

        # 499 - <nav class="flex flex-col gap-6 font-headline-md text-headline-md font-bold">
        if '<nav class="flex flex-col gap-6 font-headline-md text-headline-md font-bold">' in line:
            lines[i] = line.replace('<nav', '<nav aria-label="Mobile Main Navigation"')

        # 509 & 510 buttons
        if '<button id="btn-en" ' in line and 'type=' not in line:
            lines[i] = line.replace('<button ', '<button type="button" ')
        if '<button id="btn-hi" ' in line and 'type=' not in line:
            lines[i] = line.replace('<button ', '<button type="button" ')

        if '+91&nbsp;95896&nbsp;14782' in line:
             pass # already fixed
        elif '+91 95896 14782' in line:
             lines[i] = line.replace('+91 95896 14782', '+91&nbsp;95896&nbsp;14782')

    with open('index.html', 'w') as f:
        f.writelines(lines)

fix_index()
