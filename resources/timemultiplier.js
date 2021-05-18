var getSecondMult = function(){
    return 1000;
}
var getMinuteMult = function(){
    return 60 * getSecondMult();
}
var getHourMult = function(){
    return 60 * getMinuteMult();
}
var getDayMult = function(){
    return 24 * getHourMult();
}

var getTimeFormatMultiplier = function(format){
    if(/^(d(ays?)?)$/.test(format)){
        return getDayMult();
    }
    else if(/^(h(ours?)?)$/.test(format)){
        return getHourMult();
    }
    else if(/^(m(in(utes?)?s?)?)$/.test(format)){
        return getMinuteMult();
    }
    else if(/^(s(ec(onds?)?)?)$/.test(format)){
        return getSecondMult();
    }
    else{
        return 0;
    }
}


module.exports = {
    getSecondMult,
    getMinuteMult,
    getHourMult, 
    getDayMult,
    getTimeFormatMultiplier
} 

