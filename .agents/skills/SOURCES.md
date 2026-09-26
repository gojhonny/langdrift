# Skill sources

Upstream repository: `https://github.com/mattpocock/skills`.
Pinned commit: `c55ee46073ed923f86ce59a5eb3b6d895095d1b7`.

Invocation metadata was copied from the pinned files. This install did not add `disable-model-invocation` or `allow_implicit_invocation` to any file that lacked it. Where upstream `agents/openai.yaml` already sets `allow_implicit_invocation: false`, that field remains because it was upstream, not because this migration invented it.

`domain-modeling` keeps its upstream description, including the words `CONTEXT.md`. That description is invocation text. The skill body is the local path contract.

`grill-me` was already in the tree and is not part of this pin. It was not modified.

Compare a local file with upstream:

```sh
git clone https://github.com/mattpocock/skills.git /tmp/skills-pin-repo
git -C /tmp/skills-pin-repo checkout c55ee46073ed923f86ce59a5eb3b6d895095d1b7
diff -u /tmp/skills-pin-repo/skills/<bucket>/<name>/<file> .agents/skills/<name>/<file>
```

Checksums are SHA-256 of file bytes. This file does not checksum itself.

## grill-with-docs

- Upstream path: `skills/engineering/grill-with-docs/`
- Local path: `.agents/skills/grill-with-docs/`

- Intentional additions: none.
- Intentional removals: none.

| File | Upstream SHA-256 | Local SHA-256 | Adaptation |
| --- | --- | --- | --- |
| `SKILL.md` | `7de372c13488f1ee96cc11cd8907b56b6809cc93eef776eeddd37de6b6cbe3fe` | `7de372c13488f1ee96cc11cd8907b56b6809cc93eef776eeddd37de6b6cbe3fe` | unchanged |
| `agents/openai.yaml` | `94cd0ab161fb468a836349f5ed482ba58ce8e709a05c57ce533d739dbd35cca9` | `94cd0ab161fb468a836349f5ed482ba58ce8e709a05c57ce533d739dbd35cca9` | unchanged |

## to-spec

- Upstream path: `skills/engineering/to-spec/`
- Local path: `.agents/skills/to-spec/`

- Intentional additions: none.
- Intentional removals: none.

| File | Upstream SHA-256 | Local SHA-256 | Adaptation |
| --- | --- | --- | --- |
| `SKILL.md` | `43ad9cf318e5e7d3d1fa360253a37021796dc87a0c2e595ad262661a10f85088` | `025ff6852c3d3d78c0ff61ee2d07de733715cc13be42c2d9e58f0fc5e6d99852` | Publish to .artifacts/specs and treat Status as triage. Point at .agents/workflow/README.md instead of setup-matt-pocock-skills. |
| `agents/openai.yaml` | `1c5b4d1e3d8e52287ef19cc2742fdbbfae1914ac75d33af3e4c8174f08cc55bb` | `1c5b4d1e3d8e52287ef19cc2742fdbbfae1914ac75d33af3e4c8174f08cc55bb` | unchanged |

## to-tickets

- Upstream path: `skills/engineering/to-tickets/`
- Local path: `.agents/skills/to-tickets/`

- Intentional additions: none.
- Intentional removals: none.

| File | Upstream SHA-256 | Local SHA-256 | Adaptation |
| --- | --- | --- | --- |
| `SKILL.md` | `5c9fba69845c2519b9b35b9af42ae5142c21f8ca15ac2123dc2722002c8058ae` | `88688c130412b70c5c62c7f2f18ef6a14d5479c760027af9836b6d1f9b6625a8` | Publish one local ticket under .artifacts/tickets. Keep Status as triage. Field meanings are in .agents/workflow/README.md and transitions in .agents/workflow/CYCLE.md. Do not open a remote issue. |
| `agents/openai.yaml` | `21bc6215fffcd7614e9f772bb1760e87cc5fc7dcc707e7d282bc9414267a6090` | `21bc6215fffcd7614e9f772bb1760e87cc5fc7dcc707e7d282bc9414267a6090` | unchanged |

## implement

- Upstream path: `skills/engineering/implement/`
- Local path: `.agents/skills/implement/`

- Intentional additions: none.
- Intentional removals: none.

