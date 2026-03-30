export interface WhisperOptions {
	// Performance
	threads?: number
	processors?: number

	// Audio slicing / offsets
	offsetT?: number
	offsetN?: number
	duration?: number

	// Decoding / context
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

	// Modes
	debugMode?: boolean
	translateToEnglish?: boolean
	diarize?: boolean
	tinyDiarize?: boolean
	noFallback?: boolean

	// Outputs
	outputInCsv?: boolean
	outputInJson?: boolean
	outputInJsonFull?: boolean
	outputInLrc?: boolean
	outputInSrt?: boolean
	outputInText?: boolean
	outputInVtt?: boolean
	outputInWords?: boolean

	// Output configuration
	fontPath?: string
	outputFile?: string
	noPrints?: boolean
	printSpecial?: boolean
	printColors?: boolean
	printProgress?: boolean
	noTimestamps?: boolean

	// Language / prompt
	language?: string
	detectLanguage?: boolean
	prompt?: string

	// Model / runtime extras
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

	/**
	 * Back-compat aliases:
	 * - `timestamps_length` previously (incorrectly) mapped to `-ml`; treat as `maxLen`
	 * - `wordTimestamps` previously (incorrectly) mapped to `-ml 1`; treat as `outputInWords`
	 */
	timestamps_length?: number
	wordTimestamps?: boolean
}

export interface Logger {
	debug: (...args: any[]) => void
	error: (...args: any[]) => void
	log: (...args: any[]) => void
}
