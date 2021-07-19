import { Game } from "@game";
import { ItemFilter, ItemState } from "@items";
import { Task, TaskState } from "@tasks";
import { Serializable } from "frigid";
import { RESOURCE_COLLECTION_TASK } from "./world/ResourceCollectionTask.js";

const explorationConstant = 0.001; // km ish

export class World extends Serializable {
  places: PlaceState[] = [];

  distanceExplored: number; // km ish

  home: PlaceState = null;

  static serializationDependencies() {
    return [PlaceState];
  }

  explore() {
    for(const [id, place] of places) {
      const threshold = (explorationConstant * place.frequency);
      if(Math.random() <= threshold) {
        const angle = Math.random() * Math.PI * 2
        const x = Math.sin(angle) * this.distanceExplored;
        const y = Math.cos(angle) * this.distanceExplored;
        const newPlaceState = new PlaceState(
          place,
          Math.round(x * 1000),
          Math.round(y * 1000)
        );
        if(this.home === null) {
          this.home = newPlaceState;
        }
        this.places.push(newPlaceState);
      }
    }
    this.distanceExplored += explorationConstant;
  }

  ctor() {
    this.distanceExplored ??= 0;
    this.home ??= null;
    this.places ??= [];
    if(this.home === null) {
      let hasHabitablePlacesLoaded = false;
      for(const [id, place] of places) {
        if(place.habitable) hasHabitablePlacesLoaded = true;
        break;
      }
      if(hasHabitablePlacesLoaded) {
        while(this.home === null) {
          this.explore();
        }
      } else {
        throw new Error('No habitable places loaded\n'
          + 'unable to create home!')
      }
    }
  }
}

const places: Map<string, Place> = new Map();

export class PlaceState extends Serializable {
  resources: ResourceNode[];
  placeId: string;
  x: number;
  y: number;
  
  constructor(place: Place, x: number, y: number) {
    super();
    this.placeId = place.id;
    this.resources = this.place.populate();
    for(const node of this.resources) node.setPlace(this);
    this.x = x;
    this.y = y;
  }

  get place() {
    return places.get(this.placeId);
  }

  static serializationDependencies() {
    return [ResourceNode];
  }
}

export class Place {
  name: string;
  id: string;
  frequency: number;
  habitable: boolean;
  populate: () => ResourceNode[];

  setName(name: string) {
    this.name = name;
    return this;
  }

  setId(id: string) {
    this.id = id;
    places.set(this.id, this);
    return this;
  }

  populateResources(fn: () => ResourceNode[]) {
    this.populate = fn;
    return this;
  }

  setFrequency(frequency: number) {
    this.frequency = frequency;
    return this;
  }

  setHabitable(habitable: boolean) {
    this.habitable = habitable;
    return this;
  }
}

export class ResourceNode extends Serializable {
  resources: ItemState<unknown>;
  place: PlaceState;

  constructor(resources: ItemState<unknown>) {
    // collectionRequirements: ItemFilter[] = []
    super();
    this.resources = resources;
  }
  
  setPlace(place: PlaceState) {
    this.place = place;
  }

  request(qty: number) {
    Game.current.board.addTask(
      new TaskState(RESOURCE_COLLECTION_TASK, {
        qty,
        node: this
      })
    );
  }
}