| File | Upstream SHA-256 | Local SHA-256 | Adaptation |
| --- | --- | --- | --- |
| `SKILL.md` | `6d3fd9e83b8f36e5213854779db49b256a457a7ebb4a503e53fa7dcff696adc3` | `55f22b2a32504cbb9cc6fb2a85bfa1a59d0460625872a92cf6e0974f642f35b1` | Completion is the change plus evidence defined in .agents/workflow/README.md. Remove the automatic commit. |
| `agents/openai.yaml` | `8970a8596ade0c28ab427f41a4ea242d6bdf6186c59ebf55e1238dbecaab79dc` | `8970a8596ade0c28ab427f41a4ea242d6bdf6186c59ebf55e1238dbecaab79dc` | unchanged |

## tdd

- Upstream path: `skills/engineering/tdd/`
- Local path: `.agents/skills/tdd/`

- Intentional additions: none.
- Intentional removals: none.

| File | Upstream SHA-256 | Local SHA-256 | Adaptation |
| --- | --- | --- | --- |
| `SKILL.md` | `cb01f66bebfaa25fa1f88e6b7e769cd9fd9f35b1120b8563749820738814c927` | `d28e5ba0022ad76bbb1a8ec8ef1310495418d11cd616994d1caa3e083c33d636` | Read the vocabulary region of .agents/context.md and ADRs in .artifacts/adrs/. |
| `agents/openai.yaml` | `ea6f01cf1b8c06a4b0f5b649d74b1b8ce8685e72af1b38d70d877693e092af0b` | `ea6f01cf1b8c06a4b0f5b649d74b1b8ce8685e72af1b38d70d877693e092af0b` | unchanged |
| `mocking.md` | `3ceb807fdf4a47d6a93d4d9a891e5ba6d362a6247bd08adc451feebfc17361ef` | `3ceb807fdf4a47d6a93d4d9a891e5ba6d362a6247bd08adc451feebfc17361ef` | unchanged |
| `tests.md` | `859f9e592c188fda4fc7277dd180e4ce9c7a2e13f6efe1f6f29eccc9d28c106a` | `859f9e592c188fda4fc7277dd180e4ce9c7a2e13f6efe1f6f29eccc9d28c106a` | unchanged |

## code-review

- Upstream path: `skills/engineering/code-review/`
- Local path: `.agents/skills/code-review/`

- Intentional additions: none.
- Intentional removals: none.

| File | Upstream SHA-256 | Local SHA-256 | Adaptation |
| --- | --- | --- | --- |
| `SKILL.md` | `47f4e52c21694def9c7c11cbfbf891ca35eac7a93e395797515be3c8a409ae50` | `94d6f590c3b319a3d576ae79bb9f55371513c975f73dc4bbecbcb6900c9e67d2` | Review commits, staged work, unstaged work, and relevant new files. Pin the snapshot. Do not claim parallel sub-agents unless they ran. Specs live in .artifacts/specs/. The local tracker is .agents/workflow/README.md. |
| `agents/openai.yaml` | `8229ca854e11dc8e6aef2131ee03f31fb1561cf905fab9ccc325180cf3331352` | `8229ca854e11dc8e6aef2131ee03f31fb1561cf905fab9ccc325180cf3331352` | unchanged |

## domain-modeling

- Upstream path: `skills/engineering/domain-modeling/`
- Local path: `.agents/skills/domain-modeling/`

- Intentional additions: none.
- Intentional removals: none.

| File | Upstream SHA-256 | Local SHA-256 | Adaptation |
| --- | --- | --- | --- |
| `ADR-FORMAT.md` | `944c92aa790e8fbdc9199640b170979abb8a34ba8d0fe18c2a01a63bce140ca0` | `857161e1a7f38cfd1bf8172252af1c7d1122c7cc9cea98a3dac1823fb634bfd6` | Number ADRs in .artifacts/adrs/. |
| `CONTEXT-FORMAT.md` | `17ab16ce783e4d2801ee52fd9acdf550cbf44de65ae76797a93943bbedf22a13` | `306431e422e142ce4c15de6738092d7a04d0ed5a4aa34c11bb5a432132c68a13` | Apply the term format only inside the vocabulary region. |
| `SKILL.md` | `327a2b50620e2fd70abc6893cd6965e76b20f8d0adb0dc2c8d5eb3845efb643e` | `a225f0a8ef9ac6cf00c588a7f7ba7cf1d57569f48ad8572b59fa664eb5fb80eb` | Edit only the vocabulary region of .agents/context.md. Write ADRs under .artifacts/adrs/. Do not create CONTEXT.md or docs/adr/. |
| `agents/openai.yaml` | `f6bf2aa996c6e6f53fdd0708e18a0d16a56aed8322cca59fedbe3c0d2c75f06b` | `f6bf2aa996c6e6f53fdd0708e18a0d16a56aed8322cca59fedbe3c0d2c75f06b` | unchanged |

