var converter = function() {

    function num2bgtext(leva) {
        var number = parseInt(leva);
        var flval = parseFloat(leva);
        var stotinki = Math.round(flval * 100) % 100;
        var tmp;

        /* The functions */
        var num0 = ["нула", "един", "две", "три", "четири",
            "пет", "шест", "седем", "осем", "девет",
            "десет", "единадесет", "дванадесет"
        ];
        var num100 = [" ", "сто", "двеста", "триста"];

        number = parseInt(number);

        var div10 = (number - number % 10) / 10;
        var mod10 = number % 10;
        var div100 = (number - number % 100) / 100;
        var mod100 = number % 100;
        var div1000 = (number - number % 1000) / 1000;
        var mod1000 = number % 1000;
        var div1000000 = (number - number % 1000000) / 1000000;
        var mod1000000 = number % 1000000;
        var div1000000000 = (number - number % 1000000000) / 1000000000;
        var mod1000000000 = number % 1000000000;

        if (number == 0) {
            return num0[number];
        }
        /* До двайсет */
        if (number > 0 && number < 20) {
            if (stotinki && number == 1)
                return "една";
            if (stotinki && number == 2)
                return "две";
            if (number == 2)
                return "два";
            return (num0[number]) ? num0[number] : (num0[mod10] + "надесет");
        }
        /* До сто */
        if (number > 19 && number < 100) {
            tmp = (div10 == 2) ? "двадесет" : (num0[div10] + "десет");
            tmp = mod10 ? tmp + " и " + num2bgtext(mod10, stotinki) : tmp;
            return tmp;
        }
        /* До хиляда */
        if (number > 99 && number < 1000) {
            tmp = (num100[div100]) ? num100[div100] : (num0[div100] + "стотин");
            if ((mod100 % 10 == 0 || mod100 < 20) && mod100 != 0) {
                tmp += " и";
            }
            if (mod100) {
                tmp += " " + num2bgtext(mod100);
            }
            return tmp;
        }
        /* До милион */
        if (number > 999 && number < 1000000) {
            /* Damn bulgarian @#$%@#$% два хиляди is wrong :) */
            tmp = (div1000 == 1) ? "хиляда" :
                ((div1000 == 2) ? "две хиляди" : (num2bgtext(div1000) + " хиляди"));
            num0[2] = "два";
            if ((mod1000 % 10 == 0 || mod1000 < 20) && mod1000 != 0) {
                if (!((mod100 % 10 == 0 || mod100 < 20) && mod100 != 0)) {
                    tmp += " и";
                }
            }
            if ((mod1000 % 10 == 0 || mod1000 < 20) && mod1000 != 0 && mod1000 < 100) {
                tmp += " и";
            }
            if (mod1000) {
                tmp += " " + num2bgtext(mod1000);
            }
            return tmp;
        }
        /* Над милион */
        if (number > 999999 && number < 1000000000) {
            tmp = (div1000000 == 1) ? "един милион" : (num2bgtext(div1000000) + " милиона");
            if ((mod1000000 % 10 == 0 || mod1000000 < 20) && mod1000000 != 0) {
                if (!((mod1000 % 10 == 0 || mod1000 < 20) && mod1000 != 0)) {
                    if (!((mod100 % 10 == 0 || mod100 < 20) && mod100 != 0)) {
                        tmp += " и";
                    }
                }
            }
            if ((mod1000000 % 10 == 0 || mod1000000 < 20) && mod1000000 != 0 && mod1000000 < 1000) {
                if ((mod1000 % 10 == 0 || mod1000 < 20) && mod1000 != 0 && mod1000 < 100) {
                    tmp += " и";
                }
            }
            if (mod1000000) {
                tmp += " " + num2bgtext(mod1000000);
            }
            return tmp;
        }
        /* Над милиард */
        if (number > 99999999 && number <= 2000000000) {
            tmp = (div1000000000 == 1) ? "един милиард" : "";
            tmp = (div1000000000 == 2) ? "два милиарда" : tmp;
            if (mod1000000000) {
                tmp += " " + num2bgtext(mod1000000000);
            }
            return tmp;
        }
    }

    function number2lv(leva) {
        var lv = parseInt(leva);
        var flval = parseFloat(leva);
        var stotinki = Math.round(flval * 100) % 100;
        if (lv >= 2000000000)
            return "Твърде голямо число";
        var text = num2bgtext(lv);
        text += (lv == 1) ? " лев" : " лева";
        if (stotinki !== 0)
            text = text.replace("/^един /", "");
        if (stotinki && stotinki !== 0) {
            var sttext = num2bgtext(stotinki, true);
            text += " и " + sttext;
            text += stotinki == 1 ? " стотинка" : " стотинки";
        }
        return text;
    }
    return {
        number2lv
    };
}();