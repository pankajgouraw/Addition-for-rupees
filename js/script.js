$(function() {

    let result = '';
    let userAns = 0;
    var chance = 0;
    let resultArray ='';
    $("#headerText").text(headerText);
    $("#instruction").css({ color: headerInstructionColor });
    $('body').css({ 'background-image': bg });
    generateContent();
    dragDrop();
    $('#firstNo, #secNo, .sign').css({ color: questColor });
    $('.options p span').css({ color: numColor });
    $('.sign').css({ color: signColor });



    // function for drag and drop
    function dragDrop() {

        $('.drag').draggable({
            revert: 'invalid',
            snapMode: 'inner',
            helper: 'clone'
        });

        $(".drop").droppable({
            accept: ".drag",
            // tolerance: 'intersect',
            drop: function(event, ui) {

                $(this).append($(ui.draggable).clone().css({ color: ansColor }));
                $(event.target).attr('data-user', ui.draggable.text());

                if ($(this).children("span").length > 1) {
                    $(this).children("span:nth-child(1)").remove();
                }
            },
        });

    } //end here drag and drop 

    // drag carry value
    function dragCarry() {
        $('.dragCarry').draggable({
            revert: 'invalid',
            snapMode: 'inner',
            helper: 'clone'
        })

        $('.carryDropContainer').droppable({
            accept: '.dragCarry',
            drop: function(event, ui) {
                $(this).append($(ui.draggable).clone());
                if ($(this).children("span").length > 1) {
                    $(this).children("span:nth-child(1)").remove();
                }
                $('#clearCarry').show();
            }

        })
    } // end function drag carry
    dragCarry()

    function generateContent() {
        // generate random numbers
        let randA = Math.floor(Math.random() * (maxA - minA)) + minA;
        let randB = Math.floor(Math.random() * (maxB - minB)) + minB;
        // console.log("randA", randA);
        // console.log('randB', randB);

        let pointRandA = Math.floor(Math.random() * (pointMaxA - pointMinA)) + pointMinA;
        let pointRandB = Math.floor(Math.random() * (pointMaxB - pointMinB)) + pointMinB;
        // console.log("before parse pointRandA", pointRandA);

        pointRandA = pointRandA<10?(".0"+pointRandA) : ("."+pointRandA);
        pointRandB = pointRandB<10?(".0"+pointRandB) : ("."+pointRandB);

        // console.log("pointRandA", pointRandA);
        // console.log('pointRandB', pointRandB);

        randA = randA+pointRandA;
        randB =randB+pointRandB;
        // console.log("randA after point adding", randA);
        // console.log('randB after point adding', randB);

        // convert random number into array
        carryRandA = Array.from(randA.toString(), String);
        carryRandB = Array.from(randB.toString(), String);

        //generate span tag for numbers
        carrySpanA = '';
        carrySpanB = '';


        //add span tag to the number
        $.each(carryRandA, function(i, value) {
            var spanA = `<span>${value}</span>`
            carrySpanA += spanA;
        });

        // add span tag to second number
        $.each(carryRandB, function(i, value) {
            var spanB = `<span>${value}</span>`
            carrySpanB += spanB;
        });


        $('#firstNo').html(carrySpanA);
        $('#secNo').html(carrySpanB);

        let w = $('#firstNo').width();
        let w2 = $('#secNo').width();
        if(w > w2){
            // console.log("first width", w);
          $('#secNo').width(w);
        }else{
            // console.log("second width", w2);
           $('#firstNo').width(w2); 
        }

        // append carried value
        result = randA + randB;

        // console.log("result without parseFloat", result);

        result = parseFloat(randA) + parseFloat(randB);
        result = result.toFixed(2);
        // console.log("result with parseFloat", result);


        // console.log('random A ', carryRandA)
        // console.log('random B ', carryRandB)

        // create drop container for carry
        for (let i = carryRandA.length - 1; i >= 0; i--) {
            let x = $('#firstNo span')[i];
            $(x).append(`<span class='carryDropContainer'></span>`);
        }



        // generate drop box 
        resultArray = Array.from(result, String);
        // console.log("length", resultArray.length);

        let dropTag = '';
        for (let i = 0; i < result.toString().length; i++) {
            let pTag = `<p class="drop" data-original="${resultArray[i]}" data-user=' '></p>`;
            dropTag += pTag;
        }
        $('.ansContainer').html(dropTag);
    }


    $('#next').click(function() {
        $('.placeValueContainer').empty();
        chance = 0;
        $(this).hide();
        $('#check').fadeIn();
        $('#showAns').hide();
        $('.dragCarry').removeAttr('style');
        generateContent();
        dragDrop();
        // $('#firstNo > span > span').hide();
        dragCarry()
        generatePlaceValue()
        $('#clearCarry').hide();

    });

    $('#reload').click(function() {
        window.location.href = 'main.html';
    })



    $('#check').click(function() {
        // console.log('chance', chance)
        showError();
        let dropTag = $('.ansContainer p');
        let userInput = '';
        $.each(dropTag, function(i, value) {
            let dataOriginal = $(value).attr('data-original');
            let userData = $(value).attr('data-user');
            if(dataOriginal == userData){
                userInput++;
            }
            // userInput += userData;
        });
        // console.log(userInput);
        let output = $('.output');
        // console.log(output)
        if (userInput == '') {
            return false;
        }
        $(this).show();
        // $('#next').fadeIn();
       // console.log("userInput" , userInput)

       // console.log(resultArray.length , userInput)

        if (userInput === resultArray.length) {
            // console.log(true);
            wellDone();
            $(output[userAns]).css("background-image", "url(" + 'img/happy.png' + ")");
            $('#next').show();
            $('#check').hide();
            chance = 0;
            userAns++;
        } else {

            if (chance == 0) {
                oopsTryAgain();
                chance++;

                return false;
            }

            $(this).hide();
            $('#showAns').show();
            $('#next').show();
            $(output[userAns]).css("background-image", "url(" + 'img/sad.png' + ")");
            userAns++;
        }

        if (userAns > 9) {
            $('#next').hide();
            $('#reload').fadeIn();
        }
    })


    function oopsTryAgain() {
        let audio1 = new Audio('audio/tryAgain.mp3');
        audio1.play();
        $('.oops').removeClass('zoomOut');
        $('.oops').addClass('animated zoomIn oopsHW');

        setTimeout(function() {
            $('.oops').removeClass('zoomIn');
            $('.oops').addClass('zoomOut')
            setTimeout(function() {
                $('.oops').removeClass('oopsHW');
                // $('.ansContainer .drop').empty();
            }, 500);
        }, 2000)
    }

    function wellDone() {
        let audio1 = new Audio('audio/welldone.mp3');
        audio1.play();
        $('.wellDone').removeClass('zoomOut');
        $('.wellDone').addClass('animated zoomIn oopsHW');
        setTimeout(function() {
            $('.wellDone').removeClass('zoomIn');
            $('.wellDone').addClass('zoomOut')
            setTimeout(function() {
                $('.wellDone').removeClass('oopsHW');
            }, 500);
        }, 2000)
    };


    $('#showAns').click(function() {
        // generate answer
        $('.carryDropContainer').empty();
        $('#clearCarry').hide();
        $(this).hide();
        $('#firstNo > span > span').show();
        let dropTag = '';
        let ansArray = Array.from(result);
        // console.log('result',result);
        // console.log('result',ansArray);
        for (let i = 0; i < ansArray.length; i++) {
            let pTag = `<p class="drop"><span style='color:${ansColor}'>${ansArray[i]}</span></p>`;
            dropTag += pTag;
        }
        $('.ansContainer').html(dropTag);
    })



    // clear carry function
    $('#clearCarry').click(function() {
        $('.carryDropContainer').empty();
        $(this).hide();
    });
    // end clear carry function

    // function to generate the place value
    function generatePlaceValue() {
        let Arr = $('.ansContainer > .drop');
        // console.log(Arr);
        for (let i = 0; i < Arr.length; i++) {
            if (i == 0) { $('.placeValueContainer').prepend(`<p class="placeValue">o</p>`); }
            if (i == 1) { $('.placeValueContainer').prepend(`<p class='placeValue'>t</p>`); }
            if (i == 2) { $('.placeValueContainer').prepend(`<p class='placeValue'>h</p>`); }
            if (i == 3) { $('.placeValueContainer').prepend(`<p class='placeValue'>th</p>`); }
            if (i == 4) { $('.placeValueContainer').prepend(`<p class='placeValue'>t.th</p>`); }
            if (i == 5) { $('.placeValueContainer').prepend(`<p class='placeValue'>l</p>`); }
            if (i == 6) { $('.placeValueContainer').prepend(`<p class='placeValue'>tl</p>`); }
            if (i == 7) { $('.placeValueContainer').prepend(`<p class='placeValue'>c</p>`); }
            if (i == 8) { $('.placeValueContainer').prepend(`<p class='placeValue'>tc</p>`); }
        }
    }
    generatePlaceValue()
    // function to generate the place value end


    function showError() {
        let dataAttr = $('.drop');
        console.log(dataAttr)
        $.each(dataAttr, function(index, value) {
            let dataUser = $(value).attr('data-user');
            let dataOriginal = $(value).attr('data-original');
            if (dataUser == dataOriginal) {
                $(value).css({ 'borderColor': '#fff' })
            } else {
                $(value).css({ 'borderColor': errorColor })
            }

        })
    }

    $('#reset').click(function() {
        $('.drop').empty().attr('data-user', '').css({ 'borderColor': '#000' });
    });

}); // end document function