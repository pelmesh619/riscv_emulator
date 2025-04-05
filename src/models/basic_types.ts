const abs = (n: bigint) => (n < 0n) ? -n : n;

const sign = (n: bigint) => (n < 0n) ? -1n : (n == 0n) ? 0n : 1n;

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

    public getUnsignedValue(): number {
        if (this.value >= 0) {
            return Number(this.value);
        }
        return Number(Word.maxUnsigned + this.value + 1n);
    }

    public add(other: Word): Word {
        return new Word(Number(this.value + other.value));
    }

    public subtract(other: Word): Word {
        return new Word(Number(this.value - other.value));
    }

    public mul(other: Word): Word {
        let result = this.value * other.value;

        return new Word(Number(result & Word.maxUnsigned));
    }

    public mulh(other: Word): Word {
        return new Word(Number((this.value * other.value) >> BigInt(Word.lengthInBits)));
    }

    public div(other: Word): Word {
        return new Word(Number(this.value / other.value));
    }

    public remainder(other: Word): Word {
        return new Word(Number(this.value % other.value));
    }

    public shiftLeft(radix: number | bigint | Number | BigInt) {
        let r: BigInt;
        if (typeof radix == 'number' || radix instanceof Number) {
            r = BigInt(Number(radix));
        } else {
            r = radix;
        }
        return new Word(Number(this.value << (r as bigint)));
    }

    public shiftRight(radix: number | bigint | Number | BigInt) {
        let r: number;
        if (typeof radix == 'bigint' || radix instanceof BigInt) {
            r = Number(radix);
        } else {
            r = radix as number;
        }
        return new Word(this.getUnsignedValue() >> r);
    }

    public shiftRightArithmetical(radix: number | bigint | Number | BigInt) {
        let r: number;
        if (typeof radix == 'bigint' || radix instanceof BigInt) {
            r = Number(radix);
        } else {
            r = radix as number;
        }
        return new Word((this.getUnsignedValue() >> r) * Number(sign(this.value)));
    }
}


