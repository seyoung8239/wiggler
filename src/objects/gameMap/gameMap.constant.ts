export const MAP_TYPE = {
	EMPTY: "EMPTY",
	GROUND: "GROUND",
	BLOCK: "BLOCK",
};
export type MapType = (typeof MAP_TYPE)[keyof typeof MAP_TYPE];
