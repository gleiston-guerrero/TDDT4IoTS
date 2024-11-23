/**
 * incializar el area para crear los bloques de codigo
 * */

var workspace;
var options;
var toolbox;
Blockly.Arduino = new Blockly.Generator('Arduino');

class CustomCategory extends Blockly.ToolboxCategory {
    /**
     * Constructor for a custom category.
     * @override
     */
    constructor(categoryDef, toolbox, opt_parent) {
        super(categoryDef, toolbox, opt_parent);
    }

    /** @override */
    addColourBorder_(colour) {
        this.rowDiv_.style.backgroundColor = colour;
    }
}

Blockly.registry.register(
    Blockly.registry.Type.TOOLBOX_ITEM,
    Blockly.ToolboxCategory.registrationName,
    CustomCategory, true);

initBlockCode = () => {
    $.getJSON("resources/js/js-iot/blocks.json", function (data) {
        options = {
            toolbox: data,
            grid: {spacing: 20, length: 3, colour: '#ccc', snap: true},
            trashcan: true,
            scrollbars: true,
            zoom: {
                controls: true,
                wheel: true,
                startScale: 1.0,
                maxScale: 3,
                minScale: 0.3,
                scaleSpeed: 1.2,
                pinch: true
            },
        };
        workspace = Blockly.inject('blockCode', options);

    });
};

/**
 * ##############################################################
 * BLOQUES PARA GENERAR EL CODIGO
 * ##############################################################
 * */

/**
 * bloque para encapsular el codigo que estara dentro del setup del codigo arduino
 * */
Blockly.Blocks['setup'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("setup");
        this.appendStatementInput("BOARD_SETUP")
            .setCheck("String");
        this.setColour(230);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

/**
 * bloque para encapsular el codigo que estara dentro del loop del codigo arduino
 * */
Blockly.Blocks['loop'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("loop");
        this.appendStatementInput("BOARD_LOOP")
            .setCheck("String");
        this.setColour(230);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

/**
 * funcion para cambiar los estados de alto o bajo
 * */
Blockly.Blocks['status'] = {
    init: function() {
        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown([["HIGH","high"], ["LOW","low"]]), "status");
        this.setOutput(true, null);
        this.setColour(180);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

/**
 * funcion para usra el digitalwrite
 * */
Blockly.Blocks['digital_write'] = {
    init: function() {
        this.appendValueInput("NAME")
            .setCheck("String")
            .appendField("Digital Write PIN#");
        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown([["HIGH","high"], ["LOW","low"]]), "status");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(180);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};


/**
 * ##############################################################
 * SECCIONES DE CODIGO POR CADA BLOQUE
 * ##############################################################
 * */

Blockly.Arduino['setup'] = function(block) {
    var statements_board_setup = Blockly.Arduino.statementToCode(block, 'BOARD_SETUP');
    // TODO: Assemble JavaScript into code variable.
    var code = '...;\n';
    return code;
};

Blockly.Arduino['loop'] = function(block) {
    var statements_board_setup = Blockly.Arduino.statementToCode(block, 'BOARD_LOOP');
    // TODO: Assemble JavaScript into code variable.
    var code = '...;\n';
    return code;
};

Blockly.Arduino['status'] = function(block) {
    var dropdown_status = block.getFieldValue('status');
    // TODO: Assemble JavaScript into code variable.
    var code = '...';
    // TODO: Change ORDER_NONE to the correct strength.
    return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.Arduino['digital_write'] = function(block) {
    var value_name = Blockly.Arduino.valueToCode(block, 'NAME', Blockly.JavaScript.ORDER_ATOMIC);
    var dropdown_status = block.getFieldValue('status');
    // TODO: Assemble JavaScript into code variable.
    var code = '...;\n';
    return code;
};

