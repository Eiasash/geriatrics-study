/**
 * Tests for build-progress.js utility functions
 */

const {
  ProgressBar,
  log,
  colors,
  formatBytes,
  formatDuration,
  BuildTimer,
} = require('../build-progress.js');

describe('colors', () => {
  test('should export all color codes', () => {
    expect(colors.reset).toBeDefined();
    expect(colors.bright).toBeDefined();
    expect(colors.dim).toBeDefined();
    expect(colors.red).toBeDefined();
    expect(colors.green).toBeDefined();
    expect(colors.yellow).toBeDefined();
    expect(colors.blue).toBeDefined();
    expect(colors.magenta).toBeDefined();
    expect(colors.cyan).toBeDefined();
  });

  test('should have valid ANSI escape sequences', () => {
    expect(colors.reset).toBe('\x1b[0m');
    expect(colors.red).toBe('\x1b[31m');
    expect(colors.green).toBe('\x1b[32m');
    expect(colors.yellow).toBe('\x1b[33m');
    expect(colors.blue).toBe('\x1b[34m');
  });
});

describe('formatBytes', () => {
  test('should format 0 bytes', () => {
    expect(formatBytes(0)).toBe('0 B');
  });

  test('should format bytes under 1KB', () => {
    expect(formatBytes(100)).toBe('100 B');
    expect(formatBytes(512)).toBe('512 B');
    expect(formatBytes(1023)).toBe('1023 B');
  });

  test('should format kilobytes', () => {
    expect(formatBytes(1024)).toBe('1 KB');
    expect(formatBytes(2048)).toBe('2 KB');
    expect(formatBytes(1536)).toBe('1.5 KB');
  });

  test('should format megabytes', () => {
    expect(formatBytes(1024 * 1024)).toBe('1 MB');
    expect(formatBytes(1024 * 1024 * 2.5)).toBe('2.5 MB');
  });

  test('should format gigabytes', () => {
    expect(formatBytes(1024 * 1024 * 1024)).toBe('1 GB');
    expect(formatBytes(1024 * 1024 * 1024 * 1.5)).toBe('1.5 GB');
  });

  test('should round to 2 decimal places', () => {
    expect(formatBytes(1234)).toBe('1.21 KB');
    expect(formatBytes(12345)).toBe('12.06 KB');
  });
});

describe('formatDuration', () => {
  test('should format 0 milliseconds', () => {
    expect(formatDuration(0)).toBe('0s');
  });

  test('should format seconds', () => {
    expect(formatDuration(1000)).toBe('1s');
    expect(formatDuration(5000)).toBe('5s');
    expect(formatDuration(59000)).toBe('59s');
  });

  test('should format minutes and seconds', () => {
    expect(formatDuration(60000)).toBe('1m 0s');
    expect(formatDuration(90000)).toBe('1m 30s');
    expect(formatDuration(125000)).toBe('2m 5s');
  });

  test('should handle sub-second values', () => {
    expect(formatDuration(500)).toBe('0s');
    expect(formatDuration(999)).toBe('0s');
  });

  test('should handle large durations', () => {
    expect(formatDuration(600000)).toBe('10m 0s'); // 10 minutes
    expect(formatDuration(3600000)).toBe('60m 0s'); // 1 hour
  });
});

describe('log', () => {
  let consoleSpy;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  test('log.info should log with blue info symbol', () => {
    log.info('Test message');
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining(colors.blue)
    );
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Test message'));
  });

  test('log.success should log with green check symbol', () => {
    log.success('Success message');
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining(colors.green)
    );
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Success message'));
  });

  test('log.warning should log with yellow warning symbol', () => {
    log.warning('Warning message');
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining(colors.yellow)
    );
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Warning message'));
  });

  test('log.error should log with red error symbol', () => {
    log.error('Error message');
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining(colors.red)
    );
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Error message'));
  });

  test('log.section should log section header with cyan color', () => {
    log.section('Section Header');
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining(colors.cyan)
    );
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Section Header'));
  });

  test('log.step should log step with count', () => {
    log.step(1, 5, 'Step message');
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('[1/5]'));
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Step message'));
  });
});

