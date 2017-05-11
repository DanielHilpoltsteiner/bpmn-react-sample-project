import {Custom} from './custom';
// const inherits = require('inherits');
const inherits = require('inherits');
// import {inherits} from 'inherits';

const PropertiesActivator = require('bpmn-js-properties-panel/lib/PropertiesActivator');

// import PropertiesActivator from 'bpmn-js-properties-panel/lib/PropertiesActivator';

// Require all properties you need from existing providers.
// In this case all available bpmn relevant properties without camunda extensions.
import processProps from 'bpmn-js-properties-panel/lib/provider/bpmn/parts/ProcessProps';
import eventProps from 'bpmn-js-properties-panel/lib/provider/bpmn/parts/EventProps';
import linkProps from 'bpmn-js-properties-panel/lib/provider/bpmn/parts/LinkProps';
import documentationProps from 'bpmn-js-properties-panel/lib/provider/bpmn/parts/DocumentationProps';
import idProps from 'bpmn-js-properties-panel/lib/provider/bpmn/parts/IdProps';
import nameProps from 'bpmn-js-properties-panel/lib/provider/bpmn/parts/NameProps';

import {CustomProps} from './props';

// The general tab contains all bpmn relevant properties.
// The properties are organized in groups.
const createGeneralTabGroups = (element: any, bpmnFactory: any, elementRegistry: any) => {

    const generalGroup = {
        id: 'general',
        label: 'General',
        entries: new Array(),
    };

    idProps(generalGroup, element, elementRegistry);
    nameProps(generalGroup, element);
    processProps(generalGroup, element);

    const detailsGroup = {
        id: 'details',
        label: 'Details',
        entries: new Array(),
    };
    linkProps(detailsGroup, element);
    eventProps(detailsGroup, element, bpmnFactory, elementRegistry);

    const documentationGroup = {
        id: 'documentation',
        label: 'Documentation',
        entries: new Array(),
    };

    documentationProps(documentationGroup, element, bpmnFactory);

    return [
        generalGroup,
        detailsGroup,
        documentationGroup,
    ];
};

const createCustomTabGroups = (element: any ) => { // , elementRegistry?: any) {

    const theGroup = {
        id: Custom.id,
        label: Custom.name,
        entries: new Array(),
    };

    CustomProps(theGroup, element);

    return [
        theGroup,
    ];
};

export function CustomPropertiesProvider(eventBus: any, bpmnFactory: any, elementRegistry: any) {
    PropertiesActivator.call(this, eventBus);

    this.getTabs = (element: any) => {

        const generalTab = {
            id: 'general',
            label: 'General',
            groups: createGeneralTabGroups(element, bpmnFactory, elementRegistry),
        };

        const theTab = {
            id: Custom.id,
            label: Custom.name,
            groups: createCustomTabGroups(element), // , elementRegistry)
        };

        return [
            generalTab,
            theTab,
        ];
    };
}
console.log(CustomPropertiesProvider, PropertiesActivator);
inherits(CustomPropertiesProvider, PropertiesActivator);
