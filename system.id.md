# Dokumentasi Teknis Prototype MLPA

**Terakhir Diperbarui:** 22 Desember 2025  
**Versi Arsitektur:** Pasca Modularisasi Fase 6

---

## 1. Gambaran Proyek

Prototype **MLPA (Multi-Level Profiling Assessment)** adalah alat berbasis web untuk manajemen skala psikometrik. Alat ini memungkinkan pengguna mengunggah data CSV, memvisualisasikan skala psikometrik, menjalankan asesmen, serta mengedit/mengadaptasi skala menggunakan antarmuka alur berbasis node dengan pelacakan rubrik semantik.

**Target Pengguna:** Psikometris dan peneliti.  
**Fokus Utama:** Arsitektur modular, UI bersih, pengeditan alur responsif, pengeditan item berbasis contenteditable, dan visualisasi rubrik semantik.

---

## 2. Tumpukan Teknologi

- **Inti:** Vanilla JavaScript (ES6+), HTML5, CSS3
- **Framework:** Tidak ada (arsitektur zero-dependency)
- **Integrasi Eksternal:** OpenAI API (diabstraksikan di `api.js`)
- **Format Data:** CSV (Input), JSON (State Internal)
- **Arsitektur:** Modular, dengan kontrak dan invarian yang eksplisit

---

## 3. Struktur Proyek (Pasca Modularisasi)

```
mlpa-beta-prototype/
├── adapters/                   # Fase 1 - Input/output data
│   ├── csvIngest.js           # Parsing CSV (pure functions)
│   └── openAiScale.js         # Template prompt GPT & validasi
├── controllers/                # Fase 4-5 - Orkestrasi
│   ├── flowController.js      # Orkestrasi operasi alur
│   ├── flowEditorController.js # Orkestrasi branching/delete
│   └── previewController.js   # Orkestrasi preview/kuesioner
├── layout/                     # Fase 1 - Matematika layout murni
│   ├── branchPositioning.js   # Penempatan cabang simetris
│   └── connectionGeometry.js  # Perhitungan path Bezier
├── logic/                      # Fase 2-3 - Logika domain
│   ├── scaleAssembler.js      # Perakitan objek scale
│   ├── scaleGraph.js          # Traversal graph (10 fungsi)
│   └── scaleTransform.js      # Transformasi data (5 fungsi)
├── services/                   # Fase 2 - API eksternal
│   └── gptScaleService.js     # Wrapper OpenAI API
├── state/                      # Fase 2, 5, 6 - Manajemen state
│   ├── canvasStateOps.js      # Mutasi state level rendah
│   ├── scaleStore.js          # Store scale terpusat
│   └── stateManager.js        # Kontrak state & dokumentasi
├── ui/                         # Fase 4 - Rendering
│   └── renderer/
│       ├── flowBoxRenderer.js # Pembuatan HTML FlowBox
│       ├── connectionRenderer.js # Rendering SVG koneksi
│       └── previewRenderer.js # Pembaruan UI kuesioner
├── utils/                      # Fase 6 - Infrastruktur
│   └── invariants.js          # Guard runtime khusus DEV
├── assets/                     # Gambar
├── app.js                      # Koordinator tipis (~2100 baris)
├── api.js                      # Lapisan abstraksi OpenAI
├── config.js                   # Konfigurasi (API keys)
├── index.html                  # Struktur HTML utama
├── styles.css                  # Styling global
├── test-data.csv              # Data psikometrik tiruan
└── system.md                   # Dokumentasi teknis (file ini)
```

---

## 4. Arsitektur Inti

### 4.1 Organisasi Modul

Codebase mengikuti **arsitektur berlapis** yang ketat:

```
┌─────────────────────────────────────────────────────────────┐
│                      app.js (coordinator)                   │
│                    ↓ delegates to ↓                         │
├──────────────┬───────────────────┬──────────────────────────┤
│ Controllers  │  ScaleStore       │  Renderers               │
│ (orchestrate)│  (centralized)    │  (dumb DOM)              │
├──────────────┴───────────────────┴──────────────────────────┤
│                    Logic Modules                            │
│         (scaleGraph, scaleTransform, branchPositioning)     │
├─────────────────────────────────────────────────────────────┤
│                    Invariants (DEV guards)                  │
└─────────────────────────────────────────────────────────────┘
```

**Aturan Arah Dependensi:**
- ✅ UI → Controller → Logic/State → Renderer → DOM
- ❌ Logic → UI
- ❌ Renderer → Mutasi state
- ❌ Layout → DOM

### 4.2 Manajemen State

**Objek State Utama** (di `app.js`):

