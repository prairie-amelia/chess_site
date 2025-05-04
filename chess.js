const piecesCodes = {white:{king:"&#9812",queen:"&#9813", rook:"&#9814", bishop:"&#9815", knight:"&#9816", pawn:"&#9817"},
                black:{king:"&#9812",queen:"&#9813", rook:"&#9814", bishop:"&#9815", knight:"&#9816", pawn:"&#9817"}}

//let whtKingObj = {pieceColor:"white", pieceType:"king"}
//let blackKingObj = {pieceColor:"black", pieceType:"king"}

let currentSetUp =
[[{pieceColor:"black", pieceType:"rook", hasNotMoved: true},{pieceColor:"black", pieceType:"knight"},{pieceColor:"black", pieceType:"bishop"},{pieceColor:"black", pieceType:"queen"},{pieceColor:"black", pieceType:"king", hasNotMoved: true},{pieceColor:"black", pieceType:"bishop"},{pieceColor:"black", pieceType:"knight"},{pieceColor:"black", pieceType:"rook", hasNotMoved: true}],
[{pieceColor:"black", pieceType:"pawn"},{pieceColor:"black", pieceType:"pawn"},{pieceColor:"black", pieceType:"pawn"},{pieceColor:"black", pieceType:"pawn"},{pieceColor:"black", pieceType:"pawn"},{pieceColor:"black", pieceType:"pawn"},{pieceColor:"black", pieceType:"pawn"},{pieceColor:"black", pieceType:"pawn"}],
[null,null,null,null,null,null,null,null],
[null,null,null,null,null,null,null,null],
[null,null,null,null,null,null,null,null],
[null,null,null,null,null,null,null,null],
[{pieceColor:"white", pieceType:"pawn"},{pieceColor:"white", pieceType:"pawn"},{pieceColor:"white", pieceType:"pawn"},{pieceColor:"white", pieceType:"pawn"},{pieceColor:"white", pieceType:"pawn"},{pieceColor:"white", pieceType:"pawn"},{pieceColor:"white", pieceType:"pawn"},{pieceColor:"white", pieceType:"pawn"}],
[{pieceColor:"white", pieceType:"rook", hasNotMoved: true},{pieceColor:"white", pieceType:"knight"},{pieceColor:"white", pieceType:"bishop"},{pieceColor:"white", pieceType:"queen"},{pieceColor:"white", pieceType:"king", hasNotMoved: true},{pieceColor:"white", pieceType:"bishop"},{pieceColor:"white", pieceType:"knight"},{pieceColor:"white", pieceType:"rook", hasNotMoved: true}]]

let enPassantLocation = null

let playerTurn = "white"

//add event listener to button
let startButton = document.getElementById("start-button")
startButton.addEventListener("click",()=>startGame())

function startGame(){
    //adding clicking to squares
    let squares = document.querySelectorAll(".white, .black")
    for(let i = 0; i < squares.length; i ++){
        //adding moving event listener
        squares[i].addEventListener("click", () => movePiece(squares[i]))
        
        let squareID = squares[i].id
        let squareIdList = squareID.split(",")
        let piece = currentSetUp[squareIdList[0]][squareIdList[1]]
        squares[i].addEventListener("click", () => showOptions(squares[i]))
   
        if(piece){
            let pColor = piece.pieceColor
            let textForPara = piecesCodes[pColor][piece.pieceType]
            let classesForPara = pColor+ "Piece"
            squares[i].innerHTML= `<button class=${classesForPara}>${textForPara}</button>`
        }
    }

    //adding clicking to pawn promotion squares
    document.getElementById("whitePromotionKnight").addEventListener("click", () => pawnPromotion("knight"))
    document.getElementById("whitePromotionBishop").addEventListener("click", () => pawnPromotion("bishop"))
    document.getElementById("whitePromotionRook").addEventListener("click", () => pawnPromotion("rook"))
    document.getElementById("whitePromotionQueen").addEventListener("click", () => pawnPromotion("queen"))

    document.getElementById("blackPromotionKnight").addEventListener("click", () => pawnPromotion("knight"))
    document.getElementById("blackPromotionBishop").addEventListener("click", () => pawnPromotion("bishop"))
    document.getElementById("blackPromotionRook").addEventListener("click", () => pawnPromotion("rook"))
    document.getElementById("blackPromotionQueen").addEventListener("click", () => pawnPromotion("queen"))

    //hiding start game button
    document.querySelector("#start-button").style.display = ("none")
    document.querySelector("h2").style.display = ("block")

    let notList = document.getElementsByClassName("blackPiece")

    for(let n = 0; n <notList.length; n ++){
        let element = notList[n]
        let ogClass = element.getAttribute("class")
        let newClass = ogClass + " not-turn"
        element.setAttribute("class", newClass)
    }
}

