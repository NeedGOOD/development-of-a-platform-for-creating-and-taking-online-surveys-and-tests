export const FORM_MODE = {
  TEST: 'TEST',
  SURVEY: 'SURVEY',
};

export const FORM_STATUS = {
  DRAFT: 'DRAFT',
  PUBLISHED: 'PUBLISHED',
  ARCHIVED: 'ARCHIVED',
};

export const ATTEMPT_STATUS = {
  IN_PROGRESS: 'IN_PROGRESS',
  SUBMITTED: 'SUBMITTED',
};

export const QUESTION_TYPE = {
  SINGLE_CHOICE: 'SINGLE_CHOICE',
  MULTIPLE_CHOICE: 'MULTIPLE_CHOICE',
  TEXT: 'TEXT',
  RATING: 'RATING',
};

export const USER_ROLE = {
  ADMIN: 'ADMIN',
  CREATOR: 'CREATOR',
  PARTICIPANT: 'PARTICIPANT',
};

const STORAGE_KEY = 'sl_testdata_v1';
const AUTH_COOKIE_NAME = 'jwt';
const AUTH_USER_ID_KEY = 'sl_auth_user_id';

function nowIso() {
  return new Date().toISOString();
}

function clone(value) {
  if (typeof structuredClone === 'function') return structuredClone(value);
  return JSON.parse(JSON.stringify(value));
}

