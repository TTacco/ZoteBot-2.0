module.exports = {
    getSecondMult(){
        return 1000;
    },
    getMinuteMult(){
        return 60 * exports.getSecondMult();
    },
    getHourMult(){
        return 60 * exports.getMinuteMult();
    },
    getDayMultiplier(){
        return 24 * exports.getHourMult();
    },


    
} 