function showOptions(currentSelection){
    //is there piece here
    let squareID = currentSelection.id
    let squareIdList = squareID.split(",")
    let piece = currentSetUp[squareIdList[0]][squareIdList[1]]
    if(piece){
        let pColor = piece.pieceColor
        let pType = piece.pieceType
        if(pColor === playerTurn){
            let optionsList;

            switch(pType){
                case "king":
                    optionsList = findOptionsKingDiag([[squareIdList[0]],[squareIdList[1]]],pColor).concat(findOptionsKingLine([[squareIdList[0]],[squareIdList[1]]],pColor).concat(findOptionsKingCastling(pColor)))
                    break
                case "queen":
                    optionsList = findOptionsRook([[squareIdList[0]],[squareIdList[1]]],pColor).concat(findOptionsBishop([[squareIdList[0]],[squareIdList[1]]],pColor))
                    break
                case "rook":
                    optionsList = findOptionsRook([[squareIdList[0]],[squareIdList[1]]],pColor)
                    break
                case "bishop":
                    optionsList = findOptionsBishop([[squareIdList[0]],[squareIdList[1]]],pColor)
                    break
                case "knight":
                    optionsList = findOptionsKnight([[squareIdList[0]],[squareIdList[1]]],pColor)
                    break
                case "pawn":
                    optionsList = findOptionsPawn([[squareIdList[0]],[squareIdList[1]]],pColor)
                    break
                default:
                    optionsList = []
            }

            let checkedList =[]

            for(let o = 0; o < optionsList.length; o ++){
                let option = optionsList[o]
                let checkCheck = doesPutSelfInCheck([[squareIdList[0]],[squareIdList[1]]],option)
                if(!checkCheck){
                    checkedList.push(option)
                }
            }
            optionsList = checkedList

        let paragraphs = document.querySelectorAll(".white, .black")

        //resetting all old selections
        for(let k = 0; k < paragraphs.length; k ++){
            let ogParaClass = paragraphs[k].getAttribute("class")
            let newParaClass = ogParaClass.replaceAll("selection","")
            newParaClass = newParaClass.replaceAll("cantMove","")
            paragraphs[k].setAttribute("class", newParaClass)
        }

    //resetting all old options
        for(let i = 0; i < paragraphs.length; i ++){
            let ogClass = paragraphs[i].getAttribute("class")
            let newClass = ogClass.replaceAll("option","")
            paragraphs[i].setAttribute("class", newClass)
        }
        if(optionsList.length > 0){
            currentSelection.setAttribute("class",currentSelection.getAttribute("class") + " selection") 
        }
        else{
            currentSelection.setAttribute("class",currentSelection.getAttribute("class") + " cantMove")
        }

        for(let j =0; j<optionsList.length;j++){
            let squareThatIsOption = document.getElementById(optionsList[j].join(","))
            let ogClass = squareThatIsOption.getAttribute("class")
            let newClass = ogClass + " option"
            squareThatIsOption.setAttribute("class", newClass)
        }
        }
    }
}

function findOptionsPawn(pieceCurrentLocation,pieceColor){
    //does not include en passant 
    let maxDist = 1
    if(pieceColor === "white" && pieceCurrentLocation[0] == 6 && !currentSetUp[5][pieceCurrentLocation[1]]){
        maxDist = 2
    }
    else if(pieceColor === "black" && pieceCurrentLocation[0] == 1 && !currentSetUp[2][pieceCurrentLocation[1]]){
        maxDist = 2
    }

    let optionsCapture;
    let optionsMarch;
    let optionsAll = []

    if(pieceColor === "white"){
        optionsCapture = [[Number(pieceCurrentLocation[0])-1, Number(pieceCurrentLocation[1])-1],[Number(pieceCurrentLocation[0])-1, Number(pieceCurrentLocation[1])+1]]
        optionsMarch = [[Number(pieceCurrentLocation[0])-1, Number(pieceCurrentLocation[1])]]

        if(maxDist === 2){
            optionsMarch.push([pieceCurrentLocation[0]-2, pieceCurrentLocation[1]])
        }
    }

    if(pieceColor === "black"){
        optionsCapture = [[Number(pieceCurrentLocation[0])+1, Number(pieceCurrentLocation[1])-1],[Number(pieceCurrentLocation[0])+1, Number(pieceCurrentLocation[1])+1]]
        optionsMarch = [[Number(pieceCurrentLocation[0])+1, Number(pieceCurrentLocation[1])]]

        if(maxDist === 2){
            optionsMarch.push([Number(pieceCurrentLocation[0])+2, Number(pieceCurrentLocation[1])])
        }
    }

    for(let i =0; i<optionsCapture.length; i ++){
       //normal capture
        if(optionsCapture[i][0] >= 0 && optionsCapture[i][0] <= 7 && optionsCapture[i][1] >= 0 && optionsCapture[i][1] <= 7 && currentSetUp[optionsCapture[i][0]][optionsCapture[i][1]] && currentSetUp[optionsCapture[i][0]][optionsCapture[i][1]]["pieceColor"] !== pieceColor){
            optionsAll.push(optionsCapture[i])
        }
        //en passant capture
        if(enPassantLocation && optionsCapture[i][0] === enPassantLocation[0] && optionsCapture[i][1] === enPassantLocation[1]){
            optionsAll.push(optionsCapture[i])
        }
    }

    for(let i =0; i<optionsMarch.length; i ++){
        if(optionsMarch[i][0] >= 0 && optionsMarch[i][0] <= 7 && optionsMarch[i][1] >= 0 && optionsMarch[i][1] <= 7 && !currentSetUp[optionsMarch[i][0]][optionsMarch[i][1]]){
            optionsAll.push(optionsMarch[i])
        }
    }

    return(optionsAll)
}

