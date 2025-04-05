import { Word } from './basic_types.js'

export class RegisterContext {
    private registers: Word[] = [
        Word.Zero,
        Word.Zero, Word.Zero, Word.Zero, Word.Zero, Word.Zero, Word.Zero, Word.Zero, Word.Zero,
        Word.Zero, Word.Zero, Word.Zero, Word.Zero, Word.Zero, Word.Zero, Word.Zero, Word.Zero,
        Word.Zero, Word.Zero, Word.Zero, Word.Zero, Word.Zero, Word.Zero, Word.Zero, Word.Zero,
        Word.Zero, Word.Zero, Word.Zero, Word.Zero, Word.Zero, Word.Zero, Word.Zero, Word.Zero,
    ]

    public setRegister(index: number, value: Word) {
        if (index == 0) {
            return;
        }
        this.registers[index] = value;
    }

    public getRegister(index: number) {
        if (index == 0) {
            return Word.Zero;
        }
        return this.registers[index];
    }
}