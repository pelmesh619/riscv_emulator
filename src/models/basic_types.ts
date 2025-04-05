const abs = (n: bigint) => (n < 0n) ? -n : n;

export class Word {
    /* 
        Word represents 4-byte (32 bits) integer in memory

        Word should be used as abstraction of JS number type
    */

    public static get lengthInBits(): number { return 32; }
    public static get maxUnsigned(): bigint { return (1n << BigInt(Word.lengthInBits)) - 1n; }
    public static get minSigned(): bigint { return -(1n << BigInt(Word.lengthInBits - 1)); }
    public static get maxSigned(): bigint { return (1n << BigInt(Word.lengthInBits - 1)) - 1n; }

    public static Zero = new Word(0);
    public static One = new Word(1);

    private value: bigint = 0n;

    constructor(number: number) {
        this.value = BigInt(number);
        if (this.value < Word.minSigned) {
            this.value += 1n << BigInt(Word.lengthInBits);
        }
        if (this.value > Word.maxUnsigned) {
            this.value -= 1n << BigInt(Word.lengthInBits);
        }
        if (this.value > Word.maxSigned) {
            this.value -= Word.maxUnsigned + 1n;
        }
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
        if (this.value >= 0) {
            return this.value.toString(2).padStart(Word.lengthInBits, '0');
        }
        return (Word.maxUnsigned + this.value + 1n).toString(2).padStart(Word.lengthInBits, '1');
    }

    public getValue(): number {
        return Number(this.value);
    }

    public add(other: Word): Word {
        return new Word(Number(this.value + other.value));
    }

    public subtract(other: Word): Word {
        return new Word(Number(this.value - other.value));
    }

    public mul(other: Word): Word {
        return new Word(Number(this.value * other.value));
    }

    public div(other: Word): Word {
        return new Word(Number(this.value / other.value));
    }

    public remainder(other: Word): Word {
        return new Word(Number(this.value % other.value));
    }
}


