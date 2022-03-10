basic.showIcon(IconNames.Ghost)
radio.setGroup(1)

let playerNumber = 0
let numberOfResults = 0
let resultSum = 0
let results = [0]
let numberOfPlayers = 3

for (let i = 0; i <= numberOfPlayers - 1; i++) {
    results[i] = 0
}


input.onButtonPressed(Button.A, function () {
    basic.showString("R",0)
    for (let i = 0; i < 20; i++) {
        radio.sendValue("reset", 0)
        basic.pause(10)
        led.toggleAll()
    }
    basic.pause(500)
    basic.showIcon(IconNames.Ghost)
})


input.onButtonPressed(Button.B, function () {
    basic.showIcon(IconNames.No,0)
    for (let i = 0; i < 20; i++) {
        radio.sendValue("stop", 0)
        led.toggleAll()
        basic.pause(10)
    }
    basic.pause(500)
    basic.showIcon(IconNames.Ghost)
})

input.onLogoEvent(TouchButtonEvent.Pressed, function () {
    radio.sendValue("count", 0)
    basic.pause(150)
    countResults()
})

radio.onReceivedValue(function (name, value) {
    if (name == "avg") {
        serial.writeValue("avg", value)
    } else if (name == "high") {
        serial.writeValue("high", value)
    } else if (name == "low") {
        serial.writeValue("low", value)
    } else if (parseInt(name)>=0) {
        playerNumber = parseInt(name)
        results[playerNumber] = value
    }
})

function countResults () {
    numberOfResults = 0
    resultSum = 0
    for (let j = 0; j <= numberOfPlayers - 1; j++) {
        resultSum += results[j]
        if (results[j] > 0) {
            numberOfResults += 1
        }
    }
    serial.writeValue("number of results", numberOfResults)
    serial.writeValue("results sum", resultSum)
    if(numberOfResults >= numberOfPlayers){
        music.playTone(440,50)
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

//basic.clearScreen()
//countLeds(30)

function showMissing(){
    for(let i = 0; i<numberOfPlayers; i++){
        if(results[i] > 0){
            led.plot(i % 5, i / 5)
        }
    }
}


function countLeds(num: number){
    for(let i = 0; i<num; i++){
        led.plot(i%5, i/5)
    }
}