```javascript
const state = {
  // UI State
  currentScreen: 1,
  sidebarCollapsed: false,
  previewMode: false,
  appActive: false,
  
  // Preview State
  items: [],              // Item yang sudah diratakan untuk kuesioner
  answers: {},            // Respons pengguna
  selectedScaleId: null,  // Scale yang sedang dipilih
  currentItemIndex: 0,
  isCompleted: false,
  
  // Canvas State
  canvasState: {
    scales: Map<string, Scale>,  // Data graph inti (dikelola oleh ScaleStore)
    connections: [],             // Garis bezier visual
    pan: { x: 0, y: 0 },        // Offset viewport canvas
    activeScaleId: null,
    branchingFromScaleId: null,
    isBranchingInProgress: false
  }
};
```

**Mutasi State:**
- **Level rendah:** `state/canvasStateOps.js` (14 helper)
- **Level tinggi:** `state/scaleStore.js` (terpusat, dengan validasi)

### 4.3 Kontrak Data (FROZEN)

**Objek Scale:**
```javascript
{
  scale_id: string,           // Pengenal unik
  scale_name: string,         // Nama tampilan
  parent_scale_id: string | null,
  is_root: boolean,
  expanded: boolean,          // UI state
  depth: number,              // Kedalaman generasi
  branch_index: number,       // Indeks sibling
  position: { x: number, y: number },
  positionLocked: boolean,    // Mencegah reposisi otomatis
  dimensions: Dimension[]
}
```

**Objek Dimension:**
```javascript
{
  name: string,               // Label dimensi
  items: Item[]
}
```

**Objek Item:**
```javascript
{
  item_id: string,
  origin_item_id: string,     // Tautan ke item asli
  text: string,               // Konten item
  baseline_rubric: string[],  // Trait rubrik asli
  current_rubric: string[]    // Trait hasil ekstraksi GPT
}
```

**Antarmuka FlatItem** (untuk preview):
```javascript
{
  ...Item,
  dimension: string           // Nama dimensi yang terlampir
}
```

---

## 5. Modul Kunci

### 5.1 Modul Logic (Pure Functions)

#### `logic/scaleGraph.js`
**Tanggung Jawab:** Traversal graph dan query relasi.  
**Fungsi:** 10 pure functions
- `buildScaleTree(scales)` → struktur tree
- `getChildren(scales, parentId)` → anak langsung
- `getDescendants(scales, rootId)` → seluruh turunan
- `buildCascadeDeleteSet(scales, targetId)` → himpunan cascade
- `findRoots(scales)`, `isRoot(scale)`, `getRootScale(scales)`
- `getSiblings(scales, scaleId)`, `getParent(scales, scaleId)`

**Invarian:**
- TANPA akses DOM
- TANPA mutasi state
- Input Map `scales` tidak pernah diubah
- Output deterministik

#### `logic/scaleTransform.js`
**Tanggung Jawab:** Transformasi data.  
**Fungsi:** 5 pure functions
- `flattenScaleItems(scale)` → `FlatItem[]`
- `countScaleItems(scale)` → number
- `getDimensionNames(scale)` → `string[]`
- `findItemInScale(scale, itemId)` → `{item, dimensionName} | null`
- `updateItemText(scale, itemId, newText)` → Scale baru

#### `layout/branchPositioning.js`
**Tanggung Jawab:** Perhitungan posisi deterministik.  
**Fungsi Kunci:** `getNextBranchPosition(parentScale, branch_index)`

**Algoritma Layout:**
```
branch_index 0: y = parent.y - 204  (atas)
branch_index 1: y = parent.y + 204  (bawah)
branch_index 2: y = parent.y - 408  (lebih ke atas)
branch_index 3: y = parent.y + 408  (lebih ke bawah)
```

**Invarian:**
- Posisi diturunkan HANYA dari `branch_index`
- TANPA baca DOM, TANPA scanning sibling
- Layout bergantian simetris
- `LAYOUT_CONSTANTS` bersifat frozen

### 5.2 Manajemen State

#### `state/scaleStore.js`
**Tanggung Jawab:** Mutasi scale terpusat.  
**Fungsi Kunci:**
- `init(canvasState)` — Inisialisasi store
- `addScale(scale)` — Dengan validasi
- `removeScalesCascade(scaleIds)` — Penghapusan atomik
- `getScale(id)`, `getAllScales()`, `hasScale(id)`

**Future Hooks yang Ditandai:**
```javascript
// future: hook undo snapshot here
// future: hook persistence here
// future: hook minimap update here
```

#### `utils/invariants.js`
**Tanggung Jawab:** Guard runtime khusus DEV.  
**Fungsi Kunci:**
- `validateScale(scale)` — Memastikan `scale_id`, `scale_name`, `dimensions[]`, `position`
- `validateBranchedScale(scale)` — Memastikan `parent_scale_id`, `branch_index >= 0`, `positionLocked`
- `assert(condition, message)` — Throw jika kondisi false

