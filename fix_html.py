import re

def fix_index():
    with open('index.html', 'r') as f:
        lines = f.readlines()

    for i, line in enumerate(lines):
        # 482 - button missing type
        if 'class="hidden md:flex items-center justify-center transition-colors group"' in line and '<button' in line:
            lines[i] = line.replace('<button ', '<button type="button" ')

        # 483 & 484 - div inside button (which is aria-label="Toggle Language")
        # Change them to span
        if '<div class="relative w-14 h-8 bg-surface-container-high' in line:
            lines[i] = line.replace('<div', '<span').replace('</div>', '</span>')
        if '<div class="w-6 h-6 bg-primary rounded-full' in line:
            lines[i] = line.replace('<div', '<span').replace('</div>', '</span>')

        # The closing tags for those divs are at lines 486 and 487
        if '</div>' in line and (i == 485 or i == 486 or i == 487):
            lines[i] = line.replace('</div>', '</span>')

        # 509 & 510 button missing type
        if 'id="lang-toggle-btn"' in line and '<button' in line:
            lines[i] = line.replace('<button ', '<button type="button" ')
        if 'id="lang-dropdown-btn"' in line and '<button' in line:
            lines[i] = line.replace('<button ', '<button type="button" ')

        # Filter modal buttons
        if 'class="filter-option text-left px-4 py-3' in line:
            lines[i] = line.replace('<button ', '<button tabindex="-1" type="button" ')
        if 'id="close-filter-btn"' in line:
            lines[i] = line.replace('<button ', '<button tabindex="-1" ')
            if 'type=' not in lines[i]:
                lines[i] = lines[i].replace('<button', '<button type="button"')

        # Title
        if '<title>Gupta Traders | Premium Industrial & Agricultural Machinery Supplier</title>' in line:
            lines[i] = '<title>Gupta Traders | Industrial Machinery</title>\n'

        # Nav Landmarks
        if '<nav class="hidden md:flex' in line:
            lines[i] = line.replace('<nav', '<nav aria-label="Desktop Navigation"')
        if '<nav class="flex flex-col gap-4' in line:
            lines[i] = line.replace('<nav', '<nav aria-label="Mobile Navigation"')
        if '<nav class="flex flex-col gap-2 font-label-md text-label-md">' in line:
            lines[i] = line.replace('<nav', '<nav aria-label="Footer Links"')
        if '<nav class="flex flex-col gap-2 font-label-md text-label-md md:items-end">' in line:
            lines[i] = line.replace('<nav', '<nav aria-label="Footer Legal"')

        # Phone number space
        if '+91 95896 14782' in line:
            lines[i] = line.replace('+91 95896 14782', '+91&nbsp;95896&nbsp;14782')

        # Mobile menu button missing type
        if 'id="mobile-menu-btn"' in line and 'type=' not in line:
            lines[i] = line.replace('<button ', '<button type="button" ')

        # Mobile menu button has divs inside
        if 'id="hamburger-line-' in line and '<div' in line:
            lines[i] = line.replace('<div', '<span class="block"').replace('</div>', '</span>')

        # Address
        if '<address' in line:
            lines[i] = line.replace('<address', '<div')
        if '</address>' in line:
            lines[i] = line.replace('</address>', '</div>')

    with open('index.html', 'w') as f:
        f.writelines(lines)

fix_index()

def fix_whitespace_and_amp(filename):
    with open(filename, 'r') as f:
        lines = f.readlines()
    for i, line in enumerate(lines):
        line = line.rstrip() + '\n'
        if ' & ' in line:
            line = line.replace(' & ', ' &amp; ')
        lines[i] = line
    with open(filename, 'w') as f:
        f.writelines(lines)

fix_whitespace_and_amp('privacy.html')
fix_whitespace_and_amp('terms.html')
