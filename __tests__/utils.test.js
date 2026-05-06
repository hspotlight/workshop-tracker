const {
  escapeHtml,
  generateId,
  validateSessionData,
  validateDisplayName,
  canCompleteStep,
  getCompletedCount,
  isAllComplete,
} = require('../public/utils');

describe('escapeHtml', () => {
  test('escapes HTML special characters', () => {
    expect(escapeHtml('<script>alert("xss")</script>')).toBe(
      '&lt;script&gt;alert("xss")&lt;/script&gt;'
    );
  });

  test('escapes ampersands', () => {
    expect(escapeHtml('a & b')).toBe('a &amp; b');
  });

  test('returns empty string for empty input', () => {
    expect(escapeHtml('')).toBe('');
  });

  test('leaves safe text unchanged', () => {
    expect(escapeHtml('hello world')).toBe('hello world');
  });
});

describe('generateId', () => {
  test('returns an 8-character string', () => {
    const id = generateId();
    expect(id).toHaveLength(8);
  });

  test('contains only alphanumeric characters', () => {
    const id = generateId();
    expect(id).toMatch(/^[a-zA-Z0-9]+$/);
  });

  test('generates unique IDs', () => {
    const ids = new Set(Array.from({ length: 100 }, () => generateId()));
    expect(ids.size).toBe(100);
  });
});

describe('validateSessionData', () => {
  test('returns no errors for valid data (object steps)', () => {
    const errors = validateSessionData({ name: 'My Session', steps: [{ name: 'Step 1' }, { name: 'Step 2' }] });
    expect(errors).toEqual([]);
  });

  test('returns no errors for valid data (string steps legacy)', () => {
    const errors = validateSessionData({ name: 'My Session', steps: ['Step 1', 'Step 2'] });
    expect(errors).toEqual([]);
  });

  test('returns error for empty name', () => {
    const errors = validateSessionData({ name: '', steps: [{ name: 'Step 1' }] });
    expect(errors).toContain('Session name is required');
  });

  test('returns error for whitespace-only name', () => {
    const errors = validateSessionData({ name: '   ', steps: [{ name: 'Step 1' }] });
    expect(errors).toContain('Session name is required');
  });

  test('returns error for no steps', () => {
    const errors = validateSessionData({ name: 'My Session', steps: [] });
    expect(errors).toContain('At least one step is required');
  });

  test('returns error for empty step name (object)', () => {
    const errors = validateSessionData({ name: 'My Session', steps: [{ name: 'Step 1' }, { name: '' }] });
    expect(errors).toContain('Step 2 name is required');
  });

  test('returns error for empty step name (string legacy)', () => {
    const errors = validateSessionData({ name: 'My Session', steps: ['Step 1', ''] });
    expect(errors).toContain('Step 2 name is required');
  });

  test('returns multiple errors', () => {
    const errors = validateSessionData({ name: '', steps: [] });
    expect(errors.length).toBe(2);
  });
});

describe('validateDisplayName', () => {
  test('returns null for valid name', () => {
    expect(validateDisplayName('Alice')).toBeNull();
  });

  test('returns error for empty name', () => {
    expect(validateDisplayName('')).toBe('Display name is required');
  });

  test('returns error for null', () => {
    expect(validateDisplayName(null)).toBe('Display name is required');
  });

  test('returns error for name exceeding 50 characters', () => {
    const longName = 'a'.repeat(51);
    expect(validateDisplayName(longName)).toBe('Display name must be 50 characters or less');
  });

  test('accepts name at exactly 50 characters', () => {
    const name = 'a'.repeat(50);
    expect(validateDisplayName(name)).toBeNull();
  });
});

