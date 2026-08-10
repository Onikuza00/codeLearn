# SDD Phases — Detailed Specification

## Purpose

Define the complete set of SDD phases with objectives, artifacts, dependencies, concrete examples applied to codeLearn, and a mapping to the 13 real-world phases of Pau's company. This spec governs the content of `docs/sdd/fases.md`.

## Requirements

### Requirement: Complete Phase Listing

The documentation MUST include all 9 SDD phases in execution order: `sdd-init`, `sdd-explore`, `sdd-propose`, `sdd-spec`, `sdd-design`, `sdd-tasks`, `sdd-apply`, `sdd-verify`, `sdd-archive`. Each phase MUST have a unique objective stated in one sentence.

#### Scenario: User reads the full phase list

- GIVEN a developer opens `docs/sdd/fases.md`
- WHEN they scan the phase list
- THEN they see all 9 phases in sequential order
- AND each phase has a one-sentence objective

#### Scenario: Phase order matches index.md summary

- GIVEN `docs/sdd/index.md` shows a summary table
- WHEN a user compares the summary with `fases.md`
- THEN the phase order and names are consistent between both pages

---

### Requirement: Per-Phase Detail Structure

Each phase section MUST include: (1) name and objective, (2) artifact produced, (3) estimated duration, (4) who executes it (orchestrator delegates to sub-agent), (5) a concrete example applied to codeLearn, (6) dependencies (what must be ready before).

#### Scenario: Phase section has all required fields

- GIVEN a reader opens any phase section in `fases.md`
- WHEN they look for the structured fields
- THEN they find: objective, artifact, duration, executor, example, dependencies

#### Scenario: CodeLearn example is concrete and relatable

- GIVEN the example for `sdd-propose`
- WHEN a reader checks the example
- THEN it references a real codeLearn scenario (e.g., "Crear documentación de fases SDD")
- AND the example matches the proposal.md that already exists in the repo

#### Scenario: Dependencies are explicit

- GIVEN the `sdd-apply` phase section
- WHEN a reader checks dependencies
- THEN it lists `sdd-tasks` as a prerequisite
- AND explains that tasks must be complete before applying

---

### Requirement: Dependency Diagram (DAG)

The documentation MUST include a Mermaid.js diagram showing the directed acyclic graph of phase dependencies. The diagram MUST reflect the linear flow with `sdd-init` as a one-time setup and the main cycle from `explore` through `archive`.

#### Scenario: Mermaid diagram renders in MkDocs Material

- GIVEN `mkdocs.yml` has `pymdownx.superfences` enabled
- WHEN the Mermaid block is rendered
- THEN the diagram displays correctly in the built site

#### Scenario: DAG shows all phase transitions

- GIVEN the diagram
- WHEN a reader traces the arrows
- THEN they see: init → explore → propose → spec → design → tasks → apply → verify → archive
- AND `init` is marked as one-time / setup

---

### Requirement: Company Phases Mapping

The documentation MUST include a table mapping each SDD phase to the corresponding phase(s) in Pau's company 13-phase workflow (PRD → Deploy). The mapping MUST be labeled as "v1" to indicate it may be refined as Pau provides more details about his company's process.

#### Scenario: Mapping table is present and labeled

- GIVEN a reader opens the mapping section
- WHEN they see the table
- THEN it has columns: SDD Phase, Company Phase(es), Notes
- AND the section is labeled as "v1" or "mapeo preliminar"

#### Scenario: SDD phases map to realistic company phases

- GIVEN the mapping
- WHEN `sdd-propose` is listed
- THEN it maps to company phases like "PRD", "Definición de requisitos", or equivalent
- AND `sdd-apply` maps to "Desarrollo" / "Implementation"
- AND `sdd-verify` maps to "QA" / "Testing"
- AND `sdd-archive` maps to "Deploy" / "Release"

---

### Requirement: Additional Resources Section

The documentation MUST include a resources section with links to: gentle-ai GitHub repository, Engram documentation, OpenSpec documentation, and a reference to the custom company skill (if applicable).

#### Scenario: Resources section has all required links

- GIVEN a reader scrolls to the end of `fases.md`
- WHEN they check the resources section
- THEN they find links to gentle-ai, Engram, and OpenSpec
- AND each link is a valid URL or reference

---

### Requirement: MkDocs Material Compatibility

The document MUST use MkDocs Material-compatible syntax: admonitions (`!!! note`, `!!! tip`), Mermaid code blocks (````mermaid`), and proper heading hierarchy. The document MUST NOT use inline CSS or embedded `<style>` tags.

#### Scenario: Admonitions render correctly

- GIVEN the document uses `!!! note` and `!!! tip` blocks
- WHEN MkDocs builds the site
- THEN the admonitions display with proper styling

#### Scenario: No inline CSS violations

- GIVEN the global best practices rule against inline CSS
- WHEN reviewing `fases.md`
- THEN there are no `style=""` attributes or `<style>` blocks
- EXCEPT if a demo is explicitly marked as a learning demo per the CSS exception rule
