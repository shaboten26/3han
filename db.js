// jsDelivr などの CDN から直接 import
import { Dexie } from "https://unpkg.com/dexie/dist/modern/dexie.mjs";
export const db = new Dexie("3han");
db.version(1).stores({
	money: "++id, purpose, place, price, date, *tag",
});
