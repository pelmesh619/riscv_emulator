import { RegisterContext } from './simulator.js'
import { Word } from './basic_types.js'

export namespace instructions32Bits {

export interface Instruction {
    buildInstruction(): bigint;

    execute(registerContext: RegisterContext): void;
}

abstract class InstructionTypeR implements Instruction {
    protected funct7: number = 0;
    protected funct3: number = 0;
    protected rs2: number = 0;
    protected rs1: number = 0;
    protected rd: number = 0;
    protected opcode: number = 0;

    constructor(rd: number, rs1: number, rs2: number) {
        this.rs1 = rs1;
        this.rd = rd;
        this.rs2 = rs2;
    }

    public buildInstruction(): bigint {
        return ((BigInt(this.funct7) & 0b1111111n) << 25n) |
            ((BigInt(this.rs2) & 0b11111n) << 20n) |
            ((BigInt(this.rs1) & 0b11111n) << 15n) |
            ((BigInt(this.funct3) & 0b111n) << 12n) |
            ((BigInt(this.rd) & 0b11111n) << 7n) |
            (BigInt(this.opcode) & 0b1111111n);
    }
    
    execute(registerContext: RegisterContext): void {
        throw new Error("Method call in abstract class");
    }
}

abstract class InstructionTypeI implements Instruction {
    protected imm: number = 0;
    protected funct3: number = 0;
    protected rs1: number = 0;
    protected rd: number = 0;
    protected opcode: number = 0;

    constructor(rd: number, rs1: number, imm: number) {
        this.rs1 = rs1;
        this.rd = rd;
        this.imm = imm;
    }

    public buildInstruction(): bigint {
        return ((BigInt(this.imm) & 0b111111111111n) << 20n) |
            ((BigInt(this.rs1) & 0b11111n) << 15n) |
            ((BigInt(this.funct3) & 0b111n) << 12n) |
            ((BigInt(this.rd) & 0b11111n) << 7n) |
            (BigInt(this.opcode) & 0b1111111n);
    }
    
    execute(registerContext: RegisterContext): void {
        throw new Error("Method call in abstract class");
    }
}

class InstructionTypeS implements Instruction {
    protected imm: number = 0;
    protected funct3: number = 0;
    protected rs1: number = 0;
    protected rs2: number = 0;
    protected opcode: number = 0;

    constructor(rs1: number, rs2: number, imm: number) {
        this.rs1 = rs1;
        this.rs2 = rs2;
        this.imm = imm;
    }

    public buildInstruction(): bigint {
        return ((BigInt(this.imm) & 0b111111100000n) << 25n) |
            ((BigInt(this.rs2) & 0b11111n) << 20n) |
            ((BigInt(this.rs1) & 0b11111n) << 15n) |
            ((BigInt(this.funct3) & 0b111n) << 12n) |
            ((BigInt(this.imm) & 0b11111n) << 7n) |
            (BigInt(this.opcode) & 0b1111111n);
    }
    
    execute(registerContext: RegisterContext): void {
        throw new Error("Method call in abstract class");
    }
}

class InstructionTypeB extends InstructionTypeS {
    public buildInstruction(): bigint {
        let a = (((this.imm >> 12) & 0b1) << 6) | ((this.imm >> 5) & 0b111111);
        let b = (this.imm & 0b11110) | ((this.imm >> 11) & 0b1);

        return (BigInt(a) << 25n) |
            ((BigInt(this.rs2) & 0b11111n) << 20n) |
            ((BigInt(this.rs1) & 0b11111n) << 15n) |
            ((BigInt(this.funct3) & 0b111n) << 12n) |
            (BigInt(b) << 7n) |
            (BigInt(this.opcode) & 0b1111111n);
    }
    
    execute(registerContext: RegisterContext): void {
        throw new Error("Method call in abstract class");
    }
}

abstract class InstructionTypeU implements Instruction {
    protected imm: number = 0;
    protected rd: number = 0;
    protected opcode: number = 0;

    constructor(rd: number, imm: number) {
        this.rd = rd;
        this.imm = imm;
    }

    public buildInstruction(): bigint {
        return ((BigInt(this.imm) & 0b11111111111111111111000000000000n) << 12n) |
            ((BigInt(this.rd) & 0b11111n) << 7n) |
            (BigInt(this.opcode) & 0b1111111n);
    }
    
