const COLOR = {
    RESET: '\u001B[0m',

    FORE_BLACK: '\u001B[30m',
    FORE_RED: '\u001B[31m',
    FORE_GREEN: '\u001B[32m',
    FORE_YELLOW: '\u001B[33m',
    FORE_ORANGE: '\u001b[38;5;202m',
    FORE_BLUE: '\u001B[34m',
    FORE_PURPLE: '\u001B[35m',
    FORE_CYAN: '\u001B[36m',
    FORE_WHITE: '\u001B[37m',
    FORE_BROWN: '\u001B[38;5;94m',

    FORE_BRIGHT_BLACK: '\u001B[90m',
    FORE_BRIGHT_RED: '\u001B[91m',
    FORE_BRIGHT_GREEN: '\u001B[92m',
    FORE_BRIGHT_YELLOW: '\u001B[93m',
    FORE_BRIGHT_ORANGE: '\u001b[38;5;208m',
    FORE_BRIGHT_BLUE: '\u001B[94m',
    FORE_BRIGHT_PURPLE: '\u001B[95m',
    FORE_BRIGHT_CYAN: '\u001B[96m',
    FORE_BRIGHT_WHITE: '\u001B[97m',

    FORE_BRIGHT_BLACK_BOLD: '\u001B[90m\u001b[1m',
    FORE_BRIGHT_RED_BOLD: '\u001B[91m\u001b[1m',
    FORE_BRIGHT_GREEN_BOLD: '\u001B[92m\u001b[1m',
    FORE_BRIGHT_YELLOW_BOLD: '\u001B[93m\u001b[1m',
    FORE_BRIGHT_ORANGE_BOLD: '\u001b[38;5;208m\u001b[1m',
    FORE_BRIGHT_BLUE_BOLD: '\u001B[94m\u001b[1m',
    FORE_BRIGHT_PURPLE_BOLD: '\u001B[95m\u001b[1m',
    FORE_BRIGHT_CYAN_BOLD: '\u001B[96m\u001b[1m',
    FORE_BRIGHT_WHITE_BOLD: '\u001B[97m\u001b[1m',

    FORE_BLACK_BOLD: '\u001B[30m\u001b[1m',
    FORE_RED_BOLD: '\u001B[31m\u001b[1m',
    FORE_GREEN_BOLD: '\u001B[32m\u001b[1m',
    FORE_YELLOW_BOLD: '\u001B[33m\u001b[1m',
    FORE_ORANGE_BOLD: '\u001b[38;5;202m\u001b[1m',
    FORE_BLUE_BOLD: '\u001B[34m\u001b[1m',
    FORE_PURPLE_BOLD: '\u001B[35m\u001b[1m',
    FORE_CYAN_BOLD: '\u001B[36m\u001b[1m',
    FORE_WHITE_BOLD: '\u001B[37m\u001b[1m',
    FORE_BROWN_BOLD: '\u001B[38;5;94m\u001b[1m',

    FORE_BOLD: '\u001b[1m',

    BACK_BLACK: '\u001B[40m',
    BACK_RED: '\u001B[41m',
    BACK_GREEN: '\u001B[42m',
    BACK_YELLOW: '\u001B[43m',
    BACK_BLUE: '\u001B[44m',
    BACK_PURPLE: '\u001B[45m',
    BACK_CYAN: '\u001B[46m',
    BACK_WHITE: '\u001B[47m',
    BACK_ORANGE: '\u001b[48;5;202m',
}

const config = {
    /*  MAIN SETTINGS */
    rounds: 12, // total cound of rounds
    work_minutes: 0.05,
    break_minutes: 0.05,
    long_break_minutes: 0.05,
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
    break_text: `${COLOR.FORE_BLUE_BOLD}break${COLOR.RESET}`,
    long_break_text: `${COLOR.FORE_BRIGHT_BLACK_BOLD}long break${COLOR.RESET}`,

    time_text: `${COLOR.FORE_PURPLE_BOLD}time:${COLOR.RESET}`,
    round_text: `${COLOR.FORE_CYAN_BOLD}round:${COLOR.RESET}`,
}

