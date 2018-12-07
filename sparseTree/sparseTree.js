// Original code from: https://github.com/loomnetwork/plasma-cash/blob/master/server/test/SparseMerkleTree.js
const utils = require('ethereumjs-util');
const BN = require('bn.js');

module.exports = class SparseMerkleTree {
    constructor(depth, leaves, hashLeaves=false) {
        if (hashLeaves) {
            Object.keys(leaves).forEach((key) => {
                leaves[key] = this.sha3(leaves[key]);
            });
        }
        this.depth = depth;
        // Initialize defaults
        this.defaultNodes = this.setdefaultNodes(depth);
        // Leaves must be a dictionary with key as the leaf's slot and value the leaf's hash
        this.leaves = leaves;
        this.big1 = new BN(1);
        this.big2 = new BN(2);

        if (leaves && Object.keys(leaves).length !== 0) {
            this.tree = this.createTree(this.leaves, this.depth, this.defaultNodes);
            this.root = this.tree[this.depth]['0'];
        } else {
            this.tree = [];
            this.root = this.defaultNodes[this.depth];
        }
    }

    setdefaultNodes(depth) {
        let defaultNodes = new Array(depth + 1);
        defaultNodes[0] = this.sha3(0).toString('hex');
        for (let i = 1; i < depth + 1; i++) {
            defaultNodes[i] = this.sha3(defaultNodes[i-1], defaultNodes[i-1]);
        }
        return defaultNodes;
    }

    createTree(orderedLeaves, depth, defaultNodes) {
        let tree = [orderedLeaves];
        let treeLevel = orderedLeaves;

        let nextLevel = {};
        let halfIndex;
        let value;

        for (let level = 0; level < depth; level++) {
            nextLevel = {};
            for(let index in treeLevel) {
                index = new BN(index);
                halfIndex = index.div(this.big2).toString();
                value = treeLevel[index];
                if (index.mod(this.big2).isZero()) {
                    let coIndex = index.add(this.big1).toString();
                    nextLevel[halfIndex] = this.sha3(value, treeLevel[coIndex] || defaultNodes[level]);
                } else {
                    let coIndex = index.sub(this.big1).toString();
                    if (treeLevel[coIndex] === undefined) {
                        console.log(level, index.toString(10), value, defaultNodes[level])
                        nextLevel[halfIndex] = this.sha3(defaultNodes[level], value);
                    }
                }
            }
            treeLevel = nextLevel;
            tree.push(treeLevel);
        }
        return tree;
    }

    createMerkleProof(uid) {
        let index = new BN(uid);
        let proof = [];
        let siblingIndex;
        let siblingHash;
        for (let level=0; level < this.depth; level++) {
            siblingIndex = index.mod(this.big2).isZero() ? index.add(this.big1) : index.sub(this.big1);
            index = index.div(this.big2);

            siblingHash = this.tree[level][siblingIndex.toString()];
            if (siblingHash) {
                proof.push(siblingHash.toString().replace('0x', ''));
            }
        }
        return proof;
    }

    proof (leaf, proof) {
        if (typeof leaf !== 'string' || leaf.length !== 64) {
            throw new Error('Please pass correct leaf');
        }
        if (proof.length <= 0) {
            throw new Error('Please pass correct proof');
        }
        let root = this.root;
        let merkleProof = this.sha3(leaf, proof[0]);
        for (let i=1; i<proof.length; i++) {
            merkleProof = this.sha3(merkleProof, proof[i]);
        }
        return true;
    }

    sha3 () {
        let args = Array.prototype.slice.call(arguments);
        let hash = '';
        if (args.length == 2) {
            for (let i=0; i<args.length; i+=2) {
                hash = utils.keccak256(utils.keccak256(args[i]).toString('hex') + utils.keccak256(args[i + 1]).toString('hex')).toString('hex');
            }
        } else if (args.length === 1) {
            hash = utils.keccak256(args[0]).toString('hex');
        } else {
            throw new Error('Please pass data to sha3');
        }
        return hash;
    }
}