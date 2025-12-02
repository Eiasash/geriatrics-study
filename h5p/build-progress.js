/**
 * Progress indicator utilities for H5P build scripts
 */

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

class ProgressBar {
  constructor(total, title = 'Progress') {
    this.total = total;
    this.current = 0;
    this.title = title;
    this.barLength = 30;
    this.startTime = Date.now();
  }

  update(current, label = '') {
    this.current = current;
    const percentage = Math.floor((current / this.total) * 100);
    const filled = Math.floor((current / this.total) * this.barLength);
    const empty = this.barLength - filled;
    
    const bar = '█'.repeat(filled) + '░'.repeat(empty);
    const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
    
    // Clear line and write progress
    process.stdout.write('\r');
    process.stdout.write(
      `${colors.cyan}${this.title}${colors.reset} ` +
      `[${colors.green}${bar}${colors.reset}] ` +
      `${colors.bright}${percentage}%${colors.reset} ` +
      `(${current}/${this.total}) ` +
      `${colors.dim}${label}${colors.reset} ` +
      `${colors.dim}${elapsed}s${colors.reset}`
    );
    
    if (current === this.total) {
      process.stdout.write('\n');
    }
  }

  increment(label = '') {
    this.update(this.current + 1, label);
  }

  complete(message = 'Complete!') {
    this.update(this.total, message);
  }
}

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  section: (msg) => console.log(`\n${colors.cyan}${colors.bright}${msg}${colors.reset}`),
  step: (step, total, msg) => console.log(`${colors.dim}[${step}/${total}]${colors.reset} ${msg}`),
};

function formatBytes(bytes) {
  if (bytes === 0) {
    return '0 B';
  }
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

function formatDuration(ms) {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`;
  }
  return `${seconds}s`;
}

class BuildTimer {
  constructor(name) {
    this.name = name;
    this.startTime = Date.now();
  }

  end() {
    const duration = Date.now() - this.startTime;
    log.success(`${this.name} completed in ${formatDuration(duration)}`);
    return duration;
  }
}

module.exports = {
  ProgressBar,
  log,
  colors,
  formatBytes,
  formatDuration,
  BuildTimer,
};
