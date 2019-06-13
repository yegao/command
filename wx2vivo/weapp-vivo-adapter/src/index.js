function inject () {
    require('./window');
    require('./pollyfill')
    window._isAdapted = true;
}

if (!window._isAdapted) {
    inject();
}