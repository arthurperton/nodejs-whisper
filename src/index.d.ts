export interface WhisperOptions {
	outputInText?: boolean
	outputInVtt?: boolean
	outputInSrt?: boolean
	outputInCsv?: boolean
	outputInJson?: boolean
	outputInJsonFull?: boolean
	outputInLrc?: boolean
	outputInWords?: boolean
	translateToEnglish?: boolean

	threads?: number
	processors?: number
	offsetT?: number
	offsetN?: number
	duration?: number
	maxContext?: number
	maxLen?: number
	splitOnWord?: boolean
	bestOf?: number
	beamSize?: number
	audioCtx?: number
	wordThold?: number
	entropyThold?: number
	logprobThold?: number
	noSpeechThold?: number
	temperature?: number
	temperatureInc?: number
	debugMode?: boolean
	diarize?: boolean
	tinyDiarize?: boolean
	noFallback?: boolean
	fontPath?: string
	outputFile?: string
	noPrints?: boolean
	printSpecial?: boolean
	printColors?: boolean
	printProgress?: boolean
	noTimestamps?: boolean
	language?: string
	detectLanguage?: boolean
	prompt?: string
	ovEDevice?: string
	dtw?: string
	logScore?: boolean
	noGpu?: boolean
	flashAttn?: boolean
	suppressNst?: boolean
	suppressRegex?: string
	grammar?: string
	grammarRule?: string
	grammarPenalty?: number

	timestamps_length?: number
	wordTimestamps?: boolean
}

export interface IOptions {
	modelName: string
	autoDownloadModelName?: string
	whisperOptions?: WhisperOptions
	withCuda?: boolean
	removeWavFileAfterTranscription?: boolean
	logger?: Console
}

export declare function nodewhisper(filePath: string, options: IOptions): Promise<string>
