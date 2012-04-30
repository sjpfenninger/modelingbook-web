Introduction to Systems Analysis Book Website
=============================================

These are the source files for the companion website to the book *Introdution to Systems Analysis* by Dieter Imboden and Stefan Pfenninger.

Building the website
--------------------

The website uses [`frank`](https://github.com/blahed/frank), a static website generator written in Ruby.

To build the CSS, based on bootstrap and bootswatch, go to `bootswatch/swatchmaker` and run `make && make deploy`. This will compile CSS from LESS and copy the resulting file into `static/libraries/boostrap.css`.

To build the website, run `frank export` from the root directory. This will build the website inside `exported`.