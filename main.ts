let playerNumber = 0
let resultSum = 0
let numberOfResults = 0
let numberOfPlayers = 1
let results = [0]



basic.showIcon(IconNames.Ghost)
radio.setGroup(1)
let wasAB = false
let wasTouched = false

loops.everyInterval(1000, function() {
    if(input.logoIsPressed()){
        if(wasTouched){
            fillEmptyWithAverage()
        }
        wasTouched = true
    } else {
        wasTouched = false
    }
})


input.onLogoEvent(TouchButtonEvent.Pressed, function () {
    radio.sendValue("count", 0)
    basic.pause(150)
    countResults()
})

input.onButtonPressed(Button.A, function () {
    
        basic.showString("R", 0)
        for (let index = 0; index < numberOfPlayers; index++) {
            results[index] = 0
            radio.sendValue("reset", 0)
            basic.pause(20)
            led.toggleAll()
        }
})


input.onButtonPressed(Button.B, function () {
    basic.showIcon(IconNames.No, 0)
    for (let index = 0; index < 20; index++) {
        radio.sendValue("stop", 0)
        led.toggleAll()
        basic.pause(10)
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
        //countLeds(numberOfResults)
        showMissing()
    }
}

function fillEmptyWithAverage(){
    let sumResultsForAvg = 0
    let numberOfRealResults = 0
    for(let i = 0; i<numberOfPlayers; i++){
        if(results[i]>0){
            numberOfRealResults++
        }
        sumResultsForAvg += results[i]
    }
    let averageResult = sumResultsForAvg / numberOfRealResults
    averageResult = Math.round(averageResult)
//    console.log("results")
//    console.log(results)
//    console.log("realResults")
//    console.log(numberOfRealResults)
//    console.log("average")
//    console.log(averageResult)
    
    for (let i = 0; i < numberOfPlayers; i++) {
        if (results[i] == 0) {
            results[i] = averageResult
        }
    }

//    console.log("corrected results")
//    console.log(results)
}



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



function countLeds (num: number) {
    for (let n = 0; n <= num - 1; n++) {
        led.plot(n % 5, n / 5)
    }
}

for (let i = 0; i <= numberOfPlayers - 1; i++) {
    results[i] = 0
}