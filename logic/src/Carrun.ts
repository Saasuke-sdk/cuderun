function view(
    _target: any,
    _context: ClassMethodDecoratorContext
) {
    // View decorator just marks the method
}

function external(
    _target: any,
    _context: ClassMethodDecoratorContext
) {
    // External decorator just marks the method
}

class Carrun {
    private x: number;

    constructor(initialValue: number = 0) {
        this.x = initialValue;
    }

    @view
    public getHighScore(): number {
        return this.x;
    }

    @external
    public addHighScore(score: number): number {
        this.x = score;
        return this.x;
    }

}

export default Carrun;