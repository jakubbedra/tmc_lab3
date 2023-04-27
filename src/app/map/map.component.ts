import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import OlTileLayer from 'ol/layer/Tile';
import OlMap from 'ol/Map';
import Point from 'ol/geom/Point';
import OlXYZ from 'ol/source/XYZ';
import OlView from 'ol/View';
import 'ol/ol.css';
import {OSM} from "ol/source";
import {Feature, View} from "ol";

import Map from 'ol/Map';
import TileLayer from 'ol/layer/Tile';
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  @Output() positionChanged = new EventEmitter<[number, number]>();

  wgs84: string = 'EPSG:4326';
  webMercator: string = 'EPSG:3857';

  tmcMap: OlMap;
  tmcSource: OlXYZ;
  tmcLayer: OlTileLayer<OlXYZ>;
  tmcView: OlView;

  tmcVectorSource: VectorSource;
  tmcVectorLayer: VectorLayer<VectorSource>;

  constructor() {
  }

  ngOnInit(): void {
    const myPoint = new Point([18.3, 54.5]);
    myPoint.transform(this.wgs84, this.webMercator);
    this.tmcSource = new OlXYZ({
      url: 'http://tile.osm.org/{z}/{x}/{y}.png'
    });
    this.tmcLayer = new OlTileLayer({
      source: this.tmcSource
    });
    this.tmcView = new OlView({
      center: myPoint.getCoordinates(),
      zoom: 13,
    });

    this.tmcMap = new OlMap({
      target: 'map',
      layers: [this.tmcLayer],
      view: this.tmcView,
    });

    this.tmcMap.on('click', (event: any) => {
      let coords = this.tmcMap.getCoordinateFromPixel(event.pixel);
      this.addPoint(coords[0], coords[1]);
      this.tmcMap.getView().animate({
        center: coords,
        duration: 1000,
      });
    });
    this.tmcMap.on('pointermove', (event: any) => {
      this.mapPointerMove(event);
    });

    this.tmcVectorSource = new VectorSource();
    this.tmcVectorLayer = new VectorLayer<VectorSource>({
      source: this.tmcVectorSource
    });
    this.tmcMap.addLayer(this.tmcVectorLayer);
  }

  mapPointerMove(event: any) {
    let coords = this.tmcMap.getCoordinateFromPixel(event.pixel);
    this.positionChanged.emit([coords[0], coords[1]]);
  }

  private addPoint(longitude, latitude) {
    let point = new Point([longitude, latitude]);//.transform(this.wgs84, this.webMercator);
    let feature = new Feature({
      geometry: point
    });
    this.tmcVectorSource.addFeature(feature);
  }
}