function findOptionsKnight(pieceCurrentLocation,pieceColor){
    let optionsAll = [];

    let optionsMarch = [
        [Number(pieceCurrentLocation[0])-1, Number(pieceCurrentLocation[1])+2],
        [Number(pieceCurrentLocation[0])-1, Number(pieceCurrentLocation[1])-2],
        [Number(pieceCurrentLocation[0])+1, Number(pieceCurrentLocation[1])+2],
        [Number(pieceCurrentLocation[0])+1, Number(pieceCurrentLocation[1])-2],
        [Number(pieceCurrentLocation[0])-2, Number(pieceCurrentLocation[1])+1],
        [Number(pieceCurrentLocation[0])-2, Number(pieceCurrentLocation[1])-1],
        [Number(pieceCurrentLocation[0])+2, Number(pieceCurrentLocation[1])+1],
        [Number(pieceCurrentLocation[0])+2, Number(pieceCurrentLocation[1])-1]
    ];
    for(let i = 0; i < optionsMarch.length; i++){
        //if on board and blank square
        if(optionsMarch[i][0] >= 0 && optionsMarch[i][0] <= 7 && optionsMarch[i][1] >= 0 && optionsMarch[i][1] <= 7 && !currentSetUp[optionsMarch[i][0]][optionsMarch[i][1]]){
            optionsAll.push(optionsMarch[i])
        }
        //if onboard and opposite color
        else if(optionsMarch[i][0] >= 0 && optionsMarch[i][0] <= 7 && optionsMarch[i][1] >= 0 && optionsMarch[i][1] <= 7 && currentSetUp[optionsMarch[i][0]][optionsMarch[i][1]] && currentSetUp[optionsMarch[i][0]][optionsMarch[i][1]]["pieceColor"] !== pieceColor){
            optionsAll.push(optionsMarch[i])
        }
    }
    return optionsAll
}

function findOptionsRook(pieceCurrentLocation,pieceColor){
    let optionsAll = []
    
    let up = true
    let upCount = 1
    while(up){
        let option = [Number(pieceCurrentLocation[0])+upCount, Number(pieceCurrentLocation[1])]
        //if onboard
        
        if(option[0] >= 0 && option[0] <= 7 && option[1] >= 0 && option[1] <= 7){
            //square is empty
            
            if(!currentSetUp[option[0]][option[1]]){
                optionsAll.push(option)
                upCount ++
            }
            //capture option
            else if(currentSetUp[option[0]][option[1]] && currentSetUp[option[0]][option[1]]["pieceColor"] !== pieceColor){
                optionsAll.push(option)
                up = false
            }
            else{
                up = false
            }
        }
        else{
            up = false
        }
    }

    let down = true
    let downCount = 1
    while(down){
        let option = [Number(pieceCurrentLocation[0])-downCount, Number(pieceCurrentLocation[1])]
        //if onboard
        
        if(option[0] >= 0 && option[0] <= 7 && option[1] >= 0 && option[1] <= 7){
            //square is empty
            if(!currentSetUp[option[0]][option[1]]){
                optionsAll.push(option)
                downCount ++
            }
            //capture option
            else if(currentSetUp[option[0]][option[1]] && currentSetUp[option[0]][option[1]]["pieceColor"] !== pieceColor){
                optionsAll.push(option)
                down = false
            }
            else{
                down = false
            }
        }
        else{
            down = false
        }
    }

    let left = true
    let leftCount = 1
    while(left){
        let option = [Number(pieceCurrentLocation[0]), Number(pieceCurrentLocation[1])+leftCount]
        //if onboard
        
        if(option[0] >= 0 && option[0] <= 7 && option[1] >= 0 && option[1] <= 7){
            //square is empty
            if(!currentSetUp[option[0]][option[1]]){
                optionsAll.push(option)
                leftCount ++
            }
            //capture option
            else if(currentSetUp[option[0]][option[1]] && currentSetUp[option[0]][option[1]]["pieceColor"] !== pieceColor){
                optionsAll.push(option)
                left = false
            }
            else{
                left = false
            }
        }
        else{
            left = false
        }
    }

    let right = true
    let rightCount = 1
    while(right){
        let option = [Number(pieceCurrentLocation[0]), Number(pieceCurrentLocation[1])-rightCount]
        //if onboard
        
        if(option[0] >= 0 && option[0] <= 7 && option[1] >= 0 && option[1] <= 7){
            //square is empty
            if(!currentSetUp[option[0]][option[1]]){
                optionsAll.push(option)
                rightCount ++
            }
            //capture option
            else if(currentSetUp[option[0]][option[1]] && currentSetUp[option[0]][option[1]]["pieceColor"] !== pieceColor){
                optionsAll.push(option)
                right = false
            }
            else{
                right = false
            }
        }
        else{
            right = false
        }
    }
    return optionsAll
}

