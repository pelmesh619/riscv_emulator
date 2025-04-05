import { Word } from '../src/models/basic_types';

describe('Binary to decimal conversion', () => {
    it.each([
        ['00000000000000000000000000000000', 0, 0],
        ['00000000000000000000000000000001', 1, 1],
        ['00000000000000000000000000000010', 2, 2],
        ['00000000000000000000000000001000', 8, 8],
        ['11111111111111111111111111111111', -1, 0xffffffff],
        ['11111111111111111111111111111110', -2, 0xfffffffe],
        ['11111111111111111111111111111000', -8, 0xfffffff8],
        ['10000000000000000000000000000000', -0x80000000, 0x80000000],
        ['01111111111111111111111111111111', 0x7fffffff, 0x7fffffff],
    ])('converts %p expecting %p and %p', (binary: string, signedNumber: number, unsignedNumber: number) => {
        expect(Word.fromUnsignedBinary(binary).getValue()).toBe(unsignedNumber);
        expect(Word.fromSignedBinary(binary).getValue()).toBe(signedNumber);
    });
});


describe('Decimal to binary conversion', () => {
    it.each([
        [0, '00000000000000000000000000000000', '00000000000000000000000000000000'],
        [1, '00000000000000000000000000000001', '00000000000000000000000000000001'],
        [2, '00000000000000000000000000000010', '00000000000000000000000000000010'],
        [8, '00000000000000000000000000001000', '00000000000000000000000000001000'],
        [0x7fffffff, '01111111111111111111111111111111', '01111111111111111111111111111111'],
        [-1, '11111111111111111111111111111111', '-'],
        [-2, '11111111111111111111111111111110', '-'],
        [-8, '11111111111111111111111111111000', '-'],
        [-0x80000000, '10000000000000000000000000000000', '-'],
    ])('converts %p expecting %p and %p', (value: number, signedBinary: string, unsignedBinary: string) => {
        expect(new Word(value).asSignedBinary()).toBe(signedBinary);
        if (value >= 0) {
            expect(new Word(value).asUnsignedBinary()).toBe(unsignedBinary);
        }
    });
});