function safeJsonParse(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function getStorage() {
  if (typeof window === 'undefined') return null;

  try {
    const storage = window.localStorage;
    const key = '__sl_test__';
    storage.setItem(key, '1');
    storage.removeItem(key);
    return storage;
  } catch {
    return null;
  }
}

function randomToken() {
  try {
    if (typeof crypto?.randomUUID === 'function') return crypto.randomUUID();
    if (typeof crypto?.getRandomValues === 'function') {
      const bytes = new Uint8Array(16);
      crypto.getRandomValues(bytes);
      return Array.from(bytes)
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
    }
  } catch {
    // ignore
  }

  return `${Math.random().toString(16).slice(2)}${Date.now().toString(16)}`;
}

function getCookie(name) {
  if (typeof document === 'undefined') return null;

  const pattern = `(?:^|; )${encodeURIComponent(name)}=([^;]*)`;
  const match = document.cookie.match(new RegExp(pattern));
  return match ? decodeURIComponent(match[1]) : null;
}

function setCookie(name, value, { maxAgeSeconds } = {}) {
  if (typeof document === 'undefined') return;

  let cookie = `${encodeURIComponent(name)}=${encodeURIComponent(String(value))}; Path=/; SameSite=Lax`;
  if (typeof maxAgeSeconds === 'number') cookie += `; Max-Age=${Math.floor(maxAgeSeconds)}`;
  document.cookie = cookie;
}

function deleteCookie(name) {
  setCookie(name, '', { maxAgeSeconds: 0 });
}

function getAuthUserId() {
  const storage = getStorage();
  if (!storage) return null;
  return storage.getItem(AUTH_USER_ID_KEY);
}

function setAuthUserId(userId) {
  const storage = getStorage();
  if (!storage) return;

  try {
    storage.setItem(AUTH_USER_ID_KEY, String(userId));
  } catch {
    // ignore
  }
}

function clearAuthUserId() {
  const storage = getStorage();
  if (!storage) return;

  try {
    storage.removeItem(AUTH_USER_ID_KEY);
  } catch {
    // ignore
  }
}

function stripUser(user) {
  if (!user) return null;
  // eslint-disable-next-line no-unused-vars
  const { password, ...safe } = user;
  return safe;
}

const DEFAULT_DB = {
  meta: {
    version: 2,
    nextUserId: 4,
    nextFormId: 6,
    nextAttemptId: 104,
  },
  users: [
    {
      id: 1,
      name: 'Викладач',
      email: 'teacher@demo.com',
      password: 'demo1234',
      role: USER_ROLE.CREATOR,
    },
    {
      id: 2,
      name: 'Студент',
      email: 'student@demo.com',
      password: 'demo1234',
      role: USER_ROLE.PARTICIPANT,
    },
    {
      id: 3,
      name: 'Admin',
      email: 'admin@demo.com',
      password: 'demo1234',
      role: USER_ROLE.ADMIN,
    },
  ],
  forms: [
    {
      id: 1,
      ownerId: 1,
      title: 'JavaScript Basics',
      description: 'Тест на базові знання JavaScript.',
      mode: FORM_MODE.TEST,
      status: FORM_STATUS.PUBLISHED,
      accessCode: 'JS-101',
      cover: { hue: 45 },
      createdAt: '2026-04-20T09:10:00',
      updatedAt: '2026-04-22T11:00:00',
      questions: [
        {
          id: 'q-js-1',
          type: QUESTION_TYPE.SINGLE_CHOICE,
          title: 'Що поверне typeof null?',
          options: [
            { id: 'a', label: 'null' },
            { id: 'b', label: 'object' },
            { id: 'c', label: 'undefined' },
            { id: 'd', label: 'number' },
          ],
          correctOptionId: 'b',
        },
        {
          id: 'q-js-2',
          type: QUESTION_TYPE.SINGLE_CHOICE,
          title: 'Який метод додає елемент у кінець масиву?',
          options: [
            { id: 'a', label: 'push' },
            { id: 'b', label: 'pop' },
            { id: 'c', label: 'shift' },
            { id: 'd', label: 'unshift' },
          ],
          correctOptionId: 'a',
        },
        {
          id: 'q-js-3',
          type: QUESTION_TYPE.MULTIPLE_CHOICE,
          title: 'Які значення є falsy?',
          options: [
            { id: 'a', label: '0' },
            { id: 'b', label: '[]' },
            { id: 'c', label: "''" },
            { id: 'd', label: 'false' },
          ],
          correctOptionIds: ['a', 'c', 'd'],
        },
      ],
    },
    {
      id: 2,
      ownerId: 1,
      title: 'Feedback Survey',
      description: 'Коротке опитування для збору відгуків.',
      mode: FORM_MODE.SURVEY,
      status: FORM_STATUS.PUBLISHED,
      accessCode: 'FB-001',
      cover: { hue: 150 },
      createdAt: '2026-04-19T12:00:00',
      updatedAt: '2026-04-23T09:35:00',
      questions: [
        {
          id: 'q-fb-1',
          type: QUESTION_TYPE.RATING,
          title: 'Оцініть зручність інтерфейсу (1–5)',
          min: 1,
          max: 5,
        },
        {
          id: 'q-fb-2',
          type: QUESTION_TYPE.TEXT,
          title: 'Що можна покращити?',
          placeholder: 'Ваші пропозиції…',
        },
      ],
    },
    {
      id: 3,
      ownerId: 1,
      title: 'React Fundamentals',
      description: 'Перевірка знань React компонентів, props та state.',
      mode: FORM_MODE.TEST,
      status: FORM_STATUS.PUBLISHED,
      accessCode: 'REACT-01',
      cover: { hue: 210 },
      createdAt: '2026-04-18T08:00:00',
      updatedAt: '2026-04-24T10:15:00',
      questions: [
        {
          id: 'q-react-1',
          type: QUESTION_TYPE.SINGLE_CHOICE,
          title: 'Що повертає React component render?',
          options: [
            { id: 'a', label: 'HTML string' },
            { id: 'b', label: 'JSX / React elements' },
            { id: 'c', label: 'CSS' },
            { id: 'd', label: 'JSON' },
          ],
          correctOptionId: 'b',
        },
        {
          id: 'q-react-2',
          type: QUESTION_TYPE.SINGLE_CHOICE,
          title: 'Для чого useState?',
          options: [
            { id: 'a', label: 'Для керування станом у функц. компонентах' },
            { id: 'b', label: 'Для навігації' },
            { id: 'c', label: 'Для HTTP запитів' },
            { id: 'd', label: 'Для стилів' },
          ],
          correctOptionId: 'a',
        },
      ],
    },
    {
      id: 4,
      ownerId: 1,
      title: 'HTML & CSS Draft',
      description: 'Чернетка тесту по HTML та CSS.',
      mode: FORM_MODE.TEST,
      status: FORM_STATUS.DRAFT,
      accessCode: null,
      cover: { hue: 30 },
      createdAt: '2026-04-21T16:00:00',
      updatedAt: '2026-04-21T16:00:00',
      questions: [],
    },
    {
      id: 5,
      ownerId: 1,
      title: 'Student Survey Draft',
      description: 'Чернетка опитування для студентів.',
      mode: FORM_MODE.SURVEY,
      status: FORM_STATUS.DRAFT,
      accessCode: null,
      cover: { hue: 280 },
      createdAt: '2026-04-22T08:00:00',
      updatedAt: '2026-04-22T08:00:00',
      questions: [],
    },
  ],
  attempts: [
    {
      id: 101,
      formId: 1,
      userId: 2,
      status: ATTEMPT_STATUS.SUBMITTED,
      startedAt: '2026-04-25T12:30:00',
      submittedAt: '2026-04-25T12:36:00',
      answers: {
        'q-js-1': 'b',
        'q-js-2': 'a',
        'q-js-3': ['a', 'c', 'd'],
      },
      score: 3,
      maxScore: 3,
    },
    {
      id: 102,
      formId: 2,
      userId: 2,
      status: ATTEMPT_STATUS.IN_PROGRESS,
      startedAt: '2026-04-25T14:10:00',
      submittedAt: null,
      answers: {
        'q-fb-1': 4,
      },
      score: null,
      maxScore: null,
    },
    {
      id: 103,
      formId: 3,
      userId: 2,
      status: ATTEMPT_STATUS.SUBMITTED,
      startedAt: '2026-04-24T18:45:00',
      submittedAt: '2026-04-24T19:08:00',
      answers: {
        'q-react-1': 'b',
        'q-react-2': 'a',
      },
      score: 2,
      maxScore: 2,
    },
  ],
};

let inMemoryDb = null;

function persistDb(db) {
  const storage = getStorage();
  if (!storage) return;

  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(db));
  } catch {
    // ignore write failures
  }
}