function findOptionsBishop(pieceCurrentLocation,pieceColor){
    let optionsAll = []
    
    let up = true
    let upCount = 1
    while(up){
        let option = [Number(pieceCurrentLocation[0])+upCount, Number(pieceCurrentLocation[1])+upCount]
        //if onboard
        if(option[0] >= 0 && option[0] <= 7 && option[1] >= 0 && option[1] <= 7){
            //square is empty
            if(!currentSetUp[option[0]][option[1]]){
                optionsAll.push(option)
                upCount ++
            }
            //capture option
            else if(currentSetUp[option[0]][option[1]] && currentSetUp[option[0]][option[1]]["pieceColor"] !== pieceColor){
                optionsAll.push(option)
                up = false
            }
            else{
                up = false
            }
        }
        else{
            up = false
        }
    }

    let down = true
    let downCount = 1
    while(down){
        let option = [Number(pieceCurrentLocation[0])-downCount, Number(pieceCurrentLocation[1])-downCount]
        //if onboard
        if(option[0] >= 0 && option[0] <= 7 && option[1] >= 0 && option[1] <= 7){
            //square is empty
            if(!currentSetUp[option[0]][option[1]]){
                optionsAll.push(option)
                downCount ++
            }
            //capture option
            else if(currentSetUp[option[0]][option[1]] && currentSetUp[option[0]][option[1]]["pieceColor"] !== pieceColor){
                optionsAll.push(option)
                down = false
            }
            else{
                down = false
            }
        }
        else{
            down = false
        }
    }

    let left = true
    let leftCount = 1
    while(left){
        let option = [Number(pieceCurrentLocation[0])-leftCount, Number(pieceCurrentLocation[1])+leftCount]
        //if onboard
        if(option[0] >= 0 && option[0] <= 7 && option[1] >= 0 && option[1] <= 7){
            //square is empty
            if(!currentSetUp[option[0]][option[1]]){
                optionsAll.push(option)
                leftCount ++
            }
            //capture option
            else if(currentSetUp[option[0]][option[1]] && currentSetUp[option[0]][option[1]]["pieceColor"] !== pieceColor){
                optionsAll.push(option)
                left = false
            }
            else{
                left = false
            }
        }
        else{
            left = false
        }
    }

    let right = true
    let rightCount = 1
    while(right){
        let option = [Number(pieceCurrentLocation[0])+rightCount, Number(pieceCurrentLocation[1])-rightCount]
        //if onboard
        if(option[0] >= 0 && option[0] <= 7 && option[1] >= 0 && option[1] <= 7){
            //square is empty
            if(!currentSetUp[option[0]][option[1]]){
                optionsAll.push(option)
                rightCount ++
            }
            //capture option
            else if(currentSetUp[option[0]][option[1]] && currentSetUp[option[0]][option[1]]["pieceColor"] !== pieceColor){
                optionsAll.push(option)
                right = false
            }
            else{
                right = false
            }
        }
        else{
            right = false
        }
    }
    return optionsAll
}

function findOptionsKingDiag(pieceCurrentLocation,pieceColor){
    let optionsAll = []
    
    let up = true
    let upCount = 1
    while(up && upCount === 1){
        let option = [Number(pieceCurrentLocation[0])+upCount, Number(pieceCurrentLocation[1])+upCount]
        //if onboard
        if(option[0] >= 0 && option[0] <= 7 && option[1] >= 0 && option[1] <= 7){
            //square is empty
            if(!currentSetUp[option[0]][option[1]]){
                optionsAll.push(option)
                upCount ++
            }
            //capture option
            else if(currentSetUp[option[0]][option[1]] && currentSetUp[option[0]][option[1]]["pieceColor"] !== pieceColor){
                optionsAll.push(option)
                up = false
            }
            else{
                up = false
            }
        }
        else{
            up = false
        }
    }

    let down = true
    let downCount = 1
    while(down && downCount === 1){
        let option = [Number(pieceCurrentLocation[0])-downCount, Number(pieceCurrentLocation[1])-downCount]
        //if onboard
        if(option[0] >= 0 && option[0] <= 7 && option[1] >= 0 && option[1] <= 7){
            //square is empty
            if(!currentSetUp[option[0]][option[1]]){
                optionsAll.push(option)
                downCount ++
            }
            //capture option
            else if(currentSetUp[option[0]][option[1]] && currentSetUp[option[0]][option[1]]["pieceColor"] !== pieceColor){
                optionsAll.push(option)
                down = false
            }
            else{
                down = false
            }
        }
        else{
            down = false
        }
    }

    let left = true
    let leftCount = 1
    while(left && leftCount === 1){
        let option = [Number(pieceCurrentLocation[0])-leftCount, Number(pieceCurrentLocation[1])+leftCount]
        //if onboard
        if(option[0] >= 0 && option[0] <= 7 && option[1] >= 0 && option[1] <= 7){
            //square is empty
            if(!currentSetUp[option[0]][option[1]]){
                optionsAll.push(option)
                leftCount ++
            }
            //capture option
            else if(currentSetUp[option[0]][option[1]] && currentSetUp[option[0]][option[1]]["pieceColor"] !== pieceColor){
                optionsAll.push(option)
                left = false
            }
            else{
                left = false
            }
        }
        else{
            left = false
        }
    }

    let right = true
    let rightCount = 1
    while(right && rightCount === 1){
        let option = [Number(pieceCurrentLocation[0])+rightCount, Number(pieceCurrentLocation[1])-rightCount]
        //if onboard
        if(option[0] >= 0 && option[0] <= 7 && option[1] >= 0 && option[1] <= 7){
            //square is empty
            if(!currentSetUp[option[0]][option[1]]){
                optionsAll.push(option)
                rightCount ++
            }
            //capture option
            else if(currentSetUp[option[0]][option[1]] && currentSetUp[option[0]][option[1]]["pieceColor"] !== pieceColor){
                optionsAll.push(option)
                right = false
            }
            else{
                right = false
            }
        }
        else{
            right = false
        }
    }
    return optionsAll
}

