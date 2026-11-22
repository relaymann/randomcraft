# Randomcraft 1.0

**A standalone voxel sandbox about building, exploring, surviving, and making your own stories.**

Randomcraft is a heavily modified, independently developed fork of **Dinglecraft by Dan Dingle**. This fork gives the game its own identity, direction, presentation, and long-term roadmap while retaining appropriate original-work attribution and third-party credits.

> Randomcraft is not affiliated with, endorsed by, or sponsored by Mojang or Microsoft. Minecraft is a trademark of Microsoft. See [LICENSE](LICENSE) and [THIRD_PARTY.md](THIRD_PARTY.md) for the project’s terms and asset credits.

## Play

Randomcraft is designed to be distributed as a self-contained HTML game. The built game bundles its runtime and assets so it can run in a modern browser without a separate game installation.

### Build it locally

- **Node.js 20 or newer**
- No npm packages are required for the build.

```sh
npm run build
```

The playable build is written to `dist/randomcraft_v7.0.html` (the internal build number is retained for save/version compatibility; the public release is Randomcraft 1.0).

To serve the repository locally:

```sh
npm run serve
```

Then open the local address printed by the server. See [docs/BUILD.md](docs/BUILD.md) for build options and details.

## What’s in the game

### Explore a generated voxel world
- Create worlds with a name, custom seed, and Survival or Creative mode.
- Explore a procedurally generated block world with varied terrain, caves, ores, water, and points of interest.
- Discover structures, dungeons, fortresses, shrines, and other places worth exploring.
- Save worlds in the browser, then export and import world files to move or back them up.

### Build, mine, craft, and survive
- Gather resources, mine blocks, craft equipment, and build your own structures.
- Use tools, weapons, armour, furnaces, chests, doors, and other interactive blocks.
- Manage health, hunger, inventory, equipment durability, and the day/night cycle in Survival.
- Switch to Creative for unrestricted building and experimentation.
- Configure world rules when creating a world, with additional controls available in-game.

### Creatures, combat, and challenges
- Encounter passive wildlife, hostile creatures, and powerful bosses.
- Fight with melee weapons, bows, firearms, gadgets, and other equipment.
- Find boss encounters, dungeons, loot, and progression rewards while exploring.
- Face optional world rules and unusual threats that can change how a world plays.

### Dimensions and discoveries
- Travel beyond the Overworld into the **Nether** and the **Aether**.
- Search dimension-specific structures, loot, gadgets, and bosses.
- Use portals and exploration tools to find your way between distant discoveries.

### Vehicles, gadgets, and creative toys
- Use vehicles and rideable equipment to travel in different ways.
- Discover gadgets such as a jetpack, grappling anchor, hang glider, loot magnet, climbing claws, blink pearl, and more.
- Experiment with fishing, farming, collectibles, decorative items, and playful contraptions.

### Optional visual upgrades
- Choose between the original visual style and the optional **Hyperreal** texture/lighting experience.
- Hyperreal adds enhanced materials, lighting, shadows, atmosphere, and detailed creature appearances.
- Visual quality options let players balance presentation and performance. Hyperreal requires WebGL 2; the original style remains available.

### Optional AI players
- A local AI brain service can support three named AI players with individual personalities, goals, memories, and relationships.
- AI-player features require the separate brain service and a user-supplied Anthropic API key. Without the service, the game can use its simpler local behavior.
- See the `brain/` directory and its README for setup and privacy details.

## Controls and help

The in-game **Controls** screen lists the current controls. Key bindings can vary by context and equipment, so use the in-game help for the authoritative list. The pause menu also contains settings, world options, and other tools.

## Project goals

Randomcraft is intended to grow into a cohesive sandbox with its own identity—not just a collection of unrelated additions. The priorities are:

1. **A richer world:** more distinctive biomes, caves, structures, secrets, and environmental variety.
2. **Meaningful exploration:** discoveries, loot, dungeons, dimensions, and encounters that reward curiosity.
3. **Deeper survival and building:** useful crafting paths, interactive blocks, world management, and more reasons to create a home.
4. **Believable creatures:** improved models, animation, sound, combat, and behavior for both ordinary mobs and major threats.
5. **Polish and atmosphere:** consistent art direction, responsive controls, readable interfaces, sound design, and performance.
6. **A stable game:** reliable saves, reproducible builds, compatibility checks, and regression tests before major releases.
7. **Player creativity:** keep room for experimentation, unusual tools, vehicles, construction, and emergent stories.

These are development goals, not a promise that every planned feature is already implemented. The project roadmap and current implementation notes live in `docs/`.

## Development

Useful commands:

| Command | Purpose |
|---|---|
| `npm run build` | Build the standalone HTML game |
| `npm test` | Run the default test gate |
| `npm run test:quick` | Run the quick test tier |
| `npm run test:brain` | Run AI brain self-tests |
| `npm run serve` | Serve the repository locally |
| `npm run gate` | Run the full validation gate |
| `npm run changelog` | Regenerate the changelog from patch-note data |

Read [docs/BUILD.md](docs/BUILD.md), [docs/TESTING.md](docs/TESTING.md), and [CONTRIBUTING.md](CONTRIBUTING.md) before making substantial changes. Preserve the save format, build ordering, asset manifests, and existing tests when adding features.

## Credits and licensing

- **Original project:** Dinglecraft by Dan Dingle. Randomcraft is a fork and substantial modification; original attribution and applicable licence terms are retained.
- **Third-party code, models, and assets:** documented in [THIRD_PARTY.md](THIRD_PARTY.md) and the in-game Credits screen. Their original licences still apply.
- **Project terms:** see [LICENSE](LICENSE). Do not assume that source visibility grants permission to redistribute the game or its assets.

Contributions should respect all original and third-party licences, keep attribution intact, and include tests for behavior changes.