describe('ProgressBar', () => {
  let stdoutSpy;

  beforeEach(() => {
    stdoutSpy = jest.spyOn(process.stdout, 'write').mockImplementation();
  });

  afterEach(() => {
    stdoutSpy.mockRestore();
  });

  describe('constructor', () => {
    test('should initialize with total and default title', () => {
      const bar = new ProgressBar(10);
      expect(bar.total).toBe(10);
      expect(bar.current).toBe(0);
      expect(bar.title).toBe('Progress');
      expect(bar.barLength).toBe(30);
    });

    test('should initialize with custom title', () => {
      const bar = new ProgressBar(20, 'Building');
      expect(bar.title).toBe('Building');
      expect(bar.total).toBe(20);
    });

    test('should set start time', () => {
      const before = Date.now();
      const bar = new ProgressBar(10);
      const after = Date.now();
      expect(bar.startTime).toBeGreaterThanOrEqual(before);
      expect(bar.startTime).toBeLessThanOrEqual(after);
    });
  });

  describe('update', () => {
    test('should update current value', () => {
      const bar = new ProgressBar(10);
      bar.update(5);
      expect(bar.current).toBe(5);
    });

    test('should write progress to stdout', () => {
      const bar = new ProgressBar(10, 'Test');
      bar.update(5);
      expect(stdoutSpy).toHaveBeenCalled();
    });

    test('should include percentage in output', () => {
      const bar = new ProgressBar(10);
      bar.update(5);
      expect(stdoutSpy).toHaveBeenCalledWith(expect.stringContaining('50%'));
    });

    test('should include progress count in output', () => {
      const bar = new ProgressBar(10);
      bar.update(3);
      expect(stdoutSpy).toHaveBeenCalledWith(expect.stringContaining('(3/10)'));
    });

    test('should include label if provided', () => {
      const bar = new ProgressBar(10);
      bar.update(5, 'Processing file.txt');
      expect(stdoutSpy).toHaveBeenCalledWith(expect.stringContaining('Processing file.txt'));
    });

    test('should write newline when complete', () => {
      const bar = new ProgressBar(10);
      bar.update(10);
      expect(stdoutSpy).toHaveBeenCalledWith('\n');
    });

    test('should not write newline when not complete', () => {
      const bar = new ProgressBar(10);
      bar.update(5);
      const lastCall = stdoutSpy.mock.calls[stdoutSpy.mock.calls.length - 1];
      expect(lastCall[0]).not.toBe('\n');
    });
  });

  describe('increment', () => {
    test('should increment current by 1', () => {
      const bar = new ProgressBar(10);
      bar.increment();
      expect(bar.current).toBe(1);
      bar.increment();
      expect(bar.current).toBe(2);
    });

    test('should pass label to update', () => {
      const bar = new ProgressBar(10);
      bar.increment('test label');
      expect(stdoutSpy).toHaveBeenCalledWith(expect.stringContaining('test label'));
    });
  });

  describe('complete', () => {
    test('should set current to total', () => {
      const bar = new ProgressBar(10);
      bar.update(5);
      bar.complete();
      expect(bar.current).toBe(10);
    });

    test('should use default complete message', () => {
      const bar = new ProgressBar(10);
      bar.complete();
      expect(stdoutSpy).toHaveBeenCalledWith(expect.stringContaining('Complete!'));
    });

    test('should use custom complete message', () => {
      const bar = new ProgressBar(10);
      bar.complete('All done!');
      expect(stdoutSpy).toHaveBeenCalledWith(expect.stringContaining('All done!'));
    });
  });

  describe('progress bar display', () => {
    test('should display correct filled/empty ratio at 0%', () => {
      const bar = new ProgressBar(10);
      bar.update(0);
      expect(stdoutSpy).toHaveBeenCalledWith(expect.stringContaining('0%'));
    });

    test('should display correct filled/empty ratio at 100%', () => {
      const bar = new ProgressBar(10);
      bar.update(10);
      expect(stdoutSpy).toHaveBeenCalledWith(expect.stringContaining('100%'));
    });
  });
});

describe('BuildTimer', () => {
  let consoleSpy;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  test('should initialize with name and start time', () => {
    const before = Date.now();
    const timer = new BuildTimer('Test Build');
    const after = Date.now();

    expect(timer.name).toBe('Test Build');
    expect(timer.startTime).toBeGreaterThanOrEqual(before);
    expect(timer.startTime).toBeLessThanOrEqual(after);
  });

  test('should log completion message on end', () => {
    const timer = new BuildTimer('Test Build');
    timer.end();

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('Test Build completed')
    );
  });

  test('should return duration in milliseconds', () => {
    const timer = new BuildTimer('Test');
    const duration = timer.end();

    expect(typeof duration).toBe('number');
    expect(duration).toBeGreaterThanOrEqual(0);
  });

  test('should measure elapsed time', async () => {
    const timer = new BuildTimer('Test');

    // Wait a bit
    await new Promise((resolve) => setTimeout(resolve, 50));

    const duration = timer.end();
    expect(duration).toBeGreaterThanOrEqual(40); // Allow some tolerance
  });
});

describe('module exports', () => {
  test('should export all required functions and classes', () => {
    expect(ProgressBar).toBeDefined();
    expect(log).toBeDefined();
    expect(colors).toBeDefined();
    expect(formatBytes).toBeDefined();
    expect(formatDuration).toBeDefined();
    expect(BuildTimer).toBeDefined();
  });

  test('log should have all required methods', () => {
    expect(typeof log.info).toBe('function');
    expect(typeof log.success).toBe('function');
    expect(typeof log.warning).toBe('function');
    expect(typeof log.error).toBe('function');
    expect(typeof log.section).toBe('function');
    expect(typeof log.step).toBe('function');
  });
});
