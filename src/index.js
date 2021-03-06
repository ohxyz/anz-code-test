const TABLE_SIZE = 5;
const NORTH = 1;
const EAST = 2;
const SOUTH = 3;
const WEST = 4;

const DIRECTION = {
    
    NORTH,
    EAST,
    SOUTH,
    WEST
};

class RobotWillFallError extends Error {
    
    constructor() {
        
        super();       
        this.message = `The robot will fall from the table.`;
    }
}

class InvalidCommandError extends Error {
    
    constructor() {
        
        super();       
        this.message = 'The command should be one of the following: '
                     + 'PLACE, LEFT, RIGHT, MOVE, REPORT';
    }
}

let util = {
    
    isValidCommandName: ( commandName ) => {
        
        let validCommandNames = [ 'PLACE', 'LEFT', 'RIGHT', 'MOVE', 'REPORT' ];
        
        if ( validCommandNames.indexOf( commandName ) === -1 ) {
            
            return false;
        }
        
        return true;
    }
};

class Robot {
    
    //@param {array} spot - eg. set [ x, y ] to [ 0, 0 ], [ 0, 1 ]
    //@param {number} facing - One of NORTH, EAST, SOUTH, WEST
    constructor( spot = [ 0, 0 ], facing = NORTH ) {
        
        this.currentSpot = spot;
        this.facing = facing;
        
    }
    
    getNextLandingSpot() {
        
        let nextLandingSpot = this.currentSpot.slice();
        
        if ( this.facing === NORTH ) {
            
            nextLandingSpot[ 1 ] += 1;
            return nextLandingSpot;
        }
        else if ( this.facing === EAST ) {
            
            nextLandingSpot[ 0 ] += 1;
            return nextLandingSpot;
        }
        else if ( this.facing === SOUTH ) {
            
            nextLandingSpot[ 1 ] -= 1;
            return nextLandingSpot;
        }
        else if ( this.facing === WEST ) {
            
            nextLandingSpot[ 0 ] -= 1;
            return nextLandingSpot;
        }
    }
    
    isLandable( landingSpot ) {
        
        if ( landingSpot[ 0 ] >= TABLE_SIZE
                || landingSpot[ 1 ] >= TABLE_SIZE
                || landingSpot[ 0 ] < 0
                || landingSpot[ 1 ] < 0 )
        {
            return false;
        }
    
        return true;
    }
    
    getSpotAndFacing() {
        
        return this.currentSpot.slice().concat( this.getFacingLiteral( this.facing ) );
    }
    
    getFacingLiteral( facing ) {
        
        let facingLiteral = '';
        
        if ( facing === NORTH ) {
            
            facingLiteral = 'NORTH';
        }
        else if ( facing === EAST ) {
            
            facingLiteral = 'EAST';
        }
        else if ( facing === SOUTH ) {
            
            facingLiteral = 'SOUTH';
        }
        else if ( facing === WEST ) {
            
            facingLiteral = 'WEST';
        }
        
        return facingLiteral;
    }
    
    handleCommandPlace( spot = [ 0, 0 ], facing = NORTH ) {
        
        if ( this.isLandable( spot ) === false ) {
            
            throw new RobotWillFallError();
        }
        
        this.currentSpot = spot;
        this.facing = facing;
        
        return this.getSpotAndFacing();
    }
    
    handleCommandLeft() {
        
        if ( this.facing === NORTH ) {
            
            this.facing = 4;
        }
        else {
            
            this.facing -= 1;
        }
        
        return this.getSpotAndFacing();
    }
    
    handleCommandRight() {
        
        if ( this.facing === WEST ) {
            
            this.facing = 1;
        }
        else {
            
            this.facing += 1;
        }
        
        return this.getSpotAndFacing();
    }
    
    handleCommandMove() {
        
        let nextLandingSpot = this.getNextLandingSpot();
        
        if ( this.isLandable( nextLandingSpot ) === true ) {
            
            this.currentSpot = nextLandingSpot;
        }
        else {
            
            throw new RobotWillFallError();
        }
        
        return this.getSpotAndFacing();
    }
    
    handleCommandReport() {
        
        let facingLiteral = this.getFacingLiteral( this.facing );

        console.log( `Output: ${this.currentSpot[0]}, ${this.currentSpot[1]}, ${facingLiteral}` );
    }
    
    // param {array} command - eg. PLACE, 1, 1, EAST | MOVE | LEFT 
    executeCommandLine( commandLineLiteral ) {
        
        if ( commandLineLiteral.trim() === '' ) {
            
            return;
        }
        
        let indexOfFirstSpace = commandLineLiteral.indexOf(' ');
        let commandName = '';
        
        if ( indexOfFirstSpace === -1 ){
            
            commandName = commandLineLiteral;
        }
        else {
            
            commandName = commandLineLiteral.slice( 0, indexOfFirstSpace );
        }
        
        if ( util.isValidCommandName( commandName ) === false ) {
            
            throw new InvalidCommandError();
        }
        
        if ( commandName === 'PLACE' ) {
            
            let commandPlaceOptions = 
                    commandLineLiteral.slice( indexOfFirstSpace )
                                      .trim()
                                      .split(',');
                                  
            commandPlaceOptions = commandPlaceOptions.map( ( item ) => {
                
                return item.trim();
            } );
        
            let spot = [ parseInt( commandPlaceOptions[ 0 ], 10 ),
                         parseInt( commandPlaceOptions[ 1 ], 10 ) ];
                
            let facing = DIRECTION[ commandPlaceOptions[ 2 ] ];
            
            this.handleCommandPlace( spot, facing );
        }
        
        if ( commandName === 'MOVE' ) {
            
            this.handleCommandMove();
        }
        
        if ( commandName === 'LEFT' ) {
            
            this.handleCommandLeft();
        }
        
        if ( commandName === 'RIGHT' ) {
            
            this.handleCommandRight();
        }
        
        if ( commandName === 'REPORT' ) {
            
            this.handleCommandReport();
        }
    }
    
    executeCommandSheet( commandSheet ) {
        
        let commandLines = commandSheet.split( /\r?\n|\r/ );
        
        for ( let i = 0; i < commandLines.length; i ++ ) {
            
            this.executeCommandLine( commandLines[ i ] );
        }
    }
}

let robotAnz = new Robot();

// Interative unit-test in Chrome dev tools
window.robotAnz = robotAnz;
window.NORTH    = 1;
window.EAST     = 2;
window.SOUTH    = 3;
window.WEST     = 4;

console.log( 'End...' );
