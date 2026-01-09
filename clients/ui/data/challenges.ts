import { CodingChallenge, ChallengeInteraction } from "../types/challenge";


export interface Challenge {
  index: number;
  title: string;
  description: string;
  reward: string;
  steps: {
    title: string;
    description: string;
    code?: string;
    interaction?: ChallengeInteraction;
    codingChallenge?: CodingChallenge;
  }[];
}

export const CHALLENGES: Challenge[] = [
  {
    index: 0,
    title: "The Beginner",
    description: "Burn any MPL Core asset to complete this challenge. This is your first step into understanding the Core asset lifecycle.",
    reward: "1 SOL",
    steps: [
      {
        title: "Learn",
        description: "In this challenge, you will create a basic MPL Core asset and burn it. The Faucet program will verify the burn and reward you with SOL.",
        code: `import { createV1, generateSigner } from "@metaplex-foundation/mpl-core";

// Create a basic Core asset
const asset = generateSigner(umi);
await createV1(umi, {
  asset,
  name: "My First Asset",
  uri: "https://example.com/asset.json",
}).sendAndConfirm(umi);`,
        interaction: {
          question: "Which function generates a new Keypair for the asset?",
          options: ["createV1", "generateSigner", "sendAndConfirm", "umi"],
          answer: "generateSigner",
          successMessage: "Correct! generateSigner() creates a fresh Keypair for your new asset."
        }
      },
      {
        title: "Code",
        description: "Let's put it into practice. Complete the code below to generate a new signer for your asset.",
        codingChallenge: {
          initialCode: `import { generateSigner, createV1 } from "@metaplex-foundation/mpl-core";

// Create a basic Core asset
const asset = // TODO: Call generateSigner(umi) here

await createV1(umi, {
  asset,
  name: "My First Asset",
  uri: "https://example.com/asset.json",
}).sendAndConfirm(umi);`,
          requiredString: "generateSigner(umi)",
          placeholder: "const asset = generateSigner(umi);",
          hint: "You need to assign 'generateSigner(umi)' to the asset variable."
        }
      },

      {
        title: "Burn",
        description: "Now burn the asset to claim your reward. The Faucet program will verify the burn and send you 1 SOL.",
      },
      { title: "Complete", description: "" },
    ],
  },
  {
    index: 1,
    title: "Attribute Master",
    description: "Burn an asset with the Attributes plugin. Learn how to attach on-chain metadata to your assets.",
    reward: "2 SOL",
    steps: [
      {
        title: "Learn",
        description: "The Attributes plugin allows you to store key-value pairs directly on-chain. This is useful for game stats, certifications, or any structured data.",
        code: `import { create, generateSigner } from "@metaplex-foundation/mpl-core";

// Create an asset with Attributes plugin
const asset = generateSigner(umi);
await create(umi, {
  asset,
  name: "Attributes Asset",
  uri: "https://example.com/asset.json",
  plugins: [
    { type: "Attributes", attributeList: [] }
  ],
}).sendAndConfirm(umi);`,
        interaction: {
          question: "Where do we define the plugins for the asset?",
          options: ["In the plugins array", "In the uri field", "In the name field", "It is automatic"],
          answer: "In the plugins array",
          successMessage: "Spot on! The plugins array allows you to attach multiple plugins to an asset during creation."
        }
      },
      {
        title: "Code",
        description: "Complete the code to attach the Attributes plugin.",
        codingChallenge: {
          initialCode: `import { create, generateSigner } from "@metaplex-foundation/mpl-core";

const asset = generateSigner(umi);
await create(umi, {
  asset,
  name: "Attributes Asset",
  uri: "...",
  plugins: [
    { 
       // TODO: Add Attributes plugin here. 
       // Hint: type: "Attributes", attributeList: [] 
    }
  ],
}).sendAndConfirm(umi);`,
          requiredString: 'type: "Attributes"',
          placeholder: 'type: "Attributes", attributeList: []',
          hint: 'Add the plugin object: { type: "Attributes", attributeList: [] }'
        }
      },

      {
        title: "Burn",
        description: "Burn the asset. The Faucet program will verify the Attributes plugin exists before rewarding you.",
      },
      { title: "Complete", description: "" },
    ],
  },
  {
    index: 2,
    title: "Limited Edition",
    description: "Burn an asset with the Edition plugin. Understand how numbered editions work with Collections.",
    reward: "3 SOL",
    steps: [
      {
        title: "Learn",
        description: "The Edition plugin creates numbered copies of assets. It requires a Collection with the MasterEdition plugin first.",
        code: `import { createCollection, create, fetchCollection } from "@metaplex-foundation/mpl-core";

// 1. Create a Collection with MasterEdition
const collection = generateSigner(umi);
await createCollection(umi, {
  collection,
  name: "Edition Collection",
  uri: "...",
  plugins: [{ type: "MasterEdition" }],
}).sendAndConfirm(umi);

// 2. Create an Edition asset in that collection
const asset = generateSigner(umi);
await create(umi, {
  asset,
  collection: await fetchCollection(umi, collection.publicKey),
  name: "Edition #1",
  uri: "...",
  plugins: [{ type: "Edition", number: 1 }],
}).sendAndConfirm(umi);`,
        interaction: {
          question: "What plugin must the Collection have to support Editions?",
          options: ["Edition", "MasterEdition", "Attributes", "None"],
          answer: "MasterEdition",
          successMessage: "Correct! The parent Collection must have the MasterEdition plugin to enable numbered Editions."
        }
      },
      {
        title: "Code",
        description: "Enable editions by adding the MasterEdition plugin to the collection.",
        codingChallenge: {
          initialCode: `import { createCollection } from "@metaplex-foundation/mpl-core";

await createCollection(umi, {
  collection,
  name: "Edition Collection",
  plugins: [
     // TODO: Insert MasterEdition plugin here
     // Hint: { type: "MasterEdition" }
  ],
}).sendAndConfirm(umi);`,
          requiredString: 'type: "MasterEdition"',
          placeholder: '{ type: "MasterEdition" }',
          hint: 'Plugins array needs: { type: "MasterEdition" }'
        }
      },

      {
        title: "Burn",
        description: "Burn the Edition asset. The Faucet verifies the Edition plugin before rewarding.",
      },
      { title: "Complete", description: "" },
    ],
  },
  {
    index: 3,
    title: "App Data Pioneer",
    description: "Burn an asset with the AppData external plugin. Explore external plugin adapters for app-specific data.",
    reward: "4 SOL",
    steps: [
      {
        title: "Learn",
        description: "AppData is an external plugin adapter that lets apps store custom binary data on assets. The Update Authority controls access.",
        code: `import { create, ExternalPluginAdapterSchema } from "@metaplex-foundation/mpl-core";

// Create asset with AppData external plugin
const asset = generateSigner(umi);
await create(umi, {
  asset,
  name: "AppData Asset",
  uri: "...",
  plugins: [
    {
      type: "AppData",
      schema: ExternalPluginAdapterSchema.Binary,
      dataAuthority: { type: "UpdateAuthority" },
    },
  ],
}).sendAndConfirm(umi);`,
        interaction: {
          question: "Who controls the data in this AppData plugin?",
          options: ["The System Program", "The UpdateAuthority", "The Owner", "Anyone"],
          answer: "The UpdateAuthority",
          successMessage: "Correct! We set dataAuthority to { type: 'UpdateAuthority' }, giving control to the asset creator/authority."
        }
      },
      {
        title: "Code",
        description: "Configure the data authority for the AppData plugin.",
        codingChallenge: {
          initialCode: `import { create, ExternalPluginAdapterSchema } from "@metaplex-foundation/mpl-core";

await create(umi, {
  asset,
  name: "AppData Asset",
  plugins: [{
    type: "AppData",
    schema: ExternalPluginAdapterSchema.Binary,
    dataAuthority: { 
       // TODO: Set to UpdateAuthority 
    },
  }],
}).sendAndConfirm(umi);`,
          requiredString: 'type: "UpdateAuthority"',
          placeholder: 'type: "UpdateAuthority"',
          hint: 'Set dataAuthority to: { type: "UpdateAuthority" }'
        }
      },

      {
        title: "Burn",
        description: "Burn to claim. The program verifies the AppData plugin with UpdateAuthority.",
      },
      { title: "Complete", description: "" },
    ],
  },
  {
    index: 4,
    title: "Linked Data Linker",
    description: "Burn an asset with LinkedAppData. Master collection-level data linking and the writeData instruction.",
    reward: "5 SOL",
    steps: [
      {
        title: "Learn",
        description: "LinkedAppData lives on the Collection and links to assets. After creating, you must call writeData to initialize the link.",
        code: `import { createCollection, create, writeData } from "@metaplex-foundation/mpl-core";

// 1. Create Collection with LinkedAppData
const collection = generateSigner(umi);
await createCollection(umi, {
  collection,
  name: "LinkedAppData Collection",
  plugins: [{
    type: "LinkedAppData",
    schema: ExternalPluginAdapterSchema.Binary,
    dataAuthority: { type: "UpdateAuthority" },
  }],
}).sendAndConfirm(umi);

// 2. Create asset in collection
const asset = generateSigner(umi);
await create(umi, {
  asset,
  collection: await fetchCollection(umi, collection.publicKey),
  name: "Linked Asset",
}).sendAndConfirm(umi);

// 3. Initialize the link with writeData
await writeData(umi, {
  asset: asset.publicKey,
  collection: collection.publicKey,
  key: { type: "LinkedAppData", dataAuthority: { type: "UpdateAuthority" } },
  data: new Uint8Array([1]),
}).sendAndConfirm(umi);`,
        interaction: {
          question: "Which instruction initializes the data link?",
          options: ["create", "writeData", "createCollection", "update"],
          answer: "writeData",
          successMessage: "Correct! writeData is used to write/initialize the data for the external plugin."
        }
      },
      {
         title: "Code",
         description: "Initialize the LinkedAppData using the writeData instruction.",
         codingChallenge: {
           initialCode: `import { writeData } from "@metaplex-foundation/mpl-core";

// Initialize the link
 // TODO: Call writeData(umi, { ... })
 `,
  requiredString: `await writeData(umi, {
  asset: asset.publicKey,
  collection: collection.publicKey,
  key: { type: "LinkedAppData", dataAuthority: { type: "UpdateAuthority" } },
  data: new Uint8Array([1]),
}).sendAndConfirm(umi);`,
           placeholder: 'writeData(umi, {',
           hint: "You must call the 'writeData' function from the SDK."
         }
       },
 
      {
        title: "Burn",
        description: "Burn to complete the most advanced challenge!",
      },
      { title: "Complete", description: "" },
    ],
  },
];
