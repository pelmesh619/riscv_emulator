import { Word } from './basic_types.js'
import { getRegisterIndex } from '../utilities.js'

export class RegisterContext {
    private registers: Word[] = [
        Word.Zero,
        Word.Zero, Word.Zero, Word.Zero, Word.Zero, Word.Zero, Word.Zero, Word.Zero, Word.Zero,
        Word.Zero, Word.Zero, Word.Zero, Word.Zero, Word.Zero, Word.Zero, Word.Zero, Word.Zero,
        Word.Zero, Word.Zero, Word.Zero, Word.Zero, Word.Zero, Word.Zero, Word.Zero, Word.Zero,
        Word.Zero, Word.Zero, Word.Zero, Word.Zero, Word.Zero, Word.Zero, Word.Zero
    ]

    private programCounter = Word.Zero;

    private _programCounterIndex = getRegisterIndex('pc');

    public get programCounterIndex() { return this._programCounterIndex }

    public setRegister(index: number, value: Word) {
        if (index == 0) {
            return;
        }
        if (index == this._programCounterIndex) {
            this.programCounter = value;
            return;
        }
        this.registers[index] = value;
    }

    public getRegister(index: number) {
        if (index == 0) {
            return Word.Zero;
        }
        if (index == this._programCounterIndex) {
            return this.programCounter;
        }
        return this.registers[index];
    }
}