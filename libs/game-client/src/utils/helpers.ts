import { Point, mulVector } from "@dungeon-crawler/shared";
import { CELL_SIZE } from "./constants";

export const toScreenCoords = (point: Point) => mulVector(point, CELL_SIZE);

export const trimExtension = (str: string) => str.replace(/\.[^/.]+$/, "");