const timer = (
    minutes,
    round,
    name,
    time_text = `${COLOR.FORE_PURPLE_BOLD}time:${COLOR.RESET}`,
    round_text = `${COLOR.FORE_CYAN_BOLD}round:${COLOR.RESET}`,
    count = 0
) => {
    return new Promise((resolve) => {
        let myVar = setInterval(() => {
            let seconds = minutes * 60 * 1000 // 5 мин * 60 сек * 1000 миллисек
            let date = new Date(seconds)
            date = parseInt(date.getTime(), 10) - count // перевести время в число и отнять счетчик
            date = new Date(date) // получить новую дату из предыд. результата

            process.stdout.write(
                `${name} - ${time_text} ${date.getMinutes()}:${date.getSeconds()} ${round_text} ${round}`
            )
            setTimeout(() => {
                process.stdout.clearLine()
                process.stdout.cursorTo(0)
            }, 1000)

            if (count === seconds) {
                resolve(1) // 1 = ok
                clearInterval(myVar)
            }

            count += 1000 // добавить секунду
        }, 1000)
    })
}

const player = () => {
    const { exec } = require('child_process')
    const execPromise = require('util').promisify(exec)
    const path = require('path')
    const fs = require('fs')

    /* MAC PLAY COMMAND */
    const macPlayCommand = (path) => `afplay ${path}`

    /* WINDOW PLAY COMMANDS */
    const addPresentationCore = `Add-Type -AssemblyName presentationCore;`
    const createMediaPlayer = `$player = New-Object system.windows.media.mediaplayer;`
    const loadAudioFile = (path) => `$player.open('${path}');`
    const playAudio = `$player.Play();`
    const stopAudio = (duration = 1) =>
        `Start-Sleep 1; Start-Sleep -s ${duration};Exit;`

    const windowPlayCommand = (path, duration) =>
        `powershell -c ${addPresentationCore} ${createMediaPlayer} ${loadAudioFile(
      path
    )} ${playAudio} ${stopAudio(duration)}`

    /* LINUX PLAY COMMANDS */

    // const linuxPlayCommand = (path, duration) =>
    //     `sudo apt install sox && sudo apt install libsox-fmt-mp3 && sox ${path} short.mp3 trim ${duration}`

    const linuxPlayCommand = (soundPath, duration) =>
        `aplay ${soundPath} -d ${duration}`

    return {
        play: async(alarm_name, duration) => {
            const soundPath = path.join(__dirname, `./sounds/${alarm_name}`)
                // try to file existence
            fs.access(soundPath, fs.F_OK, (err) => {
                if (err) {
                    console.error(
                        `${COLOR.FORE_RED_BOLD}Error!!! File '${alarm_name}' not exists on: ${soundPath}${COLOR.RESET}`
                    )
                    process.exit(1)
                }
            })

            let playCommand = windowPlayCommand(soundPath, duration)
            switch (process.platform) {
                case 'win32':
                    playCommand = windowPlayCommand(soundPath, duration)
                    break
                case 'linux':
                    playCommand = linuxPlayCommand('./sounds/tick-work.mp3', 2)
                    break
                case 'darwin':
                    playCommand = macPlayCommand(soundPath)
            }
            try {
                await execPromise(playCommand)
            } catch (err) {
                throw err
            }
        },
    }
}
async function pomadoro(config) {
    const sound = player()

    let round = 0
    while (round < config.rounds) {
        // work
        await timer(
            config.work_minutes,
            round,
            config.work_text,
            config.time_text,
            config.round_text
        )
        sound.play(config.work_alarm_name, config.work_alarm_duration)
        round++

        // if long break
        if (round % 4 == 0 && round != 0 && round < config.rounds) {
            await timer(
                config.long_break_minutes,
                round,
                config.long_break_text,
                config.time_text,
                config.round_text
            )
            sound.play(config.long_break_alarm_name, config.long_break_alarm_duration)
        } else if (round < config.rounds) {
            // if break
            await timer(
                config.break_minutes,
                round,
                config.break_text,
                config.time_text,
                config.round_text
            )
            sound.play(config.break_alarm_name, config.break_alarm_duration)
        } else sound.play(config.done_alarm_name, config.done_alarm_duration)
    }
}

// pomadoro(config)
module.exports.pomadoro = function(config) {
    return pomadoro(config)
}
module.exports.config = config