import * as d3 from "d3-geo";

export const PROJECTED_WIDTH = 800;
export const PROJECTED_HEIGHT = 900;

/**
 * Creates a Mercator projection centered on India.
 */
export function getIndiaProjection() {
  return d3
    .geoMercator()
    .center([78.9629, 22.5937]) // Center of India
    .scale(1500)
    .translate([PROJECTED_WIDTH / 2, PROJECTED_HEIGHT / 2]);
}

/**
 * Generates an SVG path string for a given GeoJSON feature.
 */
export function getPathGenerator() {
  const projection = getIndiaProjection();
  return d3.geoPath().projection(projection);
}
