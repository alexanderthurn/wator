# Wa-Tor


## Short summary

Wa-Tor is a population dynamics simulation devised by Alexander Keewatin Dewdney and presented in the December 1984 issue of Scientific American in a 5-page article entitled "Computer Recreations: Sharks and fish wage an ecological war on the toroidal planet Wa-Tor".

* [Wikipedia article](https://en.wikipedia.org/wiki/Wa-Tor) about Wa-Tor
* [".c" implementation](wator.c) Thank you Stephan K. for your awesomeness !
* [PDF Paper](wator_dewdney.pdf) by Alexander Keewatin Dewdney

## Demo

You can try the app [here](https://web.froso.de/fish/dev). Make sure to use a modern browser supporting the canvas element.

## Screenshots

![Screenshot1](misc/screenshot1.jpg?raw=true "Screenshot1")
![Screenshot2](misc/screenshot2.jpg?raw=true "Screenshot2")


## List of technologies

* [HTML5 Webworker](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers) for multi threading 
* [HTML Canvas](https://developer.mozilla.org/en-US/docs/Glossary/Canvas) to display results
* Build/Compression via [Webpack 2](https://webpack.js.org/)

## How does the app work?

1. TODO


## Known issues

* Fragment shaders needed !! (branch /shader is already there)
* Better Webworker implementation (multiple webworkers)

## License

Licensed under MIT

Copyright (c) 2017 [Alexander Thurn](https://github.com/alexanderthurn)
