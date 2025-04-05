import { Word } from '../src/models/basic_types.ts';

describe('Binary to decimal conversion', () => {
    test('Zero', () => {
        let string = '00000000000000000000000000000000';

        expect(Word.fromUnsignedBinary(string).getValue()).toBe(0);
        expect(Word.fromSignedBinary(string).getValue()).toBe(0);
    });

    test('One', () => {
        let string = '00000000000000000000000000000001';

        expect(Word.fromUnsignedBinary(string).getValue()).toBe(1);
        expect(Word.fromSignedBinary(string).getValue()).toBe(1);
    });

    test('Negative one', () => {
        let string = '11111111111111111111111111111111';

        expect(Word.fromUnsignedBinary(string).getValue()).toBe(0xffffffff);
        expect(Word.fromSignedBinary(string).getValue()).toBe(-1);
    });

    test('Two', () => {
        let string = '00000000000000000000000000000010';

        expect(Word.fromUnsignedBinary(string).getValue()).toBe(2);
        expect(Word.fromSignedBinary(string).getValue()).toBe(2);
    });

    test('Negative two', () => {
        let string = '11111111111111111111111111111110';

        expect(Word.fromUnsignedBinary(string).getValue()).toBe(0xfffffffe);
        expect(Word.fromSignedBinary(string).getValue()).toBe(-2);
    });

    test('2^31', () => {
        let string = '10000000000000000000000000000000';

        expect(Word.fromUnsignedBinary(string).getValue()).toBe(0x80000000);
        expect(Word.fromSignedBinary(string).getValue()).toBe(-0x80000000);
    });

    test('2^31 - 1', () => {
        let string = '01111111111111111111111111111111';

        expect(Word.fromUnsignedBinary(string).getValue()).toBe(0x7fffffff);
        expect(Word.fromSignedBinary(string).getValue()).toBe(0x7fffffff);
    });

    test('Eight', () => {
        let string = '00000000000000000000000000001000';

        expect(Word.fromUnsignedBinary(string).getValue()).toBe(8);
        expect(Word.fromSignedBinary(string).getValue()).toBe(8);
    });

    test('Negative Eight', () => {
        let string = '11111111111111111111111111111000';

        expect(Word.fromUnsignedBinary(string).getValue()).toBe(0xfffffff8);
        expect(Word.fromSignedBinary(string).getValue()).toBe(-8);
    });
});
