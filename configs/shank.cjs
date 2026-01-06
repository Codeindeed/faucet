const path = require("path");
const { generateIdl } = require("@metaplex-foundation/shank-js");

const idlDir = path.join(__dirname, "..", "idls");
const binaryInstallDir = path.join(__dirname, "..", ".crates");
const programDir = path.join(__dirname, "..", "programs");

generateIdl({
  generator: "shank",
  programName: "mpl_faucet_program",
  programId: "FAUCp7gqwz4tv1XpxqBQ3J9p8kVATc2m1bvMvHvhg9A3",
  idlDir,
  idlName: "mpl_faucet",
  binaryInstallDir,
  programDir: path.join(programDir, "mpl-faucet"),
});