function findOptionsKingLine(pieceCurrentLocation,pieceColor){
    let optionsAll = []
    
    let up = true
    let upCount = 1
    while(up && upCount === 1){
        let option = [Number(pieceCurrentLocation[0])+upCount, Number(pieceCurrentLocation[1])]
        //if onboard
        if(option[0] >= 0 && option[0] <= 7 && option[1] >= 0 && option[1] <= 7){
            //square is empty
            if(!currentSetUp[option[0]][option[1]]){
                optionsAll.push(option)
                upCount ++
            }
            //capture option
            else if(currentSetUp[option[0]][option[1]] && currentSetUp[option[0]][option[1]]["pieceColor"] !== pieceColor){
                optionsAll.push(option)
                up = false
            }
            else{
                up = false
            }
        }
        else{
            up = false
        }
    }

    let down = true
    let downCount = 1
    while(down && downCount === 1){
        let option = [Number(pieceCurrentLocation[0])-downCount, Number(pieceCurrentLocation[1])]
        //if onboard
        if(option[0] >= 0 && option[0] <= 7 && option[1] >= 0 && option[1] <= 7){
            //square is empty
            if(!currentSetUp[option[0]][option[1]]){
                optionsAll.push(option)
                downCount ++
            }
            //capture option
            else if(currentSetUp[option[0]][option[1]] && currentSetUp[option[0]][option[1]]["pieceColor"] !== pieceColor){
                optionsAll.push(option)
                down = false
            }
            else{
                down = false
            }
        }
        else{
            down = false
        }
    }

    let left = true
    let leftCount = 1
    while(left && leftCount === 1){
        let option = [Number(pieceCurrentLocation[0]), Number(pieceCurrentLocation[1])+leftCount]
        //if onboard
        if(option[0] >= 0 && option[0] <= 7 && option[1] >= 0 && option[1] <= 7){
            //square is empty
            if(!currentSetUp[option[0]][option[1]]){
                optionsAll.push(option)
                leftCount ++
            }
            //capture option
            else if(currentSetUp[option[0]][option[1]] && currentSetUp[option[0]][option[1]]["pieceColor"] !== pieceColor){
                optionsAll.push(option)
                left = false
            }
            else{
                left = false
            }
        }
        else{
            left = false
        }
    }

    let right = true
    let rightCount = 1
    while(right && rightCount === 1){
        let option = [Number(pieceCurrentLocation[0]), Number(pieceCurrentLocation[1])-rightCount]
        //if onboard
        if(option[0] >= 0 && option[0] <= 7 && option[1] >= 0 && option[1] <= 7){
            //square is empty
            if(!currentSetUp[option[0]][option[1]]){
                optionsAll.push(option)
                rightCount ++
            }
            //capture option
            else if(currentSetUp[option[0]][option[1]] && currentSetUp[option[0]][option[1]]["pieceColor"] !== pieceColor){
                optionsAll.push(option)
                right = false
            }
            else{
                right = false
            }
        }
        else{
            right = false
        }
    }
    return optionsAll
}