describe('canCompleteStep', () => {
  const steps = [
    { id: 'step-0', name: 'Step 1' },
    { id: 'step-1', name: 'Step 2' },
    { id: 'step-2', name: 'Step 3' },
  ];

  test('first step can always be completed when no progress', () => {
    expect(canCompleteStep(steps, {}, 'step-0')).toBe(true);
  });

  test('second step cannot be completed without first', () => {
    expect(canCompleteStep(steps, {}, 'step-1')).toBe(false);
  });

  test('second step can be completed after first', () => {
    const progress = { 'step-0': { completedAt: new Date() } };
    expect(canCompleteStep(steps, progress, 'step-1')).toBe(true);
  });

  test('already completed step cannot be completed again', () => {
    const progress = { 'step-0': { completedAt: new Date() } };
    expect(canCompleteStep(steps, progress, 'step-0')).toBe(false);
  });

  test('returns false for unknown step', () => {
    expect(canCompleteStep(steps, {}, 'step-99')).toBe(false);
  });

  test('third step requires second to be done', () => {
    const progress = { 'step-0': { completedAt: new Date() } };
    expect(canCompleteStep(steps, progress, 'step-2')).toBe(false);
  });

  test('third step can be completed after first and second', () => {
    const progress = {
      'step-0': { completedAt: new Date() },
      'step-1': { completedAt: new Date() },
    };
    expect(canCompleteStep(steps, progress, 'step-2')).toBe(true);
  });
});

describe('getCompletedCount', () => {
  const steps = [
    { id: 'step-0', name: 'Step 1' },
    { id: 'step-1', name: 'Step 2' },
    { id: 'step-2', name: 'Step 3' },
  ];

  test('returns 0 when no progress', () => {
    expect(getCompletedCount(steps, {})).toBe(0);
  });

  test('returns correct count for partial progress', () => {
    const progress = { 'step-0': { completedAt: new Date() } };
    expect(getCompletedCount(steps, progress)).toBe(1);
  });

  test('returns total count when all done', () => {
    const progress = {
      'step-0': { completedAt: new Date() },
      'step-1': { completedAt: new Date() },
      'step-2': { completedAt: new Date() },
    };
    expect(getCompletedCount(steps, progress)).toBe(3);
  });
});

describe('validateSessionData — step descriptions', () => {
  test('ignores description field (it is optional)', () => {
    const errors = validateSessionData({
      name: 'My Session',
      steps: [
        { name: 'Step 1', description: 'Do this' },
        { name: 'Step 2', description: '' },
        { name: 'Step 3' },
      ],
    });
    expect(errors).toEqual([]);
  });

  test('returns error when step name is whitespace even with description', () => {
    const errors = validateSessionData({
      name: 'My Session',
      steps: [{ name: '   ', description: 'Some description' }],
    });
    expect(errors).toContain('Step 1 name is required');
  });

  test('returns error when step name is missing (object with no name key)', () => {
    const errors = validateSessionData({
      name: 'My Session',
      steps: [{ description: 'Only a description' }],
    });
    expect(errors).toContain('Step 1 name is required');
  });
});

describe('escapeHtml — confirm dialog safety', () => {
  test('escapes participant name with angle brackets (HTML injection)', () => {
    const result = escapeHtml('<img src=x onerror=alert(1)>');
    expect(result).not.toContain('<');
    expect(result).toContain('&lt;');
    expect(result).toContain('&gt;');
  });

  test('escapes participant name with angle brackets', () => {
    const result = escapeHtml('<Bob>');
    expect(result).toBe('&lt;Bob&gt;');
  });

  test('safe participant name is unchanged', () => {
    expect(escapeHtml('Alice K.')).toBe('Alice K.');
  });
});

describe('isAllComplete', () => {
  const steps = [
    { id: 'step-0', name: 'Step 1' },
    { id: 'step-1', name: 'Step 2' },
  ];

  test('returns false when no progress', () => {
    expect(isAllComplete(steps, {})).toBe(false);
  });

  test('returns false when partially complete', () => {
    const progress = { 'step-0': { completedAt: new Date() } };
    expect(isAllComplete(steps, progress)).toBe(false);
  });

  test('returns true when all complete', () => {
    const progress = {
      'step-0': { completedAt: new Date() },
      'step-1': { completedAt: new Date() },
    };
    expect(isAllComplete(steps, progress)).toBe(true);
  });
});
