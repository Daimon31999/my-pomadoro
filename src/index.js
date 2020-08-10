const COLOR = require('./color')

const config = require('./config')

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
            let soundPath = path.join(__dirname, `../src/sounds/${alarm_name}`)
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
                    soundPath = path.join(__dirname, `../src/sounds/tick-work.mp3`)

                    playCommand = linuxPlayCommand(soundPath, 2)
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