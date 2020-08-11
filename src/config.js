const COLOR = require('./color')
module.exports = {
    /*  MAIN SETTINGS */
    rounds: 12, // total cound of rounds
    work_minutes: 25,
    break_minutes: 5,
    long_break_minutes: 25,
    /*  CUSTOMIZATION */
    // ALARM
    work_alarm_name: 'tick-work.mp3', // alarm name in sounds folder
    break_alarm_name: 'bell-short.mp3', // alarm name in sounds folder
    long_break_alarm_name: 'chimes-long.mp3', // alarm name in sounds folder
    done_alarm_name: 'fireworks.mp3', // alarm name in sounds folder

    work_alarm_duration: 1,
    break_alarm_duration: 1,
    long_break_alarm_duration: 5,
    done_alarm_duration: 5,
    // TEXT
    work_text: `${COLOR.FORE_RED_BOLD}work${COLOR.RESET}`,
    break_text: `${COLOR.FORE_GREEN_BOLD}break${COLOR.RESET}`,
    long_break_text: `${COLOR.FORE_BRIGHT_BLACK_BOLD}long break${COLOR.RESET}`,

    time_text: `${COLOR.FORE_PURPLE_BOLD}time:${COLOR.RESET}`,
    round_text: `${COLOR.FORE_CYAN_BOLD}round:${COLOR.RESET}`,
}