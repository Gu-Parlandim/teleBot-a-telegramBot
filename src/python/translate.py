import argostranslate.package
import argostranslate.translate
import json
import sys

""" from_code = "en"
to_code = "pt"  """

from_code = "pt"
to_code = "en"


# Download and install Argos Translate package
""" argostranslate.package.update_package_index()
available_packages = argostranslate.package.get_available_packages()

print(available_packages)

package_to_install = next(
    filter(
        lambda x: x.from_code == from_code and x.to_code == to_code, available_packages
    )
)
argostranslate.package.install_from_path(package_to_install.download()) """

# Translate

# get the any text to translate for the first argument
text = sys.argv[1] 


translatedText = argostranslate.translate.translate(text, from_code, to_code)
print(translatedText)
