function inject () {
    require('./window');

    window._isAdapted = true;
}

if (!window._isAdapted) {
    inject();
}