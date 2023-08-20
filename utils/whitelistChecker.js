import { MerkleTree } from 'merkletreejs';
import { keccak256 } from 'ethers';
import { whitelistedAddresses } from "@/data/whitelists";

const leafNodes = whitelistedAddresses.map(address => keccak256(address));
export const merkleTree = new MerkleTree(leafNodes, keccak256);

export const checkValidity = (address) => {
    const root = merkleTree.getRoot().toString("hex");
    const leaf = keccak256(address);
    const proof = merkleTree.getProof(leaf);
    return (merkleTree.verify(proof, leaf, root));
}