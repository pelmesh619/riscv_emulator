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
        expect(Word.fromUnsignedBinary(binary).getUnsignedValue()).toBe(unsignedNumber);
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

describe('Arithmetic operations', () => {
    it.each([
        [0, 0, 0],
        [1, 0, 1],
        [1, 1, 2],
        [-1, 1, 0],
        [0xffffffff, 1, 0],
        [0xf0000000, 0xf0000000, 0xe0000000],
        [-0x80000000, -11, 0x7ffffff5],
    ])('adds %p and %p expecting %p', (a: number, b: number, c: number) => {
        expect(new Word(a).add(new Word(b))).toStrictEqual(new Word(c));
    });

    it.each([
        [0, 0, 0],
        [1, 0, 1],
        [1, 1, 0],
        [1, -1, 2],
        [-1, 1, -2],
        [0xffffffff, -1, 0],
        [0xf0000000, -0xf0000000, 0xe0000000],
        [-0x80000000, 11, 0x7ffffff5],
    ])('subtracts from %p value %p expecting %p', (a: number, b: number, c: number) => {
        expect(new Word(a).subtract(new Word(b))).toStrictEqual(new Word(c));
    });

    it.each([
        [0, 0, 0, 0],
        [1, 0, 0, 0],
        [1, 1, 0, 1],
        [1, -1, 0xffffffff, 0xffffffff],
        [-1, 1, 0xffffffff, 0xffffffff],
        [-15, 10, 0xffffffff, 0xffffffff - 150 + 1],
        [2, 2, 0, 4],
        [0x10000000, 0x10000000, 0x01000000, 0],
        [21979826, 2380948, 0x2f98, 0xaf4f76e8],
    ])('multiplies %p by %p expecting %p;%p', (a: number, b: number, higherResult: number, lowerResult: number) => {
        let word1 = new Word(a);
        let word2 = new Word(b);

        expect(word1.mul(word2)).toStrictEqual(new Word(lowerResult));
        expect(word1.mulh(word2)).toStrictEqual(new Word(higherResult));
    });

    it.each([
        [0, 1, 0],
        [1, 1, 1],
        [1, -1, -1],
        [-1, 1, -1],
        [-15, 10, -1],
        [2, 2, 1],
        [0x10000000, 0x08000000, 2],
        [0x2379acf4, 0x0b139acf, 3],
    ])('divides %p by %p expecting %p', (a: number, b: number, result: number) => {
        let word1 = new Word(a);
        let word2 = new Word(b);

        expect(word1.div(word2)).toStrictEqual(new Word(result));
    });

    it.each([
        1, 5, 0, 100,
    ])('divides %p by 0 expecting exception', (a: number) => {
        let word1 = new Word(a);

        expect(() => word1.div(Word.Zero)).toThrow();
    });
});


describe('Bitwise operations', () => {
    it.each([
        [0, 0, 0],
        [1, 0, 1],
        [1, 1, 0],
        [0b1101010, 0b10101, 0b1111111],
        [-1, 1, 0xfffffffe],
        [0xffffffff, 1, 0xfffffffe],
        [0xf0000000, 0xf0000000, 0x00000000],
        [0x80000000, 0x0000000b, 0x8000000b],
    ])('xors %p and %p expecting %p', (a: number, b: number, c: number) => {
        expect(new Word(a).bitwiseXor(new Word(b))).toStrictEqual(new Word(c));
    });
    
    it.each([
        [0, 0, 0],
        [1, 0, 0],
        [1, 1, 1],
        [0b1101010, 0b10101, 0b0000000],
        [-1, 1, 1],
        [0xffffffff, 1, 1],
        [0xffffffff, 0x00f00000, 0x00f00000],
        [0xf0000000, 0xf0000000, 0xf0000000],
        [0x80000000, 0x0000000b, 0x00000000],
    ])('ands %p and %p expecting %p', (a: number, b: number, c: number) => {
        expect(new Word(a).bitwiseAnd(new Word(b))).toStrictEqual(new Word(c));
    });
    
    it.each([
        [0, 0, 0],
        [1, 0, 1],
        [1, 1, 1],
        [0b1101010, 0b10101, 0b1111111],
        [-1, 1, 0xffffffff],
        [0xffffffff, 1, 0xffffffff],
        [0xf0000000, 0xf0000000, 0xf0000000],
        [0x80000000, 0x0000000b, 0x8000000b],
    ])('ors %p and %p expecting %p', (a: number, b: number, c: number) => {
        expect(new Word(a).bitwiseOr(new Word(b))).toStrictEqual(new Word(c));
    });
});
