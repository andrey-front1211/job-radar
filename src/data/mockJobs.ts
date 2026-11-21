import type { Job, Level, Salary, WorkFormat } from '../types';

/**
 * Демо-набор вакансий.
 *
 * Зачем он нужен:
 *  1) приложение остаётся работоспособным, если публичное API недоступно
 *     (или если его блокирует CORS/офлайн-окружение);
 *  2) на нём строятся юнит-тесты — они не должны зависеть от сети.
 *
 * Даты считаются относительно момента загрузки модуля, чтобы демо
 * всегда выглядело «свежим». В реальном API даты приходят настоящие.
 */
const now = Date.now();
const day = 24 * 60 * 60 * 1000;
const daysAgo = (n: number): string => new Date(now - n * day).toISOString();

const salary = (
  from: number | null,
  to: number | null,
  currency: Salary['currency'],
  period: Salary['period'] = 'month',
): Salary => ({ from, to, currency, period });

interface RawJob {
  title: string;
  company: string;
  location: string;
  workFormat: WorkFormat;
  level: Level;
  salary: Salary | null;
  stack?: string[];
  daysAgo: number;
  description: string;
}

const raw: RawJob[] = [
  {
    title: 'Junior Frontend Developer (React)',
    company: 'Hireway',
    location: 'Удалённо, РФ',
    workFormat: 'remote',
    level: 'junior',
    salary: salary(60000, 90000, 'RUB'),
    stack: ['React', 'TypeScript', 'REST API', 'Git', 'Figma'],
    daysAgo: 1,
    description:
      'Разработка и поддержка пользовательских интерфейсов веб-приложений, верстка адаптивных страниц по макетам Figma, интеграция с REST API. Работа с существующим кодом и участие в тестировании функциональности. В команде есть middle и senior разработчики, код проходит ревью.',
  },
  {
    title: 'Frontend Developer (React / TypeScript)',
    company: 'Nordwind Soft',
    location: 'Удалённо, РФ',
    workFormat: 'remote',
    level: 'junior',
    salary: salary(80000, 120000, 'RUB'),
    stack: ['React', 'TypeScript', 'Redux Toolkit', 'Vite', 'Jest'],
    daysAgo: 2,
    description:
      'Продуктовая команда ищет фронтендера на внутренний дашборд аналитики. Стек: React 18, TypeScript, Redux Toolkit, Vite. Ожидаем понимание жизненного цикла компонентов, умение писать тесты и работать с чужим кодом.',
  },
  {
    title: 'Frontend Developer (Next.js)',
    company: 'Vector Digital',
    location: 'Москва, гибрид',
    workFormat: 'hybrid',
    level: 'middle',
    salary: salary(150000, 220000, 'RUB'),
    stack: ['Next.js', 'React', 'TypeScript', 'Tailwind', 'SSR'],
    daysAgo: 3,
    description:
      'Разработка клиентской части маркетплейса на Next.js 14: SSR/ISR, оптимизация Core Web Vitals, интеграция с GraphQL и REST. Нужен опыт с серверным рендерингом и понимание SEO-требований.',
  },
  {
    title: 'Junior Python Developer (Django)',
    company: 'Aurora Labs',
    location: 'Удалённо, РФ',
    workFormat: 'remote',
    level: 'junior',
    salary: salary(70000, 100000, 'RUB'),
    stack: ['Python', 'Django', 'PostgreSQL', 'DRF', 'Docker'],
    daysAgo: 4,
    description:
      'Разработка REST API на Django REST Framework, работа с PostgreSQL и миграциями, написание тестов на pytest. Проект — B2B-платформа для логистики. Ожидаем понимание SOLID и базовых паттернов.',
  },
  {
    title: 'Python Backend Engineer',
    company: 'Zenith Systems',
    location: 'Удалённо, РФ',
    workFormat: 'remote',
    level: 'middle',
    salary: salary(180000, 260000, 'RUB'),
    stack: ['Python', 'FastAPI', 'PostgreSQL', 'Redis', 'Celery', 'Kubernetes'],
    daysAgo: 5,
    description:
      'Проектирование микросервисов на FastAPI, асинхронные обработчики, очереди на Celery и Redis. Деплой в Kubernetes. Нужен опыт с высоконагруженными API и понимание профилирования.',
  },
  {
    title: 'Frontend Developer (Vue 3)',
    company: 'Pixel Forge',
    location: 'Удалённо, ЕС',
    workFormat: 'remote',
    level: 'middle',
    salary: salary(3000, 4500, 'EUR'),
    daysAgo: 6,
    description:
      'Клиентская часть SaaS для финансового планирования: Vue 3, Composition API, Pinia, Vite. Много работы с таблицами, графиками и реактивностью. Английский B2 для работы в распределённой команде.',
  },
  {
    title: 'Senior Frontend Engineer',
    company: 'Kite Capital',
    location: 'Варшава, гибрид',
    workFormat: 'hybrid',
    level: 'senior',
    salary: salary(18000, 25000, 'PLN'),
    daysAgo: 7,
    description:
      'Архитектура фронтенда финтех-платформы, миграция с legacy на React + TypeScript, наставничество и код-ревью, дизайн-система на Storybook. Ожидается опыт от 5 лет и знание английского B2+.',
  },
  {
    title: 'Frontend Developer (React)',
    company: 'Bright Apps',
    location: 'Удалённо, РФ',
    workFormat: 'remote',
    level: 'middle',
    salary: salary(130000, 180000, 'RUB'),
    stack: ['React', 'TypeScript', 'Zustand', 'React Query', 'Storybook'],
    daysAgo: 8,
    description:
      'Разработка личного кабинета крупного сервиса: React, TypeScript, React Query для работы с API, Zustand для состояния. Важна аккуратность с типами и внимание к деталям вёрстки.',
  },
  {
    title: 'QA Automation Engineer (Playwright)',
    company: 'Clearcode',
    location: 'Удалённо, РФ',
    workFormat: 'remote',
    level: 'junior',
    salary: salary(90000, 130000, 'RUB'),
    stack: ['Playwright', 'TypeScript', 'CI/CD', 'GitHub Actions'],
    daysAgo: 9,
    description:
      'Построение и поддержка e2e-тестов на Playwright + TypeScript, интеграция в пайплайны GitHub Actions, анализ падений. Тесная работа с фронтенд-командой, участие в ревью тестов.',
  },
  {
    title: 'Fullstack Developer (React + Node.js)',
    company: 'Nomad Studio',
    location: 'Удалённо, ЕС',
    workFormat: 'remote',
    level: 'middle',
    salary: salary(4000, 5500, 'USD'),
    daysAgo: 10,
    description:
      'Разработка MVP для стартапов: React на клиенте, NestJS/Node.js на сервере, PostgreSQL. Часто меняющиеся требования, быстрые итерации, прямая коммуникация с заказчиком на английском.',
  },
  {
    title: 'Frontend Developer (TypeScript)',
    company: 'Lumen Health',
    location: 'Удалённо, РФ',
    workFormat: 'remote',
    level: 'middle',
    salary: salary(160000, 210000, 'RUB'),
    stack: ['React', 'TypeScript', 'Redux Toolkit', 'Vitest', 'Docker'],
    daysAgo: 11,
    description:
      'Медицинская платформа: интерфейсы для врачей, сложные формы, валидация, работа с большими таблицами данных. Высокие требования к доступности (a11y) и покрытию тестами.',
  },
  {
    title: 'Junior React Developer (стажировка)',
    company: 'Codeleaf',
    location: 'Санкт-Петербург, офис',
    workFormat: 'office',
    level: 'junior',
    salary: salary(45000, 60000, 'RUB'),
    stack: ['React', 'JavaScript', 'HTML5', 'CSS3', 'Git'],
    daysAgo: 12,
    description:
      'Стажировка с наставником: вёрстка, простая логика на JavaScript, задачи под ревью. Первые три месяца — испытательный срок с постепенным ростом. Подходит выпускникам курсов с портфолио.',
  },
  {
    title: 'Frontend Developer (Angular)',
    company: 'Translogic',
    location: 'Москва, офис',
    workFormat: 'office',
    level: 'middle',
    salary: salary(170000, 230000, 'RUB'),
    stack: ['Angular', 'RxJS', 'TypeScript', 'SCSS'],
    daysAgo: 13,
    description:
      'Корпоративная система для транспортной компании: Angular 16+, RxJS, сложные формы и таблицы. Требуется опыт работы с энтерпрайз-приложениями и понимание реактивного программирования.',
  },
  {
    title: 'Backend Developer (Python / Django)',
    company: 'Squarely',
    location: 'Удалённо, ЕС',
    workFormat: 'remote',
    level: 'junior',
    salary: salary(6000, 9000, 'PLN'),
    daysAgo: 14,
    description:
      'Python, Django, Django REST Framework, PostgreSQL, Docker, работа с платежными интеграциями. Молодая команда, много свободы и быстрый темп. Английский B2, польский не требуется.',
  },
  {
    title: 'Senior Python Engineer',
    company: 'Nimbus Data',
    location: 'Удалённо, РФ',
    workFormat: 'remote',
    level: 'senior',
    salary: salary(280000, 380000, 'RUB'),
    stack: ['Python', 'FastAPI', 'Kafka', 'ClickHouse', 'Docker', 'Kubernetes'],
    daysAgo: 15,
    description:
      'Разработка платформы потоковой аналитики: FastAPI, Kafka, ClickHouse. Ответственность за архитектуру сервисов, наставничество, участие в планировании и декомпозиции задач.',
  },
  {
    title: 'Frontend Developer (React Native)',
    company: 'Pocket Labs',
    location: 'Удалённо, РФ',
    workFormat: 'remote',
    level: 'middle',
    salary: salary(180000, 240000, 'RUB'),
    stack: ['React Native', 'TypeScript', 'Redux', 'REST API'],
    daysAgo: 16,
    description:
      'Мобильное приложение сервиса доставки: React Native + TypeScript, навигация, пуш-уведомления, работа с камерой и геолокацией. Нужен опыт публикации в App Store и Google Play.',
  },
  {
    title: 'Junior QA Engineer (manual)',
    company: 'Riverbank Software',
    location: 'Удалённо, РФ',
    workFormat: 'remote',
    level: 'junior',
    salary: salary(60000, 80000, 'RUB'),
    stack: ['Postman', 'SQL', 'Jira', 'TestRail'],
    daysAgo: 17,
    description:
      'Ручное тестирование веб-приложения: тест-кейсы, регрессионное тестирование, баг-репорты в Jira, проверка API через Postman. Возможность роста в автоматизацию на Python.',
  },
  {
    title: 'Frontend Engineer (Design Systems)',
    company: 'Oddity',
    location: 'Удалённо, ЕС',
    workFormat: 'remote',
    level: 'middle',
    salary: salary(4500, 6000, 'EUR'),
    daysAgo: 18,
    description:
      'Разработка и поддержка дизайн-системы: React, TypeScript, Storybook, документация компонентов, темизация. Тесная работа с дизайнерами, внимание к деталям и доступности.',
  },
  {
    title: 'Python Developer (Data)',
    company: 'Grata Analytics',
    location: 'Удалённо, РФ',
    workFormat: 'remote',
    level: 'middle',
    salary: salary(170000, 240000, 'RUB'),
    stack: ['Python', 'Pandas', 'Airflow', 'PostgreSQL', 'Docker'],
    daysAgo: 19,
    description:
      'ETL-пайплайны для аналитики: Python, Pandas, Airflow, PostgreSQL. Много SQL, работа с большими выгрузками и оптимизация запросов. Ожидается внимательность к данным и умение проверять результат.',
  },
  {
    title: 'Junior Frontend Developer',
    company: 'Тайгер Софт',
    location: 'Ульяновск, офис',
    workFormat: 'office',
    level: 'junior',
    salary: salary(50000, 70000, 'RUB'),
    stack: ['React', 'JavaScript', 'CSS3', 'Git'],
    daysAgo: 20,
    description:
      'Локальная продуктовая команда: интерфейсы для внутренних сервисов. Вёрстка, интеграция с REST API, исправление багов. Готовы взять джуна с живым портфолио и обучить на месте.',
  },
  {
    title: 'Frontend Developer (React) — Automation',
    company: 'Insight Insurance',
    location: 'Тель-Авив, офис',
    workFormat: 'office',
    level: 'junior',
    salary: null,
    stack: ['React', 'TypeScript', 'Playwright', 'REST API'],
    daysAgo: 21,
    description:
      'Разработка клиентских фич и автотестов для аналитического веб-приложения. Стек: React, TypeScript, e2e-тесты. Активно используются AI-ассистенты разработки; приветствуется умение работать с ними осознанно.',
  },
  {
    title: 'Senior Fullstack Developer (Node/React)',
    company: 'Hyperion',
    location: 'Удалённо, ЕС',
    workFormat: 'remote',
    level: 'senior',
    salary: salary(6500, 9000, 'USD'),
    daysAgo: 22,
    description:
      'Продукт для B2B SaaS: Node.js, TypeScript, React, PostgreSQL, AWS. Проектирование архитектуры, ревью, менторство. Требуется опыт от 5 лет и свободный английский.',
  },
  {
    title: 'Frontend Developer (Vue + Electron)',
    company: 'Sentinel Software',
    location: 'Бристоль, офис',
    workFormat: 'office',
    level: 'junior',
    salary: salary(3960, 5080, 'GBP'),
    stack: ['Vue', 'Electron', 'Python', 'GitLab CI/CD'],
    daysAgo: 23,
    description:
      'Десктопное приложение для защищённой среды: Vue, Electron, Python-бэкенд, инфраструктура на Ansible и Terraform. Обязательное требование — наличие допуска к секретным материалам.',
  },
  {
    title: 'WordPress / Frontend Developer',
    company: 'Brandmauer',
    location: 'Удалённо, РФ',
    workFormat: 'remote',
    level: 'junior',
    salary: salary(70000, 110000, 'RUB'),
    stack: ['WordPress', 'PHP', 'JavaScript', 'CSS3', 'Figma'],
    daysAgo: 24,
    description:
      'Корпоративные сайты и лендинги: вёрстка по макетам, доработка тем WordPress, интеграция форм и API. Подходит тем, кто хочет получить много практики на вёрстке.',
  },
  {
    title: 'Frontend Developer (React) — FinTech',
    company: 'Meridian Pay',
    location: 'Удалённо, РФ',
    workFormat: 'remote',
    level: 'middle',
    salary: salary(200000, 280000, 'RUB'),
    stack: ['React', 'TypeScript', 'Redux Toolkit', 'React Query', 'Vitest'],
    daysAgo: 25,
    description:
      'Платежный кабинет: React, TypeScript, интеграция с платёжными провайдерами, работа с безопасностью и валидацией. Высокие требования к качеству кода и покрытию тестами.',
  },
  {
    title: 'Intern Python Developer',
    company: 'DataForge',
    location: 'Удалённо, РФ',
    workFormat: 'remote',
    level: 'junior',
    salary: salary(35000, 50000, 'RUB'),
    stack: ['Python', 'Django', 'SQL', 'Git'],
    daysAgo: 26,
    description:
      'Стажировка на 3 месяца с наставником: задачи по Django, написание простых скриптов и SQL-запросов под руководством. По итогам — переход на позицию junior.',
  },
];

export const mockJobs: Job[] = raw.map((job, index) => ({
  id: `demo-${index + 1}`,
  title: job.title,
  company: job.company,
  location: job.location,
  workFormat: job.workFormat,
  level: job.level,
  salary: job.salary,
  stack: job.stack ?? [],
  postedAt: daysAgo(job.daysAgo),
  description: job.description,
  source: 'demo',
}));
