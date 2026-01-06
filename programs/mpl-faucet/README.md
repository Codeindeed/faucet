# MPL Faucet - Program Summary

## Overview

**MPL Faucet** is a gamified Solana devnet faucet program built by Blockiosaurus.
Unlike traditional faucets that simply dispense tokens, MPL Faucet rewards
developers for demonstrating their understanding of Metaplex's protocols through
a series of progressive challenges.

**Program ID:** `FAUCp7gqwz4tv1XpxqBQ3J9p8kVATc2m1bvMvHvhg9A3`

---

## Core Concept

Users earn devnet SOL by burning specially-crafted Metaplex NFTs. Each challenge
requires creating and burning an NFT with specific features, teaching developers
about Metaplex Core's plugin system along the way.

---

## The 5 Challenges

| Challenge | Requirement | Reward | Skill Taught |
| ----------- | ------------- | -------- | -------------- |
| **Challenge 0** | Burn any Metaplex Core asset | **1 SOL** | Basic Core asset creation |
| **Challenge 1** | Burn a Core asset with the **Attributes Plugin** | **2 SOL** | On-chain metadata/traits |
| **Challenge 2** | Burn a Core asset with the **Edition Plugin** | **3 SOL** | Edition/print numbering |
| **Challenge 3** | Burn a Core asset with the **AppData** External Plugin Adapter | **4 SOL** | Custom application data storage |
| **Challenge 4** | Burn a Core asset with the linked **DataSection** via the **LinkedAppData** External Plugin Adapter | **5 SOL** | Advanced linked data patterns |

**Total possible earnings: 15 SOL per wallet**

---

## TODO: New Challenged

- Bubblegum V2 Challenges
- Genesis Challenges

---

## Technical Architecture

### Proof System

- Each completed challenge creates an on-chain "proof" account (PDA)
- Seeds: `["proof", challenge_number, owner_pubkey]`
- Prevents double-claiming rewards for the same challenge

### Treasury

- Program-controlled PDA holds all reward funds
- Address: `H4cUXkHgBzavjvxregchEaZ6CdkynhhR59oiMRxFziEU`
- Secured via PDA signing for transfers

### Metaplex Integrations

- **MPL Core** - For standard NFT burning (Challenges 0-4)

---

## Key Messaging Points

1. **Learn-to-Earn Model** - Get devnet SOL to learn Metaplex development
2. **Progressive Difficulty** - Start simple, advance to complex plugin patterns
3. **Real Skills** - Each challenge teaches production-ready Metaplex patterns
4. **Hands-On** - Forces developers to actually build, not just read docs
5. **Increasing Rewards** - Higher difficulty = higher payouts (1→5 SOL)
6. **On-Chain Verification** - Proof of completion stored permanently

---

## Target Audience

- Solana developers new to Metaplex
- NFT project builders exploring Core features
- Hackathon participants needing devnet SOL
- Educators teaching Metaplex development

---

## Plugin Features Covered

| Plugin Type | Challenge | Description |
|-------------|-----------|-------------|
| `Attributes` | 1 | On-chain traits/properties |
| `Edition` | 2 | Print/edition numbering |
| `AppData` (External) | 3 | Custom app-specific storage |
| `DataSection` + `LinkedAppData` | 4 | Cross-referenced data linking |

---

## Tagline Ideas

- *"Burn to Learn, Rewards to Build"*
- *"The Faucet That Teaches"*
- *"Master Metaplex, Get Rewarded"*
- *"5 Challenges. 15 SOL. Infinite Knowledge."*
