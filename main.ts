let wasTouched = false
let playerNumber = 0
let resultSum = 0
let numberOfResults = 0
let averageResult = 0
let sumResultsForAvg = 0
let numberOfRealResults = 0
let results = [0]
let numberOfPlayers = 20
let wasAB = false
basic.showIcon(IconNames.Square)
radio.setGroup(1)

function fillEmptyWithAverage () {
    for (let i = 0; i <= numberOfPlayers - 1; i++) {
        if (results[i] > 0) {
            numberOfRealResults += 1
        }
        sumResultsForAvg += results[i]
    }
    averageResult = sumResultsForAvg / numberOfRealResults
    averageResult = Math.round(averageResult)
    for (let j = 0; j <= numberOfPlayers - 1; j++) {
        if (results[j] == 0) {
            results[j] = averageResult
        }
    }
}

input.onButtonPressed(Button.A, function () {
    basic.showString("R", 0)
for (let index = 0; index <= numberOfPlayers - 1; index++) {
        numberOfRealResults = 0
        results[index] = 0
        radio.sendValue("reset", 0)
        basic.pause(30)
        led.toggleAll()
    }
    let playerNumber = 0
    resultSum = 0
    numberOfResults = 0
    averageResult = 0
    sumResultsForAvg = 0
    numberOfRealResults = 0

    basic.showString("R", 0)
})
function showMissing () {
    for (let m = 0; m <= numberOfPlayers - 1; m++) {
        if (results[m] > 0) {
            led.plot(m % 5, m / 5)
        }
    }
}
function countResults () {
    numberOfResults = 0
    resultSum = 0
    for (let l = 0; l <= numberOfPlayers - 1; l++) {
        resultSum += results[l]
        if (results[l] > 0) {
            numberOfResults += 1
        }
    }
    serial.writeValue("number of results", numberOfResults)
    serial.writeValue("results sum", resultSum)
    if (numberOfResults >= numberOfPlayers) {
        music.playTone(440, 50)
        music.playTone(660, 50)
        music.playTone(880, 50)
        basic.showNumber(resultSum)
        radio.sendValue("result", resultSum)
    } else {
        music.playTone(660, 50)
        music.playTone(440, 50)
        basic.clearScreen()
        // countLeds(numberOfResults)
        showMissing()
    }
}
input.onButtonPressed(Button.B, function () {
    basic.showIcon(IconNames.No, 0)
for (let index = 0; index < 20; index++) {
        radio.sendValue("stop", 0)
        led.toggleAll()
basic.pause(30)
    }
    basic.pause(500)
    basic.showIcon(IconNames.Ghost)
})
radio.onReceivedValue(function (name, value) {
    if (name == "avg") {
        serial.writeValue("avg", value)
    } else if (name == "high") {
        serial.writeValue("high", value)
    } else if (name == "low") {
        serial.writeValue("low", value)
    } else if (parseInt(name) >= 0) {
        playerNumber = parseInt(name)
        results[playerNumber] = value
    }
})
input.onLogoEvent(TouchButtonEvent.Pressed, function () {
    radio.sendValue("count", 0)
    basic.pause(250)
    countResults()
})
function countLeds (num: number) {
    for (let n = 0; n <= num - 1; n++) {
        led.plot(n % 5, n / 5)
    }
}

for (let k = 0; k <= numberOfPlayers - 1; k++) {
    results[k] = 0
}
loops.everyInterval(1000, function () {
    if (input.logoIsPressed()) {
        if (wasTouched) {
            fillEmptyWithAverage()
            countResults()
        }
        wasTouched = true
    } else {
        wasTouched = false
    }
})
