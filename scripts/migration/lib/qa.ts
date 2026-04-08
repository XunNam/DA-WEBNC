import fs from 'node:fs'
import path from 'node:path'

export type CheckStatus = 'pass' | 'fail'

export type QAWarning = {
  code: string
  message: string
  context?: Record<string, unknown>
}

export type QAError = {
  code: string
  message: string
  context?: Record<string, unknown>
}

export type QACheck = {
  status: CheckStatus
  expected?: unknown
  observed?: unknown
  details?: Record<string, unknown>
}

export type QAReport = {
  status: 'pass' | 'fail'
  summary: {
    totalChecks: number
    passedChecks: number
    failedChecks: number
    warningCount: number
    errorCount: number
  }
  checks: Record<string, QACheck>
  warnings: QAWarning[]
  errors: QAError[]
}

export class QACollector {
  private checks: Record<string, QACheck> = {}

  private warnings: QAWarning[] = []

  private errors: QAError[] = []

  addCheck(name: string, status: CheckStatus, config: Omit<QACheck, 'status'> = {}): void {
    this.checks[name] = {
      status,
      ...config,
    }
  }

  pass(name: string, config: Omit<QACheck, 'status'> = {}): void {
    this.addCheck(name, 'pass', config)
  }

  fail(name: string, message: string, config: Omit<QACheck, 'status'> = {}): void {
    this.addCheck(name, 'fail', config)
    this.errors.push({
      code: name,
      message,
      context: config.details,
    })
  }

  assert(
    name: string,
    condition: boolean,
    message: string,
    config: Omit<QACheck, 'status'> = {},
  ): void {
    if (condition) {
      this.pass(name, config)
      return
    }

    this.fail(name, message, config)
  }

  warn(code: string, message: string, context?: Record<string, unknown>): void {
    this.warnings.push({
      code,
      message,
      context,
    })
  }

  toReport(): QAReport {
    const totalChecks = Object.keys(this.checks).length
    const failedChecks = Object.values(this.checks).filter((check) => check.status === 'fail').length
    const passedChecks = totalChecks - failedChecks

    return {
      status: failedChecks > 0 ? 'fail' : 'pass',
      summary: {
        totalChecks,
        passedChecks,
        failedChecks,
        warningCount: this.warnings.length,
        errorCount: this.errors.length,
      },
      checks: this.checks,
      warnings: this.warnings,
      errors: this.errors,
    }
  }

  hasFailures(): boolean {
    return this.errors.length > 0
  }
}

export const readJsonArtifact = <T>(migrationDataDir: string, fileName: string): T => {
  const filePath = path.join(migrationDataDir, fileName)

  if (!fs.existsSync(filePath)) {
    throw new Error(`Required artifact is missing: migration-data/${fileName}`)
  }

  return JSON.parse(fs.readFileSync(filePath, 'utf8')) as T
}

export const writeQaReport = (migrationDataDir: string, report: QAReport): string => {
  const filePath = path.join(migrationDataDir, 'qa-report.json')
  fs.writeFileSync(filePath, `${JSON.stringify(report, null, 2)}\n`, 'utf8')
  return filePath
}
