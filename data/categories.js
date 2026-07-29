// ------------------------------------------------------------------
// Single source of truth for the fest structure.
// Change class groupings or event names ONLY here — the registration
// form, validation, admin dashboard and exports all read from this file.
// ------------------------------------------------------------------

export const CATEGORIES = [
  {
    id: "kids",
    label: "കിഡീസ്",
    classRangeLabel: "ക്ലാസ് 1, 2",
    classes: ["1", "2"],
    stage: [
      { key: "stage_song", name: "സ്റ്റേജ് ഗാനം" },
      { key: "speech", name: "പ്രസംഗം" },
      { key: "group_song", name: "ഗ്രൂപ്പ്‌ സോങ്" },
    ],
    off: [
      { key: "coloring", name: "കളറിങ്" },
      { key: "chocolate_collection", name: "ചോക്ലേറ്റ് കളക്ഷൻ" },
      { key: "musical_chair", name: "മ്യൂസിക് ചെയർ" },
    ],
  },
  {
    id: "sub_junior",
    label: "സബ് ജൂനിയർ",
    classRangeLabel: "ക്ലാസ് 3, 4",
    classes: ["3", "4"],
    stage: [
      { key: "stage_song", name: "സ്റ്റേജ് ഗാനം" },
      { key: "speech", name: "പ്രസംഗം" },
      { key: "group_song", name: "ഗ്രൂപ്പ്‌ സോങ്" },
      { key: "storytelling", name: "കഥാ കഥനം" },
    ],
    off: [
      { key: "memory_test", name: "മെമ്മറി ടെസ്റ്റ്‌" },
      { key: "handwriting_arabic", name: "കയ്യെഴുത്ത് (അറബി)" },
      { key: "drawing", name: "ചിത്ര രചന" },
    ],
  },
  {
    id: "junior",
    label: "ജൂനിയർ",
    classRangeLabel: "ക്ലാസ് 5, 6",
    classes: ["5", "6"],
    stage: [
      { key: "stage_song", name: "സ്റ്റേജ് ഗാനം" },
      { key: "speech", name: "പ്രസംഗം" },
      { key: "group_song", name: "ഗ്രൂപ്പ്‌ സോങ്" },
      { key: "malappattu", name: "മാലപ്പാട്ട്", girlsOnly: true },
      { key: "english_speech", name: "ഇംഗ്ലീഷ് പ്രസംഗം" },
    ],
    off: [
      { key: "quiz", name: "ക്വിസ്" },
      { key: "drawing", name: "ചിത്ര രചന" },
      { key: "handwriting", name: "കയ്യെഴുത്ത്" },
    ],
  },
  {
    id: "senior",
    label: "സീനിയർ",
    classRangeLabel: "ക്ലാസ് 7, 8, 9",
    classes: ["7", "8", "9"],
    stage: [
      { key: "stage_song", name: "സ്റ്റേജ് ഗാനം" },
      { key: "speech", name: "പ്രസംഗം" },
      { key: "group_song", name: "ഗ്രൂപ്പ്‌ സോങ്" },
      { key: "malappattu", name: "മാലപ്പാട്ട്", girlsOnly: true },
    ],
    off: [
      { key: "quiz", name: "ക്വിസ്" },
      { key: "calligraphy", name: "കാലിഗ്രഫി" },
      { key: "essay", name: "പ്രബന്ധം" },
      { key: "poster_making", name: "പോസ്റ്റർ മേക്കിങ്" },
    ],
  },
  {
    id: "super_senior",
    label: "സൂപ്പർ സീനിയർ",
    classRangeLabel: "ക്ലാസ് 10, +1, +2",
    classes: ["10", "+1", "+2"],
    stage: [
      { key: "stage_song", name: "സ്റ്റേജ് ഗാനം" },
      { key: "speech", name: "പ്രസംഗം" },
      { key: "group_song", name: "ഗ്രൂപ്പ്‌ സോങ്" },
      { key: "burda", name: "ബുർദ", girlsOnly: true },
      { key: "malappattu", name: "മാലപ്പാട്ട്", girlsOnly: true },
    ],
    off: [
      { key: "quiz", name: "ക്വിസ്" },
      { key: "calligraphy", name: "കാലിഗ്രഫി" },
      { key: "essay", name: "പ്രബന്ധം" },
      { key: "poster_making", name: "പോസ്റ്റർ മേക്കിങ്" },
    ],
  },
];

// Flat list of every selectable class, in display order, tagged with its category id
export const ALL_CLASSES = CATEGORIES.flatMap((cat) =>
  cat.classes.map((c) => ({ value: c, categoryId: cat.id }))
);

export function getCategoryByClass(classValue) {
  return CATEGORIES.find((cat) => cat.classes.includes(classValue)) || null;
}

export function getCategoryById(id) {
  return CATEGORIES.find((cat) => cat.id === id) || null;
}

// Given a category + gender ("male" | "female"), return the events a student may pick from
export function getAvailableEvents(categoryId, gender) {
  const cat = getCategoryById(categoryId);
  if (!cat) return { stage: [], off: [] };
  const filterFn = (ev) => !ev.girlsOnly || gender === "female";
  return {
    stage: cat.stage.filter(filterFn),
    off: cat.off.filter(filterFn),
  };
}

// Max number of off-stage items a single student may register for (kept generous but bounded
// so one child doesn't accidentally register for everything, and so scheduling stays sane)
export const MAX_OFF_STAGE_SELECTIONS = 2;