function seedDb() {
  const seeded = clone(DEFAULT_DB);
  inMemoryDb = seeded;
  persistDb(seeded);
  return seeded;
}

function loadDb() {
  if (inMemoryDb) return inMemoryDb;

  const storage = getStorage();
  const raw = storage ? storage.getItem(STORAGE_KEY) : null;
  const parsed = raw ? safeJsonParse(raw) : null;

  if (parsed?.meta?.version === DEFAULT_DB.meta.version) {
    inMemoryDb = parsed;
    return parsed;
  }

  return seedDb();
}

function withDb(mutator) {
  const db = loadDb();
  const result = mutator(db);
  persistDb(db);
  return result;
}

function normalizeText(value) {
  return String(value || '').trim().toLowerCase();
}

function eqId(a, b) {
  return String(a) === String(b);
}

function makeAccessCode(form) {
  const prefix = form.mode === FORM_MODE.TEST ? 'TEST' : 'SURVEY';
  return `${prefix}-${String(form.id).padStart(3, '0')}`;
}

function computeScore(form, answers) {
  if (!form || form.mode !== FORM_MODE.TEST) return { score: null, maxScore: null };

  const questions = Array.isArray(form.questions) ? form.questions : [];
  const scoredQuestions = questions.filter((q) => q.type !== QUESTION_TYPE.TEXT && q.type !== QUESTION_TYPE.RATING);

  let score = 0;

  for (const q of scoredQuestions) {
    const value = answers ? answers[q.id] : undefined;

    if (q.type === QUESTION_TYPE.SINGLE_CHOICE) {
      if (value != null && String(value) === String(q.correctOptionId)) score += 1;
    }

    if (q.type === QUESTION_TYPE.MULTIPLE_CHOICE) {
      const correct = Array.isArray(q.correctOptionIds) ? q.correctOptionIds.map(String).sort() : [];
      const got = Array.isArray(value) ? value.map(String).sort() : [];
      if (correct.length && correct.join('|') === got.join('|')) score += 1;
    }
  }

  return { score, maxScore: scoredQuestions.length };
}

function enrichAttempt(attempt, formsById) {
  const form = formsById.get(String(attempt.formId));
  return {
    ...attempt,
    formTitle: form?.title ?? 'Unknown form',
    formMode: form?.mode ?? FORM_MODE.SURVEY,
  };
}

