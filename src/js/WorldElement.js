class WorldElement {


    static create = function (eType, energy, breedCountDown) {
        var e = eType;
        e = e | (energy << 8);
        e = e | (breedCountDown << 16);
        return e;
    };


    static energyOf = (element) => {
        return (255 & (element >> 8));
    };

    static breedCountdownOf = (element) => {
        return (255 & (element >> 16));
    }

    static typeOf = (element) => {
        return element & 3;
    }

}

WorldElement.TYPE_EMPTY = 0;
WorldElement.TYPE_FISH = 1;
WorldElement.TYPE_SHARK = 2;

module.exports = WorldElement;