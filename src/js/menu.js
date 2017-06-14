var helper = require('./helper')


document.addEventListener("DOMContentLoaded", function (event) {


    var buttonMenu = document.getElementById('buttonMenu');
    var menu = document.getElementById('menu');
    buttonMenu.onclick = () => {
        if (menu.style.visibility === 'hidden') {
            menu.style.visibility = 'visible';
        } else {
            menu.style.visibility = 'hidden';
        }
    }

    var setInputButtonLinks = function (inputElems, buttonElems, menuEntries) {
        if (inputElems.length > 0) {
            for (let i = 0; i < buttonElems.length; i++) {
                buttonElems[i].onclick = function () {
                    inputElems[0].value = this.innerHTML
                    updateInputAndButtons(inputElems, buttonElems);
                    collectQueryInfosAndLoadPage(inputElems, buttonElems, menuEntries);
                };
            }
        }
    }

    var updateInputAndButtons = function (inputElems, buttonElems, menuEntries) {
        if (inputElems.length > 0) {
            for (let i = 0; i < buttonElems.length; i++) {
                if (inputElems[0].value === buttonElems[i].innerHTML) {
                    buttonElems[i].className = 'active';
                } else {
                    buttonElems[i].className = '';
                }
            }
        }
    };

    var setInputOnChange = function (inputElems, buttonElems, menuEntries) {
        if (inputElems.length > 0) {
            inputElems[0].onchange = function () {
                collectQueryInfosAndLoadPage(inputElems, buttonElems, menuEntries);
            }
        }
    }

    var collectQueryInfosAndLoadPage = function (inputElems, buttonElems, menuEntries) {
        var queryOptions = {};
        for (var j = 0; j < menuEntries.length; j++) {
            var entry = menuEntries[j];
            var inputElemsInner = entry.getElementsByTagName('input');
            if (inputElemsInner.length > 0) {
                var attributeName = inputElemsInner[0].getAttribute('data-param');
                queryOptions[attributeName] = inputElemsInner[0].value;
            }


        }


        window.location.search = helper.serialize(queryOptions);
    }

    var setInputInitialState = function (inputElems, buttonElems, menuEntries) {
        for (var j = 0; j < menuEntries.length; j++) {
            var entry = menuEntries[j];
            var inputElemsInner = entry.getElementsByTagName('input');
            if (inputElemsInner.length > 0) {
                var attributeName = inputElemsInner[0].getAttribute('data-param');

                var value = helper.getSearchParam(attributeName);
                if (value !== undefined) {
                    inputElemsInner[0].value = value;
                }
            }


        }
    }

    var menuEntries = document.getElementsByClassName('menuEntry');
    for (var j = 0; j < menuEntries.length; j++) {
        var entry = menuEntries[j];
        var inputElems = entry.getElementsByTagName('input');
        var buttonElems = entry.getElementsByTagName('button');
        setInputInitialState(inputElems, buttonElems, menuEntries);
        setInputButtonLinks(inputElems, buttonElems, menuEntries);
        updateInputAndButtons(inputElems, buttonElems, menuEntries);
        setInputOnChange(inputElems, buttonElems, menuEntries);
    }


});