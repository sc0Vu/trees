const sparseTree = require('./sparseTree');
const elems = {
    1: '5fe7f977e71dba2ea1a68e21057beebb9be2ac30c6410aa38d4f3fbe41dcffd2',
    2: 'f2ee15ea639b73fa3db9b34a245bdfa015c260c598b211bf05a1ecc4b3e3b4f2',
    3: '69c322e3248a5dfc29d73c5b0553b0185a35cd5bb6386747517ef7e53b15e287',
    4: 'f343681465b9efe82c933c3e8748c70cb8aa06539c361de20f72eac04e766393',
    5: 'dbb8d0f4c497851a5043c6363657698cb1387682cac2f786c731f8936109d795',
    6: 'd0591206d9e81e07f4defc5327957173572bcd1bca7838caa7be39b0c12b1873',
    7: 'ee2a4bc7db81da2b7164e56b3649b1e2a09c58c455b15dabddd9146c7582cebc',
    8: 'd33e25809fcaa2b6900567812852539da8559dc8b76a7ce3fc5ddd77e8d19a69',
};
let tree = new sparseTree(3, elems, false);
let total = Object.keys(elems).length;

console.log(tree);
for (let i=0; i<=total; i++) {
    console.log(`Proof of ${i}: ${tree.createMerkleProof(i).substring(2)} ${tree.createMerkleProof(i).substring(2).length}`);
}
