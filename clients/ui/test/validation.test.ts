import assert from 'node:assert';
import { test } from 'node:test';
import { validateChallengeCode } from '../utils/validation';
import { CodingChallenge } from '../types/challenge';

test('validateCode: Success case - Required String', () => {
  const challenge: CodingChallenge = {
    initialCode: '',
    requiredString: 'foo()',
    hint: 'Use foo()'
  };
  
  const result = validateChallengeCode('const x = foo();', challenge);
  assert.strictEqual(result.isValid, true);
});

test('validateCode: Failure case - String only in comment', () => {
  const challenge: CodingChallenge = {
    initialCode: '',
    requiredString: 'foo()',
  };
  
  const result = validateChallengeCode('// Call foo() here', challenge);
  assert.strictEqual(result.isValid, false);
});

test('validateCode: Failure case - String matched in import partial', () => {
  const challenge: CodingChallenge = {
    initialCode: '',
    requiredString: 'writeData(umi)', // Import is just 'writeData'
  };
  
  const code = 'import { writeData } from "lib";';
  const result = validateChallengeCode(code, challenge);
  assert.strictEqual(result.isValid, false);
});

test('validateCode: Failure case - Missing String', () => {
  const challenge: CodingChallenge = {
    initialCode: '',
    requiredString: 'foo()',
    hint: 'Use foo()'
  };
  
  const result = validateChallengeCode('const x = bar();', challenge);
  assert.strictEqual(result.isValid, false);
  assert.match(result.message, /Hint/);
});