function findOptionsKingCastling(pieceColor){
    let baseRow;
    let kingGood = false
    let rookKingSideGood = false
    let rookQueenSideGood = false

    let options = []


    if(pieceColor === "white"){
        baseRow = 7
    }
    else{
        baseRow = 0
    }

    //checking king hasn't moved
    let kingCheck = currentSetUp[baseRow][4]
    if(kingCheck && kingCheck.hasNotMoved){
        kingGood = true
    }

    if(!kingGood){
        return []
    }

    let rookKingSideCheck = currentSetUp[baseRow][7]
    if(rookKingSideCheck && rookKingSideCheck.hasNotMoved){
        rookKingSideGood = true
    }

    let rookQueenSideCheck = currentSetUp[baseRow][0]
    if(rookQueenSideCheck && rookQueenSideCheck.hasNotMoved){
        rookQueenSideGood = true
    }

    if(rookKingSideGood){
        if(!currentSetUp[baseRow][5] && !currentSetUp[baseRow][6]){
            if(!doesPutSelfInCheck(null, null) && !doesPutSelfInCheck([baseRow,4], [baseRow, 5]) && !doesPutSelfInCheck([baseRow,4], [baseRow, 6])){
                options.push([baseRow,6])
            }
        }
    }

    if(rookKingSideGood){
        if(!currentSetUp[baseRow][1] && !currentSetUp[baseRow][2] && !currentSetUp[baseRow][3]){
            if(!doesPutSelfInCheck(null, null) && !doesPutSelfInCheck([baseRow,4], [baseRow, 3]) && !doesPutSelfInCheck([baseRow,4], [baseRow, 2])){
                options.push([baseRow,2])
            }
        }
    }

    return options
}

function doesPutSelfInCheck(currentLocation, newLocation){
    //does a move put yourself in check?
    let movingPiece;
    let eatPiece;

    if(currentLocation && newLocation){
        movingPiece = currentSetUp[currentLocation[0]][currentLocation[1]]
        eatPiece = currentSetUp[newLocation[0]][newLocation[1]]
        currentSetUp[currentLocation[0]][currentLocation[1]] = null
        currentSetUp[newLocation[0]][newLocation[1]] = movingPiece
    }

    //find location of the current player's king
    let kingLocationRow;
    let kingLocationColumn;

    for(let r = 0; r < currentSetUp.length; r ++){
        let row = currentSetUp[r]
        for(let c = 0; c < row.length; c ++){
            let piece = row[c]
            if(piece){
                let type = piece.pieceType
                if(type === "king"){
                    let color = piece.pieceColor
                    if(color === playerTurn){
                        kingLocationRow = r
                        kingLocationColumn = c
                    }
                }
            }
        }
    }

    //going through movement options for opponents pieces, to see if any include king location
    let movementOpponentOptions = []
    for(let r = 0; r < currentSetUp.length; r ++){
        for(let c = 0; c < currentSetUp[r].length; c ++){
            if(currentSetUp[r][c] && currentSetUp[r][c].pieceColor !== playerTurn){
                let pType = currentSetUp[r][c].pieceType
                let pColor = currentSetUp[r][c].pieceColor
                let optionsList = []

                switch(pType){
                    case "king":
                        optionsList = findOptionsKingDiag([r,c],pColor).concat(findOptionsKingLine([r,c],pColor))
                        //did not include castling options...
                        break
                    case "queen":
                        optionsList = findOptionsRook([r,c],pColor).concat(findOptionsBishop([r,c],pColor))
                        break
                    case "rook":
                        optionsList = findOptionsRook([r,c],pColor)
                        break
                    case "bishop":
                        optionsList = findOptionsBishop([r,c],pColor)
                        break
                    case "knight":
                        optionsList = findOptionsKnight([r,c],pColor)
                        break
                    case "pawn":
                        optionsList = findOptionsPawn([r,c],pColor)
                        break
                    default:
                        optionsList = []
                }
                movementOpponentOptions = movementOpponentOptions.concat(optionsList)
            }
        }
    }

    for(let m = 0; m < movementOpponentOptions.length; m++){
        let mr = movementOpponentOptions[m][0]
        let mc = movementOpponentOptions[m][1]

        if(mr === kingLocationRow && mc === kingLocationColumn){
            if(currentLocation && newLocation){
                currentSetUp[currentLocation[0]][currentLocation[1]] = movingPiece
                currentSetUp[newLocation[0]][newLocation[1]] = eatPiece
            }
            return true
        }
    }
    if(currentLocation && newLocation){
        currentSetUp[currentLocation[0]][currentLocation[1]] = movingPiece
        currentSetUp[newLocation[0]][newLocation[1]] = eatPiece
    }
    return false
}

