const path = require("path");
const k = require("@metaplex-foundation/kinobi");

// Paths.
const clientDir = path.join(__dirname, "..", "clients");
const idlDir = path.join(__dirname, "..", "idls");

// Instantiate Kinobi.
const kinobi = k.createFromIdls([path.join(idlDir, "mpl_faucet.json")]);

// Update programs.
kinobi.update(
  new k.updateProgramsVisitor({
    mplFaucetProgram: { name: "mplFaucet" },
  })
);

// Update accounts.
kinobi.update(
  new k.updateAccountsVisitor({
    proof: {
      seeds: [
        k.constantPdaSeedNodeFromString("proof"),
        k.variablePdaSeedNode("challenge", k.numberTypeNode('u8', 'le')),
        k.variablePdaSeedNode("owner", k.publicKeyTypeNode()),
      ],
    },
  })
);

const challengeAccounts = (challenge) => {return {
  proof: {
    defaultValue: k.pdaValueNode("proof", [k.pdaSeedValueNode("challenge", k.numberValueNode(challenge))]),
  },
  treasury: {
    defaultValue: k.pdaValueNode(k.pdaLinkNode("treasury", "hooked")),
  },
  mplCoreProgram: {
    defaultValue: k.publicKeyValueNode("CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d"),
  },
}}

// Update instructions.
kinobi.update(
  new k.updateInstructionsVisitor({
    challenge0: {
      accounts: challengeAccounts(0)
    },
    challenge1: {
      accounts: challengeAccounts(1)
    },
    challenge2: {
      accounts: challengeAccounts(2)
    },
    challenge3: {
      accounts: challengeAccounts(3)
    },
    challenge4: {
      accounts: challengeAccounts(4)
    },
  })
);

// Set ShankAccount discriminator.
// const key = (name) => ({ field: "key", value: k.enumValueNode("Key", name) });
// kinobi.update(
//   new k.setAccountDiscriminatorFromFieldVisitor({
//     myAccount: key("MyAccount"),
//     myPdaAccount: key("MyPdaAccount"),
//   })
// );

// Render JavaScript.
const jsDir = path.join(clientDir, "js", "src", "generated");
const prettier = require(path.join(clientDir, "js", ".prettierrc.json"));
kinobi.accept(new k.renderJavaScriptVisitor(jsDir, { prettier }));

// Render Rust.
const crateDir = path.join(clientDir, "rust");
const rustDir = path.join(clientDir, "rust", "src", "generated");
kinobi.accept(
  new k.renderRustVisitor(rustDir, {
    formatCode: true,
    crateFolder: crateDir,
  })
);