    execute(registerContext: RegisterContext): void {
        throw new Error("Method call in abstract class");
    }
}

abstract class InstructionTypeJ extends InstructionTypeU {
    public buildInstruction(): bigint {
        let a = (this.imm >> 20) & 0b1;
        let b = (this.imm >> 1) & 0b1111111111;
        let c = (this.imm >> 11) & 0b1;
        let d = (this.imm >> 12) & 0b11111111;

        return ((BigInt(a)) << 31n) |
            ((BigInt(b)) << 21n) |
            ((BigInt(c)) << 20n) |
            ((BigInt(d)) << 12n) |
            ((BigInt(this.rd) & 0b11111n) << 7n) |
            (BigInt(this.opcode) & 0b1111111n);
    }
    
    execute(registerContext: RegisterContext): void {
        throw new Error("Method call in abstract class");
    }
}

export class Addition extends InstructionTypeR {
    protected opcode: number = 0b0110011;

    public execute(registerContext: RegisterContext) {
        registerContext.setRegister(
            this.rd,
            registerContext.getRegister(this.rs1).add(registerContext.getRegister(this.rs2))
        );
    }
}

export class Subtraction extends InstructionTypeR {
    protected opcode: number = 0b0110011;
    protected funct7: number = 0b0100000;

    public execute(registerContext: RegisterContext) {
        registerContext.setRegister(
            this.rd,
            registerContext.getRegister(this.rs1).subtract(registerContext.getRegister(this.rs2))
        );
    }
}

export class ShiftLogicalLeft extends InstructionTypeR {
    protected opcode: number = 0b0110011;
    protected funct3: number = 0b001;

    public execute(registerContext: RegisterContext) {
        registerContext.setRegister(
            this.rd,
            registerContext.getRegister(this.rs1)
                .shiftLeft(registerContext.getRegister(this.rs2).getValue() & 0b11111)
        );
    }
}

export class SetLessThan extends InstructionTypeR {
    protected opcode: number = 0b0110011;
    protected funct3: number = 0b010;

    public execute(registerContext: RegisterContext) {
        let a = registerContext.getRegister(this.rs1).getValue();
        let b = registerContext.getRegister(this.rs2).getValue();

        registerContext.setRegister(
            this.rd,
            a < b ? Word.One : Word.Zero
        );
    }
}

export class SetLessThanUnsigned extends InstructionTypeR {
    protected opcode: number = 0b0110011;
    protected funct3: number = 0b011;

    public execute(registerContext: RegisterContext) {
        let a = registerContext.getRegister(this.rs1).getUnsignedValue();
        let b = registerContext.getRegister(this.rs2).getUnsignedValue();

        registerContext.setRegister(
            this.rd,
            a < b ? Word.One : Word.Zero
        );
    }
}

export class Xor extends InstructionTypeR {
    protected opcode: number = 0b0110011;
    protected funct3: number = 0b100;

    public execute(registerContext: RegisterContext) {
        registerContext.setRegister(
            this.rd,
            registerContext.getRegister(this.rs1)
                .bitwiseXor(registerContext.getRegister(this.rs2))
        );
    }
}

export class ShiftRightLogical extends InstructionTypeR {
    protected opcode: number = 0b0110011;
    protected funct3: number = 0b101;

    public execute(registerContext: RegisterContext) {
        registerContext.setRegister(
            this.rd,
            registerContext.getRegister(this.rs1)
                .shiftRight(registerContext.getRegister(this.rs2).getValue() & 0b11111)
        );
    }
}
export class ShiftRightArithmetical extends InstructionTypeR {
    protected opcode: number = 0b0110011;
    protected funct3: number = 0b101;
    protected funct7: number = 0b0100000;

    public execute(registerContext: RegisterContext) {
        registerContext.setRegister(
            this.rd,
            registerContext.getRegister(this.rs1)
                .shiftRightArithmetical(registerContext.getRegister(this.rs2).getValue() & 0b11111)
        );
    }
}

export class Or extends InstructionTypeR {
    protected opcode: number = 0b0110011;
    protected funct3: number = 0b110;

    public execute(registerContext: RegisterContext) {
        registerContext.setRegister(
            this.rd,
            registerContext.getRegister(this.rs1)
                .bitwiseOr(registerContext.getRegister(this.rs2))
        );
    }
}

export class And extends InstructionTypeR {
    protected opcode: number = 0b0110011;
    protected funct3: number = 0b111;