function movePiece(moveToSquare){
    //get selected piece, if any
    let selectionPiece = document.querySelectorAll(".selection")
    let validCheck = moveToSquare.getAttribute("class")

    if(selectionPiece && validCheck.indexOf("option") > -1){
        
        let startID = selectionPiece[0].id
        let startIdAsArray = startID.split(",")

        let endId = moveToSquare.id
        let endIdAsArray = endId.split(",")

        //change array
        let movingPiece = currentSetUp[startIdAsArray[0]][startIdAsArray[1]]

        //if rook or king first move, turning off castling option
        let pMoved = movingPiece.hasNotMoved
        if(pMoved){
            movingPiece.hasNotMoved = false
        }

        //if castling
        let pType = movingPiece.pieceType
        let rowToCheck;

        if(playerTurn === "white"){
            rowToCheck = 7
        }
        else{
            rowToCheck = 0
        }

        if(pType === "king" && Number(startIdAsArray[0]) === rowToCheck && Number(startIdAsArray[1]) === 4 && Number(endIdAsArray[0]) === rowToCheck){
            console.log("started castle")
            //castling king-side
            if(Number(endIdAsArray[1]) === 6){
                console.log("king-side")
                //moving rook
                currentSetUp[rowToCheck][7] = null
                currentSetUp[rowToCheck][5] = {pieceColor:playerTurn, pieceType:"rook", hasNotMoved: false}
            }

            //castling queen-side
            if(Number(endIdAsArray[1]) === 2){
                console.log("queen-side")
                //moving rook
                currentSetUp[rowToCheck][0] = null
                currentSetUp[rowToCheck][3] = {pieceColor:playerTurn, pieceType:"rook", hasNotMoved: false}
            }
        }
        //did en passant happen this turn?
        if(pType === "pawn" && enPassantLocation){
            if(Number(endIdAsArray[0]) === enPassantLocation[0] && Number(endIdAsArray[1]) === enPassantLocation[1]){
                console.log("en passant bitches")
                if(playerTurn === "white"){
                    currentSetUp[Number(endIdAsArray[0]) + 1][Number(endIdAsArray[1])] = null
                }
                else{
                    currentSetUp[Number(endIdAsArray[0]) -1][Number(endIdAsArray[1])] = null
                }
            }
        }

        //if en passant possible next turn
        let rowToCheckStart;
        let rowToCheckEnd;
        enPassantLocation = null

        if(pType === "pawn"){
            if(playerTurn === "white"){
                rowToCheckStart = 6
                rowToCheckEnd = 4
            }
            else{
                rowToCheckStart = 1
                rowToCheckEnd = 3
            }
            
            if(Number(startIdAsArray[0]) === rowToCheckStart && Number(endIdAsArray[0]) === rowToCheckEnd){
                console.log("en passant could happen")
                enPassantLocation = [((rowToCheckStart + rowToCheckEnd)/2), Number(endIdAsArray[1])]
            }
        }

        currentSetUp[startIdAsArray[0]][startIdAsArray[1]] = null
        currentSetUp[endIdAsArray[0]][endIdAsArray[1]] = movingPiece

        //remove pieces and add back in
        let squares = document.querySelectorAll(".white, .black")

        for(let i = 0; i < squares.length; i ++){

            squares[i].innerHTML = ""

            let ogParaClass = squares[i].getAttribute("class")
            let newParaClass = ogParaClass.replaceAll("selection","")
            newParaClass = newParaClass.replaceAll("cantMove","")
            newParaClass = newParaClass.replaceAll("option","")
            squares[i].setAttribute("class", newParaClass)

            //inner html
            
            let squareID = squares[i].id
            let squareIdList = squareID.split(",")
            let piece = currentSetUp[squareIdList[0]][squareIdList[1]]
            if(piece){
                let pColor = piece.pieceColor
                let textForPara = piecesCodes[pColor][piece.pieceType]
                let classesForPara = pColor+ "Piece"
                squares[i].innerHTML= `<button class=${classesForPara}>${textForPara}</button>`
            }
        }

        //check for pawn promotion
        let endRow;
        let promote = false
        if(playerTurn === "white"){
            endRow = currentSetUp[0]
        }
        else(
            endRow = currentSetUp[7]
        )

        for(let p =0; p < endRow.length; p ++){
            let piece = endRow[p]
            if(piece){
                let pieceType = piece.pieceType
                if(pieceType === "pawn"){
                    p = endRow.length
                    pawnPromotionShow()
                    promote = true
                }
            }
        }

        if(!promote){
            flipTurn()
        }
    }
}

