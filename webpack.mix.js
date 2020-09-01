let mix = require('webpack-mix');

mix.js('src/js/main.js', 'public/js/')
    .sass('src/scss/main.scss', 'public/css/')
    .sourceMaps();

// mix.js('src/main.js', 'public/js/')
//     .js('src/home.js', 'public/js/')
//     .js('src/fale-conosco.js', 'public/js/')
//     .js('src/institucional.js', 'public/js/')
//     .js('src/ouvidoria.js', 'public/js/')
//     .js('src/denuncias.js', 'public/js/')
//     .sass('src/assets/styles/main.scss', 'public/css/')
//     .sass('src/assets/styles/home.scss', 'public/css/')
//     .sass('src/assets/styles/explore.scss', 'public/css/')
//     .sass('src/assets/styles/institucional.scss', 'public/css/')
//     .setPublicPath('public')
//     .browserSync({
//         proxy: 'msbank.test'
//     });