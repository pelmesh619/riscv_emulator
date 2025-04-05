const abs = (n: bigint) => (n < 0n) ? -n : n;

export class Word {
    /* 
        Word represents 4-byte (32 bits) integer in memory

        Word should be used as abstraction of JS number type
    */

    public static get lengthInBits(): number { return 32; }
    public static get maxUnsigned(): bigint { return (1n << BigInt(Word.lengthInBits)) - 1n; }

    private value: bigint = 0n;

    constructor(number: number) {
        this.value = BigInt(number);
    }

    public static fromUnsignedBinary(s: string): Word {
        return new Word(parseInt(s, 2));
    } 

    public static fromSignedBinary(s: string): Word {
        let isNegative = s[0] == '1';

        if (!isNegative) {
            return new Word(parseInt(s, 2));
        }

        return new Word(parseInt(s.slice(1, s.length), 2) + (1 << (Word.lengthInBits - 1)))
    } 

    public asUnsignedBinary(): string {
        return this.value.toString(2).padStart(Word.lengthInBits, '0');
    }

    public asSignedBinary(): string {
        return this.value.toString(2).padStart(Word.lengthInBits, '0');
    }

    public getValue(): number {
        return Number(this.value);
    }
}