**Flag DEV:** Set `const DEV = false;` untuk produksi.

### 5.3 Controllers (Orkestrasi)

#### `controllers/flowEditorController.js`
**Tanggung Jawab:** Orkestrasi branching dan delete.  
**Fungsi Kunci:**
- `prepareDelete(scaleId, scales)` → validasi + himpunan cascade
- `executeDelete(toDelete, scales, canvasState, renderFn)` → mutasi + render
- `prepareBranch(sourceScaleId, scales, isBranchingInProgress)` → validasi
- `assembleBranchScale(gptResult, sourceScale, scales, expandRubricsFn)` → scale baru

#### `controllers/previewController.js`
**Tanggung Jawab:** Orkestrasi preview/kuesioner.  
**Fungsi Kunci:**
- `selectScale(scaleId, scales)` → flatten item
- `handleScaleSelection(scaleId, scales, state)` → alur lengkap
- `goToNextItem(currentIndex, totalItems)`, `goToPrevItem(currentIndex)`
- `checkCompletion(answers, totalItems)`, `calculateScore(answers, totalItems)`

### 5.4 Renderers (Dumb DOM)

#### `ui/renderer/flowBoxRenderer.js`
**Tanggung Jawab:** Pembuatan HTML FlowBox.  
**Fungsi:**
- `createFlowBoxHtml(scale)` → HTML flowbox lengkap
- `createDimensionHtml(dimension, index, startItemIndex, scale)`
- `createItemHtml(item, itemIndex, scale)`
- `createRubricPopupHtml(item)`
- `getIntegrityClass(item, scale)` → `'integrity-stable' | 'integrity-mismatch'`

**Invarian:**
- TANPA keputusan logika
- TANPA mutasi state
- Menerima data, mengembalikan string HTML

---

## 6. Alur Data

### 6.1 Alur Upload File
```
Pengguna mengunggah CSV
  ↓
CSVIngest.parseCSV(text) → item ter-parse
  ↓
OpenAI API: structureCSV(items) → dimensi
  ↓
ScaleAssembler.assembleNewScale() → objek Scale
  ↓
ScaleStore.addScale(scale) → dengan validasi
  ↓
flowEditor.renderAll() → pembaruan DOM
```

### 6.2 Alur Branching
```
Pengguna klik tombol "Branch"
  ↓
FlowEditorController.prepareBranch() → validasi
  ↓
Pengguna memasukkan intent adaptasi
  ↓
GPTScaleService.adaptScale(scaleName, dimensions, intent) → hasil GPT
  ↓
FlowEditorController.assembleBranchScale() → scale baru dengan posisi
  ↓
ScaleStore.addScale(newScale) → validasi + future hooks
  ↓
flowEditor.renderAll() → pembaruan DOM
```

### 6.3 Alur Delete
```
Pengguna klik tombol delete
  ↓
FlowEditorController.prepareDelete(scaleId) → himpunan cascade
  ↓
Pengguna konfirmasi penghapusan
  ↓
FlowEditorController.executeDelete(toDelete) → mutasi ScaleStore
  ↓
flowEditor.renderAll() → pembaruan DOM
```

---

## 7. Sistem Rubrik

### 7.1 Pelacakan Rubrik Ganda
Setiap item memiliki DUA array rubrik:
- **baseline_rubric:** Rubrik asli dari scale induk
- **current_rubric:** Rubrik hasil ekstraksi GPT dari item yang diadaptasi

### 7.2 Indikator Integritas Visual
- **Outline hijau** (`integrity-stable`): baseline === current
- **Outline merah** (`integrity-mismatch`): baseline ≠ current
- **Tanpa outline:** Root scale (tanpa perbandingan)

### 7.3 Integrasi OpenAI
**Service:** `services/gptScaleService.js`  
**Adapters:** `adapters/openAiScale.js` (template prompt)

**Operasi GPT:**
1. **structureCSV:** Item CSV mentah → dimensi terstruktur
2. **adaptScale:** Adaptasi scale untuk target audiens (Gen-Z, Boomer, dll.)

**Format Prompt GPT (adaptScale):**
```
You are adapting the scale "[scale_name]" for [adaptation_intent].

Extract these for each item:
- text: adapted item text
- current_rubric: array of semantic traits
```

---

## 8. Arsitektur UI

### 8.1 Sistem Layar
Tiga layar utama:
1. **Layar 1:** Upload file / pemilihan data tiruan
2. **Layar 2:** Preview kuesioner
3. **Layar 3:** Editor alur (Tampilan Edit)

**Navigasi:** `showScreen(n)` men-toggle visibilitas menggunakan kelas CSS.

