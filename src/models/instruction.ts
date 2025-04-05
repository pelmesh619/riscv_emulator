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

abstract class InstructionTypeS implements Instruction {
    protected imm: number = 0;
    protected funct3: number = 0;
    protected rs1: number = 0;
    protected rs2: number = 0;
    protected opcode: number = 0;

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

abstract class InstructionTypeB extends InstructionTypeS {
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

    public buildInstruction(): bigint {
        return ((BigInt(this.imm) & 0b11111111111111111111000000000000n) << 12n) |
            ((BigInt(this.rd) & 0b11111n) << 7n) |
            (BigInt(this.opcode) & 0b1111111n);
    }
    
    execute(registerContext: RegisterContext): void {
        throw new Error("Method call in abstract class");
    }
}

abstract class InstructionTypeJ implements Instruction {
    protected imm: number = 0;
    protected rd: number = 0;
    protected opcode: number = 0;

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
}

