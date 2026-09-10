# Grocy 4.7.0, built from the source in www/ next to this file.
#
# The base image already contains Grocy; COPY www/ lays OUR copy of the source
# over it, so the app you run is the code in your folder -- the same code the
# unit tests import. (www/ leaves out public/packages, 160 MB of front-end
# dependencies; those come from the base image untouched.)
#
# Then the two things Homework 2 adds: a boot hook that turns the login screen
# off, and a starting database -- migrated for this version and filled with
# Grocy's demo data.
FROM lscr.io/linuxserver/grocy:4.7.0

COPY www/  /app/www/
COPY init/ /custom-cont-init.d/
COPY seed/ /seed/
