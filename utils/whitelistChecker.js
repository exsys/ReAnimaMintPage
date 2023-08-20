import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import { whitelistedAddresses } from "@/data/whitelists";
//import fs from "fs";

export const merkleTree = StandardMerkleTree.of(whitelistedAddresses, ["address"]);

/** If you want to load a .json file instead */
//const merkleTree = StandardMerkleTree.load(JSON.parse(fs.readFileSync("tree.json", "utf8")));