function flipTurn(){
    //remove check class
    let checkList = document.querySelector(".check")
    if(checkList){
        let og = checkList.getAttribute("class")
        og = og.replace("check", "")
        checkList.setAttribute("class", og)
    }

    let bList = document.getElementsByClassName("blackPiece")
    let wList = document.getElementsByClassName("whitePiece")

    //remove not turn class
    for(let b = 0; b <bList.length; b++ ){
        let element = bList[b]
        let ogClass = element.getAttribute("class")
        let newClass = ogClass.replace("not-turn", "")
        element.setAttribute("class", newClass)
    }

    for(let w = 0; w <wList.length; w++ ){
        let element = wList[w]
        let ogClass = element.getAttribute("class")
        let newClass = ogClass.replace("not-turn", "")
        element.setAttribute("class", newClass)
    }

    if(playerTurn === "white"){
        playerTurn = "black"
        document.querySelector("h2").style.color = ("black")
        document.querySelector("h2").innerHTML = ("● Black's Turn ●")        
    }

    else{
        playerTurn = "white"
        document.querySelector("h2").style.color = ("white")
        document.querySelector("h2").innerHTML = ("● White's Turn ●")
    }

    //add not-turn class
    let notList;
    if(playerTurn === "white"){
        notList = document.getElementsByClassName("blackPiece")
    }
    else{
        notList = document.getElementsByClassName("whitePiece")
    }

    for(let n = 0; n <notList.length; n ++){
        let element = notList[n]
        let ogClass = element.getAttribute("class")
        let newClass = ogClass + " not-turn"
        element.setAttribute("class", newClass)
    }

    //check if player was put in check
    if(doesPutSelfInCheck(null,null)){
        //find king and add check class
        let kingLocationRow;
        let kingLocationColumn;

        for(let r = 0; r < currentSetUp.length; r ++){
            let row = currentSetUp[r]
            for(let c = 0; c < row.length; c ++){
                let piece = row[c]
                if(piece){
                    let type = piece.pieceType
                    if(type === "king"){
                        let color = piece.pieceColor
                        if(color === playerTurn){
                            kingLocationRow = r
                            kingLocationColumn = c
                        }
                    }
                }
            }
        }

        let idString = `${kingLocationRow},${kingLocationColumn}`
        let qSelectString = `${idString}`

        let kingButton = document.getElementById(qSelectString)
        let kingClass = kingButton.getAttribute("class")
        kingClass = kingClass + " check"
        kingButton.setAttribute("class", kingClass)

        //check for mate
        let movementOpponentOptions = []
        for(let r = 0; r < currentSetUp.length; r ++){
            for(let c = 0; c < currentSetUp[r].length; c ++){
                if(currentSetUp[r][c] && currentSetUp[r][c].pieceColor === playerTurn){
                    let pType = currentSetUp[r][c].pieceType
                    let pColor = currentSetUp[r][c].pieceColor
                    let optionsList = []

                    switch(pType){
                        case "king":
                            optionsList = findOptionsKingDiag([r,c],pColor).concat(findOptionsKingLine([r,c],pColor))
                            //did not include castling options bc cant castle out of check
                            break
                        case "queen":
                            optionsList = findOptionsRook([r,c],pColor).concat(findOptionsBishop([r,c],pColor))
                            break
                        case "rook":
                            optionsList = findOptionsRook([r,c],pColor)
                            break
                        case "bishop":
                            optionsList = findOptionsBishop([r,c],pColor)
                            break
                        case "knight":
                            optionsList = findOptionsKnight([r,c],pColor)
                            break
                        case "pawn":
                            optionsList = findOptionsPawn([r,c],pColor)
                            break
                        default:
                            optionsList = []
                    }
                    let checkedList =[]

                    for(let o = 0; o < optionsList.length; o ++){
                        let option = optionsList[o]
                        let checkCheck = doesPutSelfInCheck([r,c],option)
                        if(!checkCheck){
                            checkedList.push(option)
                        }
                    }
                    optionsList = checkedList
                    movementOpponentOptions = movementOpponentOptions.concat(optionsList)
                }
            }
        }

        if(movementOpponentOptions.length === 0){
            //checkmate
            let winner;
            if(playerTurn === "white"){
                winner = "Black"
            }
            else{
                winner = "White"
            }
            setTimeout(() => {
                alert(`Checkmate! ${winner} wins.`)
                location.reload()
            }, 10)
        }
    }
}

function pawnPromotionShow(){
    let pawnPromotionWindow;

    if(playerTurn === "white"){
        pawnPromotionWindow = document.getElementById("whitePromotion")
    }
    else{
        pawnPromotionWindow = document.getElementById("blackPromotion")
    }

    pawnPromotionWindow.style.display = "block"
}

function pawnPromotion(newPieceType){
    let endRow;
    if(playerTurn === "white"){
        endRow = 0
    }
    else(
        endRow = 7
    )

    for(let p =0; p < currentSetUp[endRow].length; p ++){
        let piece = currentSetUp[endRow][p]
        if(piece){
            let pieceT = piece.pieceType

            if(pieceT === "pawn"){
                //changing piece at that location
                currentSetUp[endRow][p].pieceType = newPieceType
                p = currentSetUp[endRow].length

                //remove pieces and add back in
                let squares = document.querySelectorAll(".white, .black")

                for(let i = 0; i < squares.length; i ++){

                    squares[i].innerHTML = ""

                    let ogParaClass = squares[i].getAttribute("class")
                    let newParaClass = ogParaClass.replaceAll("selection","")
                    newParaClass = newParaClass.replaceAll("cantMove","")
                    newParaClass = newParaClass.replaceAll("option","")
                    squares[i].setAttribute("class", newParaClass)

                    //inner html
                    
                    let squareID = squares[i].id
                    let squareIdList = squareID.split(",")
                    let piece = currentSetUp[squareIdList[0]][squareIdList[1]]
                    if(piece){
                        let pColor = piece.pieceColor
                        let textForPara = piecesCodes[pColor][piece.pieceType]
                        let classesForPara = pColor+ "Piece"
                        squares[i].innerHTML= `<button class=${classesForPara}>${textForPara}</button>`
                    }
                }

                //hiding window
                let pawnPromotionWindow;
                if(playerTurn === "white"){
                    pawnPromotionWindow = document.getElementById("whitePromotion")
                }
                else{
                    pawnPromotionWindow = document.getElementById("blackPromotion")
                }
                pawnPromotionWindow.style.display = "none"
                flipTurn()
            }
        }
    }
}

