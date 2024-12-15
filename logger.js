const LOG_LEVELS = [
  'TRACE',
  'DEBUG',
  'INFO',
  'WARN',
  'ERROR',
]

let currentLogLevel = 'DEBUG'

const setLogLevel = (level) => {
  if (!LOG_LEVELS.includes(level)) {
    throw new Error(`Invalid log level: ${level}`)
  }
  currentLogLevel = level
}

const shouldLog = (level) => {
  return LOG_LEVELS.indexOf(level) >= LOG_LEVELS.indexOf(currentLogLevel);
}

const log = (level, message, context = {}) => {
  if (!shouldLog(level)) {
    return
  }

  const timestamp = new Date().toISOString()
  const logEntry = `[${timestamp}] [${level.toUpperCase()}]: ${message}`

  if (Object.keys(context).length > 0) {
    console.log(logEntry, context)
  } else {
    console.log(logEntry)
  }

}

const logger = {
  setLogLevel,
  trace: (msg, ctx) => log('TRACE', msg, ctx),
  debug: (msg, ctx) => log('DEBUG', msg, ctx),
  info: (msg, ctx) => log('INFO', msg, ctx),
  warn: (msg, ctx) => log('WARN', msg, ctx),
  error: (msg, ctx) => log('ERROR', msg, ctx),
};

module.exports = logger;