An (Exoplanet) Unit Converter
=

This repository hosts a simple website where the user can convert between various distance, time or mass units that are relevant to the study of extrasolar planets.

I wrote this converter in Python many years ago when I was fed up of converting Earth masses to Jupiter masses, and I thought it was time I put it somewhere online.  

It's a simple HTML page with the conversion driven by some (vanilla) Javascript.  You can visit it at [https://dh4gan.github.io/exo-units](https://dh4gan.github.io/exo-units)

There are some slightly unorthodox units in the converter, which I have found handy in the past for outreach work.  If you want to add more, submit a pull request!

Distance Units
-

cm, m, km, miles

double decker buses, blue whales

Moon/Mars/Earth/Neptune/Saturn/Jupiter/Solar Radii

AU

lightyears, parsecs (pc),  kpc, Mpc, Gpc, attoparsecs

Defined in `distance_choices`, `distance_values` in `quiz.js`


Mass Units
-

g, kg

double decker buses, blue whales

Moon/Mars/Earth/Neptune/Saturn/Jupiter/Solar Masses

Defined in `mass_choices`, `mass_values` in `quiz.js`


Time Units
-
seconds, minutes, hours, days, weeks, years

Martian sols, Martian years

Jovian years

Brexits

Defined in `time_choices`, `time_values` in `quiz.js`