export function resetTestData() {
  const storage = getStorage();
  if (storage) {
    try {
      storage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }

  return seedDb();
}

export function getDbSnapshot() {
  return clone(loadDb());
}

export function getAuthToken() {
  return getCookie(AUTH_COOKIE_NAME);
}

export function isAuthenticated() {
  return Boolean(getCookie(AUTH_COOKIE_NAME) && getAuthUserId());
}

export function logout() {
  deleteCookie(AUTH_COOKIE_NAME);
  clearAuthUserId();
  return true;
}

export function loginWithPassword({ email, password } = {}) {
  const e = normalizeText(email);
  const p = String(password || '');

  if (!e || !p) throw new Error('Email and password are required');

  return withDb((db) => {
    const user = (db.users || []).find(
      (u) => normalizeText(u.email) === e && String(u.password || '') === p
    );

    if (!user) throw new Error('Invalid email or password');

    const token = randomToken();
    setCookie(AUTH_COOKIE_NAME, token, { maxAgeSeconds: 60 * 60 * 24 * 7 });
    setAuthUserId(user.id);

    return clone(stripUser(user));
  });
}

export function getCurrentUser() {
  const db = loadDb();

  const userId = getAuthUserId();
  const user = userId
    ? (db.users || []).find((u) => eqId(u.id, userId))
    : null;

  return clone(stripUser(user || db.users?.[0] || null));
}

export function updateUser(userId, patch) {
  return withDb((db) => {
    const user = (db.users || []).find((u) => eqId(u.id, userId));
    if (!user) throw new Error('User not found');

    const nextPatch = clone(patch || {});
    delete nextPatch.id;
    delete nextPatch.password;

    Object.assign(user, nextPatch);
    return clone(stripUser(user));
  });
}

export function updateCurrentUser(patch) {
  const userId = getAuthUserId();
  if (!userId) throw new Error('Not authenticated');
  return updateUser(userId, patch);
}

export function listForms(filters = {}) {
  const { q, status, mode, ownerId } = filters;
  const search = normalizeText(q);

  const db = loadDb();
  let forms = Array.isArray(db.forms) ? db.forms : [];

  if (ownerId != null) {
    forms = forms.filter((form) => eqId(form.ownerId, ownerId));
  }

  if (status) {
    forms = forms.filter((form) => form.status === status);
  }

  if (mode) {
    forms = forms.filter((form) => form.mode === mode);
  }

  if (search) {
    forms = forms.filter((form) =>
      `${form.title} ${form.description || ''} ${form.accessCode || ''}`
        .toLowerCase()
        .includes(search)
    );
  }

  return clone(forms);
}

export function getFormById(formId) {
  const db = loadDb();
  const form = (db.forms || []).find((item) => eqId(item.id, formId));
  return form ? clone(form) : null;
}

export function getFormByAccessCode(accessCode) {
  const code = normalizeText(accessCode);
  if (!code) return null;

  const db = loadDb();
  const form = (db.forms || []).find((item) => {
    if (item.status !== FORM_STATUS.PUBLISHED) return false;
    return normalizeText(item.accessCode) === code;
  });

  return form ? clone(form) : null;
}

export function createForm(input) {
  return withDb((db) => {
    const ownerId = input?.ownerId ?? db.users?.[0]?.id ?? 1;
    const mode = input?.mode || FORM_MODE.SURVEY;
    const title = input?.title || (mode === FORM_MODE.TEST ? 'New Test' : 'New Survey');
    const description = input?.description ?? 'New draft form.';
    const coverHue = Number.isFinite(input?.coverHue) ? input.coverHue : Math.floor(Math.random() * 360);

    const form = {
      id: db.meta.nextFormId++,
      ownerId,
      title,
      description,
      mode,
      status: FORM_STATUS.DRAFT,
      accessCode: null,
      cover: { hue: coverHue },
      createdAt: nowIso(),
      updatedAt: nowIso(),
      questions: [],
    };

    db.forms.unshift(form);
    return clone(form);
  });
}

export function updateForm(formId, patch) {
  return withDb((db) => {
    const form = (db.forms || []).find((item) => eqId(item.id, formId));
    if (!form) throw new Error('Form not found');

    const next = {
      ...form,
      ...clone(patch || {}),
      id: form.id,
      ownerId: form.ownerId,
      updatedAt: nowIso(),
    };

    const index = db.forms.findIndex((item) => eqId(item.id, formId));
    db.forms[index] = next;

    return clone(next);
  });
}

export function publishForm(formId) {
  return withDb((db) => {
    const form = (db.forms || []).find((item) => eqId(item.id, formId));
    if (!form) throw new Error('Form not found');

    form.status = FORM_STATUS.PUBLISHED;
    form.accessCode = form.accessCode || makeAccessCode(form);
    form.updatedAt = nowIso();

    return clone(form);
  });
}

export function archiveForm(formId) {
  return withDb((db) => {
    const form = (db.forms || []).find((item) => eqId(item.id, formId));
    if (!form) throw new Error('Form not found');

    form.status = FORM_STATUS.ARCHIVED;
    form.updatedAt = nowIso();

    return clone(form);
  });
}

export function listAttempts(filters = {}) {
  const { userId, formId, status } = filters;

  const db = loadDb();
  let attempts = Array.isArray(db.attempts) ? db.attempts : [];

  if (userId != null) attempts = attempts.filter((a) => eqId(a.userId, userId));
  if (formId != null) attempts = attempts.filter((a) => eqId(a.formId, formId));
  if (status) attempts = attempts.filter((a) => a.status === status);

  const formsById = new Map((db.forms || []).map((form) => [String(form.id), form]));
  return clone(attempts.map((attempt) => enrichAttempt(attempt, formsById)));
}

export function getAttemptById(attemptId) {
  const db = loadDb();
  const attempt = (db.attempts || []).find((item) => eqId(item.id, attemptId));
  if (!attempt) return null;

  const formsById = new Map((db.forms || []).map((form) => [String(form.id), form]));
  return clone(enrichAttempt(attempt, formsById));
}

export function startAttempt({ formId, userId } = {}) {
  return withDb((db) => {
    const form = (db.forms || []).find((item) => eqId(item.id, formId));
    if (!form) throw new Error('Form not found');

    const uid = userId ?? db.users?.[0]?.id ?? 1;

    const existing = (db.attempts || []).find(
      (attempt) =>
        eqId(attempt.formId, formId) &&
        eqId(attempt.userId, uid) &&
        attempt.status === ATTEMPT_STATUS.IN_PROGRESS
    );

    const formsById = new Map((db.forms || []).map((f) => [String(f.id), f]));
    if (existing) return clone(enrichAttempt(existing, formsById));

    const attempt = {
      id: db.meta.nextAttemptId++,
      formId: form.id,
      userId: uid,
      status: ATTEMPT_STATUS.IN_PROGRESS,
      startedAt: nowIso(),
      submittedAt: null,
      answers: {},
      score: null,
      maxScore: null,
    };

    db.attempts.unshift(attempt);

    return clone(enrichAttempt(attempt, formsById));
  });
}

export function saveAttemptAnswer({ attemptId, questionId, value } = {}) {
  return withDb((db) => {
    const attempt = (db.attempts || []).find((item) => eqId(item.id, attemptId));
    if (!attempt) throw new Error('Attempt not found');
    if (attempt.status !== ATTEMPT_STATUS.IN_PROGRESS) throw new Error('Attempt is not in progress');

    attempt.answers = attempt.answers || {};
    attempt.answers[String(questionId)] = value;

    return clone(attempt);
  });
}

export function submitAttempt(attemptId) {
  return withDb((db) => {
    const attempt = (db.attempts || []).find((item) => eqId(item.id, attemptId));
    if (!attempt) throw new Error('Attempt not found');

    const form = (db.forms || []).find((item) => eqId(item.id, attempt.formId));
    if (!form) throw new Error('Form not found');

    const { score, maxScore } = computeScore(form, attempt.answers || {});

    attempt.status = ATTEMPT_STATUS.SUBMITTED;
    attempt.submittedAt = nowIso();
    attempt.score = score;
    attempt.maxScore = maxScore;

    const formsById = new Map((db.forms || []).map((f) => [String(f.id), f]));
    return clone(enrichAttempt(attempt, formsById));
  });
}

export function getFormAnalytics(formId) {
  const db = loadDb();
  const form = (db.forms || []).find((item) => eqId(item.id, formId));
  if (!form) return null;

  const attempts = (db.attempts || []).filter((a) => eqId(a.formId, formId));
  const submitted = attempts.filter((a) => a.status === ATTEMPT_STATUS.SUBMITTED);
  const inProgress = attempts.filter((a) => a.status === ATTEMPT_STATUS.IN_PROGRESS);

  const analytics = {
    formId: form.id,
    totalAttempts: attempts.length,
    submittedAttempts: submitted.length,
    inProgressAttempts: inProgress.length,
    averageScore: null,
    maxScore: null,
  };

  if (form.mode === FORM_MODE.TEST) {
    const scores = submitted
      .map((a) => (typeof a.score === 'number' ? a.score : null))
      .filter((v) => v != null);

    if (scores.length) {
      analytics.averageScore = scores.reduce((sum, v) => sum + v, 0) / scores.length;
    }

    analytics.maxScore = submitted.find((a) => typeof a.maxScore === 'number')?.maxScore ?? null;
  }

  return clone(analytics);
}

export function runTestDataDemo() {
  const user = getCurrentUser();
  const published = listForms({ status: FORM_STATUS.PUBLISHED });
  const mine = listForms({ ownerId: user.id });
  const attempts = listAttempts({ userId: user.id });

  return {
    user,
    publishedCount: published.length,
    mineCount: mine.length,
    attemptsCount: attempts.length,
    demoCodes: published.map((f) => f.accessCode).filter(Boolean).slice(0, 5),
  };
}
