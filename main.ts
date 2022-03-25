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
basic.showIcon(IconNames.Triangle)
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
    playerNumber = 0
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




radio.onReceivedValue(function (name, value) {
    if (parseInt(name) >= 0) {
        playerNumber = parseInt(name)
        results[playerNumber] = value
    } else if(name == "reset"){
        basic.showString("R", 0)
        for (let index = 0; index <= numberOfPlayers - 1; index++) {
            numberOfRealResults = 0
            results[index] = 0
            basic.pause(30)
            led.toggleAll()
        }
        playerNumber = 0
        resultSum = 0
        numberOfResults = 0
        averageResult = 0
        sumResultsForAvg = 0
        numberOfRealResults = 0
        basic.showString("R", 0)
    }
})

let isCounting = false
input.onButtonPressed(Button.B, function () {
    if(!isCounting){
        
        music.playTone(1880, 200)
        //basic.pause(200)
        isCounting = true
        radio.sendValue("count", 0)
        basic.pause(500)
        countResults()
    }
    isCounting = false
    
})
function countLeds (num: number) {
    for (let n = 0; n <= num - 1; n++) {
        led.plot(n % 5, n / 5)
    }
}

for (let k = 0; k <= numberOfPlayers - 1; k++) {
    results[k] = 0
}

let wasB = false

loops.everyInterval(1000, function () {
    if(input.buttonIsPressed(Button.B)){
        if(!wasB){
            radio.sendValue("debug",0)
            soundExpression.hello.play()
            basic.showString("D")
        }
        wasB = true
    } else {
        wasB = false
    }
    
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
