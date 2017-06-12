var WorldElement = require('./WorldElement')

class World {

    constructor(width, height, fishStartCount, fishReproductionTicks, fishEnergy, sharkStartCount, sharkReproductionTicks, sharkEnergy) {
        this.width = width;
        this.height = height;
        this.fishStartCount = fishStartCount;
        this.fishReproductionTicks = fishReproductionTicks;
        this.fishEnergy = fishEnergy;
        this.sharkStartCount = sharkStartCount;
        this.sharkReproductionTicks = sharkReproductionTicks;
        this.sharkEnergy = sharkEnergy;
        this.data = null;
        this.resIndices = new Array(8);
        this.noTicks = 0;
    };

    init = () => {
        this.data = new Array(this.width * this.height);
        for (var x = 0; x < this.width; x++) {
            for (var y = 0; y < this.height; y++) {
                this.setValueAtPosition(x, y, 0)
            }
        }

        for (var f = 0; f < this.fishStartCount; f++) {
            let x = Math.round(Math.random() * this.width);
            let y = Math.round(Math.random() * this.height);
            if (this.isFree(x, y)) {
                WorldElement.create()
            }

        }

    };

    isFree = (x, y) => {
        return this.getDataAtPosition(x, y) > 0;
    };


    getDataAtPosition = (x, y) => {
        if (x < 0) {
            x += this.width;
        }
        if (x >= this.width) {
            x -= this.width;
        }
        if (y < 0) {
            y += this.height;
        }
        if (y >= this.height) {
            y += this.height;
        }
        return x + y * this.width;
    }

    setValueAtPosition = (x, y, v) => {
        this.data[this.getDataAtPosition(x, y)] = v;
    }

    setValueAtIndex = (index, v) => {
        this.data[this.getDataAtPosition(x, y)] = v;
    }

    getValueAtPosition = (x, y) => {
        return this.data[this.getDataAtPosition(x, y)];
    }


    randomNeighborOfType = (destType, x, y) => {
        var xc, yc, xt, yt;
        var testElement;
        var resCount;
        var mx = this.width - 1;
        var my = this.height - 1;
        var idx;
        resCount = 0;
        for (xc = -1; xc <= 1; xc++) {
            for (yc = -1; yc <= 1; yc++) {
                xt = x + xc;
                yt = y + yc;
                if (xt < 0) xt = mx;
                if (yt < 0) yt = my;
                if (xt > mx) xt = 0;
                if (yt > my) yt = 0;
                idx = xt + (this.width * yt);
                testElement = this.canvas[idx];
                if ((testElement & 3) == destType) {
                    resIndices[resCount++] = idx;
                }
            }
        }
        if (resCount > 0) {
            result = resIndices[Math.floor(Math.random() * resCount)];
            return result;
        }
        return -1;
    }


    doFish = (theFish, x, y) => {
        var breedC;
        var newPos;
        var replacementElement = 4;
        var updatedFish;

        breedC = WorldElement.breedCountdownOf(theFish) - 1;

        if (breedC <= 0) {
            breedC = reproduceCFish;
            replacementElement = WorldElement.create(WorldElement.TYPE_FISH, 255, Math.floor(Math.random() * reproduceCFish)) | 4;
        }

        newPos = this.randomNeighborOfType(theWorld, 0, x, y);

        if (newPos > 0) {
            updatedFish = WorldElement.create(WorldElement.TYPE_FISH, 128, breedC);
            this.setValueAtPosition(x, y, replacementElement);
            this.setValueAtIndex(newPos, updatedFish | 4)
        }
    }

    doShark = (theShark, x, y) => {
        var breedC;
        var energy;
        var newPos;
        var replacementElement = 4;
        var updatedFish;

        breedC = WorldElement.breedCountdownOf(theShark) - 1;
        energy = WorldElement.energyOf(theShark) - 1;

        if (energy <= 0) {
            this.setValueAtPosition(x, y, 4)
            return;
        }

        if (breedC <= 0) {
            breedC = this.sharkReproductionTicks;
            replacementElement = WorldElement.create(WorldElement.TYPE_SHARK, Math.floor(Math.random() * initialEnergyShark), Math.floor(Math.random() * reproduceCShark)) | 4;
        }

        newPos = randomNeighborOfType(theWorld, WorldElement.TYPE_FISH, x, y);
        if (newPos > 0) {
            energy += 2;
            if (energy > 255) {
                energy = 255
            }
            ;
            updatedFish = WorldElement.create(WorldElement.TYPE_SHARK, energy, breedC);
            this.setValueAtPosition(x, y, replacementElement)
            this.setValueAtIndex(newPos, updatedFish | 4)
            return;
        }

        newPos = randomNeighborOfType(theWorld, WorldElement.TYPE_EMPTY, x, y);
        if (newPos > 0) {
            updatedFish = WorldElement.create(WorldElement.TYPE_SHARK, energy, breedC);
            this.setValueAtPosition(x, y, replacementElement)
            this.setValueAtIndex(newPos, updatedFish | 4)
        }

    }


    doWorldTick = () => {

        var x, y;
        var currentElement;
        var noFish = 0;
        var noShark = 0;
        this.noTicks++;
        for (x = 0; x < this.width; x++) {
            for (y = 0; y < this.height; y++) {
                currentElement = this.getDataAtPosition(x, y);

                if (WorldElement.TYPE_FISH === WorldElement.typeOf(currentElement)) {
                    noFish++;
                    this.doFish(currentElement, x, y);
                } else if (WorldElement.TYPE_SHARK === WorldElement.typeOf(currentElement)) {
                    noShark++;
                    this.doShark(currentElement, x, y);
                }
            }
        }

        return (noShark !== 0) && (noFish !== 0);
    }
}

module.exports = World;