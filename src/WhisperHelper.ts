import path from 'path'
import fs from 'fs'
import { MODELS_LIST, MODEL_OBJECT, WHISPER_CPP_PATH } from './constants'
import { IOptions } from '.'

const escapeArg = (arg: string) => {
	if (process.platform === 'win32') {
		return `"${arg.replace(/"/g, '\\"')}"`
	}
	return `"${arg}"`
}

// Get the correct executable path based on platform and build system
function getExecutablePath(): string {
	const execName = process.platform === 'win32' ? 'whisper-cli.exe' : 'whisper-cli'

	// Check common CMake build locations
	const possiblePaths = [
		path.join(WHISPER_CPP_PATH, 'build', 'bin', execName), // Unix CMake
		path.join(WHISPER_CPP_PATH, 'build', 'bin', 'Release', execName), // Windows CMake Release
		path.join(WHISPER_CPP_PATH, 'build', 'bin', 'Debug', execName), // Windows CMake Debug
		path.join(WHISPER_CPP_PATH, 'build', execName), // Alternative location
		path.join(WHISPER_CPP_PATH, execName), // Root directory
	]

	for (const execPath of possiblePaths) {
		if (fs.existsSync(execPath)) {
			return execPath
		}
	}

	return '' // Not found
}

export const constructCommand = (filePath: string, args: IOptions): string => {
	let errors: string[] = []

	if (!args.modelName) {
		errors.push('[Nodejs-whisper] Error: Provide model name')
	}

	if (!MODELS_LIST.includes(args.modelName)) {
		errors.push(`[Nodejs-whisper] Error: Enter a valid model name. Available models are: ${MODELS_LIST.join(', ')}`)
	}

	const modelPath = path.join(WHISPER_CPP_PATH, 'models', MODEL_OBJECT[args.modelName])
	if (!fs.existsSync(modelPath)) {
		errors.push(
			'[Nodejs-whisper] Error: Model file does not exist. Please ensure the model is downloaded and correctly placed.'
		)
	}

	if (errors.length > 0) {
		throw new Error(errors.join('\n'))
	}

	// Get the actual executable path
	const executablePath = getExecutablePath()
	if (!executablePath) {
		throw new Error('[Nodejs-whisper] Error: whisper-cli executable not found')
	}

	const modelName = MODEL_OBJECT[args.modelName as keyof typeof MODEL_OBJECT]

	// Use relative model path from whisper.cpp directory
	const modelArg = `./models/${modelName}`

	let command = `${escapeArg(executablePath)} ${constructOptionsFlags(args)} -l ${args.whisperOptions?.language || 'auto'} -m ${escapeArg(modelArg)} -f ${escapeArg(filePath)}`

	return command
}

const constructOptionsFlags = (args: IOptions): string => {
	const o = args.whisperOptions
	if (!o) return ''

	const flags: string[] = []

	const pushBool = (on: boolean | undefined, flag: string) => {
		if (on) flags.push(flag)
	}
	const pushNum = (value: number | undefined, flag: string) => {
		if (value === 0 || value) flags.push(`${flag} ${value}`)
	}
	const pushStr = (value: string | undefined, flag: string, { quote = false }: { quote?: boolean } = {}) => {
		if (value === '') return
		if (value) flags.push(`${flag} ${quote ? escapeArg(value) : value}`)
	}

	// Performance
	pushNum(o.threads, '-t')
	pushNum(o.processors, '-p')

	// Offsets / duration
	pushNum(o.offsetT, '-ot')
	pushNum(o.offsetN, '-on')
	pushNum(o.duration, '-d')

	// Decoding / context
	pushNum(o.maxContext, '-mc')
	pushNum(o.maxLen ?? o.timestamps_length, '-ml')
	pushBool(o.splitOnWord, '-sow')
	pushNum(o.bestOf, '-bo')
	pushNum(o.beamSize, '-bs')
	pushNum(o.audioCtx, '-ac')
	pushNum(o.wordThold, '-wt')
	pushNum(o.entropyThold, '-et')
	pushNum(o.logprobThold, '-lpt')
	pushNum(o.noSpeechThold, '-nth')
	pushNum(o.temperature, '-tp')
	pushNum(o.temperatureInc, '-tpi')

	// Modes
	pushBool(o.debugMode, '-debug')
	pushBool(o.translateToEnglish, '-tr')
	pushBool(o.diarize, '-di')
	pushBool(o.tinyDiarize, '-tdrz')
	pushBool(o.noFallback, '-nf')

	// Outputs
	pushBool(o.outputInText, '-otxt')
	pushBool(o.outputInVtt, '-ovtt')
	pushBool(o.outputInSrt, '-osrt')
	pushBool(o.outputInLrc, '-olrc')
	pushBool(o.outputInWords || o.wordTimestamps, '-owts')
	pushBool(o.outputInCsv, '-ocsv')
	pushBool(o.outputInJson, '-oj')
	pushBool(o.outputInJsonFull, '-ojf')
	pushStr(o.fontPath, '-fp', { quote: true })
	pushStr(o.outputFile, '-of', { quote: true })

	// Printing
	pushBool(o.noPrints, '-np')
	pushBool(o.printSpecial, '-ps')
	pushBool(o.printColors, '-pc')
	pushBool(o.printProgress, '-pp')
	pushBool(o.noTimestamps, '-nt')

	// Language / prompt
	pushBool(o.detectLanguage, '-dl')
	pushStr(o.prompt, '--prompt', { quote: true })

	// Runtime extras
	pushStr(o.ovEDevice, '-oved', { quote: true })
	pushStr(o.dtw, '-dtw', { quote: true })
	pushBool(o.logScore, '-ls')
	pushBool(o.noGpu, '-ng')
	pushBool(o.flashAttn, '-fa')
	pushBool(o.suppressNst, '-sns')
	pushStr(o.suppressRegex, '--suppress-regex', { quote: true })
	pushStr(o.grammar, '--grammar', { quote: true })
	pushStr(o.grammarRule, '--grammar-rule', { quote: true })
	pushNum(o.grammarPenalty, '--grammar-penalty')

	return flags.join(' ').trim()
}