### 8.2 Fitur Flow Editor
- **Pan/Zoom:** Panning canvas dengan drag mouse
- **Pembuatan Node:** Branching membuat scale baru
- **Koneksi Visual:** Kurva SVG bezier antara parent-child
- **Inline Editing:** Teks item contenteditable (future)
- **Export:** Export CSV per-scale atau global

### 8.3 Mode Preview
- **Scale Selector:** Mini flowchart untuk memilih versi scale
- **Kuesioner:** Antarmuka skala Likert 5 poin
- **Pelacakan Progress:** Penghitung item, layar completion

---

## 9. Kontrak Modul

Semua modul kunci memiliki kontrak eksplisit yang mendefinisikan:
- **Responsibility:** Apa yang dilakukan modul
- **Inputs:** Apa yang diterima
- **Outputs:** Apa yang dikembalikan
- **Allowed side effects:** (misalnya mutasi state, DOM)
- **Forbidden responsibilities:** Apa yang TIDAK termasuk
- **Invariants:** Jaminan yang diberikan modul

**Contoh Template Kontrak:**
```javascript
/**
 * MODULE CONTRACT
 * ----------------
 * Responsibility: ...
 * Inputs: ...
 * Outputs: ...
 * Allowed side effects: ...
 * Forbidden responsibilities: ...
 * Invariants this module guarantees: ...
 */
```

---

## 10. Pedoman Pengembangan

### 10.1 Pemeriksaan Invarian
Gunakan guard khusus DEV dari `utils/invariants.js`:
```javascript
if (Invariants.DEV) {
  Invariants.validateScale(scale);
  Invariants.validateBranchedScale(scale);
}
```

### 10.2 Mutasi State
**Selalu gunakan ScaleStore untuk operasi scale:**
```javascript
// ✅ Benar
ScaleStore.addScale(scale);
ScaleStore.removeScalesCascade(toDelete);

// ❌ Salah (mutasi langsung)
state.canvasState.scales.set(id, scale);
```

### 10.3 Menambahkan Fitur Mendatang
**Hook sudah ditandai di ScaleStore:**
```javascript
// future: hook undo snapshot here
// future: hook persistence here
// future: hook minimap update here
```

Tambahkan implementasi pada lokasi yang sudah ditandai ini.

---

## 11. Pengujian & Verifikasi

### 11.1 Checklist Verifikasi Manual
- [ ] Aplikasi termuat dengan benar
- [ ] Flow box ter-render
- [ ] Koneksi ter-render
- [ ] Branching berfungsi (posisi simetris)
- [ ] Cascade delete berfungsi
- [ ] Preview kuesioner berfungsi
- [ ] Scale selector berfungsi
- [ ] Tidak ada error console
- [ ] Tidak ada perubahan visual setelah refactor

### 11.2 Data Tiruan
**Lokasi:** `app.js` (MOCK_ITEMS, baris 990-1280)  
**Konten:** 3 versi scale (Asli, Gen-Z, Boomer) dengan masing-masing 10 item

---

## 12. Keterbatasan yang Diketahui

1. **Ukuran app.js:** Masih ~2100 baris (berisi data tiruan, objek flowEditor, event binding)
2. **Tidak Ada Persistence:** State reset saat halaman di-reload
3. **Tidak Ada Undo/Redo:** Arsitektur sudah disiapkan tetapi belum diimplementasikan
4. **Inline Editing:** Implementasi parsial (mode edit ada, persistence belum lengkap)
5. **Tidak Ada Minimap:** Arsitektur sudah disiapkan tetapi belum diimplementasikan

---

## 13. Roadmap Ke Depan

### 13.1 Sistem yang Sudah Disiapkan (Stub Ditandai)
- **Undo/Redo:** Hook di ScaleStore
- **Persistence:** Hook LocalStorage/IndexedDB di ScaleStore
- **Minimap:** Hook overview canvas di ScaleStore
- **AI Agents:** Entrypoint mutasi via `ScaleStore.addScale`

### 13.2 Ekstraksi Potensial
- Data tiruan → `data/mockScales.js`
- Event binding → `ui/events/`
- Logika kuesioner → `controllers/questionnaireController.js`

---

## 14. Prinsip Arsitektur

1. **Surgical Modularization:** Ekstraksi tanpa mengubah perilaku
2. **Explicit Contracts:** Setiap modul menyatakan apa yang TIDAK termasuk
3. **Enforced Invariants:** State tidak valid terdeteksi lebih awal saat dev
4. **Centralized Mutations:** Satu sumber kebenaran untuk perubahan state
5. **Clear Directionality:** UI → Controller → Logic → State
6. **Future-Proofed:** Hook ditandai untuk fitur mendatang

---

**Akhir Dokumentasi**  
*Terakhir diperbarui: 22 Desember 2025*
