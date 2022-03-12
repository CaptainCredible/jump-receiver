let playerNumber = 0
let resultSum = 0
let numberOfResults = 0
let numberOfPlayers = 0
let results: number[] = []

basic.showIcon(IconNames.Ghost)
radio.setGroup(1)
results = [0]
numberOfPlayers = 3

input.onButtonPressed(Button.A, function () {
    basic.showString("R",0)
    for (let index = 0; index < 20; index++) {
        radio.sendValue("reset", 0)
        basic.pause(10)
        led.toggleAll()
    }
    basic.pause(500)
    basic.showIcon(IconNames.Ghost)
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
    } else {
        music.playTone(660, 50)
        music.playTone(440, 50)
        basic.clearScreen()
        countLeds(numberOfResults)
    }
}

input.onButtonPressed(Button.B, function () {
    basic.showIcon(IconNames.No,0)
    for (let index = 0; index < 20; index++) {
        radio.sendValue("stop", 0)
        led.toggleAll()
    basic.pause(10)
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
    basic.pause(150)
    countResults()
})

function countLeds (num: number) {
    for (let n = 0; n <= num - 1; n++) {
        led.plot(n % 5, n / 5)
    }
}

for (let i = 0; i <= numberOfPlayers - 1; i++) {
    results[i] = 0
}