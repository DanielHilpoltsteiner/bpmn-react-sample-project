import * as React from 'react';
const style = require('./style.css');
// FIXME
// import { Observable, Subject } from 'rxjs';
import { Subject } from 'rxjs';
import { Link } from './Link';
import { PaletteProvider } from './palette';
import { CustomPropertiesProvider } from './props-provider';

const BPMNModeler = require('bpmn-js/lib/Modeler.js');

const customPaletteModule = {
  paletteProvider: ['type', PaletteProvider],
};
const customPropertiesProviderModule = {
  __init__: ['propertiesProvider'],
  propertiesProvider: ['type', CustomPropertiesProvider],
};

const containerRef = '#js-canvas';
const propsPanelRef = '#js-properties-panel';

class Modeler extends React.Component<any, any> {
  private modeler: any;
  private url: string;
  private urls: Link[];
  private extraPaletteEntries: any;
  private commandQueue: Subject<any>;

  private createModeler() {
    console.log('Creating modeler, injecting extraPaletteEntries: ', this.extraPaletteEntries);
    this.modeler = new BPMNModeler({
      container: containerRef,
      propertiesPanel: {
        parent: propsPanelRef,
      },
      additionalModules: [
        { extraPaletteEntries: ['type', () => this.extraPaletteEntries] },
        { commandQueue: ['type', () => this.commandQueue] },
        // propertiesPanelModule,
        // propertiesProviderModule,
        customPropertiesProviderModule,
        customPaletteModule,
      ],
      // moddleExtensions: {
      //     ne: CustomModdle
      // },
    });
    // Start with an empty diagram:npm
    this.url = this.urls[0].href;
    // this.loadBPMN();
  }
  // loadBPMN() {
  //   // console.log('load', this.url, this.store);
  //   let canvas = this.modeler.get('canvas');
  //   this.http.get(this.url)
  //       .map(response => response.text())
  //       .map(data => this.modeler.importXML(data, this.handleError))
  //       .subscribe(x => x ? this.handleError(x) : this.postLoad())
  //   ;
  // }

 protected componentWillMount() {
    this.createModeler();
    const canvas = this.modeler.get('canvas');
    canvas.zoom('fit-viewport');
  }

  protected handleError(err: any) {
    if (err) {
      console.log('error rendering', err);
    }
  }

  public render() {
    return (
      <div className={style.About}>
        <h4>Modeler</h4>
      </div>
    );
  }
}

export { Modeler }
