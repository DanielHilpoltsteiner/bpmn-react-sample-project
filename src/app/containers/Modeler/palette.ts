export function PaletteProvider(
    palette: any,
    create: any,
    elementFactory: any,
    spaceTool: any,
    lassoTool: any,
    extraPaletteEntries: any,
    commandQueue: any) {
    this._create = create;
    this._elementFactory = elementFactory;
    this._spaceTool = spaceTool;
    this._lassoTool = lassoTool;
    this._extraPaletteEntries = extraPaletteEntries;
    this._commandQueue = commandQueue;
    palette.registerProvider(this);
}

// PaletteProvider["$inject"] = ['palette', 'create', 'elementFactory',
// 'spaceTool', 'lassoTool', 'extraPaletteEntries', 'commandQueue'];

PaletteProvider.prototype.getPaletteEntries = () => { // = function (element?: any) {
    // var self = this;

    const actions = {};
    const create = this._create;
    const elementFactory = this._elementFactory;
    const spaceTool = this._spaceTool;
    const lassoTool = this._lassoTool;
    const extraPaletteEntries = this._extraPaletteEntries;
    const commandQueue = this._commandQueue;

    console.log('Palette-provider: extraPaletteEntries=', extraPaletteEntries);

    const createAction = (type: string, group: string, className: string, title: string = null, options: any = {}) => {
        const createListener = (event: any) => {
            const shape = elementFactory.createShape(Object.assign({ type }, options));
            if (options) {
                shape.businessObject.di.isExpanded = options.isExpanded;
            }
            create.start(event, shape);
        };

        return {
            group,
            className,
            title: title || 'Create ' + type.replace(/^bpmn\:/, ''),
            action: {
                dragstart: createListener,
                click: createListener,
            },
        };
    };

    function createParticipant(event: any, collapsed: any) {
        create.start(event, elementFactory.createParticipantShape(collapsed));
    }

    for (const entry of extraPaletteEntries) {
        extraPaletteEntries[entry].action.click = () => {
            console.log('Sending command: ', entry);
            commandQueue.next({ action: entry });
        };
    }

    Object.assign(actions, extraPaletteEntries);

    Object.assign(actions, {
        'save': {
            group: 'storage',
            className: ['fa-floppy-o', 'fa'],
            title: 'SAVE',
            action: {
                click: () => commandQueue.next({ action: 'save' }),
            },
        },
        'export-svg': {
            group: 'storage',
            className: ['fa-print', 'fa'],
            title: 'EXPORT TO SVG',
            action: {
                click: () => console.log('EXPORT TO SVG'),
            },
        },
        'tool-separator-storage': {
            group: 'storage',
            separator: true,
        },

        'view.zoom-to-fit': {
            group: 'view',
            className: ['fa-map-o', 'fa'],
            title: 'Zoom-To-Fit',
            action: {
                click: () => console.log('Zoom-To-Fit'),
            },
        },
        'view.reset-zoom': {
            group: 'view',
            className: ['fa-binoculars', 'fa'],
            title: 'Reset Zoom',
            action: {
                click: () => console.log('Reset Zoom'),
            },
        },
        'view.tool-separator-view': {
            group: 'view',
            separator: true,
        },
        'lasso-tool': {
            group: 'advanced',
            className: 'bpmn-icon-lasso-tool',
            title: 'Activate the lasso tool',
            action: {
                click: (event: any) => {
                    lassoTool.activateSelection(event);
                },
            },
        },
        'space-tool': {
            group: 'advanced',
            className: 'bpmn-icon-space-tool',
            title: 'Activate the create/remove space tool',
            action: {
                click: (event: any) => {
                    spaceTool.activateSelection(event);
                },
            },
        },
        'create.start-event': createAction(
            'bpmn:StartEvent', 'event', 'bpmn-icon-start-event-none',
        ),
        'create.intermediate-event': createAction(
            'bpmn:IntermediateThrowEvent', 'event', 'bpmn-icon-intermediate-event-none',
        ),
        'create.end-event': createAction(
            'bpmn:EndEvent', 'event', 'bpmn-icon-end-event-none',
        ),
        'tool-separator-event': {
            group: 'event',
            separator: true,
        },
        'create.gateway-none': createAction(
            'bpmn:Gateway', 'gateway', 'bpmn-icon-gateway-none',
        ),
        'tool-separator-gateway': {
            group: 'gateway',
            separator: true,
        },
        'create.user-task': createAction(
            'bpmn:UserTask', 'activity', 'bpmn-icon-user-task', 'UserTask',
        ),
        'create.send-task': createAction(
            'bpmn:SendTask', 'activity', 'bpmn-icon-send-task', 'SendTask',
        ),
        'create.script-task': createAction(
            'bpmn:ScriptTask', 'activity', 'bpmn-icon-service-task', 'ScriptTask',
        ),
        'tool-separator-activity': {
            group: 'advanced',
            separator: true,
        },
        'create.subprocess-expanded': createAction(
            'bpmn:SubProcess', 'advanced', 'bpmn-icon-subprocess-expanded', 'Create expanded SubProcess',
            { isExpanded: true },
        ),
        'create.subprocess-collapsed': createAction(
            'bpmn:SubProcess', 'advanced', 'bpmn-icon-subprocess-collapsed', 'Create collapsed SubProcess',
            { isExpanded: false },
        ),
        'create.participant-expanded': {
            group: 'advanced',
            className: 'bpmn-icon-participant',
            title: 'Create Pool/Participant',
            action: {
                dragstart: createParticipant,
                click: createParticipant,
            },
        },
    });
    console.log('actions now: ', actions);
    return actions;
};
