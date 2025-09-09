# To Do List Fullstack App

- Backend: Node.js + Express + TypeScript
- Frontend: Vanilla TypeScript + ES6+ (bundled by Webpack)
- Package manager: Yarn
- Lint: ESLint

## Cấu trúc thư mục

todo-app/
├── backend/         # Source code backend (Node.js + Express + TypeScript)
│   ├── src/
│   │   └── index.ts # Entry point backend
│   ├── package.json
│   ├── tsconfig.json
│   └── .eslintrc.json
├── frontend/        # Source code frontend (Vanilla TypeScript + Webpack)
│   ├── src/
│   │   └── index.ts # Entry point frontend
│   ├── public/
│   │   └── index.html # Trang HTML chính
│   ├── package.json
│   ├── tsconfig.json
│   ├── webpack.config.js
│   └── .eslintrc.json
├── package.json     # Quản lý workspace Yarn
├── .gitignore
└── README.md