    public execute(registerContext: RegisterContext) {
        registerContext.setRegister(
            this.rd,
            registerContext.getRegister(this.rs1)
                .bitwiseAnd(registerContext.getRegister(this.rs2))
        );
    }
}


export class AdditionWithImmediate extends InstructionTypeI {
    protected opcode: number = 0b0110011;

    public execute(registerContext: RegisterContext) {
        registerContext.setRegister(
            this.rd,
            registerContext.getRegister(this.rs1).add(Word.fromNumberAndSignExtend(this.imm, 12))
        );
    }
}

export class SetLessThanImmediate extends InstructionTypeI {
    protected opcode: number = 0b0110011;
    protected funct3: number = 0b010;

    public execute(registerContext: RegisterContext) {
        let a = registerContext.getRegister(this.rs1).getValue();
        let b = Word.fromNumberAndSignExtend(this.imm, 12).getValue();

        registerContext.setRegister(
            this.rd,
            a < b ? Word.One : Word.Zero
        );
    }
}

export class SetLessThanUnsignedImmediate extends InstructionTypeI {
    protected opcode: number = 0b0110011;
    protected funct3: number = 0b011;

    public execute(registerContext: RegisterContext) {
        let a = registerContext.getRegister(this.rs1).getUnsignedValue();
        let b = Word.fromNumberAndSignExtend(this.imm, 12).getUnsignedValue();

        registerContext.setRegister(
            this.rd,
            a < b ? Word.One : Word.Zero
        );
    }
}

export class XorWithImmediate extends InstructionTypeI {
    protected opcode: number = 0b0110011;
    protected funct3: number = 0b100;

    public execute(registerContext: RegisterContext) {
        registerContext.setRegister(
            this.rd,
            registerContext.getRegister(this.rs1)
                .bitwiseXor(Word.fromNumberAndSignExtend(this.imm, 12))
        );
    }
}

export class ShiftLogicalLeftWithImmediate extends InstructionTypeI {
    protected opcode: number = 0b0110011;
    protected funct3: number = 0b001;

    public execute(registerContext: RegisterContext) {
        registerContext.setRegister(
            this.rd,
            registerContext.getRegister(this.rs1)
                .shiftLeft(this.imm & 0b11111)
        );
    }
}

export class ShiftRightLogicalWithImmediate extends InstructionTypeI {
    protected opcode: number = 0b0110011;
    protected funct3: number = 0b101;

    public execute(registerContext: RegisterContext) {
        registerContext.setRegister(
            this.rd,
            registerContext.getRegister(this.rs1)
                .shiftRight(this.imm & 0b11111)
        );
    }
}

export class ShiftRightArithmeticalWithImmediate extends InstructionTypeI {
    protected opcode: number = 0b0110011;
    protected funct3: number = 0b101;
    protected funct7: number = 0b0100000;

    public execute(registerContext: RegisterContext) {
        registerContext.setRegister(
            this.rd,
            registerContext.getRegister(this.rs1)
                .shiftRightArithmetical(this.imm & 0b11111)
        );
}

export class OrWithImmediate extends InstructionTypeI {
    protected opcode: number = 0b0110011;
    protected funct3: number = 0b110;

    public execute(registerContext: RegisterContext) {
        registerContext.setRegister(
            this.rd,
            registerContext.getRegister(this.rs1)
                .bitwiseOr(Word.fromNumberAndSignExtend(this.imm, 12))
        );
    }
}

export class AndWithImmediate extends InstructionTypeI {
    protected opcode: number = 0b0110011;
    protected funct3: number = 0b111;

    public execute(registerContext: RegisterContext) {
        registerContext.setRegister(
            this.rd,
            registerContext.getRegister(this.rs1)
                .bitwiseAnd(Word.fromNumberAndSignExtend(this.imm, 12))
        );
}


export class LoadUpperImmediate extends InstructionTypeU {
    protected opcode: number = 0b0110111;

    public execute(registerContext: RegisterContext) {
        registerContext.setRegister(
            this.rd,
            new Word((this.imm >> 12) << 12)
        );
}


export class AddUpperImmediateToProgramCounter extends InstructionTypeU {
    protected opcode: number = 0b0010111;

    public execute(registerContext: RegisterContext) {
        registerContext.setRegister(
            registerContext.programCounterIndex,
            new Word((this.imm >> 12) << 12).add(registerContext.getRegister(registerContext.programCounterIndex))
        );
        registerContext.setRegister(
            this.rd,
            registerContext.getRegister(registerContext.programCounterIndex)
        );

    }
}

}