## codebase-design

- Upstream path: `skills/engineering/codebase-design/`
- Local path: `.agents/skills/codebase-design/`

- Intentional additions: none.
- Intentional removals: none.

| File | Upstream SHA-256 | Local SHA-256 | Adaptation |
| --- | --- | --- | --- |
| `DEEPENING.md` | `f3dd099ce99289bd213914d8ee3e2429b78309c3957ca4583f7659551b1d53c1` | `f3dd099ce99289bd213914d8ee3e2429b78309c3957ca4583f7659551b1d53c1` | unchanged |
| `DESIGN-IT-TWICE.md` | `8e740bf98446dbd4dfdc132ac4346d9a7eedaf93de6a495889171cf7f99f16bd` | `2fcc4fd52ecdfa947c212b2bea6970594b7fc31bae85152b40bfc0aec9965fb1` | Point domain language at the vocabulary region of .agents/context.md. |
| `SKILL.md` | `2c20617f87ec8af6a434859f381b2f061a69b530444e74eb39e78bb016a6d1e2` | `2c20617f87ec8af6a434859f381b2f061a69b530444e74eb39e78bb016a6d1e2` | unchanged |
| `agents/openai.yaml` | `edebc9e4fcfe102114012575eaa9600b9b5fd08c311664f389c36e7bc717740f` | `edebc9e4fcfe102114012575eaa9600b9b5fd08c311664f389c36e7bc717740f` | unchanged |

## research

- Upstream path: `skills/engineering/research/`
- Local path: `.agents/skills/research/`

- Intentional additions: none.
- Intentional removals: none.

| File | Upstream SHA-256 | Local SHA-256 | Adaptation |
| --- | --- | --- | --- |
| `SKILL.md` | `985569f15739c713d6784887c3d186d4ef9ac85bec5ad9c068d25bf0739928e4` | `817ea4811b681bb62796a0c3c7ac5bf9d6b6f74a99c1c81e5fd140c4ddb2b8f6` | Save notes under .artifacts/research/. Say when research was not delegated. |
| `agents/openai.yaml` | `9b4c470d63221c1f68f22df70b83e2f12401b317babe0d1b7b5f24a974474d0d` | `9b4c470d63221c1f68f22df70b83e2f12401b317babe0d1b7b5f24a974474d0d` | unchanged |

## grilling

- Upstream path: `skills/productivity/grilling/`
- Local path: `.agents/skills/grilling/`

- Intentional additions: none.
- Intentional removals: none.

| File | Upstream SHA-256 | Local SHA-256 | Adaptation |
| --- | --- | --- | --- |
| `SKILL.md` | `10ff989e7498b23b5acb49d5048f11dcd906757d2f79c5cdf8a00001381296f2` | `496a39e26190a05419fa046ca74ade106ffb1c50d1cf1bd9e04e8fa3b9362090` | If a sub-agent cannot be dispatched, look the fact up directly and say so. |
| `agents/openai.yaml` | `1411d7df7d99b7e621a1ff8283c8133cc2464be63d064e52d8ce169c6800ee9b` | `1411d7df7d99b7e621a1ff8283c8133cc2464be63d064e52d8ce169c6800ee9b` | unchanged |

## writing-for-agents

- Upstream path: `skills/productivity/writing-for-agents/`
- Local path: `.agents/skills/writing-for-agents/`

- Intentional additions: none.
- Intentional removals: none.

| File | Upstream SHA-256 | Local SHA-256 | Adaptation |
| --- | --- | --- | --- |
| `SKILL-MECHANICS.md` | `c768e6307c7c10728c401c213f2c4ba71c542127eeb7ad2956aabd15a0fa0059` | `c768e6307c7c10728c401c213f2c4ba71c542127eeb7ad2956aabd15a0fa0059` | unchanged |
| `SKILL.md` | `551adca942227b44192edba88acd4e8db911f0121ce58ad16944ccf6a896a74a` | `551adca942227b44192edba88acd4e8db911f0121ce58ad16944ccf6a896a74a` | unchanged |
| `agents/openai.yaml` | `eacb24b2a618cfb81dacb0416f4fdd75ddf3a8060f8ddb99aae1b1e301907e4b` | `eacb24b2a618cfb81dacb0416f4fdd75ddf3a8060f8ddb99aae1b1e301907e4b` | unchanged |
